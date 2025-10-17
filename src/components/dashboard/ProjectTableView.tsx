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
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Copy, Trash2, FileText, Zap, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      return { text: 'Compliant', color: 'bg-green-500 text-green-50' };
    case 'fail':
      return { text: 'Non-Compliant', color: 'bg-red-500 text-red-50' };
    case 'submitted':
      return { text: 'Submitted', color: 'bg-blue-500 text-blue-50' };
    case 'draft':
      return { text: 'Draft', color: 'bg-gray-500 text-gray-50' };
    default:
      return { text: 'In Progress', color: 'bg-orange-500 text-orange-50' };
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
        <TableRow className="border-b border-slate-400/50 hover:bg-transparent">
          <TableHead className="text-white">Project Name</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Pathway</TableHead>
          <TableHead className="text-white">Progress</TableHead>
          <TableHead className="text-white">Last Updated</TableHead>
          <TableHead className="text-right text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => {
          const statusInfo = getStatusInfo(project.compliance_status);
          const { pending, progress } = getPendingItems(project);
          return (
            <TableRow key={project.id} onClick={() => onViewProject(project.id)} className="cursor-pointer bg-slate-700/40 border-b border-slate-400/50 backdrop-blur-md hover:bg-slate-600/50">
              <TableCell>
                <div className="font-medium text-white">{project.project_name}</div>
                <div className="text-sm text-slate-300">{project.location}</div>
              </TableCell>
              <TableCell>
                <Badge className={cn(statusInfo.color)}>{statusInfo.text}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-white">
                  {project.selected_pathway === 'performance' ? <Zap className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4 text-orange-400" />}
                  <span className="capitalize">{project.selected_pathway}</span>
                </div>
              </TableCell>
              <TableCell>
                {statusInfo.text === 'In Progress' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-32">
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {pending.length > 0 ? (
                          <div className="p-2">
                            <p className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-400" /> Pending Items:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              {pending.map(item => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-xs p-2">All items complete!</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </TableCell>
              <TableCell className="text-slate-300">{new Date(project.updated_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={e => e.stopPropagation()}>
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
                    <DropdownMenuItem onClick={(e) => onDuplicateProject(project.id, e)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => onDeleteProject(project.id, e)} className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
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