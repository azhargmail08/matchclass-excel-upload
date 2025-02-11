
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClassList } from "@/components/class/ClassList";
import { useState, useEffect } from "react";
import { ClassDetails } from "@/pages/Class";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetch all classes first
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*');

        if (classesError) throw classesError;

        // Then fetch all students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
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

        // Then, add any classes that only exist in the students table
        studentsData?.forEach(student => {
          if (!classMap.has(student.class)) {
            classMap.set(student.class, {
              className: student.class,
              teacher: student.teacher || 'Unassigned',
              students: []
            });
          }
          
          // Add student to their class
          const classDetails = classMap.get(student.class);
          if (classDetails) {
            classDetails.students.push({
              _id: student._id,
              name: student.name,
              class: student.class,
              nickname: student.nickname
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

    fetchClasses();
  }, [toast]);

  return (
    <DashboardLayout onClassClick={() => {}}>
      <ClassList 
        classes={classes} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </DashboardLayout>
  );
}
