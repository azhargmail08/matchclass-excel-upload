
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
        const { data, error } = await supabase
          .from('students')
          .select('*');

        if (error) {
          console.error('Error fetching classes:', error);
          toast({
            title: "Error",
            description: "Failed to load classes. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Group students by class and create ClassDetails objects
          const classGroups = data.reduce((acc: { [key: string]: ClassDetails }, student) => {
            if (!acc[student.class]) {
              acc[student.class] = {
                className: student.class,
                teacher: student.teacher || 'Unassigned',
                students: []
              };
            }
            acc[student.class].students.push({
              _id: student._id,
              name: student.name,
              class: student.class,
              nickname: student.nickname
            });
            return acc;
          }, {});

          setClasses(Object.values(classGroups));
        }
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
