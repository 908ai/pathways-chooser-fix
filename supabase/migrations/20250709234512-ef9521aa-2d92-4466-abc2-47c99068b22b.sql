-- Ensure the public schema is properly exposed for API access
-- This addresses the PGRST106 error about schema availability

-- Grant usage on public schema to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant all privileges on all tables in public schema to anon and authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Grant all privileges on all sequences in public schema to anon and authenticated  
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant all privileges on all functions in public schema to anon and authenticated
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Ensure future tables, sequences, and functions are accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- Ensure the tables exist and have proper structure
-- This is redundant but ensures everything is properly set up
DO $$ 
BEGIN
    -- Check if companies table exists and recreate with proper permissions if needed
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
        CREATE TABLE public.companies (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            company_name TEXT NOT NULL,
            contact_email TEXT,
            phone TEXT,
            address TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        -- Enable RLS
        ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own company profile" ON public.companies FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can create their own company profile" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own company profile" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Check if project_summaries table exists and recreate with proper permissions if needed  
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_summaries') THEN
        CREATE TABLE public.project_summaries (
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
        
        -- Enable RLS
        ALTER TABLE public.project_summaries ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own project summaries" ON public.project_summaries FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can create their own project summaries" ON public.project_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own project summaries" ON public.project_summaries FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own project summaries" ON public.project_summaries FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;