import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Recycle } from 'lucide-react';

const sampleData = [
  { name: 'Foundation', value: 450 },
  { name: 'Insulation', value: 300 },
  { name: 'Windows', value: 220 },
  { name: 'Cladding', value: 180 },
];

const EmbodiedCarbonCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Recycle className="h-5 w-5 text-green-500" />
            Future Focus: Embodied Carbon
          </CardTitle>
          <Badge variant="outline">In Development</Badge>
        </div>
        <CardDescription>Tracking the carbon footprint of building materials to support sustainable construction goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-3xl font-bold">125 kgCO₂e/m²</p>
          <p className="text-xs text-muted-foreground">Average Embodied Carbon (Sample Data)</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} fontSize={12} />
            <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} />
            <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmbodiedCarbonCard;