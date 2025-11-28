import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, Trash2, Ban, CheckCircle, Search } from 'lucide-react';
import RoleSelector from './RoleSelector';
import { Badge } from '../ui/badge';

const fetchUsers = async () => {
  const { data, error } = await supabase.rpc('get_all_users_with_details');
  if (error) throw error;
  return data;
};

const UserManager = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['allUsersWithDetails'],
    queryFn: fetchUsers,
  });

  const manageUserMutation = useMutation({
    mutationFn: async ({ action, userId }: { action: 'delete' | 'block' | 'unblock', userId: string }) => {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action, user_id: userId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(`User ${variables.action}ed successfully.`);
      queryClient.invalidateQueries({ queryKey: ['allUsersWithDetails'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to ${error.action} user`, { description: error.message });
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Error loading users: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => {
              const isBlocked = user.banned_until && new Date(user.banned_until) > new Date();
              return (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-muted-foreground">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                    {isBlocked && <Badge variant="destructive" className="mt-1">Blocked</Badge>}
                  </TableCell>
                  <TableCell>{user.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <RoleSelector userId={user.user_id} currentRole={user.role} />
                  </TableCell>
                  <TableCell>{user.project_count}</TableCell>
                  <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManager;