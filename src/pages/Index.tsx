
import { useState, useEffect } from "react";
import { ExcelUploader } from "@/components/ExcelUploader";
import { DataMatcher } from "@/components/DataMatcher";
import { ExcelRow, MatchResult, Student, StudentChange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { RotateCcw, ArrowRight } from "lucide-react";

const Index = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showMatcher, setShowMatcher] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [latestBatchId, setLatestBatchId] = useState<string | null>(null);
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchLatestBatch();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const classes = Array.from(new Set(students.map(student => student.class))).sort();
      setUniqueClasses(classes);
    }
  }, [students]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    
    if (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setStudents(data);
    }
  };

  const fetchLatestBatch = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data, error } = await supabase
      .from('student_changes')
      .select('batch_id')
      .eq('status', 'pending')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setLatestBatchId(data[0].batch_id);
    } else {
      setLatestBatchId(null);
    }
  };

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
    await fetchStudents();
    await fetchLatestBatch();
  };

  const handleRollback = async () => {
    if (!latestBatchId) {
      toast({
        title: "Info",
        description: "No changes to roll back",
      });
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data: changes, error: fetchError } = await supabase
        .from('student_changes')
        .select('*')
        .eq('batch_id', latestBatchId)
        .eq('status', 'pending')
        .eq('user_id', session.session.user.id);

      if (fetchError) throw fetchError;
      if (!changes || changes.length === 0) {
        toast({
          title: "Info",
          description: "No pending changes to roll back",
        });
        return;
      }

      for (const change of changes) {
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: change.old_name,
            class: change.old_class,
            nickname: change.old_nickname,
          })
          .eq('_id', change.student_id);

        if (updateError) throw updateError;

        const { error: statusError } = await supabase
          .from('student_changes')
          .update({ status: 'rolled_back' })
          .eq('id', change.id);

        if (statusError) throw statusError;
      }

      toast({
        title: "Success",
        description: "Changes have been rolled back successfully",
      });

      await fetchStudents();
      await fetchLatestBatch();
    } catch (error) {
      console.error('Error rolling back changes:', error);
      toast({
        title: "Error",
        description: "Failed to roll back changes",
        variant: "destructive",
      });
    }
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Excel Data Verification
            </h1>
            {latestBatchId && (
              <Button
                variant="outline"
                onClick={handleRollback}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Rollback Changes
              </Button>
            )}
          </div>
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
      
      <div className="py-4 flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {uniqueClasses.map((className) => (
            <Button
              key={className}
              variant="outline"
              onClick={() => handleNavigateToClass(className)}
              className="flex items-center gap-2"
            >
              {className}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Index;
