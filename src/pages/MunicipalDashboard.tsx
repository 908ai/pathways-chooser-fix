import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileText, Zap, Wind, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/dashboard3/StatCard';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import MunicipalFilters from '@/components/municipal/MunicipalFilters';
import BuildingTypeChart from '@/components/municipal/BuildingTypeChart';
import TierDistributionChart from '@/components/municipal/TierDistributionChart';
import AverageMetricsCard from '@/components/municipal/AverageMetricsCard';
import AggregatePerformanceStats from '@/components/municipal/AggregatePerformanceStats';
import AirtightnessHistogram from '@/components/municipal/AirtightnessHistogram';
import MechanicalSystemsChart from '@/components/municipal/MechanicalSystemsChart';
import MunicipalReportExporter from '@/components/municipal/MunicipalReportExporter';
import KeyInsightsCard from '@/components/municipal/KeyInsightsCard';
import EmbodiedCarbonCard from '@/components/municipal/EmbodiedCarbonCard';
import DetailedAirtightnessCard from '@/components/municipal/DetailedAirtightnessCard';
import GhgBreakdownChart from '@/components/municipal/GhgBreakdownChart';
import IncentivePlanningCard from '@/components/municipal/IncentivePlanningCard';
import BenchmarkingCard from '@/components/municipal/BenchmarkingCard';
import MunicipalAlertsCard from '@/components/municipal/MunicipalAlertsCard';
import ProcessAnalyticsCard from '@/components/municipal/ProcessAnalyticsCard';
import WwrHistogram from '@/components/municipal/WwrHistogram';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProjectMap from '@/components/municipal/ProjectMap';

const fetchAllProjects = async () => {
  const { data: projects, error: projectsError } = await supabase
    .from('project_summaries')
    .select('*');
  if (projectsError) throw projectsError;

  const userIds = [...new Set(projects.map(p => p.user_id).filter(Boolean))];
  
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('user_id, company_name');
  
  if (companiesError) {
    console.error("Error fetching companies for municipal dashboard:", companiesError);
  }

  const companyMap = new Map(companies?.map(c => [c.user_id, c.company_name]));

  // Simulate missing data and add company names
  return projects.map(p => ({
    ...p,
    company_name: companyMap.get(p.user_id) || 'Individual Builder',
    energuide_rating: p.total_points ? 100 - p.total_points : null,
    window_to_wall_ratio: p.window_u_value ? 0.15 + (p.window_u_value - 1.4) * 0.1 : null,
  }));
};

const MunicipalDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  const { data: projects, isLoading } = useQuery({
    queryKey: ['allProjectsForMunicipal'],
    queryFn: fetchAllProjects,
  });

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    compliancePath: 'all',
    mechanicalSystem: 'all',
    buildingType: 'all',
    location: 'all',
  });

  const { filteredProjects, uniqueLocations, uniqueBuildingTypes } = useMemo(() => {
    if (!projects) return { filteredProjects: [], uniqueLocations: [], uniqueBuildingTypes: [] };
    
    const locations = [...new Set(projects.map(p => p.city).filter(Boolean))] as string[];
    const buildingTypes = [...new Set(projects.map(p => p.building_type).filter(Boolean))] as string[];

    const filtered = projects.filter(p => {
      if (filters.dateRange !== 'all') {
        const projectDate = new Date(p.created_at);
        const now = new Date();
        if (filters.dateRange === '90days') {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(now.getDate() - 90);
          if (projectDate < ninetyDaysAgo) return false;
        } else if (filters.dateRange === 'ytd') {
          if (projectDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      if (filters.compliancePath !== 'all') {
        const isPerformance = p.selected_pathway === '9365' || p.selected_pathway === '9367';
        const isPrescriptive = p.selected_pathway === '9362' || p.selected_pathway === '9368';
        if (filters.compliancePath === 'performance' && !isPerformance) return false;
        if (filters.compliancePath === 'prescriptive' && !isPrescriptive) return false;
      }

      if (filters.mechanicalSystem !== 'all') {
        const heatingType = p.heating_system_type?.toLowerCase() || '';
        const isGas = heatingType.includes('gas') || heatingType.includes('furnace') || heatingType.includes('boiler');
        const isElectric = heatingType.includes('electric') || heatingType.includes('heat pump');
        if (filters.mechanicalSystem === 'gas' && !isGas) return false;
        if (filters.mechanicalSystem === 'electric' && !isElectric) return false;
      }

      if (filters.buildingType !== 'all' && p.building_type !== filters.buildingType) return false;
      if (filters.location !== 'all' && p.city !== filters.location) return false;
      
      return true;
    });

    return { filteredProjects: filtered, uniqueLocations: locations, uniqueBuildingTypes: buildingTypes };
  }, [projects, filters]);

  const stats = useMemo(() => {
    if (!filteredProjects || filteredProjects.length === 0) {
      return { totalApplications: 0, prescriptiveCount: 0, performanceCount: 0, airtightnessTargetRate: 0 };
    }
    const prescriptiveCount = filteredProjects.filter(p => p.selected_pathway === '9362' || p.selected_pathway === '9368').length;
    const performanceCount = filteredProjects.filter(p => p.selected_pathway === '9365' || p.selected_pathway === '9367').length;
    const projectsWithAirtightness = filteredProjects.filter(p => typeof p.airtightness_al === 'number' && p.airtightness_al > 0);
    const meetingTargetCount = projectsWithAirtightness.filter(p => p.airtightness_al <= 2.5).length;
    const airtightnessTargetRate = projectsWithAirtightness.length > 0 ? (meetingTargetCount / projectsWithAirtightness.length) * 100 : 0;
    return { totalApplications: filteredProjects.length, prescriptiveCount, performanceCount, airtightnessTargetRate };
  }, [filteredProjects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Municipal Dashboard</h1>
        </div>
        
        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
          <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
            <div className="flex-1 min-h-0">
              <ProjectMap />
            </div>
          </DialogContent>
        </Dialog>

        <div className="mb-6">
          <MunicipalReportExporter projects={filteredProjects} dashboardRef={dashboardRef} />
        </div>

        <div ref={dashboardRef} className="bg-background p-4 rounded-lg">
          <MunicipalFilters 
            filters={filters} 
            setFilters={setFilters} 
            uniqueLocations={uniqueLocations}
            uniqueBuildingTypes={uniqueBuildingTypes}
          />
          <div className="mt-6 space-y-8">
            {/* --- TOP SECTION: BIG PICTURE --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground border-b pb-2">At a Glance</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <KeyInsightsCard />
                <MunicipalAlertsCard projects={filteredProjects} />
                <ProcessAnalyticsCard projects={filteredProjects} />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Applications" value={stats.totalApplications} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Prescriptive Path" value={stats.prescriptiveCount} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Performance Path" value={stats.performanceCount} icon={<Zap className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Meet Airtightness Target (≤2.5 ACH)" value={`${stats.airtightnessTargetRate.toFixed(0)}%`} icon={<Wind className="h-4 w-4 text-muted-foreground" />} />
              </div>
            </div>

            {/* --- MID SECTION: PERFORMANCE ANALYSIS --- */}
            <div className="space-y-6 pt-6 border-t">
              <h2 className="text-2xl font-bold text-foreground border-b pb-2">Performance Analysis</h2>
              <AggregatePerformanceStats projects={filteredProjects} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <GhgBreakdownChart data={filteredProjects} />
                </div>
                <TierDistributionChart data={filteredProjects} />
              </div>
              <IncentivePlanningCard projects={filteredProjects} />
            </div>

            {/* --- BOTTOM SECTION: TECHNICAL DEEP DIVE --- */}
            <div className="space-y-6 pt-6 border-t">
              <h2 className="text-2xl font-bold text-foreground border-b pb-2">Technical Deep Dive</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailedAirtightnessCard data={filteredProjects} onOpenMap={() => setIsMapOpen(true)} />
                <AverageMetricsCard data={filteredProjects} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AirtightnessHistogram data={filteredProjects} />
                <WwrHistogram data={filteredProjects} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MechanicalSystemsChart data={filteredProjects} />
                <BenchmarkingCard projects={filteredProjects} />
              </div>
              <EmbodiedCarbonCard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MunicipalDashboard;