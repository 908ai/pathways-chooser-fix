import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUploadRequest: (file: File) => void;
  uploading: boolean;
  acceptedTypes?: string[];
  maxSizePerFile?: number; // in bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploadRequest,
  uploading,
  acceptedTypes = ['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
  maxSizePerFile = 10 * 1024 * 1024 // 10MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
        onFileUploadRequest(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      for (const file of Array.from(files)) {
        onFileUploadRequest(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-slate-400/50 rounded-lg p-8 text-center hover:border-slate-300/70 transition-colors bg-slate-900/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-slate-300">
            Drag and drop files here, or click to select
          </p>
          <Button
            type="button"
            variant="secondary"
            className="bg-slate-100 text-slate-900 hover:bg-slate-200"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </Button>
          <p className="text-xs text-slate-400">
            Maximum file size: {formatFileSize(maxSizePerFile)} • 
            Accepted types: {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedTypes.map(type => `.${type}`).join(',')}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileUpload;