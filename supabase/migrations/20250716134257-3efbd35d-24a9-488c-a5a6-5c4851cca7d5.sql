-- Test the Dropbox edge function directly with the test project
SELECT net.http_post(
  url := 'https://oxvhlrvtmfnmdazwgdtp.supabase.co/functions/v1/create-dropbox-folder',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmhscnZ0bWZubWRhendnZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTAyMDAsImV4cCI6MjA2NzQyNjIwMH0.vuSLwKDzf82FzbPJZ9WD0w2hFuWSzHtHBLmsY6NkSQM"}'::jsonb,
  body := json_build_object(
    'project_id', (SELECT id FROM project_summaries WHERE project_name = 'Test New Token - Dropbox Integration V2' LIMIT 1),
    'project_name', 'Test New Token - Dropbox Integration V2',
    'user_id', '30b6dc76-3a42-412a-b076-fc0117d16164'
  )::jsonb
) as http_response;