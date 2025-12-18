"use client";

import { useMemo } from 'react';
import { ProjectSummary } from '@/integrations/supabase/types';
import StatCard from '@/components/dashboard3/StatCard';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import ComplianceHurdlesChart from '@/components/dashboard3/ComplianceHurdlesChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface ReportingTabProps {
  projects: ProjectSummary[];
}

export default function ReportingTab({ projects }: ReportingTabProps) {
  const analytics = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        compliantProjects: 0,
        pendingProjects: 0,
        complianceRate: 0,
        monthlySubmissions: [],
        pathwayDistribution: [],
        complianceHurdlesData: [],
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
          const component = rec.split(' ')[1];
          if (component) {
            const key = component.replace(/[^a-zA-Z]/g, '');
            acc[key] = (acc[key] || 0) + 1;
          }
        }
        return acc;
      }, {} as Record<string, number>);

    const complianceHurdlesData = Object.entries(complianceHurdles)
      .map(([name, count]) => ({ name, count: Number(count) }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 5);

    return {
      totalProjects,
      compliantProjects,
      pendingProjects,
      complianceRate,
      monthlySubmissions: monthlySubmissionsData,
      pathwayDistribution: pathwayDistributionData,
      complianceHurdlesData,
    };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={analytics.totalProjects} icon={<Building />} />
        <StatCard title="Compliant" value={analytics.compliantProjects} icon={<CheckCircle />} />
        <StatCard title="Pending/In Review" value={analytics.pendingProjects} icon={<Clock />} />
        <StatCard title="Overall Compliance Rate" value={`${analytics.complianceRate.toFixed(0)}%`} icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlySubmissionsChart data={analytics.monthlySubmissions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            <CompliancePathwayChart data={analytics.pathwayDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart data={projects} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Common Compliance Hurdles</CardTitle>
            <CardDescription>Top areas needing improvement in non-compliant projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceHurdlesChart data={analytics.complianceHurdlesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}