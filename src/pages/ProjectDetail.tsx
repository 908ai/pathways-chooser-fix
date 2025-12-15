import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { ProjectSummary } from '@/integrations/supabase/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Copy, FileText, Building, Thermometer, Zap, Edit, Save, X, Trash2, CheckCircle, XCircle, Upload, Download, FolderOpen, Calendar, User, AlertTriangle, Eye, MessageSquare } from 'lucide-react'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import ComplianceDetails from '@/components/compliance/ComplianceDetails'
import { useToast } from '@/hooks/use-toast'
import { useUserRole } from '@/hooks/useUserRole'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileManager from '@/components/FileManager'
import RevisionRequestModal from '@/components/admin/RevisionRequestModal'
import { ProjectTimeline } from '@/components/ProjectTimeline'

const fetchProject = async (id: string) => {
  const { data, error } = await supabase
    .from('project_summaries')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { userRole, canDeleteProjects } = useUserRole()
  const queryClient = useQueryClient()
  const [isRevisionModalOpen, setRevisionModalOpen] = useState(false)

  const { data: project, isLoading, error } = useQuery<ProjectSummary>({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  })

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: `${field} has been copied.`,
    })
  }

  const handleDeleteProject = async () => {
    if (!id) return
    const { error } = await supabase.from('project_summaries').delete().eq('id', id)
    if (error) {
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted.',
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/projects')
    }
  }

  const handleRevisionRequest = async (comment: string) => {
    if (!id) return;

    const { error: updateError } = await supabase
      .from('project_summaries')
      .update({ compliance_status: 'needs_revision' })
      .eq('id', id);

    if (updateError) {
      toast({
        title: 'Error',
        description: `Failed to update project status: ${updateError.message}`,
        variant: 'destructive',
      });
      return;
    }

    const { data: userResponse, error: userError } = await supabase.auth.getUser();
    if (userError || !userResponse.user) {
        toast({ title: 'Error', description: 'Could not get user.', variant: 'destructive' });
        return;
    }

    const { error: eventError } = await supabase
        .from('project_events')
        .insert({
            project_id: id,
            user_id: userResponse.user.id,
            event_type: 'revision_request',
            payload: { comment: comment },
        });

    if (eventError) {
        toast({
            title: 'Error',
            description: `Failed to log revision request: ${eventError.message}`,
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Success',
            description: 'Revision requested and comment added to timeline.',
        });
        queryClient.invalidateQueries({ queryKey: ['project', id] });
        queryClient.invalidateQueries({ queryKey: ['project_events', id] });
    }
    setRevisionModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-red-500">Error loading project: {error.message}</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div>Project not found.</div>
        </main>
        <Footer />
      </div>
    )
  }

  const getStatusBadgeVariant = (status: string | null): BadgeProps['variant'] => {
    switch (status) {
      case 'submitted':
        return 'secondary'
      case 'compliant':
        return 'success'
      case 'needs_revision':
        return 'warning'
      case 'draft':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50/50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          {project.compliance_status === 'needs_revision' && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                  <AlertTriangle />
                  Revision Requested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 dark:text-yellow-400">
                  An administrator has requested revisions for this project. Please review the comments in the timeline below and resubmit.
                </p>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{project.project_name}</h1>
              <TabsList>
                <TabsTrigger value="overview">
                  <Eye className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="files">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Files
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <ComplianceDetails project={project} />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                    <CardDescription>High-level details about the project.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Status</span>
                      <Badge variant={getStatusBadgeVariant(project.compliance_status)}>{project.compliance_status || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Building Type</span>
                      <span>{project.building_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Location</span>
                      <span>{project.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Floor Area</span>
                      <span>{project.floor_area} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Created</span>
                      <span>{format(new Date(project.created_at!), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Last Updated</span>
                      <span>{format(new Date(project.updated_at!), 'PPP')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    <Button onClick={() => navigate(`/calculator/${id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" onClick={() => handleCopy(id!, 'Project ID')}>
                      <Copy className="mr-2 h-4 w-4" /> Copy ID
                    </Button>
                    {userRole === 'admin' && (
                      <Button variant="outline" onClick={() => setRevisionModalOpen(true)}>
                        <AlertTriangle className="mr-2 h-4 w-4" /> Request Revision
                      </Button>
                    )}
                    {canDeleteProjects && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project and all its associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <ProjectTimeline projectId={id!} />
            </TabsContent>

            <TabsContent value="files">
              <FileManager projectId={id!} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <RevisionRequestModal
        open={isRevisionModalOpen}
        onOpenChange={setRevisionModalOpen}
        onSubmit={handleRevisionRequest}
      />
    </div>
  )
}

export default ProjectDetail