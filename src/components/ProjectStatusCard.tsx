import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Info, ChevronRight } from 'lucide-react';

interface ProjectStatusCardProps {
  project: any;
  onFixItem: (fieldId: string) => void;
}

const getPendingItems = (project: any) => {
  const required: { label: string; fieldId: string }[] = [];
  const optional: { label: string; fieldId: string }[] = [];

  const addIfMissing = (list: { label: string; fieldId: string }[], fieldId: keyof typeof project, label: string) => {
    const value = project[fieldId];
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      list.push({ label, fieldId: String(fieldId) });
    }
  };

  // Step 1 fields
  addIfMissing(required, 'street_address', 'Project Street Address');
  addIfMissing(required, 'city', 'Project City');
  addIfMissing(required, 'province', 'Project Province');
  addIfMissing(required, 'postal_code', 'Project Postal Code');
  addIfMissing(required, 'building_type', 'Building Type');
  if (project.province === 'alberta') {
    addIfMissing(required, 'climate_zone', 'Climate Zone');
  }

  // Step 2 fields
  addIfMissing(required, 'selected_pathway', 'Compliance Path');

  // Step 3 fields (simplified for summary)
  const pathway = project.selected_pathway;
  if (pathway === 'prescriptive' || pathway === '9362' || pathway === '9368') {
    addIfMissing(required, 'attic_rsi', 'Ceilings/Attic RSI');
    addIfMissing(required, 'wall_rsi', 'Above Grade Wall RSI');
    addIfMissing(required, 'below_grade_rsi', 'Below Grade Wall RSI');
    addIfMissing(required, 'window_u_value', 'Window U-Value');
    addIfMissing(required, 'airtightness_al', 'Airtightness Level');
    addIfMissing(required, 'heating_system_type', 'Heating Type');
    addIfMissing(required, 'water_heating_type', 'Water Heater Type');
  }

  // Step 4 fields
  if (!project.uploaded_files || project.uploaded_files.length === 0) {
    required.push({ label: 'At least one project document', fieldId: 'fileUploadSection' });
  }

  // Optional fields
  addIfMissing(optional, 'floor_area', 'Floor Area');
  addIfMissing(optional, 'mid_construction_blower_door_planned', 'Mid-Construction Blower Door Test');
  addIfMissing(optional, 'occupancy_class', 'Occupancy Class');

  const totalRequiredFields = 10; // An approximation for progress calculation
  const completedCount = totalRequiredFields - required.length;
  const progress = Math.max(0, (completedCount / totalRequiredFields) * 100);

  return { required, optional, progress };
};


const ProjectStatusCard = ({ project, onFixItem }: ProjectStatusCardProps) => {
  const { required, optional, progress } = getPendingItems(project);

  if (required.length === 0 && optional.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-slate-700/40 border-slate-400/50 backdrop-blur-[100px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          Project Status & Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-slate-300">Overall Progress</span>
            <span className="font-medium text-white">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {required.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Required Items Pending ({required.length})
            </h4>
            <p className="text-sm text-slate-300">The following items are required for a complete submission. Click an item to go to the calculator and fill it in.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {required.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onFixItem(item.fieldId)}
                  className="w-full text-left p-3 rounded-md bg-red-900/20 hover:bg-red-900/40 transition-colors flex items-center justify-between"
                >
                  <span className="text-red-300 text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-red-400 flex-shrink-0" />
                </button>
              ))}
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
              {optional.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onFixItem(item.fieldId)}
                  className="w-full text-left p-3 rounded-md bg-blue-900/20 hover:bg-blue-900/40 transition-colors flex items-center justify-between"
                >
                  <span className="text-blue-300 text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;