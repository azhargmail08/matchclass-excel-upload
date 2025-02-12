
import { Student } from "@/types";
import { useState } from "react";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudentTableHeader } from "./table/StudentTableHeader";
import { StudentTableRow } from "./table/StudentTableRow";
import { DeleteConfirmDialog } from "./table/DeleteConfirmDialog";

interface StudentTableProps {
  students: Student[];
  onRefresh?: () => void;
}

export const StudentTable = ({ students, onRefresh }: StudentTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudents, setEditingStudents] = useState<{ [key: string]: Student }>({});
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();

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
        .from('internal_database')
        .update({
          Name: updatedStudent.name,
          Class: updatedStudent.class,
          Nickname: updatedStudent.nickname,
          "Special Name": updatedStudent.special_name,
          "Matrix Number": updatedStudent.matrix_number,
          "Date Joined": updatedStudent.date_joined,
          Father: updatedStudent.father_name,
          "Father ID": updatedStudent.father_id,
          "Father Email": updatedStudent.father_email,
          Mother: updatedStudent.mother_name,
          "Mother ID": updatedStudent.mother_id,
          "Mother Email": updatedStudent.mother_email,
          "Contact No": updatedStudent.contact_no
        })
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

      const { data: batchData, error: batchError } = await supabase
        .from('data_sync_batches')
        .insert({
          user_id: session.session.user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Convert student to database format
      const studentData = {
        _id: student._id,
        Name: student.name,
        Class: student.class,
        Nickname: student.nickname,
        "Special Name": student.special_name,
        "Matrix Number": student.matrix_number,
        "Date Joined": student.date_joined,
        Father: student.father_name,
        "Father ID": student.father_id,
        "Father Email": student.father_email,
        Mother: student.mother_name,
        "Mother ID": student.mother_id,
        "Mother Email": student.mother_email,
        "Contact No": student.contact_no
      };

      const { error: deletionError } = await supabase
        .from('student_deletions')
        .insert({
          student_id: student._id,
          student_data: studentData,
          batch_id: batchData.id,
          user_id: session.session.user.id
        });

      if (deletionError) throw deletionError;

      const { error: syncRecordsError } = await supabase
        .from('data_sync_records')
        .delete()
        .eq('student_id', student._id);

      if (syncRecordsError) throw syncRecordsError;

      const { error: deleteError } = await supabase
        .from('internal_database')
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

      const { data: latestBatch, error: batchError } = await supabase
        .from('data_sync_batches')
        .select('id')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (batchError) throw batchError;

      const { data: deletions, error: deletionsError } = await supabase
        .from('student_deletions')
        .select('*')
        .eq('batch_id', latestBatch.id)
        .eq('status', 'pending');

      if (deletionsError) throw deletionsError;

      for (const deletion of (deletions || [])) {
        const studentData = deletion.student_data as any;
        const { error: restoreError } = await supabase
          .from('internal_database')
          .insert(studentData);

        if (restoreError) throw restoreError;

        await supabase
          .from('student_deletions')
          .update({ status: 'rolled_back' })
          .eq('id', deletion.id);
      }

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
      <StudentTableHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRollback={handleRollback}
      />

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
                    <StudentTableRow
                      key={student._id}
                      student={student}
                      index={index}
                      editingStudent={editingStudents[student._id]}
                      onInputChange={(field, value) => handleInputChange(student._id, field, value)}
                      onUpdate={() => handleUpdate(student._id)}
                      onDelete={() => setStudentToDelete(student)}
                    />
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto border-t">
          <div className="h-4 min-w-full"></div>
        </div>
      </div>

      <DeleteConfirmDialog
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
