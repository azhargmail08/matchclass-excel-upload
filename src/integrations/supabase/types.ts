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
      class_transfers: {
        Row: {
          from_class: string
          id: string
          student_id: string
          to_class: string
          transferred_at: string | null
          user_id: string
        }
        Insert: {
          from_class: string
          id?: string
          student_id: string
          to_class: string
          transferred_at?: string | null
          user_id: string
        }
        Update: {
          from_class?: string
          id?: string
          student_id?: string
          to_class?: string
          transferred_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_transfers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "internal_database"
            referencedColumns: ["_id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          teacher: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          teacher?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          teacher?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      data_sync_batches: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_sync_records: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          status: string | null
          student_id: string
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          student_id: string
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_sync_records_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "data_sync_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      external_database: {
        Row: {
          _id: string
          Class: string
          "Contact No": number | null
          "Date Joined": string | null
          Father: string | null
          "Father Email": string | null
          "Father ID": string | null
          "Matrix Number": number | null
          Mother: string | null
          "Mother Email": string | null
          "Mother ID": number | null
          Name: string
          Nickname: string | null
          "Special Name": string | null
        }
        Insert: {
          _id: string
          Class: string
          "Contact No"?: number | null
          "Date Joined"?: string | null
          Father?: string | null
          "Father Email"?: string | null
          "Father ID"?: string | null
          "Matrix Number"?: number | null
          Mother?: string | null
          "Mother Email"?: string | null
          "Mother ID"?: number | null
          Name: string
          Nickname?: string | null
          "Special Name"?: string | null
        }
        Update: {
          _id?: string
          Class?: string
          "Contact No"?: number | null
          "Date Joined"?: string | null
          Father?: string | null
          "Father Email"?: string | null
          "Father ID"?: string | null
          "Matrix Number"?: number | null
          Mother?: string | null
          "Mother Email"?: string | null
          "Mother ID"?: number | null
          Name?: string
          Nickname?: string | null
          "Special Name"?: string | null
        }
        Relationships: []
      }
      internal_database: {
        Row: {
          _id: string
          Class: string | null
          "Contact No": number | null
          "Date Joined": string | null
          Father: string | null
          "Father Email": string | null
          "Father ID": number | null
          "Matrix Number": string | null
          Mother: string | null
          "Mother Email": string | null
          "Mother ID": number | null
          Name: string
          Nickname: string | null
          "Special Name": string | null
        }
        Insert: {
          _id: string
          Class?: string | null
          "Contact No"?: number | null
          "Date Joined"?: string | null
          Father?: string | null
          "Father Email"?: string | null
          "Father ID"?: number | null
          "Matrix Number"?: string | null
          Mother?: string | null
          "Mother Email"?: string | null
          "Mother ID"?: number | null
          Name: string
          Nickname?: string | null
          "Special Name"?: string | null
        }
        Update: {
          _id?: string
          Class?: string | null
          "Contact No"?: number | null
          "Date Joined"?: string | null
          Father?: string | null
          "Father Email"?: string | null
          "Father ID"?: number | null
          "Matrix Number"?: string | null
          Mother?: string | null
          "Mother Email"?: string | null
          "Mother ID"?: number | null
          Name?: string
          Nickname?: string | null
          "Special Name"?: string | null
        }
        Relationships: []
      }
      student_changes: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          new_class: string
          new_name: string
          new_nickname: string | null
          old_class: string
          old_name: string
          old_nickname: string | null
          status: string | null
          student_id: string
          user_id: string
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          new_class: string
          new_name: string
          new_nickname?: string | null
          old_class: string
          old_name: string
          old_nickname?: string | null
          status?: string | null
          student_id: string
          user_id: string
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          new_class?: string
          new_name?: string
          new_nickname?: string | null
          old_class?: string
          old_name?: string
          old_nickname?: string | null
          status?: string | null
          student_id?: string
          user_id?: string
        }
        Relationships: []
      }
      student_deletions: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          status: string | null
          student_data: Json
          student_id: string
          user_id: string
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          student_data: Json
          student_id: string
          user_id: string
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          student_data?: Json
          student_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_deletions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "data_sync_batches"
            referencedColumns: ["id"]
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
