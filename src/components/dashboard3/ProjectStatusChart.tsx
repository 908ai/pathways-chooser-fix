import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building } from 'lucide-react';

const statusMapping: { [key: string]: string } = {
  'draft': 'Draft',
  'submitted': 'Submitted',
  'needs_revision': 'Needs Revision',
  'pass': 'Compliant',
  'Compliant': 'Compliant',
  'fail': 'Non-Compliant',
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
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-slate-400" />
          Project Status
        </CardTitle>
        <CardDescription className="text-slate-300">Current breakdown of your projects by status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569'}} />
            <Bar dataKey="projects" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;