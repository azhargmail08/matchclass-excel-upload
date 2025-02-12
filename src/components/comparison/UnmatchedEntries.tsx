
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
  selectedRows: {[key: number]: boolean};
  onRowSelect: (index: number, checked: boolean) => void;
}

export const UnmatchedEntries = ({
  entries,
  selectedRows,
  onRowSelect,
}: UnmatchedEntriesProps) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const availableClasses = useAvailableClasses();

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign New Students</h3>
        <div className="mb-4">
          <Select value={selectedClass} onValueChange={(value) => {
            setSelectedClass(value);
            // When a class is selected, automatically check all entries
            entries.forEach((_, index) => {
              const globalIndex = entries.findIndex(e => 
                e.excelEntry.name === entries[index].excelEntry.name && 
                e.excelEntry.class === entries[index].excelEntry.class
              );
              onRowSelect(globalIndex, true);
            });
          }}>
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
          {entries.map((entry, index) => {
            const globalIndex = entries.findIndex(e => 
              e.excelEntry.name === entry.excelEntry.name && 
              e.excelEntry.class === entry.excelEntry.class
            );
            return (
              <div key={globalIndex} className="flex items-start space-x-2 bg-white p-3 rounded">
                <Checkbox
                  checked={selectedRows[globalIndex] || false}
                  onCheckedChange={(checked) => onRowSelect(globalIndex, checked as boolean)}
                  disabled={!selectedClass}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.excelEntry.name}</p>
                  <p className="text-xs text-gray-500">From: {entry.excelEntry.class}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
