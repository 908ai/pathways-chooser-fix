import ComplianceStatusCard from './ComplianceStatusCard';
import PerformanceComplianceView from './PerformanceComplianceView';
import TieredPrescriptiveComplianceView from './TieredPrescriptiveComplianceView';
import PrescriptiveComplianceView from './PrescriptiveComplianceView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import ProjectStatusCard from '@/components/ProjectStatusCard';

interface ComplianceDetailsProps {
  project: any;
  onFixItem: (fieldId: string) => void;
}

const mapRecommendationToFieldId = (rec: string): string | null => {
    const lowerRec = rec.toLowerCase();
    if (lowerRec.includes('wall rsi')) return 'wallRSI';
    if (lowerRec.includes('window')) return 'windowUValue';
    if (lowerRec.includes('airtightness')) return 'airtightness';
    if (lowerRec.includes('attic rsi')) return 'ceilingsAtticRSI';
    if (lowerRec.includes('below grade')) return 'belowGradeRSI';
    return null;
};

const ComplianceDetails = ({ project, onFixItem }: ComplianceDetailsProps) => {
  const isCompleted = project.compliance_status === 'pass' || project.compliance_status === 'fail' || project.compliance_status === 'Compliant';

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
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((rec: string, index: number) => {
              const fieldId = mapRecommendationToFieldId(rec);
              if (fieldId) {
                return (
                  <button
                    key={index}
                    onClick={() => onFixItem(fieldId)}
                    className="w-full text-left p-3 rounded-md bg-yellow-900/20 hover:bg-yellow-900/40 transition-colors flex items-center justify-between"
                  >
                    <span className="text-yellow-200 text-sm">{rec}</span>
                    <ChevronRight className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                  </button>
                );
              }
              return (
                <div key={index} className="p-3 text-yellow-200 text-sm bg-yellow-900/20 rounded-md flex items-center col-span-2">
                  {rec}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {project && !isCompleted && (
        <ProjectStatusCard project={project} onFixItem={onFixItem} />
      )}
      <ComplianceStatusCard project={project} />
      {renderRecommendations()}
      {renderComplianceView()}
    </div>
  );
};

export default ComplianceDetails;