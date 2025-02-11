
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findSimilarNames } from "@/utils/nameMatching";
import { ExcelRow } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DataComparisonProps {
  excelData: ExcelRow[];
}

export const DataComparison = ({ excelData }: DataComparisonProps) => {
  const [comparisonResults, setComparisonResults] = useState<Array<{
    excelEntry: ExcelRow;
    matches: Array<{
      name: string;
      class: string;
      _id: string;
    }>;
  }>>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAndCompare = async () => {
      try {
        // Fetch external database records
        const { data: externalStudents, error } = await supabase
          .from('external_students')
          .select('_id, name, class')
          .order('name');

        if (error) throw error;

        // Compare each Excel entry with external database
        const results = excelData.map(excelEntry => ({
          excelEntry,
          matches: findSimilarNames(excelEntry.name, externalStudents || [])
        }));

        setComparisonResults(results);
      } catch (error) {
        console.error('Error comparing data:', error);
        toast({
          title: "Error",
          description: "Failed to compare data with external database",
          variant: "destructive",
        });
      }
    };

    if (excelData.length > 0) {
      fetchAndCompare();
    }
  }, [excelData, toast]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Comparison Results
          </h2>
          <div className="space-y-6">
            {comparisonResults.map((result, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Excel Entry:</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p>{result.excelEntry.name}</p>
                      <p className="text-sm text-gray-500">{result.excelEntry.class}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Possible Matches:</h3>
                    <div className="space-y-2">
                      {result.matches.length > 0 ? (
                        result.matches.map((match, matchIndex) => (
                          <div key={matchIndex} className="bg-blue-50 p-3 rounded">
                            <p>{match.name}</p>
                            <p className="text-sm text-blue-600">{match.class}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No matches found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
