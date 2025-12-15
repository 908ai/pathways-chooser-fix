import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Building } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatBuildingType = (type: string) => {
  if (!type) return 'Unknown';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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

const BuildingTypeChart = ({ data }: { data: any[] }) => {
  const typeCounts = data.reduce<Record<string, number>>((acc, project) => {
    const type = formatBuildingType(project.building_type);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(typeCounts).map((name) => ({
    name,
    value: typeCounts[name],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          Projects by Building Type
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

export default BuildingTypeChart;