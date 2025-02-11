
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PendingChangesProps {
  latestBatchId: string | null;
  onRollbackComplete: () => Promise<void>;
}

export const PendingChanges = ({ latestBatchId, onRollbackComplete }: PendingChangesProps) => {
  const { toast } = useToast();

  const handleRollback = async () => {
    if (!latestBatchId) {
      toast({
        title: "Info",
        description: "No changes to roll back",
      });
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data: changes, error: fetchError } = await supabase
        .from('student_changes')
        .select('*')
        .eq('batch_id', latestBatchId)
        .eq('status', 'pending')
        .eq('user_id', session.session.user.id);

      if (fetchError) throw fetchError;
      if (!changes || changes.length === 0) {
        toast({
          title: "Info",
          description: "No pending changes to roll back",
        });
        return;
      }

      for (const change of changes) {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: change.old_name,
            class: change.old_class,
            nickname: change.old_nickname,
          })
          .eq('_id', change.student_id);

        if (updateError) throw updateError;

        const { error: statusError } = await supabase
          .from('student_changes')
          .update({ status: 'rolled_back' })
          .eq('id', change.id);

        if (statusError) throw statusError;
      }

      toast({
        title: "Success",
        description: "Changes have been rolled back successfully",
      });

      await onRollbackComplete();
    } catch (error) {
      console.error('Error rolling back changes:', error);
      toast({
        title: "Error",
        description: "Failed to roll back changes",
        variant: "destructive",
      });
    }
  };

  return latestBatchId ? (
    <Button
      variant="outline"
      onClick={handleRollback}
      className="flex items-center gap-2"
    >
      <RotateCcw className="w-4 h-4" />
      Rollback Changes
    </Button>
  ) : null;
};
