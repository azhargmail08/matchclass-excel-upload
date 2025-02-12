
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnMapping as ColumnMappingType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColumnMappingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableColumns: string[];
  columnMapping: ColumnMappingType;
  onColumnMappingChange: (mapping: ColumnMappingType) => void;
  onConfirm: () => void;
}

const REQUIRED_FIELDS = ['name', 'class'];
const OPTIONAL_FIELDS = [
  'nickname',
  'special_name',
  'matrix_number',
  'date_joined',
  'father_name',
  'father_id',
  'father_email',
  'mother_name',
  'mother_id',
  'mother_email',
  'contact_no',
  'teacher'
];

const NONE_VALUE = '__none__';

export const ColumnMapping = ({
  open,
  onOpenChange,
  availableColumns,
  columnMapping,
  onColumnMappingChange,
  onConfirm,
}: ColumnMappingProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!columnMapping.name || !columnMapping.class) {
      toast({
        title: "Error",
        description: "Please map both name and class columns",
        variant: "destructive",
      });
      return;
    }
    onConfirm();
  };

  const handleValueChange = (field: keyof ColumnMappingType, value: string) => {
    onColumnMappingChange({
      ...columnMapping,
      [field]: value === NONE_VALUE ? '' : value
    });
  };

  const getSelectValue = (field: keyof ColumnMappingType) => {
    const value = columnMapping[field];
    return value || NONE_VALUE;
  };

  const renderFieldMapping = (field: string, required: boolean = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 py-2">
      <label className="text-sm sm:text-right capitalize">
        {field.replace(/_/g, ' ')}:
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="col-span-1 sm:col-span-3">
        <Select
          value={getSelectValue(field as keyof ColumnMappingType)}
          onValueChange={(value) => handleValueChange(field as keyof ColumnMappingType, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.replace(/_/g, ' ')} column`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>None</SelectItem>
            {availableColumns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-h-[80vh] w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">Map Excel Columns</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Required Fields</h3>
              {REQUIRED_FIELDS.map((field) => renderFieldMapping(field, true))}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Optional Fields</h3>
              {OPTIONAL_FIELDS.map((field) => renderFieldMapping(field))}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full sm:w-auto">
            Confirm Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
