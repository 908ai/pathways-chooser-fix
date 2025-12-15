-- Create helper functions to access api schema tables
CREATE OR REPLACE FUNCTION public.get_user_company_name(p_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT company_name FROM api.companies WHERE user_id = p_user_id LIMIT 1;
$$;

-- Create function to insert project summary
CREATE OR REPLACE FUNCTION public.insert_project_summary(
  p_user_id UUID,
  p_project_name TEXT,
  p_building_type TEXT,
  p_location TEXT,
  p_floor_area NUMERIC,
  p_selected_pathway TEXT,
  p_attic_rsi NUMERIC,
  p_attic_points NUMERIC,
  p_wall_rsi NUMERIC,
  p_wall_points NUMERIC,
  p_below_grade_rsi NUMERIC,
  p_below_grade_points NUMERIC,
  p_floor_rsi NUMERIC,
  p_floor_points NUMERIC,
  p_window_u_value TEXT,
  p_window_points NUMERIC,
  p_heating_system_type TEXT,
  p_heating_efficiency TEXT,
  p_heating_points NUMERIC,
  p_cooling_system_type TEXT,
  p_cooling_efficiency NUMERIC,
  p_cooling_points NUMERIC,
  p_water_heating_type TEXT,
  p_water_heating_efficiency NUMERIC,
  p_water_heating_points NUMERIC,
  p_hrv_erv_type TEXT,
  p_hrv_erv_efficiency NUMERIC,
  p_hrv_erv_points NUMERIC,
  p_airtightness_al NUMERIC,
  p_airtightness_points NUMERIC,
  p_building_volume NUMERIC,
  p_volume_points NUMERIC,
  p_annual_energy_consumption NUMERIC,
  p_performance_compliance_result TEXT,
  p_total_points NUMERIC,
  p_compliance_status TEXT,
  p_upgrade_costs NUMERIC
)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO api.project_summaries (
    user_id, project_name, building_type, location, floor_area, selected_pathway,
    attic_rsi, attic_points, wall_rsi, wall_points, below_grade_rsi, below_grade_points,
    floor_rsi, floor_points, window_u_value, window_points, heating_system_type,
    heating_efficiency, heating_points, cooling_system_type, cooling_efficiency,
    cooling_points, water_heating_type, water_heating_efficiency, water_heating_points,
    hrv_erv_type, hrv_erv_efficiency, hrv_erv_points, airtightness_al, airtightness_points,
    building_volume, volume_points, annual_energy_consumption, performance_compliance_result,
    total_points, compliance_status, upgrade_costs
  ) VALUES (
    p_user_id, p_project_name, p_building_type, p_location, p_floor_area, p_selected_pathway,
    p_attic_rsi, p_attic_points, p_wall_rsi, p_wall_points, p_below_grade_rsi, p_below_grade_points,
    p_floor_rsi, p_floor_points, p_window_u_value, p_window_points, p_heating_system_type,
    p_heating_efficiency, p_heating_points, p_cooling_system_type, p_cooling_efficiency,
    p_cooling_points, p_water_heating_type, p_water_heating_efficiency, p_water_heating_points,
    p_hrv_erv_type, p_hrv_erv_efficiency, p_hrv_erv_points, p_airtightness_al, p_airtightness_points,
    p_building_volume, p_volume_points, p_annual_energy_consumption, p_performance_compliance_result,
    p_total_points, p_compliance_status, p_upgrade_costs
  ) RETURNING id;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.get_user_company_name(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.insert_project_summary(UUID, TEXT, TEXT, TEXT, NUMERIC, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT, NUMERIC, TEXT, TEXT, NUMERIC, TEXT, NUMERIC, NUMERIC, TEXT, NUMERIC, NUMERIC, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT, NUMERIC, TEXT, NUMERIC) TO anon, authenticated;