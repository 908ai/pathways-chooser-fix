import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal, Edit, Copy, Trash2, Building, Calendar, AlertTriangle, MapPin, Eye, Info, CheckCircle, Zap, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getPendingItems, formatPathwayName } from '@/lib/projectUtils';

interface NewProjectCardProps {
  project: any;
  onView: (id: string) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDuplicate: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const mapProjectToSelections = (project: any) => {
  if (!project) return {};
  return {
    firstName: 'filled',
    lastName: 'filled',
    company: 'filled',
    phoneNumber: 'filled',
    streetAddress: project.street_address,
    city: project.city,
    province: project.province,
    postalCode: project.postal_code,
    buildingType: project.building_type,
    climateZone: project.climate_zone,
    occupancyClass: project.occupancy_class,
    compliancePath: project.selected_pathway,
    frontDoorOrientation: project.front_door_orientation,
    energuidePathway: project.energuide_pathway,
    hasHrv: project.hrv_erv_type && project.hrv_erv_type !== 'None' ? 'with_hrv' : project.hrv_erv_type === 'None' ? 'without_hrv' : '',
    hrvEfficiency: project.hrv_erv_efficiency,
    ceilingsAtticRSI: project.attic_rsi,
    hasCathedralOrFlatRoof: project.has_cathedral_or_flat_roof,
    cathedralFlatRSIValue: project.cathedral_flat_rsi,
    wallRSI: project.wall_rsi,
    belowGradeRSI: project.below_grade_rsi,
    floorsSlabsSelected: project.floors_slabs_selected || [],
    inFloorHeatRSI: project.in_floor_heat_rsi,
    windowUValue: project.window_u_value,
    hasSkylights: project.has_skylights,
    skylightUValue: project.skylight_u_value,
    airtightness: project.airtightness_al,
    heatingType: project.heating_system_type,
    heatingEfficiency: project.heating_efficiency,
    indirectTank: project.indirect_tank,
    indirectTankSize: project.indirect_tank_size,
    coolingApplicable: project.cooling_system_type && project.cooling_system_type !== 'None' ? 'yes' : 'no',
    coolingEfficiency: project.cooling_efficiency,
    waterHeaterType: project.water_heating_type,
    waterHeater: project.water_heating_efficiency,
    hasDWHR: project.has_dwhr,
    midConstructionBlowerDoorPlanned: project.mid_construction_blower_door_planned,
  };
};

const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', color: 'bg-green-500' };
    case 'fail':
      return { text: 'Non-Compliant', color: 'bg-red-500' };
    case 'submitted':
      return { text: 'Submitted', color: 'bg-blue-500' };
    case 'draft':
      return { text: 'Draft', color: 'bg-gray-500' };
    case 'needs_revision':
      return { text: 'Needs Revision', color: 'bg-yellow-500' };
    default:
      return { text: 'Draft', color: 'bg-gray-500' }; // Default to Draft if null/undefined
  }
};

const NewProjectCard = ({ project, onView, onEdit, onDuplicate, onDelete }: NewProjectCardProps) => {
  const statusInfo = getStatusInfo(project.compliance_status);
  const selections = mapProjectToSelections(project);
  const { required, optional } = getPendingItems(selections, project.uploaded_files || []);
  const isComplete = statusInfo.text === 'Compliant' || statusInfo.text === 'Non-Compliant';
  const isPerformance = project.selected_pathway?.includes('performance') || project.selected_pathway === '9365' || project.selected_pathway === '9367';

  const formatBuildingType = (type: string | null) => {
    if (!type) return 'N/A';
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full overflow-hidden relative transition-all hover:shadow-lg hover:-translate-y-1 rounded-lg border-b bg-background cursor-pointer" onClick={() => onView(project.id)}>
      <div className={cn("h-2 w-full", statusInfo.color)} />
      
      <Badge className={cn(
        "absolute top-0 right-0 px-2 py-1 text-xs font-semibold shadow-md rounded-none rounded-bl-[15px] flex items-center gap-1.5",
        isPerformance
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
          : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      )}>
        {isPerformance ? <Zap className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
        {formatPathwayName(project.selected_pathway)}
      </Badge>

      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1">{project.project_name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs">
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(project.id); }}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onEdit(project.id, e)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={(e) => onDuplicate(project.id, e)}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onDelete(project.id, e)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 flex-shrink-0" />
            <strong className="truncate">{formatBuildingType(project.building_type)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Updated: <strong>{new Date(project.updated_at).toLocaleDateString()}</strong></span>
          </div>
        </div>
        
        {!isComplete && (
          <div className="pt-2 border-t border-border/50 space-y-2">
            {required.length > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-start gap-2 text-xs text-orange-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-orange-500" />
                      <p>
                        <span className="font-semibold">Required ({required.length}):</span> {required[0].label}
                        {required.length > 1 && `, +${required.length - 1} more`}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <p className="font-semibold mb-2">All Required Items:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {required.map(item => <li key={item.fieldId}>{item.label}</li>)}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">All required items complete!</span>
                </div>
              </div>
            )}

            {optional.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2 text-xs text-blue-700">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                      <p>
                        <span className="font-semibold">Recommended ({optional.length}):</span> {optional[0].label}
                        {optional.length > 1 && `, +${optional.length - 1} more`}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <p className="font-semibold mb-2">Recommended Items:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      {optional.slice(0, 5).map(item => <li key={item.fieldId}>{item.label}</li>)}
                      {optional.length > 5 && (
                        <li className="font-medium text-muted-foreground">...and {optional.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewProjectCard;