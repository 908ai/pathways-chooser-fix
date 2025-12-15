-- Create a new test project to verify the updated Dropbox token
INSERT INTO public.project_summaries (
  user_id, 
  project_name, 
  building_type, 
  location, 
  floor_area,
  selected_pathway
) VALUES (
  '30b6dc76-3a42-412a-b076-fc0117d16164',
  'Test New Token - Dropbox Integration V2',
  'Townhouse',
  'Toronto, ON',
  1800,
  'prescriptive'
);