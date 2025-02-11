
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map Excel Columns</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">Name Column:</label>
            <Select
              value={columnMapping.name}
              onValueChange={(value) =>
                onColumnMappingChange({ ...columnMapping, name: value })
              }
            >
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">Class Column:</label>
            <Select
              value={columnMapping.class}
              onValueChange={(value) =>
                onColumnMappingChange({ ...columnMapping, class: value })
              }
            >
              <SelectTrigger className="col-span-3">
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
