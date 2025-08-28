import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Clock, CheckCircle, User, Building, Edit, Save, X, AlertTriangle, FileText, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { canViewAllProjects, userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState({
    new: [],
    inProgress: [],
    complete: []
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState<any>({});

  // Load user's company information
  useEffect(() => {
    const loadCompanyInfo = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setCompanyInfo(data);
        }
      } catch (error) {
        console.error('Error loading company info:', error);
      } finally {
        setLoadingCompany(false);
      }
    };
    loadCompanyInfo();
  }, [user]);

  // Load user projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      try {
        let projectsData: any[] = [];
        if (canViewAllProjects) {
          // Account managers/admins: view all projects
          const { data, error } = await supabase
            .from('project_summaries')
            .select('*');
          if (error) throw error;
          projectsData = data || [];
        } else {
          // Regular users: only their own projects
          const { data, error } = await supabase
            .from('project_summaries')
            .select('*')
            .eq('user_id', user.id);
          if (error) throw error;
          projectsData = data || [];
        }

        // Categorize projects based on compliance status
        const categorizedProjects = {
          new: [],
          inProgress: projectsData.filter((p: any) => p.compliance_status === null || p.compliance_status === 'pending' || p.compliance_status === 'submitted'),
          complete: projectsData.filter((p: any) => p.compliance_status === 'pass' || p.compliance_status === 'fail' || p.compliance_status === 'Compliant')
        };
        setProjects(categorizedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, [user, canViewAllProjects]);

  const handleNewProject = () => {
    navigate('/calculator');
  };
  const handleEditProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (roleLoading || !userRole) {
      toast({
        title: "Please Wait",
        description: "Loading user permissions...",
        variant: "default"
      });
      return;
    }
    navigate(`/calculator?edit=${projectId}`);
  };
  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };
  const handleEditCompany = () => {
    setEditedCompanyInfo({
      company_name: companyInfo?.company_name || '',
      contact_email: companyInfo?.contact_email || user?.email || '',
      phone: companyInfo?.phone || '',
      address: companyInfo?.address || ''
    });
    setIsEditingCompany(true);
  };
  const handleSaveCompany = async () => {
    if (!user) return;
    try {
      if (companyInfo) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update(editedCompanyInfo)
          .eq('user_id', user.id);
        if (error) throw error;
        setCompanyInfo({ ...companyInfo, ...editedCompanyInfo });
      } else {
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert({
            ...editedCompanyInfo,
            user_id: user.id
          });
        if (error) throw error;
        setCompanyInfo({ ...editedCompanyInfo, user_id: user.id });
      }
      setIsEditingCompany(false);
      toast({
        title: "Success",
        description: "Company information updated successfully"
      });
    } catch (error) {
      console.error('Error saving company info:', error);
      toast({
        title: "Error",
        description: "Failed to save company information",
        variant: "destructive"
      });
    }
  };
  const handleCancelEdit = () => {
    setIsEditingCompany(false);
    setEditedCompanyInfo({});
  };

  // Function to get pending items for a project
  const getPendingItems = (project: any) => {
    const pendingItems: string[] = [];
    if (!project.uploaded_files || Array.isArray(project.uploaded_files) && project.uploaded_files.length === 0) {
      pendingItems.push("Building plans upload");
    }
    if (project.uploaded_files && Array.isArray(project.uploaded_files)) {
      const hasWindowFiles = project.uploaded_files.some((file: any) => file.name?.toLowerCase().includes('window') || file.name?.toLowerCase().includes('door'));
      if (!hasWindowFiles) {
        pendingItems.push("Window/door schedule");
      }
    }
    if (!project.heating_system_type || project.heating_system_type === '') {
      pendingItems.push("Heating system details");
    }
    if (project.cooling_efficiency === null || project.cooling_efficiency === 0) {
      pendingItems.push("Cooling system details");
    }
    if (!project.water_heating_type || project.water_heating_type === '') {
      pendingItems.push("Water heater details");
    }
    if (project.hrv_erv_type && project.hrv_erv_type !== 'None' && project.hrv_erv_efficiency === 0) {
      pendingItems.push("HRV/ERV specifications");
    }
    if (!project.floor_area || project.floor_area === 0) {
      pendingItems.push("Floor area calculation");
    }
    return pendingItems;
  };
  const ProjectCard = ({
    project,
    status
  }: {
    project: any;
    status: string;
  }) => {
    const pendingItems = status === 'inProgress' ? getPendingItems(project) : [];
    const parseProjectInfo = (projectName: string) => {
      if (!projectName) return {
        clientName: '',
        location: ''
      };
      const parts = projectName.split(' - ');
      if (parts.length >= 2) {
        return {
          clientName: parts[0].trim(),
          location: parts.slice(1).join(' - ').trim()
        };
      }
      return {
        clientName: projectName,
        location: ''
      };
    };
    const { clientName, location } = parseProjectInfo(project.project_name || project.name);
    return <Card className="hover:shadow-md transition-shadow cursor-pointer hover-scale bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl" onClick={() => handleViewProject(project.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold leading-tight mb-1 text-white">
                {clientName}
              </CardTitle>
              {location && <div className="text-sm text-slate-200 mb-2 leading-relaxed">
                  📍 {location}
                </div>}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={status === 'complete' ? 'default' : 'secondary'} className="text-xs">
                  {project.selected_pathway === 'performance' ? 'Performance' : 'Prescriptive'}
                </Badge>
                <span className="text-xs text-slate-200 capitalize">
                  {project.building_type?.replace('-', ' ') || project.type}
                </span>
              </div>
            </div>
            {status === 'inProgress' && <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
                <Button variant="outline" size="sm" onClick={e => handleEditProject(project.id, e)} className="h-8 px-3 text-xs" type="button">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-200">
                Last updated: {new Date(project.updated_at || project.date).toLocaleDateString()}
              </p>
              {status === 'complete' && <Badge variant="outline" className="text-xs">
                  Duplicate Ready
                </Badge>}
            </div>
            {status === 'inProgress' && pendingItems.length > 0 && <div className="mt-3 p-3 bg-slate-800/60 border border-orange-400 rounded-md backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-white animate-bounce" />
                  <span className="text-sm font-medium text-orange-300">
                    {pendingItems.length} item(s) pending
                  </span>
                </div>
                <div className="space-y-1">
                  {pendingItems.slice(0, 3).map((item, index) => <div key={index} className="flex items-center gap-2 text-xs text-orange-200">
                      <div className="h-1 w-1 bg-orange-400 rounded-full"></div>
                      {item}
                    </div>)}
                  {pendingItems.length > 3 && <div className="text-xs text-orange-300 font-medium">
                      +{pendingItems.length - 3} more items
                    </div>}
                </div>
              </div>}
            {status === 'inProgress' && pendingItems.length === 0 && <div className="mt-3 p-2 bg-slate-800/60 border border-green-400 rounded-md backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300">All items completed</span>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>;
  };
  return <div className="min-h-screen flex flex-col relative" style={{
    backgroundImage: `url(${starryMountainsBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Project Dashboard</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Manage your NBC 9.36 compliance projects and account information
          </p>
        </div>
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="building-officials" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Building Officials
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account Information
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plus className="h-5 w-5" />
                  Start New Project
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Begin a new NBC 9.36 compliance assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleNewProject} size="lg" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Clock className="h-5 w-5" />
                    In Progress ({projects.inProgress.length})
                  </CardTitle>
                  <CardDescription className="text-gray-50">
                    Projects currently being reviewed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects.inProgress.length === 0 ? <p className="text-sm text-gray-200 drop-shadow-sm">No projects in progress</p> : projects.inProgress.map(project => <ProjectCard key={project.id} project={project} status="inProgress" />)}
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Complete ({projects.complete.length})
                  </CardTitle>
                  <CardDescription className="text-slate-200">
                    Finished and approved projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects.complete.length === 0 ? <p className="text-sm text-slate-200">No completed projects</p> : projects.complete.map(project => <ProjectCard key={project.id} project={project} status="complete" />)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* ...rest of the file unchanged... */}
        </Tabs>
      </main>
      <Footer />
    </div>;
};
export default Dashboard;