-- Fix project-files bucket configuration
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800, -- 50MB limit
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'application/vnd.dwg', 'image/vnd.dwg', 'application/octet-stream', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'image/gif', 'application/zip', 'text/plain', 'text/csv']
WHERE id = 'project-files';

-- Also clean up duplicate storage policies that may be causing conflicts
DROP POLICY IF EXISTS "Restrict file types for project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own project files with restrictions" ON storage.objects;