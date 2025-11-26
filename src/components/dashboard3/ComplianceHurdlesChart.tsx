import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface HurdleData {
  name: string;
  count: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 rounded-md shadow-lg text-slate-800 text-sm">
        <p className="label">{`${payload[0].payload.name}: ${payload[0].value} projects`}</p>
      </div>
    );
  }
  return null;
};

const ComplianceHurdlesChart = ({ data }: { data: HurdleData[] }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Common Compliance Hurdles
          </CardTitle>
          <CardDescription className="text-slate-500">Top reasons for project revisions or non-compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-10">No projects with revisions or non-compliance found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Common Compliance Hurdles
        </CardTitle>
        <CardDescription className="text-slate-500">Top reasons for project revisions or non-compliance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#64748b" width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="count" fill="#fb923c">
              <LabelList dataKey="count" position="right" fill="#64748b" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ComplianceHurdlesChart;