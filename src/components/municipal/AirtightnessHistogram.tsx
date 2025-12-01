import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Wind } from 'lucide-react';
import { useMemo } from 'react';

const createHistogramData = (projects: any[]) => {
  const bins = [
    { name: '< 1.0', count: 0, max: 1.0 },
    { name: '1.0-1.5', count: 0, max: 1.5 },
    { name: '1.5-2.0', count: 0, max: 2.0 },
    { name: '2.0-2.5', count: 0, max: 2.5 },
    { name: '2.5-3.0', count: 0, max: 3.0 },
    { name: '3.0-3.5', count: 0, max: 3.5 },
    { name: '> 3.5', count: 0, max: Infinity },
  ];

  projects.forEach(p => {
    const value = p.airtightness_al;
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
        <p className="label">{`Range (ACH50): ${payload[0].payload.name}`}</p>
        <p className="intro">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AirtightnessHistogram = ({ data }: { data: any[] }) => {
  const histogramData = useMemo(() => createHistogramData(data), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Wind className="h-5 w-5 text-muted-foreground" />
          Airtightness Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="count" position="top" fill="hsl(var(--muted-foreground))" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AirtightnessHistogram;