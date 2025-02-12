
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
      if (!updatedStudent) {
        throw new Error("No changes to update");
      }

      // First check if the record exists
      const { data: existingStudent, error: checkError } = await supabase
        .from('internal_database')
        .select()
        .eq('_id', studentId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (!existingStudent) {
        throw new Error("Student record not found");
      }

      // Then perform the update
      const { error: updateError } = await supabase
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

      if (updateError) throw updateError;

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
        description: error instanceof Error ? error.message : "Failed to update student information",
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
