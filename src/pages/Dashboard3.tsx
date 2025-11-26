import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, Plus, TrendingUp, CheckCircle } from 'lucide-react';
import StatCard from '@/components/dashboard3/StatCard';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import RecentProjectsList from '@/components/dashboard3/RecentProjectsList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EfficiencyInsightCard from '@/components/dashboard3/EfficiencyInsightCard';

const fetchUserProjects = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('project_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Dashboard3 = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['userProjects', user?.id],
    queryFn: () => fetchUserProjects(user?.id),
    enabled: !!user,
  });

  const analytics = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        complianceRate: 0,
        inProgressCount: 0,
        averagePoints: 0,
        averageRsi: { attic: 0, wall: 0, belowGrade: 0 },
        totalSavings: 0,
        averageSavings: 0,
        topContributors: [],
        activeProjects: 0,
      };
    }

    const completed = projects.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail');
    const compliant = completed.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant');
    const complianceRate = completed.length > 0 ? (compliant.length / completed.length) * 100 : 0;
    const activeProjects = projects.filter(p => p.compliance_status === 'submitted' || p.compliance_status === 'needs_revision').length;

    const tieredProjects = projects.filter(p => p.selected_pathway === '9368' && p.total_points);
    const averagePoints = tieredProjects.length > 0 ? tieredProjects.reduce((sum, p) => sum + p.total_points, 0) / tieredProjects.length : 0;

    const getAverage = (field: keyof typeof projects[0]) => {
      const validProjects = projects.filter(p => typeof p[field] === 'number');
      if (validProjects.length === 0) return 0;
      return validProjects.reduce((sum, p) => sum + (p[field] as number), 0) / validProjects.length;
    };

    // Cost Savings Calculation
    const performanceProjects = projects.filter(p => p.selected_pathway === '9365' || p.selected_pathway === '9367');
    const totalSavings = performanceProjects.reduce((sum, p) => {
      const isTier2OrHigher = p.selected_pathway === '9367';
      const prescriptiveCost = isTier2OrHigher ? 13550 : 6888;
      const performanceCost = isTier2OrHigher ? 8150 : 1718;
      return sum + (prescriptiveCost - performanceCost);
    }, 0);
    const averageSavings = performanceProjects.length > 0 ? totalSavings / performanceProjects.length : 0;

    // Top Compliance Contributors Calculation
    const pointCategories = {
      'Airtightness': 'airtightness_points',
      'Walls': 'wall_points',
      'Attic': 'attic_points',
      'Windows': 'window_points',
      'Below Grade': 'below_grade_points',
      'HRV/ERV': 'hrv_erv_points',
      'Water Heater': 'water_heating_points',
    };

    const pointSums = Object.keys(pointCategories).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    tieredProjects.forEach(p => {
      for (const [name, field] of Object.entries(pointCategories)) {
        if (p[field]) {
          pointSums[name] += p[field];
        }
      }
    });

    const topContributors = Object.entries(pointSums)
      .map(([name, sum]) => ({
        name,
        averagePoints: tieredProjects.length > 0 ? sum / tieredProjects.length : 0,
      }))
      .filter(item => item.averagePoints > 0)
      .sort((a, b) => b.averagePoints - a.averagePoints)
      .slice(0, 5);

    return {
      totalProjects: projects.length,
      complianceRate: Math.round(complianceRate),
      inProgressCount: projects.length - completed.length,
      averagePoints: Math.round(averagePoints),
      averageRsi: {
        attic: getAverage('attic_rsi'),
        wall: getAverage('wall_rsi'),
        belowGrade: getAverage('below_grade_rsi'),
      },
      totalSavings,
      averageSavings,
      topContributors,
      activeProjects,
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-slate-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Executive Overview</h1>
            <p className="text-slate-500 mt-1">
              Welcome back, Energy Advisor. You have <span className="font-semibold text-primary">{analytics.activeProjects} active projects</span> requiring attention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/calculator')}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <EfficiencyInsightCard />
            <RecentProjectsList data={projects || []} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <StatCard 
                title="Projects YTD" 
                value={analytics.totalProjects} 
                icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
                iconBgClassName="bg-orange-100"
              />
              <StatCard 
                title="Pass Rate" 
                value={`${analytics.complianceRate}%`} 
                icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                iconBgClassName="bg-green-100"
              />
            </div>
            <CompliancePathwayChart data={projects || []} />
            <ProjectStatusChart data={projects || []} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard3;