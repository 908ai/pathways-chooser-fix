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
  const { data, error } = await supabase.rpc('get_access_requests_with_user_details');

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
      // 1. Update the request status
      const { error: requestError } = await supabase
        .from('provider_access_requests')
        .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // 2. Update the user's profile with the access flag using upsert
      const can_access = status === 'approved';
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, can_access_providers: can_access }, { onConflict: 'id' });
      
      if (profileError) throw profileError;
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
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests && requests.length > 0 ? requests.map((request: any) => (
              <TableRow key={request.id}>
                <TableCell>{request.email || 'N/A'}</TableCell>
                <TableCell>{request.phone || 'N/A'}</TableCell>
                <TableCell>{new Date(request.requested_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={
                    request.status === 'approved' ? 'default' :
                    request.status === 'denied' ? 'destructive' :
                    'secondary'
                  }>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'pending' ? (
                    <>
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
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No access requests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestManager;