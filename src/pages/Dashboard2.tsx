import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Building } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import CreateProjectCard from '@/components/dashboard/CreateProjectCard';
import ProjectToolbar from '@/components/dashboard/ProjectToolbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProjectKanbanView from '@/components/dashboard/ProjectKanbanView';
import ProjectTableView from '@/components/dashboard/ProjectTableView';

const Dashboard2 = () => {
  const { user, signOut } = useAuth();
  const { canViewAllProjects, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View, filtering and sorting state
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at'); // 'updated_at' or 'project_name'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      if (!user || roleLoading) return;
      setLoading(true);
      try {
        let query = supabase.from('project_summaries').select('*');
        if (!canViewAllProjects) {
          query = query.eq('user_id', user.id);
        }
        const { data, error } = await query.order('updated_at', { ascending: false });
        if (error) throw error;
        setAllProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({ title: "Error", description: "Failed to load projects.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [user, canViewAllProjects, roleLoading, toast]);

  const filteredAndSortedProjects = useMemo(() => {
    return allProjects
      .filter(p => {
        // Search filter
        const lowerSearch = searchTerm.toLowerCase();
        const nameMatch = p.project_name?.toLowerCase().includes(lowerSearch);
        const locationMatch = p.location?.toLowerCase().includes(lowerSearch);
        if (searchTerm && !nameMatch && !locationMatch) {
          return false;
        }

        // Status filter
        if (statusFilter === 'all') return true;
        const status = p.compliance_status;
        if (statusFilter === 'inProgress') return status === null || status === 'pending';
        if (statusFilter === 'submitted') return status === 'submitted';
        if (statusFilter === 'compliant') return status === 'pass' || status === 'Compliant';
        if (statusFilter === 'non-compliant') return status === 'fail';
        return false;
      })
      .sort((a, b) => {
        if (sortBy === 'project_name') {
          return a.project_name.localeCompare(b.project_name);
        }
        // Default sort by updated_at (descending)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [allProjects, searchTerm, statusFilter, sortBy]);

  const handleNewProject = () => navigate('/calculator?showHelp=true');
  const handleViewProject = (projectId: string) => navigate(`/project/${projectId}`);
  const handleEditProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/calculator?edit=${projectId}`);
  };
  const handleDuplicateProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({ title: "Coming Soon!", description: "Project duplication will be available shortly." });
  };
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    
    try {
      const { error } = await supabase.from('project_summaries').delete().eq('id', projectId);
      if (error) throw error;
      setAllProjects(prev => prev.filter(p => p.id !== projectId));
      toast({ title: "Project Deleted", description: "The project has been successfully deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete project: ${error.message}`, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Project Dashboard V2</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Manage your NBC 9.36 compliance projects and account information
          </p>
        </div>
        
        {canViewAllProjects && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-400/50 rounded-lg text-center flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-blue-300" />
            <p className="font-semibold text-blue-300">
              Admin View: You are viewing projects from all users.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <CreateProjectCard handleNewProject={handleNewProject} />
          
          <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-sm">
            <CardHeader>
              <ProjectToolbar
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                view={view}
                onViewChange={setView}
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-white">Loading projects...</div>
              ) : filteredAndSortedProjects.length > 0 ? (
                view === 'kanban' ? (
                  <ProjectKanbanView 
                    projects={filteredAndSortedProjects}
                    onViewProject={handleViewProject}
                    onEditProject={handleEditProject}
                    onDuplicateProject={handleDuplicateProject}
                    onDeleteProject={handleDeleteProject}
                  />
                ) : (
                  <ProjectTableView 
                    projects={filteredAndSortedProjects}
                    onViewProject={handleViewProject}
                    onEditProject={handleEditProject}
                    onDuplicateProject={handleDuplicateProject}
                    onDeleteProject={handleDeleteProject}
                  />
                )
              ) : (
                <div className="text-center py-12 text-white">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">No Projects Found</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Get started by creating a new project.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard2;