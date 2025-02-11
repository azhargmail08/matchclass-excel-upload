
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLatestBatch = () => {
  const [latestBatchId, setLatestBatchId] = useState<string | null>(null);

  const fetchLatestBatch = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data, error } = await supabase
      .from('student_changes')
      .select('batch_id')
      .eq('status', 'pending')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setLatestBatchId(data[0].batch_id);
    } else {
      setLatestBatchId(null);
    }
  };

  useEffect(() => {
    fetchLatestBatch();
  }, []);

  return {
    latestBatchId,
    refreshLatestBatch: fetchLatestBatch,
  };
};
