
import { ExcelRow, Student } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface ComparisonResultProps {
  excelEntry: ExcelRow;
  matches: Student[];
  selectedMatch?: Student;
  isSelected: boolean;
  onMatchSelect: (student: Student | undefined) => void;
  onRowSelect: (checked: boolean) => void;
}

export const ComparisonResult = ({
  excelEntry,
  matches,
  selectedMatch,
  isSelected,
  onMatchSelect,
  onRowSelect,
}: ComparisonResultProps) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Excel Entry:</h3>
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={isSelected && !selectedMatch}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onMatchSelect(undefined);
                      onRowSelect(true);
                    } else {
                      onRowSelect(false);
                    }
                  }}
                  disabled={Boolean(selectedMatch)}
                />
                <div className="flex-1">
                  <p className="break-words">{excelEntry.name}</p>
                  <p className="text-sm text-gray-500 break-words">{excelEntry.class}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">SSDM:</h3>
            <div className="bg-gray-50 p-3 rounded space-y-3">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <div key={match._id} className="flex items-start space-x-2">
                    <Checkbox
                      checked={selectedMatch?._id === match._id}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onMatchSelect(match);
                          onRowSelect(true);
                        } else {
                          onMatchSelect(undefined);
                          onRowSelect(false);
                        }
                      }}
                      disabled={isSelected && !selectedMatch}
                    />
                    <div className="flex-1">
                      <p className="break-words">{match.name}</p>
                      <p className="text-sm text-gray-500 break-words">{match.class}</p>
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
  );
};
