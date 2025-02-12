
import { useState } from "react";
import { MatchResult, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MatchRow } from "./MatchRow";
import { sortMatchesByFirstName, createInitialSelectedMatches } from "@/utils/matchingUtils";
import { transferDataToInternal } from "@/services/dataTransferService";

interface DataMatcherProps {
  matches: MatchResult[];
  onConfirm: (selectedMatches: MatchResult[]) => void;
}

export const DataMatcher = ({ matches, onConfirm }: DataMatcherProps) => {
  const sortedMatches = sortMatchesByFirstName(matches);
  const [selectedMatches, setSelectedMatches] = useState<MatchResult[]>(
    createInitialSelectedMatches(sortedMatches)
  );
  const [selectedRows, setSelectedRows] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();

  const handleSelect = (matchIndex: number, student: Student | undefined) => {
    setSelectedMatches((prev) =>
      prev.map((match, idx) =>
        idx === matchIndex ? { ...match, selected: student } : match
      )
    );
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: checked
    }));
  };

  const handleConfirm = async () => {
    const selectedIndices = Object.entries(selectedRows)
      .filter(([_, checked]) => checked)
      .map(([index]) => parseInt(index));

    if (selectedIndices.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one match to update",
        variant: "destructive",
      });
      return;
    }

    const selectedMatchesToUpdate = selectedIndices.map(index => ({
      excelRow: selectedMatches[index].excelRow,
      selectedMatch: selectedMatches[index].selected
    }));

    try {
      const result = await transferDataToInternal(selectedMatchesToUpdate);
      
      if (result.success) {
        if (result.skippedRecords && result.skippedRecords > 0) {
          toast({
            title: "Partial Success",
            description: `Data transferred successfully. ${result.skippedRecords} record(s) were skipped because they already exist in the target class.`,
          });
        } else {
          toast({
            title: "Success",
            description: "Data has been transferred successfully",
          });
        }
        // Pass the complete MatchResult objects for the selected indices
        const selectedMatchResults = selectedIndices.map(index => selectedMatches[index]);
        onConfirm(selectedMatchResults);
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error transferring data:', error);
      toast({
        title: "Error",
        description: "Failed to transfer data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Match Data
          </h2>
          <div className="space-y-4">
            {selectedMatches.map((match, index) => (
              <MatchRow
                key={index}
                match={match}
                index={index}
                isChecked={selectedRows[index] || false}
                onCheckboxChange={handleCheckboxChange}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRows({});
                setSelectedMatches(matches);
              }}
            >
              Clear Selection
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-sage-500 hover:bg-sage-600"
            >
              Transfer Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
