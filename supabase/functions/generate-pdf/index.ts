// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { PDFDocument, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize unsupported characters for WinAnsi
const sanitize = (input: any): string => {
  if (input === null || input === undefined) return '';
  let s = String(input);

  // Subscript digits
  const subscripts: Record<string, string> = {
    '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4',
    '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9',
  };
  for (const [k, v] of Object.entries(subscripts)) s = s.split(k).join(v);

  // Superscripts ², ³
  s = s.replace(/\u00B2/g, '2').replace(/\u00B3/g, '3');

  // Bullet
  s = s.replace(/\u2022/g, '-');

  // Middle dot in units (·)
  s = s.replace(/\u00B7/g, '.');

  return s;
};

const pathwayMap: Record<string, string> = {
  '9365': 'NBC 9.36.5 Performance',
  '9362': 'NBC 9.36.2 Prescriptive',
  '9367': 'NBC 9.36.7 Tiered Performance',
  '9368': 'NBC 9.36.8 Tiered Prescriptive',
};

const displayPathway = (selected: string | null) => {
  if (!selected) return 'Not specified';
  return pathwayMap[selected] || selected;
};

const asList = (val: any): string | null => {
  if (!val) return null;
  if (Array.isArray(val)) return val.length ? val.join(', ') : null;
  return String(val);
};

