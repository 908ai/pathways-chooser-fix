import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NBCCalculator from "@/components/NBCCalculator";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const Calculator = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header 
        showSignOut={true} 
        onSignOut={signOut} 
      />
      <main className="flex-1 relative z-10 pb-12">
        {/* <div className="container mx-auto px-4 py-4">
          <button 
            onClick={handleBackToDashboard}
            className="mb-4 text-sm text-white hover:text-gray-200 flex items-center gap-2 hover:underline drop-shadow-md"
          >
            ← Back to Dashboard
          </button>
        </div> */}
        <NBCCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;