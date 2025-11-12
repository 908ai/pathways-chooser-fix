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
          cost_comparison: Json | null
          created_at: string
          dropbox_link: string | null
          dropbox_path: string | null
          energy_insights: Json | null
          floor_area: number | null
          floor_points: number | null
          floor_rsi: number | null
          heating_efficiency: number | null
          heating_points: number | null
          heating_system_type: string | null
          hrv_erv_efficiency: number | null
          hrv_erv_points: number | null
          hrv_erv_type: string | null
          id: string
          location: string | null
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
          cost_comparison?: Json | null
          created_at?: string
          dropbox_link?: string | null
          dropbox_path?: string | null
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          heating_efficiency?: number | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          id?: string
          location?: string | null
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
          cost_comparison?: Json | null
          created_at?: string
          dropbox_link?: string | null
          dropbox_path?: string | null
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          heating_efficiency?: number | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          id?: string
          location?: string | null
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
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      get_user_company_name: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      insert_project_summary: {
        Args: {
          p_user_id: string
          p_project_name: string
          p_building_type: string
          p_location: string
          p_floor_area: number
          p_selected_pathway: string
          p_attic_rsi: number
          p_attic_points: number
          p_wall_rsi: number
          p_wall_points: number
          p_below_grade_rsi: number
          p_below_grade_points: number
          p_floor_rsi: number
          p_floor_points: number
          p_window_u_value: number
          p_window_points: number
          p_heating_system_type: string
          p_heating_efficiency: string
          p_heating_points: number
          p_cooling_system_type: string
          p_cooling_efficiency: number
          p_cooling_points: number
          p_water_heating_type: string
          p_water_heating_efficiency: number
          p_water_heating_points: number
          p_hrv_erv_type: string
          p_hrv_erv_efficiency: number
          p_hrv_erv_points: number
          p_airtightness_al: number
          p_airtightness_points: number
          p_building_volume: number
          p_volume_points: number
          p_annual_energy_consumption: number
          p_performance_compliance_result: string
          p_total_points: number
          p_compliance_status: string
          p_upgrade_costs: number
        }
        Returns: string
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "account_manager" | "user"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
      app_role: ["admin", "account_manager", "user"],
    },
  },
} as const