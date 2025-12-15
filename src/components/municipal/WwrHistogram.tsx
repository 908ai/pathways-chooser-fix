import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Square } from 'lucide-react';
import { useMemo } from 'react';

const createHistogramData = (projects: any[]) => {
  const bins = [
    { name: '<10%', count: 0, max: 0.10 },
    { name: '10-15%', count: 0, max: 0.15 },
    { name: '15-20%', count: 0, max: 0.20 },
    { name: '20-25%', count: 0, max: 0.25 },
    { name: '>25%', count: 0, max: Infinity },
  ];

  projects.forEach(p => {
    const value = p.window_to_wall_ratio;
    if (typeof value === 'number' && value > 0) {
      const bin = bins.find(b => value < b.max);
      if (bin) {
        bin.count++;
      }
    }
  });

  return bins;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground text-sm">
        <p className="label">{`Range (WWR): ${payload[0].payload.name}`}</p>
        <p className="intro">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const WwrHistogram = ({ data }: { data: any[] }) => {
  const histogramData = useMemo(() => createHistogramData(data), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Square className="h-5 w-5 text-muted-foreground" />
          Window-to-Wall Ratio Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
            <Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="count" position="top" fill="hsl(var(--muted-foreground))" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WwrHistogram;