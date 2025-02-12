
import { ExcelRow, ColumnMapping } from "@/types";

export const processExcelData = (mapping: ColumnMapping, data: any[]): ExcelRow[] => {
  return data.map(row => {
    const processedRow: ExcelRow = {
      name: row[mapping.name]?.toString().trim() || "",
      class: row[mapping.class]?.toString().trim() || "",
    };

    // Process optional fields
    const optionalFields: (keyof ColumnMapping)[] = [
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

    optionalFields.forEach(field => {
      if (mapping[field] && row[mapping[field]]) {
        processedRow[field] = row[mapping[field]]?.toString().trim();
      }
    });

    return processedRow;
  });
};

export const validateProcessedData = (data: ExcelRow[]): boolean => {
  return data.every(row => 
    row.name !== "" && 
    row.class !== ""
  );
};
