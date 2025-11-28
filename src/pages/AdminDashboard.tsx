import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProviderManager from '@/components/admin/ProviderManager';
import RequestManager from '@/components/admin/RequestManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import AllProjectsTab from '@/components/admin/AllProjectsTab';
import { Users, Briefcase, MessageSquare, LayoutGrid } from 'lucide-react';

const AdminDashboard = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage projects, providers, user access, and feedback.
          </p>
        </div>

        <Tabs defaultValue="all-projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-projects" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              All Projects
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Provider Management
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access Requests
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all-projects" className="mt-6">
            <AllProjectsTab />
          </TabsContent>
          <TabsContent value="providers" className="mt-6">
            <ProviderManager />
          </TabsContent>
          <TabsContent value="requests" className="mt-6">
            <RequestManager />
          </TabsContent>
          <TabsContent value="feedback" className="mt-6">
            <FeedbackManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;