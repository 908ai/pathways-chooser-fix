import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface UnreadRevisionDetail {
  project_id: string;
  project_name: string;
}

interface UnreadNotificationsWithDetails {
  unread_revisions: number;
  unread_feedback: number;
  revision_details: UnreadRevisionDetail[];
}

const fetchUnreadNotificationsWithDetails = async (): Promise<UnreadNotificationsWithDetails> => {
  const { data, error } = await supabase.rpc('get_unread_notifications_with_details');
  
  if (error) {
    console.error('Error fetching unread notifications with details:', error);
    return { unread_revisions: 0, unread_feedback: 0, revision_details: [] };
  }
  
  return data as unknown as UnreadNotificationsWithDetails || { unread_revisions: 0, unread_feedback: 0, revision_details: [] };
};

export const useUnreadNotificationsWithDetails = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UnreadNotificationsWithDetails>({
    queryKey: ['unread_notifications_with_details'],
    queryFn: fetchUnreadNotificationsWithDetails,
  });

  useEffect(() => {
    const projectEventsChannel = supabase
      .channel('project_events_notifications_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_events' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
        }
      )
      .subscribe();

    const feedbackResponsesChannel = supabase
      .channel('feedback_responses_notifications_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback_responses' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
        }
      )
      .subscribe();
      
    const feedbackChannel = supabase
      .channel('feedback_notifications_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['unread_notifications_with_details'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectEventsChannel);
      supabase.removeChannel(feedbackResponsesChannel);
      supabase.removeChannel(feedbackChannel);
    };
  }, [queryClient]);

  const totalUnread = (data?.unread_revisions || 0) + (data?.unread_feedback || 0);

  return {
    unreadRevisions: data?.unread_revisions || 0,
    unreadFeedback: data?.unread_feedback || 0,
    revisionDetails: data?.revision_details || [],
    totalUnread,
    isLoading,
    error,
  };
};