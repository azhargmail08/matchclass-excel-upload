
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download,
  Filter,
  Search,
  Plus,
  ChevronDown,
  FileEdit,
  Eye,
  ListFilter,
  Trash2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface ClassDetails {
  className: string;
  teacher: string;
  students: Student[];
}

const Class = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchClassesAndStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (!error && data) {
        setStudents(data);
        // Group students by class and get unique classes with their teachers
        const classGroups = data.reduce((acc: { [key: string]: ClassDetails }, student) => {
          if (!acc[student.class]) {
            acc[student.class] = {
              className: student.class,
              teacher: student.teacher,
              students: []
            };
          }
          acc[student.class].students.push(student);
          return acc;
        }, {});
        
        setClasses(Object.values(classGroups));
      }
    };

    fetchClassesAndStudents();
  }, []);

  const handleClassClick = (classDetails: ClassDetails) => {
    setSelectedClass(classDetails);
    setIsDialogOpen(true);
  };

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
            <Button 
              variant="outline" 
              className="gap-2 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download Class QR
            </Button>
          </div>
          <Button 
            className="gap-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Class
          </Button>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-12">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Notes:</span> For Any Newly Created Records And Updates, 
            It Will May Take Up To 30 Minutes Before It Reflected In The Apps. 
            Kindly Click Refresh Data To Check (Android + IOS)
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <label className="text-sm font-medium mb-2 block text-gray-700">Class Level</label>
                <div className="relative">
                  <button className="w-full flex items-center justify-between bg-white border rounded-lg px-4 py-2.5 text-left hover:border-blue-400 transition-colors">
                    <span className="text-gray-500">Nothing Selected</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium mb-2 block text-gray-700">Class Year</label>
                <div className="relative">
                  <button className="w-full flex items-center justify-between bg-white border rounded-lg px-4 py-2.5 text-left hover:border-blue-400 transition-colors">
                    <span className="text-gray-500">Nothing Selected</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium mb-2 block text-gray-700">Class Status</label>
                <div className="relative">
                  <button className="w-full flex items-center justify-between bg-white border rounded-lg px-4 py-2.5 text-left hover:border-blue-400 transition-colors">
                    <span className="text-gray-500">Nothing Selected</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search Class"
                  className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-400 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-600 mb-8">Total Of {classes.length} Class(es)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classDetails, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 cursor-pointer"
              onClick={() => handleClassClick(classDetails)}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {classDetails.className}
                </h3>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">Level:</span>
                  <span className="text-gray-700">{classDetails.className.split(' ')[0]}</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">Teacher:</span>
                  <span className="text-gray-700">{classDetails.teacher}</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">Year:</span>
                  <span className="text-gray-700">2024</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">No Of Students:</span>
                  <span className="text-gray-700">{classDetails.students.length}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                  <Eye className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-green-50 rounded-lg transition-colors group">
                  <FileEdit className="w-4 h-4 text-green-500 group-hover:text-green-600" />
                </button>
                <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group">
                  <ListFilter className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                  <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Class Details: {selectedClass?.className}</span>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="mb-6">
                <h4 className="font-medium text-gray-700">Teacher</h4>
                <p className="text-gray-600">{selectedClass?.teacher}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-4">Students</h4>
                <div className="space-y-2">
                  {selectedClass?.students.map((student, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-700">{student.name}</span>
                      {student.nickname && (
                        <span className="text-sm text-gray-500">({student.nickname})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Class;
