
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Student } from "@/types";

interface DeleteConfirmDialogProps {
  student: Student | null;
  onClose: () => void;
  onConfirm: (student: Student) => void;
}

export const DeleteConfirmDialog = ({
  student,
  onClose,
  onConfirm
}: DeleteConfirmDialogProps) => {
  if (!student) return null;

  return (
    <AlertDialog open={!!student} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove {student.name} from the class. You can use the rollback button to undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(student)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
