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
import { Plus, Clock, CheckCircle, User, Building, Edit, Save, X, AlertTriangle, FileText, Info, Shield } from 'lucide-react';
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
      if (!user || roleLoading) return; // Wait for user and role to be loaded
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
  }, [user, canViewAllProjects, roleLoading]);

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
        {canViewAllProjects && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-400/50 rounded-lg text-center flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-blue-300" />
            <p className="font-semibold text-blue-300">
              Admin View: You are viewing projects from all users.
            </p>
          </div>
        )}
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

          <TabsContent value="building-officials" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">For Building Officials</CardTitle>
                <CardDescription className="text-slate-200">
                  Supporting builders in meeting NBC Section 9.36 energy efficiency requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-6">
                <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                  <p className="mb-4">
                    This tool is designed to support builders in meeting the energy efficiency requirements of NBC Section 9.36 (Tier 1 or Tier 2) through either the Prescriptive or Performance Path, using energy modelling to identify compliant, cost-effective upgrade options.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/60 border border-green-400/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-300 mb-4">How Do Building Officials Benefit From This Tool?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Clear, jurisdiction-ready documentation:</p>
                        <p className="text-sm text-slate-300">All compliance reports are formatted to meet NBC 9.36 requirements and tailored to your jurisdiction's specific expectations—making your review process faster and easier.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Simplified review process:</p>
                        <p className="text-sm text-slate-300">Our reports include prescriptive checklists and performance summaries that minimize back-and-forth with applicants. As energy code specialists, we also provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Confidence in verification:</p>
                        <p className="text-sm text-slate-300">All models are prepared and reviewed by qualified energy professionals, ensuring accuracy and adherence to compliance standards.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Consistent interpretation:</p>
                        <p className="text-sm text-slate-300">The tool promotes consistency across builders and projects by applying a uniform standard for Tier 1 and Tier 2 compliance.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Fewer errors at intake:</p>
                        <p className="text-sm text-slate-300">Builders are guided through compliant upgrade paths from the outset, reducing the likelihood of non-conforming submissions and rework during permitting.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-800/60 border border-orange-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-300 mb-4">Performance Path</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">We use HOT2000, a Natural Resources Canada–approved software, to model building performance according to NBC 9.36.5.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">A Reference House is generated based on NBC2020's minimum requirements.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">The proposed house is then optimized to meet or exceed the performance of the Reference House.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">Modelling results are reviewed and verified by an NRCan-registered Energy Advisor or qualified consultant.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">Ongoing support for revisions or re-submissions as needed (billable)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 border border-purple-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Prescriptive Path</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">A Prescriptive Path Report is generated once the builder submits basic project information. This includes required component specs for Tier 1 and Tier 2 based on Climate Zone 7A (or 7B for Alberta).</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">For Tier 2, the app automatically calculates points and confirms if compliance is achieved.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">Component upgrades and trade-offs used to meet compliance</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">Documentation suitable for permitting submissions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-300">Ongoing support for revisions or re-submissions as needed (billable)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/60 border border-red-400/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-300 mb-4">Builder Responsibilities</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-300">Builders are responsible for submitting final mechanical specs, window information and building assemblies for verification.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-300">All design changes that affect energy performance must be communicated to the energy advisor (Performance) or AHJ (Prescriptive) prior to construction to maintain compliance.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-300">Final compliance is subject to approval by the Authority Having Jurisdiction (AHJ).</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">Need to Verify Something?</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    We welcome questions from plan reviewers or inspectors.
                  </p>
                  <Button variant="outline" className="w-full sm:w-auto text-slate-800" asChild>
                    <a href="mailto:info@sies.energy?subject=Building Official Inquiry">
                      Contact Our Team
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* File Processing Timeline & Expectations */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Clock className="h-5 w-5" />
                  File Processing Timeline & Expectations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                  <p className="mb-3">
                    Our streamlined process ensures efficient delivery of your energy compliance reports.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                      <div className="font-semibold text-blue-300">Day 1-2</div>
                      <div className="text-sm">Project review & initial assessment</div>
                    </div>
                    <div className="text-center p-3 bg-orange-900/30 rounded-lg">
                      <div className="font-semibold text-orange-300">Day 3-5</div>
                      <div className="text-sm">Initial modeling & recommendations</div>
                    </div>
                    <div className="text-center p-3 bg-green-900/30 rounded-lg">
                      <div className="font-semibold text-green-300">Upon Compliance</div>
                      <div className="text-sm">Invoice → Payment → Report Release</div>
                    </div>
                   </div>
                   <p className="text-sm text-slate-300">
                     * Should files be sent back for corrections, the timeline resets to day 1. Reports are delivered through this portal for easy access and download.
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     <div className="p-3 bg-purple-900/30 rounded-lg">
                       <div className="font-semibold text-purple-300 mb-1">Per-Project Clients</div>
                       <div className="text-sm">Reports released after payment processing</div>
                     </div>
                     <div className="p-3 bg-teal-900/30 rounded-lg">
                       <div className="font-semibold text-teal-300 mb-1">Monthly Invoicees</div>
                       <div className="text-sm">Reports released immediately upon compliance</div>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Energy Code Resources */}
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Energy Code Resources</CardTitle>
                  <CardDescription className="text-slate-200">
                    Essential guides for NBC 2020 compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="https://solinvictusenergyservices.com/energy-hack" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">Energy Code Hack</div>
                    <div className="text-sm text-slate-300">Learn which compliance pathway saves you the most money - up to $5000 in potential savings</div>
                  </a>
                  <a 
                    href="https://solinvictusenergyservices.com/airtightness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">Airtightness Requirements</div>
                    <div className="text-sm text-slate-300">Regional requirements for air-tightness testing in BC, Alberta, and Saskatchewan</div>
                  </a>
                  <a 
                    href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">Blower Door Checklist (PDF)</div>
                    <div className="text-sm text-slate-300">Complete checklist for blower door testing procedures</div>
                  </a>
                </CardContent>
              </Card>

              {/* Technical Services */}
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Technical Services</CardTitle>
                  <CardDescription className="text-slate-200">
                    Professional calculations and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="https://solinvictusenergyservices.com/cancsa-f28012" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">CAN/CSA F280-12 Heat Loss/Gain</div>
                    <div className="text-sm text-slate-300">Room-by-room calculations for properly sizing modern heating and cooling systems</div>
                  </a>
                </CardContent>
              </Card>

              {/* External Resources */}
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">External Resources</CardTitle>
                  <CardDescription className="text-slate-200">
                    Helpful links and additional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="https://www.saskatoon.ca/content/energy-efficiency-handbook" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">Saskatoon Energy Efficiency Handbook</div>
                    <div className="text-sm text-slate-300">Municipal guidelines for energy efficiency improvements</div>
                  </a>
                  <a 
                    href="https://www.google.com/search?q=bild+alberta+videos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">BILD Alberta Videos</div>
                    <div className="text-sm text-slate-300">Educational videos from Building Industry and Land Development</div>
                  </a>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Need Help?</CardTitle>
                  <CardDescription className="text-slate-200">
                    Get in touch with our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-slate-200">
                      Have questions about energy compliance or need additional resources?
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:info@sies.energy?subject=Resource Request">
                        Contact Our Team
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                <CardDescription className="text-slate-200">
                  Common questions about energy compliance and our services
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">About the App</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: What does this app do?</p>
                        <p className="text-sm text-slate-300">A: The app helps you compare the two main compliance paths available under NBC 9.36 (Prescriptive and Performance), estimate upgrade costs, and understand what's required to meet Tier 1 or Tier 2 energy performance. It simplifies code compliance and helps guide your design and product choices.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Where do the upgrade costs come from?</p>
                        <p className="text-sm text-slate-300">A: Our upgrade costs are based on a detailed case study of a two-storey home built in Lloydminster, Alberta. We priced out both Tier 1 and Tier 2 upgrade paths using actual quotes from local trades and suppliers. This gives you a realistic sense of the cost difference between prescriptive and performance compliance — not just theoretical estimates.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: What's the difference between the Prescriptive and Performance paths?</p>
                        <p className="text-sm text-slate-300">A: Prescriptive Path follows a checklist of minimum component requirements (insulation, windows, HVAC, etc.). Performance Path allows flexibility by using whole-building energy modeling. You can trade off components as long as the house meets the required overall performance.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">Using the App</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Do I need to know my mechanical system selections before using the app?</p>
                        <p className="text-sm text-slate-300">A: Not necessarily. You can begin with placeholder equipment if mechanical specifications aren't finalized yet. However, keep in mind that results and upgrade costs may change once actual systems are selected. Final equipment choices must be verified to meet the requirements of the Authority Having Jurisdiction (AHJ).</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: How accurate are the cost estimates?</p>
                        <p className="text-sm text-slate-300">A: They're high-level estimates based on typical upgrade costs in your region for a specific home design (but very typical for Alberta & Saskatchewan). They're meant to give you a ballpark to support decision-making.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Will using the app guarantee code compliance?</p>
                        <p className="text-sm text-slate-300">A: The app helps guide you toward compliance, but actual compliance depends on your final construction details and review by an energy advisor. If your project is non-compliant, we'll let you know and offer help to optimize the design.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Can I go back and edit my inputs later?</p>
                        <p className="text-sm text-slate-300">A: Absolutely. You can revise your selections and resubmit if plans change.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">Certification Programs</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Can I use this for MLI Select or CHBA Net Zero planning?</p>
                        <p className="text-sm text-slate-300">A: Yes. We've built this with those programs in mind. If you're targeting a specific energy or energy reduction target (e.g. 40% reduction), the app will flag your project for further review.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: If solar is planned, does that help me meet the Energy Codes?</p>
                        <p className="text-sm text-slate-300">A: No, solar is not accounted for in relation to NBC2020 Code Compliance. However, it is a great opportunity to save on operating costs, reduce emissions and can help meet certification targets.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">Process & Timeline</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: What happens after I submit my project?</p>
                        <p className="text-sm text-slate-300">A: We'll run a baseline energy model and assess compliance. If optimization is needed, we'll propose a plan with typical upgrades. Once finalized, we'll send you the full compliance report, energy model files, and any documentation needed for permitting or rebate applications.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: What is optimization?</p>
                        <p className="text-sm text-slate-300">A: Optimization is the process of finding the most cost-effective way to meet energy code requirements by using energy modelling to balance upgrades—like insulation, windows, and HVAC—so you only improve what's needed to comply.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: How long does it take to get results?</p>
                        <p className="text-sm text-slate-300">A: Typical turnaround is 3–5 business days, depending on project complexity.</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: What if my design changes after I submit?</p>
                        <p className="text-sm text-slate-300">A: You're responsible for notifying your energy advisor of any design changes (windows, envelope, mechanical, etc.). Changes can affect compliance, and we'll need to re-run the model to reflect them.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">Sharing & Collaboration</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-100 mb-1">Q: Can I share results with my clients or trades?</p>
                        <p className="text-sm text-slate-300">A: Yes. Once your compliance report is complete, you'll receive a version that's client- and trade-friendly, showing upgrade options and their impact on performance and cost.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-slate-200">
                  Manage your personal and company information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white">Email</label>
                    <p className="text-sm text-slate-200">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">Account Status</label>
                    <p className="text-sm text-slate-200">Active</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Edit Account Information
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Company Information</CardTitle>
                <CardDescription className="text-slate-200">
                  Update your company details for project documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingCompany ? <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name" className="text-white">Company Name</Label>
                        <Input id="company_name" value={editedCompanyInfo.company_name || ''} onChange={e => setEditedCompanyInfo({
                      ...editedCompanyInfo,
                      company_name: e.target.value
                    })} placeholder="Enter company name" />
                      </div>
                      <div>
                        <Label htmlFor="contact_email" className="text-white">Contact Email</Label>
                        <Input id="contact_email" type="email" value={editedCompanyInfo.contact_email || ''} onChange={e => setEditedCompanyInfo({
                      ...editedCompanyInfo,
                      contact_email: e.target.value
                    })} placeholder="Enter contact email" />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone</Label>
                        <Input id="phone" value={editedCompanyInfo.phone || ''} onChange={e => setEditedCompanyInfo({
                      ...editedCompanyInfo,
                      phone: e.target.value
                    })} placeholder="Enter phone number" />
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-white">Address</Label>
                        <Input id="address" value={editedCompanyInfo.address || ''} onChange={e => setEditedCompanyInfo({
                      ...editedCompanyInfo,
                      address: e.target.value
                    })} placeholder="Enter address" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveCompany} className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div> : <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-sm font-medium text-white">Company Name</label>
                         <p className="text-sm text-slate-200">
                           {loadingCompany ? 'Loading...' : companyInfo?.company_name || 'No company information yet'}
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-white">Contact Email</label>
                         <p className="text-sm text-slate-200">
                           {loadingCompany ? 'Loading...' : companyInfo?.contact_email || user?.email || 'Not specified'}
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-white">Phone</label>
                         <p className="text-sm text-slate-200">
                           {loadingCompany ? 'Loading...' : companyInfo?.phone || 'Not specified'}
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-white">Address</label>
                         <p className="text-sm text-slate-200">
                           {loadingCompany ? 'Loading...' : companyInfo?.address || 'Not specified'}
                         </p>
                       </div>
                    </div>
                    {!loadingCompany && !companyInfo && <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> Your account information will be automatically imported when you submit your first project.
                        </p>
                      </div>}
                    <Button variant="outline" onClick={handleEditCompany} className="w-full sm:w-auto">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Company Information
                    </Button>
                  </div>}
              </CardContent>
            </Card>

            {/* Estimate for Services Section */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Estimate for Services</CardTitle>
                <CardDescription className="text-slate-200">
                  Standard pricing for energy compliance services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-800/60 border border-green-400/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300 mb-1">$481.50</div>
                      <div className="text-sm text-slate-300">Single Family</div>
                      <div className="text-xs text-slate-400 mt-1">Energy compliance modeling & reports</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/60 border border-green-400/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300 mb-1">$321.00</div>
                      <div className="text-sm text-slate-300">Multi-Unit (Regular)</div>
                      <div className="text-xs text-slate-400 mt-1">Per unit energy compliance</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/60 border border-orange-400/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-300 mb-1">$240.75</div>
                      <div className="text-sm text-slate-300">Multi-Unit (Duplicate)</div>
                      <div className="text-xs text-slate-400 mt-1">Duplicate unit compliance</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300 mb-1">$100/hr</div>
                      <div className="text-sm text-slate-300">Revision Fee</div>
                      <div className="text-xs text-slate-400 mt-1">Project changes & re-modeling</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/60 border border-purple-400/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300 mb-1">$125/hr</div>
                      <div className="text-sm text-slate-300">Consulting Fee</div>
                      <div className="text-xs text-slate-400 mt-1">Optimization & certification needs</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Note:</strong> Standard service includes baseline energy modeling, compliance assessment, and report generation. Additional optimization for certification programs (MLI Select, CHBA Net Zero) may require consulting hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>;
};
export default Dashboard;