const buildPdf = async (project: any, company: any) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage();
  let { width: pageWidth, height: pageHeight } = page.getSize();
  const margin = 50;
  const lineHeight = 14;
  const sectionTitleSize = 16;

  const state = { y: pageHeight - margin };

  const drawHeader = () => {
    const titleText = sanitize('Project Compliance Report');
    page.drawText(titleText, {
      x: margin,
      y: pageHeight - margin,
      font: boldFont,
      size: 20,
    });

    const projectNameText = sanitize(project.project_name || 'Unnamed Project');
    const projectNameWidth = boldFont.widthOfTextAtSize(projectNameText, 10);
    page.drawText(projectNameText, {
      x: pageWidth - margin - projectNameWidth,
      y: pageHeight - margin,
      font: boldFont,
      size: 10,
    });

    const dateText = sanitize(new Date().toLocaleDateString());
    const dateWidth = font.widthOfTextAtSize(dateText, 8);
    page.drawText(dateText, {
      x: pageWidth - margin - dateWidth,
      y: pageHeight - margin - 15,
      font,
      size: 8,
    });

    // Start content below header
    state.y = pageHeight - margin - 40;
  };

  const checkPageBreak = (spaceNeeded: number) => {
    if (state.y - spaceNeeded < margin) {
      page = pdfDoc.addPage();
      const size = page.getSize();
      pageWidth = size.width;
      pageHeight = size.height;
      drawHeader();
    }
  };

  const addSpacer = (space: number = 8) => {
    checkPageBreak(space);
    state.y -= space;
  };

  const addSectionTitle = (title: string) => {
    const safeTitle = sanitize(title);
    // Space before section
    addSpacer(12);
    checkPageBreak(sectionTitleSize + 10);
    page.drawText(safeTitle, { x: margin, y: state.y, font: boldFont, size: sectionTitleSize });
    state.y -= sectionTitleSize + 6;
    // Draw a thin separator line
    page.drawLine({
      start: { x: margin, y: state.y },
      end: { x: pageWidth - margin, y: state.y },
      thickness: 0.75,
    });
    state.y -= 10;
  };

  const addDetailItem = (label: string, value: any, unit = '') => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) return;
    checkPageBreak(lineHeight);
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : Array.isArray(value) ? value.join(', ') : String(value);
    const labelText = sanitize(`${label}:`);
    const valueText = sanitize(` ${displayValue}${unit ? ` ${unit}` : ''}`);

    page.drawText(labelText, { x: margin, y: state.y, font: boldFont, size: 10 });
    const labelWidth = boldFont.widthOfTextAtSize(labelText, 10);
    page.drawText(valueText, { x: margin + labelWidth, y: state.y, font, size: 10 });
    state.y -= lineHeight;
  };

  // Header
  drawHeader();

  // Overview
  addSectionTitle('Project Overview');
  addDetailItem('Project Name', project.project_name);
  addDetailItem('Status', project.compliance_status);
  addDetailItem('Compliance Pathway', displayPathway(project.selected_pathway));
  addDetailItem('Performance Result', project.performance_compliance_result);
  addDetailItem('Total Points', project.total_points);
  addDetailItem('Upgrade Costs', project.upgrade_costs ? `$${Number(project.upgrade_costs).toLocaleString()}` : null);
  addDetailItem('Comments', project.comments);

  // Address & location details
  addDetailItem('Address (formatted)', project.location);
  addDetailItem('Street Address', project.street_address);
  addDetailItem('Unit Number', project.unit_number);
  addDetailItem('City', project.city);
  addDetailItem('Province', project.province);
  addDetailItem('Postal Code', project.postal_code);
  addDetailItem('Occupancy Class', project.occupancy_class);
  addDetailItem('Climate Zone', project.climate_zone);
  addDetailItem('Floor Area', project.floor_area, 'm2');
  addDetailItem('Latitude', project.latitude);
  addDetailItem('Longitude', project.longitude);
  addDetailItem('Created At', project.created_at);
  addDetailItem('Last Updated', project.updated_at);

  // Client
  if (company) {
    addSectionTitle('Client Information');
    addDetailItem('Company', company.company_name);
    addDetailItem('Contact Email', company.contact_email);
    addDetailItem('Phone', company.phone);
    addDetailItem('Company Address', company.address);
  }

  // Technical Specifications
  addSectionTitle('Technical Specifications');

  // Building Envelope
  addSectionTitle('Building Envelope');
  addDetailItem('Ceilings/Attic RSI', project.attic_rsi, 'RSI');
  addDetailItem('Other Attic Type', project.ceilings_attic_other_type);
  addDetailItem('Cathedral/Flat Roof Present', project.has_cathedral_or_flat_roof);
  addDetailItem('Cathedral/Flat Roof RSI', project.cathedral_flat_rsi, 'RSI');
  addDetailItem('Other Cathedral/Flat Roof Type', project.cathedral_flat_other_type);
  addDetailItem('Above-Grade Wall RSI', project.wall_rsi, 'RSI');
  addDetailItem('Below-Grade Wall RSI', project.below_grade_rsi, 'RSI');
  addDetailItem('Exposed Floor RSI', project.floor_rsi, 'RSI');
  addDetailItem('Floors over Garage RSI', project.floors_garage_rsi, 'RSI');
  addDetailItem('Slab Insulation Type', project.slab_insulation_type);
  addDetailItem('Slab Insulation Value', project.slab_insulation_value, 'RSI');
  addDetailItem('In-Floor Heat RSI', project.in_floor_heat_rsi, 'RSI');
  addDetailItem('Slab on Grade RSI', project.slab_on_grade_rsi, 'RSI');
  addDetailItem('Slab on Grade Integral Footing RSI', project.slab_on_grade_integral_footing_rsi, 'RSI');
  addDetailItem('Unheated Floor Below Frost', project.unheated_floor_below_frost_rsi);
  addDetailItem('Unheated Floor Above Frost RSI', project.unheated_floor_above_frost_rsi, 'RSI');
  addDetailItem('Heated Floors RSI', project.heated_floors_rsi, 'RSI');
  addDetailItem('Window & Door U-Value', project.window_u_value, 'W/(m2.K)');
  addDetailItem('Has Skylights', project.has_skylights);
  addDetailItem('Skylight U-Value', project.skylight_u_value, 'W/(m2.K)');
  addDetailItem('Floors/Slabs Selected', asList(project.floors_slabs_selected));
  addDetailItem('Mid-Construction Blower Door Test', project.mid_construction_blower_door_planned);

  // Mechanical Systems
  addSectionTitle('Mechanical Systems');
  addDetailItem('F280 Calculation Completed', project.has_f280_calculation);
  addDetailItem('Primary Heating System', project.heating_system_type);
  addDetailItem('Primary Heating Efficiency', project.heating_efficiency);
  addDetailItem('Primary Heating Make/Model', project.heating_make_model);
  addDetailItem('Other Primary Heating Make/Model', project.other_heating_make_model);
  addDetailItem('Other Primary Heating Efficiency', project.other_heating_efficiency);
  addDetailItem('Separate Secondary Heating', project.has_secondary_heating);
  addDetailItem('Secondary Heating System', project.secondary_heating_system_type);
  addDetailItem('Secondary Heating Efficiency', project.secondary_heating_efficiency);
  addDetailItem('Secondary Heating Make/Model', project.secondary_heating_make_model);
  addDetailItem('Other Secondary Heating Efficiency', project.other_secondary_heating_efficiency);

  addDetailItem('Indirect Tank (Main)', project.indirect_tank);
  addDetailItem('Indirect Tank Size (Main)', project.indirect_tank_size, 'gal');
  addDetailItem('Indirect Tank (Secondary)', project.secondary_indirect_tank);
  addDetailItem('Indirect Tank Size (Secondary)', project.secondary_indirect_tank_size, 'gal');

  addDetailItem('Cooling System', project.cooling_system_type);
  addDetailItem('Cooling Efficiency', project.cooling_efficiency, 'SEER');
  addDetailItem('Cooling SEER', project.cooling_seer);
  addDetailItem('Cooling Make/Model', project.cooling_make_model);

  addDetailItem('Water Heating System', project.water_heating_type);
  addDetailItem('Water Heating Efficiency', project.water_heating_efficiency, 'UEF');
  addDetailItem('Water Heater Make/Model', project.water_heater_make_model);
  addDetailItem('Other Water Heater Type', project.other_water_heater_type);

  addDetailItem('Ventilation (HRV/ERV)', project.hrv_erv_type);
  addDetailItem('Ventilation Efficiency', project.hrv_erv_efficiency, 'SRE %');
  addDetailItem('HRV/ERV Make/Model', project.hrv_make_model);
  addDetailItem('Has Secondary HRV', project.has_secondary_hrv);
  addDetailItem('Secondary HRV Efficiency', project.secondary_hrv_efficiency);

  addDetailItem('Multiple MURB Heating', project.has_murb_multiple_heating);
  addDetailItem('MURB Second Heating Type', project.murb_second_heating_type);
  addDetailItem('MURB Second Heating Efficiency', project.murb_second_heating_efficiency);
  addDetailItem('MURB Second Indirect Tank', project.murb_second_indirect_tank);
  addDetailItem('MURB Second Indirect Tank Size', project.murb_second_indirect_tank_size);
  addDetailItem('Multiple MURB Water Heaters', project.has_murb_multiple_water_heaters);
  addDetailItem('MURB Second Water Heater Type', project.murb_second_water_heater_type);
  addDetailItem('MURB Second Water Heater', project.murb_second_water_heater);

  // Performance Metrics
  addSectionTitle('Performance Metrics');
  addDetailItem('Airtightness Level', project.airtightness_al, 'ACH50');
  addDetailItem('Building Volume', project.building_volume, 'm3');
  addDetailItem('Annual Energy Consumption', project.annual_energy_consumption, 'GJ/year');

  // Compliance Summary & Points
  addSectionTitle('Compliance Summary');
  addDetailItem('Compliance Status', project.compliance_status);
  addDetailItem('Pathway', displayPathway(project.selected_pathway));
  addDetailItem('Performance Result', project.performance_compliance_result);
  addDetailItem('Total Points (Tiered Path)', project.total_points);

  addDetailItem('Attic Points', project.attic_points);
  addDetailItem('Wall Points', project.wall_points);
  addDetailItem('Below-Grade Points', project.below_grade_points);
  addDetailItem('Floor Points', project.floor_points);
  addDetailItem('Window Points', project.window_points);
  addDetailItem('Heating Points', project.heating_points);
  addDetailItem('Cooling Points', project.cooling_points);
  addDetailItem('Water Heating Points', project.water_heating_points);
  addDetailItem('HRV/ERV Points', project.hrv_erv_points);
  addDetailItem('Volume Points', project.volume_points);

  // Optional & Insights
  addSectionTitle('Optional & Insights');
  addDetailItem('EnerGuide Pathway', project.energuide_pathway);
  addDetailItem('Front Door Orientation', project.front_door_orientation);
  addDetailItem('Drain Water Heat Recovery', project.has_dwhr);
  addDetailItem('Interested Certifications', asList(project.interested_certifications));
  addDetailItem('Recommendations', asList(project.recommendations));
  addDetailItem('Energy Insights (JSON)', project.energy_insights ? JSON.stringify(project.energy_insights) : null);

  // Uploaded documents
  if (project.uploaded_files && Array.isArray(project.uploaded_files) && project.uploaded_files.length > 0) {
    addSectionTitle('Uploaded Documents');
    for (const file of project.uploaded_files) {
      checkPageBreak(lineHeight);
      const name = file?.name || 'Unnamed file';
      const size = file?.size ? ` (${(Number(file.size) / 1024 / 1024).toFixed(2)} MB)` : '';
      const uploadedAt = file?.uploadedAt ? ` - ${new Date(file.uploadedAt).toLocaleDateString()}` : '';
      const by = file?.uploadedBy ? ` by ${file.uploadedBy}` : '';
      const line = sanitize(`- ${name}${size}${uploadedAt}${by}`);
      page.drawText(line, { x: margin, y: state.y, font, size: 10 });
      state.y -= lineHeight;
    }
  }

  // Page numbers
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const size = p.getSize();
    const text = sanitize(`Page ${i + 1} of ${pages.length}`);
    p.drawText(text, {
      x: size.width / 2 - 25,
      y: 30,
      size: 8,
      font,
    });
  }

  const bytes = await pdfDoc.save();
  return bytes;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const { projectId } = await req.json();
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: project, error: projectError } = await supabaseAdmin
      .from('project_summaries')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('user_id', project.user_id)
      .maybeSingle();

    if (companyError) {
      console.error("Error fetching company info:", companyError.message);
    }

    const pdfBytes = await buildPdf(project, company);
    const pdfBase64 = encode(pdfBytes);

    return new Response(JSON.stringify({ pdfData: pdfBase64 }), { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
      } 
    });

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});