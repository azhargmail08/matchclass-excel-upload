
import { useState } from "react";
import { Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransferClassDialogProps {
  student: Student | null;
  availableClasses: string[];
  onClose: () => void;
  onTransfer: () => void;
}

export const TransferClassDialog = ({ 
  student, 
  availableClasses,
  onClose,
  onTransfer 
}: TransferClassDialogProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!student || !selectedClass) return;

    try {
      setIsLoading(true);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Error",
          description: "Please login to transfer students",
          variant: "destructive",
        });
        return;
      }

      // 1. Update the student's class in internal_database
      const { error: updateError } = await supabase
        .from('internal_database')
        .update({ Class: selectedClass })
        .eq('_id', student._id);

      if (updateError) throw updateError;

      // 2. Record the transfer in class_transfers
      const { error: transferError } = await supabase
        .from('class_transfers')
        .insert({
          student_id: student._id,
          from_class: student.class,
          to_class: selectedClass,
          user_id: session.session.user.id
        });

      if (transferError) throw transferError;

      toast({
        title: "Success",
        description: "Student transferred successfully",
      });

      onTransfer();
      onClose();
    } catch (error) {
      console.error('Error transferring student:', error);
      toast({
        title: "Error",
        description: "Failed to transfer student",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Student</DialogTitle>
          <DialogDescription>
            Transfer {student?.name} to another class
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select New Class</Label>
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses
                  .filter(className => className !== student?.class)
                  .map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer} 
              disabled={!selectedClass || isLoading}
            >
              Transfer Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
