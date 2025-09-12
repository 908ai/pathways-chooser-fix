import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  status: string;
  handleViewProject: (projectId: string) => void;
  handleEditProject: (projectId: string, event: React.MouseEvent) => void;
}

const getPendingItems = (project: any) => {
  const pendingItems: string[] = [];
  if (!project.uploaded_files || (Array.isArray(project.uploaded_files) && project.uploaded_files.length === 0)) {
    pendingItems.push("Building plans upload");
  }
  if (project.uploaded_files && Array.isArray(project.uploaded_files)) {
    const hasWindowFiles = project.uploaded_files.some((file: any) => file.name?.toLowerCase().includes('window') || file.name?.toLowerCase().includes('door'));
    if (!hasWindowFiles) {
      pendingItems.push("Window/door schedule");
    }
  }
  if (!project.heating_system_type || project.heating_system_type === '') {
    pendingItems.push("Heating system details");
  }
  if (project.cooling_efficiency === null || project.cooling_efficiency === 0) {
    pendingItems.push("Cooling system details");
  }
  if (!project.water_heating_type || project.water_heating_type === '') {
    pendingItems.push("Water heater details");
  }
  if (project.hrv_erv_type && project.hrv_erv_type !== 'None' && project.hrv_erv_efficiency === 0) {
    pendingItems.push("HRV/ERV specifications");
  }
  if (!project.floor_area || project.floor_area === 0) {
    pendingItems.push("Floor area calculation");
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
    <Card className="hover:shadow-md transition-shadow cursor-pointer hover-scale bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl" onClick={() => handleViewProject(project.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight mb-1 text-white">
              {clientName}
            </CardTitle>
            {location && <div className="text-sm text-slate-200 mb-2 leading-relaxed">
              📍 {location}
            </div>}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={status === 'complete' ? 'default' : 'secondary'} className="text-xs">
                {project.selected_pathway === 'performance' ? 'Performance' : 'Prescriptive'}
              </Badge>
              <span className="text-xs text-slate-200 capitalize">
                {project.building_type?.replace('-', ' ') || project.type}
              </span>
            </div>
          </div>
          {status === 'inProgress' && <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
            <Button variant="outline" size="sm" onClick={e => handleEditProject(project.id, e)} className="h-8 px-3 text-xs" type="button">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-200">
              Last updated: {new Date(project.updated_at || project.date).toLocaleDateString()}
            </p>
            {status === 'complete' && <Badge variant="outline" className="text-xs">
              Duplicate Ready
            </Badge>}
          </div>
          {status === 'inProgress' && pendingItems.length > 0 && <div className="mt-3 p-3 bg-slate-800/60 border border-orange-400 rounded-md backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-white animate-bounce" />
              <span className="text-sm font-medium text-orange-300">
                {pendingItems.length} item(s) pending
              </span>
            </div>
            <div className="space-y-1">
              {pendingItems.slice(0, 3).map((item, index) => <div key={index} className="flex items-center gap-2 text-xs text-orange-200">
                <div className="h-1 w-1 bg-orange-400 rounded-full"></div>
                {item}
              </div>)}
              {pendingItems.length > 3 && <div className="text-xs text-orange-300 font-medium">
                +{pendingItems.length - 3} more items
              </div>}
            </div>
          </div>}
          {status === 'inProgress' && pendingItems.length === 0 && <div className="mt-3 p-2 bg-slate-800/60 border border-green-400 rounded-md backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">All items completed</span>
            </div>
          </div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;