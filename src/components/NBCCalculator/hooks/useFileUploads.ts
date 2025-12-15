import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

export type UploadedFile = File & { url?: string; path?: string };

export const useFileUploads = (user: User | null) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, projectId: string): Promise<UploadedFile | null> => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to upload files.", variant: "destructive" });
      return null;
    }
    if (!projectId) {
      toast({ title: "Project Error", description: "A project must be created before uploading files.", variant: "destructive" });
      return null;
    }

    setIsUploading(true);

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

      const newFile: UploadedFile = Object.assign(file, {
        url: urlData.publicUrl,
        path: data.path,
      });

      setUploadedFiles((prev) => [...prev, newFile]);
      
      toast({ title: "File Uploaded", description: `${file.name} has been uploaded successfully.` });
      
      return newFile;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (fileToRemove: UploadedFile) => {
    if (fileToRemove.path) {
        try {
            const { error } = await supabase.storage.from('project-files').remove([fileToRemove.path]);
            if (error) throw error;
        } catch (error: any) {
            console.error("Error deleting file from storage:", error);
            toast({ title: "Deletion Failed", description: "Could not remove file from storage.", variant: "destructive" });
        }
    }
    setUploadedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    isUploading,
    uploadFile,
    removeFile,
  };
};