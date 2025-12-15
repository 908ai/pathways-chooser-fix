import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

export const useUnreadEvents = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadProjects, setUnreadProjects] = useState<{ project_id: string; project_name: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      let query = supabase
        .from('project_events')
        .select('project_id, project_summaries(project_name)', { count: 'exact', head: false })
        .eq('is_read', false);

      if (isAdmin) {
        // Admin gets notifications for user comments on any project
        query = query.neq('user_id', user.id); 
      } else {
        // User gets notifications for admin comments on their projects
        const { data: userProjects, error: projectsError } = await supabase
          .from('project_summaries')
          .select('id')
          .eq('user_id', user.id);

        if (projectsError || !userProjects) {
          console.error("Error fetching user's projects:", projectsError);
          return;
        }

        const projectIds = userProjects.map(p => p.id);
        if (projectIds.length === 0) {
            setUnreadCount(0);
            setUnreadProjects([]);
            return;
        }

        query = query
          .in('project_id', projectIds)
          .neq('user_id', user.id);
      }

      const { count, data, error } = await query;

      if (error) {
        console.error('Error fetching unread events:', error);
        return;
      }
      
      setUnreadCount(count || 0);

      if (data) {
        const projectsMap = data.reduce((acc, event) => {
          if (!event.project_summaries) return acc;
          acc[event.project_id] = {
            project_id: event.project_id,
            project_name: event.project_summaries.project_name,
            count: (acc[event.project_id]?.count || 0) + 1,
          };
          return acc;
        }, {} as { [key: string]: { project_id: string; project_name: string; count: number } });
        setUnreadProjects(Object.values(projectsMap));
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('project_events_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_events' },
        (payload) => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  return { unreadCount, unreadProjects };
};