
import { Checkbox } from "@/components/ui/checkbox";
import { Student, MatchResult } from "@/types";

interface MatchRowProps {
  match: MatchResult;
  index: number;
  isChecked: boolean;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onSelect: (index: number, student: Student | undefined) => void;
}

export const MatchRow = ({
  match,
  index,
  isChecked,
  onCheckboxChange,
  onSelect,
}: MatchRowProps) => {
  return (
    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-start space-x-4">
        <Checkbox
          id={`row-${index}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckboxChange(index, checked as boolean)}
        />
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Excel Entry: {match.excelRow.name}
              </p>
              <p className="text-sm text-gray-500">
                Class: {match.excelRow.class}
              </p>
            </div>
            <div className="flex-1 max-w-md ml-4">
              <select
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                value={match.selected?._id || ""}
                onChange={(e) => {
                  const selected = match.matches.find(
                    (s) => s._id === e.target.value
                  );
                  onSelect(index, selected);
                }}
              >
                {match.matches.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.class})
                  </option>
                ))}
                <option value="">Select a match...</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
