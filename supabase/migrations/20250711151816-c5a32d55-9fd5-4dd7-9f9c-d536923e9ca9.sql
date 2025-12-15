-- Improve storage policies with file type and size restrictions

-- Add file type restrictions for project-files bucket
CREATE POLICY "Restrict file types for project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name)) IN ('pdf', 'doc', 'docx', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'txt')
  AND octet_length(decode(raw_metadata->>'size', 'escape')) < 10485760 -- 10MB limit
);

-- Update existing INSERT policy to include file restrictions
DROP POLICY IF EXISTS "Users can upload their own project files" ON storage.objects;

CREATE POLICY "Users can upload their own project files with restrictions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name)) IN ('pdf', 'doc', 'docx', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'txt', 'csv')
  AND octet_length(content) < 10485760 -- 10MB limit
);