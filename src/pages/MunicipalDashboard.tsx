import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/dashboard3/StatCard';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import MunicipalFilters from '@/components/municipal/MunicipalFilters';
import BuildingTypeChart from '@/components/municipal/BuildingTypeChart';
import TierDistributionChart from '@/components/municipal/TierDistributionChart';
import AverageMetricsCard from '@/components/municipal/AverageMetricsCard';

const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from('project_summaries')
    .select('*');
  if (error) throw error;
  return data;
};

const MunicipalDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['allProjectsForMunicipal'],
    queryFn: fetchAllProjects,
  });

  const [filters, setFilters] = useState({
    dateRange: 'all',
    compliancePath: 'all',
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    return projects.filter(p => {
      // Date Range Filter
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

      // Compliance Path Filter
      if (filters.compliancePath !== 'all') {
        const isPerformance = p.selected_pathway === '9365' || p.selected_pathway === '9367';
        const isPrescriptive = p.selected_pathway === '9362' || p.selected_pathway === '9368';
        if (filters.compliancePath === 'performance' && !isPerformance) return false;
        if (filters.compliancePath === 'prescriptive' && !isPrescriptive) return false;
      }
      
      return true;
    });
  }, [projects, filters]);

  const stats = useMemo(() => {
    if (!filteredProjects || filteredProjects.length === 0) {
      return {
        totalApplications: 0,
        prescriptiveCount: 0,
        performanceCount: 0,
      };
    }

    const prescriptiveCount = filteredProjects.filter(p => p.selected_pathway === '9362' || p.selected_pathway === '9368').length;
    const performanceCount = filteredProjects.filter(p => p.selected_pathway === '9365' || p.selected_pathway === '9367').length;

    return {
      totalApplications: filteredProjects.length,
      prescriptiveCount,
      performanceCount,
    };
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
          <h1 className="text-4xl font-bold mb-3 text-foreground">Municipal Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            An overview of project compliance and trends for municipal partners.
          </p>
        </div>
        
        <MunicipalFilters filters={filters} setFilters={setFilters} />

        <div className="mt-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Total Applications" value={stats.totalApplications} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Prescriptive Path" value={stats.prescriptiveCount} icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Performance Path" value={stats.performanceCount} icon={<Zap className="h-4 w-4 text-muted-foreground" />} />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthlySubmissionsChart data={filteredProjects} />
            </div>
            <BuildingTypeChart data={filteredProjects} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             <TierDistributionChart data={filteredProjects} />
             <AverageMetricsCard data={filteredProjects} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MunicipalDashboard;