import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const MunicipalAlertsCard = ({ projects }: { projects: any[] }) => {
  const alerts = useMemo(() => {
    if (!projects || projects.length < 10) { // Need enough data for meaningful trends
      return [{
        type: 'info',
        message: 'More data is needed to generate significant trends and alerts.'
      }];
    }

    const generatedAlerts = [];

    // 1. Airtightness Trend
    const now = new Date();
    const ninetyDaysAgo = new Date(new Date().setDate(now.getDate() - 90));
    const recentProjects = projects.filter(p => new Date(p.created_at) >= ninetyDaysAgo && typeof p.airtightness_al === 'number');
    const allProjects = projects.filter(p => typeof p.airtightness_al === 'number');
    const recentAvg = recentProjects.length > 0 ? recentProjects.reduce((sum, p) => sum + p.airtightness_al, 0) / recentProjects.length : 0;
    const allTimeAvg = allProjects.length > 0 ? allProjects.reduce((sum, p) => sum + p.airtightness_al, 0) / allProjects.length : 0;
    const trendValue = allTimeAvg > 0 ? Math.abs(((recentAvg - allTimeAvg) / allTimeAvg) * 100) : 0;

    if (recentAvg > allTimeAvg * 1.05) { // If it's 5% worse
      generatedAlerts.push({
        type: 'warning',
        message: `Airtightness performance has worsened by ${trendValue.toFixed(0)}% in the last 90 days.`
      });
    } else if (recentAvg < allTimeAvg * 0.95) { // If it's 5% better
        generatedAlerts.push({
            type: 'success',
            message: `Airtightness performance has improved by ${trendValue.toFixed(0)}% in the last 90 days.`
        });
    }

    // 2. Compliance Hurdles
    const hurdles = projects
      .filter(p => p.compliance_status === 'fail' || p.compliance_status === 'needs_revision')
      .flatMap(p => p.recommendations || [])
      .reduce((acc: Record<string, number>, rec) => {
          const lowerRec = rec.toLowerCase();
          if (lowerRec.includes('wall')) acc['Wall Insulation'] = (acc['Wall Insulation'] || 0) + 1;
          else if (lowerRec.includes('window')) acc['Windows'] = (acc['Windows'] || 0) + 1;
          else if (lowerRec.includes('airtightness')) acc['Airtightness'] = (acc['Airtightness'] || 0) + 1;
          else acc['Other'] = (acc['Other'] || 0) + 1;
          return acc;
      }, {});
    
    const topHurdle = Object.entries(hurdles).sort((a, b) => b[1] - a[1])[0];
    if (topHurdle) {
      generatedAlerts.push({
        type: 'info',
        message: `The most common compliance hurdle is currently '${topHurdle[0]}'.`
      });
    }

    return generatedAlerts.slice(0, 3); // Max 3 alerts

  }, [projects]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'success': return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Alerts & Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className={cn(
            "flex items-start gap-3 p-3 rounded-lg border",
            alert.type === 'warning' && 'bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-500/50',
            alert.type === 'success' && 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-500/50',
            alert.type === 'info' && 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-500/50',
          )}>
            <div className="flex-shrink-0 mt-0.5">{getIcon(alert.type)}</div>
            <p className={cn(
              "text-sm font-medium",
              alert.type === 'warning' && 'text-orange-800 dark:text-orange-300',
              alert.type === 'success' && 'text-green-800 dark:text-green-300',
              alert.type === 'info' && 'text-blue-800 dark:text-blue-300',
            )}>
              {alert.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MunicipalAlertsCard;