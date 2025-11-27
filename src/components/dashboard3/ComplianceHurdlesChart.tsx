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
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground text-sm">
        <p className="label">{`${payload[0].payload.name}: ${payload[0].value} projects`}</p>
      </div>
    );
  }
  return null;
};

const ComplianceHurdlesChart = ({ data }: { data: HurdleData[] }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Common Compliance Hurdles
          </CardTitle>
          <CardDescription>Top reasons for project revisions or non-compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-10">No projects with revisions or non-compliance found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Common Compliance Hurdles
        </CardTitle>
        <CardDescription>Top reasons for project revisions or non-compliance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
            <Bar dataKey="count" fill="#fb923c">
              <LabelList dataKey="count" position="right" fill="hsl(var(--muted-foreground))" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ComplianceHurdlesChart;