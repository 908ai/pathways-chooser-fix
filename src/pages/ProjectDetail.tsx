import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, FileText, Building, Thermometer, Zap, Droplets, Wind, Edit, Save, X, Trash2, CheckCircle, XCircle, Upload, Download, FolderOpen, Calendar, User, Code, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CodePreviewModal from '@/components/CodePreviewModal';
import { supabase } from '@/integrations/supabase/client';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { canDeleteProjects, canViewAllProjects, isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
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
        compliance_status: null,
        performance_compliance_result: null,
        user_id: user.id, // Ensure it's assigned to the current user
      };

      const { error } = await supabase
        .from('project_summaries')
        .insert(duplicateData);

      if (error) throw error;

      toast({
        title: "Project Duplicated",
        description: "A copy of this project has been created and moved to 'In Progress'.",
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

  const handleApproveProject = async (newStatus: 'pass' | 'fail') => {
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
      toast({
        title: "Project Status Updated",
        description: `Project has been marked as ${newStatus === 'pass' ? 'compliant' : 'non-compliant'}.`,
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
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted for Review</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800">Under Review</Badge>;
    }
  };

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
              <p className="text-gray-200 drop-shadow-md">
                Created on {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getComplianceStatusBadge()}
              
              {isAdmin && project.compliance_status === 'submitted' && (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleApproveProject('pass')} 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white animate-fade-in"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleApproveProject('fail')} 
                    variant="destructive"
                    className="animate-fade-in"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              {(project.compliance_status !== 'pass' && project.compliance_status !== 'fail') || canDeleteProjects ? (
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      {(project.compliance_status !== 'pass' && project.compliance_status !== 'fail') && (
                        <>
                          <Button 
                            onClick={() => navigate(`/calculator?edit=${project.id}`)} 
                            variant="outline"
                            className="animate-fade-in"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </Button>
                          
                          <CodePreviewModal
                            triggerText="AI Code Editor"
                            projectId={project.id}
                            initialCode={`// Project: ${project.project_name}\n// Building Type: ${project.building_type}\n// Location: ${project.location}\n\nconst projectData = ${JSON.stringify(project, null, 2)};\n\n// Add your AI-generated code here\nconsole.log('Project loaded:', projectData);`}
                            onCodeSaved={(code) => {
                              console.log('Code saved for project:', project.id);
                              toast({
                                title: "AI Code Saved",
                                description: "Your AI-generated code has been saved.",
                              });
                            }}
                          >
                            <Button 
                              variant="outline"
                              className="animate-fade-in gap-2"
                            >
                              <Sparkles className="h-4 w-4" />
                              <Code className="h-4 w-4" />
                              AI Code Editor
                            </Button>
                          </CodePreviewModal>
                        </>
                      )}
                      {((project.compliance_status !== 'pass' && project.compliance_status !== 'fail') || canDeleteProjects) && (
                        <Button 
                          onClick={handleDelete} 
                          disabled={deleting}
                          variant="destructive"
                          className="animate-fade-in"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting ? 'Deleting...' : 'Delete Project'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="animate-fade-in"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        onClick={handleCancelEdit} 
                        variant="outline"
                        className="animate-fade-in"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              ) : null}
              
              <Button onClick={handleDuplicate} disabled={duplicating} className="animate-fade-in">
                <Copy className="h-4 w-4 mr-2" />
                {duplicating ? 'Duplicating...' : 'Duplicate Project'}
              </Button>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Building Type</label>
                      {isEditing ? (
                        <Select value={editedProject?.building_type || ''} onValueChange={(value) => handleInputChange('building_type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select building type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single-detached">Single Detached</SelectItem>
                            <SelectItem value="single-family">Single Family Home</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="row-house">Row House</SelectItem>
                            <SelectItem value="apartment">Apartment Building</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{project.building_type || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Location</label>
                      {isEditing ? (
                        <Input
                          value={editedProject?.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Enter location"
                        />
                      ) : (
                        <p className="font-medium">{project.location || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Floor Area</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProject?.floor_area || ''}
                          onChange={(e) => handleInputChange('floor_area', e.target.value)}
                          placeholder="Enter floor area (m²)"
                        />
                      ) : (
                        <p className="font-medium">{project.floor_area ? `${project.floor_area} m²` : 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Pathway</label>
                      {isEditing ? (
                        <Select value={editedProject?.selected_pathway || ''} onValueChange={(value) => handleInputChange('selected_pathway', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pathway" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prescriptive">Prescriptive Path</SelectItem>
                            <SelectItem value="performance">Performance Path</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">
                          {project.selected_pathway === 'performance' ? 'Performance Path' : 'Prescriptive Path'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Total Points</label>
                      <p className="font-medium">{project.total_points || 'TBD'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white drop-shadow-md">Upgrade Costs</label>
                      <p className="font-medium">
                        {project.upgrade_costs ? `$${project.upgrade_costs.toLocaleString()}` : 'TBD'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-white drop-shadow-md">Performance Result</label>
                      <p className="font-medium">{project.performance_compliance_result || 'Under review'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-white drop-shadow-md">Status</label>
                      <div className="mt-1">{getComplianceStatusBadge()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Building Envelope
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Attic RSI:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={editedProject?.attic_rsi || ''}
                          onChange={(e) => handleInputChange('attic_rsi', e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{project.attic_rsi || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Wall RSI:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={editedProject?.wall_rsi || ''}
                          onChange={(e) => handleInputChange('wall_rsi', e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{project.wall_rsi || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Floor RSI:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={editedProject?.floor_rsi || ''}
                          onChange={(e) => handleInputChange('floor_rsi', e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{project.floor_rsi || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Below Grade RSI:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={editedProject?.below_grade_rsi || ''}
                          onChange={(e) => handleInputChange('below_grade_rsi', e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{project.below_grade_rsi || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-200 drop-shadow-sm">Window U-Value:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editedProject?.window_u_value || ''}
                          onChange={(e) => handleInputChange('window_u_value', e.target.value)}
                          className="w-20 h-6 text-xs"
                        />
                      ) : (
                        <span className="font-medium">{project.window_u_value || 'N/A'}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Mechanical Systems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Heating System:</span>
                      <span className="font-medium">{project.heating_system_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Heating Efficiency:</span>
                      <span className="font-medium">{project.heating_efficiency || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Cooling System:</span>
                      <span className="font-medium">{project.cooling_system_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">Water Heating:</span>
                      <span className="font-medium">{project.water_heating_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200 drop-shadow-sm">HRV/ERV Type:</span>
                      <span className="font-medium">{project.hrv_erv_type || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  NBC 9.36 Compliance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Total Points</h4>
                    <p className="text-2xl font-bold text-blue-700">{project.total_points || 'TBD'}</p>
                    <p className="text-sm text-blue-600 mt-1">Required: 50+ points</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Status</h4>
                    <div className="flex justify-center mb-2">{getComplianceStatusBadge()}</div>
                    <p className="text-sm text-green-600">{project.performance_compliance_result || 'Under review'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-200 drop-shadow-md mb-2">Upgrade Costs</h4>
                    <p className="text-2xl font-bold text-purple-100 drop-shadow-lg">
                      {project.upgrade_costs ? `$${project.upgrade_costs.toLocaleString()}` : 'TBD'}
                    </p>
                    <p className="text-sm text-purple-200 drop-shadow-sm mt-1">Estimated investment</p>
                  </div>
                </div>
                
                {project.recommendations && project.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {project.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Project Documents
                </CardTitle>
                <CardDescription>
                  Upload and manage project files including building plans, reports, and compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upload project documents</p>
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
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            {category} ({categoryFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {categoryFiles.map((file: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {getFileIcon(file.name)}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{file.name}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-200 drop-shadow-sm">
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

        <Card className="mt-6 animate-fade-in bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Copy className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-2">Duplicate This Project</h3>
                <p className="text-sm text-slate-200 mb-4">
                  Create a copy of this project with all specifications intact. The duplicate will be placed in your "In Progress" section with a reset compliance status, allowing you to modify it as needed for new projects.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-800 text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Important Notice</p>
                      <p className="text-sm text-yellow-700">
                        <span className="font-medium">New building plans and window schedule must be uploaded</span> to accompany the duplicated project. The existing project files will not be carried over and fresh documentation is required for compliance review.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;