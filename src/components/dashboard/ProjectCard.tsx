import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { getPendingItems } from '@/lib/projectUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectCardProps {
  project: any;
  status: string;
  handleViewProject: (projectId: string) => void;
  handleEditProject: (projectId: string, event: React.MouseEvent) => void;
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

const ProjectCard = ({ project, status, handleViewProject, handleEditProject }: ProjectCardProps) => {
  const selections = mapProjectToSelections(project);
  const { required, optional } = getPendingItems(selections, project.uploaded_files || []);
  const isComplete = status === 'complete';

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
              <Badge variant={project.selected_pathway === 'performance' ? 'default' : 'secondary'} className="text-xs">
                {project.selected_pathway === 'performance' ? 'Performance' : 'Prescriptive'}
              </Badge>
              <span className="text-xs text-slate-200 capitalize">
                {project.building_type?.replace('-', ' ') || project.type}
              </span>
            </div>
          </div>
          {!isComplete && <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
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
            {isComplete && <Badge variant="outline" className="text-xs">
              Duplicate Ready
            </Badge>}
          </div>
          
          {!isComplete && (
            <div className="mt-3 space-y-3">
              {required.length > 0 ? (
                <div className="p-3 bg-slate-800/60 border border-orange-400/50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-300" />
                    <span className="text-sm font-medium text-orange-300">
                      {required.length} Required Item(s) Pending
                    </span>
                  </div>
                  <div className="space-y-1">
                    {required.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-orange-200">
                        <div className="h-1.5 w-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                    {required.length > 2 && (
                      <div className="text-xs text-orange-300 font-medium mt-1">
                        +{required.length - 2} more...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-800/60 border border-green-400/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">All required items are complete!</span>
                  </div>
                </div>
              )}

              {optional.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-3 bg-slate-800/60 border border-blue-400/50 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-300" />
                        <span className="text-sm font-medium text-blue-300">
                          {optional.length} Recommended Item(s)
                        </span>
                      </div>
                      <div className="space-y-1">
                        {optional.slice(0, 1).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-blue-200">
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span className="truncate">{item.label}</span>
                          </div>
                        ))}
                        {optional.length > 1 && (
                          <div className="text-xs text-blue-300 font-medium mt-1">
                            +{optional.length - 1} more...
                          </div>
                        )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;