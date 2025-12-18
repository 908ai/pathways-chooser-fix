import { Database as DB } from "./database.types";

export type Database = DB;
export type Json = DB['public']['Tables']['project_events']['Row']['payload'];

export type Profile = DB['public']['Tables']['profiles']['Row']
export type ProjectSummary = DB['public']['Tables']['project_summaries']['Row']
export type ProjectEvent = DB['public']['Tables']['project_events']['Row']
export type Feedback = DB['public']['Tables']['feedback']['Row']
export type FeedbackResponse = DB['public']['Tables']['feedback_responses']['Row']
export type ProviderAccessRequest = DB['public']['Tables']['provider_access_requests']['Row']
export type UserRole = DB['public']['Tables']['user_roles']['Row']
export type UserWithRole = {
  user_id: string;
  email: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  banned_until: string | null;
  role: "admin" | "user" | "account_manager" | null;
  company_name: string | null;
  project_count: number | null;
}

export type ServiceProvider = DB['public']['Tables']['service_providers']['Row'];

export type ProjectDetails = ProjectSummary & {
  user_email: string | null;
  user_role: string | null;
};

export type FeedbackWithUser = Feedback & {
  user_email: string | null;
  unread_user_responses_count: number;
};

export type AccessRequestWithUserDetails = ProviderAccessRequest & {
  email: string | null;
  phone: string | null;
};

export type ProjectEventWithDetails = ProjectEvent & {
  user_email: string | null;
  user_role: string | null;
};

export type FeedbackDetails = Feedback & {
  feedback_responses: (FeedbackResponse & { user_email: string | null })[];
};

export type UnreadNotifications = {
  unread_revisions: number;
  unread_feedback: number;
  revision_details: { project_id: string; project_name: string }[];
};