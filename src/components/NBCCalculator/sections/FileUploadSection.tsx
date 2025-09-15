import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FileUpload from "@/components/FileUpload";

type Props = {
  uploadedFiles: (File & { url?: string; path?: string })[];
  onFileUploadRequest: (file: File) => void;
  isUploading: boolean;
  removeFile: (file: any) => void;
};

const FileUploadSection = ({
  uploadedFiles,
  onFileUploadRequest,
  isUploading,
  removeFile,
}: Props) => {
  return (
    <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-600/50 rounded-lg">
      <label className="text-sm font-medium text-white">Building Plans & Documents</label>
      <div className="space-y-2">
        <FileUpload
          onFileUploadRequest={onFileUploadRequest}
          uploading={isUploading}
          acceptedTypes={['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
          maxSizePerFile={10 * 1024 * 1024}
        />
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{uploadedFiles.length} file(s) uploaded successfully</span>
            </div>
            <div className="space-y-1">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-emerald-900/50 border border-emerald-500/30 rounded-md backdrop-blur-sm">
                  <span className="text-sm truncate text-emerald-200">{file.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file)} className="h-6 w-6 p-0 text-emerald-300 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;