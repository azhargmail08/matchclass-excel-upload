
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudentTableProps {
  students: Student[];
}

export const StudentTable = ({ students }: StudentTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudents, setEditingStudents] = useState<{ [key: string]: Student }>({});
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
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student information",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search Student"
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="border rounded-lg px-4 py-2">
          <option>Sort A-Z</option>
          <option>Sort Z-A</option>
        </select>
      </div>

      <div className="relative rounded-lg shadow border">
        <ScrollArea className="h-[600px]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Student Name</th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Name on Badges</th>
                  <th className="px-4 py-3 text-left min-w-[150px]">Special Name</th>
                  <th className="px-4 py-3 text-left min-w-[150px]">Matrix Number</th>
                  <th className="px-4 py-3 text-left min-w-[150px]">Date Joined</th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Father's Name</th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Mother's Name</th>
                  <th className="px-4 py-3 text-left min-w-[150px]">Contact No</th>
                  <th className="px-4 py-3 text-center min-w-[120px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter(student =>
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((student, index) => (
                    <tr key={student._id} className="border-t">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.nickname || student.nickname || ''}
                          onChange={(e) => handleInputChange(student._id, 'nickname', e.target.value)}
                          maxLength={14}
                          placeholder="Name On Badges"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editingStudents[student._id]?.special_name || student.special_name || ''}
                          onChange={(e) => handleInputChange(student._id, 'special_name', e.target.value)}
                          placeholder="Special Name"
                        />
                      </td>
                      <td className="px-4 py-3">{student.matrix_number || '-'}</td>
                      <td className="px-4 py-3">{student.date_joined || '-'}</td>
                      <td className="px-4 py-3">{student.father_name || '-'}</td>
                      <td className="px-4 py-3">{student.mother_name || '-'}</td>
                      <td className="px-4 py-3">{student.contact_no || '-'}</td>
                      <td className="px-4 py-3">
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
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
