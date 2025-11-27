import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Copy, Trash2, FileText, Zap, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPathwayName } from '@/lib/projectUtils';

interface ProjectTableViewProps {
  projects: any[];
  onViewProject: (id: string) => void;
  onEditProject: (id: string, e: React.MouseEvent) => void;
  onDuplicateProject: (id: string, e: React.MouseEvent) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', color: 'bg-green-100 text-green-800' };
    case 'fail':
      return { text: 'Non-Compliant', color: 'bg-red-100 text-red-800' };
    case 'submitted':
      return { text: 'Submitted', color: 'bg-blue-100 text-blue-800' };
    case 'draft':
      return { text: 'Draft', color: 'bg-gray-100 text-gray-800' };
    case 'needs_revision':
      return { text: 'Needs Revision', color: 'bg-yellow-100 text-yellow-800' };
    default:
      return { text: 'In Progress', color: 'bg-orange-100 text-orange-800' };
  }
};

const getPendingItems = (project: any) => {
  const items = [];
  const totalItems = 6;

  if (!project.uploaded_files || project.uploaded_files.length === 0) {
    items.push("Building plans");
  }
  if (!project.uploaded_files?.some((f: any) => f.name?.toLowerCase().includes('window') || f.name?.toLowerCase().includes('door'))) {
    items.push("Window/door schedule");
  }
  if (!project.heating_system_type) items.push("Heating system details");
  if (project.cooling_system_type && !project.cooling_efficiency) items.push("Cooling system details");
  if (!project.water_heating_type) items.push("Water heater details");
  if (!project.floor_area) items.push("Floor area");

  const completedCount = totalItems - items.length;
  const progress = (completedCount / totalItems) * 100;

  return { pending: items, progress };
};

const ProjectTableView = ({ projects, onViewProject, onEditProject, onDuplicateProject, onDeleteProject }: ProjectTableViewProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent">
          <TableHead>Project Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pathway</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => {
          const statusInfo = getStatusInfo(project.compliance_status);
          const isPerformance = project.selected_pathway === '9365' || project.selected_pathway === '9367' || project.selected_pathway === 'performance';
          return (
            <TableRow key={project.id} onClick={() => onViewProject(project.id)} className="cursor-pointer border-b hover:bg-accent dark:hover:bg-muted">
              <TableCell>
                <div className="font-medium">{project.project_name}</div>
                <div className="text-sm text-muted-foreground">{project.location}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(statusInfo.color)}>{statusInfo.text}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {isPerformance ? <Zap className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-orange-500" />}
                  <span>{formatPathwayName(project.selected_pathway)}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{new Date(project.updated_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewProject(project.id); }}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => onEditProject(project.id, e)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={(e) => onDuplicateProject(project.id, e)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => onDeleteProject(project.id, e)} className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProjectTableView;