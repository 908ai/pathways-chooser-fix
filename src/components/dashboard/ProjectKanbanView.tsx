import NewProjectCard from '@/components/dashboard/NewProjectCard';
import { cn } from '@/lib/utils';

interface ProjectKanbanViewProps {
  projects: any[];
  onViewProject: (id: string) => void;
  onEditProject: (id: string, e: React.MouseEvent) => void;
  onDuplicateProject: (id: string, e: React.MouseEvent) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

const ProjectKanbanView = ({ projects, onViewProject, onEditProject, onDuplicateProject, onDeleteProject }: ProjectKanbanViewProps) => {
  const allStatuses = [
    { id: 'draft', title: 'Draft' },
    { id: 'submitted', title: 'Submitted' },
    { id: 'needs_revision', title: 'Needs Revision' },
    { id: 'complete', title: 'Complete' },
  ];

  const hasNeedsRevisionProjects = projects.some(p => p.compliance_status === 'needs_revision');

  const visibleStatuses = allStatuses.filter(status => {
    if (status.id === 'needs_revision') {
      return hasNeedsRevisionProjects;
    }
    return true;
  });

  const getProjectsByStatus = (statusId: string) => {
    return projects.filter(p => {
      const status = p.compliance_status;
      if (statusId === 'draft') return status === 'draft';
      if (statusId === 'submitted') return status === 'submitted';
      if (statusId === 'needs_revision') return status === 'needs_revision';
      if (statusId === 'complete') return status === 'pass' || status === 'Compliant' || status === 'fail';
      return false;
    });
  };

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 gap-6",
      hasNeedsRevisionProjects ? "lg:grid-cols-4" : "lg:grid-cols-3"
    )}>
      {visibleStatuses.map(status => {
        const statusProjects = getProjectsByStatus(status.id);
        return (
          <div key={status.id}>
            <h3 className="text-lg font-semibold mb-4 text-white px-2">{status.title} ({statusProjects.length})</h3>
            <div className="space-y-4 p-2 rounded-lg h-[60vh] overflow-y-auto bg-black/10">
              {statusProjects.length > 0 ? (
                statusProjects.map(project => (
                  <NewProjectCard
                    key={project.id}
                    project={project}
                    onView={onViewProject}
                    onEdit={onEditProject}
                    onDuplicate={onDuplicateProject}
                    onDelete={onDeleteProject}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No projects in this stage.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKanbanView;