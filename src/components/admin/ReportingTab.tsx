import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import TechnicalDataHistograms from './TechnicalDataHistograms';

const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from('project_summaries')
    .select('*');
  if (error) throw error;
  return data;
};

const ReportingTab = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['allProjectsForReporting'],
    queryFn: fetchAllProjects,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!projects) {
    return <p>No project data available for reporting.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlySubmissionsChart data={projects} />
        </div>
        <CompliancePathwayChart data={projects} />
      </div>
      <ProjectStatusChart data={projects} />
      <TechnicalDataHistograms projects={projects} />
    </div>
  );
};

export default ReportingTab;