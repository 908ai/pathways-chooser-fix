import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Layers } from 'lucide-react';
import { useMemo } from 'react';

const getTier = (project: any) => {
  if (project.selected_pathway === '9368' && typeof project.total_points === 'number') {
    const points = project.total_points;
    if (points >= 75) return 'Tier 5';
    if (points >= 40) return 'Tier 4';
    if (points >= 20) return 'Tier 3';
    if (points >= 10) return 'Tier 2';
  }
  // For other paths or if points are null, assume Tier 1
  return 'Tier 1';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground text-sm">
        <p className="label">{`${payload[0].payload.name}: ${payload[0].value} projects`}</p>
      </div>
    );
  }
  return null;
};

const TierDistributionChart = ({ data }: { data: any[] }) => {
  const tierCounts = data.reduce<Record<string, number>>((acc, project) => {
    const tier = getTier(project);
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {});

  const chartData = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'].map(tier => ({
    name: tier,
    count: tierCounts[tier] || 0,
  }));

  const summary = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return "No tier data available.";
    }
    const mostCommonTier = [...chartData].filter(d => d.count > 0).sort((a, b) => b.count - a.count)[0];
    if (!mostCommonTier) return "No projects with tier data found.";
    return `The most common compliance level is ${mostCommonTier.name}.`;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Layers className="h-5 w-5 text-muted-foreground" />
          Tier Distribution
        </CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="count" position="top" fill="hsl(var(--muted-foreground))" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TierDistributionChart;