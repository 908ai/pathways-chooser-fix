import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';

const fetchProviders = async () => {
  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const ProviderManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['all_service_providers'],
    queryFn: fetchProviders,
  });

  const updateProviderStatusMutation = useMutation({
    mutationFn: async ({ providerId, is_approved }: { providerId: string; is_approved: boolean }) => {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_approved })
        .eq('id', providerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_service_providers'] });
      toast({ title: 'Success', description: 'Provider status updated.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to update provider: ${error.message}`, variant: 'destructive' });
    },
  });

  if (isLoading) return <div>Loading providers...</div>;
  if (error) return <div className="text-red-500">Error loading providers: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Service Provider Management</CardTitle>
            <CardDescription>Add, edit, and approve service providers for the directory.</CardDescription>
          </div>
          <Button disabled>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Provider (Coming Soon)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers && providers.length > 0 ? providers.map(provider => (
              <TableRow key={provider.id}>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.service_category}</TableCell>
                <TableCell>{provider.location_city}, {provider.location_province}</TableCell>
                <TableCell>
                  <Badge variant={provider.is_approved ? 'default' : 'secondary'}>
                    {provider.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {provider.is_approved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, is_approved: false })}
                      disabled={updateProviderStatusMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, is_approved: true })}
                      disabled={updateProviderStatusMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" disabled>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" disabled>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No providers found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProviderManager;