
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
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Class = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const className = "1A";

  useEffect(() => {
    const fetchClassStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', className);
      
      if (!error && data) {
        setStudents(data);
      }
    };

    fetchClassStudents();
  }, []);

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
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        <p className="text-sm text-gray-600 mb-8">Total Of 56 Class(es)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {index === 0 ? "1 ALIA" : "1 AMANAH"}
              </h3>
              <div className="space-y-3 mb-6">
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">Level:</span>
                  <span className="text-gray-700">1</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">Year:</span>
                  <span className="text-gray-700">2024</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="text-gray-500 min-w-20">No Of Students:</span>
                  <span className="text-gray-700">{index === 0 ? "8" : "22"}</span>
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

