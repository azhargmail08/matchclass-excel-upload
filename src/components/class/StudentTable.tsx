
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, Info, Trash2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StudentTableProps {
  students: Student[];
  onRefresh?: () => void;
}

export const StudentTable = ({ students, onRefresh }: StudentTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudents, setEditingStudents] = useState<{ [key: string]: Student }>({});
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleInputChange = (studentId: string, field: keyof Student, value: string) => {
    setEditingStudents(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || students.find(s => s._id === studentId)!),
        [field]: value
      }
    }));
  };

  const handleUpdate = async (studentId: string) => {
    try {
      const updatedStudent = editingStudents[studentId];
      const { error } = await supabase
        .from('students')
        .update(updatedStudent)
        .eq('_id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student information updated successfully",
      });

      setEditingStudents(prev => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student information",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (student: Student) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Error",
          description: "Please login to delete students",
          variant: "destructive",
        });
        return;
      }

      // Create a new batch
      const { data: batchData, error: batchError } = await supabase
        .from('data_sync_batches')
        .insert({
          user_id: session.session.user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Store the student data before deletion
      const { error: deletionError } = await supabase
        .from('student_deletions')
        .insert({
          student_id: student._id,
          student_data: student as unknown as Json,
          batch_id: batchData.id,
          user_id: session.session.user.id
        });

      if (deletionError) throw deletionError;

      // First, delete any related records in data_sync_records
      const { error: syncRecordsError } = await supabase
        .from('data_sync_records')
        .delete()
        .eq('student_id', student._id);

      if (syncRecordsError) throw syncRecordsError;

      // Then delete from students table
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('_id', student._id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
    setStudentToDelete(null);
  };

  const handleRollback = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      // Get the latest batch for this user
      const { data: latestBatch, error: batchError } = await supabase
        .from('data_sync_batches')
        .select('id')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (batchError) throw batchError;

      // Get deleted students from this batch
      const { data: deletions, error: deletionsError } = await supabase
        .from('student_deletions')
        .select('*')
        .eq('batch_id', latestBatch.id)
        .eq('status', 'pending');

      if (deletionsError) throw deletionsError;

      // Restore deleted students
      for (const deletion of (deletions || [])) {
        const studentData = deletion.student_data as Student;
        const { error: restoreError } = await supabase
          .from('students')
          .insert(studentData);

        if (restoreError) throw restoreError;

        // Update deletion status
        await supabase
          .from('student_deletions')
          .update({ status: 'rolled_back' })
          .eq('id', deletion.id);
      }

      // Update batch status
      await supabase
        .from('data_sync_batches')
        .update({ status: 'rolled_back' })
        .eq('id', latestBatch.id);

      toast({
        title: "Success",
        description: "Changes have been rolled back successfully",
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rolling back changes:', error);
      toast({
        title: "Error",
        description: "Failed to roll back changes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Input
          placeholder="Search Student"
          className="w-full sm:max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRollback}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Rollback Changes
          </Button>
          <select className="border rounded-lg px-4 py-2 w-full sm:w-auto">
            <option>Sort A-Z</option>
            <option>Sort Z-A</option>
          </select>
        </div>
      </div>

      <div className="relative rounded-lg shadow border bg-white flex flex-col">
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900">No.</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Student Name</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Name on Badges</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Special Name</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Matrix Number</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Date Joined</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Father's Name</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Mother's Name</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Contact No</th>
                <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900 min-w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <Info className="w-12 h-12 text-gray-400" />
                      <p className="text-lg font-medium">No Students</p>
                      <p className="text-sm">This class currently has no students.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students
                  .filter(student =>
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((student, index) => (
                    <tr key={student._id}>
                      <td className="whitespace-nowrap px-4 py-3">{index + 1}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.name || student.name}
                          onChange={(e) => handleInputChange(student._id, 'name', e.target.value)}
                          placeholder="Student Name"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.nickname || student.nickname || ''}
                          onChange={(e) => handleInputChange(student._id, 'nickname', e.target.value)}
                          maxLength={14}
                          placeholder="Name On Badges"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.special_name || student.special_name || ''}
                          onChange={(e) => handleInputChange(student._id, 'special_name', e.target.value)}
                          placeholder="Special Name"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.matrix_number || student.matrix_number || ''}
                          onChange={(e) => handleInputChange(student._id, 'matrix_number', e.target.value)}
                          placeholder="Matrix Number"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          type="date"
                          value={editingStudents[student._id]?.date_joined || student.date_joined || ''}
                          onChange={(e) => handleInputChange(student._id, 'date_joined', e.target.value)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.father_name || student.father_name || ''}
                          onChange={(e) => handleInputChange(student._id, 'father_name', e.target.value)}
                          placeholder="Father's Name"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.mother_name || student.mother_name || ''}
                          onChange={(e) => handleInputChange(student._id, 'mother_name', e.target.value)}
                          placeholder="Mother's Name"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.contact_no || student.contact_no || ''}
                          onChange={(e) => handleInputChange(student._id, 'contact_no', e.target.value)}
                          placeholder="Contact Number"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {editingStudents[student._id] && (
                            <Button
                              onClick={() => handleUpdate(student._id)}
                              className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4"
                            >
                              Update
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setStudentToDelete(student)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto border-t">
          <div className="h-4 min-w-full"></div>
        </div>
      </div>

      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove {studentToDelete?.name} from the class. You can use the rollback button to undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => studentToDelete && handleDelete(studentToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
