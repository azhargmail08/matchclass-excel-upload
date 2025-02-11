
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-6">
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

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3 text-left">No.</th>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-left">Name on Badges (Max 14 Letters)</th>
                <th className="px-4 py-3 text-left">Special Name</th>
                <th className="px-4 py-3 text-center">Action</th>
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
      </div>
    </div>
  );
};
