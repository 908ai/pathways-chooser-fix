// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import PDFDocument from 'https://deno.land/x/pdfkit@v0.14.0/mod.ts';
import { Buffer } from "https://deno.land/std@0.168.0/io/buffer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to fetch image and convert to buffer
async function fetchImage(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText}`);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        return new Buffer(arrayBuffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

const FONT_REGULAR = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_OBLIQUE = 'Helvetica-Oblique';

const buildPdf = async (doc: typeof PDFDocument, project: any, company: any) => {
    // Fetch logo
    const logoUrl = `${Deno.env.get('SUPABASE_URL')!}/storage/v1/object/public/assets/NBC936-logo.png`;
    const logoBuffer = await fetchImage(logoUrl);

    let pageNumber = 0;
    doc.on('pageAdded', () => {
        pageNumber++;
        // Header
        if (logoBuffer) {
            doc.image(logoBuffer, 50, 45, { width: 100 });
        }
        doc.fontSize(10).font(FONT_BOLD).text(project.project_name, 200, 50, { align: 'right' });
        doc.fontSize(8).font(FONT_REGULAR).text(new Date().toLocaleDateString(), 200, 65, { align: 'right' });

        // Footer
        doc.fontSize(8).font(FONT_REGULAR).text(`Page ${pageNumber}`, 50, doc.page.height - 50, { align: 'center' });
    });

    doc.addPage();

    // Title
    doc.fontSize(24).font(FONT_BOLD).text('Project Compliance Report', { align: 'center' });
    doc.moveDown(2);

    // --- Helper Functions ---
    const addSectionTitle = (title: string) => {
        doc.fontSize(16).font(FONT_BOLD).text(title, { underline: true });
        doc.moveDown();
    };

    const addDetailItem = (label: string, value: any, unit = '') => {
        if (value === null || value === undefined || value === '') return;
        const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
        doc.fontSize(10).font(FONT_BOLD).text(label + ':', { continued: true }).font(FONT_REGULAR).text(` ${displayValue}${unit}`);
        doc.moveDown(0.5);
    };

    // --- Sections ---
    addSectionTitle('Project Overview');
    addDetailItem('Project Name', project.project_name);
    addDetailItem('Address', project.location);
    addDetailItem('Building Type', project.building_type);
    addDetailItem('Compliance Pathway', project.selected_pathway);
    addDetailItem('Status', project.compliance_status);
    doc.moveDown();

    if (company) {
        addSectionTitle('Client Information');
        addDetailItem('Company', company.company_name);
        addDetailItem('Contact Email', company.contact_email);
        addDetailItem('Phone', company.phone);
        doc.moveDown();
    }

    addSectionTitle('Technical Specifications');
    doc.fontSize(12).font(FONT_BOLD).text('Building Envelope');
    doc.moveDown(0.5);
    addDetailItem('Attic/Ceiling RSI', project.attic_rsi);
    addDetailItem('Above-Grade Wall RSI', project.wall_rsi);
    addDetailItem('Below-Grade Wall RSI', project.below_grade_rsi);
    addDetailItem('Exposed Floor RSI', project.floor_rsi);
    addDetailItem('Window & Door U-Value', project.window_u_value, ' W/(m²·K)');
    doc.moveDown();

    doc.fontSize(12).font(FONT_BOLD).text('Mechanical Systems');
    doc.moveDown(0.5);
    addDetailItem('Heating System', project.heating_system_type);
    addDetailItem('Heating Efficiency', project.heating_efficiency);
    addDetailItem('Cooling System', project.cooling_system_type);
    addDetailItem('Cooling Efficiency', project.cooling_efficiency, ' SEER');
    addDetailItem('Water Heating System', project.water_heating_type);
    addDetailItem('Ventilation (HRV/ERV)', project.hrv_erv_type);
    addDetailItem('Ventilation Efficiency', project.hrv_erv_efficiency, ' SRE %');
    doc.moveDown();

    doc.fontSize(12).font(FONT_BOLD).text('Performance Metrics');
    doc.moveDown(0.5);
    addDetailItem('Airtightness Level', project.airtightness_al, ' ACH₅₀');
    addDetailItem('Building Volume', project.building_volume, ' m³');
    doc.moveDown();

    addSectionTitle('Compliance Summary');
    addDetailItem('Compliance Status', project.compliance_status);
    addDetailItem('Performance Result', project.performance_compliance_result);
    addDetailItem('Total Points (Tiered Path)', project.total_points);
    doc.moveDown();

    if (project.uploaded_files && project.uploaded_files.length > 0) {
        addSectionTitle('Uploaded Documents');
        project.uploaded_files.forEach((file: any) => {
            doc.fontSize(10).font(FONT_REGULAR).text(`• ${file.name}`);
        });
    }
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

    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('user_id', project.user_id)
      .single();

    const doc = new PDFDocument({ autoFirstPage: false, margin: 50, size: 'A4' });

    const stream = new ReadableStream({
        async start(controller) {
            doc.on('data', (chunk) => controller.enqueue(chunk));
            doc.on('end', () => controller.close());

            await buildPdf(doc, project, company);
            
            doc.end();
        }
    });

    return new Response(stream, { headers: { ...corsHeaders, 'Content-Disposition': `attachment; filename="${project.project_name}_Report.pdf"` } });

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});