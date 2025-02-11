import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ClassDetails {
  className: string;
  teacher: string;
  students: Student[];
}

const Class = () => {
  const navigate = useNavigate();
  const { className } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);

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
        
        // If we have a className parameter, find and set the selected class
        if (className) {
          const foundClass = Object.values(classGroups).find(c => c.className === className);
          if (foundClass) {
            setSelectedClass(foundClass);
          }
        }
      }
    };

    fetchClassesAndStudents();
  }, [className]);

  // If we have a className parameter, show the class details view
  if (className && selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedClass.className}</h1>
              <p className="text-gray-600 text-lg">
                Teacher: {selectedClass.teacher}
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
                <p className="text-4xl font-bold">{selectedClass.students.length}</p>
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
                      {selectedClass.teacher.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedClass.teacher}</p>
                    <p className="text-sm text-gray-500">Main Teacher</p>
                  </div>
                </div>
                <Button variant="outline" className="text-red-500 hover:text-red-600">
                  Unassign
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Students</h2>
              <Button variant="outline" className="gap-2">
                Transfer Selected Student(s)
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Search Student"
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select className="border rounded-lg px-4 py-2">
                    <option>Sort A-Z</option>
                    <option>Sort Z-A</option>
                  </select>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name on Badges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Matrix No.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedClass.students
                    .filter(student => 
                      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.nickname || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm">
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the classes list view
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
              onClick={() => navigate(`/class/${classDetails.className}`)}
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
      </div>
    </div>
  );
};

export default Class;
