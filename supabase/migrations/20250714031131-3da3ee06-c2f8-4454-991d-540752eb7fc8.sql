-- Fix #4: Backend Storage Check & Logging - Ensure project-files bucket exists with proper configuration
-- First check if bucket exists, if not create it
DO $$
BEGIN
    -- Check if bucket exists
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'project-files') THEN
        -- Create the bucket with proper configuration
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'project-files', 
            'project-files', 
            false, 
            52428800, -- 50MB limit
            ARRAY[
                'application/pdf', 
                'image/jpeg', 
                'image/png', 
                'image/gif',
                'image/tiff', 
                'application/vnd.dwg', 
                'image/vnd.dwg', 
                'application/octet-stream',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'application/zip',
                'text/plain',
                'text/csv'
            ]
        );
    ELSE
        -- Update existing bucket configuration to ensure it has proper settings
        UPDATE storage.buckets 
        SET 
            file_size_limit = 52428800,
            allowed_mime_types = ARRAY[
                'application/pdf', 
                'image/jpeg', 
                'image/png', 
                'image/gif',
                'image/tiff', 
                'application/vnd.dwg', 
                'image/vnd.dwg', 
                'application/octet-stream',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'application/zip',
                'text/plain',
                'text/csv'
            ]
        WHERE id = 'project-files';
    END IF;
END $$;

-- Clean up any conflicting policies first
DROP POLICY IF EXISTS "Allow authenticated users to upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view project files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update project files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete project files" ON storage.objects;

-- Create comprehensive storage policies for project files
CREATE POLICY "Authenticated users can upload to project-files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view project-files" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update project-files" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete project-files" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'project-files' 
    AND auth.role() = 'authenticated'
);