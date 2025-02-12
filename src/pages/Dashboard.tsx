
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClassList } from "@/components/class/ClassList";
import { useState, useEffect } from "react";
import { Student } from "@/types";
import { ClassDetails } from "@/pages/Class";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const { toast } = useToast();

  const fetchClasses = async () => {
    try {
      // Fetch all classes first
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');

      if (classesError) throw classesError;

      // Then fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('internal_database')
        .select('*');

      if (studentsError) throw studentsError;

      // Create a map of classes with their students
      const classMap = new Map<string, ClassDetails>();

      // First, add all classes from the classes table
      classesData?.forEach(classItem => {
        classMap.set(classItem.name, {
          className: classItem.name,
          teacher: classItem.teacher || 'Unassigned',
          students: []
        });
      });

      // Add students to their respective classes
      studentsData?.forEach(student => {
        const classDetails = classMap.get(student.Class || '');
        if (classDetails) {
          classDetails.students.push({
            _id: student._id,
            name: student.Name,
            class: student.Class || '',
            nickname: student.Nickname,
            special_name: student["Special Name"],
            matrix_number: student["Matrix Number"],
            date_joined: student["Date Joined"],
            father_name: student.Father,
            father_id: student["Father ID"]?.toString(),
            father_email: student["Father Email"],
            mother_name: student.Mother,
            mother_id: student["Mother ID"]?.toString(),
            mother_email: student["Mother Email"],
            contact_no: student["Contact No"]?.toString()
          });
        }
      });

      setClasses(Array.from(classMap.values()));
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [toast]);

  return (
    <DashboardLayout onClassClick={() => {}}>
      <ClassList 
        classes={classes} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClassDeleted={fetchClasses}
      />
    </DashboardLayout>
  );
}
