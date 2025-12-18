"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceProvider } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ProviderDataTable } from "./providers/DataTable";
import { getColumns } from "./providers/columns";
import { ProviderForm, ProviderFormValues } from "./providers/ProviderForm";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchProviders(): Promise<ServiceProvider[]> {
  const { data, error } = await supabase
    .from("service_providers")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export default function ProviderManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const { data: providers, isLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["service_providers"],
    queryFn: fetchProviders,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_providers"] });
      setIsFormOpen(false);
      setIsDeleteConfirmOpen(false);
      setSelectedProvider(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  };

  const createMutation = useMutation({
    mutationFn: async (values: ProviderFormValues) => {
      const { error } = await supabase.from("service_providers").insert([values]);
      if (error) throw new Error(error.message);
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "Success", description: "Provider created successfully." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: ProviderFormValues & { id: string }) => {
      const { error } = await supabase
        .from("service_providers")
        .update(values)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "Success", description: "Provider updated successfully." });
    },
  });
  
  const toggleApprovedMutation = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string, is_approved: boolean }) => {
      const { error } = await supabase
        .from("service_providers")
        .update({ is_approved })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_providers"] });
      toast({ title: "Success", description: "Provider approval status updated." });
    },
    onError: mutationOptions.onError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_providers").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      toast({ title: "Success", description: "Provider deleted successfully." });
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
    setIsDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (values: ProviderFormValues) => {
    if (selectedProvider) {
      updateMutation.mutate({ id: selectedProvider.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };
  
  const handleToggleApproved = (provider: ServiceProvider, isApproved: boolean) => {
    toggleApprovedMutation.mutate({ id: provider.id, is_approved: isApproved });
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDelete, handleToggleApproved), [handleEdit, handleDelete, handleToggleApproved]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Providers</h2>
        <Button onClick={handleAdd}>Add Provider</Button>
      </div>
      <ProviderDataTable columns={columns} data={providers || []} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProvider ? "Edit Provider" : "Add New Provider"}
            </DialogTitle>
          </DialogHeader>
          <ProviderForm
            provider={selectedProvider}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the provider "{selectedProvider?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProvider && deleteMutation.mutate(selectedProvider.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}