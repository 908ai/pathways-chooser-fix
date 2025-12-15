import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, TrendingUp, TrendingDown, Minus, ChevronsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const BenchmarkingCard = ({ projects }: { projects: any[] }) => {
  const { topPerformers, bottomPerformers, trend } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { topPerformers: [], bottomPerformers: [], trend: { direction: 'neutral', value: 0 } };
    }

    // Top Performers by Airtightness
    const projectsWithData = projects.filter(p => p.company_name && typeof p.airtightness_al === 'number' && p.airtightness_al > 0);
    const builderStats = projectsWithData.reduce<Record<string, { sum: number; count: number }>>((acc, p) => {
      const name = p.company_name || 'Individual';
      if (!acc[name]) {
        acc[name] = { sum: 0, count: 0 };
      }
      acc[name].sum += p.airtightness_al;
      acc[name].count++;
      return acc;
    }, {});

    const topPerformers = Object.entries(builderStats)
      .map(([name, data]) => ({ name, avg: data.sum / data.count }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    const bottomPerformers = Object.entries(builderStats)
      .map(([name, data]) => ({ name, avg: data.sum / data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    // Performance Trend Alert
    const now = new Date();
    const ninetyDaysAgo = new Date(new Date().setDate(now.getDate() - 90));
    
    const recentProjects = projects.filter(p => new Date(p.created_at) >= ninetyDaysAgo && typeof p.airtightness_al === 'number');
    const allProjects = projects.filter(p => typeof p.airtightness_al === 'number');

    const recentAvg = recentProjects.length > 0 ? recentProjects.reduce((sum, p) => sum + p.airtightness_al, 0) / recentProjects.length : 0;
    const allTimeAvg = allProjects.length > 0 ? allProjects.reduce((sum, p) => sum + p.airtightness_al, 0) / allProjects.length : 0;

    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
    if (recentAvg > 0 && allTimeAvg > 0) {
      if (recentAvg < allTimeAvg) trendDirection = 'down'; // Better
      if (recentAvg > allTimeAvg) trendDirection = 'up'; // Worse
    }
    const trendValue = allTimeAvg > 0 ? Math.abs(((recentAvg - allTimeAvg) / allTimeAvg) * 100) : 0;

    return { topPerformers, bottomPerformers, trend: { direction: trendDirection, value: trendValue } };
  }, [projects]);

  const rankingColors = [
    'text-yellow-500', // Gold
    'text-slate-400',  // Silver
    'text-orange-400'  // Bronze
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Benchmarking & Trends
        </CardTitle>
        <CardDescription>Highlighting top performers and recent performance trends.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Top Performers (by Avg. Airtightness)</h4>
          {topPerformers.length > 0 ? (
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={cn("font-bold text-lg", rankingColors[index] || 'text-muted-foreground')}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{performer.avg.toFixed(2)} ACH₅₀</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Not enough data for benchmarking.</p>
          )}
        </div>

        {bottomPerformers.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
              <ChevronsDown className="h-4 w-4" />
              Improvement Opportunities
            </h4>
            <div className="space-y-3">
              {bottomPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{performer.name}</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{performer.avg.toFixed(2)} ACH₅₀</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Airtightness Trend (Last 90 Days)</h4>
          {trend.direction === 'down' && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/50 text-green-700 dark:text-green-300">
              <TrendingDown className="h-6 w-6 flex-shrink-0" />
              <p className="font-semibold">Improving! Average airtightness is {trend.value.toFixed(0)}% lower.</p>
            </div>
          )}
          {trend.direction === 'up' && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300">
              <TrendingUp className="h-6 w-6 flex-shrink-0" />
              <p className="font-semibold">Worsening. Average airtightness is {trend.value.toFixed(0)}% higher.</p>
            </div>
          )}
          {trend.direction === 'neutral' && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Minus className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No significant trend change in the last 90 days.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BenchmarkingCard;