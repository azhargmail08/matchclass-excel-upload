
import { useNavigate } from "react-router-dom";
import { ClassDetails } from "@/pages/Class";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExcelUploader } from "@/components/ExcelUploader";
import { CreateClassDialog } from "./CreateClassDialog";
import { ClassFilters } from "./ClassFilters";
import { ClassCard } from "./ClassCard";

interface ClassListProps {
  classes: ClassDetails[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ClassList = ({ classes, searchQuery, setSearchQuery }: ClassListProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Classes</h1>
            <p className="text-gray-600 text-lg mb-2">
              This Page Is Where You Manage Your Own Classes
            </p>
            <p className="text-gray-600 mb-6">
              Such As Add Class, Transfer Student And Assign Teacher
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="gap-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Download Class QR
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Update Students
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      Upload Student Excel File
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-6">
                    <ExcelUploader onDataUpload={(data) => {
                      console.log('Uploaded data:', data);
                    }} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CreateClassDialog />
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-12">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Notes:</span> For Any Newly Created Records And Updates, 
            It Will May Take Up To 30 Minutes Before It Reflected In The Apps. 
            Kindly Click Refresh Data To Check (Android + IOS)
          </p>
        </div>

        <ClassFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <p className="text-sm text-gray-600 mb-8">Total Of {classes.length} Class(es)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classDetails, index) => (
            <ClassCard
              key={index}
              classDetails={classDetails}
              onClick={() => navigate(`/class/${classDetails.className}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
