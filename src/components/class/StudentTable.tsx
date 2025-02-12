
import { Student } from "@/types";
import { StudentTableHeader } from "./table/StudentTableHeader";
import { StudentTableHeaders } from "./table/StudentTableHeaders";
import { StudentTableContent } from "./table/StudentTableContent";
import { DeleteConfirmDialog } from "./table/DeleteConfirmDialog";
import { TransferClassDialog } from "./table/TransferClassDialog";
import { useStudentTable } from "@/hooks/useStudentTable";

interface StudentTableProps {
  students: Student[];
  onRefresh?: () => void;
}

export const StudentTable = ({ students, onRefresh }: StudentTableProps) => {
  const {
    searchQuery,
    setSearchQuery,
    editingStudents,
    studentToDelete,
    setStudentToDelete,
    studentToTransfer,
    setStudentToTransfer,
    availableClasses,
    handleInputChange,
    handleUpdate,
    handleDelete
  } = useStudentTable(students, onRefresh);

  return (
    <div className="space-y-4 w-full">
      <StudentTableHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative rounded-lg shadow border bg-white flex flex-col">
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <StudentTableHeaders />
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <StudentTableContent
                students={students}
                searchQuery={searchQuery}
                editingStudents={editingStudents}
                onInputChange={handleInputChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onTransfer={setStudentToTransfer}
              />
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto border-t">
          <div className="h-4 min-w-full"></div>
        </div>
      </div>

      <DeleteConfirmDialog
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDelete}
      />

      <TransferClassDialog
        student={studentToTransfer}
        availableClasses={availableClasses}
        onClose={() => setStudentToTransfer(null)}
        onTransfer={onRefresh || (() => {})}
      />
    </div>
  );
};
