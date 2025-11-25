import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import { Loader2, BarChart2, CheckSquare, PieChart, Thermometer } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CompliancePathwayChart from '../components/dashboard/CompliancePathwayChart';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';
import AverageRsiCard from '../components/dashboard/AverageRsiCard';
import RecentProjectsList from '../components/dashboard/RecentProjectsList';

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
      };
    }

    const completed = projects.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail');
    const compliant = completed.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant');
    const complianceRate = completed.length > 0 ? (compliant.length / completed.length) * 100 : 0;

    const tieredProjects = projects.filter(p => p.selected_pathway === '9368' && p.total_points);
    const averagePoints = tieredProjects.length > 0 ? tieredProjects.reduce((sum, p) => sum + p.total_points, 0) / tieredProjects.length : 0;

    const getAverage = (field: keyof typeof projects[0]) => {
      const validProjects = projects.filter(p => typeof p[field] === 'number');
      if (validProjects.length === 0) return 0;
      return validProjects.reduce((sum, p) => sum + (p[field] as number), 0) / validProjects.length;
    };

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
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${starryMountainsBg})` }}>
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Analytics Dashboard</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            An overview of your project performance and trends.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard title="Total Projects" value={analytics.totalProjects} icon={<BarChart2 />} />
          <StatCard title="Compliance Rate" value={`${analytics.complianceRate}%`} icon={<CheckSquare />} description="Of completed projects" />
          <StatCard title="Average Points" value={analytics.averagePoints} icon={<PieChart />} description="For Tiered Prescriptive path" />
          <StatCard title="Avg. Wall RSI" value={analytics.averageRsi.wall.toFixed(2)} icon={<Thermometer />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <ProjectStatusChart data={projects || []} />
            <CompliancePathwayChart data={projects || []} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <RecentProjectsList data={projects || []} />
            <AverageRsiCard data={analytics.averageRsi} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard3;