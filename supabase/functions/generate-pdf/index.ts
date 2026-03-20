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

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const margin = 18;
  const contentWidth = width - margin * 2;

  const colors = {
    navy: { type: 'RGB', red: 24 / 255, green: 63 / 255, blue: 122 / 255 },
    navyDark: { type: 'RGB', red: 17 / 255, green: 45 / 255, blue: 89 / 255 },
    lightBlue: { type: 'RGB', red: 232 / 255, green: 238 / 255, blue: 247 / 255 },
    lightGray: { type: 'RGB', red: 242 / 255, green: 244 / 255, blue: 247 / 255 },
    midGray: { type: 'RGB', red: 220 / 255, green: 224 / 255, blue: 230 / 255 },
    textDark: { type: 'RGB', red: 55 / 255, green: 65 / 255, blue: 81 / 255 },
    textMuted: { type: 'RGB', red: 107 / 255, green: 114 / 255, blue: 128 / 255 },
    orange: { type: 'RGB', red: 232 / 255, green: 145 / 255, blue: 38 / 255 },
    white: { type: 'RGB', red: 1, green: 1, blue: 1 },
    border: { type: 'RGB', red: 205 / 255, green: 212 / 255, blue: 222 / 255 },
  };

  const sanitizeText = (v: any) => sanitize(v || '-');

  const formatDateLong = () => {
    try {
      return new Date().toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const formatYesNo = (v: any) => (v ? 'Yes' : 'No');

  const formatNumber = (v: any, suffix = '') => {
    if (v === null || v === undefined || v === '') return '-';
    return `${sanitize(v)}${suffix ? ` ${suffix}` : ''}`;
  };

  const drawText = (
    text: string,
    x: number,
    y: number,
    options: {
      size?: number;
      fontRef?: any;
      color?: any;
      maxWidth?: number;
      lineHeight?: number;
    } = {}
  ) => {
    const size = options.size ?? 9;
    const fontRef = options.fontRef ?? font;
    const color = options.color ?? colors.textDark;
    const maxWidth = options.maxWidth ?? 9999;
    const lineHeight = options.lineHeight ?? (size + 2);

    const words = sanitizeText(text).split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const testWidth = fontRef.widthOfTextAtSize(test, size);

      if (testWidth <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);

    lines.forEach((line, i) => {
      page.drawText(line, {
        x,
        y: y - i * lineHeight,
        size,
        font: fontRef,
        color,
      });
    });

    return lines.length * lineHeight;
  };

  const drawRoundedBox = (
    x: number,
    y: number,
    w: number,
    h: number,
    opts: { fill?: any; border?: any; borderWidth?: number; radius?: number } = {}
  ) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: opts.fill,
      borderColor: opts.border,
      borderWidth: opts.borderWidth ?? 0,
      borderRadius: opts.radius ?? 6,
    });
  };

  const drawSectionCard = (
    x: number,
    topY: number,
    w: number,
    title: string,
    items: { label: string; value: string }[]
  ) => {
    const headerH = 16;
    const rowBaseH = 16;
    const labelX = x + 8;
    const valueX = x + w * 0.55;
    const labelWidth = w * 0.50 - 12;
    const valueWidth = w - (valueX - x) - 8;

    // calcula altura total antes de desenhar
    let bodyHeight = 0;
    const rowHeights: number[] = [];

    for (const item of items) {
      const labelLines = Math.max(
        1,
        Math.ceil(font.widthOfTextAtSize(sanitizeText(item.label), 8) / labelWidth)
      );
      const valueLines = Math.max(
        1,
        Math.ceil(boldFont.widthOfTextAtSize(sanitizeText(item.value), 8) / valueWidth)
      );
      const rowH = Math.max(rowBaseH, Math.max(labelLines, valueLines) * 9 + 5);
      rowHeights.push(rowH);
      bodyHeight += rowH;
    }

    const totalH = headerH + bodyHeight;

    // card externo
    drawRoundedBox(x, topY - totalH, w, totalH, {
      fill: colors.white,
      border: colors.border,
      borderWidth: 1,
      radius: 4,
    });

    page.drawRectangle({
      x: 0,
      y: height - 3,
      width,
      height: 3,
      color: colors.orange,
    });

    // header azul
    page.drawRectangle({
      x,
      y: topY - headerH,
      width: w,
      height: headerH,
      color: colors.navy,
      borderRadius: 4,
    });

    page.drawText(sanitizeText(title).toUpperCase(), {
      x: x + 8,
      y: topY - 11,
      size: 8,
      font: boldFont,
      color: colors.white,
    });

    let rowTop = topY - headerH;

    items.forEach((item, index) => {
      const rowH = rowHeights[index];
      const rowY = rowTop - rowH;

      if (index % 2 === 0) {
        page.drawRectangle({
          x: x + 1,
          y: rowY + 1,
          width: w - 2,
          height: rowH - 2,
          color: colors.lightGray,
        });
      }

      drawText(item.label, labelX, rowTop - 11, {
        size: 8,
        fontRef: font,
        color: colors.textMuted,
        maxWidth: labelWidth,
        lineHeight: 9,
      });

      drawText(item.value, valueX, rowTop - 11, {
        size: 8,
        fontRef: boldFont,
        color: colors.navyDark,
        maxWidth: valueWidth,
        lineHeight: 9,
      });

      // divisória interna
      page.drawLine({
        start: { x, y: rowY },
        end: { x: x + w, y: rowY },
        thickness: 0.4,
        color: colors.midGray,
      });

      rowTop = rowY;
    });

    return topY - totalH - 10;
  };

  // -----------------------------
  // HEADER
  // -----------------------------
  const headerH = 56;

  // fundo branco + linha inferior
  page.drawRectangle({
    x: 0,
    y: height - headerH,
    width,
    height: headerH,
    color: colors.white,
  });

  page.drawLine({
    start: { x: 0, y: height - headerH },
    end: { x: width, y: height - headerH },
    thickness: 1.2,
    color: colors.navyDark,
  });

  const logoImage = logoBytes?.length
    ? await pdfDoc.embedPng(logoBytes).catch(() => null)
    : null;

  if (logoImage) {
    const dims = logoImage.scale(1);
    const targetH = 28;
    const scale = targetH / dims.height;
    page.drawImage(logoImage, {
      x: margin,
      y: height - 42,
      width: dims.width * scale,
      height: dims.height * scale,
    });
  }

  page.drawText('9.36 PROJECT SUMMARY', {
    x: 215,
    y: height - 28,
    size: 13,
    font: boldFont,
    color: colors.navyDark,
  });

  page.drawText('NBC 2020 Division B Section 9.36 Compliance', {
    x: 215,
    y: height - 38,
    size: 7.5,
    font,
    color: colors.textMuted,
  });

  page.drawText(formatDateLong(), {
    x: width - 100,
    y: height - 24,
    size: 6.5,
    font,
    color: colors.textMuted,
  });

  // Opcional: badge azul da direita
  // Se você NÃO quiser esse elemento, mantenha comentado.
  /*
  drawRoundedBox(width - 140, height - 50, 120, 14, {
    fill: colors.navy,
    radius: 4,
  });
  page.drawText(sanitizeText(displayPathway(project.selected_pathway)), {
    x: width - 134,
    y: height - 45,
    size: 6.5,
    font: boldFont,
    color: colors.white,
  });
  */

  // -----------------------------
  // QUICK INFO STRIP
  // -----------------------------
  let cursorY = height - headerH - 8;
  const stripH = 34;

  drawRoundedBox(margin, cursorY - stripH, contentWidth, stripH, {
    fill: colors.lightGray,
    border: colors.border,
    borderWidth: 1,
    radius: 5,
  });

  const quickItems = [
    { label: 'Project:', value: sanitizeText(project.project_name || '-') },
    { label: 'Builder Company:', value: sanitizeText(company?.company_name || '-') },
    { label: 'Climate Zone:', value: sanitizeText(project.climate_zone || '-') },
    { label: 'Compliance:', value: sanitizeText(displayPathway(project.selected_pathway)) },
  ];

  const quickColW = contentWidth / 4;

  quickItems.forEach((item, i) => {
    const x = margin + i * quickColW + 8;
    page.drawText(item.label, {
      x,
      y: cursorY - 13,
      size: 6.5,
      font,
      color: colors.textMuted,
    });

    drawText(item.value, x, cursorY - 23, {
      size: 7.2,
      fontRef: boldFont,
      color: colors.navyDark,
      maxWidth: quickColW - 16,
      lineHeight: 8,
    });
  });

  cursorY -= stripH + 12;

  // -----------------------------
  // TWO-COLUMN LAYOUT
  // -----------------------------
  const gap = 14;
  const colW = (contentWidth - gap) / 2;
  const leftX = margin;
  const rightX = margin + colW + gap;

  let leftY = cursorY;
  let rightY = cursorY;

  const uploadStr =
    project.uploaded_files && Array.isArray(project.uploaded_files) && project.uploaded_files.length > 0
      ? project.uploaded_files[0]?.name || 'Uploaded file'
      : 'No files uploaded';

  leftY = drawSectionCard(leftX, leftY, colW, 'Contact Information', [
    { label: 'Company:', value: sanitizeText(company?.company_name || '-') },
    { label: 'Phone:', value: sanitizeText(company?.phone || '-') },
    { label: 'Email:', value: sanitizeText(company?.contact_email || '-') },
    { label: 'Website:', value: sanitizeText(company?.website || '-') },
  ]);

  leftY = drawSectionCard(leftX, leftY, colW, 'Building Envelope', [
    { label: 'Ceilings / Attic RSI:', value: formatNumber(project.attic_rsi, 'RSI') },
    { label: 'Above-Grade Wall RSI:', value: formatNumber(project.wall_rsi, 'RSI') },
    { label: 'Below-Grade Wall RSI:', value: formatNumber(project.below_grade_rsi, 'RSI') },
    { label: 'Heated Floors RSI:', value: formatNumber(project.heated_floors_rsi, 'RSI') },
    { label: 'In-Floor Heat / Rough-In:', value: project.in_floor_heat_rsi ? 'Yes — Rough-In' : 'No' },
    { label: 'Floor / Slab Type:', value: asList(project.floors_slabs_selected) || '-' },
    { label: 'Cathedral / Flat Roof:', value: formatYesNo(project.has_cathedral_or_flat_roof) },
    { label: 'Skylights:', value: formatYesNo(project.has_skylights) },
  ]);

  leftY = drawSectionCard(leftX, leftY, colW, 'Uploaded Documents', [
    { label: 'File:', value: sanitizeText(uploadStr) },
  ]);

  rightY = drawSectionCard(rightX, rightY, colW, 'Compliance Summary', [
    { label: 'Compliance Pathway:', value: sanitizeText(displayPathway(project.selected_pathway)) },
    { label: 'Climate Zone:', value: sanitizeText(project.climate_zone || '-') },
    { label: 'Front Door Orient.:', value: sanitizeText(project.front_door_orientation || '-') },
    { label: 'Floor Area:', value: formatNumber(project.floor_area, 'm²') },
    { label: 'EnerGuide Pathway:', value: formatYesNo(project.energuide_pathway) },
    { label: 'Total Points:', value: sanitizeText(project.total_points ?? '0') },
  ]);

  rightY = drawSectionCard(rightX, rightY, colW, 'Air Tightness & Leakage', [
    { label: 'Air Leakage Rate:', value: formatNumber(project.airtightness_al, 'ACH') },
    { label: 'Airtightness Level:', value: project.airtightness_al ? `${sanitize(project.airtightness_al)} ACH50` : '-' },
    { label: 'Mid-Construction Blower Door:', value: formatYesNo(project.mid_construction_blower_door_planned) },
  ]);

  rightY = drawSectionCard(rightX, rightY, colW, 'Mechanical Systems', [
    { label: 'Primary Heating:', value: sanitizeText(project.heating_system_type || '-') },
    { label: 'Heating Efficiency:', value: sanitizeText(project.heating_efficiency || '-') },
    { label: 'Cooling System:', value: sanitizeText(project.cooling_system_type || '-') },
    { label: 'Domestic Hot Water:', value: sanitizeText(project.water_heating_type || '-') },
    { label: 'Ventilation (HRV/ERV):', value: sanitizeText(project.hrv_erv_type || '-') },
    { label: 'Secondary HRV:', value: formatYesNo(project.has_secondary_hrv) },
    { label: 'Drain Water Heat Recovery:', value: formatYesNo(project.has_dwhr) },
  ]);

  rightY = drawSectionCard(rightX, rightY, colW, 'MURB & Optional', [
    { label: 'Multiple MURB Heating:', value: formatYesNo(project.has_murb_multiple_heating) },
    { label: 'Multiple MURB Water Heaters:', value: formatYesNo(project.has_murb_multiple_water_heaters) },
    { label: 'EnerGuide Pathway:', value: formatYesNo(project.energuide_pathway) },
    { label: 'Total Points (Tiered Path):', value: sanitizeText(project.total_points ?? '0') },
  ]);

  rightY = drawSectionCard(rightX, rightY, colW, 'Notes', [
    { label: 'Notes:', value: sanitizeText(project.notes || '-') },
  ]);

  // -----------------------------
  // ACKNOWLEDGEMENT
  // -----------------------------
  const bottomCardsY = Math.min(leftY, rightY);
  const ackY = bottomCardsY - 4;
  const ackH = 54;

  drawRoundedBox(margin, ackY - ackH, contentWidth, ackH, {
    fill: { type: 'RGB', red: 1, green: 0.985, blue: 0.94 },
    border: colors.orange,
    borderWidth: 1,
    radius: 4,
  });

  page.drawText('ACKNOWLEDGEMENT', {
    x: margin + 8,
    y: ackY - 12,
    size: 7.5,
    font: boldFont,
    color: colors.orange,
  });

  drawText(
    'I agree to notify my energy advisor before making any changes to the design, including envelope components, windows, or mechanical systems. This ensures ongoing compliance during construction. Design changes may result in additional charges. I commit to ensuring the building plans match the designed energy model and the as-constructed state.',
    margin + 8,
    ackY - 22,
    {
      size: 5.8,
      fontRef: font,
      color: colors.textMuted,
      maxWidth: contentWidth - 16,
      lineHeight: 7,
    }
  );

  // -----------------------------
  // FOOTER
  // -----------------------------
  const footerH = 28;

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: footerH,
    color: colors.navyDark,
  });

  page.drawRectangle({
    x: 0,
    y: footerH,
    width,
    height: 2,
    color: colors.orange,
  });

  page.drawText('www.energy-navigator.ca', {
    x: margin,
    y: 11,
    size: 5.8,
    font,
    color: colors.white,
  });

  page.drawText('© 2025 Energy Navigator 9.36. All rights reserved.', {
    x: margin,
    y: 4,
    size: 5.5,
    font,
    color: { type: 'RGB', red: 0.8, green: 0.86, blue: 0.95 },
  });

  const pageText = 'Page 1 of 1';
  const pageTextWidth = font.widthOfTextAtSize(pageText, 6);
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: 8,
    size: 6,
    font,
    color: colors.white,
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
    page.drawImage(logoImage, { x: margin, y: currentY - 29, width: lw * scale, height: 40 });
  }

  // Header Text
  const headerLines = [
    'BUILDING & DEVELOPMENT PERMIT APPLICATION',
    'TIERED PRESCRIPTIVE COMPLIANCE',
    'Section 9.36 of the National Building Code of Canada'
  ];

  const headerRightX = pageWidth - margin;

  headerLines.forEach((line, i) => {
    const size = i === 1 ? 11 : 8;
    const f = i === 1 ? boldFont : font;
    const w = f.widthOfTextAtSize(line, size);

    let y = currentY;
    if (i === 1) y = currentY - 13;
    if (i === 2) y = currentY - 22;

    page.drawText(line, {
      x: headerRightX - w,
      y,
      font: f,
      size,
    });
  });

  currentY -= 56;

  // Intro text
  const introTitle = 'This form is intended to clarify the compliance with Section 9.36, prescriptive path.';
  const introTitleSize = 10;
  const introTitleWidth = boldFont.widthOfTextAtSize(introTitle, introTitleSize);

  page.drawText(introTitle, {
    x: (pageWidth - introTitleWidth) / 2,
    y: currentY,
    font: boldFont,
    size: introTitleSize,
  });

  currentY -= 14;

  const introSub = 'Must be completed by a competent person who is knowledgeable, experienced, and trained in building\ndesign under Section 9.36 of the NBC and acceptable to the Authority Having Jurisdiction.';

  introSub.split('\n').forEach(line => {
    const safeLine = sanitize(line);
    const fontSize = 9;
    const lineWidth = font.widthOfTextAtSize(safeLine, fontSize);

    page.drawText(safeLine, {
      x: (pageWidth - lineWidth) / 2,
      y: currentY,
      font,
      size: fontSize
    });

    currentY -= 11;
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
    const leftPadding = 5;

    labels.forEach((label, i) => {
      page.drawRectangle({
        x,
        y: currentY - rowHeight,
        width: colWidths[i],
        height: rowHeight,
        borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
        borderWidth: 1
      });

      const safeLabel = sanitize(label);
      const safeValue = sanitize(values[i] || '');

      const labelX = x + leftPadding;
      page.drawText(safeLabel, {
        x: labelX,
        y: currentY - 13,
        font,
        size: 9
      });

      const labelW = font.widthOfTextAtSize(safeLabel, 9);

      page.drawText(safeValue, {
        x: labelX + labelW + 5,
        y: currentY - 13,
        font: boldFont,
        size: 9
      });

      x += colWidths[i];
    });

    currentY -= rowHeight;
  };

  drawRow(['Address:', 'Climate Zone:'], [project.location || '', project.climate_zone || ''], [tableWidth * 0.75, tableWidth * 0.25]);
  drawRow(['Occupancy Class:', 'Conditioned Space Volume (m³):'], [project.occupancy_class || '', project.building_volume ? String(project.building_volume) : ''], [tableWidth * 0.4, tableWidth * 0.6]);

  // Tier Selection
  const getTier = (points: number, hrv: string | null) => {
    // If hrv_erv_type is null or None/no_hrv/without_hrv, it doesn't have it.
    const hasHrv = hrv && hrv !== "None" && hrv !== "no_hrv" && hrv !== "without_hrv";
    if (!hasHrv) return "Not Applicable";
    
    if (points >= 75) return "Tier 5";
    if (points >= 40) return "Tier 4";
    if (points >= 20) return "Tier 3";
    if (points >= 10) return "Tier 2";
    return "Tier 1";
  };

  const currentTier = getTier(Number(project.total_points || 0), project.hrv_erv_type);

  page.drawRectangle({ x: margin, y: currentY - 20, width: tableWidth, height: 20, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
  page.drawText('Select Performance Tier', { x: margin + 5, y: currentY - 14, font, size: 9 });
  let tierX = margin + 110;
  const tiers = ['Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];
  tiers.forEach(tier => {
    const isSelected = currentTier === tier;
    page.drawRectangle({ x: tierX, y: currentY - 15, width: 8, height: 8, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
    if (isSelected) {
      // Draw an X in the box
      page.drawLine({ start: { x: tierX, y: currentY - 15 }, end: { x: tierX + 8, y: currentY - 7 }, thickness: 1 });
      page.drawLine({ start: { x: tierX + 8, y: currentY - 15 }, end: { x: tierX, y: currentY - 7 }, thickness: 1 });
    }
    page.drawText(tier, { x: tierX + 12, y: currentY - 14, font, size: 9 });
    tierX += 60;
  });
  currentY -= 20;

  currentY -= 10;

  // Energy prescriptive compliance paths row
  const energyRowHeight = 86;

  page.drawRectangle({
    x: margin,
    y: currentY - energyRowHeight,
    width: tableWidth,
    height: energyRowHeight,
    borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
    borderWidth: 1
  });

  const energyTitle = 'Energy prescriptive compliance paths apply to:';
  page.drawText(energyTitle, {
    x: margin + 8,
    y: currentY - 18,
    font: boldFont,
    size: 9
  });

  const bulletLines = [
    '• Buildings of residential occupancy to which Part 9 applies.',
    '• Buildings containing business and personal services, mercantile or low hazard industrial occupancies to which Part 9 applies',
    '  to whose combined floor area does not exceed 300 m², excluding parking garages serving residential occupancies, and',
    '• Buildings containing any mixture of the above two.'
  ];

  let bulletY = currentY - 34;

  bulletLines.forEach((line) => {
    page.drawText(sanitize(line), {
      x: margin + 28,
      y: bulletY,
      font,
      size: 8
    });
    bulletY -= 11;
  });

  currentY -= energyRowHeight;
  currentY -= 10;

  // Checklist Sections
  const drawChecklistHeader = (title: string) => {
    page.drawRectangle({
      x: margin,
      y: currentY - 18,
      width: tableWidth,
      height: 18,
      color: { type: 'RGB', red: 0.9, green: 0.9, blue: 0.9 },
      borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
      borderWidth: 1
    });

    const safeTitle = sanitize(title);
    const titleSize = 10;
    const titleWidth = boldFont.widthOfTextAtSize(safeTitle, titleSize);

    page.drawText(safeTitle, {
      x: margin + (tableWidth - titleWidth) / 2,
      y: currentY - 13,
      font: boldFont,
      size: titleSize,
      color: { type: 'RGB', red: 0, green: 0, blue: 0 }
    });

    currentY -= 18;
  };

  const drawChecklistRow = (col1: string, col2: string, col3: string, col4: string) => {
    const rowHeight = 18;
    const w1 = tableWidth * 0.35;
    const w2 = tableWidth * 0.25;
    const w3 = tableWidth * 0.25;
    const w4 = tableWidth * 0.15;

    const columns = [
      { text: col1, width: w1, fontRef: font, align: 'left' },
      { text: col2, width: w2, fontRef: font, align: 'center' },
      { text: col3, width: w3, fontRef: font, align: 'center' },
      { text: col4, width: w4, fontRef: boldFont, align: 'center' },
    ];

    let currX = margin;

    columns.forEach((col, i) => {
      page.drawRectangle({
        x: currX,
        y: currentY - rowHeight,
        width: col.width,
        height: rowHeight,
        borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
        borderWidth: 0.5
      });

      const safeText = sanitize(col.text || '');

      if (safeText) {
        const fontSize = 8;
        const textWidth = col.fontRef.widthOfTextAtSize(safeText, fontSize);

        let textX = currX + 5;

        if (col.align === 'center') {
          textX = currX + (col.width - textWidth) / 2;
        }

        page.drawText(safeText, {
          x: textX,
          y: currentY - 13,
          font: col.fontRef,
          size: fontSize
        });
      }

      currX += col.width;
    });

    currentY -= rowHeight;
  };

  const drawChecklistRowMerged23 = (col1: string, mergedCol23: string, col4: string) => {
    const rowHeight = 18;
    const w1 = tableWidth * 0.35;
    const w2 = tableWidth * 0.25;
    const w3 = tableWidth * 0.25;
    const w4 = tableWidth * 0.15;
    const mergedW = w2 + w3;
    const fontSize = 8;

    // Column 1
    page.drawRectangle({
      x: margin,
      y: currentY - rowHeight,
      width: w1,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Merged columns 2 + 3
    page.drawRectangle({
      x: margin + w1,
      y: currentY - rowHeight,
      width: mergedW,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Column 4
    page.drawRectangle({
      x: margin + w1 + mergedW,
      y: currentY - rowHeight,
      width: w4,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Col 1 = left
    if (col1) {
      page.drawText(sanitize(col1), {
        x: margin + 5,
        y: currentY - 13,
        font,
        size: fontSize,
      });
    }

    // Merged col 2+3 = centered
    if (mergedCol23) {
      const safeText = sanitize(mergedCol23);
      const textWidth = font.widthOfTextAtSize(safeText, fontSize);

      page.drawText(safeText, {
        x: margin + w1 + (mergedW - textWidth) / 2,
        y: currentY - 13,
        font: font,
        size: fontSize,
      });
    }

    // Col 4 = centered
    if (col4) {
      const safeText = sanitize(col4);
      const textWidth = boldFont.widthOfTextAtSize(safeText, fontSize);

      page.drawText(safeText, {
        x: margin + w1 + mergedW + (w4 - textWidth) / 2,
        y: currentY - 13,
        font: boldFont,
        size: fontSize,
      });
    }

    currentY -= rowHeight;
  };  

  const drawFenestrationRow = (col1: string, mergedCol23: string, col4: string) => {
    const baseRowHeight = 18;
    const w1 = tableWidth * 0.35;
    const w2 = tableWidth * 0.25;
    const w3 = tableWidth * 0.25;
    const w4 = tableWidth * 0.15;
    const mergedW = w2 + w3;
    const fontSize = 8;
    const lineHeight = 9;

    const safeCol1 = sanitize(col1 || '');
    const safeMerged = sanitize(mergedCol23 || '');
    const safeCol4 = sanitize(col4 || '');

    const maxMergedWidth = mergedW - 10;
    const words = safeMerged.split(' ').filter(Boolean);
    const mergedLines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = boldFont.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxMergedWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) mergedLines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) mergedLines.push(currentLine);
    if (mergedLines.length === 0) mergedLines.push('');

    const rowHeight = Math.max(baseRowHeight, mergedLines.length * lineHeight + 6);

    // Column 1
    page.drawRectangle({
      x: margin,
      y: currentY - rowHeight,
      width: w1,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Merged columns 2 + 3
    page.drawRectangle({
      x: margin + w1,
      y: currentY - rowHeight,
      width: mergedW,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Column 4
    page.drawRectangle({
      x: margin + w1 + mergedW,
      y: currentY - rowHeight,
      width: w4,
      height: rowHeight,
      borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 },
      borderWidth: 0.5,
    });

    // Column 1 text
    if (safeCol1) {
      page.drawText(safeCol1, {
        x: margin + 5,
        y: currentY - 13,
        font,
        size: fontSize,
      });
    }

    // Merged col 2+3 centered
    const totalTextHeight = mergedLines.length * lineHeight;
    const firstLineY = currentY - ((rowHeight - totalTextHeight) / 2) - 6;

    mergedLines.forEach((line, index) => {
      const textWidth = boldFont.widthOfTextAtSize(line, fontSize);

      page.drawText(line, {
        x: margin + w1 + (mergedW - textWidth) / 2,
        y: firstLineY - (index * lineHeight),
        font: font,
        size: fontSize,
      });
    });

    // Column 4 centered
    if (safeCol4) {
      const textWidth = boldFont.widthOfTextAtSize(safeCol4, fontSize);
      page.drawText(safeCol4, {
        x: margin + w1 + mergedW + (w4 - textWidth) / 2,
        y: currentY - 13,
        font: boldFont,
        size: fontSize,
      });
    }

    currentY -= rowHeight;
  }; 

  // Prescriptive note + conversions + HRV/ERV block
  const topBlockTopY = currentY;

  const leftBlockWidth = tableWidth * 0.58;
  const rightBlockWidth = tableWidth * 0.42;

  // Right conversions box
  const convX = margin + tableWidth - rightBlockWidth;
  const convTopY = topBlockTopY - 2;
  const convHeaderH = 13;
  const convBodyH = 17;
  const convTotalH = convHeaderH + convBodyH;

  page.drawRectangle({
    x: convX,
    y: convTopY - convTotalH,
    width: rightBlockWidth,
    height: convTotalH,
    borderColor: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 },
    borderWidth: 0.8,
  });

  page.drawLine({
    start: { x: convX, y: convTopY - convHeaderH },
    end: { x: convX + rightBlockWidth, y: convTopY - convHeaderH },
    thickness: 0.8,
    color: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 },
  });

  page.drawLine({
    start: { x: convX + rightBlockWidth / 2, y: convTopY - convHeaderH },
    end: { x: convX + rightBlockWidth / 2, y: convTopY - convTotalH },
    thickness: 0.8,
    color: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 },
  });

  const convTitle = 'Conversions:';
  const convTitleSize = 8;
  const convTitleWidth = font.widthOfTextAtSize(convTitle, convTitleSize);

  page.drawText(convTitle, {
    x: convX + (rightBlockWidth - convTitleWidth) / 2,
    y: convTopY - 10,
    font,
    size: convTitleSize,
  });

  const leftConv = 'R = 5.678 x RSI';
  const rightConv = 'U = 1 / RSI';
  const convFontSize = 8;

  const leftConvWidth = font.widthOfTextAtSize(leftConv, convFontSize);
  const rightConvWidth = font.widthOfTextAtSize(rightConv, convFontSize);

  page.drawText(leftConv, {
    x: convX + (rightBlockWidth / 2 - leftConvWidth) / 2,
    y: convTopY - convHeaderH - 11,
    font,
    size: convFontSize,
  });

  page.drawText(rightConv, {
    x: convX + rightBlockWidth / 2 + ((rightBlockWidth / 2 - rightConvWidth) / 2),
    y: convTopY - convHeaderH - 11,
    font,
    size: convFontSize,
  });

  // Left text vertically centered relative to conversion box
  const noteTitle = 'Prescriptive Compliance Path (9.36.2. – 9.36.4.)';
  const noteLine1 = 'All calculations and specifications must be attached to this form to';
  const noteLine2 = 'be considered complete and be accepted for review.';

  const noteTitleSize = 9;
  const noteBodySize = 8;

  // posições relativas dentro do bloco
  const titleOffset = 0;
  const line1Offset = 14;
  const line2Offset = 24;

  // altura visual total do bloco da esquerda
  const leftTextBlockHeight = line2Offset + noteBodySize;

  // centro da tabela de conversão da direita
  const convCenterY = convTopY - (convTotalH / 2);

  // y da primeira linha do bloco da esquerda para centralizar tudo
  const leftTextTopY = convCenterY + (leftTextBlockHeight / 2) - noteTitleSize + 1;

  page.drawText(noteTitle, {
    x: margin,
    y: leftTextTopY - titleOffset,
    font: boldFont,
    size: noteTitleSize,
  });

  page.drawText(noteLine1, {
    x: margin,
    y: leftTextTopY - line1Offset,
    font,
    size: noteBodySize,
  });

  page.drawText(noteLine2, {
    x: margin,
    y: leftTextTopY - line2Offset,
    font,
    size: noteBodySize,
  });

  // HRV / ERV row closer to next section header
  const hrvY = convTopY - convTotalH - 28;

  page.drawText('HRV / ERV:', {
    x: margin,
    y: hrvY,
    font,
    size: 9,
  });

  const selectedHrv =
    project.hrv_erv_type &&
    project.hrv_erv_type !== "None" &&
    project.hrv_erv_type !== "no_hrv" &&
    project.hrv_erv_type !== "without_hrv";

  const hrvBoxSize = 9;
  const yesBoxX = margin + 105;
  const noBoxX = yesBoxX + 85;

  page.drawRectangle({
    x: yesBoxX,
    y: hrvY - 2,
    width: hrvBoxSize,
    height: hrvBoxSize,
    borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
    borderWidth: 1,
  });

  page.drawText('Yes', {
    x: yesBoxX + 16,
    y: hrvY,
    font,
    size: 9,
  });

  page.drawRectangle({
    x: noBoxX,
    y: hrvY - 2,
    width: hrvBoxSize,
    height: hrvBoxSize,
    borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
    borderWidth: 1,
  });

  page.drawText('No', {
    x: noBoxX + 16,
    y: hrvY,
    font,
    size: 9,
  });

  // Mark selected option
  if (selectedHrv) {
    page.drawText('X', {
      x: yesBoxX + 2,
      y: hrvY,
      font: boldFont,
      size: 9,
    });
  } else {
    page.drawText('X', {
      x: noBoxX + 2,
      y: hrvY,
      font: boldFont,
      size: 9,
    });
  }

  // leave only a very small gap before next grey header
  currentY = hrvY - 8;  

  drawChecklistHeader('Effective Thermal Resistance of Above Ground Opaque Building Assemblies (RSI)');
  drawChecklistRow('Assembly', 'w/ HRV', 'w/o HRV', 'Proposed');
  drawChecklistRow('Ceilings below attics', '8.67', '10.43', project.attic_rsi ? String(project.attic_rsi) : '');
  drawChecklistRow('Cathedral / Flat roofs', '5.02', '5.02', project.cathedral_flat_rsi ? String(project.cathedral_flat_rsi) : '');
  drawChecklistRow('Walls & Rim joists', '2.97', '3.08', project.wall_rsi ? String(project.wall_rsi) : '');
  drawChecklistRowMerged23('Floors over unheated spaces', '5.02', project.floor_rsi ? String(project.floor_rsi) : '');
  drawChecklistRowMerged23('Floors within garage', '4.86', project.floors_garage_rsi ? String(project.floors_garage_rsi) : '');

  drawChecklistHeader('Thermal Characteristics of Fenestration, Doors and Skylights (U)');
  drawFenestrationRow('Assembly', 'Efficiency', 'Proposed');
  drawFenestrationRow(
    'Windows & Doors',
    'Maximum U-Value 1.61 or Minimum Energy Rating >= 25',
    project.window_u_value ? String(project.window_u_value) : ''
  );
  drawFenestrationRow('One door exception', 'Maximum U-Value 2.60', '');
  drawFenestrationRow('Attic hatch', 'Minimum RSInom 2.60', '');
  drawFenestrationRow('Skylights', 'Maximum U-Value 2.75', project.skylight_u_value ? String(project.skylight_u_value) : '');

  drawChecklistHeader('Effective Thermal Resistance of Below-Grade Opaque Buildings Assemblies (RSI)');
  drawChecklistRow('Assembly', 'w/ HRV', 'w/o HRV', 'Proposed');
  drawChecklistRow('Foundation Walls', '2.98', '3.46', project.below_grade_rsi ? String(project.below_grade_rsi) : '');
  drawChecklistRow('Slab On Grade Integral Footing', '2.84', '3.72', project.slab_on_grade_integral_footing_rsi ? String(project.slab_on_grade_integral_footing_rsi) : '');
  drawChecklistRow('Unheated Floor Below Frost', 'uninsulated', 'uninsulated', project.unheated_floor_below_frost_rsi ? String(project.unheated_floor_below_frost_rsi) : '');
  drawChecklistRow('Unheated Floor Above Frost', '1.96', '1.96', project.unheated_floor_above_frost_rsi ? String(project.unheated_floor_above_frost_rsi) : '');
  drawChecklistRow('Heated Floors', '2.84', '2.84', project.heated_floors_rsi ? String(project.heated_floors_rsi) : '');

  currentY -= 20;
  
  const footerY = 20;
  const footerSize = 8;

  const footerLeft = 'Updated September 2025';
  const footerCenter = 'Section 9.36 – Tiered Prescriptive / Trade-Off Compliance Form';
  const footerRight = 'Page 1 of 2';

  // Left
  page.drawText(footerLeft, {
    x: margin,
    y: footerY,
    font,
    size: footerSize,
  });

  // Center
  const footerCenterWidth = font.widthOfTextAtSize(footerCenter, footerSize);
  page.drawText(footerCenter, {
    x: (pageWidth - footerCenterWidth) / 2,
    y: footerY,
    font,
    size: footerSize,
  });

  // Right
  const footerRightWidth = font.widthOfTextAtSize('Page 1 of 2', footerSize);
  page.drawText('Page 1 of 2', {
    x: pageWidth - margin - footerRightWidth,
    y: footerY,
    font,
    size: footerSize,
  });

  // -----------------------------
  // PAGE 2
  // -----------------------------
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  currentY = pageHeight - margin;

  if (logoImage) {
    const { width: lw, height: lh } = logoImage.scale(1);
    const scale = 40 / lh;
    page2.drawImage(logoImage, { x: margin, y: currentY - 29, width: lw * scale, height: 40 });
  }

  const headerRightX2 = pageWidth - margin;
  headerLines.forEach((line, i) => {
    const size = i === 1 ? 11 : 8;
    const f = i === 1 ? boldFont : font;
    const w = f.widthOfTextAtSize(line, size);
    let y = currentY;
    if (i === 1) y = currentY - 13;
    if (i === 2) y = currentY - 22;
    page2.drawText(line, { x: headerRightX2 - w, y, font: f, size });
  });

  currentY -= 56;

  const drawSectionHeader2 = (title: string) => {
    page2.drawRectangle({
      x: margin,
      y: currentY - 18,
      width: tableWidth,
      height: 18,
      color: { type: 'RGB', red: 0.9, green: 0.9, blue: 0.9 },
      borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 },
      borderWidth: 1
    });
    const safeTitle = sanitize(title);
    const titleSize = 10;
    const titleWidth = boldFont.widthOfTextAtSize(safeTitle, titleSize);
    page2.drawText(safeTitle, {
      x: margin + (tableWidth - titleWidth) / 2,
      y: currentY - 13,
      font: boldFont,
      size: titleSize,
      color: { type: 'RGB', red: 0, green: 0, blue: 0 }
    });
    currentY -= 18;
  };

  const drawRow2 = (col1: string, col2: string, col3: string, col4: string, boldVal = true) => {
    const rowHeight = 18;
    const w1 = tableWidth * 0.35;
    const w2 = tableWidth * 0.25;
    const w3 = tableWidth * 0.25;
    const w4 = tableWidth * 0.15;
    const cols = [col1, col2, col3, col4];
    const widths = [w1, w2, w3, w4];
    let curX = margin;
    cols.forEach((txt, i) => {
      page2.drawRectangle({ x: curX, y: currentY - rowHeight, width: widths[i], height: rowHeight, borderColor: { type: 'RGB', red: 0.7, green: 0.7, blue: 0.7 }, borderWidth: 0.5 });
      if (txt) {
        const f = (i === 3 && boldVal) ? boldFont : font;
        const s = 8;
        const tw = f.widthOfTextAtSize(sanitize(txt), s);
        const tx = (i === 0) ? curX + 5 : curX + (widths[i] - tw) / 2;
        page2.drawText(sanitize(txt), { x: tx, y: currentY - 13, font: f, size: s });
      }
      curX += widths[i];
    });
    currentY -= rowHeight;
  };

  drawSectionHeader2('HVAC Efficiency Requirements');
  drawRow2('Equipment', 'Efficiency Required', '', 'Proposed', false);
  drawRow2('Natural Gas / Propane Furnace', 'AFUE >= 95%', '', project.heating_efficiency ? String(project.heating_efficiency) : '');
  drawRow2('Electric Storage Tank (DHW)', 'Standby Loss <= 65W', '', project.water_heating_efficiency ? String(project.water_heating_efficiency) : '');
  drawRow2('Natural Gas Tank (DHW)', 'EF >= 0.67', '', '');
  drawRow2('Instantaneous Gas (DHW)', 'EF >= 0.80', '', '');
  drawRow2('Air Source Heat Pump', 'HSPF >= 8.5', '', '');

  currentY -= 20;

  // Signatures section
  const sigBoxH = 140;
  page2.drawRectangle({ x: margin, y: currentY - sigBoxH, width: tableWidth, height: sigBoxH, borderColor: { type: 'RGB', red: 0, green: 0, blue: 0 }, borderWidth: 1 });
  page2.drawText('Design Professional Declaration', { x: margin + 10, y: currentY - 20, font: boldFont, size: 10 });
  
  const declaration = 'I hereby certify that the design of the building project referred to above complies with the tiered prescriptive requirements of Section 9.36 of the National Building Code of Canada as indicated on this form.';
  const words2 = declaration.split(' ');
  let line2 = '';
  let sigY = currentY - 35;
  words2.forEach(w => {
    if (font.widthOfTextAtSize(line2 + w, 9) > tableWidth - 20) {
      page2.drawText(line2, { x: margin + 10, y: sigY, font, size: 9 });
      line2 = w + ' ';
      sigY -= 11;
    } else {
      line2 += w + ' ';
    }
  });
  page2.drawText(line2, { x: margin + 10, y: sigY, font, size: 9 });

  sigY -= 30;
  page2.drawLine({ start: { x: margin + 10, y: sigY }, end: { x: margin + 250, y: sigY }, thickness: 0.5 });
  page2.drawText('Signature of Designer', { x: margin + 10, y: sigY - 12, font, size: 8 });

  page2.drawLine({ start: { x: margin + 300, y: sigY }, end: { x: margin + tableWidth - 10, y: sigY }, thickness: 0.5 });
  page2.drawText('Date', { x: margin + 300, y: sigY - 12, font, size: 8 });

  sigY -= 30;
  page2.drawLine({ start: { x: margin + 10, y: sigY }, end: { x: margin + tableWidth - 10, y: sigY }, thickness: 0.5 });
  page2.drawText('Name of Design Professional / Firm', { x: margin + 10, y: sigY - 12, font, size: 8 });

  // Page 2 Footer
  page2.drawText(footerLeft, { x: margin, y: footerY, font, size: footerSize });
  page2.drawText(footerCenter, { x: (pageWidth - footerCenterWidth) / 2, y: footerY, font, size: footerSize });
  const footerRight2Width = font.widthOfTextAtSize('Page 2 of 2', footerSize);
  page2.drawText('Page 2 of 2', { x: pageWidth - margin - footerRight2Width, y: footerY, font, size: footerSize });

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