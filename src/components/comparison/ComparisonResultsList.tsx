
import { ExcelRow, Student } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComparisonResult } from "./ComparisonResult";

interface ComparisonResultsListProps {
  results: Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>;
  selectedRows: {[key: number]: boolean};
  onMatchSelect: (index: number, student: Student | undefined) => void;
  onRowSelect: (index: number, checked: boolean) => void;
}

export const ComparisonResultsList = ({
  results,
  selectedRows,
  onMatchSelect,
  onRowSelect,
}: ComparisonResultsListProps) => {
  return (
    <ScrollArea className="h-[60vh] sm:h-[70vh]">
      <div className="space-y-4 sm:space-y-6">
        {results.map((result, index) => (
          <ComparisonResult
            key={index}
            excelEntry={result.excelEntry}
            matches={result.matches}
            selectedMatch={result.selectedMatch}
            isSelected={selectedRows[index] || false}
            onMatchSelect={(student) => onMatchSelect(index, student)}
            onRowSelect={(checked) => onRowSelect(index, checked)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
