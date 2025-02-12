
import { ExcelRow } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComparisonResultsList } from "./comparison/ComparisonResultsList";
import { useDataComparison } from "@/hooks/useDataComparison";
import { transferDataToInternal } from "@/services/dataTransferService";

interface DataComparisonProps {
  excelData: ExcelRow[];
  onUpdateComplete?: () => void;
}

export const DataComparison = ({ excelData, onUpdateComplete }: DataComparisonProps) => {
  const { toast } = useToast();
  const {
    comparisonResults,
    selectedRows,
    handleMatchSelect,
    handleCheckboxChange,
    setSelectedRows
  } = useDataComparison(excelData);

  const handleUpdate = async () => {
    // Filter selected results based on the unique keys in selectedRows
    const selectedResults = comparisonResults
      .filter((result, index) => {
        const key = `${result.excelEntry.name}-${result.excelEntry.class}-${index}`;
        return selectedRows[key];
      })
      .map(result => ({
        excelRow: result.excelEntry,
        selectedMatch: result.selectedMatch
      }));

    if (selectedResults.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one record to update",
        variant: "destructive",
      });
      return;
    }

    const result = await transferDataToInternal(selectedResults);
      
    if (result.success) {
      toast({
        title: "Success",
        description: "Selected students have been updated",
      });
      setSelectedRows({});
      if (onUpdateComplete) {
        onUpdateComplete();
      }
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to transfer records",
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
          <ComparisonResultsList
            results={comparisonResults}
            selectedRows={selectedRows}
            onMatchSelect={handleMatchSelect}
            onRowSelect={handleCheckboxChange}
            setSelectedRows={setSelectedRows}
          />
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <Button onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
