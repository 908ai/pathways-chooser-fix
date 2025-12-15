import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { Shield, Building } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import ProjectToolbar from '@/components/dashboard/ProjectToolbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProjectKanbanView from '@/components/dashboard/ProjectKanbanView';
import ProjectTableView from '@/components/dashboard/ProjectTableView';

const Dashboard2 = () => {
  const { user, signOut } = useAuth();
  const { canViewAllProjects, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  
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
  }, [user, canViewAllProjects, roleLoading]);

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
        if (statusFilter === 'draft') return status === 'draft';
        if (statusFilter === 'submitted') return status === 'submitted';
        if (statusFilter === 'needs-revision') return status === 'needs_revision';
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          {canViewAllProjects ? (
            <>
              <h1 className="text-3xl font-bold text-foreground">All Projects</h1>
              <p className="text-muted-foreground mt-1">
                Review and manage all compliance projects from all users.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                View, manage, and track all your NBC 9.36 compliance projects.
              </p>
            </>
          )}
        </div>
        
        {canViewAllProjects && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-blue-500" />
            <p className="font-semibold text-blue-700 dark:text-blue-300">
              Admin View: You are viewing projects from all users.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <Card>
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
                onNewProjectClick={handleNewProject}
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
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
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground">No Projects Found</h3>
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