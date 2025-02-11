
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

interface ColumnMappingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableColumns: string[];
  columnMapping: ColumnMappingType;
  onColumnMappingChange: (mapping: ColumnMappingType) => void;
  onConfirm: () => void;
}

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-h-[80vh] overflow-y-auto w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">Map Excel Columns</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <label className="text-sm sm:text-right">Name Column:</label>
            <div className="col-span-1 sm:col-span-3">
              <Select
                value={columnMapping.name}
                onValueChange={(value) =>
                  onColumnMappingChange({ ...columnMapping, name: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select name column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <label className="text-sm sm:text-right">Class Column:</label>
            <div className="col-span-1 sm:col-span-3">
              <Select
                value={columnMapping.class}
                onValueChange={(value) =>
                  onColumnMappingChange({ ...columnMapping, class: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
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
