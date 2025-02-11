
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { ClassList } from "@/components/class/ClassList";
import { ClassDetailsView } from "@/components/class/ClassDetails";
import { useToast } from "@/components/ui/use-toast";

export interface ClassDetails {
  className: string;
  teacher: string;
  students: Student[];
}

const Class = () => {
  const { className } = useParams();
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // First fetch the class details
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('name', className)
          .single();

        if (classError && classError.code !== 'PGRST116') {
          throw classError;
        }

        // Then fetch students for this class
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('class', className);

        if (studentsError) throw studentsError;

        setSelectedClass({
          className: className || '',
          teacher: classData?.teacher || 'Unassigned',
          students: studentsData || []
        });
      } catch (error) {
        console.error('Error fetching class details:', error);
        toast({
          title: "Error",
          description: "Failed to load class details. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (className) {
      fetchClassDetails();
    }
  }, [className, toast]);

  return className && selectedClass ? (
    <ClassDetailsView classDetails={selectedClass} />
  ) : null;
};

export default Class;
