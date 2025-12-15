import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

const checkProviderAccess = async (userId: string | undefined) => {
  if (!userId) return { hasAccess: false, request: null }

  const { data, error } = await supabase.rpc('user_can_access_providers')

  if (error) {
    console.error('Error checking provider access:', error)
    return { hasAccess: false, request: null }
  }

  const { data: request, error: requestError } = await supabase
    .from('provider_access_requests')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (requestError) {
    console.error('Error fetching access request:', requestError)
  }

  return { hasAccess: data, request: request || null }
}

export const useProviderAccess = () => {
  const { user } = useAuth()

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['providerAccess', user?.id],
    queryFn: () => checkProviderAccess(user?.id),
    enabled: !!user,
  })

  return {
    canAccess: data?.hasAccess ?? false,
    request: data?.request,
    loading: isLoading,
    ...rest,
  }
}