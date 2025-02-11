
import { supabase } from "@/integrations/supabase/client";
import { MatchResult } from "@/types";
import { toast } from "@/hooks/use-toast";

export const updateStudentData = async (selectedMatches: MatchResult[]) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    toast({
      title: "Error",
      description: "You must be logged in to make changes",
      variant: "destructive",
    });
    return false;
  }

  const batchId = crypto.randomUUID();

  const changes = selectedMatches.map(match => ({
    student_id: match.selected!._id,
    old_name: match.selected!.name,
    old_class: match.selected!.class,
    old_nickname: match.selected!.nickname,
    new_name: match.excelRow.name,
    new_class: match.excelRow.class,
    new_nickname: match.selected!.nickname,
    batch_id: batchId,
    user_id: session.session.user.id,
  }));

  const { error: backupError } = await supabase
    .from('student_changes')
    .insert(changes);

  if (backupError) throw backupError;

  for (const match of selectedMatches) {
    const { error: updateError } = await supabase
      .from('students')
      .update({
        name: match.excelRow.name,
        class: match.excelRow.class,
      })
      .eq('_id', match.selected!._id);

    if (updateError) throw updateError;
  }

  return true;
};
