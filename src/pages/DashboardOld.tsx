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
import CreateProjectCard from '@/components/dashboard/CreateProjectCard';
import FindProviderCard from '@/components/dashboard/FindProviderCard';
import ProjectList from '@/components/dashboard/ProjectList';
import BuildingOfficialsTab from '@/components/dashboard/BuildingOfficialsTab';
import ResourcesTab from '@/components/dashboard/ResourcesTab';
import FaqTab from '@/components/dashboard/FaqTab';
import { useProviderAccess } from '@/hooks/useProviderAccess';
import RequestProviderAccessCard from '@/components/dashboard/RequestProviderAccessCard';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { canViewAllProjects, userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: providerAccessData, isLoading: isAccessLoading } = useProviderAccess();
  const [projects, setProjects] = useState<{
    inProgress: any[];
    complete: any[];
  }>({
    inProgress: [],
    complete: []
  });

  let activeTab = searchParams.get('tab') || 'projects';
  if (activeTab === 'account') {
    activeTab = 'projects';
  }

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
        const inProgressStatuses = ['draft', 'submitted', 'needs_revision', null];
        const completeStatuses = ['pass', 'fail', 'Compliant'];

        setProjects({
          inProgress: projectsData.filter((p: any) => inProgressStatuses.includes(p.compliance_status)),
          complete: projectsData.filter((p: any) => completeStatuses.includes(p.compliance_status))
        });
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, [user, canViewAllProjects, roleLoading]);

  const handleNewProject = () => navigate('/calculator?showHelp=true');
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Project Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your NBC 9.36 compliance projects and account information
          </p>
        </div>
        {canViewAllProjects && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-blue-500" />
            <p className="font-semibold text-blue-700 dark:text-blue-300">
              Admin View: You are viewing projects from all users.
            </p>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2"><Building className="h-4 w-4" />Projects</TabsTrigger>
            <TabsTrigger value="building-officials" className="flex items-center gap-2"><Building className="h-4 w-4" />Building Officials</TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2"><FileText className="h-4 w-4" />Resources</TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2"><Info className="h-4 w-4" />FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CreateProjectCard handleNewProject={handleNewProject} />
              {isAccessLoading ? (
                <Card className="flex items-center justify-center min-h-[200px]">
                  <p className="text-muted-foreground">Loading...</p>
                </Card>
              ) : providerAccessData?.hasAccess ? (
                <FindProviderCard />
              ) : (
                <RequestProviderAccessCard />
              )}
            </div>
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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;