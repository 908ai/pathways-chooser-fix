"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManager from "@/components/admin/UserManager";
import AllProjectsTab from "@/components/admin/AllProjectsTab";
import ReportingTab from "@/components/admin/ReportingTab";
import FeedbackManager from "@/components/admin/FeedbackManager";
import RequestManager from "@/components/admin/RequestManager";
import ProviderManager from "@/components/admin/ProviderManager";
import { ProjectSummary } from '@/integrations/supabase/types';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_summaries')
        .select('*');
      
      if (error) {
        console.error("Error fetching all projects:", error);
      } else {
        setProjects(data as ProjectSummary[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="projects">All Projects</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <AllProjectsTab projects={projects} loading={loading} />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserManager />
        </TabsContent>
        <TabsContent value="reporting" className="mt-6">
          <ReportingTab projects={projects} />
        </TabsContent>
        <TabsContent value="feedback" className="mt-6">
          <FeedbackManager />
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <RequestManager />
        </TabsContent>
        <TabsContent value="providers" className="mt-6">
          <ProviderManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}