import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Check, X } from 'lucide-react';

const fetchRequests = async () => {
  const { data, error } = await supabase
    .from('provider_access_requests')
    .select(`
      *,
      profile:profiles(id, profile_type)
    `)
    .eq('status', 'pending')
    .order('requested_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const RequestManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['access_requests'],
    queryFn: fetchRequests,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, userId }: { requestId: string; status: 'approved' | 'denied'; userId: string }) => {
      const { error: requestError } = await supabase
        .from('provider_access_requests')
        .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
        .eq('id', requestId);

      if (requestError) throw requestError;

      if (status === 'approved') {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ can_access_providers: true })
          .eq('id', userId);
        
        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Request updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['access_requests'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <div>Loading requests...</div>;
  if (error) return <div className="text-red-500">Error loading requests: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Access Requests</CardTitle>
        <CardDescription>Review and approve or deny user requests to access the service provider directory.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests && requests.length > 0 ? requests.map((request: any) => (
              <TableRow key={request.id}>
                <TableCell>{request.user_id}</TableCell>
                <TableCell>{new Date(request.requested_at).toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary">{request.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-500 hover:text-green-600"
                    onClick={() => updateRequestMutation.mutate({ requestId: request.id, status: 'approved', userId: request.user_id })}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => updateRequestMutation.mutate({ requestId: request.id, status: 'denied', userId: request.user_id })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No pending requests.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestManager;