import ComplianceStatusCard from '@/components/ComplianceStatusCard';
import PerformanceComplianceView from '@/components/PerformanceComplianceView';
import TieredPrescriptiveComplianceView from '@/components/TieredPrescriptiveComplianceView';
import PrescriptiveComplianceView from '@/components/PrescriptiveComplianceView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ComplianceDetailsProps {
  project: any;
}

const ComplianceDetails = ({ project }: ComplianceDetailsProps) => {
  const renderComplianceView = () => {
    switch (project.selected_pathway) {
      case '9365':
      case '9367':
        return <PerformanceComplianceView project={project} />;
      case '9368':
        return <TieredPrescriptiveComplianceView project={project} />;
      case '9362':
        return <PrescriptiveComplianceView project={project} />;
      default:
        return (
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Compliance details for this pathway are not yet available.</p>
            </CardContent>
          </Card>
        );
    }
  };

  const renderRecommendations = () => {
    if (project.compliance_status !== 'fail' && project.compliance_status !== 'needs_revision') {
      return null;
    }

    // Mock recommendations
    const recommendations = project.recommendations || [
      "Increase Wall RSI to 3.69 to gain an additional 4.6 points.",
      "Upgrade windows to a U-Value of 1.44 or lower.",
      "Improve airtightness to at least AL-2A level.",
    ];

    if (recommendations.length === 0) return null;

    return (
      <Card className="bg-yellow-900/30 border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-yellow-200">
            {recommendations.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <ComplianceStatusCard project={project} />
      {renderRecommendations()}
      {renderComplianceView()}
    </div>
  );
};

export default ComplianceDetails;