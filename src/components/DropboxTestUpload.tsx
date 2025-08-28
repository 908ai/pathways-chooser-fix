import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload, File, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface DropboxTestUploadProps {
  testProject: any;
  onUploadComplete: () => void;
}

interface FileUploadStatus {
  file: File;
  supabaseProgress: number;
  supabaseComplete: boolean;
  dropboxComplete: boolean;
  error?: string;
}

export default function DropboxTestUpload({ testProject, onUploadComplete }: DropboxTestUploadProps) {
  const { user } = useAuth();
  const [uploadStatuses, setUploadStatuses] = useState<FileUploadStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileRequests, setFileRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testProject) {
      fetchFileRequests();
    }
  }, [testProject]);

  const fetchFileRequests = async () => {
    if (!testProject) return;

    try {
      const { data, error } = await supabase
        .from('file_requests')
        .select('*')
        .eq('project_id', testProject.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFileRequests(data || []);
    } catch (error) {
      console.error('Error fetching file requests:', error);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    const newStatuses: FileUploadStatus[] = fileArray.map(file => ({
      file,
      supabaseProgress: 0,
      supabaseComplete: false,
      dropboxComplete: false
    }));
    
    setUploadStatuses(newStatuses);
    uploadFiles(fileArray);
  };

  const uploadFiles = async (files: File[]) => {
    if (!user || !testProject) {
      toast.error('Please create a test project first');
      return;
    }

    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await uploadSingleFile(file, i);
    }

    setLoading(false);
    onUploadComplete();
    toast.success('File upload testing completed!');
  };

  const uploadSingleFile = async (file: File, index: number) => {
    try {
      // Update progress - starting upload
      setUploadStatuses(prev => 
        prev.map((status, i) => 
          i === index ? { ...status, supabaseProgress: 10 } : status
        )
      );

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${testProject.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update progress - Supabase complete
      setUploadStatuses(prev => 
        prev.map((status, i) => 
          i === index ? { ...status, supabaseProgress: 100, supabaseComplete: true } : status
        )
      );

      // Get file URL
      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      // Update project with uploaded file info
      const { data: currentProject } = await supabase
        .from('project_summaries')
        .select('uploaded_files')
        .eq('id', testProject.id)
        .single();

      const existingFiles = Array.isArray(currentProject?.uploaded_files) ? currentProject.uploaded_files : [];
      const newFile = {
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        path: fileName
      };

      await supabase
        .from('project_summaries')
        .update({
          uploaded_files: [...existingFiles, newFile]
        })
        .eq('id', testProject.id);

      // Mark as complete
      setUploadStatuses(prev => 
        prev.map((status, i) => 
          i === index ? { ...status, dropboxComplete: true } : status
        )
      );

      toast.success(`${file.name} uploaded successfully to Supabase storage`);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatuses(prev => 
        prev.map((status, i) => 
          i === index ? { ...status, error: error.message } : status
        )
      );
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const triggerDropboxCreation = async () => {
    if (!user || !testProject) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-dropbox-folder', {
        body: {
          project_id: testProject.id,
          project_name: testProject.project_name,
          user_id: user.id
        }
      });

      if (error) throw error;

      toast.success('Dropbox folder creation triggered!');
      setTimeout(fetchFileRequests, 2000);
    } catch (error: any) {
      console.error('Error triggering Dropbox creation:', error);
      toast.error('Failed to create Dropbox folder: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!testProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Upload Testing</CardTitle>
          <CardDescription>Create a test project first to enable file uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please create a test project using the controls above to test file uploads.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropbox Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Dropbox Integration Status</CardTitle>
          <CardDescription>Project: {testProject.project_name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">File Request Links</p>
              <p className="text-sm text-muted-foreground">
                {fileRequests.length} active folder(s) with upload links
              </p>
            </div>
            <Button 
              onClick={triggerDropboxCreation} 
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Dropbox Folders
            </Button>
          </div>

          {fileRequests.length > 0 && (
            <div className="space-y-2">
              {fileRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.folder_name}</p>
                    <p className="text-sm text-muted-foreground">{request.folder_path}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">Active</Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(request.file_request_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload Testing</CardTitle>
          <CardDescription>Upload files to test both Supabase storage and Dropbox integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Drop files here or click to select</h3>
            <p className="text-muted-foreground mb-4">
              Upload files to test the integration workflow
            </p>
            <Input
              type="file"
              multiple
              className="max-w-xs mx-auto"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              disabled={loading}
            />
          </div>

          {/* Upload Progress */}
          {uploadStatuses.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Upload Progress</h4>
              {uploadStatuses.map((status, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="font-medium">{status.file.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({(status.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {status.supabaseComplete && (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Supabase
                        </Badge>
                      )}
                      {status.dropboxComplete && (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                      {status.error && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!status.supabaseComplete && !status.error && (
                    <Progress value={status.supabaseProgress} className="mb-2" />
                  )}
                  
                  {status.error && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{status.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure test project is created (should trigger automatic Dropbox folder creation)</li>
            <li>Check if file request links appear above (may take a few seconds)</li>
            <li>Upload test files using the drag-and-drop area</li>
            <li>Monitor upload progress to Supabase storage</li>
            <li>Test Dropbox file request links by clicking "Open" buttons</li>
            <li>Upload files through Dropbox links to complete the workflow test</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}