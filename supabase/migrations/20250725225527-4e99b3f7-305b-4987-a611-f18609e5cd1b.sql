
-- Add the new columns for Dropbox integration
ALTER TABLE public.project_summaries 
ADD COLUMN IF NOT EXISTS dropbox_path TEXT,
ADD COLUMN IF NOT EXISTS dropbox_link TEXT;

-- Create or replace the trigger function that will call the edge function
CREATE OR REPLACE FUNCTION public.trigger_create_dropbox_assets()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_data jsonb;
  folder_path text;
  request_link text;
BEGIN
  -- Call the edge function using the http extension
  SELECT content INTO response_data
  FROM http((
    'POST',
    'https://oxvhlrvtmfnmdazwgdtp.supabase.co/functions/v1/createDropboxAssets',
    ARRAY[
      http_header('Content-Type', 'application/json'),
      http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmhscnZ0bWZubWRhendnZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTAyMDAsImV4cCI6MjA2NzQyNjIwMH0.vuSLwKDzf82FzbPJZ9WD0w2hFuWSzHtHBLmsY6NkSQM')
    ],
    'application/json',
    json_build_object('projectId', NEW.id)::text
  ));

  -- Extract folder and requestLink from the response
  IF response_data IS NOT NULL THEN
    folder_path := response_data->>'folder';
    request_link := response_data->>'requestLink';
    
    -- Update the row with the Dropbox information
    UPDATE public.project_summaries 
    SET 
      dropbox_path = folder_path,
      dropbox_link = request_link
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger that fires after insert
DROP TRIGGER IF EXISTS create_dropbox_assets_trigger ON public.project_summaries;
CREATE TRIGGER create_dropbox_assets_trigger
  AFTER INSERT ON public.project_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_create_dropbox_assets();
