
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
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

      // Clear the editing state for this student
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

  const getEditableValue = (student: Student, field: keyof Student) => {
    return editingStudents[student._id]?.[field] ?? student[field];
  };

  const renderEditableField = (student: Student, field: keyof Student, label: string) => (
    <div>
      <span className="text-sm text-gray-500">{label}:</span>
      <Input
        value={getEditableValue(student, field)?.toString() || ''}
        onChange={(e) => handleInputChange(student._id, field, e.target.value)}
        className="mt-1"
      />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Students</h2>
        <Button variant="outline" className="gap-2">
          Transfer Selected Student(s)
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
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

        <div className="grid gap-4">
          {students
            .filter(student => 
              student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (student.matrix_number && student.matrix_number.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((student) => (
              <Card key={student._id} className="w-full">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      {renderEditableField(student, 'name', 'Name')}
                      {renderEditableField(student, 'nickname', 'Nickname')}
                      {renderEditableField(student, 'matrix_number', 'Matrix No.')}
                      {renderEditableField(student, 'contact_no', 'Contact No.')}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium mb-2">Father's Information</h4>
                      {renderEditableField(student, 'father_name', 'Name')}
                      {renderEditableField(student, 'father_id', 'ID')}
                      {renderEditableField(student, 'father_email', 'Email')}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium mb-2">Mother's Information</h4>
                      {renderEditableField(student, 'mother_name', 'Name')}
                      {renderEditableField(student, 'mother_id', 'ID')}
                      {renderEditableField(student, 'mother_email', 'Email')}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    {editingStudents[student._id] ? (
                      <Button 
                        onClick={() => handleUpdate(student._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save Changes
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
