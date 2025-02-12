
import { ExcelRow, Student } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComparisonResult } from "./ComparisonResult";
import { UnmatchedEntries } from "./UnmatchedEntries";

interface ComparisonResultsListProps {
  results: Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>;
  selectedRows: {[key: string]: boolean};
  onMatchSelect: (index: number, student: Student | undefined) => void;
  onRowSelect: (index: number, checked: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}

export const ComparisonResultsList = ({
  results,
  selectedRows,
  onMatchSelect,
  onRowSelect,
  setSelectedRows,
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

  // Separate unmatched entries (those with no matches)
  const unmatchedEntries = results.filter(result => result.matches.length === 0);

  const getIsSelected = (result: typeof results[0], index: number) => {
    const key = `${result.excelEntry.name}-${result.excelEntry.class}-${index}`;
    return selectedRows[key] || false;
  };

  return (
    <ScrollArea className="h-[60vh] sm:h-[70vh]">
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4 px-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Excel Entry</h2>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SSDM</h2>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Entries</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {Object.entries(groupedResults).map(([className, classResults]) => (
              <div key={className} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 px-4">
                  <h3 className="text-lg font-semibold text-gray-900">{className}</h3>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {className.replace(/(\d+)/, (match) => (parseInt(match) + 1).toString())} 
                  </h3>
                </div>
                <div className="space-y-4">
                  {classResults
                    .filter(result => result.matches.length > 0)
                    .map((result, index) => {
                    const globalIndex = results.findIndex(r => 
                      r.excelEntry.name === result.excelEntry.name && 
                      r.excelEntry.class === result.excelEntry.class
                    );
                    return (
                      <ComparisonResult
                        key={`${result.excelEntry.name}-${result.excelEntry.class}-${globalIndex}`}
                        excelEntry={result.excelEntry}
                        matches={result.matches}
                        selectedMatch={result.selectedMatch}
                        isSelected={getIsSelected(result, globalIndex)}
                        onMatchSelect={(student) => onMatchSelect(globalIndex, student)}
                        onRowSelect={(checked) => onRowSelect(globalIndex, checked)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4">
            <UnmatchedEntries
              entries={unmatchedEntries}
              selectedRows={selectedRows}
              onRowSelect={onRowSelect}
              setSelectedRows={setSelectedRows}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
