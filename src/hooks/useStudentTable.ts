
import { useState, useEffect } from "react";
import { Student } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStudentTable = (students: Student[], onRefresh?: () => void) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudents, setEditingStudents] = useState<{ [key: string]: Student }>({});
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToTransfer, setStudentToTransfer] = useState<Student | null>(null);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('name')
          .order('name');

        if (error) throw error;

        const classNames = data.map(c => c.name);
        setAvailableClasses(classNames);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to load available classes",
          variant: "destructive",
        });
      }
    };

    fetchClasses();
  }, [toast]);

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

      const { error: transfersError } = await supabase
        .from('class_transfers')
        .delete()
        .eq('student_id', student._id);

      if (transfersError) throw transfersError;

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

  return {
    searchQuery,
    setSearchQuery,
    editingStudents,
    studentToDelete,
    setStudentToDelete,
    studentToTransfer,
    setStudentToTransfer,
    availableClasses,
    handleInputChange,
    handleUpdate,
    handleDelete
  };
};
