import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 rounded-md shadow-lg text-slate-800">
        <p className="label">{`${payload[0].payload.name}: ${payload[0].value} submissions`}</p>
      </div>
    );
  }
  return null;
};

const MonthlySubmissionsChart = ({ data }: { data: any[] }) => {
  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      name: d.toLocaleString('default', { month: 'short' }),
      submissions: 0,
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }

  data.forEach(project => {
    const createdAt = new Date(project.created_at);
    const projectYear = createdAt.getFullYear();
    const projectMonth = createdAt.getMonth();

    const monthData = months.find(m => m.year === projectYear && m.month === projectMonth);
    if (monthData) {
      monthData.submissions++;
    }
  });

  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-500" />
          Monthly Submissions
        </CardTitle>
        <CardDescription className="text-slate-500">Last 6 months activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={months}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
            <Bar dataKey="submissions" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlySubmissionsChart;