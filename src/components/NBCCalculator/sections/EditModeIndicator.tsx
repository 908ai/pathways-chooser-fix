import { Edit } from "lucide-react";

export default function EditModeIndicator() {
  return (
    <>
      {
        <div className="mb-4 p-4 bg-gradient-to-r from-slate-600/20 to-teal-600/20 backdrop-blur-md border border-slate-400/50 rounded-xl relative z-10">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-slate-300" />
                  <div>
                    <div className="font-medium text-slate-100">Editing Project</div>
                    <div className="text-sm text-slate-200">Make your changes and resubmit to update the project.</div>
                  </div>
                </div>
              </div>
        }
    </>
  );
}
