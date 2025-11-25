import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FileText, Zap } from 'lucide-react';

const COLORS = {
  'Prescriptive': '#f97316', // orange-500
  'Performance': '#3b82f6', // blue-500
  'Tiered Prescriptive': '#a855f7', // purple-500
  'Tiered Performance': '#22d3ee', // cyan-400
};

const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered Prescriptive',
  '9365': 'Performance',
  '9367': 'Tiered Performance',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-2 border border-slate-600 rounded-md text-white">
        <p className="label">{`${payload[0].name} : ${payload[0].value} project(s)`}</p>
      </div>
    );
  }
  return null;
};

const CompliancePathwayChart = ({ data }: { data: any[] }) => {
  const chartData = Object.entries(
    data.reduce((acc, project) => {
      const pathway = pathwayMapping[project.selected_pathway] || 'Unknown';
      acc[pathway] = (acc[pathway] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          Compliance Pathways
        </CardTitle>
        <CardDescription className="text-slate-300">Distribution of your projects by pathway.</CardDescription>
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
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompliancePathwayChart;