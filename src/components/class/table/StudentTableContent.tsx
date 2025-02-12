
import { Student } from "@/types";
import { Info } from "lucide-react";
import { StudentTableRow } from "./StudentTableRow";

interface StudentTableContentProps {
  students: Student[];
  searchQuery: string;
  editingStudents: { [key: string]: Student };
  onInputChange: (studentId: string, field: keyof Student, value: string) => void;
  onUpdate: (studentId: string, student: Student) => void;
  onDelete: (student: Student) => void;
  onTransfer: (student: Student) => void;
}

export const StudentTableContent = ({
  students,
  searchQuery,
  editingStudents,
  onInputChange,
  onUpdate,
  onDelete,
  onTransfer
}: StudentTableContentProps) => {
  if (students.length === 0) {
    return (
      <tr>
        <td colSpan={10} className="px-4 py-8 text-center">
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <Info className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium">No Students</p>
            <p className="text-sm">This class currently has no students.</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {students
        .filter(student =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map((student, index) => (
          <StudentTableRow
            key={student._id}
            student={student}
            index={index}
            editingStudent={editingStudents[student._id]}
            onInputChange={(field, value) => onInputChange(student._id, field, value)}
            onUpdate={() => onUpdate(student._id, student)}
            onDelete={() => onDelete(student)}
            onTransfer={() => onTransfer(student)}
          />
        ))}
    </>
  );
};
