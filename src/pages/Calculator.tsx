import { useParams } from "react-router-dom";
import NBCCalculator from "@/components/NBCCalculator";
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const Calculator = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <NBCCalculator projectId={id} />
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;