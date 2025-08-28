-- Create a test project to trigger the Dropbox integration
INSERT INTO public.project_summaries (
  user_id, 
  project_name, 
  building_type, 
  location, 
  floor_area,
  selected_pathway
) VALUES (
  '30b6dc76-3a42-412a-b076-fc0117d16164',
  'Test Project - Dropbox Integration',
  'Single Family Home',
  'Calgary, AB',
  2500,
  'performance'
);