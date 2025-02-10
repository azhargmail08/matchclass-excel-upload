
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { ExcelRow } from "@/types";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExcelUploaderProps {
  onDataUpload: (data: ExcelRow[]) => void;
}

export const ExcelUploader = ({ onDataUpload }: ExcelUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binary = event.target?.result;
          const workbook = XLSX.read(binary, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
          
          if (data.length === 0) {
            toast({
              title: "Error",
              description: "The Excel file appears to be empty",
              variant: "destructive",
            });
            return;
          }

          onDataUpload(data);
          toast({
            title: "Success",
            description: `Uploaded ${data.length} records successfully`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse Excel file",
            variant: "destructive",
          });
        }
      };

      reader.readAsBinaryString(file);
    },
    [onDataUpload, toast]
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
        </div>
      </div>
    </div>
  );
};
