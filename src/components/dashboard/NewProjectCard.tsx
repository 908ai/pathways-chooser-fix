import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Copy, Trash2, FileText, Building, Calendar, AlertTriangle, MapPin } from 'lucide-react';
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
      return { text: 'Compliant', color: 'bg-green-500' };
    case 'fail':
      return { text: 'Non-Compliant', color: 'bg-red-500' };
    case 'submitted':
      return { text: 'Submitted', color: 'bg-blue-500' };
    default:
      return { text: 'In Progress', color: 'bg-orange-500' };
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

  const formatBuildingType = (type: string | null) => {
    if (!type) return 'N/A';
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPathway = (pathway: string | null) => {
      if (!pathway) return 'N/A';
      return pathway.charAt(0).toUpperCase() + pathway.slice(1);
  }

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 rounded-lg border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 cursor-pointer" onClick={() => onView(project.id)}>
      <div className={cn("h-2 w-full", statusInfo.color)} />
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1">{project.project_name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{project.location || 'No location specified'}</span>
            </CardDescription>
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
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <strong className="truncate">{formatPathway(project.selected_pathway)}</strong>
            <span className="text-muted-foreground mx-1">|</span>
            <Building className="h-4 w-4 flex-shrink-0" />
            <strong className="truncate">{formatBuildingType(project.building_type)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Updated: <strong>{new Date(project.updated_at).toLocaleDateString()}</strong></span>
          </div>
        </div>
        
        {statusInfo.text === 'In Progress' && (
          <div className="space-y-2 pt-2 border-t border-border/50">
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
        )}
      </CardContent>
    </Card>
  );
};

export default NewProjectCard;