
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findSimilarNames } from "@/utils/nameMatching";
import { ExcelRow, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

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

      // Create a new batch
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

      // Create sync records
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

      // Update student records
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

      // Clear selections
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
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Card className="bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Comparison Results
          </h2>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-6">
              {comparisonResults.map((result, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedRows[index] || false}
                              onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                            />
                            <h3 className="font-medium text-gray-700">Excel Entry:</h3>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p>{result.excelEntry.name}</p>
                            <p className="text-sm text-gray-500">{result.excelEntry.class}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-700">Possible Matches:</h3>
                          <div className="bg-gray-50 p-3 rounded space-y-2">
                            {result.matches.length > 0 ? (
                              result.matches.map((match) => (
                                <div key={match._id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={result.selectedMatch?._id === match._id}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleMatchSelect(index, match);
                                      } else {
                                        handleMatchSelect(index, undefined);
                                      }
                                    }}
                                  />
                                  <div>
                                    <p>{match.name}</p>
                                    <p className="text-sm text-gray-500">{match.class}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No matches found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
