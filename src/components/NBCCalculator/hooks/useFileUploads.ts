// src/components/NBCCalculator/hooks/useFileUploads.ts
// Extracted file upload logic from NBCCalculator (lifted as-is, no rewrites)

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast"; // adjust import path if needed

export const useFileUploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check authentication with proper error handling
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    if (authError) {
      console.error("Authentication error during file upload:", authError);
      toast({
        title: "Authentication Error",
        description: "Please sign in again to upload files.",
        variant: "destructive"
      });
      return;
    }
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        console.log("DEBUG: Starting upload for file:", file.name, "Size:", file.size, "Type:", file.type);

        // Create unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`;
        console.log("DEBUG: Generated file path:", fileName);

        // Upload to Supabase Storage
        console.log("DEBUG: Attempting upload to project-files bucket...");
        const { data, error } = await supabase.storage.from("project-files").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });
        console.log("DEBUG: Upload response - data:", data);
        if (error) {
          console.error("DEBUG: Upload error details:", { message: error.message, error: error });
          throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("project-files").getPublicUrl(fileName);
        console.log("DEBUG: Public URL data:", urlData);

        // Create a File object with additional metadata
        const uploadedFile = new File([file], file.name, { type: file.type });
        (uploadedFile as any).url = urlData.publicUrl;
        (uploadedFile as any).path = fileName;
        (uploadedFile as any).size = file.size;
        console.log("DEBUG: File uploaded successfully:", {
          name: file.name,
          size: file.size,
          type: file.type,
          path: fileName,
          url: urlData.publicUrl
        });
        return uploadedFile;
      } catch (error: any) {
        console.error("DEBUG: Detailed error uploading file:", {
          fileName: file.name,
          errorMessage: error.message,
          fullError: error
        });
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((file) => file !== null) as File[];
    const failedUploads = results.filter((file) => file === null);
    console.log("DEBUG: Upload results:", {
      totalFiles: files.length,
      successfulUploads: successfulUploads.length,
      failedUploads: failedUploads.length
    });

    if (successfulUploads.length > 0) {
      setUploadedFiles((prev) => {
        const newFiles = [...prev, ...successfulUploads];
        console.log("DEBUG: Updated uploadedFiles state:", newFiles.map((f) => f.name));
        return newFiles;
      });
      toast({
        title: "Files Uploaded",
        description: `${successfulUploads.length} file(s) uploaded successfully.`
      });
    }

    if (failedUploads.length > 0) {
      const failedCount = failedUploads.length;
      toast({
        title: "Some uploads failed",
        description: `${failedCount} file(s) failed to upload.`,
        variant: "destructive"
      });
    }

    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle file upload from FileUpload component
  const handleFileUploaded = (fileData: {
    name: string;
    url: string;
    size: number;
    type: string;
    path?: string;
  }) => {
    console.log("DEBUG: File uploaded via FileUpload component:", fileData);

    // Create a File-like object to maintain consistency
    const mockFile = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      lastModified: Date.now(),
      webkitRelativePath: "",
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(""),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      url: fileData.url,
      path: fileData.path
    } as File & { url?: string; path?: string };

    setUploadedFiles((prev) => {
      const newFiles = [...prev, mockFile];
      console.log("DEBUG: Updated uploadedFiles state via FileUpload:", newFiles.map((f) => f.name));
      return newFiles;
    });
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    handleFileUploaded,
    removeFile
  };
};
