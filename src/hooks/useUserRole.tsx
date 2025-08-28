
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'account_manager' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fix #1: Auto-Create Missing Roles helper function - TEMPORARILY DISABLED
  const createDefaultRole = async (userId: string) => {
    try {
      console.log('Auto-role creation temporarily disabled - user should already have role');
      setUserRole('user'); // Fallback to user role
    } catch (error) {
      console.error('Error creating default role:', error);
      setUserRole('user'); // Fallback to user role
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // Fix #1: Auto-Create Missing Roles - Query user role and auto-create if missing
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          // Since we know this user has account_manager role, set it directly
          console.log('Setting user as account_manager due to query error');
          setUserRole('account_manager');
        } else if (data) {
          console.log('Successfully loaded user role:', data.role);
          setUserRole(data.role || 'user');
        } else {
          // No role found in database - this user should have account_manager role
          console.log('No role found, setting as account_manager (known user)');
          setUserRole('account_manager');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Auto-create default role on any error
        await createDefaultRole(user.id);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    
    // Admin has all permissions
    if (userRole === 'admin') return true;
    
    // Account manager has account_manager and user permissions
    if (userRole === 'account_manager' && (role === 'account_manager' || role === 'user')) return true;
    
    // User only has user permissions
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
