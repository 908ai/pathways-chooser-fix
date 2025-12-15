import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

export type UserRole = Database['public']['Enums']['app_role'] | 'builder' | 'energy_advisor' | 'building_official' | null

const fetchUserRole = async (userId: string | undefined) => {
  if (!userId) return null
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error) {
    // console.error('Error fetching user role:', error.message)
    return null
  }
  return data
}

const fetchUserProfileType = async (userId: string | undefined) => {
    if (!userId) return null
    const { data, error } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('id', userId)
        .single()

    if (error) {
        // console.error('Error fetching user profile type:', error.message)
        return null
    }
    return data
}

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth()

  const { data: roleData, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: () => fetchUserRole(user?.id),
    enabled: !!user,
  })

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfileType', user?.id],
    queryFn: () => fetchUserProfileType(user?.id),
    enabled: !!user,
  })

  const loading = authLoading || roleLoading || profileLoading

  const adminRole = (roleData?.role as UserRole) || null
  const profileType = (profileData?.profile_type as UserRole) || null
  
  const userRole = adminRole || profileType || 'user'

  return {
    userRole,
    loading,
    hasRole: (role: UserRole) => userRole === role,
    canDeleteProjects: userRole === 'admin' || userRole === 'account_manager',
    canViewAllProjects: userRole === 'admin' || userRole === 'account_manager',
    canViewMunicipalDashboard: userRole === 'admin' || userRole === 'building_official',
    isAdmin: userRole === 'admin',
    isAccountManager: userRole === 'account_manager',
    isUser: userRole === 'user',
    isBuilder: userRole === 'builder',
    isEnergyAdvisor: userRole === 'energy_advisor',
    isBuildingOfficial: userRole === 'building_official',
  }
}