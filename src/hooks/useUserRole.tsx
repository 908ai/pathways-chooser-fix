import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'account_manager' | 'user' | 'municipal' | 'agency';

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
          setUserRole(data.role as UserRole);
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

  const hasRole = useCallback((role: UserRole): boolean => {
    if (!userRole) return false;
    if (userRole === 'admin') return true;
    // Admins have all permissions
    
    if (userRole === 'account_manager') {
      return role === 'account_manager' || role === 'user';
    }
    
    if (userRole === 'municipal') {
       return role === 'municipal';
    }

    if (userRole === 'agency') {
       return role === 'agency';
    }

    if (userRole === 'user') {
       return role === 'user';
    }
    
    return false;
  }, [userRole]);

  const canDeleteProjects = useMemo((): boolean => {
    return userRole === 'admin' || userRole === 'account_manager';
  }, [userRole]);

  const canViewAllProjects = useMemo((): boolean => {
    return userRole === 'admin' || userRole === 'account_manager';
  }, [userRole]);

  const canViewMunicipalDashboard = useMemo((): boolean => {
    return userRole === 'admin' || userRole === 'account_manager' || userRole === 'municipal' || userRole === 'agency';
  }, [userRole]);

  const value = useMemo(() => ({
    userRole,
    loading,
    hasRole,
    canDeleteProjects,
    canViewAllProjects,
    canViewMunicipalDashboard,
    isAdmin: userRole === 'admin',
    isAccountManager: userRole === 'account_manager',
    isUser: userRole === 'user',
    isMunicipal: userRole === 'municipal',
    isAgency: userRole === 'agency'
  }), [userRole, loading, hasRole, canDeleteProjects, canViewAllProjects, canViewMunicipalDashboard]);

  return value;
};