
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface StudentTableHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRollback: () => void;
}

export const StudentTableHeader = ({
  searchQuery,
  onSearchChange,
  onRollback
}: StudentTableHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <Input
        placeholder="Search Student"
        className="w-full sm:max-w-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRollback}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Rollback Changes
        </Button>
        <select className="border rounded-lg px-4 py-2 w-full sm:w-auto">
          <option>Sort A-Z</option>
          <option>Sort Z-A</option>
        </select>
      </div>
    </div>
  );
};
