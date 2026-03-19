import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { cn } from "@/lib/utils";

type Props = {
  uploadedFiles: (File & { url?: string; path?: string; category?: string })[];
  onFileUploadRequest: (file: File, category?: string) => void;
  isUploading: boolean;
  removeFile: (file: any) => void;
  validationErrors?: Record<string, boolean>;
};

const FileUploadSection = ({
  uploadedFiles,
  onFileUploadRequest,
  isUploading,
  removeFile,
  validationErrors,
}: Props) => {
  const categories = [
    { id: 'building_plans', label: 'Building Plans', required: true, info: 'Mandatory upload for building plans.' },
    { id: 'window_schedule', label: 'Window and Door Schedule / Supplier Quote', required: true, info: 'Must include performance specifications for each unit.' },
    { id: 'other_docs', label: 'Other Supporting Documents', required: false, info: 'Optional: Envelope Performance/RSI Calculations, CSA F-280 Heat Loss/Gain Calculations, etc.' }
  ];

  return (
    <div id="fileUploadSection" className="space-y-6">
      {categories.map((category) => {
        const categoryFiles = uploadedFiles.filter(f => f.category === category.id || (!f.category && category.id === 'other_docs' && uploadedFiles.length > 0 && !uploadedFiles.some(uf => uf.category)));
        const isMissing = category.required && categoryFiles.length === 0 && validationErrors?.[category.id];

        return (
          <div key={category.id} className={cn("space-y-2 p-4 border rounded-lg", isMissing ? "border-red-500 bg-red-50" : "border-border")}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                {category.label} {category.required && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-muted-foreground">{category.info}</p>
            </div>
            
            <div className="space-y-3">
              <FileUpload
                onFileUploadRequest={(file) => onFileUploadRequest(file, category.id)}
                uploading={isUploading}
                acceptedTypes={['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
                maxSizePerFile={10 * 1024 * 1024}
              />
              
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
          </div>
        );
      })}
    </div>
  );
};

export default FileUploadSection;