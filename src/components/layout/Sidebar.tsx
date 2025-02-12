
import { ArrowDown, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  onClassClick: () => void;
}

export const Sidebar = ({ onClassClick }: SidebarProps) => {
  const [isManageOpen, setIsManageOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <nav className="p-4">
        <div>
          <button
            onClick={() => setIsManageOpen(!isManageOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-[#1E33F2] hover:bg-[#1E33F2]/90 rounded-[30px]"
          >
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              <span>Manage</span>
            </div>
            {isManageOpen ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
          {isManageOpen && (
            <div className="ml-6 mt-2">
              <button
                onClick={onClassClick}
                className={`flex items-center px-4 py-2 text-sm rounded-md w-full ${
                  isActive("/class/1A")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                <span>Class</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
