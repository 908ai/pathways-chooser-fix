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
      companies: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string | null
          created_at: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_email?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          feedback_text: string
          id: string
          page_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          feedback_text: string
          id?: string
          page_url?: string | null
          status?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          feedback_text?: string
          id?: string
          page_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_responses: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          is_read: boolean
          response_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          is_read?: boolean
          response_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          is_read?: boolean
          response_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      file_requests: {
        Row: {
          created_at: string
          file_request_url: string
          folder_name: string
          folder_path: string
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_request_url: string
          folder_name: string
          folder_path: string
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_request_url?: string
          folder_name?: string
          folder_path?: string
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          profile_type: string | null
          updated_at: string | null
          can_access_providers: boolean
        }
        Insert: {
          id: string
          profile_type?: string | null
          updated_at?: string | null
          can_access_providers?: boolean
        }
        Update: {
          id?: string
          profile_type?: string | null
          updated_at?: string | null
          can_access_providers?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_summaries: {
        Row: {
          airtightness_al: number | null
          airtightness_points: number | null
          annual_energy_consumption: number | null
          attic_points: number | null
          attic_rsi: number | null
          below_grade_points: number | null
          below_grade_rsi: number | null
          building_type: string | null
          building_volume: number | null
          city: string | null
          climate_zone: string | null
          compliance_status: string | null
          cooling_efficiency: number | null
          cooling_points: number | null
          cooling_system_type: string | null
          created_at: string
          energy_insights: Json | null
          floor_area: number | null
          floor_points: number | null
          floor_rsi: number | null
          heating_efficiency: string | null
          heating_points: number | null
          heating_system_type: string | null
          hrv_erv_efficiency: number | null
          hrv_erv_points: number | null
          hrv_erv_type: string | null
          id: string
          location: string | null
          mid_construction_blower_door_planned: boolean | null
          occupancy_class: string | null
          performance_compliance_result: string | null
          postal_code: string | null
          project_name: string
          province: string | null
          recommendations: string[] | null
          selected_pathway: string | null
          street_address: string | null
          total_points: number | null
          unit_number: string | null
          updated_at: string
          upgrade_costs: number | null
          uploaded_files: Json | null
          user_id: string
          volume_points: number | null
          wall_points: number | null
          wall_rsi: number | null
          water_heating_efficiency: number | null
          water_heating_points: number | null
          water_heating_type: string | null
          window_points: number | null
          window_u_value: number | null
          secondary_heating_system_type: string | null
          secondary_heating_efficiency: string | null
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          airtightness_al?: number | null
          airtightness_points?: number | null
          annual_energy_consumption?: number | null
          attic_points?: number | null
          attic_rsi?: number | null
          below_grade_points?: number | null
          below_grade_rsi?: number | null
          building_type?: string | null
          building_volume?: number | null
          city?: string | null
          climate_zone?: string | null
          compliance_status?: string | null
          cooling_efficiency?: number | null
          cooling_points?: number | null
          cooling_system_type?: string | null
          created_at?: string
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          heating_efficiency?: string | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          id?: string
          location?: string | null
          mid_construction_blower_door_planned?: boolean | null
          occupancy_class?: string | null
          performance_compliance_result?: string | null
          postal_code?: string | null
          project_name: string
          province?: string | null
          recommendations?: string[] | null
          selected_pathway?: string | null
          street_address?: string | null
          total_points?: number | null
          unit_number?: string | null
          updated_at?: string
          upgrade_costs?: number | null
          uploaded_files?: Json | null
          user_id: string
          volume_points?: number | null
          wall_points?: number | null
          wall_rsi?: number | null
          water_heating_efficiency?: number | null
          water_heating_points?: number | null
          water_heating_type?: string | null
          window_points?: number | null
          window_u_value?: number | null
          secondary_heating_system_type?: string | null
          secondary_heating_efficiency?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          airtightness_al?: number | null
          airtightness_points?: number | null
          annual_energy_consumption?: number | null
          attic_points?: number | null
          attic_rsi?: number | null
          below_grade_points?: number | null
          below_grade_rsi?: number | null
          building_type?: string | null
          building_volume?: number | null
          city?: string | null
          climate_zone?: string | null
          compliance_status?: string | null
          cooling_efficiency?: number | null
          cooling_points?: number | null
          cooling_system_type?: string | null
          created_at?: string
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          heating_efficiency?: string | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          id?: string
          location?: string | null
          mid_construction_blower_door_planned?: boolean | null
          occupancy_class?: string | null
          performance_compliance_result?: string | null
          postal_code?: string | null
          project_name?: string
          province?: string | null
          recommendations?: string[] | null
          selected_pathway?: string | null
          street_address?: string | null
          total_points?: number | null
          unit_number?: string | null
          updated_at?: string
          upgrade_costs?: number | null
          uploaded_files?: Json | null
          user_id?: string
          volume_points?: number | null
          wall_points?: number | null
          wall_rsi?: number | null
          water_heating_efficiency?: number | null
          water_heating_points?: number | null
          water_heating_type?: string | null
          window_points?: number | null
          window_u_value?: number | null
          secondary_heating_system_type?: string | null
          secondary_heating_efficiency?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: []
      }
      provider_access_requests: {
        Row: {
          id: string
          user_id: string
          status: string
          requested_at: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_access_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_access_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      service_providers: {
        Row: {
          id: string
          created_at: string
          name: string
          service_category: string
          location_city: string | null
          location_province: string | null
          contact_email: string | null
          phone_number: string | null
          website: string | null
          description: string | null
          logo_url: string | null
          is_approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          service_category: string
          location_city?: string | null
          location_province?: string | null
          contact_email?: string | null
          phone_number?: string | null
          website?: string | null
          description?: string | null
          logo_url?: string | null
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          service_category?: string
          location_city?: string | null
          location_province?: string | null
          contact_email?: string | null
          phone_number?: string | null
          website?: string | null
          description?: string | null
          logo_url?: string | null
          is_approved?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          _user_id: string
        }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_access_requests_with_user_details: {
        Args: Record<string, never>
        Returns: {
          id: string
          user_id: string
          requested_at: string
          status: string
          email: string | null
          phone: string | null
        }[]
      }
      get_feedback_with_user_details: {
        Args: Record<string, never>
        Returns: {
          id: string
          created_at: string
          user_id: string
          feedback_text: string
          category: string
          page_url: string | null
          status: string
          user_email: string | null
        }[]
      }
      user_can_access_providers: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "account_manager" | "user"
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