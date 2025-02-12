
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

// New function to normalize column names
export const normalizeColumnName = (column: string): string => {
  return column
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, ''); // Remove any characters that aren't letters, numbers, or underscores
};

// Map Excel columns to our internal field names
export const columnMappingGuide: { [key: string]: string } = {
  'date_joined': 'date_joined',
  'father': 'father_name',
  'father_id': 'father_id',
  'father_email': 'father_email',
  'mother': 'mother_name',
  'mother_id': 'mother_id',
  'mother_email': 'mother_email',
  'contact_no': 'contact_no',
  'class': 'class',
};
