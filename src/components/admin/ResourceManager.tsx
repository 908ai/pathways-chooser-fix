"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  logo_url: string | null;
  position: number;
}

// Sortable Resource Card Component
const SortableResourceCard = ({ 
  resource, 
  handleEdit, 
  handleDelete 
}: { 
  resource: Resource; 
  handleEdit: (r: Resource) => void; 
  handleDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-shadow relative">
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-2 right-2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground bg-background/50 rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <CardHeader className="pb-3 flex flex-row items-start space-y-0 gap-4 pt-4 pr-8">
          <div className="relative">
            {resource.logo_url ? (
              <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center flex-shrink-0 p-1 bg-white">
                <img 
                  src={resource.logo_url} 
                  alt={resource.title} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white">
              {resource.position}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium line-clamp-2" title={resource.title}>
              {resource.title}
            </CardTitle>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 truncate"
            >
              {resource.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-end gap-2 border-t bg-muted/20 p-3 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(resource)}
            className="h-8 px-2"
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(resource.id)}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const ResourceManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState('alberta');
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    url: string;
    category: string;
    logo_file: File | null;
    position: number;
  }>({
    title: '',
    description: '',
    url: '',
    category: 'alberta',
    logo_file: null,
    position: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [localResources, setLocalResources] = useState<Resource[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('position', { ascending: true })
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Resource[];
    },
  });

  // Sync local state with fetched data
  useEffect(() => {
    if (resources) {
      setLocalResources(resources);
    }
  }, [resources]);

  const uploadLogo = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resource_logos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('resource_logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const createResource = useMutation({
    mutationFn: async (newResource: typeof formData) => {
      let logoUrl = null;
      if (newResource.logo_file) {
        setIsUploading(true);
        logoUrl = await uploadLogo(newResource.logo_file);
        setIsUploading(false);
      }

      // Get the highest position to add to end
      const maxPos = localResources
        .filter(r => r.category === newResource.category)
        .reduce((max, r) => Math.max(max, r.position), -1);

      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: newResource.title,
          description: newResource.description,
          url: newResource.url,
          category: newResource.category,
          logo_url: logoUrl,
          position: newResource.position > 0 ? newResource.position : maxPos + 1,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Resource created',
        description: 'The new resource has been added successfully.',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      setIsUploading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create resource.',
        variant: 'destructive',
      });
    },
  });

  const updateResource = useMutation({
    mutationFn: async (resource: Partial<Resource> & { logo_file?: File | null }) => {
      let logoUrl = resource.logo_url;
      
      if (resource.logo_file) {
        setIsUploading(true);
        logoUrl = await uploadLogo(resource.logo_file);
        setIsUploading(false);
      }

      const { data, error } = await supabase
        .from('resources')
        .update({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          category: resource.category,
          logo_url: logoUrl,
          position: resource.position,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resource.id!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Resource updated',
        description: 'The resource has been updated successfully.',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      setIsUploading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update resource.',
        variant: 'destructive',
      });
    },
  });

  const updatePositions = useMutation({
    mutationFn: async (updatedResources: Resource[]) => {
      // Create updates for all affected resources
      // We must provide all required fields to satisfy TypeScript upsert definition
      // or cast to any if we know what we are doing (but let's be type safe)
      const updates = updatedResources.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        url: r.url,
        category: r.category,
        logo_url: r.logo_url,
        position: r.position,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('resources')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Order updated',
        description: 'The resource order has been saved.',
      });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to save new order.',
        variant: 'destructive',
      });
    },
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Resource deleted',
        description: 'The resource has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete resource.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      updateResource.mutate({
        ...formData,
        id: editingResource.id,
        logo_url: editingResource.logo_url,
      });
    } else {
      createResource.mutate(formData);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      category: resource.category,
      logo_file: null,
      position: resource.position || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      category: activeTab,
      logo_file: null,
      position: 0,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logo_file: e.target.files[0] });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalResources((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // This simplistic approach might have issues if we are filtering items
        // We should operate on the filtered list for correct index manipulation
        // BUT arrayMove expects the full array or indices relative to the array passed
        
        // Correct approach:
        // 1. Get the items for the current category
        const currentCategoryItems = items.filter(i => i.category === activeTab).sort((a, b) => a.position - b.position);
        
        // 2. Find the active and over items in this specific list
        const activeItemIndex = currentCategoryItems.findIndex(i => i.id === active.id);
        const overItemIndex = currentCategoryItems.findIndex(i => i.id === over.id);
        
        // 3. Move them
        const newCategoryOrder = arrayMove(currentCategoryItems, activeItemIndex, overItemIndex);
        
        // 4. Assign new positions
        const updatedCategoryItems = newCategoryOrder.map((item, index) => ({
          ...item,
          position: index,
        }));
        
        // 5. Merge back into the main list
        // Create a map of updated items for O(1) lookup
        const updatedMap = new Map(updatedCategoryItems.map(i => [i.id, i]));
        
        const newItems = items.map(item => updatedMap.get(item.id) || item);

        // Trigger update to backend
        updatePositions.mutate(updatedCategoryItems);

        return newItems;
      });
    }
  };

  const renderResourceList = (category: string) => {
    const categoryResources = localResources
      .filter(r => r.category === category)
      .sort((a, b) => a.position - b.position);
    
    if (categoryResources.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          No resources found for this category.
        </div>
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categoryResources.map(r => r.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryResources.map((resource) => (
              <SortableResourceCard 
                key={resource.id} 
                resource={resource} 
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resources Management</h2>
          <p className="text-muted-foreground">Add, edit, and reorder external resources. Drag cards to reorder.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the resource.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alberta">Alberta</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {editingResource?.logo_url && !formData.logo_file && (
                    <div className="h-10 w-10 relative flex-shrink-0">
                      <img 
                        src={editingResource.logo_url} 
                        alt="Current logo" 
                        className="h-full w-full object-contain rounded border" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading || createResource.isPending || updateResource.isPending}>
                  {(isUploading || createResource.isPending || updateResource.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingResource ? 'Update Resource' : 'Create Resource'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && localResources.length === 0 ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="alberta">Alberta</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
            <TabsTrigger value="saskatchewan">Saskatchewan</TabsTrigger>
          </TabsList>
          <TabsContent value="alberta" className="mt-0">
            {renderResourceList('alberta')}
          </TabsContent>
          <TabsContent value="national" className="mt-0">
            {renderResourceList('national')}
          </TabsContent>
          <TabsContent value="saskatchewan" className="mt-0">
            {renderResourceList('saskatchewan')}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResourceManager;