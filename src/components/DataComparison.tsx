
import { ExcelRow } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComparisonResultsList } from "./comparison/ComparisonResultsList";
import { useDataComparison } from "@/hooks/useDataComparison";
import { updateSelectedRecords } from "@/services/dataUpdateService";

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
    
    const result = await updateSelectedRecords(selectedResults);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Selected records have been updated",
      });
      setSelectedRows({});
      if (onUpdateComplete) {
        onUpdateComplete();
      }
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to update records",
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
          />
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
