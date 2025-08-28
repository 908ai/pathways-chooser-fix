import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileText, Image, Archive } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: { name: string; url: string; size: number; type: string }) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizePerFile?: number; // in bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  maxFiles = 5,
  acceptedTypes = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'txt', 'csv'],
  maxSizePerFile = 10 * 1024 * 1024 // 10MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    if (['zip', 'rar', '7z'].includes(extension || '')) {
      return <Archive className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    console.log('DEBUG: FileUpload - Starting file validation');
    console.log('DEBUG: FileUpload - File name:', file.name);
    console.log('DEBUG: FileUpload - File size:', file.size);
    console.log('DEBUG: FileUpload - Max size allowed:', maxSizePerFile);
    console.log('DEBUG: FileUpload - Accepted types:', acceptedTypes);
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    console.log('DEBUG: FileUpload - Extracted extension:', extension);
    
    if (!extension || !acceptedTypes.includes(extension)) {
      const errorMsg = `File type .${extension} is not allowed. Accepted types: ${acceptedTypes.join(', ')}`;
      console.log('DEBUG: FileUpload - Validation FAILED - Invalid file type:', errorMsg);
      return errorMsg;
    }
    
    if (file.size > maxSizePerFile) {
      const errorMsg = `File size ${formatFileSize(file.size)} exceeds the maximum limit of ${formatFileSize(maxSizePerFile)}`;
      console.log('DEBUG: FileUpload - Validation FAILED - File too large:', errorMsg);
      return errorMsg;
    }
    
    console.log('DEBUG: FileUpload - Validation PASSED - File is valid');
    return null;
  };

  const uploadFile = async (file: File) => {
    console.log('DEBUG: uploadFile() called with file:', file);
    console.log('DEBUG: Upload function - Setting upload state to true');
    
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);
      console.log('DEBUG: Upload state initialized - uploading: true, error: null, progress: 0');

      console.log('DEBUG: Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);

      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Fix #4: Backend Storage Check - Enhanced authentication and session validation
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('DEBUG: Auth error details:', JSON.stringify(authError, null, 2));
        throw new Error(`Authentication failed: ${authError.message}. Please sign in again.`);
      }
      if (!user) {
        console.error('DEBUG: No user found in session');
        throw new Error('You must be logged in to upload files');
      }

      console.log('DEBUG: User authenticated successfully:', user.id);

      // Fix #4: Backend Storage Check - Verify storage bucket accessibility
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        console.log('DEBUG: Available buckets:', buckets?.map(b => b.name));
        if (bucketError) {
          console.error('DEBUG: Bucket list error:', bucketError);
        }
      } catch (bucketCheckError) {
        console.error('DEBUG: Bucket check failed:', bucketCheckError);
      }

      // Create unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`;

      console.log('DEBUG: Generated file path:', fileName);
      console.log('DEBUG: File size:', file.size, 'bytes');
      console.log('DEBUG: File type:', file.type);
      console.log('DEBUG: Attempting upload to project-files bucket...');

      // Fix #4: Enhanced upload with better error handling
      console.log('DEBUG: Making API call to supabase.storage.upload()');
      console.log('DEBUG: API Call Parameters:', {
        bucket: 'project-files',
        fileName: fileName,
        fileSize: file.size,
        fileType: file.type,
        cacheControl: '3600',
        upsert: false
      });
      
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('DEBUG: Upload API call completed');
      console.log('DEBUG: Upload response data:', data);
      console.log('DEBUG: Upload response error:', error);
      console.log('DEBUG: Upload response data type:', typeof data);
      console.log('DEBUG: Upload response error type:', typeof error);

      if (error) {
        console.error('DEBUG: Upload error details:', JSON.stringify(error, null, 2));
        console.error('DEBUG: Error message:', error.message);
        
        // Provide more specific error messages
        if (error.message?.includes('File size')) {
          throw new Error(`File size too large: ${formatFileSize(file.size)}. Maximum allowed: ${formatFileSize(maxSizePerFile)}`);
        } else if (error.message?.includes('policy')) {
          throw new Error('Storage permission denied. Please check your authentication.');
        } else if (error.message?.includes('bucket')) {
          throw new Error('Storage bucket not accessible. Please contact support.');
        } else {
          throw new Error(`Upload failed: ${error.message || 'Unknown storage error'}`);
        }
      }

      if (!data) {
        console.error('DEBUG: No data returned from upload');
        throw new Error('Upload failed - no data returned from storage');
      }

      // Get public URL (for signed URL generation if needed)
      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      console.log('DEBUG: Public URL generated:', urlData);

      setUploadProgress(100);

      const uploadedFile = {
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        path: data.path // Use data.path from the upload response
      };

      console.log('DEBUG: Upload completed successfully:', uploadedFile);
      console.log('DEBUG: Calling onFileUploaded with:', uploadedFile);

      // Ensure callback is called with proper file data
      onFileUploaded(uploadedFile);

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been uploaded.`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Upload error details:', JSON.stringify(error, null, 2));
      setError(error.message || 'Failed to upload file');
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('DEBUG: FileUpload - File select event triggered');
    console.log('DEBUG: FileUpload - Event target:', event.target);
    const files = event.target.files;
    console.log('DEBUG: FileUpload - Selected files count:', files?.length || 0);
    console.log('DEBUG: FileUpload - Selected files array:', files);
    
    if (!files || files.length === 0) {
      console.log('DEBUG: FileUpload - No files selected, returning early');
      return;
    }

    const file = files[0]; // Handle one file at a time for now
    console.log('DEBUG: FileUpload - Processing file details:');
    console.log('  - Name:', file.name);
    console.log('  - Size:', file.size, 'bytes');
    console.log('  - Type:', file.type);
    console.log('  - Last Modified:', new Date(file.lastModified));
    
    uploadFile(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      console.log('DEBUG: FileUpload - Input field reset');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log('DEBUG: FileUpload - Drag and drop event triggered');
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log('DEBUG: FileUpload - Dropped files count:', files.length);
    console.log('DEBUG: FileUpload - Dropped files:', files);
    
    if (files.length > 0) {
      const file = files[0];
      console.log('DEBUG: FileUpload - Processing dropped file:', file.name, file.size, file.type);
      uploadFile(file);
    } else {
      console.log('DEBUG: FileUpload - No files in drop event');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    console.log('DEBUG: FileUpload - Drag over event');
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to select
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {formatFileSize(maxSizePerFile)} • 
            Accepted types: {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.map(type => `.${type}`).join(',')}
        onChange={handleFileSelect}
      />

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;