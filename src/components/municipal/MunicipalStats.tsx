import StatCard from '@/components/dashboard3/StatCard';
import { BarChart2, CheckSquare, Clock, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MunicipalStats = ({ projects, pathwayStats }: { projects: any[], pathwayStats: Record<string, number> }) => {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const pendingReview = projects.filter(p => p.compliance_status === 'submitted').length;
    const completed = projects.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail');
    const compliant = completed.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant');
    const complianceRate = completed.length > 0 ? Math.round((compliant.length / completed.length) * 100) : 0;

    return { totalProjects, pendingReview, complianceRate };
  }, [projects]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Projects" value={stats.totalProjects} icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />} />
      <StatCard title="Pending Review" value={stats.pendingReview} icon={<Clock className="h-4 w-4 text-muted-foreground" />} description="Projects awaiting approval" />
      <StatCard title="Compliance Rate" value={`${stats.complianceRate}%`} icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />} description="Of completed projects" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pathway Breakdown</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {Object.entries(pathwayStats).length > 0 ? (
            Object.entries(pathwayStats).map(([pathway, count]) => (
              <div key={pathway} className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">{pathway}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MunicipalStats;