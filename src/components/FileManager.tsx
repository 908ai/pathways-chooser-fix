import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  Archive, 
  File,
  Upload 
} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useAuth } from '@/hooks/useAuth';

interface FileItem {
  name: string;
  url: string;
  size: number;
  type?: string;
  path?: string;
}

interface FileManagerProps {
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  projectId: string | null;
  readOnly?: boolean;
  showUpload?: boolean;
}

const FileManager: React.FC<FileManagerProps> = ({
  files = [],
  onFilesChange,
  projectId,
  readOnly = false,
  showUpload = true
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive className="h-4 w-4 text-yellow-500" />;
    }
    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return <FileText className="h-4 w-4 text-green-600" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileCategory = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'Image';
    }
    if (['pdf'].includes(extension || '')) {
      return 'PDF Document';
    }
    if (['doc', 'docx'].includes(extension || '')) {
      return 'Word Document';
    }
    if (['xls', 'xlsx'].includes(extension || '')) {
      return 'Excel Spreadsheet';
    }
    if (['csv'].includes(extension || '')) {
      return 'CSV File';
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return 'Archive';
    }
    if (['txt'].includes(extension || '')) {
      return 'Text File';
    }
    return 'Document';
  };

  const handleFileUploadRequest = async (file: File) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to upload files.", variant: "destructive" });
      return;
    }
    if (!projectId) {
      toast({ title: "Project Error", description: "A project must be created before uploading files.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${user.id}/${projectId}/${timestamp}-${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from("project-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("project-files")
        .getPublicUrl(filePath);

      const newFile: FileItem = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: data.path,
      };

      const updatedFiles = [...files, newFile];
      onFilesChange(updatedFiles);

      toast({ title: "File Uploaded", description: `${file.name} has been uploaded successfully.` });

    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDownload = async (file: FileItem) => {
    try {
      if (file.url) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: error.message || 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const handleFileDelete = async (fileToDelete: FileItem) => {
    try {
      setDeletingFiles(prev => new Set([...prev, fileToDelete.name]));

      if (fileToDelete.path) {
        const { error } = await supabase.storage
          .from('project-files')
          .remove([fileToDelete.path]);

        if (error) {
          throw error;
        }
      }

      const updatedFiles = files.filter(f => f.name !== fileToDelete.name);
      onFilesChange(updatedFiles);

      toast({
        title: 'File deleted',
        description: `${fileToDelete.name} has been removed.`,
      });

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileToDelete.name);
        return newSet;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Project Documents
          {files.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({files.length} file{files.length !== 1 ? 's' : ''})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && showUpload && (
          <div className="space-y-2">
            <FileUpload
              onFileUploadRequest={handleFileUploadRequest}
              uploading={uploading}
              maxSizePerFile={10 * 1024 * 1024} // 10MB
            />
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            {!readOnly && showUpload && (
              <p className="text-sm">Upload files using the area above</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getFileCategory(file.name)}</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileDownload(file)}
                    title="Download file"
                  >
                    <Download className="h-3 w-3" />
                  </Button>

                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileDelete(file)}
                      disabled={deletingFiles.has(file.name)}
                      title="Delete file"
                    >
                      {deletingFiles.has(file.name) ? (
                        <div className="h-3 w-3 animate-spin border border-current border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Total size: {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileManager;