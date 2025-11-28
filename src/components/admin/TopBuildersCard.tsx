import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { useMemo } from 'react';

interface TopBuildersCardProps {
  projects: any[];
}

const TopBuildersCard = ({ projects }: TopBuildersCardProps) => {
  const topBuilders = useMemo(() => {
    if (!projects) return [];

    const builderCounts = projects.reduce((acc, p) => {
      if (p.company_name && p.company_name !== 'N/A') {
        acc[p.company_name] = (acc[p.company_name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(builderCounts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Top Builders by Project Volume
        </CardTitle>
        <CardDescription>Companies with the most submitted projects.</CardDescription>
      </CardHeader>
      <CardContent>
        {topBuilders.length > 0 ? (
          <ul className="space-y-3">
            {topBuilders.map((builder, index) => (
              <li key={builder.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-muted-foreground w-6 text-center">{index + 1}</span>
                  <span className="font-medium text-card-foreground">{builder.name}</span>
                </div>
                <span className="font-bold text-lg text-primary">{builder.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">Not enough data to determine top builders.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TopBuildersCard;