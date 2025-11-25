import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

interface MunicipalRouteProps {
  children: React.ReactNode;
}

const MunicipalRoute = ({ children }: MunicipalRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { canViewMunicipalDashboard, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoading = authLoading || roleLoading;
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (!canViewMunicipalDashboard) {
        navigate('/dashboard'); // Redirect non-admins/managers to their own dashboard
      }
    }
  }, [user, canViewMunicipalDashboard, authLoading, roleLoading, navigate]);

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (canViewMunicipalDashboard) {
    return <>{children}</>;
  }

  return null;
};

export default MunicipalRoute;