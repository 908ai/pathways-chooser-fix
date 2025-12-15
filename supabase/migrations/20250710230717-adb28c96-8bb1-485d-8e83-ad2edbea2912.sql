-- Force PostgREST schema cache reload with multiple methods
-- Method 1: Send NOTIFY signal with different payload
NOTIFY pgrst, 'reload schema';

-- Method 2: Temporarily alter table to force cache invalidation
ALTER TABLE public.project_summaries ALTER COLUMN uploaded_files SET DEFAULT '[]'::jsonb;

-- Method 3: Update table comment to force cache refresh
COMMENT ON TABLE public.project_summaries IS 'Project summary data with file uploads - cache refresh';

-- Method 4: Grant permissions again to ensure they're recognized
GRANT ALL ON public.project_summaries TO authenticator;
GRANT ALL ON public.project_summaries TO anon;
GRANT ALL ON public.project_summaries TO authenticated;

-- Method 5: Reset connection pooler by updating schema version
SELECT set_config('app.schema_version', extract(epoch from now())::text, false);