import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, Trash2, Ban, CheckCircle, Search, ShieldCheck, ShieldX, User, Building2, Calendar } from 'lucide-react';
import RoleSelector from './RoleSelector';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
        // Show pending building officials AND pending energy advisors
        return filtered.filter(u => 
          (u.profile_type === 'building_official' || u.profile_type === 'energy_advisor') 
          && u.verification_status === 'pending'
        );
      default:
        return filtered;
    }
  }, [users, searchTerm, activeTab]);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const pendingCount = users?.filter(u => 
    (u.profile_type === 'building_official' || u.profile_type === 'energy_advisor') 
    && u.verification_status === 'pending'
  ).length || 0;

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="bg-destructive/15 text-destructive p-4 rounded-md">Error loading users: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage user access, roles, and approvals.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
          <TabsTrigger 
            value="all" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            All Users
          </TabsTrigger>
          <TabsTrigger 
            value="builders" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            Builders
          </TabsTrigger>
          <TabsTrigger 
            value="municipal" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            Municipal / Agencies
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 flex items-center gap-2"
          >
            Pending Approval
            {pendingCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>Profile Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8 mb-2 opacity-20" />
                        <p>No users found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => {
                    const isBlocked = user.banned_until && new Date(user.banned_until) > new Date();
                    const isPending = user.verification_status === 'pending';
                    const isBuildingOfficial = user.profile_type === 'building_official';
                    const isEnergyAdvisor = user.profile_type === 'energy_advisor';
                    
                    return (
                      <TableRow key={user.user_id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                              <AvatarFallback className="text-xs bg-primary/5 text-primary">
                                {getInitials(user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{user.email}</span>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                {user.company_name && (
                                  <>
                                    <Building2 className="h-3 w-3" />
                                    <span>{user.company_name}</span>
                                  </>
                                )}
                              </div>
                              {isBlocked && <Badge variant="destructive" className="w-fit mt-1 h-5 text-[10px]">Blocked</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium capitalize">
                                {user.profile_type?.replace(/_/g, ' ') || 'Standard User'}
                            </span>
                          </div>
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
                            } className="capitalize font-normal">
                              {user.verification_status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPending && isBuildingOfficial ? (
                            <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                onClick={() => manageUserMutation.mutate({ action: 'approve', userId: user.user_id, role: 'municipal' })}
                              >
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                Municipal
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300"
                                onClick={() => manageUserMutation.mutate({ action: 'approve', userId: user.user_id, role: 'agency' })}
                              >
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                Agency
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => manageUserMutation.mutate({ action: 'reject', userId: user.user_id })}
                              >
                                <ShieldX className="w-4 h-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </div>
                          ) : isPending && isEnergyAdvisor ? (
                            <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                onClick={() => manageUserMutation.mutate({ action: 'approve', userId: user.user_id })}
                              >
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => manageUserMutation.mutate({ action: 'reject', userId: user.user_id })}
                              >
                                <ShieldX className="w-4 h-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </div>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
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
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete <strong>{user.email}</strong> and all associated data including projects and files. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => manageUserMutation.mutate({ action: 'delete', userId: user.user_id })}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete Account
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
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default UserManager;