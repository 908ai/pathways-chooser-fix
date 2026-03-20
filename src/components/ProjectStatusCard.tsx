import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { getPendingItems, mapProjectToSelections } from '@/lib/projectUtils';

interface ProjectStatusCardProps {
  project: any;
  onFixItem: (fieldId: string) => void;
}

const ProjectStatusCard = ({ project, onFixItem }: ProjectStatusCardProps) => {
  const selections = mapProjectToSelections(project);
  const { required, optional } = getPendingItems(selections, project.uploaded_files || []);
  
  const isClickable = project.compliance_status === 'draft' || project.compliance_status === 'needs_revision' || project.compliance_status === null;

  if (required.length === 0 && optional.length === 0) {
    return null;
  }

  const renderItem = (item: { label: string; fieldId: string }, isRequired: boolean) => {
    const baseClasses = "w-full text-left p-3 rounded-md flex items-center justify-between";
    const requiredClasses = isClickable ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors" : "bg-red-50 dark:bg-red-900/30 cursor-not-allowed";
    const optionalClasses = isClickable ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors" : "bg-blue-50 dark:bg-blue-900/30 cursor-not-allowed";
    const textClass = isRequired ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300";
    const iconClass = isRequired ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400";

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
    <Card className="mb-6">
      <CardContent className="space-y-6 pt-6">
        {required.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Required Items Pending ({required.length})
            </h4>
            <p className="text-sm text-muted-foreground">
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
          <div className="space-y-3 pt-4 border-t">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
              <Info className="h-5 w-5" />
              Optional Items Pending ({optional.length})
            </h4>
            <p className="text-sm text-muted-foreground">These items are recommended for a more accurate review.</p>
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