-- Add file storage support for project documents
-- First, create a storage bucket for project files if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for project files
-- Users can view their own uploaded files
CREATE POLICY "Users can view their own project files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can upload their own project files
CREATE POLICY "Users can upload their own project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own project files
CREATE POLICY "Users can update their own project files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own project files
CREATE POLICY "Users can delete their own project files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Account managers can view all project files
CREATE POLICY "Account managers can view all project files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-files' AND (
  has_role(auth.uid(), 'account_manager'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
));

-- Add a column to store uploaded file URLs/paths in project_summaries table
ALTER TABLE public.project_summaries 
ADD COLUMN uploaded_files JSONB DEFAULT '[]'::jsonb;