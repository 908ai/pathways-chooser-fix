import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MunicipalDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Municipal Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            An overview of project compliance and trends for municipal partners.
          </p>
        </div>
        <div>
          {/* Content will go here */}
          <p>Municipal dashboard content coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MunicipalDashboard;