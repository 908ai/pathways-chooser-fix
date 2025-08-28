-- Create a storage bucket for company assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-assets', 'company-assets', true);

-- Create storage policies for the company-assets bucket
CREATE POLICY "Public read access for company assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated users can upload company assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update company assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete company assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');