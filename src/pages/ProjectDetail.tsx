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
  const { canDeleteProjects, canViewAllProjects, isAdmin, isAccountManager } = useUserRole();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!user || !id) return;
      try {
        const { data, error } = await supabase
          .from('project_summaries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
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
    loadProject();
  }, [user, id]);

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
      const { data, error } = await supabase
        .from('project_summaries')
        .update(updateData)
        .eq('id', project.id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProject(data);
        setEditedProject({ ...data });
      }
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
    setEditedProject({ ...project });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProject((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDuplicate = async () => {
    if (!project || !user) return;
    setDuplicating(true);
    try {
      const duplicateData = {
        ...project,
        project_name: `${project.project_name} (Copy)`,
        compliance_status: null,
        performance_compliance_result: null,
        created_at: undefined,
        updated_at: undefined,
        id: undefined
      };
      delete duplicateData.id;
      delete duplicateData.created_at;
      delete duplicateData.updated_at;
      const { error } = await supabase
        .from('project_summaries')
        .insert({ ...duplicateData, user_id: user.id });
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
      let query = supabase.from('project_summaries').delete().eq('id', project.id);
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
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProject(data);
        setEditedProject({ ...data });
      }
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
        if (uploadError) throw uploadError;
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
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProject(data);
        setEditedProject({ ...data });
      }
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
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProject(data);
        setEditedProject({ ...data });
      }
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
    if (bytes === 0) return '0 Bytes';
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

  if (loading) {
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

  // ... rest of the file unchanged (UI rendering)
  // (No changes to the UI code, only data fetching/mutation logic was updated above)
  // (If you want the full file, let me know!)

  // The rest of the file is unchanged.
  // (UI code omitted for brevity)
};

export default ProjectDetail;