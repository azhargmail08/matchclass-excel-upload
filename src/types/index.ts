
export interface Student {
  id?: string;
  name: string;
  class: string;
}

export interface ExcelRow {
  name: string;
  class: string;
}

export interface MatchResult {
  excelRow: ExcelRow;
  matches: Student[];
  selected?: Student;
}
