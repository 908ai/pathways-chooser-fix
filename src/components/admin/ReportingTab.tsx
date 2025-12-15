import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import MonthlySubmissionsChart from '@/components/dashboard3/MonthlySubmissionsChart';
import CompliancePathwayChart from '@/components/dashboard3/CompliancePathwayChart';
import ProjectStatusChart from '@/components/dashboard3/ProjectStatusChart';
import TechnicalDataHistograms from './TechnicalDataHistograms';
import ComplianceHurdlesChart from '@/components/dashboard3/ComplianceHurdlesChart';
import { useMemo } from 'react';
import AggregatePerformanceStats from './AggregatePerformanceStats';
import PerformanceComparisonCard from './PerformanceComparisonCard';

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

  const complianceHurdlesData = useMemo(() => {
    if (!projects) return [];
    const hurdles = projects
      .filter(p => p.compliance_status === 'fail' || p.compliance_status === 'needs_revision')
      .flatMap(p => p.recommendations || [])
      .reduce((acc, rec) => {
          const lowerRec = rec.toLowerCase();
          if (lowerRec.includes('wall')) acc['Wall Insulation'] = (acc['Wall Insulation'] || 0) + 1;
          else if (lowerRec.includes('window')) acc['Windows'] = (acc['Windows'] || 0) + 1;
          else if (lowerRec.includes('airtightness')) acc['Airtightness'] = (acc['Airtightness'] || 0) + 1;
          else if (lowerRec.includes('attic')) acc['Attic Insulation'] = (acc['Attic Insulation'] || 0) + 1;
          else if (lowerRec.includes('below grade')) acc['Foundation'] = (acc['Foundation'] || 0) + 1;
          else acc['Other'] = (acc['Other'] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

    return Object.entries(hurdles)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [projects]);

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Aggregated Performance Dashboard</h2>
        <AggregatePerformanceStats projects={projects} />
      </div>
      
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold text-foreground mb-4">Real-time Comparison Dashboard</h2>
        <PerformanceComparisonCard projects={projects} />
      </div>

      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold text-foreground mb-4">Project Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlySubmissionsChart data={projects} />
          </div>
          <div className="space-y-6">
            <CompliancePathwayChart data={projects} />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h2 className="text-2xl font-bold text-foreground mb-4">Compliance & Technical Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectStatusChart data={projects} />
          <ComplianceHurdlesChart data={complianceHurdlesData} />
        </div>
        <div className="mt-6">
          <TechnicalDataHistograms projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default ReportingTab;