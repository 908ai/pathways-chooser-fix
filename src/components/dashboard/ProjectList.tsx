import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, CheckCircle } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: {
    inProgress: any[];
    complete: any[];
  };
  handleViewProject: (projectId: string) => void;
  handleEditProject: (projectId: string, event: React.MouseEvent) => void;
}

const ProjectList = ({ projects, handleViewProject, handleEditProject }: ProjectListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            In Progress ({projects.inProgress.length})
          </CardTitle>
          <CardDescription>
            Projects currently being reviewed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.inProgress.length === 0 ? <p className="text-sm text-muted-foreground">No projects in progress</p> : projects.inProgress.map(project => <ProjectCard key={project.id} project={project} status="inProgress" handleViewProject={handleViewProject} handleEditProject={handleEditProject} />)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Complete ({projects.complete.length})
          </CardTitle>
          <CardDescription>
            Finished and approved projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.complete.length === 0 ? <p className="text-sm text-muted-foreground">No completed projects</p> : projects.complete.map(project => <ProjectCard key={project.id} project={project} status="complete" handleViewProject={handleViewProject} handleEditProject={handleEditProject} />)}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;