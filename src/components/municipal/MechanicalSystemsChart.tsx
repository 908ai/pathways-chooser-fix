import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SlidersHorizontal } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const getSystemType = (heatingType: string | null) => {
  const type = heatingType?.toLowerCase() || '';
  if (type.includes('electric') || type.includes('heat pump')) {
    return 'Electric / Heat Pump';
  }
  if (type.includes('gas') || type.includes('furnace') || type.includes('boiler')) {
    return 'Natural Gas';
  }
  return 'Other / Unknown';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
        <p className="label">{`${payload[0].name} : ${payload[0].value} project(s)`}</p>
      </div>
    );
  }
  return null;
};

const MechanicalSystemsChart = ({ data }: { data: any[] }) => {
  const systemCounts = data.reduce<Record<string, number>>((acc, project) => {
    const type = getSystemType(project.heating_system_type);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(systemCounts).map((name) => ({
    name,
    value: systemCounts[name],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          Mechanical Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MechanicalSystemsChart;