
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findSimilarNames } from "@/utils/nameMatching";
import { ExcelRow, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ComparisonResult } from "./comparison/ComparisonResult";

interface DataComparisonProps {
  excelData: ExcelRow[];
  onUpdateComplete?: () => void;
}

export const DataComparison = ({ excelData, onUpdateComplete }: DataComparisonProps) => {
  const [comparisonResults, setComparisonResults] = useState<Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>>([]);
  const [selectedRows, setSelectedRows] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAndCompare = async () => {
      try {
        const { data: externalStudents, error } = await supabase
          .from('students')
          .select('*')
          .order('name');

        if (error) throw error;

        const results = excelData.map(excelEntry => ({
          excelEntry,
          matches: findSimilarNames(excelEntry.name, externalStudents || []),
          selectedMatch: undefined
        }));

        setComparisonResults(results);
      } catch (error) {
        console.error('Error comparing data:', error);
        toast({
          title: "Error",
          description: "Failed to compare data with database",
          variant: "destructive",
        });
      }
    };

    if (excelData.length > 0) {
      fetchAndCompare();
    }
  }, [excelData, toast]);

  const handleMatchSelect = (index: number, student: Student | undefined) => {
    setComparisonResults(prev => prev.map((result, i) => 
      i === index ? { ...result, selectedMatch: student } : result
    ));
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: checked
    }));
  };

  const handleUpdate = async () => {
    try {
      const selectedIndices = Object.entries(selectedRows)
        .filter(([_, checked]) => checked)
        .map(([index]) => parseInt(index));

      if (selectedIndices.length === 0) {
        toast({
          title: "Warning",
          description: "Please select at least one row to update",
          variant: "destructive",
        });
        return;
      }

      const selectedResults = selectedIndices.map(index => comparisonResults[index]);
      const unselectedMatches = selectedResults.filter(result => !result.selectedMatch);
      
      if (unselectedMatches.length > 0) {
        toast({
          title: "Warning",
          description: "Please select matches for all selected rows",
          variant: "destructive",
        });
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Error",
          description: "Please login to update data",
          variant: "destructive",
        });
        return;
      }

      const { data: batchData, error: batchError } = await supabase
        .from('data_sync_batches')
        .insert({
          user_id: session.session.user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      const syncRecords = selectedResults.map(result => ({
        batch_id: batchData.id,
        student_id: result.selectedMatch!._id,
        external_student_id: result.excelEntry.name,
        status: 'pending'
      }));

      const { error: syncError } = await supabase
        .from('data_sync_records')
        .insert(syncRecords);

      if (syncError) throw syncError;

      for (const result of selectedResults) {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: result.excelEntry.name,
            class: result.excelEntry.class
          })
          .eq('_id', result.selectedMatch!._id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Selected records have been updated",
      });

      setSelectedRows({});
      
      if (onUpdateComplete) {
        onUpdateComplete();
      }

    } catch (error) {
      console.error('Error updating records:', error);
      toast({
        title: "Error",
        description: "Failed to update records",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full mx-auto mt-4 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <Card className="bg-white">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Comparison Results
          </h2>
          <ScrollArea className="h-[60vh] sm:h-[70vh]">
            <div className="space-y-4 sm:space-y-6">
              {comparisonResults.map((result, index) => (
                <ComparisonResult
                  key={index}
                  excelEntry={result.excelEntry}
                  matches={result.matches}
                  selectedMatch={result.selectedMatch}
                  isSelected={selectedRows[index] || false}
                  onMatchSelect={(student) => handleMatchSelect(index, student)}
                  onRowSelect={(checked) => handleCheckboxChange(index, checked)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <Button onClick={handleUpdate}>
              Update Selected
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
