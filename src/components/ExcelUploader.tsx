
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { ExcelRow, ColumnMapping } from "@/types";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface ExcelUploaderProps {
  onDataUpload: (data: ExcelRow[]) => void;
}

export const ExcelUploader = ({ onDataUpload }: ExcelUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ name: "", class: "" });
  const [rawData, setRawData] = useState<any[]>([]);
  const { toast } = useToast();

  const processExcelData = (mapping: ColumnMapping, data: any[]): ExcelRow[] => {
    return data.map(row => ({
      name: row[mapping.name]?.toString().trim() || "",
      class: row[mapping.class]?.toString().trim() || "",
    }));
  };

  const validateProcessedData = (data: ExcelRow[]): boolean => {
    return data.every(row => 
      row.name !== "" && 
      row.class !== ""
    );
  };

  const handleConfirmMapping = () => {
    if (!columnMapping.name || !columnMapping.class) {
      toast({
        title: "Error",
        description: "Please map both name and class columns",
        variant: "destructive",
      });
      return;
    }

    const processedData = processExcelData(columnMapping, rawData);

    if (!validateProcessedData(processedData)) {
      toast({
        title: "Error",
        description: "Some rows contain empty values after mapping",
        variant: "destructive",
      });
      return;
    }

    onDataUpload(processedData);
    toast({
      title: "Success",
      description: `Uploaded ${processedData.length} records successfully`,
    });
    setShowMapping(false);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binary = event.target?.result;
          if (!binary) {
            throw new Error("Failed to read file");
          }

          const workbook = XLSX.read(binary, { type: "binary" });
          
          if (!workbook.SheetNames.length) {
            throw new Error("Excel file contains no sheets");
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No data found in Excel file");
          }

          // Get column headers from the first row
          const columns = Object.keys(data[0]);
          if (columns.length < 2) {
            throw new Error("Excel file must contain at least two columns");
          }

          setAvailableColumns(columns);
          setRawData(data);
          setShowMapping(true);

        } catch (error) {
          console.error("Excel parsing error:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to parse Excel file",
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive",
        });
      };

      reader.readAsBinaryString(file);
    },
    [toast]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`w-full max-w-xl mx-auto mt-8 p-12 rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer
          ${
            isDragging
              ? "border-sage-500 bg-sage-50"
              : "border-gray-300 hover:border-sage-400 bg-white"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Upload
            className={`w-12 h-12 ${
              isDragging ? "text-sage-500" : "text-gray-400"
            }`}
          />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Upload Excel File
            </h3>
            <p className="text-sm text-gray-500">
              Drag and drop your Excel file here, or click to select
            </p>
            <p className="text-xs text-gray-400">
              Supports: .xlsx, .xls
            </p>
            <p className="text-xs text-gray-400">
              File must contain columns for student name and class
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showMapping} onOpenChange={setShowMapping}>
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
                  setColumnMapping((prev) => ({ ...prev, name: value }))
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
                  setColumnMapping((prev) => ({ ...prev, class: value }))
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
            <Button variant="outline" onClick={() => setShowMapping(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmMapping}>
              Confirm Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
