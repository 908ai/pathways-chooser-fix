import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const FaqPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Frequently Asked Questions</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Common questions about energy compliance and our services
          </p>
        </div>
        <Card className="bg-slate-800/60 backdrop-blur-[100px] border-slate-400/30 shadow-2xl">
          <CardContent className="text-slate-200 space-y-4 pt-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">About the App</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: What does this app do?</p>
                    <p className="text-sm text-slate-300">A: The app helps you compare the two main compliance paths available under NBC 9.36 (Prescriptive and Performance), estimate upgrade costs, and understand what's required to meet Tier 1 or Tier 2 energy performance. It simplifies code compliance and helps guide your design and product choices.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: Where do the upgrade costs come from?</p>
                    <p className="text-sm text-slate-300">A: Our upgrade costs are based on a detailed case study of a two-storey home built in Lloydminster, Alberta. We priced out both Tier 1 and Tier 2 upgrade paths using actual quotes from local trades and suppliers. This gives you a realistic sense of the cost difference between prescriptive and performance compliance — not just theoretical estimates.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: What's the difference between the Prescriptive and Performance paths?</p>
                    <p className="text-sm text-slate-300">A: Prescriptive Path follows a checklist of minimum component requirements (insulation, windows, HVAC, etc.). Performance Path allows flexibility by using whole-building energy modeling. You can trade off components as long as the house meets the required overall performance.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Using the App</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: Do I need to know my mechanical system selections before using the app?</p>
                    <p className="text-sm text-slate-300">A: Not necessarily. You can begin with placeholder equipment if mechanical specifications aren't finalized yet. However, keep in mind that results and upgrade costs may change once actual systems are selected. Final equipment choices must be verified to meet the requirements of the Authority Having Jurisdiction (AHJ).</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: How accurate are the cost estimates?</p>
                    <p className="text-sm text-slate-300">A: They're high-level estimates based on typical upgrade costs in your region for a specific home design (but very typical for Alberta & Saskatchewan). They're meant to give you a ballpark to support decision-making.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: Will using the app guarantee code compliance?</p>
                    <p className="text-sm text-slate-300">A: The app helps guide you toward compliance, but actual compliance depends on your final construction details and review by an energy advisor. If your project is non-compliant, we'll let you know and offer help to optimize the design.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Q: Can I go back and edit my inputs later?</p>
                    <p className="text-sm text-slate-300">A: Absolutely. You can revise your selections and resubmit if plans change.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;