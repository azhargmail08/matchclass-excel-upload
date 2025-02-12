
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAvailableClasses = () => {
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('name')
          .order('name');

        if (error) throw error;

        const classNames = data.map(c => c.name);
        setAvailableClasses(classNames);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to load available classes",
          variant: "destructive",
        });
      }
    };

    fetchClasses();
  }, [toast]);

  return availableClasses;
};
