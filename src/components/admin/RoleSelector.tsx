import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserRole } from '@/hooks/useUserRole';

interface RoleSelectorProps {
  userId: string;
  currentRole: UserRole | null;
}

const RoleSelector = ({ userId, currentRole }: RoleSelectorProps) => {
  const queryClient = useQueryClient();
  const roles: UserRole[] = ['user', 'account_manager', 'admin'];

  const updateRoleMutation = useMutation({
    mutationFn: async ({ role }: { role: UserRole }) => {
      // Upsert ensures that if a user doesn't have a role in user_roles, it will be created.
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: role }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("User role updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['allUsersWithDetails'] });
    },
    onError: (error: any) => {
      toast.error("Failed to update role", { description: error.message });
    },
  });

  const handleRoleChange = (role: UserRole) => {
    updateRoleMutation.mutate({ role });
  };

  return (
    <Select
      defaultValue={currentRole || 'user'}
      onValueChange={handleRoleChange}
      disabled={updateRoleMutation.isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map(role => (
          <SelectItem key={role} value={role} className="capitalize">
            {role.replace('_', ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;