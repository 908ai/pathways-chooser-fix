import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const fetchUnreadNotifications = async (userId: string | undefined) => {
  if (!userId) return { unread_revisions: 0, unread_feedback: 0 };

  const { data, error } = await supabase.rpc('get_unread_notifications');

  if (error) {
    console.error('Error fetching unread notifications:', error);
    throw new Error(error.message);
  }
  
  return data?.[0] || { unread_revisions: 0, unread_feedback: 0 };
};

export const useUnreadNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread_notifications', user?.id],
    queryFn: () => fetchUnreadNotifications(user?.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};