import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProviderAccess } from '@/hooks/useProviderAccess';
import { useAuth } from '@/hooks/useAuth';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

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
      <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (data?.hasAccess) {
    return <>{children}</>;
  }

  return null;
};

export default ProviderAccessRoute;