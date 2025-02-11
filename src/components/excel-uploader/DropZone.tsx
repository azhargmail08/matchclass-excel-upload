
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DropZoneProps {
  onExcelParsed: (data: any[], columns: string[]) => void;
}

export const DropZone = ({ onExcelParsed }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const { toast } = useToast();

  const processSheet = (sheetName: string) => {
    if (!workbook) return;

    try {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data found in selected sheet");
      }

      // Get column headers from the first row
      const columns = Object.keys(data[0]);
      if (columns.length < 2) {
        throw new Error("Excel sheet must contain at least two columns");
      }

      onExcelParsed(data, columns);
      setShowSheetSelector(false);
      setWorkbook(null);
      setSelectedSheet("");

    } catch (error) {
      console.error("Sheet processing error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process sheet",
        variant: "destructive",
      });
    }
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

          const wb = XLSX.read(binary, { type: "binary" });
          
          if (!wb.SheetNames.length) {
            throw new Error("Excel file contains no sheets");
          }

          setWorkbook(wb);
          setShowSheetSelector(true);

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

      <Dialog open={showSheetSelector} onOpenChange={setShowSheetSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Sheet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedSheet} onValueChange={setSelectedSheet}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sheet" />
              </SelectTrigger>
              <SelectContent>
                {workbook?.SheetNames.map((sheetName) => (
                  <SelectItem key={sheetName} value={sheetName}>
                    {sheetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSheetSelector(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => processSheet(selectedSheet)}
              disabled={!selectedSheet}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

