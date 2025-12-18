"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary } from "@/integrations/supabase/types";
import StatCard from "@/components/dashboard3/StatCard";
import ProjectStatusChart from "@/components/dashboard3/ProjectStatusChart";
import CompliancePathwayChart from "@/components/dashboard3/CompliancePathwayChart";
import MonthlySubmissionsChart from "@/components/dashboard3/MonthlySubmissionsChart";
import RecentProjectsList from "@/components/dashboard3/RecentProjectsList";
import ComplianceHurdlesChart, { HurdleData } from "@/components/dashboard3/ComplianceHurdlesChart";
import AverageRsiCard from "@/components/dashboard3/AverageRsiCard";
import EfficiencyInsightCard from "@/components/dashboard3/EfficiencyInsightCard";
import TopComplianceContributors from "@/components/dashboard3/TopComplianceContributors";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, DollarSign, Zap, TrendingUp, Target } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

async function fetchProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await supabase.from("project_summaries").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

const calculateAnalytics = (projects: ProjectSummary[]) => {
  if (!projects || projects.length === 0) {
    return {
      totalProjects: 0,
      averageFloorArea: 0,
      complianceRate: 0,
      monthlySubmissions: [],
      complianceHurdlesData: [],
      averageRsi: { attic: 0, wall: 0, below_grade: 0 },
      topContributors: [],
    };
  }

  const totalProjects = projects.length;

  const totalFloorArea = projects.reduce(
    (sum, p) => sum + (p.floor_area || 0),
    0
  );
  const averageFloorArea = totalFloorArea / totalProjects;

  const compliantProjects = projects.filter(
    (p) => p.compliance_status === "Compliant"
  ).length;
  const complianceRate = (compliantProjects / totalProjects) * 100;

  const monthlySubmissions = projects.reduce((acc, p) => {
    if (p.created_at) {
      const month = new Date(p.created_at).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const complianceHurdles = projects.reduce((acc, p) => {
    if (p.compliance_status !== "Compliant" && p.recommendations) {
      p.recommendations.forEach((rec) => {
        // Example recommendation format: "Improve Attic RSI"
        const hurdle = rec.split("Improve ")[1]?.split(" ")[0];
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

  const rsiValues = projects.reduce(
    (acc, p) => {
      if (p.attic_rsi) acc.attic.push(p.attic_rsi);
      if (p.wall_rsi) acc.wall.push(p.wall_rsi);
      if (p.below_grade_rsi) acc.below_grade.push(p.below_grade_rsi);
      return acc;
    },
    { attic: [] as number[], wall: [] as number[], below_grade: [] as number[] }
  );

  const calculateAverage = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const averageRsi = {
    attic: calculateAverage(rsiValues.attic),
    wall: calculateAverage(rsiValues.wall),
    below_grade: calculateAverage(rsiValues.below_grade),
  };

  const contributorScores = projects.reduce((acc, p) => {
    const score = (p.total_points || 0) - 100; // Example scoring
    if (score > 0) {
      const contributor = p.project_name; // Or user/builder name if available
      acc[contributor] = (acc[contributor] || 0) + score;
    }
    return acc;
  }, {} as Record<string, number>);

  const topContributors = Object.entries(contributorScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    totalProjects,
    averageFloorArea,
    complianceRate,
    monthlySubmissions: Object.entries(monthlySubmissions).map(
      ([name, total]) => ({ name, total })
    ),
    complianceHurdlesData,
    averageRsi,
    topContributors,
  };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { userRole, loading: isRoleLoading } = useUserRole();

  const {
    data: projects,
    isLoading: isProjectsLoading,
    error,
  } = useQuery<ProjectSummary[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isRoleLoading || isProjectsLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-1 lg:col-span-4 space-y-4">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <div className="col-span-1 lg:col-span-3 space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load project data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const analytics = calculateAnalytics(projects || []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={analytics.totalProjects} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
        <StatCard
          title="Average Floor Area"
          value={`${analytics.averageFloorArea.toFixed(0)} sqft`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Compliance Rate"
          value={`${analytics.complianceRate.toFixed(1)}%`}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
        />
        <EfficiencyInsightCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlySubmissionsChart data={projects || []} />
        </div>
        <div className="lg:col-span-1">
          <RecentProjectsList data={projects || []} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <AverageRsiCard data={analytics.averageRsi} />
          <TopComplianceContributors data={analytics.topContributors.map(c => ({ name: c.name, averagePoints: c.score }))} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompliancePathwayChart data={projects || []} />
          <ProjectStatusChart data={projects || []} />
          <ComplianceHurdlesChart data={analytics.complianceHurdlesData} />
        </div>
      </div>
    </div>
  );
}