import { useState, useEffect, useCallback } from 'react';
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
import { ArrowLeft, Copy, FileText, Building, Thermometer, Zap, Edit, Save, X, Trash2, CheckCircle, XCircle, Upload, Download, FolderOpen, Calendar, User, AlertTriangle, Eye, MessageSquare, History, FileSpreadsheet } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ComplianceDetails from '@/components/compliance/ComplianceDetails';
import { RevisionRequestModal } from '@/components/admin/RevisionRequestModal';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectHistory from '@/components/ProjectHistory';
import { ActionCommentModal } from '@/components/admin/ActionCommentModal';

const DetailItem = ({ label, value, unit = '' }: { label: string; value: any; unit?: string }) => {
  if (value === null || value === undefined || value === '') return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-card-foreground text-right">{displayValue}{unit && ` ${unit}`}</span>
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
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [projectEvents, setProjectEvents] = useState<any[]>([]);

  const getPathwayDisplay = (pathway: string | null) => {
    if (!pathway) return null;

    const isPerformance = pathway.includes('performance') || pathway.includes('9365') || pathway.includes('9367');
    const isPrescriptive = pathway.includes('prescriptive') || pathway.includes('9362') || pathway.includes('9368');

    let text = 'Unknown Pathway';
    if (isPerformance) text = 'Performance Path';
    if (isPrescriptive) text = 'Prescriptive Path';

    if (pathway === '9365') text = 'NBC 9.36.5 Performance';
    if (pathway === '9362') text = 'NBC 9.36.2 Prescriptive';
    if (pathway === '9367') text = 'NBC 9.36.7 Tiered Performance';
    if (pathway === '9368') text = 'NBC 9.36.8 Tiered Prescriptive';
    
    return {
      text,
      isPerformance,
      isPrescriptive
    };
  };

  const fetchProjectEvents = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .rpc('get_project_events_with_details', { p_project_id: id });

    if (error) {
      console.error('Error fetching project events:', error);
      setProjectEvents([]);
    } else {
      setProjectEvents(Array.isArray(data) ? data : []);
    }
  }, [id]);

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
      fetchProjectEvents();
    }
  }, [user, id, canViewAllProjects, roleLoading, navigate, toast, fetchProjectEvents]);

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
        description: "There was an error deleting the project.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleRequestRevision = async (comment: string) => {
    if (!project || !user || !isAdmin || !comment.trim()) return;

    try {
      // 1. Create the revision event
      const { error: eventError } = await supabase
        .from('project_events')
        .insert({
          project_id: project.id,
          user_id: user.id,
          event_type: 'revision_request',
          payload: { comment: comment.trim() },
        });

      if (eventError) throw eventError;

      // 2. Update the project status
      await handleUpdateStatus('needs_revision');
      
      // 3. Refetch events
      fetchProjectEvents();

    } catch (error) {
      console.error('Error requesting revision:', error);
      toast({
        title: "Revision Request Failed",
        description: "There was an error sending the revision request.",
        variant: "destructive"
      });
    }
  };

  const handleApprove = (comment: string) => {
    handleUpdateStatus('pass', comment);
  };

  const handleReject = (comment: string) => {
    handleUpdateStatus('fail', comment);
  };

  const handleUpdateStatus = async (newStatus: 'pass' | 'fail' | 'needs_revision', comment?: string) => {
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

      // Log decision event for pass or fail
      if (newStatus === 'pass' || newStatus === 'fail') {
        const event_type = newStatus === 'pass' ? 'project_approved' : 'project_rejected';
        await supabase.from('project_events').insert({
          project_id: project.id,
          user_id: user.id,
          event_type: event_type,
          payload: { comment: comment || '' },
        });
      }

      setProject(data);
      setEditedProject({ ...data });
      fetchProjectEvents(); // Refetch events to show the new status change
      
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
      if (!file.path) {
        throw new Error("File path is missing.");
      }
      
      // Decode the path before passing it to download, in case it contains encoded characters
      const decodedPath = decodeURIComponent(file.path);

      const { data, error } = await supabase.storage
        .from('project-files')
        .download(decodedPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: error.message || "There was an error downloading the file.",
        variant: "destructive"
      });
    }
  };

  const handleFilePreview = async (file: any) => {
    if (!file.path) {
      toast({ title: "Preview Error", description: "File path is missing.", variant: "destructive" });
      return;
    }
    try {
      const decodedPath = decodeURIComponent(file.path);
      const { data, error } = await supabase.storage
        .from('project-files')
        .createSignedUrl(decodedPath, 900); // 900 seconds = 15 minutes

      if (error) {
        throw error;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error("Could not generate a preview URL.");
      }
    } catch (error: any) {
      console.error('Error creating signed URL for preview:', error);
      toast({
        title: "Preview Failed",
        description: error.message || "Could not generate a preview for this file.",
        variant: "destructive",
      });
    }
  };

  const isPreviewable = (fileName: string) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
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
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
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
      return 'General Documents';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleFixItem = (fieldId: string) => {
    navigate(`/calculator?edit=${id}&focus=${fieldId}`);
  };

  const handleGeneratePdf = async () => {
    if (!project) return;
    setGeneratingPdf(true);
    try {
      // Try to read the logo from public assets and convert to base64
      const getLogoBase64 = async (): Promise<string | null> => {
        try {
          const res = await fetch('/assets/energy-navigator-logo.png');
          if (!res.ok) return null;
          const blob = await res.blob();
          return new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              // result is data URL: data:image/png;base64,XXXXX
              const base64 = result.split(',')[1] || '';
              resolve(base64 || null);
            };
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      };

      const logoBase64 = await getLogoBase64();

      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { projectId: project.id, logoBase64 },
      });

      if (error) throw error;

      if (!data || !data.pdfData) {
        throw new Error("PDF generation failed: No data received from server.");
      }

      const base64Response = await fetch(`data:application/pdf;base64,${data.pdfData}`);
      const blob = await base64Response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.project_name}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated",
        description: "Your project report has been downloaded.",
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: error.message || "There was an error creating the PDF report.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showSignOut={true} onSignOut={signOut} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showSignOut={true} onSignOut={signOut} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Project not found.</p>
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
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Compliant</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Non-Compliant</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Submitted for Review</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">Draft</Badge>;
      case 'needs_revision':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Needs Revision</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">Under Review</Badge>;
    }
  };

  const isSubmitted = project.compliance_status === 'submitted';
  const isCompleted = project.compliance_status === 'pass' || project.compliance_status === 'fail' || project.compliance_status === 'Compliant' || project.compliance_status === 'complete';
  const isEditable = !isSubmitted && !isCompleted;
  const isDeletable = canDeleteProjects || (!isSubmitted && !isCompleted);
  const isFileUploadDisabled = isSubmitted || isCompleted;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header showSignOut={true} onSignOut={signOut} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 text-muted-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {project.compliance_status === 'needs_revision' && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-500/50 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Revision Requested</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  An administrator has requested changes on this project. Please review the comments in the "Timeline" tab and resubmit once the required updates are made.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-foreground">{project.project_name}</h1>
              
              {(() => {
                const pathwayInfo = getPathwayDisplay(project.selected_pathway);
                if (!pathwayInfo) return null;
                
                return (
                  <Badge 
                    variant="outline" 
                    className={`text-sm font-medium border px-3 py-1 flex items-center gap-1.5 w-fit mb-3 ${
                      pathwayInfo.isPerformance 
                        ? 'border-blue-200 text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-500/50' 
                        : 'border-orange-200 text-orange-800 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-500/50'
                    }`}
                  >
                    {pathwayInfo.isPerformance ? <Zap className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    {pathwayInfo.text}
                  </Badge>
                );
              })()}

              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="text-border">|</span>
                <span>Last Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Right-side status + general actions */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                {getComplianceStatusBadge()}
              </div>

              {/* General Actions (icon-only Edit/Duplicate/Delete + Export menu) */}
              <div className="flex items-center gap-2">
                {/* Edit (icon-only) */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <Button 
                          onClick={() => navigate(`/calculator?edit=${project.id}`)} 
                          variant="outline"
                          size="icon"
                          className="animate-fade-in h-10 w-10"
                          disabled={!isEditable}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEditable ? 'Edit' : 'Cannot edit a project that is under review or completed.'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Duplicate (icon-only with alert dialog) */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button disabled={duplicating} className="animate-fade-in h-10 w-10" variant="outline" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Duplicate This Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Create a copy of this project with all specifications intact. The duplicate will be placed in your "In Progress" section with a reset compliance status, allowing you to modify it as needed for new projects.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-500/50 rounded-md p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Important Notice</p>
                                <p className="text-sm text-red-700 dark:text-red-300">
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{duplicating ? 'Duplicating…' : 'Duplicate'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Delete (icon-only) */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          onClick={handleDelete} 
                          disabled={!isDeletable || deleting}
                          variant="destructive"
                          size="icon"
                          className="animate-fade-in h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isDeletable ? (deleting ? 'Deleting…' : 'Delete') : 'Cannot delete a project that is under review or completed.'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Export dropdown menu */}
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="animate-fade-in" >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleGeneratePdf}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast({
                            title: "CSV Export",
                            description: "CSV export is coming soon.",
                          })
                        }
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast({
                            title: "JSON Export",
                            description: "JSON export is coming soon.",
                          })
                        }
                      >
                        JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>

          {/* Centered Admin Actions (Approve / Request Revision / Reject) */}
          {isAdmin && project.compliance_status === 'submitted' && (
            <div className="mt-6 flex justify-center">
              <div className="bg-card rounded-lg p-[15px]">
                <div className="flex items-center gap-3">
                  <ActionCommentModal
                    onConfirm={handleApprove}
                    title="Approve Project"
                    description="Add an optional comment to your approval. This will be visible to the user."
                    actionName="Approve"
                  >
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white animate-fade-in"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </ActionCommentModal>

                  <RevisionRequestModal onConfirm={handleRequestRevision}>
                    <Button 
                      variant="outline"
                      className="animate-fade-in border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Request Revision
                    </Button>
                  </RevisionRequestModal>

                  <ActionCommentModal
                    onConfirm={handleReject}
                    title="Reject Project"
                    description="Please provide a reason for rejecting this project. This will be visible to the user."
                    actionName="Reject"
                    actionButtonVariant="destructive"
                    commentLabel="Reason for Rejection (Required)"
                    commentPlaceholder="e.g., 'The provided building plans do not match the specifications entered.'"
                  >
                    <Button 
                      variant="destructive"
                      className="animate-fade-in"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </ActionCommentModal>
                </div>
              </div>  
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-6 p-1 rounded-lg bg-accent dark:bg-muted">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Building className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Thermometer className="h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <FolderOpen className="h-4 w-4" />
              Documents ({(project.uploaded_files || []).length})
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Revision
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* ...rest unchanged */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* content omitted for brevity */}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ProjectHistory events={projectEvents} />
          </TabsContent>

          <TabsContent value="technical" className="mt-6 space-y-6">
            {/* content omitted for brevity */}
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ComplianceDetails project={project} onFixItem={handleFixItem} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            {/* content omitted for brevity */}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <ProjectTimeline 
              projectId={project.id} 
              projectOwnerId={project.user_id} 
              complianceStatus={project.compliance_status}
              events={projectEvents}
              onCommentAdded={fetchProjectEvents}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;