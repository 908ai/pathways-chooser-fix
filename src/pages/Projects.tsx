import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Link } from 'react-router-dom';
import { Shield, Building } from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectList from '@/components/dashboard/ProjectList';
import AllProjectsTab from '@/components/admin/AllProjectsTab';
import MunicipalStats from '@/components/dashboard/MunicipalStats';
import BuildingOfficialsTab from '@/components/dashboard/BuildingOfficialsTab';
import ResourcesTab from '@/components/dashboard/ResourcesTab';
import FaqTab from '@/components/dashboard/FaqTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Projects = () => {
  const { user } = useAuth();
  const { userRole, isBuildingOfficial, isAdmin, isAccountManager } = useUserRole();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from('project_summaries').select('*');
      if (!isAdmin && !isAccountManager) {
        query = query.eq('user_id', user.id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Projects Dashboard</h1>
          </div>

          <Tabs defaultValue="my-projects">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              {(isAdmin || isAccountManager) && <TabsTrigger value="all-projects">All Projects</TabsTrigger>}
              {isBuildingOfficial && <TabsTrigger value="municipal-stats">Municipal Stats</TabsTrigger>}
              <TabsTrigger value="building-officials">Building Officials</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-projects">
              <ProjectList projects={projects} isLoading={isLoading} error={error as Error} />
            </TabsContent>
            
            {(isAdmin || isAccountManager) && (
              <TabsContent value="all-projects">
                <AllProjectsTab />
              </TabsContent>
            )}

            {isBuildingOfficial && (
              <TabsContent value="municipal-stats">
                <MunicipalStats />
              </TabsContent>
            )}

            <TabsContent value="building-officials">
              <BuildingOfficialsTab />
            </TabsContent>

            <TabsContent value="resources">
              <ResourcesTab />
            </TabsContent>

            <TabsContent value="faq">
              <FaqTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;