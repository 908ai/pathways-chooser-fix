import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, Trash2, Ban, CheckCircle, Search, ShieldCheck, ShieldX } from 'lucide-react';
import RoleSelector from './RoleSelector';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/hooks/useUserRole';

const fetchUsers = async () => {
  const { data, error } = await supabase.rpc('get_all_users_with_details');
  if (error) throw error;
  return data;
};

const UserManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['allUsersWithDetails'],
    queryFn: fetchUsers,
  });

  const manageUserMutation = useMutation({
    mutationFn: async ({ action, userId, role }: { action: 'delete' | 'block' | 'unblock' | 'approve' | 'reject', userId: string, role?: 'municipal' | 'agency' }) => {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action, user_id: userId, role },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(`User action '${variables.action}' completed.`);
      queryClient.invalidateQueries({ queryKey: ['allUsersWithDetails'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to ${error.action} user`, { description: error.message });
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = users.filter(user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeTab) {
      case 'builders':
        return filtered.filter(u => u.role === 'user' && u.profile_type !== 'building_official');
      case 'municipal':
        return filtered.filter(u => u.role === 'municipal' || u.role === 'agency');
      case 'pending':
        return filtered.filter(u => u.profile_type === 'building_official' && u.verification_status === 'pending');
      default:
        return filtered;
    }
  }, [users, searchTerm, activeTab]);

  if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error loading users: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="builders">Builders</TabsTrigger>
          <TabsTrigger value="municipal">Municipal / Agencies</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending AHJ
            {users && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center">
                    {users.filter(u => u.profile_type === 'building_official' && u.verification_status === 'pending').length}
                </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Profile Type</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No users found in this category.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredUsers.map(user => {
                        const isBlocked = user.banned_until && new Date(user.banned_until) > new Date();
                        const isPending = user.profile_type === 'building_official' && user.verification_status === 'pending';
                        
                        return (
                            <TableRow key={user.user_id}>
                            <TableCell>
                                <div className="font-medium">{user.email}</div>
                                {user.company_name && <div className="text-xs text-muted-foreground">{user.company_name}</div>}
                                {isBlocked && <Badge variant="destructive" className="mt-1">Blocked</Badge>}
                            </TableCell>
                            <TableCell>
                                <span className="capitalize">{user.profile_type?.replace('_', ' ') || 'N/A'}</span>
                            </TableCell>
                            <TableCell>
                                <RoleSelector userId={user.user_id} currentRole={user.role as UserRole} />
                            </TableCell>
                            <TableCell>
                                {user.verification_status && (
                                    <Badge variant={
                                        user.verification_status === 'approved' ? 'default' : 
                                        user.verification_status === 'pending' ? 'secondary' : 
                                        user.verification_status === 'rejected' ? 'destructive' : 'outline'
                                    }>
                                        {user.verification_status}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {isPending ? (
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                            onClick={() => manageUserMutation.mutate({ action: 'approve', userId: user.user_id, role: 'municipal' })}
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-1" />
                                            Municipal
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => manageUserMutation.mutate({ action: 'approve', userId: user.user_id, role: 'agency' })}
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-1" />
                                            Agency
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={() => manageUserMutation.mutate({ action: 'reject', userId: user.user_id })}
                                        >
                                            <ShieldX className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {isBlocked ? (
                                        <DropdownMenuItem onClick={() => manageUserMutation.mutate({ action: 'unblock', userId: user.user_id })}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
                                        </DropdownMenuItem>
                                        ) : (
                                        <DropdownMenuItem onClick={() => manageUserMutation.mutate({ action: 'block', userId: user.user_id })}>
                                            <Ban className="mr-2 h-4 w-4" /> Block User
                                        </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the user and all their associated data. This action cannot be undone.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => manageUserMutation.mutate({ action: 'delete', userId: user.user_id })}>
                                                Delete
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </TableCell>
                            </TableRow>
                        );
                        })
                    )}
                </TableBody>
                </Table>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManager;