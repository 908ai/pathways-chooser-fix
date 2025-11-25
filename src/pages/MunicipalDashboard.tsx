import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import { Loader2 } from 'lucide-react';
import MunicipalStats from '@/components/dashboard/MunicipalStats';
import ProjectFilterBar from '@/components/dashboard/ProjectFilterBar';
import ProjectDataTable from '@/components/dashboard/ProjectDataTable';

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

const MunicipalDashboard = () => {
  const { signOut } = useAuth();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['allProjects'],
    queryFn: fetchAllProjects,
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'all',
    builder: 'all',
    pathway: 'all',
    status: 'all',
  });
  const [sortBy, setSortBy] = useState({ field: 'updated_at', direction: 'desc' });

  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];
    
    let filtered = projects.filter(p => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const nameMatch = p.project_name?.toLowerCase().includes(searchTermLower);
      const locationMatch = p.location?.toLowerCase().includes(searchTermLower);
      const builderMatch = p.company_name?.toLowerCase().includes(searchTermLower);

      if (filters.searchTerm && !nameMatch && !locationMatch && !builderMatch) return false;
      if (filters.location !== 'all' && p.city?.toLowerCase() !== filters.location.toLowerCase()) return false;
      if (filters.builder !== 'all' && p.company_name !== filters.builder) return false;
      if (filters.pathway !== 'all' && p.selected_pathway !== filters.pathway) return false;
      if (filters.status !== 'all' && p.compliance_status !== filters.status) return false;
      
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

  const uniqueBuilders = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.company_name).filter(Boolean))];
  }, [projects]);

  const uniqueLocations = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.city).filter(Boolean))];
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${starryMountainsBg})` }}>
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Municipal Dashboard</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Review and track all compliance projects in the system.
          </p>
        </div>
        
        <div className="space-y-6">
          <MunicipalStats projects={projects || []} />
          <ProjectFilterBar 
            filters={filters}
            setFilters={setFilters}
            uniqueBuilders={uniqueBuilders}
            uniqueLocations={uniqueLocations}
          />
          <ProjectDataTable 
            projects={filteredAndSortedProjects}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MunicipalDashboard;