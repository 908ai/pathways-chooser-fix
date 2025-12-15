'use client'

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  FileText,
  Trash2,
  Copy,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import ProjectTimeline from '@/components/ProjectTimeline'
import PerformanceComplianceView from '@/components/compliance/PerformanceComplianceView'
import PrescriptiveComplianceView from '@/components/compliance/PrescriptiveComplianceView'
import TieredPrescriptiveComplianceView from '@/components/compliance/TieredPrescriptiveComplianceView'
import { useUserRole } from '@/hooks/useUserRole'
import { RevisionRequestModal } from '@/components/admin/RevisionRequestModal'
import { ProjectReviewModal } from '@/components/admin/ProjectReviewModal'
import { useAuth } from '@/hooks/useAuth'
import FileManager from '@/components/FileManager'
import { Skeleton } from '@/components/ui/skeleton'
import { getProjectStatusPillClass } from '@/lib/utils'

const ProjectDetail = () => {
  const { projectId } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { userRole: role, isAdmin } = useUserRole()
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Rejected' | null>(null)

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_summaries')
        .select('*, companies!user_id(company_name, contact_email, phone, address)')
        .eq('id', projectId)
        .single()
      if (error) throw new Error(error.message)
      
      const companyData = Array.isArray(data.companies) ? data.companies[0] : data.companies;

      return { ...data, company: companyData };
    },
  })

  const { data: projectEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['project_events', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_project_events_with_details', {
        p_project_id: projectId,
      })
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!projectId,
  })

  const handleUpdateStatus = async (status: string, notes?: string) => {
    if (!project) return

    const event_type =
      status === 'Approved'
        ? 'project_approved'
        : status === 'Rejected'
        ? 'project_rejected'
        : 'status_changed'

    const { error } = await supabase
      .from('project_summaries')
      .update({ compliance_status: status })
      .eq('id', project.id)

    if (error) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      // Add to project history
      if (user?.id) {
        await supabase.from('project_events').insert({
          project_id: project.id,
          user_id: user.id,
          event_type: event_type,
          payload: { status, notes },
        })
      }

      toast({
        title: 'Project status updated',
        description: `Project has been ${status.toLowerCase()}.`,
      })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project_events', projectId] })
    }
  }

  const handleRevisionSubmit = async (comment: string) => {
    if (!project || !user) return

    const { error: updateError } = await supabase
      .from('project_summaries')
      .update({ compliance_status: 'Revisions Requested' })
      .eq('id', project.id)

    if (updateError) {
      toast({
        title: 'Error requesting revision',
        description: updateError.message,
        variant: 'destructive',
      })
      return
    }

    const { error: eventError } = await supabase.from('project_events').insert({
      project_id: project.id,
      user_id: user.id,
      event_type: 'revision_request',
      payload: { comment },
    })

    if (eventError) {
      toast({
        title: 'Error logging revision request',
        description: eventError.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Revision Requested',
        description: 'The user has been notified to make revisions.',
      })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project_events', projectId] })
    }
  }

  const handleDelete = async () => {
    if (
      !project ||
      !window.confirm('Are you sure you want to delete this project?')
    )
      return

    const { error } = await supabase
      .from('project_summaries')
      .delete()
      .eq('id', project.id)

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

  const handleDuplicate = async () => {
    if (!project) return
    const { id, created_at, updated_at, company, companies, ...rest } = project
    const newProject = {
      ...rest,
      project_name: `${project.project_name} (Copy)`,
      compliance_status: 'Draft',
    }

    const { data, error } = await supabase
      .from('project_summaries')
      .insert(newProject)
      .select()
      .single()

    if (error) {
      toast({
        title: 'Error duplicating project',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Project duplicated',
        description: 'A copy of the project has been created.',
      })
      navigate(`/project/${data.id}`)
    }
  }

  const handleFilesChange = async (files: any[]) => {
    if (!project) return;
    const { error } = await supabase
      .from('project_summaries')
      .update({ uploaded_files: files })
      .eq('id', project.id);

    if (error) {
      toast({
        title: 'Error updating files',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading project: {error.message}
      </div>
    )
  }

  const renderComplianceView = () => {
    if (!project) return null
    switch (project.selected_pathway) {
      case 'performance_9365':
        return <PerformanceComplianceView project={project} />
      case 'prescriptive_9362':
        return <PrescriptiveComplianceView project={project} />
      case 'prescriptive_9368':
      case 'prescriptive_9368_hrv':
        return <TieredPrescriptiveComplianceView project={project} />
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Compliance pathway not selected or not recognized. Please edit
                the project to select a valid pathway.
              </p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link
        to="/projects"
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Link>

      <div className="flex flex-wrap items-center justify-between mb-2">
        <h1 className="text-3xl font-bold tracking-tight mr-4">
          {project?.project_name}
        </h1>
        <div className="flex items-center space-x-2 flex-wrap">
          {isAdmin && project?.compliance_status === 'Submitted for Review' && (
            <>
              <Button
                onClick={() => {
                  setReviewAction('Approved')
                  setIsReviewModalOpen(true)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
              <RevisionRequestModal onConfirm={handleRevisionSubmit}>
                <Button
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> Request Revision
                </Button>
              </RevisionRequestModal>
              <Button
                onClick={() => {
                  setReviewAction('Rejected')
                  setIsReviewModalOpen(true)
                }}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          )}
          <Button
            onClick={() => navigate(`/calculator/${project?.id}`)}
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button onClick={handleDuplicate} variant="outline">
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </Button>
          <Button
            onClick={() => navigate(`/project/${project?.id}/pdf`)}
            variant="outline"
          >
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
        {project?.selected_pathway && (
          <Badge variant="outline">{project.selected_pathway}</Badge>
        )}
        {project?.compliance_status && (
          <Badge className={getProjectStatusPillClass(project.compliance_status)}>
            {project.compliance_status}
          </Badge>
        )}
        <span>
          Created: {new Date(project?.created_at).toLocaleDateString()}
        </span>
        <span>
          Last Updated: {new Date(project?.updated_at).toLocaleDateString()}
        </span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="revision">Revision</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Address:</strong> {project?.street_address || 'Not specified'}
                </p>
                <p>
                  <strong>Building Type:</strong> {project?.building_type || 'Not specified'}
                </p>
                <p>
                  <strong>Occupancy Class:</strong> {project?.occupancy_class || 'Not specified'}
                </p>
                <p>
                  <strong>Climate Zone:</strong> {project?.climate_zone || 'Not specified'}
                </p>
                <p>
                  <strong>Floor Area:</strong> {project?.floor_area ? `${project.floor_area} sqft` : 'Not specified'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Pathway:</strong> {project?.selected_pathway || 'Not specified'}
                </p>
                <p>
                  <strong>Performance Result:</strong> {project?.performance_compliance_result || 'Under review'}
                </p>
                <p>
                  <strong>Total Points:</strong> {project?.total_points ?? 'TBD'}
                </p>
                <p>
                  <strong>Upgrade Costs:</strong> {project?.upgrade_costs ? `$${project.upgrade_costs}` : 'TBD'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Company:</strong> {project?.company?.company_name || 'Not specified'}
                </p>
                <p>
                  <strong>Contact Email:</strong> {project?.company?.contact_email || 'Not specified'}
                </p>
                <p>
                  <strong>Phone:</strong> {project?.company?.phone || 'Not specified'}
                </p>
                <p>
                  <strong>Company Address:</strong> {project?.company?.address || 'Not specified'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <ProjectTimeline projectId={projectId!} />
        </TabsContent>
        <TabsContent value="compliance">{renderComplianceView()}</TabsContent>
        <TabsContent value="documents">
          {project && (
            <FileManager
              projectId={projectId!}
              files={project.uploaded_files || []}
              onFilesChange={handleFilesChange}
            />
          )}
        </TabsContent>
        <TabsContent value="revision">
          {project && projectEvents && (
            <ProjectTimeline
              projectId={projectId!}
              projectOwnerId={project.user_id}
              complianceStatus={project.compliance_status}
              events={projectEvents}
              onCommentAdded={() => refetchEvents()}
            />
          )}
        </TabsContent>
      </Tabs>

      <ProjectReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false)
          setReviewAction(null)
        }}
        onSubmit={(notes) => {
          if (reviewAction) {
            handleUpdateStatus(reviewAction, notes)
          }
          setIsReviewModalOpen(false)
          setReviewAction(null)
        }}
        action={reviewAction}
      />
    </div>
  )
}

export default ProjectDetail