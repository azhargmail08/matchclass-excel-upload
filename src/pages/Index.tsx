
import { useState } from "react";
import { ExcelUploader } from "@/components/ExcelUploader";
import { DataMatcher } from "@/components/DataMatcher";
import { ExcelRow, MatchResult } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ClassList } from "@/components/excel/ClassList";
import { useStudentData } from "@/hooks/useStudentData";
import { useLatestBatch } from "@/hooks/useLatestBatch";

const Index = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showMatcher, setShowMatcher] = useState(false);
  const navigate = useNavigate();
  const { students, uniqueClasses, refreshStudents } = useStudentData();
  const { latestBatchId, refreshLatestBatch } = useLatestBatch();

  const findMatches = (data: ExcelRow[]): MatchResult[] => {
    return data.map((row) => {
      const matchingStudents = students.filter(
        (student) =>
          student.name.toLowerCase().includes(row.name.toLowerCase()) ||
          student.class.toLowerCase() === row.class.toLowerCase()
      );
      return {
        excelRow: row,
        matches: matchingStudents,
      };
    });
  };

  const handleDataUpload = (data: ExcelRow[]) => {
    const matchResults = findMatches(data);
    setMatches(matchResults);
    setShowMatcher(true);
  };

  const handleConfirm = async (selectedMatches: MatchResult[]) => {
    console.log("Selected matches:", selectedMatches);
    setShowMatcher(false);
    setMatches([]);
    await refreshStudents();
    await refreshLatestBatch();
  };

  const handleNavigateToClass = (className: string) => {
    navigate(`/class/${encodeURIComponent(className)}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Excel Data Verification
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your Excel file to verify and match student data
          </p>

          {!showMatcher ? (
            <ExcelUploader onDataUpload={handleDataUpload} />
          ) : (
            <DataMatcher matches={matches} onConfirm={handleConfirm} />
          )}
        </div>
      </div>
      
      <ClassList 
        classes={uniqueClasses}
        onClassClick={handleNavigateToClass}
      />
      
      <div className="flex justify-center pb-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Index;
