import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useUserRole } from './useUserRole'

const fetchUnreadAdminProjectEvents = async (userId: string) => {
  if (!userId) return 0

  // Admins can see all projects, so we count unread events
  // that were not created by the admin themselves.
  const { count, error } = await supabase
    .from('project_events')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
    .neq('user_id', userId) // Don't count admin's own unread messages

  if (error) {
    console.error('Error fetching unread admin project events count:', error)
    return 0
  }

  return count || 0
}

export const useUnreadAdminProjectEvents = () => {
  const { user } = useAuth()
  const { isAdmin } = useUserRole()
  const queryClient = useQueryClient()

  const { data: unreadCount, ...queryInfo } = useQuery({
    queryKey: ['unreadAdminProjectEvents', user?.id],
    queryFn: () => fetchUnreadAdminProjectEvents(user?.id || ''),
    enabled: !!user && isAdmin,
    refetchInterval: 60000, // Refetch every 60 seconds
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['unreadAdminProjectEvents', user?.id] })
  }

  return { unreadCount: unreadCount ?? 0, ...queryInfo, invalidate }
}