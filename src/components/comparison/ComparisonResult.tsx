
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
      <div className="flex items-start space-x-4">
        <div className="flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onRowSelect(checked as boolean)}
                />
                <h3 className="font-medium text-gray-700">Excel Entry:</h3>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p>{excelEntry.name}</p>
                <p className="text-sm text-gray-500">{excelEntry.class}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Possible Matches:</h3>
              <div className="bg-gray-50 p-3 rounded space-y-2">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <div key={match._id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedMatch?._id === match._id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onMatchSelect(match);
                          } else {
                            onMatchSelect(undefined);
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
  );
};
