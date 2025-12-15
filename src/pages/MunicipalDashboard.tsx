import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import StatCard from '@/components/dashboard3/StatCard';
import { Building, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import RecentProjectsList from '@/components/dashboard3/RecentProjectsList';
import AverageRsiCard from '@/components/dashboard3/AverageRsiCard';
import EfficiencyInsightCard from '@/components/dashboard3/EfficiencyInsightCard';
import ComplianceHurdlesChart from '@/components/dashboard3/ComplianceHurdlesChart';
import TopComplianceContributors from '@/components/dashboard3/TopComplianceContributors';
import ProjectMap from '@/components/municipal/ProjectMap';
import MunicipalFilters from '@/components/municipal/MunicipalFilters';
import { useState } from 'react';
import BuildingTypeChart from '@/components/municipal/BuildingTypeChart';
import TierDistributionChart from '@/components/municipal/TierDistributionChart';
import AirtightnessHistogram from '@/components/municipal/AirtightnessHistogram';
import WwrHistogram from '@/components/municipal/WwrHistogram';
import MechanicalSystemsChart from '@/components/municipal/MechanicalSystemsChart';
import GhgBreakdownChart from '@/components/municipal/GhgBreakdownChart';
import KeyInsightsCard from '@/components/municipal/KeyInsightsCard';
import MunicipalAlertsCard from '@/components/municipal/MunicipalAlertsCard';
import ProcessAnalyticsCard from '@/components/municipal/ProcessAnalyticsCard';
import BenchmarkingCard from '@/components/municipal/BenchmarkingCard';
import IncentivePlanningCard from '@/components/municipal/IncentivePlanningCard';
import EmbodiedCarbonCard from '@/components/municipal/EmbodiedCarbonCard';
import DetailedAirtightnessCard from '@/components/municipal/DetailedAirtightnessCard';
import AverageMetricsCard from '@/components/municipal/AverageMetricsCard';
import AggregatePerformanceStats from '@/components/municipal/AggregatePerformanceStats';
import MunicipalReportExporter from '@/components/municipal/MunicipalReportExporter';

const fetchAllProjects = async () => {
  const { data, error } = await supabase.from('project_summaries').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const MunicipalDashboard = () => {
  const [filters, setFilters] = useState({
    timeframe: 'all',
    buildingType: 'all',
    complianceStatus: 'all',
  });

  const { data: allProjects, isLoading, error } = useQuery({
    queryKey: ['allProjectsForMunicipal'],
    queryFn: fetchAllProjects,
  });

  const filteredProjects = allProjects?.filter(p => {
    if (!p.created_at) return false;
    const projectDate = new Date(p.created_at);
    let timeframeMatch = true;
    if (filters.timeframe !== 'all') {
      const now = new Date();
      if (filters.timeframe === 'last30') {
        timeframeMatch = now.getTime() - projectDate.getTime() < 30 * 24 * 60 * 60 * 1000;
      } else if (filters.timeframe === 'last90') {
        timeframeMatch = now.getTime() - projectDate.getTime() < 90 * 24 * 60 * 60 * 1000;
      } else if (filters.timeframe === 'lastYear') {
        timeframeMatch = now.getFullYear() === projectDate.getFullYear();
      }
    }
    const buildingTypeMatch = filters.buildingType === 'all' || p.building_type === filters.buildingType;
    const statusMatch = filters.complianceStatus === 'all' || p.compliance_status === filters.complianceStatus;
    return timeframeMatch && buildingTypeMatch && statusMatch;
  }) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const totalProjects = filteredProjects.length;
  const compliantProjects = filteredProjects.filter(p => p.compliance_status === 'compliant').length;
  const pendingProjects = filteredProjects.filter(p => p.compliance_status === 'submitted').length;
  const complianceRate = totalProjects > 0 ? (compliantProjects / totalProjects) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Municipal Dashboard</h1>
            <MunicipalReportExporter projects={filteredProjects} />
          </div>
          
          <MunicipalFilters filters={filters} setFilters={setFilters} projects={allProjects || []} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Total Projects" value={totalProjects.toString()} icon={<Building />} />
            <StatCard title="Compliant" value={compliantProjects.toString()} icon={<CheckCircle />} />
            <StatCard title="Pending Review" value={pendingProjects.toString()} icon={<Clock />} />
            <StatCard title="Compliance Rate" value={`${complianceRate.toFixed(1)}%`} icon={<TrendingUp />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ProjectMap projects={filteredProjects} />
            </div>
            <div>
              <RecentProjectsList projects={filteredProjects.slice(0, 5)} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <CompliancePathwayChart projects={filteredProjects} />
            <ProjectStatusChart projects={filteredProjects} />
            <BuildingTypeChart projects={filteredProjects} />
          </div>

          <AggregatePerformanceStats projects={filteredProjects} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
             <KeyInsightsCard projects={filteredProjects} />
             <MunicipalAlertsCard projects={filteredProjects} />
             <ProcessAnalyticsCard projects={filteredProjects} />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <AirtightnessHistogram projects={filteredProjects} />
            <WwrHistogram projects={filteredProjects} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <MechanicalSystemsChart projects={filteredProjects} />
            <GhgBreakdownChart projects={filteredProjects} />
            <TierDistributionChart projects={filteredProjects} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <BenchmarkingCard projects={filteredProjects} />
            <IncentivePlanningCard projects={filteredProjects} />
            <EmbodiedCarbonCard projects={filteredProjects} />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MunicipalDashboard;