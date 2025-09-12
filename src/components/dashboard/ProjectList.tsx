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
          {projects.inProgress.length === 0 ? <p className="text-sm text-gray-200 drop-shadow-sm">No projects in progress</p> : projects.inProgress.map(project => <ProjectCard key={project.id} project={project} status="inProgress" handleViewProject={handleViewProject} handleEditProject={handleEditProject} />)}
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
          {projects.complete.length === 0 ? <p className="text-sm text-slate-200">No completed projects</p> : projects.complete.map(project => <ProjectCard key={project.id} project={project} status="complete" handleViewProject={handleViewProject} handleEditProject={handleEditProject} />)}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;