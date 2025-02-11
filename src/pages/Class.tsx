
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

const Class = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const className = "1A"; // Hardcoded for now, could be made dynamic later

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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Classes</h1>
            <p className="text-gray-600 mb-2">
              This Page Is Where You Manage Your Own Classes
            </p>
            <p className="text-gray-600 mb-2">
              Such As Add Class, Transfer Student And Assign Teacher
            </p>
            <div className="mt-6">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Class QR
              </Button>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Class
          </Button>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Notes:</span> For Any Newly Created Records And Updates, 
            It Will May Take Up To 30 Minutes Before It Reflected In The Apps. 
            Kindly Click Refresh Data To Check (Android + IOS)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Class Level</label>
            <div className="relative">
              <button className="w-full flex items-center justify-between bg-white border rounded-md px-4 py-2 text-left">
                <span className="text-gray-500">Nothing Selected</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Class Year</label>
            <div className="relative">
              <button className="w-full flex items-center justify-between bg-white border rounded-md px-4 py-2 text-left">
                <span className="text-gray-500">Nothing Selected</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Class Status</label>
            <div className="relative">
              <button className="w-full flex items-center justify-between bg-white border rounded-md px-4 py-2 text-left">
                <span className="text-gray-500">Nothing Selected</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Class"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-6">Total Of 56 Class(es)</p>

        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">
                {index === 0 ? "1 ALIA" : "1 AMANAH"}
              </h3>
              <div className="space-y-2 mb-6">
                <p className="text-sm">
                  <span className="text-gray-500">Level:</span> 1
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Year:</span> 2024
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">No Of Students:</span>{" "}
                  {index === 0 ? "8" : "22"}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Eye className="w-4 h-4 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <FileEdit className="w-4 h-4 text-green-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <ListFilter className="w-4 h-4 text-yellow-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Trash2 className="w-4 h-4 text-red-500" />
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
