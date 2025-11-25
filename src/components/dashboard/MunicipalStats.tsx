import StatCard from '@/components/dashboard3/StatCard';
import { BarChart2, CheckSquare, Clock } from 'lucide-react';
import { useMemo } from 'react';

const MunicipalStats = ({ projects }: { projects: any[] }) => {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const pendingReview = projects.filter(p => p.compliance_status === 'submitted').length;
    const completed = projects.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail');
    const compliant = completed.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant');
    const complianceRate = completed.length > 0 ? Math.round((compliant.length / completed.length) * 100) : 0;

    return { totalProjects, pendingReview, complianceRate };
  }, [projects]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard title="Total Projects" value={stats.totalProjects} icon={<BarChart2 />} />
      <StatCard title="Pending Review" value={stats.pendingReview} icon={<Clock />} description="Projects awaiting approval" />
      <StatCard title="Compliance Rate" value={`${stats.complianceRate}%`} icon={<CheckSquare />} description="Of completed projects" />
    </div>
  );
};

export default MunicipalStats;