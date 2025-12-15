import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NBCCalculator from "@/components/NBCCalculator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Calculator = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header 
        showSignOut={true} 
        onSignOut={signOut} 
      />
      <main className="flex-1 px-4 py-8 relative z-10">
        <NBCCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;