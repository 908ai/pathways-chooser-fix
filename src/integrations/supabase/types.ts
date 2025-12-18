export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectSummary = Database['public']['Tables']['project_summaries']['Row'];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string | null
          created_at: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          user_id?: string | null
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback_responses: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          is_read: boolean | null
          response_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          is_read?: boolean | null
          response_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          is_read?: boolean | null
          response_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_feedback_id_fkey"
            columns: ["feedback_id"]
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_responses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      file_requests: {
        Row: {
          created_at: string | null
          file_request_url: string
          folder_name: string
          folder_path: string
          id: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_request_url: string
          folder_name: string
          folder_path: string
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_request_url?: string
          folder_name?: string
          folder_path?: string
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_requests_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "project_summaries"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          can_access_providers: boolean
          id: string
          profile_type: string | null
          updated_at: string | null
        }
        Insert: {
          can_access_providers?: boolean
          id: string
          profile_type?: string | null
          updated_at?: string | null
        }
        Update: {
          can_access_providers?: boolean
          id?: string
          profile_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "project_summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_summaries: {
        Row: {
          id: string
          user_id: string | null
          project_name: string
          building_type: string | null
          location: string | null
          floor_area: number | null
          selected_pathway: string | null
          attic_rsi: number | null
          attic_points: number | null
          wall_rsi: number | null
          wall_points: number | null
          below_grade_rsi: number | null
          below_grade_points: number | null
          floor_rsi: number | null
          floor_points: number | null
          window_u_value: number | null
          window_points: number | null
          heating_system_type: string | null
          heating_efficiency: string | null
          heating_points: number | null
          cooling_system_type: string | null
          cooling_efficiency: number | null
          cooling_points: number | null
          water_heating_type: string | null
          water_heating_efficiency: number | null
          water_heating_points: number | null
          hrv_erv_type: string | null
          hrv_erv_efficiency: number | null
          hrv_erv_points: number | null
          airtightness_al: number | null
          airtightness_points: number | null
          building_volume: number | null
          volume_points: number | null
          annual_energy_consumption: number | null
          performance_compliance_result: string | null
          total_points: number | null
          compliance_status: string | null
          upgrade_costs: number | null
          uploaded_files: Json | null
          energy_insights: Json | null
          recommendations: string[] | null
          created_at: string
          updated_at: string
          street_address: string | null
          unit_number: string | null
          city: string | null
          postal_code: string | null
          province: string | null
          occupancy_class: string | null
          climate_zone: string | null
          mid_construction_blower_door_planned: boolean | null
          cooling_seer: string | null
          secondary_heating_system_type: string | null
          secondary_heating_efficiency: string | null
          has_cathedral_or_flat_roof: string | null
          cathedral_flat_rsi: string | null
          has_skylights: string | null
          skylight_u_value: string | null
          floors_slabs_selected: string[] | null
          has_in_floor_heat: string | null
          has_dwhr: string | null
          energuide_pathway: string | null
          front_door_orientation: string | null
          has_f280_calculation: string | null
          hrv_make_model: string | null
          has_secondary_hrv: string | null
          secondary_hrv_efficiency: string | null
          heating_make_model: string | null
          other_heating_make_model: string | null
          other_heating_efficiency: string | null
          has_secondary_heating: string | null
          secondary_heating_make_model: string | null
          other_secondary_heating_efficiency: string | null
          indirect_tank: string | null
          indirect_tank_size: string | null
          secondary_indirect_tank: string | null
          secondary_indirect_tank_size: string | null
          cooling_make_model: string | null
          water_heater_make_model: string | null
          other_water_heater_type: string | null
          has_secondary_water_heater: string | null
          secondary_water_heater_same_as_main: string | null
          secondary_water_heater_type: string | null
          secondary_water_heater: string | null
          interested_certifications: string[] | null
          comments: string | null
          ceilings_attic_other_type: string | null
          cathedral_flat_other_type: string | null
          floors_garage_rsi: number | null
          slab_insulation_type: string | null
          slab_insulation_value: number | null
          in_floor_heat_rsi: number | null
          slab_on_grade_rsi: number | null
          slab_on_grade_integral_footing_rsi: number | null
          unheated_floor_below_frost_rsi: string | null
          unheated_floor_above_frost_rsi: number | null
          heated_floors_rsi: number | null
          has_murb_multiple_heating: boolean | null
          murb_second_heating_type: string | null
          murb_second_heating_efficiency: string | null
          murb_second_indirect_tank: string | null
          murb_second_indirect_tank_size: string | null
          has_murb_multiple_water_heaters: boolean | null
          murb_second_water_heater_type: string | null
          murb_second_water_heater: string | null
          latitude: number | null
          longitude: number | null
          wants_certifications: string | null
        }
        Insert: Partial<Database['public']['Tables']['project_summaries']['Row']>
        Update: Partial<Database['public']['Tables']['project_summaries']['Row']>
        Relationships: [
          {
            foreignKeyName: "project_summaries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_access_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      service_providers: {
        Row: {
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
          service_category: string
          website: string | null
        }
        Insert: {
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
          service_category: string
          website?: string | null
        }
        Update: {
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
          service_category?: string
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users_with_details: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_feedback_details: {
        Args: { p_feedback_id: string }
        Returns: Json
      }
      get_feedback_with_user_details: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_project_events_with_details: {
        Args: { p_project_id: string }
        Returns: Json
      }
      mark_project_events_as_read: {
        Args: { p_project_id: string }
        Returns: undefined
      }
      mark_feedback_responses_as_read: {
        Args: { p_feedback_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = "admin" | "user" | "account_manager";

export type AppUser = {
  id: string;
  email: string;
  role: UserRole;
  last_sign_in_at: string;
  created_at: string;
  banned_until: string | null;
  company_name: string | null;
  project_count: number;
};

export type ProviderAccessRequest = Database['public']['Tables']['provider_access_requests']['Row'] & {
  email: string;
  phone: string | null;
};

export type Feedback = Database['public']['Tables']['feedback']['Row'] & {
  user_email?: string;
  unread_user_responses_count?: number;
};

export type FeedbackResponse = Database['public']['Tables']['feedback_responses']['Row'] & {
  user_email: string;
};

export type FeedbackDetails = Feedback & {
  feedback_responses: FeedbackResponse[];
};

export type ProjectEvent = Database['public']['Tables']['project_events']['Row'] & {
  user_email: string;
  user_role: UserRole;
};

export type UnreadNotifications = {
  unread_revisions: number;
  unread_feedback: number;
  revision_details: { project_id: string; project_name: string }[];
};

export type ServiceProvider = Database['public']['Tables']['service_providers']['Row'];