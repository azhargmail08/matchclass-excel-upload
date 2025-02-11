
import { useState } from "react";
import { ExcelRow, ColumnMapping } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { DropZone } from "./excel-uploader/DropZone";
import { ColumnMapping as ColumnMappingDialog } from "./excel-uploader/ColumnMapping";
import { processExcelData, validateProcessedData } from "./excel-uploader/utils";
import { DataComparison } from "./DataComparison";

interface ExcelUploaderProps {
  onDataUpload: (data: ExcelRow[]) => void;
}

export const ExcelUploader = ({ onDataUpload }: ExcelUploaderProps) => {
  const [showMapping, setShowMapping] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ name: "", class: "" });
  const [rawData, setRawData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<ExcelRow[]>([]);
  const { toast } = useToast();

  const handleConfirmMapping = () => {
    const processed = processExcelData(columnMapping, rawData);

    if (!validateProcessedData(processed)) {
      toast({
        title: "Error",
        description: "Some rows contain empty values after mapping",
        variant: "destructive",
      });
      return;
    }

    setProcessedData(processed);
    onDataUpload(processed);
    setShowMapping(false);
  };

  const handleExcelParsed = (data: any[], columns: string[]) => {
    setAvailableColumns(columns);
    setRawData(data);
    setShowMapping(true);
  };

  return (
    <>
      <DropZone onExcelParsed={handleExcelParsed} />

      <ColumnMappingDialog
        open={showMapping}
        onOpenChange={setShowMapping}
        availableColumns={availableColumns}
        columnMapping={columnMapping}
        onColumnMappingChange={setColumnMapping}
        onConfirm={handleConfirmMapping}
      />

      {processedData.length > 0 && (
        <DataComparison excelData={processedData} />
      )}
    </>
  );
};
