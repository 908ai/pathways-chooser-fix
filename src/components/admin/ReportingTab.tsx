"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary } from "@/integrations/supabase/types";
import StatCard from "@/components/dashboard3/StatCard";
import ProjectStatusChart from "@/components/dashboard3/ProjectStatusChart";
import CompliancePathwayChart from "@/components/dashboard3/CompliancePathwayChart";
import MonthlySubmissionsChart from "@/components/dashboard3/MonthlySubmissionsChart";
import ComplianceHurdlesChart, { HurdleData } from "@/components/dashboard3/ComplianceHurdlesChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, TrendingUp, Target } from "lucide-react";

async function fetchAllProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await supabase.from("project_summaries").select("*");
  if (error) throw new Error(error.message);
  return data || [];
}

const calculateAnalytics = (projects: ProjectSummary[]) => {
  const totalProjects = projects.length;
  const compliantProjects = projects.filter(p => p.compliance_status === "Compliant").length;
  const complianceRate = totalProjects > 0 ? (compliantProjects / totalProjects) * 100 : 0;

  const monthlySubmissions = projects.reduce((acc, p) => {
    if (p.created_at) {
      const month = new Date(p.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const complianceHurdles = projects.reduce((acc, p) => {
    if (p.compliance_status !== "Compliant" && p.recommendations) {
      p.recommendations.forEach(rec => {
        const hurdle = rec.split('Improve ')[1]?.split(' ')[0];
        if (hurdle) {
          acc[hurdle] = (acc[hurdle] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const complianceHurdlesData: HurdleData[] = Object.entries(complianceHurdles)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalProjects,
    complianceRate,
    monthlySubmissions: Object.entries(monthlySubmissions).map(([name, total]) => ({ name, total })),
    complianceHurdlesData,
  };
};

export default function ReportingTab() {
  const { data: projects, isLoading, error } = useQuery<ProjectSummary[]>({
    queryKey: ["allProjects"],
    queryFn: fetchAllProjects,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load reporting data: {error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!projects) {
    return <div>No project data available.</div>;
  }

  const { totalProjects, complianceRate, monthlySubmissions, complianceHurdlesData } = calculateAnalytics(projects);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={totalProjects.toString()} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Compliance Rate" value={`${complianceRate.toFixed(1)}%`} icon={<Target className="h-4 w-4 text-muted-foreground" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlySubmissionsChart data={monthlySubmissions} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompliancePathwayChart data={projects} />
          <ProjectStatusChart data={projects} />
          <ComplianceHurdlesChart data={complianceHurdlesData} />
        </div>
      </div>
    </div>
  );
}