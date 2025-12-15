import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

const fetchUnreadFeedbackCount = async (userId: string | undefined) => {
  if (!userId) return 0

  const { data: feedbackThreads, error: feedbackError } = await supabase
    .from('feedback')
    .select('id')
    .eq('user_id', userId)

  if (feedbackError) {
    console.error('Error fetching feedback threads:', feedbackError)
    return 0
  }

  const feedbackIds = feedbackThreads.map((f) => f.id)
  if (feedbackIds.length === 0) return 0

  const { count, error: responsesError } = await supabase
    .from('feedback_responses')
    .select('*', { count: 'exact', head: true })
    .in('feedback_id', feedbackIds)
    .eq('is_read', false)
    .neq('user_id', userId)

  if (responsesError) {
    console.error('Error fetching unread responses count:', responsesError)
    return 0
  }

  return count || 0
}

export const useUnreadFeedback = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: unreadCount, ...queryInfo } = useQuery({
    queryKey: ['unreadFeedback', user?.id],
    queryFn: () => fetchUnreadFeedbackCount(user?.id),
    enabled: !!user,
    refetchInterval: 60000, // Refetch every 60 seconds
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['unreadFeedback', user?.id] })
  }

  return { unreadCount: unreadCount ?? 0, ...queryInfo, invalidate }
}