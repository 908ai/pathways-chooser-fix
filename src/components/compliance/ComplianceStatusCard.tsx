import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface ComplianceStatusCardProps {
  project: any;
}

const ComplianceStatusCard = ({ project }: ComplianceStatusCardProps) => {
  const getStatusInfo = () => {
    switch (project.compliance_status) {
      case 'pass':
      case 'Compliant':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: 'Project is Compliant',
          description: 'This project meets the required energy efficiency standards for its selected pathway.',
          badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Compliant</Badge>,
        };
      case 'fail':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: 'Project is Non-Compliant',
          description: 'This project does not meet the required standards. See recommendations below for next steps.',
          badge: <Badge variant="destructive">Non-Compliant</Badge>,
        };
      case 'needs_revision':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-700 dark:text-yellow-300" />,
          title: 'Needs Revision',
          description: 'The project requires updates. Please review the pending items and resubmit.',
          badge: <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Needs Revision</Badge>,
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-blue-500" />,
          title: 'Under Review',
          description: 'This project has been submitted and is currently being reviewed by our team.',
          badge: <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Under Review</Badge>,
        };
    }
  };

  const { icon, title, description, badge } = getStatusInfo();

  if (project.compliance_status === 'needs_revision') {
    return (
      <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-500/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">{icon}</div>
            <p className="text-yellow-800 dark:text-yellow-200">{description}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          {badge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">{icon}</div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceStatusCard;