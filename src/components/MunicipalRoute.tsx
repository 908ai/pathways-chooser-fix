import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

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
        navigate('/dashboard'); 
      }
    }
  }, [user, canViewMunicipalDashboard, authLoading, roleLoading, navigate]);

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (canViewMunicipalDashboard) {
    return <>{children}</>;
  }

  return null;
};

export default MunicipalRoute;