
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
  // Group results by class
  const groupedResults = results.reduce<{
    [key: string]: typeof results;
  }>((acc, result) => {
    const className = result.excelEntry.class;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(result);
    return acc;
  }, {});

  return (
    <ScrollArea className="h-[60vh] sm:h-[70vh]">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4 px-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Excel Entry</h2>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SSDM</h2>
          </div>
        </div>
        {Object.entries(groupedResults).map(([className, classResults]) => (
          <div key={className} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 px-4">
              <h3 className="text-lg font-semibold text-gray-900">{className}</h3>
              <h3 className="text-lg font-semibold text-gray-900">
                {className.replace(/(\d+)/, (match) => (parseInt(match) + 1).toString())} 
              </h3>
            </div>
            <div className="space-y-4">
              {classResults.map((result, index) => {
                const globalIndex = results.findIndex(r => 
                  r.excelEntry.name === result.excelEntry.name && 
                  r.excelEntry.class === result.excelEntry.class
                );
                return (
                  <ComparisonResult
                    key={globalIndex}
                    excelEntry={result.excelEntry}
                    matches={result.matches}
                    selectedMatch={result.selectedMatch}
                    isSelected={selectedRows[globalIndex] || false}
                    onMatchSelect={(student) => onMatchSelect(globalIndex, student)}
                    onRowSelect={(checked) => onRowSelect(globalIndex, checked)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
