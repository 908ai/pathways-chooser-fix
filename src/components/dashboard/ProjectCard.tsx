import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  status: string;
  handleViewProject: (projectId: string) => void;
  handleEditProject: (projectId: string, event: React.MouseEvent) => void;
}

const getPendingItems = (project: any) => {
  const pendingItems: string[] = [];

  // Basic Info
  if (!project.building_type) pendingItems.push("Building type missing");
  if (!project.location) pendingItems.push("Project location missing");

  // File uploads
  if (!project.uploaded_files || !Array.isArray(project.uploaded_files) || project.uploaded_files.length === 0) {
    pendingItems.push("Building plans upload");
  }
  
  if (!project.uploaded_files || !Array.isArray(project.uploaded_files) || !project.uploaded_files.some((file: any) => file && file.name && (file.name.toLowerCase().includes('window') || file.name.toLowerCase().includes('door')))) {
    pendingItems.push("Window/door schedule");
  }

  // Envelope
  if (!project.attic_rsi) pendingItems.push("Attic insulation details");
  if (!project.wall_rsi) pendingItems.push("Wall insulation details");
  if (!project.window_u_value) pendingItems.push("Window performance details");

  // Performance
  if (!project.floor_area) pendingItems.push("Floor area calculation");

  // Mechanicals
  if (!project.heating_system_type) {
    pendingItems.push("Heating system details");
  }
  
  if (project.cooling_system_type && project.cooling_system_type !== 'None' && !project.cooling_efficiency) {
    pendingItems.push("Cooling system details");
  }

  if (!project.water_heating_type) {
    pendingItems.push("Water heater details");
  }

  if (project.hrv_erv_type && project.hrv_erv_type !== 'None' && !project.hrv_erv_efficiency) {
    pendingItems.push("HRV/ERV specifications");
  }

  return pendingItems;
};

const ProjectCard = ({ project, status, handleViewProject, handleEditProject }: ProjectCardProps) => {
  const pendingItems = status === 'inProgress' ? getPendingItems(project) : [];
  const parseProjectInfo = (projectName: string) => {
    if (!projectName) return { clientName: '', location: '' };
    const parts = projectName.split(' - ');
    if (parts.length >= 2) {
      return { clientName: parts[0].trim(), location: parts.slice(1).join(' - ').trim() };
    }
    return { clientName: projectName, location: '' };
  };
  const { clientName, location } = parseProjectInfo(project.project_name || project.name);

  return (
    <Card 
      className="flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50" 
      onClick={() => handleViewProject(project.id)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold leading-tight mb-1 text-foreground">
              {clientName}
            </CardTitle>
            {location && (
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {location}
              </p>
            )}
          </div>
          {status === 'inProgress' && (
            <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
              <Button variant="outline" size="sm" onClick={e => handleEditProject(project.id, e)} className="h-8 px-3 text-xs">
                <Edit className="h-3 w-3 mr-1.5" />
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <Badge variant={project.selected_pathway === 'performance' ? 'secondary' : 'default'} className="text-xs">
            {project.selected_pathway === 'performance' ? 'Performance' : 'Prescriptive'}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {project.building_type?.replace(/-/g, ' ') || project.type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {status === 'inProgress' && pendingItems.length > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-md animate-pulse-subtle">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning-foreground">
                  {pendingItems.length} item(s) pending
                </p>
                <p className="text-xs text-muted-foreground">{pendingItems[0]}</p>
              </div>
            </div>
          </div>
        )}
        {status === 'inProgress' && pendingItems.length === 0 && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-semibold text-success-foreground">Ready for Review</p>
                <p className="text-xs text-muted-foreground">All items completed</p>
              </div>
            </div>
          </div>
        )}
        {status === 'complete' && (
           <div className="p-3 bg-secondary rounded-md">
             <div className="flex items-center gap-2">
               <CheckCircle className="h-5 w-5 text-muted-foreground" />
               <div>
                 <p className="text-sm font-semibold text-foreground">Project Complete</p>
                 <p className="text-xs text-muted-foreground">Ready to duplicate</p>
               </div>
             </div>
           </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Updated: {new Date(project.updated_at || project.date).toLocaleDateString()}
        </p>
        <div className="flex items-center text-sm font-medium text-primary hover:underline">
          View Details
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;