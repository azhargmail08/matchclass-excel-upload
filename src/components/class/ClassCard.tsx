
import { FileEdit, Eye, ListFilter, Trash2 } from "lucide-react";
import { ClassDetails } from "@/pages/Class";

interface ClassCardProps {
  classDetails: ClassDetails;
  onClick: () => void;
}

export const ClassCard = ({ classDetails, onClick }: ClassCardProps) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 cursor-pointer"
      onClick={onClick}
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
  );
};
