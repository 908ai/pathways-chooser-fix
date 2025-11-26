import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "About the App",
    items: [
      {
        question: "What does this app do?",
        answer: "The app helps you compare the two main compliance paths available under NBC 9.36 (Prescriptive and Performance), estimate upgrade costs, and understand what's required to meet Tier 1 or Tier 2 energy performance. It simplifies code compliance and helps guide your design and product choices."
      },
      {
        question: "Where do the upgrade costs come from?",
        answer: "Our upgrade costs are based on a detailed case study of a two-storey home built in Lloydminster, Alberta. We priced out both Tier 1 and Tier 2 upgrade paths using actual quotes from local trades and suppliers. This gives you a realistic sense of the cost difference between prescriptive and performance compliance — not just theoretical estimates."
      },
      {
        question: "What's the difference between the Prescriptive and Performance paths?",
        answer: "Prescriptive Path follows a checklist of minimum component requirements (insulation, windows, HVAC, etc.). Performance Path allows flexibility by using whole-building energy modeling. You can trade off components as long as the house meets the required overall performance."
      }
    ]
  },
  {
    category: "Using the App",
    items: [
      {
        question: "Do I need to know my mechanical system selections before using the app?",
        answer: "Not necessarily. You can begin with placeholder equipment if mechanical specifications aren't finalized yet. However, keep in mind that results and upgrade costs may change once actual systems are selected. Final equipment choices must be verified to meet the requirements of the Authority Having Jurisdiction (AHJ)."
      },
      {
        question: "How accurate are the cost estimates?",
        answer: "They're high-level estimates based on typical upgrade costs in your region for a specific home design (but very typical for Alberta & Saskatchewan). They're meant to give you a ballpark to support decision-making."
      },
      {
        question: "Will using the app guarantee code compliance?",
        answer: "The app helps guide you toward compliance, but actual compliance depends on your final construction details and review by an energy advisor. If your project is non-compliant, we'll let you know and offer help to optimize the design."
      },
      {
        question: "Can I go back and edit my inputs later?",
        answer: "Absolutely. You can revise your selections and resubmit if plans change."
      }
    ]
  }
];

const FaqPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Frequently Asked Questions</h1>
          <p className="text-slate-500 mt-1">
            Common questions about energy compliance and our services
          </p>
        </div>
        <Card className="bg-white shadow-sm rounded-lg">
          <CardContent className="p-6">
            {faqData.map((categoryItem) => (
              <div key={categoryItem.category} className="mb-8 last:mb-0">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{categoryItem.category}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {categoryItem.items.map((item, index) => (
                    <AccordionItem value={`item-${categoryItem.category}-${index}`} key={index}>
                      <AccordionTrigger className="text-left font-medium text-slate-700 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;