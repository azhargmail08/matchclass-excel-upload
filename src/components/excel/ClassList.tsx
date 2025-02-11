
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ClassListProps {
  classes: string[];
  onClassClick: (className: string) => void;
}

export const ClassList = ({ classes, onClassClick }: ClassListProps) => {
  return (
    <div className="py-4 flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {classes.map((className) => (
          <Button
            key={className}
            variant="outline"
            onClick={() => onClassClick(className)}
            className="flex items-center gap-2"
          >
            {className}
            <ArrowRight className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};
