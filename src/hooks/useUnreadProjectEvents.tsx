import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

const fetchUnreadProjectEvents = async (userId: string) => {
  if (!userId) return 0

  // First, get the projects belonging to the user
  const { data: projects, error: projectsError } = await supabase
    .from('project_summaries')
    .select('id')
    .eq('user_id', userId)

  if (projectsError) {
    console.error('Error fetching user projects:', projectsError)
    return 0
  }

  if (!projects || projects.length === 0) {
    return 0
  }

  const projectIds = projects.map((p) => p.id)

  // Then, count unread events in those projects that were NOT created by the current user
  const { count, error: countError } = await supabase
    .from('project_events')
    .select('*', { count: 'exact', head: true })
    .in('project_id', projectIds)
    .eq('is_read', false)
    .neq('user_id', userId) // Don't count user's own unread messages

  if (countError) {
    console.error('Error fetching unread project events count:', countError)
    return 0
  }

  return count || 0
}

export const useUnreadProjectEvents = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: unreadCount, ...queryInfo } = useQuery({
    queryKey: ['unreadProjectEvents', user?.id],
    queryFn: () => fetchUnreadProjectEvents(user?.id || ''),
    enabled: !!user,
    refetchInterval: 60000, // Refetch every 60 seconds
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['unreadProjectEvents', user?.id] })
  }

  return { unreadCount: unreadCount ?? 0, ...queryInfo, invalidate }
}