
import { useState } from "react";
import { ExcelUploader } from "@/components/ExcelUploader";
import { DataMatcher } from "@/components/DataMatcher";
import { ExcelRow, MatchResult, Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Mock database - replace with actual database integration
const mockDatabase: Student[] = [
  { id: "1", name: "John Doe", class: "Math 101" },
  { id: "2", name: "Jane Smith", class: "Math 101" },
  { id: "3", name: "Bob Johnson", class: "Physics 101" },
];

const Index = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showMatcher, setShowMatcher] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const findMatches = (data: ExcelRow[]): MatchResult[] => {
    return data.map((row) => ({
      excelRow: row,
      matches: mockDatabase.filter(
        (student) =>
          student.name.toLowerCase().includes(row.name.toLowerCase()) ||
          student.class.toLowerCase() === row.class.toLowerCase()
      ),
    }));
  };

  const handleDataUpload = (data: ExcelRow[]) => {
    const matchResults = findMatches(data);
    setMatches(matchResults);
    setShowMatcher(true);
  };

  const handleConfirm = (selectedMatches: MatchResult[]) => {
    // Here you would typically send the data to your backend
    console.log("Selected matches:", selectedMatches);
    toast({
      title: "Success",
      description: "Data has been processed successfully",
    });
    setShowMatcher(false);
    setMatches([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Excel Data Verification
            </h1>
            <p className="text-gray-600 text-center">
              Upload your Excel file to verify and match student data
            </p>
          </div>

          {!showMatcher ? (
            <ExcelUploader onDataUpload={handleDataUpload} />
          ) : (
            <DataMatcher matches={matches} onConfirm={handleConfirm} />
          )}

          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
