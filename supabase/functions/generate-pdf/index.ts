// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const buildPdf = async (project: any, company: any) => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const checkPageBreak = (spaceNeeded: number) => {
        if (y - spaceNeeded < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
            drawHeader();
        }
    };

    const drawHeader = () => {
        const projectNameText = project.project_name;
        const projectNameWidth = boldFont.widthOfTextAtSize(projectNameText, 10);
        page.drawText(projectNameText, {
            x: width - margin - projectNameWidth,
            y: height - margin,
            font: boldFont,
            size: 10,
        });

        const dateText = new Date().toLocaleDateString();
        const dateWidth = font.widthOfTextAtSize(dateText, 8);
        page.drawText(dateText, {
            x: width - margin - dateWidth,
            y: height - margin - 15,
            font: font,
            size: 8,
        });
    };

    drawHeader();
    y -= 50; // Space for header

    // Title
    checkPageBreak(50);
    const title = 'Project Compliance Report';
    const titleSize = 24;
    const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: y,
        font: boldFont,
        size: titleSize,
    });
    y -= titleSize * 2;

    const addSectionTitle = (title: string) => {
        checkPageBreak(30);
        page.drawText(title, { x: margin, y, font: boldFont, size: 16 });
        page.drawLine({
            start: { x: margin, y: y - 5 },
            end: { x: margin + boldFont.widthOfTextAtSize(title, 16), y: y - 5 },
            thickness: 1,
        });
        y -= 16 * 1.5;
    };

    const addDetailItem = (label: string, value: any, unit = '') => {
        if (value === null || value === undefined || value === '') return;
        checkPageBreak(15);
        const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
        
        page.drawText(`${label}:`, { x: margin, y, font: boldFont, size: 10 });
        const labelWidth = boldFont.widthOfTextAtSize(`${label}:`, 10);
        page.drawText(` ${displayValue}${unit}`, { x: margin + labelWidth, y, font, size: 10 });
        y -= 15;
    };

    // --- Sections ---
    addSectionTitle('Project Overview');
    addDetailItem('Project Name', project.project_name);
    addDetailItem('Address', project.location);
    addDetailItem('Building Type', project.building_type);
    addDetailItem('Compliance Pathway', project.selected_pathway);
    addDetailItem('Status', project.compliance_status);
    y -= 15;

    if (company) {
        addSectionTitle('Client Information');
        addDetailItem('Company', company.company_name);
        addDetailItem('Contact Email', company.contact_email);
        addDetailItem('Phone', company.phone);
        y -= 15;
    }

    addSectionTitle('Technical Specifications');
    checkPageBreak(20);
    page.drawText('Building Envelope', { x: margin, y, font: boldFont, size: 12 });
    y -= 20;
    addDetailItem('Attic/Ceiling RSI', project.attic_rsi);
    addDetailItem('Above-Grade Wall RSI', project.wall_rsi);
    addDetailItem('Below-Grade Wall RSI', project.below_grade_rsi);
    addDetailItem('Exposed Floor RSI', project.floor_rsi);
    addDetailItem('Window & Door U-Value', project.window_u_value, ' W/(m2.K)');
    y -= 15;

    checkPageBreak(20);
    page.drawText('Mechanical Systems', { x: margin, y, font: boldFont, size: 12 });
    y -= 20;
    addDetailItem('Heating System', project.heating_system_type);
    addDetailItem('Heating Efficiency', project.heating_efficiency);
    addDetailItem('Cooling System', project.cooling_system_type);
    addDetailItem('Cooling Efficiency', project.cooling_efficiency, ' SEER');
    addDetailItem('Water Heating System', project.water_heating_type);
    addDetailItem('Ventilation (HRV/ERV)', project.hrv_erv_type);
    addDetailItem('Ventilation Efficiency', project.hrv_erv_efficiency, ' SRE %');
    y -= 15;

    checkPageBreak(20);
    page.drawText('Performance Metrics', { x: margin, y, font: boldFont, size: 12 });
    y -= 20;
    addDetailItem('Airtightness Level', project.airtightness_al, ' ACH50');
    addDetailItem('Building Volume', project.building_volume, ' m3');
    y -= 15;

    addSectionTitle('Compliance Summary');
    addDetailItem('Compliance Status', project.compliance_status);
    addDetailItem('Performance Result', project.performance_compliance_result);
    addDetailItem('Total Points (Tiered Path)', project.total_points);
    y -= 15;

    if (project.uploaded_files && project.uploaded_files.length > 0) {
        addSectionTitle('Uploaded Documents');
        project.uploaded_files.forEach((file: any) => {
            checkPageBreak(15);
            page.drawText(`• ${file.name}`, { x: margin, y, font, size: 10 });
            y -= 15;
        });
    }

    // Add page numbers to all pages
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        p.drawText(`Page ${i + 1} of ${pages.length}`, {
            x: width / 2 - 20,
            y: 30,
            size: 8,
            font,
        });
    }

    return await pdfDoc.save();
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