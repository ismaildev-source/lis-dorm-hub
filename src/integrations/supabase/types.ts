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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          password: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          password: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          password?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          absent_reason: string | null
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          comments: string | null
          created_at: string | null
          date: string
          grade_level: Database["public"]["Enums"]["grade_level"]
          id: string
          is_doing_nothing: boolean | null
          is_late: boolean | null
          is_leave_early: boolean | null
          is_noise: boolean | null
          student_id: string
          study_type: Database["public"]["Enums"]["study_type"]
          supervisor_id: string
          updated_at: string | null
        }
        Insert: {
          absent_reason?: string | null
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          comments?: string | null
          created_at?: string | null
          date: string
          grade_level: Database["public"]["Enums"]["grade_level"]
          id?: string
          is_doing_nothing?: boolean | null
          is_late?: boolean | null
          is_leave_early?: boolean | null
          is_noise?: boolean | null
          student_id: string
          study_type: Database["public"]["Enums"]["study_type"]
          supervisor_id: string
          updated_at?: string | null
        }
        Update: {
          absent_reason?: string | null
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          comments?: string | null
          created_at?: string | null
          date?: string
          grade_level?: Database["public"]["Enums"]["grade_level"]
          id?: string
          is_doing_nothing?: boolean | null
          is_late?: boolean | null
          is_leave_early?: boolean | null
          is_noise?: boolean | null
          student_id?: string
          study_type?: Database["public"]["Enums"]["study_type"]
          supervisor_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisor_users"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_users: {
        Row: {
          contact: string | null
          created_at: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          password: string
          student_id: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          password: string
          student_id?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          password?: string
          student_id?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_parent_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_users: {
        Row: {
          age: number | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          grade_level: Database["public"]["Enums"]["grade_level"]
          home_address: string | null
          id: string
          name: string
          parent_contact: string | null
          parent_name: string | null
          password: string
          room: string
          shoe_rack_number: string | null
          stream: Database["public"]["Enums"]["stream_type"]
          supervisor_id: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          grade_level: Database["public"]["Enums"]["grade_level"]
          home_address?: string | null
          id?: string
          name: string
          parent_contact?: string | null
          parent_name?: string | null
          password: string
          room: string
          shoe_rack_number?: string | null
          stream: Database["public"]["Enums"]["stream_type"]
          supervisor_id?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          grade_level?: Database["public"]["Enums"]["grade_level"]
          home_address?: string | null
          id?: string
          name?: string
          parent_contact?: string | null
          parent_name?: string | null
          password?: string
          room?: string
          shoe_rack_number?: string | null
          stream?: Database["public"]["Enums"]["stream_type"]
          supervisor_id?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_student_supervisor"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisor_users"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisor_users: {
        Row: {
          contact: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          password: string
          room: string
          updated_at: string | null
          username: string
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          password: string
          room: string
          updated_at?: string | null
          username: string
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          password?: string
          room?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status: "Present" | "Absent"
      gender_type: "Male" | "Female"
      grade_level: "Year 9" | "Year 10" | "Year 11" | "Year 12" | "Year 13"
      stream_type: "A" | "B" | "C" | "D"
      study_type:
        | "Prep1 19:10-20:00"
        | "Prep2 21:10-22:00"
        | "Saturday Study Time"
        | "Sunday Study Time"
        | "Extra/Special Study Time"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["Present", "Absent"],
      gender_type: ["Male", "Female"],
      grade_level: ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
      stream_type: ["A", "B", "C", "D"],
      study_type: [
        "Prep1 19:10-20:00",
        "Prep2 21:10-22:00",
        "Saturday Study Time",
        "Sunday Study Time",
        "Extra/Special Study Time",
      ],
    },
  },
} as const
