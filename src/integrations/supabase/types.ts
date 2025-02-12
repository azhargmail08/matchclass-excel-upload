export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          created_at: string
          id: string
          name: string
          teacher: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          teacher?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          teacher?: string | null
        }
        Relationships: []
      }
      data_sync_batches: {
        Row: {
          created_at: string
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_sync_records: {
        Row: {
          batch_id: string | null
          created_at: string
          external_student_id: string | null
          id: string
          status: string | null
          student_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          external_student_id?: string | null
          id?: string
          status?: string | null
          student_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          external_student_id?: string | null
          id?: string
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_sync_records_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "data_sync_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_sync_records_external_student_id_fkey"
            columns: ["external_student_id"]
            isOneToOne: false
            referencedRelation: "external_students"
            referencedColumns: ["_id"]
          },
          {
            foreignKeyName: "data_sync_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["_id"]
          },
        ]
      }
      external_students: {
        Row: {
          _id: string
          class: string | null
          contact_no: string | null
          created_at: string
          date_joined: string | null
          father_email: string | null
          father_id: string | null
          father_name: string | null
          matrix_number: string | null
          mother_email: string | null
          mother_id: string | null
          mother_name: string | null
          name: string
          nickname: string | null
          special_name: string | null
        }
        Insert: {
          _id: string
          class?: string | null
          contact_no?: string | null
          created_at?: string
          date_joined?: string | null
          father_email?: string | null
          father_id?: string | null
          father_name?: string | null
          matrix_number?: string | null
          mother_email?: string | null
          mother_id?: string | null
          mother_name?: string | null
          name: string
          nickname?: string | null
          special_name?: string | null
        }
        Update: {
          _id?: string
          class?: string | null
          contact_no?: string | null
          created_at?: string
          date_joined?: string | null
          father_email?: string | null
          father_id?: string | null
          father_name?: string | null
          matrix_number?: string | null
          mother_email?: string | null
          mother_id?: string | null
          mother_name?: string | null
          name?: string
          nickname?: string | null
          special_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          school: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          school?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_changes: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          new_class: string
          new_name: string
          new_nickname: string | null
          old_class: string
          old_name: string
          old_nickname: string | null
          status: string | null
          student_id: string | null
          user_id: string | null
        }
        Insert: {
          batch_id?: string
          created_at?: string
          id?: string
          new_class: string
          new_name: string
          new_nickname?: string | null
          old_class: string
          old_name: string
          old_nickname?: string | null
          status?: string | null
          student_id?: string | null
          user_id?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          new_class?: string
          new_name?: string
          new_nickname?: string | null
          old_class?: string
          old_name?: string
          old_nickname?: string | null
          status?: string | null
          student_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_changes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["_id"]
          },
        ]
      }
      student_deletions: {
        Row: {
          batch_id: string
          deleted_at: string | null
          id: string
          status: string | null
          student_data: Json
          student_id: string
          user_id: string | null
        }
        Insert: {
          batch_id: string
          deleted_at?: string | null
          id?: string
          status?: string | null
          student_data: Json
          student_id: string
          user_id?: string | null
        }
        Update: {
          batch_id?: string
          deleted_at?: string | null
          id?: string
          status?: string | null
          student_data?: Json
          student_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_student_deletions_batch"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "data_sync_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          _id: string
          class: string
          contact_no: string | null
          date_joined: string | null
          father_email: string | null
          father_id: string | null
          father_name: string | null
          matrix_number: string | null
          mother_email: string | null
          mother_id: string | null
          mother_name: string | null
          name: string
          nickname: string | null
          special_name: string | null
          teacher: string | null
        }
        Insert: {
          _id: string
          class: string
          contact_no?: string | null
          date_joined?: string | null
          father_email?: string | null
          father_id?: string | null
          father_name?: string | null
          matrix_number?: string | null
          mother_email?: string | null
          mother_id?: string | null
          mother_name?: string | null
          name: string
          nickname?: string | null
          special_name?: string | null
          teacher?: string | null
        }
        Update: {
          _id?: string
          class?: string
          contact_no?: string | null
          date_joined?: string | null
          father_email?: string | null
          father_id?: string | null
          father_name?: string | null
          matrix_number?: string | null
          mother_email?: string | null
          mother_id?: string | null
          mother_name?: string | null
          name?: string
          nickname?: string | null
          special_name?: string | null
          teacher?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_class_name"
            columns: ["class"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
