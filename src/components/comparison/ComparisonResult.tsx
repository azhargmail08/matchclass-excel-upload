
import { ExcelRow, Student } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAvailableClasses } from "@/hooks/useAvailableClasses";

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
  const availableClasses = useAvailableClasses();

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onRowSelect(checked as boolean)}
                />
                <div className="flex-1">
                  <p className="break-words">{excelEntry.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2">
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
                    />
                    <div className="flex-1">
                      <p className="break-words">{match.name}</p>
                      <p className="text-xs text-gray-500">SSDM CLASS: {match.class}</p>
                    </div>
                    <Select
                      value={selectedMatch?._id === match._id ? selectedMatch.class : undefined}
                      onValueChange={(value) => {
                        const updatedMatch = { ...match, class: value };
                        onMatchSelect(updatedMatch);
                        onRowSelect(true);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={match.class} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
