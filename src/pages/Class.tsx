
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { ClassDetailsView } from "@/components/class/ClassDetails";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface ClassDetails {
  className: string;
  teacher: string;
  students: Student[];
}

const Class = () => {
  const { className } = useParams();
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchClassDetails = async () => {
    try {
      // First fetch the class details
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('name', className)
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        setNotFound(true);
        return;
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

  useEffect(() => {
    if (className) {
      fetchClassDetails();
    }
  }, [className, toast]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Alert>
            <AlertDescription>
              Class "{className}" was not found in the database.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return className && selectedClass ? (
    <ClassDetailsView 
      classDetails={selectedClass} 
      onRefresh={fetchClassDetails}
    />
  ) : null;
};

export default Class;
