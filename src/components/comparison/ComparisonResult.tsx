
import { ExcelRow, Student } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
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
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
        <div>
          <div className="space-y-2">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight className="text-gray-400" />
        </div>
        <div>
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded space-y-3">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <div key={match._id} className="flex flex-col space-y-2">
                    <div className="flex items-start space-x-2">
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
                        disabled={isSelected && !selectedMatch && selectedMatch?._id !== match._id}
                      />
                      <div className="flex-1">
                        <p className="break-words">{match.name}</p>
                        <p className="text-sm text-gray-500">{match.class}</p>
                      </div>
                    </div>
                    <Select defaultValue={match.class}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={match.class} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
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
