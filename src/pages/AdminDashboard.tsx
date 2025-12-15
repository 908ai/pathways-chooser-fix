import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserManager from '@/components/admin/UserManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import ProviderManager from '@/components/admin/ProviderManager';
import RequestManager from '@/components/admin/RequestManager';
import ReportingTab from '@/components/admin/ReportingTab';
import { Users, MessageSquare, Briefcase, UserCheck, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
              <TabsTrigger value="feedback"><MessageSquare className="mr-2 h-4 w-4" />Feedback</TabsTrigger>
              <TabsTrigger value="providers"><Briefcase className="mr-2 h-4 w-4" />Providers</TabsTrigger>
              <TabsTrigger value="requests"><UserCheck className="mr-2 h-4 w-4" />Requests</TabsTrigger>
              <TabsTrigger value="reporting"><BarChart2 className="mr-2 h-4 w-4" />Reporting</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <UserManager />
            </TabsContent>
            <TabsContent value="feedback" className="mt-4">
              <FeedbackManager />
            </TabsContent>
            <TabsContent value="providers" className="mt-4">
              <ProviderManager />
            </TabsContent>
            <TabsContent value="requests" className="mt-4">
              <RequestManager />
            </TabsContent>
            <TabsContent value="reporting" className="mt-4">
              <ReportingTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;