import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building } from 'lucide-react';

const statusMapping: { [key: string]: string } = {
  'draft': 'Draft',
  'submitted': 'Submitted',
  'needs_revision': 'Needs Revision',
  'pass': 'Compliant',
  'Compliant': 'Compliant',
  'fail': 'Non-Compliant',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover p-2 border border-border rounded-md shadow-lg text-popover-foreground">
        <p className="label">{`${payload[0].payload.name} : ${payload[0].value} project(s)`}</p>
      </div>
    );
  }
  return null;
};

const ProjectStatusChart = ({ data }: { data: any[] }) => {
  const chartData = Object.entries(
    data.reduce((acc, project) => {
      const status = statusMapping[project.compliance_status] || 'In Progress';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, projects: value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          Project Status
        </CardTitle>
        <CardDescription>Current breakdown of your projects by status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
            <Bar dataKey="projects" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;