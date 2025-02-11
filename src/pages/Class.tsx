import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { ClassList } from "@/components/class/ClassList";
import { ClassDetailsView } from "@/components/class/ClassDetails";

export interface ClassDetails {
  className: string;
  teacher: string;
  students: Student[];
}

const Class = () => {
  const { className } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);

  useEffect(() => {
    const fetchClassesAndStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (!error && data) {
        setStudents(data);
        // Group students by class and get unique classes with their teachers
        const classGroups = data.reduce((acc: { [key: string]: ClassDetails }, student) => {
          if (!acc[student.class]) {
            acc[student.class] = {
              className: student.class,
              teacher: student.teacher,
              students: []
            };
          }
          acc[student.class].students.push(student);
          return acc;
        }, {});
        
        setClasses(Object.values(classGroups));
        
        // If we have a className parameter, find and set the selected class
        if (className) {
          const foundClass = Object.values(classGroups).find(c => c.className === className);
          if (foundClass) {
            setSelectedClass(foundClass);
          }
        }
      }
    };

    fetchClassesAndStudents();
  }, [className]);

  // If we have a className parameter, show the class details view
  if (className && selectedClass) {
    return <ClassDetailsView classDetails={selectedClass} />;
  }

  // Otherwise show the classes list view
  return (
    <ClassList 
      classes={classes}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default Class;
