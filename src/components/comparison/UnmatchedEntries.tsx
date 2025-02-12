
import { ExcelRow, Student } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAvailableClasses } from "@/hooks/useAvailableClasses";

interface UnmatchedEntriesProps {
  entries: Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>;
  selectedRows: {[key: string]: boolean};
  onRowSelect: (index: number, checked: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}

export const UnmatchedEntries = ({
  entries,
  selectedRows,
  onRowSelect,
  setSelectedRows,
}: UnmatchedEntriesProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const availableClasses = useAvailableClasses();

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign New Students</h3>
        <div className="mb-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select target class" />
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
        <div className="space-y-3">
          {entries.map((entry) => {
            // Create a unique key for unmatched entries
            const unmatchedKey = `unmatched-${entry.excelEntry.name}-${entry.excelEntry.class}`;
            return (
              <div key={unmatchedKey} className="flex items-start space-x-2 bg-white p-3 rounded">
                <Checkbox
                  checked={selectedRows[unmatchedKey] || false}
                  onCheckedChange={(checked) => {
                    // Use the unique unmatched key for selection
                    setSelectedRows(prev => ({
                      ...prev,
                      [unmatchedKey]: checked as boolean
                    }));
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.excelEntry.name}</p>
                  <p className="text-xs text-gray-500">From: {entry.excelEntry.class}</p>
                  {selectedRows[unmatchedKey] && !selectedClass && (
                    <p className="text-xs text-amber-600 mt-1">Please select a target class</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
