-- Create tables in the api schema since PostgREST is configured to use 'api' schema
-- This resolves the PGRST106 error by working within the exposed schema

-- Create the api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Grant usage on api schema to anon and authenticated roles
GRANT USAGE ON SCHEMA api TO anon, authenticated;

-- Create companies table in api schema
CREATE TABLE IF NOT EXISTS api.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_summaries table in api schema  
CREATE TABLE IF NOT EXISTS api.project_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  building_type TEXT,
  location TEXT,
  floor_area NUMERIC,
  selected_pathway TEXT,
  attic_rsi NUMERIC,
  attic_points NUMERIC,
  wall_rsi NUMERIC,
  wall_points NUMERIC,
  below_grade_rsi NUMERIC,
  below_grade_points NUMERIC,
  floor_rsi NUMERIC,
  floor_points NUMERIC,
  window_u_value NUMERIC,
  window_points NUMERIC,
  heating_system_type TEXT,
  heating_efficiency TEXT,
  heating_points NUMERIC,
  cooling_system_type TEXT,
  cooling_efficiency NUMERIC,
  cooling_points NUMERIC,
  water_heating_type TEXT,
  water_heating_efficiency NUMERIC,
  water_heating_points NUMERIC,
  hrv_erv_type TEXT,
  hrv_erv_efficiency NUMERIC,
  hrv_erv_points NUMERIC,
  airtightness_al NUMERIC,
  airtightness_points NUMERIC,
  building_volume NUMERIC,
  volume_points NUMERIC,
  annual_energy_consumption NUMERIC,
  performance_compliance_result TEXT,
  total_points NUMERIC,
  compliance_status TEXT,
  upgrade_costs NUMERIC,
  recommendations TEXT[],
  cost_comparison JSONB,
  energy_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE api.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.project_summaries ENABLE ROW LEVEL SECURITY;

-- Grant all privileges on tables to anon and authenticated
GRANT ALL ON api.companies TO anon, authenticated;
GRANT ALL ON api.project_summaries TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA api TO anon, authenticated;

-- Create RLS policies for companies
DROP POLICY IF EXISTS "Users can view their own company profile" ON api.companies;
DROP POLICY IF EXISTS "Users can create their own company profile" ON api.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON api.companies;

CREATE POLICY "Users can view their own company profile" 
ON api.companies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company profile" 
ON api.companies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile" 
ON api.companies FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for project_summaries
DROP POLICY IF EXISTS "Users can view their own project summaries" ON api.project_summaries;
DROP POLICY IF EXISTS "Users can create their own project summaries" ON api.project_summaries;
DROP POLICY IF EXISTS "Users can update their own project summaries" ON api.project_summaries;
DROP POLICY IF EXISTS "Users can delete their own project summaries" ON api.project_summaries;

CREATE POLICY "Users can view their own project summaries" 
ON api.project_summaries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project summaries" 
ON api.project_summaries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project summaries" 
ON api.project_summaries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project summaries" 
ON api.project_summaries FOR DELETE 
USING (auth.uid() = user_id);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_companies_updated_at ON api.companies;
DROP TRIGGER IF EXISTS update_project_summaries_updated_at ON api.project_summaries;

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON api.companies
    FOR EACH ROW
    EXECUTE FUNCTION api.update_updated_at_column();

CREATE TRIGGER update_project_summaries_updated_at
    BEFORE UPDATE ON api.project_summaries
    FOR EACH ROW
    EXECUTE FUNCTION api.update_updated_at_column();

-- Copy any existing data from public schema if it exists
INSERT INTO api.companies (id, user_id, company_name, contact_email, phone, address, created_at, updated_at)
SELECT id, user_id, company_name, contact_email, phone, address, created_at, updated_at 
FROM public.companies 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies')
ON CONFLICT (id) DO NOTHING;

INSERT INTO api.project_summaries (
  id, user_id, project_name, building_type, location, floor_area, selected_pathway,
  attic_rsi, attic_points, wall_rsi, wall_points, below_grade_rsi, below_grade_points,
  floor_rsi, floor_points, window_u_value, window_points, heating_system_type,
  heating_efficiency, heating_points, cooling_system_type, cooling_efficiency,
  cooling_points, water_heating_type, water_heating_efficiency, water_heating_points,
  hrv_erv_type, hrv_erv_efficiency, hrv_erv_points, airtightness_al, airtightness_points,
  building_volume, volume_points, annual_energy_consumption, performance_compliance_result,
  total_points, compliance_status, upgrade_costs, recommendations, cost_comparison,
  energy_insights, created_at, updated_at
)
SELECT 
  id, user_id, project_name, building_type, location, floor_area, selected_pathway,
  attic_rsi, attic_points, wall_rsi, wall_points, below_grade_rsi, below_grade_points,
  floor_rsi, floor_points, window_u_value, window_points, heating_system_type,
  heating_efficiency, heating_points, cooling_system_type, cooling_efficiency,
  cooling_points, water_heating_type, water_heating_efficiency, water_heating_points,
  hrv_erv_type, hrv_erv_efficiency, hrv_erv_points, airtightness_al, airtightness_points,
  building_volume, volume_points, annual_energy_consumption, performance_compliance_result,
  total_points, compliance_status, upgrade_costs, recommendations, cost_comparison,
  energy_insights, created_at, updated_at
FROM public.project_summaries 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_summaries')
ON CONFLICT (id) DO NOTHING;