-- Reset PostgREST schema configuration to use public schema
-- This ensures the REST API recognizes the public schema

-- Verify that the public schema exists and is accessible
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'public';

-- Grant usage on public schema to relevant roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant privileges on all tables in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;