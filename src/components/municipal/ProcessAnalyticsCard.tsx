import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const ProcessAnalyticsCard = ({ projects }: { projects: any[] }) => {
  const stats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        avgTimeToApproval: 0,
        revisionRate: 0,
        topRevisionReason: 'N/A',
      };
    }

    // 1. Average Time to Approval
    const completedProjects = projects.filter(p => 
      (p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail') && p.created_at && p.updated_at
    );
    
    let avgTimeToApproval = 0;
    if (completedProjects.length > 0) {
      const totalDuration = completedProjects.reduce((sum, p) => {
        const created = new Date(p.created_at).getTime();
        const updated = new Date(p.updated_at).getTime();
        return sum + (updated - created);
      }, 0);
      avgTimeToApproval = (totalDuration / completedProjects.length) / (1000 * 60 * 60 * 24); // Convert ms to days
    }

    // 2. Revision Rate
    const revisionProjects = projects.filter(p => p.compliance_status === 'needs_revision');
    const revisionRate = projects.length > 0 ? (revisionProjects.length / projects.length) * 100 : 0;

    // 3. Top Revision Reason
    const hurdles = revisionProjects
      .flatMap(p => p.recommendations || [])
      .reduce<Record<string, number>>((acc, rec) => {
          const lowerRec = rec.toLowerCase();
          if (lowerRec.includes('wall')) acc['Wall Insulation'] = (acc['Wall Insulation'] || 0) + 1;
          else if (lowerRec.includes('window')) acc['Windows'] = (acc['Windows'] || 0) + 1;
          else if (lowerRec.includes('airtightness')) acc['Airtightness'] = (acc['Airtightness'] || 0) + 1;
          else if (lowerRec.includes('attic')) acc['Attic Insulation'] = (acc['Attic Insulation'] || 0) + 1;
          else if (lowerRec.includes('foundation') || lowerRec.includes('below grade')) acc['Foundation'] = (acc['Foundation'] || 0) + 1;
          else acc['Other'] = (acc['Other'] || 0) + 1;
          return acc;
      }, {});
    
    const topRevisionReason = Object.entries(hurdles).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      avgTimeToApproval,
      revisionRate,
      topRevisionReason,
    };
  }, [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Process Analytics
        </CardTitle>
        <CardDescription>Insights into the project review workflow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Avg. Time to Approval</p>
            <p className="text-xs text-muted-foreground">From submission to final status</p>
          </div>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.avgTimeToApproval.toFixed(1)} days</p>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Revision Rate</p>
            <p className="text-xs text-muted-foreground">% of projects needing revision</p>
          </div>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{stats.revisionRate.toFixed(0)}%</p>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Top Revision Reason</p>
            <p className="text-xs text-muted-foreground">Most common compliance hurdle</p>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.topRevisionReason}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessAnalyticsCard;