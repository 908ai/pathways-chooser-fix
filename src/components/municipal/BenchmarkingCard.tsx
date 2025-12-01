import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';

const BenchmarkingCard = ({ projects }: { projects: any[] }) => {
  const { topPerformers, trend } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { topPerformers: [], trend: { direction: 'neutral', value: 0 } };
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

    return { topPerformers, trend: { direction: trendDirection, value: trendValue } };
  }, [projects]);

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
          <h4 className="text-sm font-semibold mb-2">Top Performers (by Avg. Airtightness)</h4>
          {topPerformers.length > 0 ? (
            <div className="space-y-2">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                  <span className="font-medium">{index + 1}. {performer.name}</span>
                  <span className="font-bold text-blue-600">{performer.avg.toFixed(2)} ACH₅₀</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not enough data for benchmarking.</p>
          )}
        </div>
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Airtightness Trend (Last 90 Days)</h4>
          {trend.direction === 'down' && (
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="h-5 w-5" />
              <p className="font-semibold">Improving! Average airtightness is {trend.value.toFixed(0)}% lower.</p>
            </div>
          )}
          {trend.direction === 'up' && (
            <div className="flex items-center gap-2 text-red-600">
              <TrendingUp className="h-5 w-5" />
              <p className="font-semibold">Worsening. Average airtightness is {trend.value.toFixed(0)}% higher.</p>
            </div>
          )}
          {trend.direction === 'neutral' && (
            <p className="text-sm text-muted-foreground">No significant trend change in the last 90 days.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BenchmarkingCard;