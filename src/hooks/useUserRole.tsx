import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'account_manager' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        } else if (data && data.role) {
          setUserRole(data.role);
        } else {
          // No role found, default to 'user'
          setUserRole('user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    if (userRole === 'admin') return true;
    if (userRole === 'account_manager' && (role === 'account_manager' || role === 'user')) return true;
    if (userRole === 'user' && role === 'user') return true;
    return false;
  };

  const canDeleteProjects = (): boolean => {
    return hasRole('account_manager') || hasRole('admin');
  };

  const canViewAllProjects = (): boolean => {
    return hasRole('account_manager') || hasRole('admin');
  };

  return {
    userRole,
    loading,
    hasRole,
    canDeleteProjects,
    canViewAllProjects,
    isAdmin: userRole === 'admin',
    isAccountManager: userRole === 'account_manager',
    isUser: userRole === 'user'
  };
};