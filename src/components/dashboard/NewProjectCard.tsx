import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Copy, Trash2, FileText, Building, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewProjectCardProps {
  project: any;
  onView: (id: string) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDuplicate: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
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

  return { pending: items, progress, completedCount, totalItems };
};

const NewProjectCard = ({ project, onView, onEdit, onDuplicate, onDelete }: NewProjectCardProps) => {
  const statusInfo = getStatusInfo(project.compliance_status);
  const { pending, progress, completedCount, totalItems } = getPendingItems(project);

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 bg-slate-800/60 border-slate-400/30 backdrop-blur-md" onClick={() => onView(project.id)}>
      <div className={cn("h-2 w-full", statusInfo.color)} />
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg mb-1">{project.project_name}</CardTitle>
            <CardDescription>{project.location || 'No location specified'}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => onEdit(project.id, e)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onDuplicate(project.id, e)}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onDelete(project.id, e)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{project.selected_pathway || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>{project.building_type || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {statusInfo.text === 'In Progress' ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Compliance Checklist</span>
              <span>{completedCount}/{totalItems} Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            {pending.length > 0 && (
              <div className="flex items-start gap-2 pt-2 text-xs text-orange-500">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold">Pending:</span> {pending.slice(0, 2).join(', ')}
                  {pending.length > 2 && `, +${pending.length - 2} more`}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-2 bg-muted rounded-md">
            <Badge className={cn("text-sm", statusInfo.color)}>{statusInfo.text}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewProjectCard;