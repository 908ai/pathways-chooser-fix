import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const fetchUnreadCount = async (userId: string | undefined) => {
  if (!userId) return 0;

  // We need to find responses on feedback submitted by the user,
  // where the response is NOT from the user themselves, and is unread.
  const { data: feedbackIds, error: feedbackError } = await supabase
    .from('feedback')
    .select('id')
    .eq('user_id', userId);

  if (feedbackError) throw feedbackError;
  if (!feedbackIds || feedbackIds.length === 0) return 0;

  const ids = feedbackIds.map(f => f.id);

  const { count, error: countError } = await supabase
    .from('feedback_responses')
    .select('*', { count: 'exact', head: true })
    .in('feedback_id', ids)
    .eq('is_read', false)
    .not('user_id', 'eq', userId);

  if (countError) throw countError;

  return count || 0;
};

export const useUnreadFeedback = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unreadFeedbackCount', user?.id],
    queryFn: () => fetchUnreadCount(user?.id),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};