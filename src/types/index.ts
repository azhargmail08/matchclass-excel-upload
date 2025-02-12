
export interface Student {
  _id: string;
  name: string;
  class: string;
  nickname?: string;
  special_name?: string;
  matrix_number?: string;
  date_joined?: string;
  father_name?: string;
  father_id?: string;
  father_email?: string;
  mother_name?: string;
  mother_id?: string;
  mother_email?: string;
  contact_no?: string;
  teacher?: string;
}

export interface ExcelRow {
  name: string;
  class: string;
  nickname?: string;
  special_name?: string;
  matrix_number?: string;
  date_joined?: string;
  father_name?: string;
  father_id?: string;
  father_email?: string;
  mother_name?: string;
  mother_id?: string;
  mother_email?: string;
  contact_no?: string;
  teacher?: string;
}

export interface MatchResult {
  excelRow: ExcelRow;
  matches: Student[];
  selected?: Student;
}

export interface StudentChange {
  id: string;
  student_id: string;
  old_name: string;
  old_class: string;
  old_nickname?: string;
  new_name: string;
  new_class: string;
  new_nickname?: string;
  created_at: string;
  status: 'pending' | 'applied' | 'rolled_back';
  batch_id: string;
}

export interface ColumnMapping {
  name: string;
  class: string;
  nickname?: string;
  special_name?: string;
  matrix_number?: string;
  date_joined?: string;
  father_name?: string;
  father_id?: string;
  father_email?: string;
  mother_name?: string;
  mother_id?: string;
  mother_email?: string;
  contact_no?: string;
  teacher?: string;
}
