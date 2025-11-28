import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const fetchUnreadAdminFeedbackCount = async (userId: string | undefined) => {
  if (!userId) return 0;

  // For admins, "unread" means feedback with the status 'New'.
  const { count, error } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'New');

  if (error) {
    console.error("Error fetching unread admin feedback count:", error);
    throw error;
  }

  return count || 0;
};

export const useUnreadAdminFeedback = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unreadAdminFeedbackCount', user?.id],
    queryFn: () => fetchUnreadAdminFeedbackCount(user?.id),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds to keep the count fresh
  });
};