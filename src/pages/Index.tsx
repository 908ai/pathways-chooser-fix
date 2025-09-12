import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NBCCalculator from "@/components/NBCCalculator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [pathwayInfo, setPathwayInfo] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0"></div>
        <div className="text-lg text-white relative z-10">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo={pathwayInfo} />
      <main className="flex-1 relative z-10">
        <NBCCalculator onPathwayChange={setPathwayInfo} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;