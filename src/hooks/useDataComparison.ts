
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findSimilarNames } from "@/utils/nameMatching";
import { ExcelRow, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useDataComparison = (excelData: ExcelRow[]) => {
  const [comparisonResults, setComparisonResults] = useState<Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>>([]);
  const [selectedRows, setSelectedRows] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndCompare = async () => {
      try {
        const { data: externalStudents, error } = await supabase
          .from('external_students')
          .select('*')
          .order('name');

        if (error) throw error;

        const results = excelData.map(excelEntry => ({
          excelEntry,
          matches: findSimilarNames(excelEntry.name, externalStudents || []),
          selectedMatch: undefined
        }));

        setComparisonResults(results);
      } catch (error) {
        console.error('Error comparing data:', error);
        toast({
          title: "Error",
          description: "Failed to compare data with database",
          variant: "destructive",
        });
      }
    };

    if (excelData.length > 0) {
      fetchAndCompare();
    }
  }, [excelData, toast]);

  const handleMatchSelect = (index: number, student: Student | undefined) => {
    setComparisonResults(prev => prev.map((result, i) => 
      i === index ? { ...result, selectedMatch: student } : result
    ));
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: checked
    }));
  };

  return {
    comparisonResults,
    selectedRows,
    handleMatchSelect,
    handleCheckboxChange,
    setSelectedRows
  };
};
