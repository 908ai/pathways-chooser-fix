import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['access_requests'],
    queryFn: fetchRequests,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.rpc('update_access_request_status', { request_id: id, new_status: status, admin_id: user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Success', { description: 'Request updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['access_requests'] });
    },
    onError: (error: any) => {
      toast.error('Error', { description: error.message });
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateRequestMutation.mutate({ id, status });
  };

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
                        onClick={() => handleUpdateStatus(request.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleUpdateStatus(request.id, 'denied')}
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