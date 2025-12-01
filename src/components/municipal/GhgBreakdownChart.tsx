import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Leaf } from 'lucide-react';
import { useMemo } from 'react';

const calculateGhg = (energyConsumption: number | null, province: string | null, heatingType: string | null) => {
  if (!energyConsumption) return 0;
  const heatingTypeLower = heatingType?.toLowerCase() || '';
  let isGas = heatingTypeLower.includes('gas') || heatingTypeLower.includes('furnace') || heatingTypeLower.includes('boiler');
  if (!heatingTypeLower.includes('electric') && !heatingTypeLower.includes('heat pump') && !isGas) isGas = true;
  let emissionFactor = 50; // kg CO2e per GJ for Natural Gas
  if (!isGas) {
    const provinceLower = province?.toLowerCase();
    if (provinceLower === 'alberta') emissionFactor = 136;
    else if (provinceLower === 'saskatchewan') emissionFactor = 183;
    else emissionFactor = 100;
  }
  return (energyConsumption * emissionFactor) / 1000; // returns tonnes CO2e
};

const getTier = (project: any) => {
  if (project.selected_pathway === '9368' && typeof project.total_points === 'number') {
    const points = project.total_points;
    if (points >= 10) return 'Tier 2+';
  }
  return 'Tier 1';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground text-sm">
        <p className="font-bold">{payload[0].payload.name}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(2)} tCO2e`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GhgBreakdownChart = ({ data }: { data: any[] }) => {
  const chartData = useMemo(() => {
    const performanceProjects = data.filter(p => (p.selected_pathway === '9365' || p.selected_pathway === '9367'));
    const prescriptiveProjects = data.filter(p => (p.selected_pathway === '9362' || p.selected_pathway === '9368'));

    const getAvgGhg = (projects: any[]) => {
      if (projects.length === 0) return 0;
      const totalGhg = projects.reduce((sum, p) => sum + calculateGhg(p.annual_energy_consumption, p.province, p.heating_system_type), 0);
      return totalGhg / projects.length;
    };

    const getAvgGhgByTier = (projects: any[], tier: string) => {
      const tierProjects = projects.filter(p => getTier(p) === tier);
      return getAvgGhg(tierProjects);
    };

    return [
      { name: 'Performance Path', 'Tier 1': getAvgGhgByTier(performanceProjects, 'Tier 1'), 'Tier 2+': getAvgGhgByTier(performanceProjects, 'Tier 2+') },
      { name: 'Prescriptive Path', 'Tier 1': getAvgGhgByTier(prescriptiveProjects, 'Tier 1'), 'Tier 2+': getAvgGhgByTier(prescriptiveProjects, 'Tier 2+') },
    ];
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          GHG Emissions Breakdown
        </CardTitle>
        <CardDescription>Average emissions (tCO2e/year) by pathway and tier.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Tier 1" fill="#fb923c" name="Tier 1" />
            <Bar dataKey="Tier 2+" fill="#22c55e" name="Tier 2+" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GhgBreakdownChart;