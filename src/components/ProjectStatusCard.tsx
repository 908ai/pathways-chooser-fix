import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { getPendingItems } from '@/lib/projectUtils';

interface ProjectStatusCardProps {
  project: any;
  onFixItem: (fieldId: string) => void;
}

const mapProjectToSelections = (project: any) => {
  if (!project) return {};
  return {
    // Map all relevant snake_case fields from the DB to camelCase fields
    firstName: 'filled', // Assume filled as project exists
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
    inFloorHeatRSI: project.has_in_floor_heat, // Simplified mapping
    windowUValue: project.window_u_value,
    hasSkylights: project.has_skylights,
    skylightUValue: project.skylight_u_value,
    airtightness: project.airtightness_al,
    heatingType: project.heating_system_type,
    heatingEfficiency: project.heating_efficiency,
    coolingApplicable: project.cooling_system_type && project.cooling_system_type !== 'None' ? 'yes' : 'no',
    coolingEfficiency: project.cooling_efficiency,
    waterHeaterType: project.water_heating_type,
    waterHeater: project.water_heating_efficiency,
    hasDWHR: project.has_dwhr,
    midConstructionBlowerDoorPlanned: project.mid_construction_blower_door_planned,
  };
};

const ProjectStatusCard = ({ project, onFixItem }: ProjectStatusCardProps) => {
  const selections = mapProjectToSelections(project);
  const { required, optional } = getPendingItems(selections, project.uploaded_files || []);
  
  const isClickable = project.compliance_status === 'draft' || project.compliance_status === 'needs_revision' || project.compliance_status === null;

  if (required.length === 0 && optional.length === 0) {
    return null;
  }

  const renderItem = (item: { label: string; fieldId: string }, isRequired: boolean) => {
    const baseClasses = "w-full text-left p-3 rounded-md flex items-center justify-between";
    const requiredClasses = isClickable ? "bg-red-900/20 hover:bg-red-900/40 transition-colors" : "bg-red-900/20 cursor-not-allowed";
    const optionalClasses = isClickable ? "bg-blue-900/20 hover:bg-blue-900/40 transition-colors" : "bg-blue-900/20 cursor-not-allowed";
    const textClass = isRequired ? "text-red-300" : "text-blue-300";
    const iconClass = isRequired ? "text-red-400" : "text-blue-400";

    if (isClickable) {
      return (
        <button
          key={item.fieldId}
          onClick={() => onFixItem(item.fieldId)}
          className={`${baseClasses} ${isRequired ? requiredClasses : optionalClasses}`}
        >
          <span className={`${textClass} text-sm font-medium`}>{item.label}</span>
          <ChevronRight className={`h-4 w-4 ${iconClass} flex-shrink-0`} />
        </button>
      );
    }

    return (
      <div
        key={item.fieldId}
        className={`${baseClasses} ${isRequired ? requiredClasses : optionalClasses}`}
      >
        <span className={`${textClass} text-sm font-medium`}>{item.label}</span>
      </div>
    );
  };

  return (
    <Card className="mb-6 bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
      <CardContent className="space-y-6 pt-6">
        {required.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Required Items Pending ({required.length})
            </h4>
            <p className="text-sm text-slate-300">
              {isClickable 
                ? "The following items are required for a complete submission. Click an item to go to the calculator and fill it in."
                : "The following items are required but cannot be edited while the project is under review."
              }
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {required.map((item) => renderItem(item, true))}
            </div>
          </div>
        )}

        {optional.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-400">
              <Info className="h-5 w-5" />
              Optional Items Pending ({optional.length})
            </h4>
            <p className="text-sm text-slate-300">These items are recommended for a more accurate review.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {optional.map((item) => renderItem(item, false))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;