import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProviderManager from '@/components/admin/ProviderManager';
import RequestManager from '@/components/admin/RequestManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import AllProjectsTab from '@/components/admin/AllProjectsTab';
import { Briefcase, MessageSquare, LayoutGrid, BarChart2, Map, Users } from 'lucide-react';
import ReportingTab from '@/components/admin/ReportingTab';
import ProjectMap from '@/components/admin/ProjectMap';
import UserManager from '@/components/admin/UserManager';
import { Link } from 'react-router-dom';
import { useUnreadNotificationsWithDetails } from '@/hooks/useUnreadNotificationsWithDetails';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { unreadFeedback, isLoading } = useUnreadNotificationsWithDetails();

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

        <Tabs defaultValue="reporting" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card border">
            <TabsTrigger value="reporting" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Reporting
            </TabsTrigger>
            <TabsTrigger value="all-projects" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2 relative">
              <MessageSquare className="h-4 w-4" />
              Feedback
              {!isLoading && unreadFeedback > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadFeedback}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reporting" className="mt-6">
            <ReportingTab />
          </TabsContent>
          <TabsContent value="all-projects" className="mt-6">
            <AllProjectsTab />
          </TabsContent>
          <TabsContent value="map" className="mt-6">
            <ProjectMap />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UserManager />
          </TabsContent>
          <TabsContent value="providers" className="mt-6">
            <Tabs defaultValue="provider-management" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card border">
                <TabsTrigger value="provider-management">Provider Management</TabsTrigger>
                <TabsTrigger value="access-requests">Access Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="provider-management" className="mt-6">
                <ProviderManager />
              </TabsContent>
              <TabsContent value="access-requests" className="mt-6">
                <RequestManager />
              </TabsContent>
            </Tabs>
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