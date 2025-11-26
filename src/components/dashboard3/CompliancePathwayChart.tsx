import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  'Prescriptive': '#f97316', // orange-500
  'Performance': '#6366f1', // indigo-500
  'Tiered (Tier 2+)': '#10b981', // emerald-500
};

const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered (Tier 2+)',
  '9365': 'Performance',
  '9367': 'Tiered (Tier 2+)',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 rounded-md shadow-lg text-slate-800">
        <p className="label">{`${payload[0].name} : ${payload[0].value} project(s)`}</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.payload.value, 0);
  if (total === 0) return null;

  return (
    <ul className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.value}</span>
          </div>
          <span className="font-semibold text-slate-800">{`${Math.round((entry.payload.payload.value / total) * 100)}%`}</span>
        </li>
      ))}
    </ul>
  );
};

const CompliancePathwayChart = ({ data }: { data: any[] }) => {
  const chartData = Object.entries(
    data.reduce((acc, project) => {
      const pathway = pathwayMapping[project.selected_pathway] || 'Unknown';
      if (pathway === 'Tiered Prescriptive' || pathway === 'Tiered Performance') {
        acc['Tiered (Tier 2+)'] = (acc['Tiered (Tier 2+)'] || 0) + 1;
      } else {
        acc[pathway] = (acc[pathway] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const totalProjects = chartData.reduce((sum, entry) => sum + (entry.value as number), 0);

  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-slate-900">Compliance Pathways</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
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
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900">{totalProjects}</span>
            <span className="text-sm text-slate-500">Total Projects</span>
          </div>
        </div>
        <div className="mt-4">
          <Legend content={renderLegend} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompliancePathwayChart;