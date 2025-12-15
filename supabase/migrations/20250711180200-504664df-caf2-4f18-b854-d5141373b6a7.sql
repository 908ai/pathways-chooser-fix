-- Drop existing conflicting policies and create simpler ones
DROP POLICY IF EXISTS "Users can upload their own project files" ON storage.objects;

-- Create a more permissive INSERT policy for project files
CREATE POLICY "Allow authenticated users to upload project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);

-- Update SELECT policy to be more permissive
DROP POLICY IF EXISTS "Users can view their own project files" ON storage.objects;
CREATE POLICY "Allow authenticated users to view project files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);

-- Update UPDATE policy
DROP POLICY IF EXISTS "Users can update their own project files" ON storage.objects;
CREATE POLICY "Allow authenticated users to update project files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);

-- Update DELETE policy  
DROP POLICY IF EXISTS "Users can delete their own project files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete project files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
);