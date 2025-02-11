
import { ExcelRow, ColumnMapping } from "@/types";

export const processExcelData = (mapping: ColumnMapping, data: any[]): ExcelRow[] => {
  return data.map(row => ({
    name: row[mapping.name]?.toString().trim() || "",
    class: row[mapping.class]?.toString().trim() || "",
  }));
};

export const validateProcessedData = (data: ExcelRow[]): boolean => {
  return data.every(row => 
    row.name !== "" && 
    row.class !== ""
  );
};
