
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
      .from('students')
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
      setStudents(data);
      const classes = Array.from(new Set(data.map(student => student.class))).sort();
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
