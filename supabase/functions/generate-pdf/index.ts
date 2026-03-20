// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { PDFDocument, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import { encode, decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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

const buildReportPdf = async (project: any, company: any, logoBytes?: Uint8Array) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const margin = 30;
  
  let currentY = pageHeight - margin;

  // 1. Stylized Top Header: Logo (left) and Title (right)
  const headerHeight = 50;
  const logoImage = logoBytes && logoBytes.length > 0 ? await pdfDoc.embedPng(logoBytes).catch(() => null) : null;
  
  if (logoImage) {
    const { width: lw, height: lh } = logoImage.scale(1);
    const scale = (headerHeight - 10) / lh;
    page.drawImage(logoImage, {
      x: margin,
      y: currentY - headerHeight + 5,
      width: lw * scale,
      height: lh * scale,
    });
  }

  const titleText = '9.36 PROJECT SUMMARY';
  const titleSize = 18;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
  page.drawText(titleText, {
    x: pageWidth - margin - titleWidth,
    y: currentY - 30,
    font: boldFont,
    size: titleSize,
    color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 }
  });

  currentY -= headerHeight + 10;

  // 2. Project Name (Full Width)
  const projectName = sanitize(project.project_name || 'Unnamed Project');
  page.drawText(projectName, {
    x: margin,
    y: currentY,
    font: boldFont,
    size: 14,
    color: { type: 'RGB', red: 0, green: 0, blue: 0 }
  });
  currentY -= 18;

  // 3. Project Address (Below Name)
  const projectAddress = sanitize(project.location || 'Not specified');
  page.drawText(projectAddress, {
    x: margin,
    y: currentY,
    font,
    size: 10,
    color: { type: 'RGB', red: 0.4, green: 0.4, blue: 0.4 }
  });
  currentY -= 25;

  // Divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: pageWidth - margin, y: currentY },
    thickness: 1,
    color: { type: 'RGB', red: 0.8, green: 0.8, blue: 0.8 }
  });
  currentY -= 20;

  const columnWidth = (pageWidth - margin * 3) / 2;
  const leftColX = margin;
  const rightColX = margin * 2 + columnWidth;
  
  let leftY = currentY;
  let rightY = currentY;

  // Header info
  const headerFontSize = 10;
  const projectVal = sanitize(`${project.id || ''} - ${project.project_name || 'Unnamed Project'}`);
  const companyVal = sanitize(company?.company_name || 'Not specified');
  const addressVal = sanitize(project.location || 'Not specified');
  const climateZoneVal = sanitize(project.climate_zone || 'Not specified');
  const occupancyVal = sanitize(project.occupancy_class || 'Not specified');
  const pathwayVal = sanitize(displayPathway(project.selected_pathway));

  // Top header block
  currentY -= 15;
  const col1X = margin;
  const col2X = margin + 250;
  const col3X = margin + 500;

  page.drawText('Project:', { x: col1X, y: currentY, font, size: headerFontSize });
  page.drawText(projectVal, { x: col1X + 45, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  page.drawText('Company:', { x: col2X, y: currentY, font, size: headerFontSize });
  page.drawText(companyVal, { x: col2X + 55, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  page.drawText('Address:', { x: col3X, y: currentY, font, size: headerFontSize });
  page.drawText(addressVal, { x: col3X + 50, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  currentY -= 18;

  page.drawText('Climate Zone:', { x: col1X, y: currentY, font, size: headerFontSize });
  page.drawText(climateZoneVal, { x: col1X + 70, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  page.drawText('Occupancy:', { x: col2X, y: currentY, font, size: headerFontSize });
  page.drawText(occupancyVal, { x: col2X + 60, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  page.drawText('Pathway:', { x: col3X, y: currentY, font, size: headerFontSize });
  page.drawText(pathwayVal, { x: col3X + 50, y: currentY, font: boldFont, size: headerFontSize, color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.5 } });

  currentY -= 20;
  // Divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: pageWidth - margin, y: currentY },
    thickness: 1,
    color: { type: 'RGB', red: 0.8, green: 0.8, blue: 0.8 }
  });
  currentY -= 15;

  const drawSection = (x: number, startY: number, title: string, items: {label: string, value: string}[]) => {
    let y = startY;
    const headerHeight = 20;
    
    // Draw background for header
    page.drawRectangle({
      x: x,
      y: y - headerHeight,
      width: columnWidth,
      height: headerHeight,
      color: { type: 'RGB', red: 0.2, green: 0.35, blue: 0.6 },
    });
    
    page.drawText(title, {
      x: x + 10,
      y: y - 14,
      font: boldFont,
      size: 10,
      color: { type: 'RGB', red: 1, green: 1, blue: 1 },
    });
    
    y -= headerHeight;

    const baseRowHeight = 18;
    const valueOffsetX = columnWidth * 0.45; 
    const maxValueWidth = columnWidth - valueOffsetX - 10;
    const maxLabelWidth = valueOffsetX - 15;
    const sectionTopY = y;

    items.forEach((item, idx) => {
      const safeVal = sanitize(item.value);
      const safeLabel = sanitize(item.label);
      
      // Wrap Label
      const labelWords = safeLabel.split(' ');
      let labelLines: string[] = [];
      let currentLabelLine = '';
      labelWords.forEach(word => {
        const testLine = currentLabelLine ? `${currentLabelLine} ${word}` : word;
        if (font.widthOfTextAtSize(testLine, 9) > maxLabelWidth && currentLabelLine !== '') {
          labelLines.push(currentLabelLine);
          currentLabelLine = word;
        } else {
          currentLabelLine = testLine;
        }
      });
      labelLines.push(currentLabelLine);

      // Wrap Value
      const valueWords = safeVal.split(' ');
      let valueLines: string[] = [];
      let currentValueLine = '';
      valueWords.forEach(word => {
        let testLine = currentValueLine ? `${currentValueLine} ${word}` : word;
        if (boldFont.widthOfTextAtSize(testLine, 9) > maxValueWidth) {
          if (currentValueLine === '') {
            while (boldFont.widthOfTextAtSize(testLine + '...', 9) > maxValueWidth && testLine.length > 0) {
              testLine = testLine.slice(0, -1);
            }
            valueLines.push(testLine + '...');
            currentValueLine = '';
          } else {
            valueLines.push(currentValueLine);
            currentValueLine = word;
          }
        } else {
          currentValueLine = testLine;
        }
      });
      if (currentValueLine) valueLines.push(currentValueLine);

      const itemRowHeight = Math.max(baseRowHeight, (labelLines.length * 10) + 8, (valueLines.length * 10) + 8);

      // zebra banding background
      if (idx % 2 === 0) {
        page.drawRectangle({
          x: x + 1,
          y: y - itemRowHeight + 1,
          width: columnWidth - 2,
          height: itemRowHeight - 2,
          color: { type: 'RGB', red: 0.96, green: 0.97, blue: 0.99 },
        });
      }

      // Draw wrapped label lines
      labelLines.forEach((line, lineIdx) => {
        page.drawText(line, {
          x: x + 10,
          y: y - 12 - (lineIdx * 10),
          font,
          size: 9,
          color: { type: 'RGB', red: 0.3, green: 0.3, blue: 0.3 },
        });
      });
      
      // Draw wrapped value lines
      valueLines.forEach((line, lineIdx) => {
        page.drawText(line, {
          x: x + valueOffsetX,
          y: y - 12 - (lineIdx * 10),
          font: boldFont,
          size: 9,
          color: { type: 'RGB', red: 0.1, green: 0.2, blue: 0.4 },
        });
      });
      
      y -= itemRowHeight;
    });

    // Draw full border
    page.drawRectangle({
      x: x,
      y: y,
      width: columnWidth,
      height: sectionTopY - y,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.8 },
      borderWidth: 1,
    });

    return y - 15; 
  };

  const getAirtightnessDisplay = (val: any) => val ? String(val) : 'Not specified';

  // Left Column Sections
  leftY = drawSection(leftColX, leftY, 'CONTACT INFORMATION', [
    { label: 'Company:', value: company?.company_name || 'Not specified' },
    { label: 'Phone:', value: company?.phone || 'Not specified' },
    { label: 'Email:', value: company?.contact_email || 'Not specified' },
    { label: 'Website:', value: company?.website || 'Not specified' },
  ]);

  leftY = drawSection(leftColX, leftY, 'BUILDING ENVELOPE', [
    { label: 'Ceilings / Attic RSI:', value: project.attic_rsi ? `${project.attic_rsi} RSI` : '-' },
    { label: 'Above-Grade Wall RSI:', value: project.wall_rsi ? `${project.wall_rsi} RSI` : '-' },
    { label: 'Below-Grade Wall RSI:', value: project.below_grade_rsi ? `${project.below_grade_rsi} RSI` : '-' },
    { label: 'Exposed Floor RSI:', value: project.floor_rsi ? `${project.floor_rsi} RSI` : '-' },
    { label: 'Heated Floors RSI:', value: project.heated_floors_rsi ? `${project.heated_floors_rsi} RSI` : '-' },
    { label: 'In-Floor Heat / Rough-In:', value: project.in_floor_heat_rsi ? `Yes` : 'No' },
    { label: 'Floor / Slab Type:', value: asList(project.floors_slabs_selected) || '-' },
    { label: 'Cathedral / Flat Roof:', value: project.has_cathedral_or_flat_roof ? 'Yes' : 'No' },
    { label: 'Skylights:', value: project.has_skylights ? 'Yes' : 'No' },
  ]);
  
  const uploadStr = project.uploaded_files && Array.isArray(project.uploaded_files) && project.uploaded_files.length > 0 
    ? project.uploaded_files[0].name : 'No files uploaded';

  leftY = drawSection(leftColX, leftY, 'UPLOADED DOCUMENTS', [
    { label: 'File:', value: uploadStr },
  ]);


  // Right Column Sections
  rightY = drawSection(rightColX, rightY, 'COMPLIANCE SUMMARY', [
    { label: 'Compliance Pathway:', value: pathwayVal },
    { label: 'Climate Zone:', value: climateZoneVal },
    { label: 'Front Door Orient.:', value: project.front_door_orientation || '-' },
    { label: 'Floor Area:', value: project.floor_area ? `${project.floor_area} m²` : '-' },
    { label: 'EnerGuide Pathway:', value: project.energuide_pathway ? 'Yes' : 'No' },
    { label: 'Total Points:', value: project.total_points ? String(project.total_points) : '0' },
  ]);

  rightY = drawSection(rightColX, rightY, 'AIR TIGHTNESS & LEAKAGE', [
    { label: 'Airtightness Level:', value: getAirtightnessDisplay(project.airtightness_al) },
    { label: 'Mid-Construction Blower Door:', value: project.mid_construction_blower_door_planned ? 'Yes' : 'No' },
  ]);

  rightY = drawSection(rightColX, rightY, 'MECHANICAL SYSTEMS', [
    { label: 'Primary Heating:', value: project.heating_system_type || '-' },
    { label: 'Heating Efficiency:', value: project.heating_efficiency ? String(project.heating_efficiency) : '-' },
    { label: 'Cooling System:', value: project.cooling_system_type || '-' },
    { label: 'Domestic Hot Water:', value: project.water_heating_type || '-' },
    { label: 'Ventilation (HRV/ERV):', value: project.hrv_erv_type || '-' },
    { label: 'Secondary HRV:', value: project.has_secondary_hrv ? 'Yes' : 'No' },
    { label: 'Drain Water Heat Recovery:', value: project.has_dwhr ? 'Yes' : 'No' },
  ]);

  rightY = drawSection(rightColX, rightY, 'MURB & OPTIONAL', [
    { label: 'Multiple MURB Heating:', value: project.has_murb_multiple_heating ? 'Yes' : 'No' },
    { label: 'Multiple MURB Water Heaters:', value: project.has_murb_multiple_water_heaters ? 'Yes' : 'No' },
  ]);

  rightY = drawSection(rightColX, rightY, 'NOTES', [
    { label: 'Notes:', value: project.notes || '-' },
  ]);

  const bottomY = Math.min(leftY, rightY) - 10;

  // Acknowledgement Box Wrapping
  const ackTitle = 'ACKNOWLEDGEMENT';
  const ackText1 = 'I agree to notify my energy advisor before making any changes to the design, including envelope components, windows, or mechanical systems. This ensures ongoing compliance during construction. Design changes may result in additional charges. I commit to ensuring the building plans match the designed energy model and the as-constructed state.';
  
  const ackMaxWidth = pageWidth - 2 * margin - 20;
  const ackWords = ackText1.split(' ');
  let ackLines: string[] = [];
  let currentAckLine = '';
  
  ackWords.forEach(word => {
    const testLine = currentAckLine ? `${currentAckLine} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, 8) > ackMaxWidth) {
      ackLines.push(currentAckLine);
      currentAckLine = word;
    } else {
      currentAckLine = testLine;
    }
  });
  ackLines.push(currentAckLine);

  const ackBoxHeight = 30 + (ackLines.length * 10);
  
  page.drawRectangle({
    x: margin,
    y: bottomY - ackBoxHeight,
    width: pageWidth - 2 * margin,
    height: ackBoxHeight,
    borderColor: { type: 'RGB', red: 0.9, green: 0.7, blue: 0.2 },
    borderWidth: 1,
    color: { type: 'RGB', red: 0.99, green: 0.97, blue: 0.9 },
  });

  page.drawText(ackTitle, {
    x: margin + 10,
    y: bottomY - 15,
    font: boldFont,
    size: 10,
    color: { type: 'RGB', red: 0.9, green: 0.5, blue: 0 },
  });

  ackLines.forEach((line, idx) => {
    page.drawText(line, {
      x: margin + 10,
      y: bottomY - 30 - (idx * 10),
      font,
      size: 8,
      color: { type: 'RGB', red: 0.3, green: 0.3, blue: 0.3 },
    });
  });

  const bytes = await pdfDoc.save();
  return bytes;
};

const buildChecklistPdf = async (project: any, company: any, logoBytes?: Uint8Array) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const margin = 30;
  let currentY = pageHeight - margin;

  const logoImage = logoBytes && logoBytes.length > 0 ? await pdfDoc.embedPng(logoBytes).catch(() => null) : null;
  if (logoImage) {
    const { width: lw, height: lh } = logoImage.scale(1);
    const scale = 40 / lh;
    page.drawImage(logoImage, { x: margin, y: currentY - 40, width: lw * scale, height: 40 });
  }

  // Header Text
  const headerLines = [
    'BUILDING & DEVELOPMENT PERMIT APPLICATION',
    'TIERED PRESCRIPTIVE COMPLIANCE',
    'Section 9.36 of the National Building Code of Canada'
  ];

  headerLines.forEach((line, i) => {
    const size = i === 1 ? 12 : 10;
    const f = i === 1 ? boldFont : font;
    const w = f.widthOfTextAtSize(line, size);
    page.drawText(line, { x: pageWidth / 2 + 20, y: currentY - (i * 15), font: f, size });
  });

  currentY -= 60;

  // Intro text
  page.drawText('This form is intended to clarify the compliance with Section 9.36, prescriptive path.', { x: margin, y: currentY, font: boldFont, size: 11 });
  currentY -= 15;
  const introSub = 'Must be completed by a competent person who is knowledgeable, experienced, and trained in building\ndesign under Section 9.36 of the NBC and acceptable to the Authority Having Jurisdiction.';
  introSub.split('\n').forEach(line => {
    page.drawText(line, { x: margin, y: currentY, font: font, size: 10, italic: true });
    currentY -= 12;
  });

  currentY -= 10;

  // Project Information Table
  const tableWidth = pageWidth - 2 * margin;
  page.drawRectangle({ x: margin, y: currentY - 18, width: tableWidth, height: 18, color: { type: 'RGB', red: 0.9, green: 0.9, blue: 0.9 }, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
  page.drawText('Project Information', { x: margin + 5, y: currentY - 13, font: boldFont, size: 10 });
  currentY -= 18;

  const drawRow = (labels: string[], values: string[], colWidths: number[]) => {
    let x = margin;
    const rowHeight = 20;
    labels.forEach((label, i) => {
      page.drawRectangle({ x, y: currentY - rowHeight, width: colWidths[i], height: rowHeight, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
      page.drawText(label, { x: x + 2, y: currentY - 13, font, size: 9 });
      const labelW = font.widthOfTextAtSize(label, 9);
      page.drawText(sanitize(values[i]), { x: x + labelW + 5, y: currentY - 13, font: boldFont, size: 9 });
      x += colWidths[i];
    });
    currentY -= rowHeight;
  };

  drawRow(['Address:', 'Climate Zone:'], [project.location || '', project.climate_zone || ''], [tableWidth * 0.75, tableWidth * 0.25]);
  drawRow(['Occupancy Class:', 'Conditioned Space Volume (m³):'], [project.occupancy_class || '', project.building_volume ? String(project.building_volume) : ''], [tableWidth * 0.4, tableWidth * 0.6]);

  // Tier Selection
  page.drawRectangle({ x: margin, y: currentY - 20, width: tableWidth, height: 20, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
  page.drawText('Select Performance Tier', { x: margin + 5, y: currentY - 14, font, size: 9 });
  let tierX = margin + 110;
  const tiers = ['Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
  tiers.forEach(tier => {
    page.drawRectangle({ x: tierX, y: currentY - 15, width: 8, height: 8, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
    page.drawText(tier, { x: tierX + 12, y: currentY - 14, font, size: 9 });
    tierX += 60;
  });
  currentY -= 20;

  currentY -= 10;

  // Checklist Sections
  const drawChecklistHeader = (title: string) => {
    page.drawRectangle({ x: margin, y: currentY - 18, width: tableWidth, height: 18, color: { type: 'RGB', red: 0.9, green: 0.9, blue: 0.9 }, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
    page.drawText(title, { x: margin + 5, y: currentY - 13, font: boldFont, size: 10, color: { type: 'RGB', red: 0, green: 0, blue: 0 } });
    currentY -= 18;
  };

  const drawChecklistRow = (col1: string, col2: string, col3: string, col4: string) => {
    const rowHeight = 18;
    const w1 = tableWidth * 0.35;
    const w2 = tableWidth * 0.25;
    const w3 = tableWidth * 0.25;
    const w4 = tableWidth * 0.15;
    
    [w1, w2, w3, w4].reduce((currX, w, i) => {
      page.drawRectangle({ x: currX, y: currentY - rowHeight, width: w, height: rowHeight, borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 }, borderWidth: 0.5 });
      const text = [col1, col2, col3, col4][i];
      if (text) {
        page.drawText(sanitize(text), { x: currX + 5, y: currentY - 13, font: i === 0 ? font : boldFont, size: 8 });
      }
      return currX + w;
    }, margin);
    currentY -= rowHeight;
  };

  drawChecklistHeader('Effective Thermal Resistance of Above Ground Opaque Building Assemblies (RSI)');
  drawChecklistRow('Assembly', 'w/ HRV', 'w/o HRV', 'Proposed');
  drawChecklistRow('Ceilings below attics', '8.67', '10.43', project.attic_rsi ? String(project.attic_rsi) : '');
  drawChecklistRow('Cathedral / Flat roofs', '5.02', '5.02', project.cathedral_flat_rsi ? String(project.cathedral_flat_rsi) : '');
  drawChecklistRow('Walls & Rim joists', '2.97', '3.08', project.wall_rsi ? String(project.wall_rsi) : '');
  drawChecklistRow('Floors over unheated spaces', '5.02', '5.02', project.floor_rsi ? String(project.floor_rsi) : '');
  drawChecklistRow('Floors within garage', '4.86', '4.86', project.floors_garage_rsi ? String(project.floors_garage_rsi) : '');

  drawChecklistHeader('Thermal Characteristics of Fenestration, Doors and Skylights (U)');
  drawChecklistRow('Assembly', 'Efficiency', '', 'Proposed');
  drawChecklistRow('Windows & Doors', 'Max U-Value 1.61', '', project.window_u_value ? String(project.window_u_value) : '');
  drawChecklistRow('One door exception', 'Max U-Value 2.60', '', '');
  drawChecklistRow('Attic hatch', 'Min RSI 2.60', '', '');
  drawChecklistRow('Skylights', 'Max U-Value 2.75', '', project.skylight_u_value ? String(project.skylight_u_value) : '');

  drawChecklistHeader('Effective Thermal Resistance of Below-Grade Opaque Buildings Assemblies (RSI)');
  drawChecklistRow('Assembly', 'w/ HRV', 'w/o HRV', 'Proposed');
  drawChecklistRow('Foundation Walls', '2.98', '3.46', project.below_grade_rsi ? String(project.below_grade_rsi) : '');
  drawChecklistRow('Slab On Grade Integral Footing', '2.84', '3.72', project.slab_on_grade_integral_footing_rsi ? String(project.slab_on_grade_integral_footing_rsi) : '');
  drawChecklistRow('Unheated Floor Below Frost', 'uninsulated', 'uninsulated', project.unheated_floor_below_frost_rsi ? String(project.unheated_floor_below_frost_rsi) : '');
  drawChecklistRow('Unheated Floor Above Frost', '1.96', '1.96', project.unheated_floor_above_frost_rsi ? String(project.unheated_floor_above_frost_rsi) : '');
  drawChecklistRow('Heated Floors', '2.84', '2.84', project.heated_floors_rsi ? String(project.heated_floors_rsi) : '');

  currentY -= 20;
  const footerText = `Updated September 2025        Section 9.36 – Tiered Prescriptive / Trade-Off Compliance Form        Page 1 of 1`;
  page.drawText(footerText, { x: margin, y: 20, font, size: 8 });

  const bytes = await pdfDoc.save();
  return bytes;
};

const buildPdf = async (project: any, company: any, logoBytes?: Uint8Array) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage();
  let { width: pageWidth, height: pageHeight } = page.getSize();
  const margin = 50;
  const lineHeight = 14;
  const sectionTitleSize = 16;

  const state = { y: pageHeight - margin };

  const logoImage = logoBytes && logoBytes.length > 0 ? await pdfDoc.embedPng(logoBytes) : null;

  const drawHeader = () => {
    const headerTopY = pageHeight - margin;
    const nameFontSize = 10;
    const dateFontSize = 8;

    // Compute logo dimensions (if present)
    let logoWidthUsed = 0;
    let logoHeightUsed = 0;
    if (logoImage) {
      const logoMaxHeight = 40; // target max height
      const { width: lw, height: lh } = logoImage.scale(1);
      const scale = logoMaxHeight / lh;
      logoWidthUsed = lw * scale;
      logoHeightUsed = lh * scale;
    }

    // Compute text block height (project name + date + spacing)
    const nameHeight = boldFont.heightAtSize(nameFontSize);
    const textSpacing = 12; // space between name and date
    const textBlockHeight = nameHeight + textSpacing;

    // Header row height and center
    const headerRowHeight = Math.max(logoHeightUsed || 0, textBlockHeight);
    const headerCenterY = headerTopY - headerRowHeight / 2;

    // Draw logo centered vertically on header row
    let headerLeftX = margin;
    if (logoImage) {
      page.drawImage(logoImage, {
        x: headerLeftX,
        y: headerCenterY - (logoHeightUsed / 2),
        width: logoWidthUsed,
        height: logoHeightUsed,
      });
      headerLeftX += logoWidthUsed + 12;
    }

    // Project name centered vertically
    const projectNameText = sanitize(project.project_name || 'Unnamed Project');
    const projectNameWidth = boldFont.widthOfTextAtSize(projectNameText, nameFontSize);
    const projectNameBaselineY = headerCenterY - (nameHeight / 2);
    page.drawText(projectNameText, {
      x: pageWidth - margin - projectNameWidth,
      y: projectNameBaselineY,
      font: boldFont,
      size: nameFontSize,
    });

    // Date below the project name
    const dateText = sanitize(new Date().toLocaleDateString());
    const dateWidth = font.widthOfTextAtSize(dateText, dateFontSize);
    const dateBaselineY = projectNameBaselineY - textSpacing;
    page.drawText(dateText, {
      x: pageWidth - margin - dateWidth,
      y: dateBaselineY,
      font,
      size: dateFontSize,
    });

    // Start content below header row
    state.y = headerTopY - headerRowHeight - 12;
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

  // Section spacing adjustments:
  const addSectionTitle = (title: string) => {
    const safeTitle = sanitize(title);
    const topSpaceBeforeTitle = 18; // padding before section title
    const gapBetweenTitleAndLine = 3; // tight gap
    const spaceAfterLine = 16; // increased space before content

    addSpacer(topSpaceBeforeTitle);
    checkPageBreak(sectionTitleSize + gapBetweenTitleAndLine + spaceAfterLine);
    page.drawText(safeTitle, { x: margin, y: state.y, font: boldFont, size: sectionTitleSize });
    state.y -= (sectionTitleSize + gapBetweenTitleAndLine);
    page.drawLine({
      start: { x: margin, y: state.y },
      end: { x: pageWidth - margin, y: state.y },
      thickness: 0.75,
    });
    state.y -= spaceAfterLine;
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
  addDetailItem('Notes', (project.notes && project.notes.trim()) ? project.notes : '-');

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

  // Footer: copyright on left, pagination on right
  const pages = pdfDoc.getPages();
  const footerFontSize = 9;
  const footerText = sanitize('© 2025 Energy Navigator 9.36. All rights reserved.');
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const size = p.getSize();

    // Left-side copyright
    p.drawText(footerText, {
      x: margin,
      y: 24, // near bottom
      size: footerFontSize,
      font,
    });

    // Right-side pagination
    const pageText = sanitize(`Page ${i + 1} of ${pages.length}`);
    const pageTextWidth = font.widthOfTextAtSize(pageText, footerFontSize);
    p.drawText(pageText, {
      x: size.width - margin - pageTextWidth,
      y: 24,
      size: footerFontSize,
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
    const { projectId, logoBase64, type } = await req.json();
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

    const logoBytes = logoBase64 ? decode(logoBase64) : undefined;

    let pdfBytes;
    if (type === 'report') {
      pdfBytes = await buildReportPdf(project, company, logoBytes);
    } else if (type === 'checklist') {
      pdfBytes = await buildChecklistPdf(project, company, logoBytes);
    } else {
      pdfBytes = await buildPdf(project, company, logoBytes);
    }
    
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