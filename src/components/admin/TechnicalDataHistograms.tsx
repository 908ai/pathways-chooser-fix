import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Wind } from 'lucide-react';
import { useMemo } from 'react';

interface TechnicalDataHistogramsProps {
  projects: any[];
}

const createHistogramData = (projects: any[], field: string, bins: number, min: number, max: number) => {
  const binSize = (max - min) / bins;
  const histogram = Array.from({ length: bins }, (_, i) => ({
    name: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
    count: 0,
  }));

  projects.forEach(p => {
    const value = p[field];
    if (typeof value === 'number' && value >= min && value < max) {
      const binIndex = Math.floor((value - min) / binSize);
      if (histogram[binIndex]) {
        histogram[binIndex].count++;
      }
    } else if (typeof value === 'number' && value === max) {
        // include max value in the last bin
        if (histogram[bins - 1]) {
            histogram[bins - 1].count++;
        }
    }
  });

  return histogram;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground text-sm">
        <p className="label">{`Range: ${label}`}</p>
        <p className="intro">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TechnicalDataHistograms = ({ projects }: TechnicalDataHistogramsProps) => {
  const atticRsiData = useMemo(() => createHistogramData(projects, 'attic_rsi', 10, 8, 14), [projects]);
  const wallRsiData = useMemo(() => createHistogramData(projects, 'wall_rsi', 10, 2.5, 6), [projects]);
  const airtightnessData = useMemo(() => createHistogramData(projects, 'airtightness_al', 10, 0.5, 4), [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">Technical Data Distribution</CardTitle>
        <CardDescription>Histograms of key performance metrics across all projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Thermometer className="h-5 w-5 text-red-500" />
            Attic RSI Values
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={atticRsiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
              <Bar dataKey="count" fill="#f87171" name="Attic RSI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Thermometer className="h-5 w-5 text-blue-500" />
            Wall RSI Values
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wallRsiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
              <Bar dataKey="count" fill="#60a5fa" name="Wall RSI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Wind className="h-5 w-5 text-green-500" />
            Airtightness (ACH50)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={airtightnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
              <Bar dataKey="count" fill="#4ade80" name="Airtightness" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalDataHistograms;