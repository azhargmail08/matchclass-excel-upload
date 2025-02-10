
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Class = () => {
  const { className } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const decodedClassName = decodeURIComponent(className || "");

  useEffect(() => {
    const fetchClassStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', decodedClassName);
      
      if (!error && data) {
        setStudents(data);
      }
    };

    fetchClassStudents();
  }, [decodedClassName]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{decodedClassName}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <div className="grid gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium">{student.name}</p>
                {student.nickname && (
                  <p className="text-sm text-gray-500">
                    Nickname: {student.nickname}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Class;
