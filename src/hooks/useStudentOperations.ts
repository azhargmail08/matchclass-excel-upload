
import { useState } from "react";
import { Student } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStudentOperations = (onRefresh?: () => void) => {
  const [editingStudents, setEditingStudents] = useState<{ [key: string]: Student }>({});
  const { toast } = useToast();

  const handleInputChange = (studentId: string, field: keyof Student, value: string) => {
    setEditingStudents(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {} as Student),
        [field]: value
      }
    }));
  };

  const handleUpdate = async (studentId: string, currentStudent: Student) => {
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

  return {
    editingStudents,
    handleInputChange,
    handleUpdate
  };
};
