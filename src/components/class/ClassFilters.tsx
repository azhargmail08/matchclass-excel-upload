
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, ChevronDown } from "lucide-react";

interface ClassFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ClassFilters = ({ searchQuery, setSearchQuery }: ClassFiltersProps) => {
  return (
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
  );
};
