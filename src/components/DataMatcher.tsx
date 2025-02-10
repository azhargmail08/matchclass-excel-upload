
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Student, ExcelRow, MatchResult } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DataMatcherProps {
  matches: MatchResult[];
  onConfirm: (selectedMatches: MatchResult[]) => void;
}

export const DataMatcher = ({ matches, onConfirm }: DataMatcherProps) => {
  const [selectedMatches, setSelectedMatches] = useState<MatchResult[]>(matches);
  const { toast } = useToast();

  const handleSelect = (matchIndex: number, student: Student | undefined) => {
    setSelectedMatches((prev) =>
      prev.map((match, idx) =>
        idx === matchIndex ? { ...match, selected: student } : match
      )
    );
  };

  const handleConfirm = () => {
    const unselectedMatches = selectedMatches.filter((match) => !match.selected);
    if (unselectedMatches.length > 0) {
      toast({
        title: "Warning",
        description: "Please select matches for all entries or remove them",
        variant: "destructive",
      });
      return;
    }
    onConfirm(selectedMatches);
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
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedMatches([])}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              Clear All
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-sage-500 rounded-md hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
