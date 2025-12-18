import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProviderForm, providerSchema } from './ProviderForm';
import { ProviderDataTable, ServiceProvider } from './ProviderDataTable';
import { z } from 'zod';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

const sampleProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Green Home Energy',
    service_category: 'Energy Advisor',
    location_city: 'Calgary',
    location_province: 'AB',
    contact_email: 'contact@greenhome.ca',
    phone_number: '403-555-1111',
    website: 'https://greenhome.ca',
    description: 'Certified energy advisors for new and existing homes.',
    logo_url: null,
    is_approved: true,
    cacea_member: true,
    region: 'Local',
    status: 'Available',
    services_offered: ['EnerGuide modelling', 'Blower door testing'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Eco Builders Inc.',
    service_category: 'Builder',
    location_city: 'Edmonton',
    location_province: 'AB',
    contact_email: 'info@ecobuilders.com',
    phone_number: '780-555-2222',
    website: 'https://ecobuilders.com',
    description: 'Specializing in net-zero and passive house construction.',
    logo_url: null,
    is_approved: true,
    cacea_member: true,
    region: 'Local',
    status: 'At Capacity',
    services_offered: ['CHBA Net Zero Certifications', 'General Contracting'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'BC Heat Pumps',
    service_category: 'HVAC Contractor',
    location_city: 'Vancouver',
    location_province: 'BC',
    contact_email: 'sales@bcheatpumps.com',
    phone_number: '604-555-3333',
    website: 'https://bcheatpumps.com',
    description: 'Installation and maintenance of high-efficiency heat pumps.',
    logo_url: null,
    is_approved: false,
    cacea_member: false,
    region: 'Out-of-Region',
    status: 'Pending',
    services_offered: ['F280 heat loss/gain calculations'],
    created_at: new Date().toISOString(),
  },
];

const fetchProviders = async () => {
  // For now, we'll return sample data.
  // In a real app, you would fetch from Supabase.
  // const { data, error } = await supabase
  //   .from('service_providers')
  //   .select('*')
  //   .order('name', { ascending: true });

  // if (error) throw new Error(error.message);
  // return data;
  return sampleProviders;
};

const ProviderManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ['all_service_providers'],
    queryFn: fetchProviders,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_service_providers'] });
      setIsFormOpen(false);
      setIsConfirmDeleteDialogOpen(false);
      setSelectedProvider(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `An error occurred: ${error.message}`, variant: 'destructive' });
    },
  };

  const createProviderMutation = useMutation({
    mutationFn: async (values: TablesInsert<'service_providers'>) => {
      const { error } = await supabase.from('service_providers').insert(values);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Provider created successfully.' });
      mutationOptions.onSuccess();
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: TablesUpdate<'service_providers'> }) => {
      const { error } = await supabase.from('service_providers').update(values).eq('id', id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Provider updated successfully.' });
      mutationOptions.onSuccess();
    },
  });
  
  const deleteProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('service_providers').delete().eq('id', id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Provider deleted successfully.' });
      mutationOptions.onSuccess();
    },
  });

  const handleAdd = () => {
    setSelectedProvider(null);
    setIsFormOpen(true);
  };

  const handleEdit = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsFormOpen(true);
  };

  const handleDelete = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProvider) {
      deleteProviderMutation.mutate(selectedProvider.id);
    }
  };

  const handleToggleApprove = (provider: ServiceProvider) => {
    const { created_at, id, ...updateData } = provider;
    updateProviderMutation.mutate({ id: provider.id, values: { ...updateData, is_approved: !provider.is_approved } });
  };

  const handleFormSubmit = (values: Omit<z.infer<typeof providerSchema>, 'other_service_text'>) => {
    if (selectedProvider) {
      updateProviderMutation.mutate({ id: selectedProvider.id, values });
    } else {
      createProviderMutation.mutate(values as TablesInsert<'service_providers'>);
    }
  };

  if (isLoading) return <div>Loading providers...</div>;
  if (error) return <div className="text-red-500">Error loading providers: {error.message}</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Service Provider Management</CardTitle>
          <CardDescription>Add, edit, and approve service providers for the directory.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderDataTable
            data={providers}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleApprove={handleToggleApprove}
            isUpdating={updateProviderMutation.isPending}
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProvider ? 'Edit' : 'Add'} Service Provider</DialogTitle>
            <DialogDescription>
              {selectedProvider ? 'Update the details of the service provider.' : 'Enter the details for the new service provider.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ProviderForm
              onSubmit={handleFormSubmit}
              initialData={selectedProvider || undefined}
              isSubmitting={createProviderMutation.isPending || updateProviderMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the provider "{selectedProvider?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteProviderMutation.isPending}>
              {deleteProviderMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProviderManager;