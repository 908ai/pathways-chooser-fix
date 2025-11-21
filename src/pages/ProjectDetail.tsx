import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, FileText, Building, Thermometer, Zap, Edit, Save, X, Trash2, CheckCircle, XCircle, Upload, Download, FolderOpen, Calendar, User, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ProjectStatusCard from '@/components/ProjectStatusCard';

const DetailItem = ({ label, value, unit = '' }: { label: string; value: any; unit?: string }) => {
  if (value === null || value === undefined || value === '') return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-slate-700 last:border-b-0">
      <span className="text-slate-300">{label}</span>
      <span className="font-medium text-white text-right">{displayValue}{unit && ` ${unit}`}</span>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { canDeleteProjects, canViewAllProjects, isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!user || !id) return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('project_summaries')
          .select('*')
          .eq('id', id);

        // Only filter by user_id if the user is NOT an admin/manager
        if (!canViewAllProjects) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "single() did not return a row"
          throw error;
        }

        if (data) {
          setProject(data);
          setEditedProject({ ...data });

          // Fetch company info
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', data.user_id)
            .single();
          
          if (companyError && companyError.code !== 'PGRST116') {
            console.error("Error fetching company info:", companyError);
          }
          setCompanyInfo(companyData);

        } else {
          toast({
            title: "Project Not Found",
            description: "The project you're looking for doesn't exist or you don't have access to it.",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Wait for role to be loaded before fetching
    if (!roleLoading) {
      loadProject();
    }
  }, [user, id, canViewAllProjects, roleLoading, navigate, toast]);

  const handleSave = async () => {
    if (!editedProject || !user) return;

    setSaving(true);
    
    try {
      const updateData = {
        project_name: editedProject.project_name,
        building_type: editedProject.building_type,
        location: editedProject.location,
        floor_area: parseFloat(editedProject.floor_area?.toString() || '0') || null,
        selected_pathway: editedProject.selected_pathway,
        attic_rsi: parseFloat(editedProject.attic_rsi?.toString() || '0') || null,
        wall_rsi: parseFloat(editedProject.wall_rsi?.toString() || '0') || null,
        below_grade_rsi: parseFloat(editedProject.below_grade_rsi?.toString() || '0') || null,
        floor_rsi: parseFloat(editedProject.floor_rsi?.toString() || '0') || null,
        window_u_value: parseFloat(editedProject.window_u_value?.toString() || '0') || null,
        heating_system_type: editedProject.heating_system_type,
        heating_efficiency: editedProject.heating_efficiency,
        cooling_system_type: editedProject.cooling_system_type,
        cooling_efficiency: parseFloat(editedProject.cooling_efficiency?.toString() || '0') || null,
        water_heating_type: editedProject.water_heating_type,
        water_heating_efficiency: parseFloat(editedProject.water_heating_efficiency?.toString() || '0') || null,
        hrv_erv_type: editedProject.hrv_erv_type,
        hrv_erv_efficiency: parseFloat(editedProject.hrv_erv_efficiency?.toString() || '0') || null,
        airtightness_al: parseFloat(editedProject.airtightness_al?.toString() || '0') || null,
        building_volume: parseFloat(editedProject.building_volume?.toString() || '0') || null,
        upgrade_costs: parseFloat(editedProject.upgrade_costs?.toString() || '0') || null,
        updated_at: new Date().toISOString()
      };

      let query = supabase
        .from('project_summaries')
        .update(updateData)
        .eq('id', project.id);

      if (!canViewAllProjects) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;

      setProject(data);
      setEditedProject({ ...data });
      setIsEditing(false);
      toast({
        title: "Project Updated",
        description: "Your project has been saved successfully.",
      });
      navigate('/dashboard');

    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your project.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProject({ ...project }); // Reset to original values
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProject((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDuplicate = async () => {
    if (!project || !user) return;

    setDuplicating(true);
    
    try {
      const { id, created_at, updated_at, ...restOfProject } = project;
      
      const duplicateData = {
        ...restOfProject,
        project_name: `${project.project_name} (Copy)`,
        compliance_status: 'draft',
        performance_compliance_result: null,
        uploaded_files: null,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('project_summaries')
        .insert(duplicateData);

      if (error) throw error;

      toast({
        title: "Project Duplicated",
        description: "A copy of this project has been created and moved to 'Draft'.",
      });
      navigate('/dashboard');

    } catch (error) {
      console.error('Error duplicating project:', error);
      toast({
        title: "Duplication Failed",
        description: "There was an error duplicating your project.",
        variant: "destructive"
      });
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !user) return;

    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    
    try {
      let query = supabase
        .from('project_summaries')
        .delete()
        .eq('id', project.id);

      if (!canDeleteProjects) {
        query = query.eq('user_id', user.id);
      }

      const { error } = await query;

      if (error) throw error;

      toast({
        title: "Project Deleted",
        description: "The project has been permanently deleted.",
      });
      navigate('/dashboard');

    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your project.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'pass' | 'fail' | 'needs_revision') => {
    if (!project || !user || !isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('project_summaries')
        .update({
          compliance_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;

      setProject(data);
      setEditedProject({ ...data });
      
      let toastTitle = "Project Status Updated";
      let toastDescription = `Project has been marked as ${newStatus.replace('_', ' ')}.`;
      if (newStatus === 'pass') toastDescription = `Project has been marked as compliant.`;
      if (newStatus === 'fail') toastDescription = `Project has been marked as non-compliant.`;
      if (newStatus === 'needs_revision') toastDescription = `Project has been sent back for revision.`;

      toast({
        title: toastTitle,
        description: toastDescription,
      });

    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Status Update Failed",
        description: "There was an error updating the project status.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user || !project) return;

    setUploading(true);

    try {
      const uploadedFileData: any[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${project.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        uploadedFileData.push({
          name: file.name,
          path: fileName,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.email
        });
      }

      const updatedFiles = [...(project.uploaded_files || []), ...uploadedFileData];
      
      const { data, error } = await supabase
        .from('project_summaries')
        .update({
          uploaded_files: updatedFiles,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;

      setProject(data);
      setEditedProject({ ...data });
      
      toast({
        title: "Files Uploaded",
        description: `${uploadedFileData.length} file(s) uploaded successfully.`,
      });

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleFileDownload = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .download(file.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive"
      });
    }
  };

  const handleFileDelete = async (fileToDelete: any) => {
    if (!user || !project) return;
    
    if (!confirm(`Are you sure you want to delete "${fileToDelete.name}"?`)) {
      return;
    }

    try {
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([fileToDelete.path]);

      if (storageError) throw storageError;

      const updatedFiles = (project.uploaded_files || []).filter(
        (file: any) => file.path !== fileToDelete.path
      );

      const { data, error } = await supabase
        .from('project_summaries')
        .update({
          uploaded_files: updatedFiles,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;

      setProject(data);
      setEditedProject({ ...data });
      
      toast({
        title: "File Deleted",
        description: "The file has been permanently removed.",
      });

    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the file.",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="h-5 w-5 text-purple-300" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileCategory = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('plan') || name.includes('blueprint') || name.includes('drawing')) {
      return 'Building Plans';
    } else if (name.includes('window') || name.includes('door')) {
      return 'Window/Door Schedule';
    } else if (name.includes('spec') || name.includes('technical') || name.includes('system')) {
      return 'Technical Specifications';
    } else if (name.includes('photo') || name.includes('image') || name.includes('picture')) {
      return 'Photos';
    } else if (name.includes('report') || name.includes('compliance') || name.includes('assessment')) {
      return 'Reports';
    } else {
      return 'Other Documents';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleFixItem = (fieldId: string) => {
    navigate(`/calculator?edit=${id}&focus=${fieldId}`);
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-200 drop-shadow-sm">Loading project details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-200 drop-shadow-sm">Project not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getComplianceStatusBadge = () => {
    switch (project.compliance_status) {
      case 'pass':
      case 'Compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted for Review</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'needs_revision':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Revision</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800">Under Review</Badge>;
    }
  };

  const isSubmitted = project.compliance_status === 'submitted';
  const isCompleted = project.compliance_status === 'pass' || project.compliance_status === 'fail' || project.compliance_status === 'Compliant';
  const isEditable = !isSubmitted && !isCompleted;
  const isDeletable = canDeleteProjects || (!isSubmitted && !isCompleted);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">{project.project_name}</h1>
              <div className="flex items-center gap-4 text-gray-200 drop-shadow-md text-sm">
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="text-gray-400">|</span>
                <span>Last Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getComplianceStatusBadge()}
              
              {isAdmin && project.compliance_status === 'submitted' && (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleUpdateStatus('pass')} 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white animate-fade-in"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus('needs_revision')} 
                    variant="outline"
                    className="animate-fade-in border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus('fail')} 
                    variant="destructive"
                    className="animate-fade-in"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <Button 
                        onClick={() => navigate(`/calculator?edit=${project.id}`)} 
                        variant="outline"
                        className="animate-fade-in"
                        disabled={!isEditable}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isEditable && (
                    <TooltipContent>
                      <p>Cannot edit a project that is under review or completed.</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <Button 
                        onClick={handleDelete} 
                        disabled={!isDeletable || deleting}
                        variant="destructive"
                        className="animate-fade-in"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isDeletable && (
                    <TooltipContent>
                      <p>Cannot delete a project that is under review or completed.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={duplicating} className="animate-fade-in">
                    <Copy className="h-4 w-4 mr-2" />
                    {duplicating ? 'Duplicating...' : 'Duplicate'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Duplicate This Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Create a copy of this project with all specifications intact. The duplicate will be placed in your "In Progress" section with a reset compliance status, allowing you to modify it as needed for new projects.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Important Notice</p>
                        <p className="text-sm text-red-600">
                          <span className="font-semibold">New building plans and window schedule must be uploaded</span> to accompany the duplicated project. The existing project files will not be carried over and fresh documentation is required for compliance review.
                        </p>
                      </div>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDuplicate}>Duplicate</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Documents ({(project.uploaded_files || []).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Label className="text-slate-300">Address</Label>
                    <p className="font-medium text-white">{project.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Building Type</Label>
                    <p className="font-medium text-white">{project.building_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Occupancy Class</Label>
                    <p className="font-medium text-white">{project.occupancy_class || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Climate Zone</Label>
                    <p className="font-medium text-white">{project.climate_zone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Floor Area</Label>
                    <p className="font-medium text-white">{project.floor_area ? `${project.floor_area} m²` : 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-1 bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5" />
                    Compliance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Label className="text-slate-300">Pathway</Label>
                    <p className="font-medium text-white">{project.selected_pathway === 'performance' ? 'Performance Path' : 'Prescriptive Path'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Performance Result</Label>
                    <p className="font-medium text-white">{project.performance_compliance_result || 'Under review'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Total Points</Label>
                    <p className="font-medium text-white">{project.total_points || 'TBD'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Upgrade Costs</Label>
                    <p className="font-medium text-white">{project.upgrade_costs ? `$${project.upgrade_costs.toLocaleString()}` : 'TBD'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-1 bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Label className="text-slate-300">Company</Label>
                    <p className="font-medium text-white">{companyInfo?.company_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Contact Email</Label>
                    <p className="font-medium text-white">{companyInfo?.contact_email || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Phone</Label>
                    <p className="font-medium text-white">{companyInfo?.phone || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Company Address</Label>
                    <p className="font-medium text-white">{companyInfo?.address || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Thermometer className="h-5 w-5" />
                    Building Envelope
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <DetailItem label="Attic/Ceiling RSI" value={project.attic_rsi} unit="RSI" />
                  <DetailItem label="Above-Grade Wall RSI" value={project.wall_rsi} unit="RSI" />
                  <DetailItem label="Below-Grade Wall RSI" value={project.below_grade_rsi} unit="RSI" />
                  <DetailItem label="Exposed Floor RSI" value={project.floor_rsi} unit="RSI" />
                  <DetailItem label="Window & Door U-Value" value={project.window_u_value} unit="W/(m²·K)" />
                  <DetailItem label="Mid-Construction Blower Door Test" value={project.mid_construction_blower_door_planned} />
                </CardContent>
              </Card>

              <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5" />
                    Mechanical Systems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <DetailItem label="Primary Heating System" value={project.heating_system_type} />
                  <DetailItem label="Primary Heating Efficiency" value={project.heating_efficiency} />
                  {project.secondary_heating_system_type && (
                    <>
                      <DetailItem label="Secondary Heating System" value={project.secondary_heating_system_type} />
                      <DetailItem label="Secondary Heating Efficiency" value={project.secondary_heating_efficiency} />
                    </>
                  )}
                  <DetailItem label="Cooling System" value={project.cooling_system_type} />
                  <DetailItem label="Cooling Efficiency" value={project.cooling_efficiency} unit="SEER" />
                  <DetailItem label="Water Heating System" value={project.water_heating_type} />
                  <DetailItem label="Water Heating Efficiency" value={project.water_heating_efficiency} unit="UEF" />
                  <DetailItem label="Ventilation (HRV/ERV)" value={project.hrv_erv_type} />
                  <DetailItem label="Ventilation Efficiency" value={project.hrv_erv_efficiency} unit="SRE %" />
                </CardContent>
              </Card>

              <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <DetailItem label="Airtightness Level" value={project.airtightness_al} unit="ACH₅₀" />
                  <DetailItem label="Building Volume" value={project.building_volume} unit="m³" />
                  <DetailItem label="Annual Energy Consumption" value={project.annual_energy_consumption} unit="GJ/year" />
                </CardContent>
              </Card>
            </div>
            {project && !isCompleted && (
              <ProjectStatusCard project={project} onFixItem={handleFixItem} />
            )}
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  NBC 9.36 Compliance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Total Points</h4>
                    <p className="text-2xl font-bold text-blue-200">{project.total_points || 'TBD'}</p>
                    <p className="text-sm text-blue-300 mt-1">Required: 50+ points</p>
                  </div>
                  <div className="text-center p-4 bg-green-900/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">Status</h4>
                    <div className="flex justify-center mb-2">{getComplianceStatusBadge()}</div>
                    <p className="text-sm text-green-300">{project.performance_compliance_result || 'Under review'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                    <h4 className="font-semibold text-purple-300 drop-shadow-md mb-2">Upgrade Costs</h4>
                    <p className="text-2xl font-bold text-purple-200 drop-shadow-lg">
                      {project.upgrade_costs ? `$${project.upgrade_costs.toLocaleString()}` : 'TBD'}
                    </p>
                    <p className="text-sm text-purple-300 drop-shadow-sm mt-1">Estimated investment</p>
                  </div>
                </div>
                
                {project.recommendations && project.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-white">Recommendations</h4>
                    <div className="space-y-2">
                      {project.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-slate-800/60 rounded-md">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-slate-200">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FolderOpen className="h-5 w-5" />
                  Project Documents
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Upload and manage project files including building plans, reports, and compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Upload project documents</p>
                    <p className="text-xs text-gray-200 drop-shadow-sm">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
                    </p>
                  </div>
                  <label htmlFor="file-upload" className="mt-4 inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        {uploading ? 'Uploading...' : 'Choose Files'}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {project.uploaded_files && project.uploaded_files.length > 0 ? (
                  <div className="space-y-6">
                    {['Building Plans', 'Window/Door Schedule', 'Technical Specifications', 'Reports', 'Photos', 'Other Documents'].map((category) => {
                      const categoryFiles = (project.uploaded_files || []).filter((file: any) => 
                        file && file.name && getFileCategory(file.name) === category
                      );
                      
                      if (categoryFiles.length === 0) return null;
                      
                      return (
                        <div key={category}>
                          <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                            <FolderOpen className="h-4 w-4" />
                            {category} ({categoryFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {categoryFiles.map((file: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-md hover:bg-slate-700/60 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {getFileIcon(file.name)}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate text-white">{file.name}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 drop-shadow-sm">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'N/A'}
                                      </span>
                                      <span>{formatFileSize(file.size)}</span>
                                      {file.uploadedBy && (
                                        <span className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {file.uploadedBy}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFileDownload(file)}
                                    className="h-8 px-3"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleFileDelete(file)}
                                    className="h-8 px-3"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-200 drop-shadow-sm">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs">Upload your first document to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;