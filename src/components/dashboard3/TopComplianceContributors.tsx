import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Award } from 'lucide-react';

interface ContributorData {
  name: string;
  averagePoints: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-2 border border-slate-600 rounded-md text-white text-sm">
        <p className="label">{`${payload[0].payload.name} : ${payload[0].value.toFixed(1)} avg. points`}</p>
      </div>
    );
  }
  return null;
};

const TopComplianceContributors = ({ data }: { data: ContributorData[] }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Top Point Contributors
          </CardTitle>
          <CardDescription className="text-slate-300">Average points from Tiered Prescriptive projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-10">No Tiered Prescriptive projects with points data found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          Top Point Contributors
        </CardTitle>
        <CardDescription className="text-slate-300">Average points from Tiered Prescriptive projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
            <Bar dataKey="averagePoints" fill="#facc15">
              <LabelList dataKey="averagePoints" position="right" formatter={(value: number) => value.toFixed(1)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopComplianceContributors;