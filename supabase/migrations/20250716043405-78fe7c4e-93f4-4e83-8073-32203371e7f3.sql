-- Create function to handle Dropbox folder creation for new projects
CREATE OR REPLACE FUNCTION public.create_dropbox_folder_for_project()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Dropbox edge function to create folder
  PERFORM net.http_post(
    url := 'https://oxvhlrvtmfnmdazwgdtp.supabase.co/functions/v1/create-dropbox-folder',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmhscnZ0bWZubWRhendnZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTAyMDAsImV4cCI6MjA2NzQyNjIwMH0.vuSLwKDzf82FzbPJZ9WD0w2hFuWSzHtHBLmsY6NkSQM"}'::jsonb,
    body := json_build_object(
      'project_id', NEW.id,
      'project_name', NEW.project_name,
      'user_id', NEW.user_id
    )::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create Dropbox folder when project is created
CREATE OR REPLACE TRIGGER trigger_create_dropbox_folder
  AFTER INSERT ON public.project_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_dropbox_folder_for_project();

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;