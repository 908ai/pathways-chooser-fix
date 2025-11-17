import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProviderAccess = () => {
  const { user } = useAuth();

  const fetchProviderAccess = async () => {
    if (!user) return { hasAccess: false, request: null };

    // Use the single source of truth RPC function for the access check
    const { data: hasAccess, error: rpcError } = await supabase.rpc('user_can_access_providers');

    if (rpcError) {
      console.error('Error checking provider access:', rpcError);
      return { hasAccess: false, request: null };
    }

    // We still need to fetch the latest request object to show its status on the request page
    const { data: request, error: requestError } = await supabase
      .from('provider_access_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (requestError) {
      console.error('Error fetching access request:', requestError);
    }

    return { hasAccess: hasAccess || false, request: request || null };
  };

  return useQuery({
    queryKey: ['providerAccess', user?.id],
    queryFn: fetchProviderAccess,
    enabled: !!user,
  });
};