
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { ClassDetailsView } from "@/components/class/ClassDetails";
import { useToast } from "@/hooks/use-toast";
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
      if (!className) return;

      const decodedClassName = decodeURIComponent(className);

      // First fetch the class details
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('name', decodedClassName)
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        setNotFound(true);
        return;
      }

      // Then fetch students for this class using properly encoded class name
      const { data: studentsData, error: studentsError } = await supabase
        .from('internal_database')
        .select('*')
        .eq('Class', decodedClassName);

      if (studentsError) throw studentsError;

      const formattedStudents = (studentsData || []).map(student => ({
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

      setSelectedClass({
        className: classData.name,
        teacher: classData?.teacher || 'Unassigned',
        students: formattedStudents
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

  // Initial fetch
  useEffect(() => {
    if (className) {
      fetchClassDetails();
    }
  }, [className]);

  // Refresh data when window regains focus
  useEffect(() => {
    const onFocus = () => {
      if (className) {
        fetchClassDetails();
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [className]);

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
              Class "{decodeURIComponent(className)}" was not found in the database.
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
