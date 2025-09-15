import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { User, Building, FileText, Info, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import NewProjectCard from '@/components/dashboard/NewProjectCard';
import ProjectList from '@/components/dashboard/ProjectList';
import AccountInfoTab from '@/components/dashboard/AccountInfoTab';
import BuildingOfficialsTab from '@/components/dashboard/BuildingOfficialsTab';
import ResourcesTab from '@/components/dashboard/ResourcesTab';
import FaqTab from '@/components/dashboard/FaqTab';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { canViewAllProjects, userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<{
    inProgress: any[];
    complete: any[];
  }>({
    inProgress: [],
    complete: []
  });

  const activeTab = searchParams.get('tab') || 'projects';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    const loadProjects = async () => {
      if (!user || roleLoading) return;
      try {
        let query = supabase.from('project_summaries').select('*');
        if (!canViewAllProjects) {
          query = query.eq('user_id', user.id);
        }
        const { data, error } = await query;
        if (error) throw error;

        const projectsData = data || [];
        setProjects({
          inProgress: projectsData.filter((p: any) => p.compliance_status === null || p.compliance_status === 'pending' || p.compliance_status === 'submitted'),
          complete: projectsData.filter((p: any) => p.compliance_status === 'pass' || p.compliance_status === 'fail' || p.compliance_status === 'Compliant')
        });
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, [user, canViewAllProjects, roleLoading]);

  const handleNewProject = () => navigate('/calculator');
  const handleEditProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (roleLoading || !userRole) {
      toast({ title: "Please Wait", description: "Loading user permissions..." });
      return;
    }
    navigate(`/calculator?edit=${projectId}`);
  };
  const handleViewProject = (projectId: string) => navigate(`/project/${projectId}`);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Project Dashboard</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Manage your NBC 9.36 compliance projects and account information
          </p>
        </div>
        {canViewAllProjects && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-400/50 rounded-lg text-center flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-blue-300" />
            <p className="font-semibold text-blue-300">
              Admin View: You are viewing projects from all users.
            </p>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects" className="flex items-center gap-2"><Building className="h-4 w-4" />Projects</TabsTrigger>
            <TabsTrigger value="building-officials" className="flex items-center gap-2"><Building className="h-4 w-4" />Building Officials</TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2"><FileText className="h-4 w-4" />Resources</TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2"><Info className="h-4 w-4" />FAQ</TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2"><User className="h-4 w-4" />Account Information</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-6">
            <NewProjectCard handleNewProject={handleNewProject} />
            <ProjectList projects={projects} handleViewProject={handleViewProject} handleEditProject={handleEditProject} />
          </TabsContent>
          <TabsContent value="building-officials" className="space-y-6">
            <BuildingOfficialsTab />
          </TabsContent>
          <TabsContent value="resources" className="space-y-6">
            <ResourcesTab />
          </TabsContent>
          <TabsContent value="faq" className="space-y-6">
            <FaqTab />
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <AccountInfoTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;