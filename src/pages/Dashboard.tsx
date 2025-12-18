"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard3/StatCard';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import RecentProjectsList from '@/components/dashboard3/RecentProjectsList';
import ComplianceHurdlesChart, { HurdleData } from '@/components/dashboard3/ComplianceHurdlesChart';
import AverageRsiCard from '@/components/dashboard3/AverageRsiCard';
import EfficiencyInsightCard from '@/components/dashboard3/EfficiencyInsightCard';
import TopComplianceContributors from '@/components/dashboard3/TopComplianceContributors';
import { useUserRole } from '@/hooks/useUserRole';
import AdminDashboard from './AdminDashboard';
import MunicipalDashboard from './MunicipalDashboard';
import { ProjectSummary } from '@/integrations/supabase/types';
import { Building, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { userRole: role } = useUserRole();
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('project_summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data as ProjectSummary[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  const analytics = useMemo(() => {
    if (!projects) {
      return {
        totalProjects: 0,
        compliantProjects: 0,
        pendingProjects: 0,
        complianceRate: 0,
        monthlySubmissions: [],
        pathwayDistribution: [],
        complianceHurdlesData: [],
        averageRsi: { attic: 0, wall: 0, below_grade: 0 },
        topContributors: [],
      };
    }

    const totalProjects = projects.length;
    const compliantProjects = projects.filter(p => p.compliance_status === 'Compliant').length;
    const pendingProjects = totalProjects - compliantProjects;
    const complianceRate = totalProjects > 0 ? (compliantProjects / totalProjects) * 100 : 0;

    const monthlySubmissions = projects.reduce((acc, p) => {
      const month = new Date(p.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlySubmissionsData = Object.entries(monthlySubmissions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    const pathwayDistribution = projects.reduce((acc, p) => {
      const pathway = p.selected_pathway || 'Unknown';
      acc[pathway] = (acc[pathway] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pathwayDistributionData = Object.entries(pathwayDistribution).map(([name, count]) => ({ name, count }));

    const complianceHurdles = projects
      .filter(p => p.compliance_status !== 'Compliant' && p.recommendations)
      .flatMap(p => p.recommendations)
      .reduce((acc, rec) => {
        if (typeof rec === 'string') {
          const component = rec.split(' ')[1]; // e.g., "Improve [Attic] insulation..."
          if (component) {
            const key = component.replace(/[^a-zA-Z]/g, '');
            acc[key] = (acc[key] || 0) + 1;
          }
        }
        return acc;
      }, {} as Record<string, number>);

    const complianceHurdlesData: HurdleData[] = Object.entries(complianceHurdles)
      .map(([name, count]) => ({ name, count: Number(count) }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 5);

    const rsiValues = projects.reduce((acc, p) => {
      if (p.attic_rsi) acc.attic.push(p.attic_rsi);
      if (p.wall_rsi) acc.wall.push(p.wall_rsi);
      if (p.below_grade_rsi) acc.below_grade.push(p.below_grade_rsi);
      return acc;
    }, { attic: [] as number[], wall: [] as number[], below_grade: [] as number[] });

    const calculateAverage = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const averageRsi = {
      attic: calculateAverage(rsiValues.attic),
      wall: calculateAverage(rsiValues.wall),
      below_grade: calculateAverage(rsiValues.below_grade),
    };

    const topContributors = projects
      .filter(p => p.total_points)
      .sort((a, b) => b.total_points! - a.total_points!)
      .slice(0, 3)
      .map(p => ({ name: p.project_name, value: p.total_points }));

    return {
      totalProjects,
      compliantProjects,
      pendingProjects,
      complianceRate,
      monthlySubmissions: monthlySubmissionsData,
      pathwayDistribution: pathwayDistributionData,
      complianceHurdlesData,
      averageRsi,
      topContributors,
    };
  }, [projects]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'account_manager') {
    return <MunicipalDashboard />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Button asChild>
          <Link to="/calculator">New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Projects" value={analytics.totalProjects} icon={<Building />} />
        <StatCard title="Compliant" value={analytics.compliantProjects} icon={<CheckCircle />} />
        <StatCard title="Pending Review" value={analytics.pendingProjects} icon={<Clock />} />
        <StatCard title="Compliance Rate" value={`${analytics.complianceRate.toFixed(0)}%`} icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlySubmissionsChart data={analytics.monthlySubmissions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentProjectsList projects={projects?.slice(0, 5) || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            <CompliancePathwayChart data={analytics.pathwayDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Common Compliance Hurdles</CardTitle>
            <CardDescription>Top areas needing improvement in non-compliant projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart data={projects || []} />
            <ComplianceHurdlesChart data={analytics.complianceHurdlesData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <AverageRsiCard data={analytics.averageRsi} />
        <EfficiencyInsightCard />
        <TopComplianceContributors data={analytics.topContributors as { name: string; value: number | null }[]} />
      </div>
    </div>
  );
};

export default Dashboard;