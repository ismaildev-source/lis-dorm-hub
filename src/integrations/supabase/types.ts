export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          study_types: string[] | null
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
          study_types?: string[] | null
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
          study_types?: string[] | null
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
      leave_requests: {
        Row: {
          approved_by: string | null
          checked_out_at: string | null
          created_at: string
          departure_date: string
          departure_time: string
          destination: string
          emergency_contact: string
          id: string
          reason: string
          rejected_by: string | null
          rejection_reason: string | null
          return_date: string
          return_time: string
          returned_at: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          checked_out_at?: string | null
          created_at?: string
          departure_date: string
          departure_time: string
          destination: string
          emergency_contact: string
          id?: string
          reason: string
          rejected_by?: string | null
          rejection_reason?: string | null
          return_date: string
          return_time: string
          returned_at?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          checked_out_at?: string | null
          created_at?: string
          departure_date?: string
          departure_time?: string
          destination?: string
          emergency_contact?: string
          id?: string
          reason?: string
          rejected_by?: string | null
          rejection_reason?: string | null
          return_date?: string
          return_time?: string
          returned_at?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_users"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
