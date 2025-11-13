import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProviderAccess = () => {
  const { user } = useAuth();

  const fetchProviderAccess = async () => {
    if (!user) return { hasAccess: false, request: null };

    // First, check the user's profile directly for the access flag.
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

    // If profile doesn't grant access, check for the latest access request.
    const { data: request, error: requestError } = await supabase
      .from('provider_access_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (requestError) {
      console.error('Error fetching access request:', requestError);
      // Return no access but don't throw, as the user might just not have a request yet.
      return { hasAccess: false, request: null };
    }

    // If the latest request is approved, they have access. This is the key fix.
    if (request?.status === 'approved') {
      return { hasAccess: true, request };
    }

    // Otherwise, they don't have access. Return the request if it exists (e.g., for 'pending' or 'denied' status).
    return { hasAccess: false, request: request || null };
  };

  return useQuery({
    queryKey: ['providerAccess', user?.id],
    queryFn: fetchProviderAccess,
    enabled: !!user,
  });
};