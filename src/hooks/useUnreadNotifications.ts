import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const fetchUnreadNotifications = async () => {
  const { data, error } = await supabase.rpc('get_unread_notifications');
  
  if (error) {
    console.error('Error fetching unread notifications:', error);
    return { unread_revisions: 0, unread_feedback: 0 };
  }
  
  return data[0] || { unread_revisions: 0, unread_feedback: 0 };
};

export const useUnreadNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['unread_notifications'],
    queryFn: fetchUnreadNotifications,
  });

  useEffect(() => {
    const projectEventsChannel = supabase
      .channel('project_events_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_events' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });
        }
      )
      .subscribe();

    const feedbackResponsesChannel = supabase
      .channel('feedback_responses_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback_responses' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectEventsChannel);
      supabase.removeChannel(feedbackResponsesChannel);
    };
  }, [queryClient]);

  const totalUnread = (data?.unread_revisions || 0) + (data?.unread_feedback || 0);

  return {
    unreadRevisions: data?.unread_revisions || 0,
    unreadFeedback: data?.unread_feedback || 0,
    totalUnread,
    isLoading,
    error,
  };
};