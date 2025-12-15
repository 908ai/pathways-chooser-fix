-- Ensure companies table exists with proper structure
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure project_summaries table exists with proper structure  
CREATE TABLE IF NOT EXISTS public.project_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  building_type TEXT,
  location TEXT,
  floor_area NUMERIC,
  selected_pathway TEXT,
  
  -- Building Envelope
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
  
  -- Mechanical Systems
  heating_system_type TEXT,
  heating_efficiency NUMERIC,
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
  
  -- Building Performance
  airtightness_al NUMERIC,
  airtightness_points NUMERIC,
  building_volume NUMERIC,
  volume_points NUMERIC,
  
  -- Performance Path
  annual_energy_consumption NUMERIC,
  performance_compliance_result TEXT,
  
  -- Compliance Results
  total_points NUMERIC,
  compliance_status TEXT,
  upgrade_costs NUMERIC,
  
  -- Additional fields
  recommendations TEXT[],
  cost_comparison JSONB,
  energy_insights JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
DROP POLICY IF EXISTS "Users can view their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can create their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;

CREATE POLICY "Users can view their own company profile" 
ON public.companies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company profile" 
ON public.companies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile" 
ON public.companies FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for project_summaries
DROP POLICY IF EXISTS "Users can view their own project summaries" ON public.project_summaries;
DROP POLICY IF EXISTS "Users can create their own project summaries" ON public.project_summaries;
DROP POLICY IF EXISTS "Users can update their own project summaries" ON public.project_summaries;
DROP POLICY IF EXISTS "Users can delete their own project summaries" ON public.project_summaries;

CREATE POLICY "Users can view their own project summaries" 
ON public.project_summaries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project summaries" 
ON public.project_summaries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project summaries" 
ON public.project_summaries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project summaries" 
ON public.project_summaries FOR DELETE 
USING (auth.uid() = user_id);

-- Create or update the timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_project_summaries_updated_at ON public.project_summaries;

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_summaries_updated_at
    BEFORE UPDATE ON public.project_summaries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();