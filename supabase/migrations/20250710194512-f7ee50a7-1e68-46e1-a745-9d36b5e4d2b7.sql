-- Force schema cache refresh by adding and removing a temporary comment
COMMENT ON COLUMN public.project_summaries.uploaded_files IS 'JSON array to store uploaded file metadata';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';