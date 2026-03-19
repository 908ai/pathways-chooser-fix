import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  uploadedFiles: (File & { url?: string; path?: string; category?: string })[];
  onFileUploadRequest: (file: File, category?: string) => void;
  isUploading: boolean;
  removeFile: (file: any) => void;
  validationErrors?: Record<string, boolean>;
  compliancePath?: string;
};

const FileUploadSection = ({
  uploadedFiles,
  onFileUploadRequest,
  isUploading,
  removeFile,
  validationErrors,
  compliancePath,
}: Props) => {
  const categories = compliancePath === '9365' || compliancePath === '9367'
    ? [
        { id: 'building_plans', label: 'Building Plans', required: true, info: 'Mandatory upload for building plans.' },
        { id: 'other_docs', label: 'Other Supporting Documents', required: false, info: 'Optional: Envelope Performance/RSI Calculations, CSA F-280 Heat Loss/Gain Calculations, etc.' }
      ]
    : [
        { id: 'building_plans', label: 'Building Plans', required: true, info: 'Mandatory upload for building plans.' },
        { id: 'window_schedule', label: 'Window and Door Schedule / Supplier Quote', required: true, info: 'Must include performance specifications for each unit e.g., "All Weather, Plygem, etc."' },
        { id: 'other_docs', label: 'Other Supporting Documents', required: false, info: 'Optional: Envelope Performance/RSI Calculations, CSA F-280 Heat Loss/Gain Calculations, etc.' }
      ];

  return (
    <div id="fileUploadSection" className="space-y-6">
      {categories.map((category) => {
        const categoryFiles = uploadedFiles.filter(f => f.category === category.id);
        const isMissing = category.required && categoryFiles.length === 0 && validationErrors?.[category.id];

        return (
          <div key={category.id} className={cn("space-y-3 p-4 border rounded-lg", isMissing ? "border-red-500 bg-red-50" : "border-border")}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                {category.id === 'window_schedule' 
                  ? 'Upload window/door schedule from your supplier e.g., "All Weather, Plygem, etc."' 
                  : category.label} {category.required && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                {category.info}
              </p>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    if (!e.target.files) return;
                    for (const file of Array.from(e.target.files)) {
                      await onFileUploadRequest(file, category.id);
                    }
                  }}
                  disabled={isUploading}
                  className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {/* <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
              </p> */}
            </div>
            
            {categoryFiles.length > 0 && (
              <div className="space-y-1 mt-2">
                {categoryFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background border border-border rounded-md">
                    <span className="text-sm truncate text-foreground max-w-[200px]">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file)} className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600 dark:hover:text-red-400">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {isMissing && <p className="text-xs text-red-600 font-medium">This document is required.</p>}
          </div>
        );
      })}
    </div>
  );
};

export default FileUploadSection;