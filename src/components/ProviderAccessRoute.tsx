import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProviderAccess } from '@/hooks/useProviderAccess';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProviderAccessRouteProps {
  children: React.ReactNode;
}

const ProviderAccessRoute = ({ children }: ProviderAccessRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading: accessLoading } = useProviderAccess();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoading = authLoading || accessLoading;
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (data && !data.hasAccess) {
        navigate('/request-provider-access');
      }
    }
  }, [user, data, authLoading, accessLoading, navigate]);

  const isLoading = authLoading || accessLoading;

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

  if (data?.hasAccess) {
    return <>{children}</>;
  }

  return null;
};

export default ProviderAccessRoute;