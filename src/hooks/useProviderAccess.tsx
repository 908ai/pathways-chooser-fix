import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProviderAccess = () => {
  const { user } = useAuth();

  const fetchProviderAccess = async () => {
    if (!user) return { hasAccess: false, request: null };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, can_access_providers')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile for provider access:', profileError);
      return { hasAccess: false, request: null };
    }

    if (profile?.can_access_providers) {
      return { hasAccess: true, request: null };
    }

    // If no access, check for a pending or approved request
    const { data: request, error: requestError } = await supabase
      .from('provider_access_requests')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'approved'])
      .order('requested_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (requestError) {
      console.error('Error fetching access request:', requestError);
    }

    return { hasAccess: false, request: request || null };
  };

  return useQuery({
    queryKey: ['providerAccess', user?.id],
    queryFn: fetchProviderAccess,
    enabled: !!user,
  });
};