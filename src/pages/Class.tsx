
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";

const Class = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const className = "1A"; // Hardcoded for now, could be made dynamic later

  useEffect(() => {
    const fetchClassStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', className);
      
      if (!error && data) {
        setStudents(data);
      }
    };

    fetchClassStudents();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{className}</h1>
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
