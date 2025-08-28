-- Create project summaries table for storing building performance pathway analysis
CREATE TABLE public.project_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Core Building Information (shared)
  project_name TEXT NOT NULL,
  building_type TEXT,
  location TEXT,
  floor_area NUMERIC,
  
  -- Pathway Selection
  selected_pathway TEXT CHECK (selected_pathway IN ('prescriptive', 'performance')),
  
  -- Building Envelope Data
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
  
  -- Mechanical Systems Data
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
  
  -- Building Performance Data
  airtightness_al NUMERIC,
  airtightness_points NUMERIC,
  building_volume NUMERIC,
  volume_points NUMERIC,
  
  -- Performance Path Specific Data
  annual_energy_consumption NUMERIC,
  performance_compliance_result TEXT,
  
  -- Compliance Results
  total_points NUMERIC,
  compliance_status TEXT CHECK (compliance_status IN ('pass', 'fail')),
  upgrade_costs NUMERIC,
  
  -- Additional Analysis Data
  cost_comparison JSONB,
  energy_insights JSONB,
  recommendations TEXT[]
);

-- Enable Row Level Security
ALTER TABLE public.project_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own project summaries" 
ON public.project_summaries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project summaries" 
ON public.project_summaries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project summaries" 
ON public.project_summaries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project summaries" 
ON public.project_summaries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_summaries_updated_at
BEFORE UPDATE ON public.project_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_project_summaries_user_id ON public.project_summaries(user_id);
CREATE INDEX idx_project_summaries_pathway ON public.project_summaries(selected_pathway);
CREATE INDEX idx_project_summaries_created_at ON public.project_summaries(created_at);