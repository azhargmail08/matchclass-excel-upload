
import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Student, ExcelRow, MatchResult, StudentChange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface DataMatcherProps {
  matches: MatchResult[];
  onConfirm: (selectedMatches: MatchResult[]) => void;
}

export const DataMatcher = ({ matches, onConfirm }: DataMatcherProps) => {
  const [selectedMatches, setSelectedMatches] = useState<MatchResult[]>(matches);
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

    const selectedMatchesToUpdate = selectedIndices.map(index => selectedMatches[index]);
    const unselectedInSelection = selectedMatchesToUpdate.filter(match => !match.selected);
    
    if (unselectedInSelection.length > 0) {
      toast({
        title: "Warning",
        description: "Please select matches for all selected entries",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a batch ID for this set of changes
      const batchId = crypto.randomUUID();

      // Create backup entries
      const changes = selectedMatchesToUpdate.map(match => ({
        student_id: match.selected!.id,
        old_name: match.selected!.name,
        old_class: match.selected!.class,
        old_nickname: match.selected!.nickname,
        new_name: match.excelRow.name,
        new_class: match.excelRow.class,
        new_nickname: match.selected!.nickname, // Keeping the same nickname
        batch_id: batchId,
      }));

      // Insert changes into student_changes table
      const { error: backupError } = await supabase
        .from('student_changes')
        .insert(changes);

      if (backupError) throw backupError;

      // Update students table
      for (const match of selectedMatchesToUpdate) {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: match.excelRow.name,
            class: match.excelRow.class,
          })
          .eq('id', match.selected!.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Data has been updated successfully",
      });

      onConfirm(selectedMatchesToUpdate);
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        title: "Error",
        description: "Failed to update data. Please try again.",
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
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={`row-${index}`}
                    checked={selectedRows[index] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          Excel Entry: {match.excelRow.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Class: {match.excelRow.class}
                        </p>
                      </div>
                      <div className="flex-1 max-w-md ml-4">
                        <select
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                          value={match.selected?.id || ""}
                          onChange={(e) => {
                            const selected = match.matches.find(
                              (s) => s.id === e.target.value
                            );
                            handleSelect(index, selected);
                          }}
                        >
                          <option value="">Select a match...</option>
                          {match.matches.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.class})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              Update Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
