import { Edit } from "lucide-react";

interface EditModeIndicatorProps {
  projectName?: string | null;
}

export default function EditModeIndicator({ projectName }: EditModeIndicatorProps) {
  return (
    <div className="mb-6 p-4 bg-yellow-400/10 backdrop-blur-sm border-l-4 border-yellow-400 rounded-r-lg relative z-10">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Edit className="h-6 w-6 text-yellow-300" />
        </div>
        <div>
          <div className="font-semibold text-lg text-white">
            Editing: <span className="font-bold">{projectName || 'Project'}</span>
          </div>
          <p className="text-sm text-yellow-200">
            Make your changes below and proceed to the final step to save and update the project.
          </p>
        </div>
      </div>
    </div>
  );
}