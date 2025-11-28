import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, loading, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0"></div>
      <div className="text-lg text-white relative z-10">Loading...</div>
    </div>
  );
};

export default Index;