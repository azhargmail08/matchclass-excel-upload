
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, ArrowRightLeft } from "lucide-react";

interface StudentTableRowProps {
  student: Student;
  index: number;
  editingStudent?: Student;
  onInputChange: (field: keyof Student, value: string) => void;
  onUpdate: () => void;
  onDelete: () => void;
  onTransfer: () => void;
}

export const StudentTableRow = ({
  student,
  index,
  editingStudent,
  onInputChange,
  onUpdate,
  onDelete,
  onTransfer
}: StudentTableRowProps) => {
  const currentStudent = editingStudent || student;

  return (
    <tr>
      <td className="whitespace-nowrap px-4 py-3">{index + 1}</td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Student Name"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.nickname || ''}
          onChange={(e) => onInputChange('nickname', e.target.value)}
          maxLength={14}
          placeholder="Name On Badges"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.special_name || ''}
          onChange={(e) => onInputChange('special_name', e.target.value)}
          placeholder="Special Name"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.matrix_number || ''}
          onChange={(e) => onInputChange('matrix_number', e.target.value)}
          placeholder="Matrix Number"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          type="date"
          value={currentStudent.date_joined || ''}
          onChange={(e) => onInputChange('date_joined', e.target.value)}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.father_name || ''}
          onChange={(e) => onInputChange('father_name', e.target.value)}
          placeholder="Father's Name"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.mother_name || ''}
          onChange={(e) => onInputChange('mother_name', e.target.value)}
          placeholder="Mother's Name"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <Input
          value={currentStudent.contact_no || ''}
          onChange={(e) => onInputChange('contact_no', e.target.value)}
          placeholder="Contact Number"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-500 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {editingStudent && (
            <Button
              onClick={onUpdate}
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4"
            >
              Update
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={onTransfer}
            className="h-8 w-8 text-blue-500 hover:text-blue-600"
            title="Transfer to Another Class"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
