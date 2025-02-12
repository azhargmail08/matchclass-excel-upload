
import { useState, useEffect } from "react";
import { Student } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('internal_database')
      .select('*');
    
    if (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const formattedStudents = data.map(student => ({
        _id: student._id,
        name: student.Name,
        class: student.Class || '',
        nickname: student.Nickname || undefined,
        special_name: student["Special Name"] || undefined,
        matrix_number: student["Matrix Number"] || undefined,
        date_joined: student["Date Joined"] || undefined,
        father_name: student.Father || undefined,
        father_id: student["Father ID"]?.toString() || undefined,
        father_email: student["Father Email"] || undefined,
        mother_name: student.Mother || undefined,
        mother_id: student["Mother ID"]?.toString() || undefined,
        mother_email: student["Mother Email"] || undefined,
        contact_no: student["Contact No"]?.toString() || undefined,
      }));
      setStudents(formattedStudents);
      const classes = Array.from(new Set(formattedStudents.map(student => student.class))).sort();
      setUniqueClasses(classes);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    uniqueClasses,
    refreshStudents: fetchStudents,
  };
};
