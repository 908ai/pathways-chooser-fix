import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import AllProjectsStats from './AllProjectsStats';
import AllProjectsFilterBar from './AllProjectsFilterBar';
import AllProjectsDataTable from './AllProjectsDataTable';

const fetchAllProjects = async () => {
  const { data: projects, error: projectsError } = await supabase
    .from('project_summaries')
    .select('*')
    .order('updated_at', { ascending: false });
  if (projectsError) throw projectsError;

  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('user_id, company_name');
  if (companiesError) throw companiesError;

  const companyMap = new Map(companies.map(c => [c.user_id, c.company_name]));

  const projectsWithCompany = projects.map(p => ({
    ...p,
    company_name: companyMap.get(p.user_id) || 'N/A'
  }));

  return projectsWithCompany;
};

const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered Prescriptive',
  '9365': 'Performance',
  '9367': 'Tiered Performance',
};

const AllProjectsTab = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['allProjects'],
    queryFn: fetchAllProjects,
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'all',
    pathway: 'all',
    status: 'all',
    buildingType: 'all',
  });
  const [sortBy, setSortBy] = useState({ field: 'created_at', direction: 'desc' });

  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];
    
    let filtered = projects.filter(p => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const nameMatch = p.project_name?.toLowerCase().includes(searchTermLower);
      const locationMatch = p.location?.toLowerCase().includes(searchTermLower);
      const builderMatch = p.company_name?.toLowerCase().includes(searchTermLower);

      if (filters.searchTerm && !nameMatch && !locationMatch && !builderMatch) return false;
      if (filters.location !== 'all' && p.city?.toLowerCase() !== filters.location.toLowerCase()) return false;
      if (filters.pathway !== 'all' && p.selected_pathway !== filters.pathway) return false;
      if (filters.status !== 'all' && p.compliance_status !== filters.status) return false;
      if (filters.buildingType !== 'all' && p.building_type !== filters.buildingType) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      const field = sortBy.field as keyof typeof a;
      const valA = a[field];
      const valB = b[field];

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortBy.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, [projects, filters, sortBy]);

  const uniqueLocations = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.city).filter(Boolean))];
  }, [projects]);

  const uniqueBuildingTypes = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.building_type).filter(Boolean))];
  }, [projects]);

  const pathwayStats = useMemo(() => {
    if (!projects) return {};
    return projects.reduce((acc, p) => {
        const pathway = pathwayMapping[p.selected_pathway as keyof typeof pathwayMapping] || 'Unknown';
        acc[pathway] = (acc[pathway] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AllProjectsStats projects={projects || []} pathwayStats={pathwayStats} />
      <AllProjectsFilterBar 
        filters={filters}
        setFilters={setFilters}
        uniqueBuilders={[]}
        uniqueLocations={uniqueLocations}
        uniqueBuildingTypes={uniqueBuildingTypes}
      />
      <div className="mt-4">
        <AllProjectsDataTable 
          projects={filteredAndSortedProjects}
          onStatusChange={() => { /* Implement if needed */ }}
          onProjectSelect={(project) => navigate(`/project/${project.id}`)}
        />
      </div>
    </div>
  );
};

export default AllProjectsTab;