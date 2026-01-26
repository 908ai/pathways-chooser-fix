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
      resources: {
        Row: {
          id: string
          title: string
          description: string
          url: string
          category: string
          logo_url: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          url: string
          category: string
          logo_url?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          url?: string
          category?: string
          logo_url?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          can_access_providers: boolean
          id: string
          profile_type: string | null
          updated_at: string | null
          verification_status: string | null
          verification_requested_at: string | null
          verification_reviewed_at: string | null
          verification_reviewed_by: string | null
          verification_notes: string | null
        }
        Insert: {
          can_access_providers?: boolean
          id: string
          profile_type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verification_requested_at?: string | null
          verification_reviewed_at?: string | null
          verification_reviewed_by?: string | null
          verification_notes?: string | null
        }
        Update: {
          can_access_providers?: boolean
          id?: string
          profile_type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verification_requested_at?: string | null
          verification_reviewed_at?: string | null
          verification_reviewed_by?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          is_read: boolean | null
          payload: Json | null
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          is_read?: boolean | null
          payload?: Json | null
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          is_read?: boolean | null
          payload?: Json | null
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          cathedral_flat_other_type: string | null
          cathedral_flat_rsi: string | null
          ceilings_attic_other_type: string | null
          city: string | null
          climate_zone: string | null
          comments: string | null
          compliance_status: string | null
          cooling_efficiency: number | null
          cooling_make_model: string | null
          cooling_points: number | null
          cooling_seer: string | null
          cooling_system_type: string | null
          created_at: string
          energuide_pathway: string | null
          energy_insights: Json | null
          floor_area: number | null
          floor_points: number | null
          floor_rsi: number | null
          floors_garage_rsi: number | null
          floors_slabs_selected: string[] | null
          front_door_orientation: string | null
          has_cathedral_or_flat_roof: string | null
          has_dwhr: string | null
          has_f280_calculation: string | null
          has_in_floor_heat: string | null
          has_murb_multiple_heating: boolean | null
          has_murb_multiple_water_heaters: boolean | null
          has_secondary_heating: string | null
          has_secondary_hrv: string | null
          has_secondary_water_heater: string | null
          has_skylights: string | null
          heated_floors_rsi: number | null
          heating_efficiency: string | null
          heating_make_model: string | null
          heating_points: number | null
          heating_system_type: string | null
          hrv_erv_efficiency: number | null
          hrv_erv_points: number | null
          hrv_erv_type: string | null
          hrv_make_model: string | null
          id: string
          in_floor_heat_rsi: number | null
          indirect_tank: string | null
          indirect_tank_size: string | null
          interested_certifications: string[] | null
          latitude: number | null
          location: string | null
          longitude: number | null
          mid_construction_blower_door_planned: boolean | null
          murb_second_heating_efficiency: string | null
          murb_second_heating_type: string | null
          murb_second_indirect_tank: string | null
          murb_second_indirect_tank_size: string | null
          murb_second_water_heater: string | null
          murb_second_water_heater_type: string | null
          occupancy_class: string | null
          other_heating_efficiency: string | null
          other_heating_make_model: string | null
          other_secondary_heating_efficiency: string | null
          other_water_heater_type: string | null
          performance_compliance_result: string | null
          postal_code: string | null
          project_name: string
          province: string | null
          recommendations: string[] | null
          secondary_heating_efficiency: string | null
          secondary_heating_make_model: string | null
          secondary_heating_system_type: string | null
          secondary_hrv_efficiency: string | null
          secondary_indirect_tank: string | null
          secondary_indirect_tank_size: string | null
          secondary_water_heater: string | null
          secondary_water_heater_same_as_main: string | null
          secondary_water_heater_type: string | null
          selected_pathway: string | null
          skylight_u_value: string | null
          slab_insulation_type: string | null
          slab_insulation_value: number | null
          slab_on_grade_integral_footing_rsi: number | null
          slab_on_grade_rsi: number | null
          street_address: string | null
          total_points: number | null
          unheated_floor_above_frost_rsi: number | null
          unheated_floor_below_frost_rsi: string | null
          unit_number: string | null
          updated_at: string
          upgrade_costs: number | null
          uploaded_files: Json | null
          user_id: string
          volume_points: number | null
          wall_points: number | null
          wall_rsi: number | null
          water_heater_make_model: string | null
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
          cathedral_flat_other_type?: string | null
          cathedral_flat_rsi?: string | null
          ceilings_attic_other_type?: string | null
          city?: string | null
          climate_zone?: string | null
          comments?: string | null
          compliance_status?: string | null
          cooling_efficiency?: number | null
          cooling_make_model?: string | null
          cooling_points?: number | null
          cooling_seer?: string | null
          cooling_system_type?: string | null
          created_at?: string
          energuide_pathway?: string | null
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          floors_garage_rsi?: number | null
          floors_slabs_selected?: string[] | null
          front_door_orientation?: string | null
          has_cathedral_or_flat_roof?: string | null
          has_dwhr?: string | null
          has_f280_calculation?: string | null
          has_in_floor_heat?: string | null
          has_murb_multiple_heating?: boolean | null
          has_murb_multiple_water_heaters?: boolean | null
          has_secondary_heating?: string | null
          has_secondary_hrv?: string | null
          has_secondary_water_heater?: string | null
          has_skylights?: string | null
          heated_floors_rsi?: number | null
          heating_efficiency?: string | null
          heating_make_model?: string | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          hrv_make_model?: string | null
          id?: string
          in_floor_heat_rsi?: number | null
          indirect_tank?: string | null
          indirect_tank_size?: string | null
          interested_certifications?: string[] | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          mid_construction_blower_door_planned?: boolean | null
          murb_second_heating_efficiency?: string | null
          murb_second_heating_type?: string | null
          murb_second_indirect_tank?: string | null
          murb_second_indirect_tank_size?: string | null
          murb_second_water_heater?: string | null
          murb_second_water_heater_type?: string | null
          occupancy_class?: string | null
          other_heating_efficiency?: string | null
          other_heating_make_model?: string | null
          other_secondary_heating_efficiency?: string | null
          other_water_heater_type?: string | null
          performance_compliance_result?: string | null
          postal_code?: string | null
          project_name: string
          province?: string | null
          recommendations?: string[] | null
          secondary_heating_efficiency?: string | null
          secondary_heating_make_model?: string | null
          secondary_heating_system_type?: string | null
          secondary_hrv_efficiency?: string | null
          secondary_indirect_tank?: string | null
          secondary_indirect_tank_size?: string | null
          secondary_water_heater?: string | null
          secondary_water_heater_same_as_main?: string | null
          secondary_water_heater_type?: string | null
          selected_pathway?: string | null
          skylight_u_value?: string | null
          slab_insulation_type?: string | null
          slab_insulation_value?: number | null
          slab_on_grade_integral_footing_rsi?: number | null
          slab_on_grade_rsi?: number | null
          street_address?: string | null
          total_points?: number | null
          unheated_floor_above_frost_rsi?: number | null
          unheated_floor_below_frost_rsi?: string | null
          unit_number?: string | null
          updated_at?: string
          upgrade_costs?: number | null
          uploaded_files?: Json | null
          user_id: string
          volume_points?: number | null
          wall_points?: number | null
          wall_rsi?: number | null
          water_heater_make_model?: string | null
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
          cathedral_flat_other_type?: string | null
          cathedral_flat_rsi?: string | null
          ceilings_attic_other_type?: string | null
          city?: string | null
          climate_zone?: string | null
          comments?: string | null
          compliance_status?: string | null
          cooling_efficiency?: number | null
          cooling_make_model?: string | null
          cooling_points?: number | null
          cooling_seer?: string | null
          cooling_system_type?: string | null
          created_at?: string
          energuide_pathway?: string | null
          energy_insights?: Json | null
          floor_area?: number | null
          floor_points?: number | null
          floor_rsi?: number | null
          floors_garage_rsi?: number | null
          floors_slabs_selected?: string[] | null
          front_door_orientation?: string | null
          has_cathedral_or_flat_roof?: string | null
          has_dwhr?: string | null
          has_f280_calculation?: string | null
          has_in_floor_heat?: string | null
          has_murb_multiple_heating?: boolean | null
          has_murb_multiple_water_heaters?: boolean | null
          has_secondary_heating?: string | null
          has_secondary_hrv?: string | null
          has_secondary_water_heater?: string | null
          has_skylights?: string | null
          heated_floors_rsi?: number | null
          heating_efficiency?: string | null
          heating_make_model?: string | null
          heating_points?: number | null
          heating_system_type?: string | null
          hrv_erv_efficiency?: number | null
          hrv_erv_points?: number | null
          hrv_erv_type?: string | null
          hrv_make_model?: string | null
          id?: string
          in_floor_heat_rsi?: number | null
          indirect_tank?: string | null
          indirect_tank_size?: string | null
          interested_certifications?: string[] | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          mid_construction_blower_door_planned?: boolean | null
          murb_second_heating_efficiency?: string | null
          murb_second_heating_type?: string | null
          murb_second_indirect_tank?: string | null
          murb_second_indirect_tank_size?: string | null
          murb_second_water_heater?: string | null
          murb_second_water_heater_type?: string | null
          occupancy_class?: string | null
          other_heating_efficiency?: string | null
          other_heating_make_model?: string | null
          other_secondary_heating_efficiency?: string | null
          other_water_heater_type?: string | null
          performance_compliance_result?: string | null
          postal_code?: string | null
          project_name?: string
          province?: string | null
          recommendations?: string[] | null
          secondary_heating_efficiency?: string | null
          secondary_heating_make_model?: string | null
          secondary_heating_system_type?: string | null
          secondary_hrv_efficiency?: string | null
          secondary_indirect_tank?: string | null
          secondary_indirect_tank_size?: string | null
          secondary_water_heater?: string | null
          secondary_water_heater_same_as_main?: string | null
          secondary_water_heater_type?: string | null
          selected_pathway?: string | null
          skylight_u_value?: string | null
          slab_insulation_type?: string | null
          slab_insulation_value?: number | null
          slab_on_grade_integral_footing_rsi?: number | null
          slab_on_grade_rsi?: number | null
          street_address?: string | null
          total_points?: number | null
          unheated_floor_above_frost_rsi?: number | null
          unheated_floor_below_frost_rsi?: string | null
          unit_number?: string | null
          updated_at?: string
          upgrade_costs?: number | null
          uploaded_files?: Json | null
          user_id?: string
          volume_points?: number | null
          wall_points?: number | null
          wall_rsi?: number | null
          water_heater_make_model?: string | null
          water_heating_efficiency?: number | null
          water_heating_points?: number | null
          water_heating_type?: string | null
          window_points?: number | null
          window_u_value?: number | null
        }
        Relationships: []
      }
      provider_access_requests: {
        Row: {
          id: string
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_access_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_access_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          cacea_member: boolean | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          is_approved: boolean
          location_city: string | null
          location_province: string | null
          logo_url: string | null
          name: string
          phone_number: string | null
          region: string | null
          service_category: string
          services_offered: string[] | null
          status: string | null
          website: string | null
        }
        Insert: {
          cacea_member?: boolean | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean
          location_city?: string | null
          location_province?: string | null
          logo_url?: string | null
          name: string
          phone_number?: string | null
          region?: string | null
          service_category: string
          services_offered?: string[] | null
          status?: string | null
          website?: string | null
        }
        Update: {
          cacea_member?: boolean | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean
          location_city?: string | null
          location_province?: string | null
          logo_url?: string | null
          name?: string
          phone_number?: string | null
          region?: string | null
          service_category?: string
          services_offered?: string[] | null
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
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
      get_access_requests_with_user_details: {
        Args: Record<string, never>
        Returns: {
          id: string
          user_id: string
          requested_at: string
          status: string
          email: string
          phone: string
        }[]
      }
      get_all_users_with_details: {
        Args: Record<string, never>
        Returns: {
          user_id: string
          email: string
          last_sign_in_at: string
          created_at: string
          banned_until: string
          role: Database["public"]["Enums"]["app_role"]
          company_name: string
          project_count: number
          profile_type: string
          verification_status: string
        }[]
      }
      get_feedback_details: {
        Args: {
          p_feedback_id: string
        }
        Returns: Json
      }
      get_feedback_with_user_details: {
        Args: Record<string, never>
        Returns: {
          id: string
          created_at: string
          user_id: string
          feedback_text: string
          category: string
          page_url: string
          status: string
          user_email: string
          unread_user_responses_count: number
        }[]
      }
      get_project_events_with_details: {
        Args: {
          p_project_id: string
        }
        Returns: {
          id: string
          created_at: string
          event_type: string
          payload: Json
          user_id: string
          user_email: string
          user_role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_unread_notifications: {
        Args: Record<string, never>
        Returns: {
          unread_revisions: number
          unread_feedback: number
        }[]
      }
      get_unread_notifications_with_details: {
        Args: Record<string, never>
        Returns: Json
      }
      get_user_role: {
        Args: {
          _user_id: string
        }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      mark_feedback_responses_as_read: {
        Args: {
          p_feedback_id: string
        }
        Returns: undefined
      }
      mark_project_events_as_read: {
        Args: {
          p_project_id: string
        }
        Returns: undefined
      }
      user_can_access_providers: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "account_manager" | "user" | "municipal" | "agency"
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