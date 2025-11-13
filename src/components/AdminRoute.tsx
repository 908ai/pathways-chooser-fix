import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoading = authLoading || roleLoading;
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/dashboard'); // Or a dedicated "unauthorized" page
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default AdminRoute;