import { useState } from 'react';
import { useNbcCalculator } from '@/hooks/useNbcCalculator';
import ProjectSummaryForm from '@/components/ProjectSummaryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import ProjectInformation from './calculator/ProjectInformation';
import CompliancePathSelection from './calculator/CompliancePathSelection';
import Form9362 from './calculator/Form9362';
import Form9365 from './calculator/Form9365';
import Form9367 from './calculator/Form9367';
import Form9368 from './calculator/Form9368';
import ResultsSidebar from './calculator/ResultsSidebar';

interface NBCCalculatorProps {
  onPathwayChange: (info: string) => void;
}

const NBCCalculator = ({ onPathwayChange }: NBCCalculatorProps) => {
  const calculator = useNbcCalculator(onPathwayChange);
  const [showSummary, setShowSummary] = useState(false);

  const renderForm = () => {
    switch (calculator.formData.compliancePath) {
      case '9362':
        return <Form9362 calculator={calculator} />;
      case '9365':
        return <Form9365 calculator={calculator} />;
      case '9367':
        return <Form9367 calculator={calculator} />;
      case '9368':
        return <Form9368 calculator={calculator} />;
      default:
        return <p>Please select a compliance path.</p>;
    }
  };

  if (showSummary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProjectSummaryForm
          calculatorData={calculator.formData}
          editingProjectId={calculator.editingProjectId}
          onSave={() => setShowSummary(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CompliancePathSelection calculator={calculator} />
          <ProjectInformation calculator={calculator} />
          {renderForm()}
          <div className="flex justify-end">
            <Button size="lg" onClick={() => setShowSummary(true)}>
              <Save className="mr-2 h-4 w-4" />
              Review and Save Project
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ResultsSidebar calculator={calculator} />
        </div>
      </div>
    </div>
  );
};

export default NBCCalculator;