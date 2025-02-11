
import { useNavigate } from "react-router-dom";
import { ClassDetails as ClassDetailsType } from "@/pages/Class";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { StudentTable } from "./StudentTable";
import { useEffect } from "react";

interface ClassDetailsProps {
  classDetails: ClassDetailsType;
  onRefresh?: () => void;
}

export const ClassDetailsView = ({ classDetails, onRefresh }: ClassDetailsProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // Refresh data when component mounts
    onRefresh?.();
  }, [onRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{classDetails.className}</h1>
            <p className="text-gray-600 text-lg">
              Teacher: {classDetails.teacher}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add & Transfer Student(s)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Total Student(s)</h2>
              <p className="text-4xl font-bold">{classDetails.students.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Total Teacher(s)</h2>
              <p className="text-4xl font-bold">1</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Teachers</h2>
          <Card className="mb-4">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {classDetails.teacher.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{classDetails.teacher}</p>
                  <p className="text-sm text-gray-500">Main Teacher</p>
                </div>
              </div>
              <Button variant="outline" className="text-red-500 hover:text-red-600">
                Unassign
              </Button>
            </CardContent>
          </Card>
        </div>

        <StudentTable students={classDetails.students} />
      </div>
    </div>
  );
};
