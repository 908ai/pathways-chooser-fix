import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
// We will create a form for adding/editing providers in a later step if requested.

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

  // Note: Add, Edit, and Delete mutations would be implemented here.
  // For now, we are just displaying the data.

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
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Provider
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
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