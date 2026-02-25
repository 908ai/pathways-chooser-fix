// src/components/NBCCalculator/constants/options.ts
// Centralized NBC option arrays and upgrade cost data

export interface NBCOption {
  value: string;
  label: string;
  points: number;
}

export interface NBCAirtightnessOption {
  value: string;
  level: string;
  type: "Guarded" | "Unguarded";
  ach50: number;
  nla10: number;
  nlr50: number;
  points: number;
}

export type ClimateZone = "6" | "7A" | "7B";

/* -------------------------
   Zone 6 Options
------------------------- */

export const wallRSIOptions_6: NBCOption[] = [
  { value: "2.97", label: "RSI 2.97 / R-16.9", points: 0 },
  { value: "3.08", label: "RSI 3.08 / R-17.5", points: 1.6 },
  { value: "3.69", label: "RSI 3.69 / R-21.0", points: 6.2 },
  { value: "3.85", label: "RSI 3.85 / R-21.9", points: 6.9 },
  { value: "3.96", label: "RSI 3.96 / R-22.5", points: 7.7 },
  { value: "4.29", label: "RSI 4.29 / R-24.4", points: 9.2 },
  { value: "4.40", label: "RSI 4.40 / R-25.0", points: 9.9 },
  { value: "4.57", label: "RSI 4.57 / R-26.0", points: 10.6 },
  { value: "4.73", label: "RSI 4.73 / R-26.9", points: 11.1 }
];

export const windowUValueOptions_6: NBCOption[] = [
  { value: "1.61", label: "U-Value 1.61", points: 0 },
  { value: "1.44", label: "U-Value 1.44", points: 1.6 },
  { value: "1.22", label: "U-Value 1.22", points: 4.6 }
];

export const belowGradeRSIOptions_6: NBCOption[] = [
  { value: "n/a", label: "N/A", points: 0 },
  { value: "2.98", label: "RSI 2.98 / R-16.9", points: 0 },
  { value: "3.09", label: "RSI 3.09 / R-17.6", points: 0.2 },
  { value: "3.46", label: "RSI 3.46 / R-19.7", points: 0.8 },
  { value: "3.90", label: "RSI 3.90 / R-22.2", points: 1.4 }
];

export const airtightnessOptions_6: NBCAirtightnessOption[] = [
  { value: "AL-1A", level: "AL-1A", type: "Guarded", ach50: 2.5, nla10: 1.20, nlr50: 0.89, points: 0 },
  { value: "AL-2A", level: "AL-2A", type: "Guarded", ach50: 2.0, nla10: 0.96, nlr50: 0.71, points: 3.5 },
  { value: "AL-3A", level: "AL-3A", type: "Guarded", ach50: 1.5, nla10: 0.72, nlr50: 0.53, points: 7.0 },
  { value: "AL-4A", level: "AL-4A", type: "Guarded", ach50: 1.0, nla10: 0.48, nlr50: 0.35, points: 10.5 },
  { value: "AL-5A", level: "AL-5A", type: "Guarded", ach50: 0.6, nla10: 0.29, nlr50: 0.21, points: 13.4 },
  { value: "AL-1B", level: "AL-1B", type: "Unguarded", ach50: 3.0, nla10: 1.92, nlr50: 1.17, points: 0 },
  { value: "AL-2B", level: "AL-2B", type: "Unguarded", ach50: 2.5, nla10: 1.6, nlr50: 0.98, points: 0 },
  { value: "AL-3B", level: "AL-3B", type: "Unguarded", ach50: 2.0, nla10: 1.28, nlr50: 0.78, points: 3.5 },
  { value: "AL-4B", level: "AL-4B", type: "Unguarded", ach50: 1.5, nla10: 0.96, nlr50: 0.59, points: 6.9 },
  { value: "AL-5B", level: "AL-5B", type: "Unguarded", ach50: 1.0, nla10: 0.64, nlr50: 0.39, points: 10.4 },
  { value: "AL-6B", level: "AL-6B", type: "Unguarded", ach50: 0.6, nla10: 0.38, nlr50: 0.23, points: 13.3 }
];

export const hrvOptions_6: NBCOption[] = [
  { value: "none", label: "None - Not Applicable", points: 0 },
  { value: "60-65", label: "60% ≤ SRE < 65%", points: 0.7 },
  { value: "65-75", label: "65% ≤ SRE < 75%", points: 2.2 },
  { value: "75-84", label: "75% ≤ SRE < 84%", points: 3.5 }
];

export const waterHeaterOptions_6: NBCOption[] = [
  { value: "residential-duty-079", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.79)", points: 2.4 },
  { value: "residential-duty-085", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.85)", points: 3.2 },
  { value: "heat-pump", label: "Heat pump water heater (EF ≥ 2.35)", points: 3.8 },
  { value: "tankless-condensing", label: "Gas-fired tankless condensing water heater (EF ≥ 0.95 or UEF ≥ 0.92)", points: 4.9 },
  { value: "residential-storage", label: "Gas-fired residential storage-type service water heater (EF ≥ 0.80 or UEF ≥ 0.83)", points: 4.9 },
  { value: "gas-storage-low", label: "Gas-fired storage tank (under performance targets)", points: 0 },
  { value: "electric-storage-low", label: "Electric storage tank (under performance targets)", points: 0 }
];

/* -------------------------
   Zone 7A Options
------------------------- */

export const wallRSIOptions: NBCOption[] = [
  { value: "2.97", label: "RSI 2.97 / R-16.9", points: 0 },
  { value: "3.08", label: "RSI 3.08 / R-17.5", points: 2.1 },
  { value: "3.69", label: "RSI 3.69 / R-21.0", points: 6.7 },
  { value: "3.85", label: "RSI 3.85 / R-21.9", points: 7.4 },
  { value: "3.96", label: "RSI 3.96 / R-22.5", points: 8.2 },
  { value: "4.29", label: "RSI 4.29 / R-24.4", points: 9.7 },
  { value: "4.40", label: "RSI 4.40 / R-25.0", points: 10.3 },
  { value: "4.57", label: "RSI 4.57 / R-26.0", points: 11.1 },
  { value: "4.73", label: "RSI 4.73 / R-26.9", points: 11.5 },
  { value: "4.84", label: "RSI 4.84 / R-27.5", points: 12.1 },
  { value: "5.01", label: "RSI 5.01 / R-28.4", points: 12.7 },
  { value: "5.45", label: "RSI 5.45 / R-31.0", points: 14.0 }
];

export const windowUValueOptions: NBCOption[] = [
  { value: "1.61", label: "U-Value 1.61", points: 0 },
  { value: "1.44", label: "U-Value 1.44", points: 1.8 },
  { value: "1.22", label: "U-Value 1.22", points: 5.5 }
];

export const belowGradeRSIOptions: NBCOption[] = [
  { value: "n/a", label: "N/A", points: 0 },
  { value: "2.98", label: "RSI 2.98 / R-16.9", points: 0 },
  { value: "3.09", label: "RSI 3.09 / R-17.6", points: 0.2 },
  { value: "3.46", label: "RSI 3.46 / R-19.7", points: 0.6 },
  { value: "3.90", label: "RSI 3.90 / R-22.2", points: 1.1 }
];

export const buildingVolumeOptions: NBCOption[] = [
  { value: "380-390", label: "380 < V ≤ 390 m³", points: 1 },
  { value: "370-380", label: "370 < V ≤ 380 m³", points: 2 },
  { value: "360-370", label: "360 < V ≤ 370 m³", points: 3 },
  { value: "350-360", label: "350 < V ≤ 360 m³", points: 4 },
  { value: "340-350", label: "340 < V ≤ 350 m³", points: 5 },
  { value: "330-340", label: "330 < V ≤ 340 m³", points: 6 },
  { value: "320-330", label: "320 < V ≤ 330 m³", points: 7 },
  { value: "310-320", label: "310 < V ≤ 320 m³", points: 8 },
  { value: "300-310", label: "300 < V ≤ 310 m³", points: 9 },
  { value: "under-300", label: "V ≤ 300 m³", points: 10 }
];

export const airtightnessOptions: NBCAirtightnessOption[] = [
  { value: "AL-1A", level: "AL-1A", type: "Guarded", ach50: 2.5, nla10: 1.20, nlr50: 0.89, points: 0 },
  { value: "AL-2A", level: "AL-2A", type: "Guarded", ach50: 2.0, nla10: 0.96, nlr50: 0.71, points: 4.6 },
  { value: "AL-3A", level: "AL-3A", type: "Guarded", ach50: 1.5, nla10: 0.72, nlr50: 0.53, points: 9.3 },
  { value: "AL-4A", level: "AL-4A", type: "Guarded", ach50: 1.0, nla10: 0.48, nlr50: 0.35, points: 13.9 },
  { value: "AL-5A", level: "AL-5A", type: "Guarded", ach50: 0.6, nla10: 0.29, nlr50: 0.21, points: 17.8 },
  { value: "AL-1B", level: "AL-1B", type: "Unguarded", ach50: 3.0, nla10: 1.92, nlr50: 1.17, points: 0 },
  { value: "AL-2B", level: "AL-2B", type: "Unguarded", ach50: 2.5, nla10: 1.6, nlr50: 0.98, points: 0 },
  { value: "AL-3B", level: "AL-3B", type: "Unguarded", ach50: 2.0, nla10: 1.28, nlr50: 0.78, points: 4.6 },
  { value: "AL-4B", level: "AL-4B", type: "Unguarded", ach50: 1.5, nla10: 0.96, nlr50: 0.59, points: 9.1 },
  { value: "AL-5B", level: "AL-5B", type: "Unguarded", ach50: 1.0, nla10: 0.64, nlr50: 0.39, points: 13.6 },
  { value: "AL-6B", level: "AL-6B", type: "Unguarded", ach50: 0.6, nla10: 0.38, nlr50: 0.23, points: 17.4 }
];

export const hrvOptions: NBCOption[] = [
  { value: "none", label: "None - Not Applicable", points: 0 },
  { value: "60-65", label: "60% ≤ SRE < 65%", points: 0.6 },
  { value: "65-75", label: "65% ≤ SRE < 75%", points: 1.7 },
  { value: "75-84", label: "75% ≤ SRE < 84%", points: 2.7 }
];

export const waterHeaterOptions: NBCOption[] = [
  { value: "residential-duty-079", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.79)", points: 1.5 },
  { value: "residential-duty-085", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.85)", points: 2.0 },
  { value: "heat-pump", label: "Heat pump water heater (EF ≥ 2.35)", points: 3.0 },
  { value: "tankless-condensing", label: "Gas-fired tankless condensing water heater (EF ≥ 0.95 or UEF ≥ 0.92)", points: 3.1 },
  { value: "residential-storage", label: "Gas-fired residential storage-type service water heater (EF ≥ 0.80 or UEF ≥ 0.83)", points: 3.1 },
  { value: "gas-storage-low", label: "Gas-fired storage tank (under performance targets)", points: 0 },
  { value: "electric-storage-low", label: "Electric storage tank (under performance targets)", points: 0 }
];

export const atticRSIOptions: NBCOption[] = [
  { value: "8.67", label: "RSI 8.67 (Minimum for Tiered Compliance)", points: 0 },
  { value: "9.50", label: "RSI 9.50", points: 1.2 },
  { value: "10.43", label: "RSI 10.43 (Higher performance)", points: 2.5 },
  { value: "11.50", label: "RSI 11.50", points: 3.8 },
  { value: "12.50", label: "RSI 12.50", points: 4.5 }
];

/* -------------------------
   Zone 7B Options
------------------------- */

export const wallRSIOptions_7B: NBCOption[] = [
  { value: "2.97", label: "RSI 2.97 / R-16.9", points: 0 },
  { value: "3.08", label: "RSI 3.08 / R-17.5", points: 0 },
  { value: "3.69", label: "RSI 3.69 / R-21.0", points: 5.4 },
  { value: "3.85", label: "RSI 3.85 / R-21.9", points: 6.2 },
  { value: "3.96", label: "RSI 3.96 / R-22.5", points: 7.0 },
  { value: "4.29", label: "RSI 4.29 / R-24.4", points: 8.6 },
  { value: "4.40", label: "RSI 4.40 / R-25.0", points: 9.3 },
  { value: "4.57", label: "RSI 4.57 / R-26.0", points: 10.1 },
  { value: "4.73", label: "RSI 4.73 / R-26.9", points: 10.6 }
];

export const windowUValueOptions_7B: NBCOption[] = [
  { value: "1.61", label: "U-Value 1.61", points: 0 },
  { value: "1.44", label: "U-Value 1.44", points: 0 },
  { value: "1.22", label: "U-Value 1.22", points: 3.2 }
];

export const belowGradeRSIOptions_7B: NBCOption[] = [
  { value: "n/a", label: "N/A", points: 0 },
  { value: "2.98", label: "RSI 2.98 / R-16.9", points: 0 },
  { value: "3.09", label: "RSI 3.09 / R-17.6", points: 0.2 },
  { value: "3.46", label: "RSI 3.46 / R-19.7", points: 0.7 },
  { value: "3.90", label: "RSI 3.90 / R-22.2", points: 1.3 }
];

export const airtightnessOptions_7B: NBCAirtightnessOption[] = [
  { value: "AL-1A", level: "AL-1A", type: "Guarded", ach50: 2.5, nla10: 1.20, nlr50: 0.89, points: 0 },
  { value: "AL-2A", level: "AL-2A", type: "Guarded", ach50: 2.0, nla10: 0.96, nlr50: 0.71, points: 6.1 },
  { value: "AL-3A", level: "AL-3A", type: "Guarded", ach50: 1.5, nla10: 0.72, nlr50: 0.53, points: 12.1 },
  { value: "AL-4A", level: "AL-4A", type: "Guarded", ach50: 1.0, nla10: 0.48, nlr50: 0.35, points: 18.0 },
  { value: "AL-5A", level: "AL-5A", type: "Guarded", ach50: 0.6, nla10: 0.29, nlr50: 0.21, points: 22.7 },
  { value: "AL-1B", level: "AL-1B", type: "Unguarded", ach50: 3.0, nla10: 1.92, nlr50: 1.17, points: 0 },
  { value: "AL-2B", level: "AL-2B", type: "Unguarded", ach50: 2.5, nla10: 1.6, nlr50: 0.98, points: 0 },
  { value: "AL-3B", level: "AL-3B", type: "Unguarded", ach50: 2.0, nla10: 1.28, nlr50: 0.78, points: 4.1 },
  { value: "AL-4B", level: "AL-4B", type: "Unguarded", ach50: 1.5, nla10: 0.96, nlr50: 0.59, points: 8.2 },
  { value: "AL-5B", level: "AL-5B", type: "Unguarded", ach50: 1.0, nla10: 0.64, nlr50: 0.39, points: 12.3 },
  { value: "AL-6B", level: "AL-6B", type: "Unguarded", ach50: 0.6, nla10: 0.38, nlr50: 0.23, points: 15.6 }
];

export const hrvOptions_7B: NBCOption[] = [
  { value: "none", label: "None - Not Applicable", points: 0 },
  { value: "60-65", label: "60% ≤ SRE < 65%", points: 0.8 },
  { value: "65-75", label: "65% ≤ SRE < 75%", points: 2.3 },
  { value: "75-84", label: "75% ≤ SRE < 84%", points: 3.7 }
];

export const waterHeaterOptions_7B: NBCOption[] = [
  { value: "residential-duty-079", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.79)", points: 1.5 },
  { value: "residential-duty-085", label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.85)", points: 2.0 },
  { value: "heat-pump", label: "Heat pump water heater (EF ≥ 2.35)", points: 3.0 },
  { value: "tankless-condensing", label: "Gas-fired tankless condensing water heater (EF ≥ 0.95 or UEF ≥ 0.92)", points: 3.1 },
  { value: "residential-storage", label: "Gas-fired residential storage-type service water heater (EF ≥ 0.80 or UEF ≥ 0.83)", points: 3.1 },
  { value: "gas-storage-low", label: "Gas-fired storage tank (under performance targets)", points: 0 },
  { value: "electric-storage-low", label: "Electric storage tank (under performance targets)", points: 0 }
];

/* ======================================================
   UPGRADE COSTS (ZONE-INDEPENDENT)
====================================================== */

export const upgradesData = [
  { upgrade: "Attic - R40 → R50", cost: 400, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Attic - R50 → R60", cost: 400, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "AG Walls - R20 → R22", cost: 2500, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Rim Joist - R20 → R22", cost: 400, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "BG Walls - R20 → R22", cost: 1000, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "BG Walls - R22 → R24", cost: 1000, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Slab - Add R11", cost: 1500, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Windows - Upgrade to 1.3 Triple Pane", cost: 3000, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Windows - Upgrade to 1.48 Double Pane", cost: 3000, prescriptiveRequired: false, performanceRequired: true },
  { upgrade: "Blower Door Test", cost: 350, prescriptiveRequired: true, performanceRequired: true },
  { upgrade: "HRV Installation", cost: 2000, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "Condensing Hot Water Heater", cost: 1000, prescriptiveRequired: true, performanceRequired: false },
  { upgrade: "96 AFUE Furnace", cost: 0, prescriptiveRequired: false, performanceRequired: false }
];

/* ======================================================
   ZONE MAPPING (SCALABLE STRUCTURE)
====================================================== */

export const zoneOptions = {
  "6": {
    wall: wallRSIOptions_6,
    window: windowUValueOptions_6,
    belowGrade: belowGradeRSIOptions_6,
    airtightness: airtightnessOptions_6,
    hrv: hrvOptions_6,
    waterHeater: waterHeaterOptions_6,
    attic: atticRSIOptions,
  },  
  "7A": {
    wall: wallRSIOptions,
    window: windowUValueOptions,
    belowGrade: belowGradeRSIOptions,
    airtightness: airtightnessOptions,
    hrv: hrvOptions,
    waterHeater: waterHeaterOptions,
    attic: atticRSIOptions,
  },
  "7B": {
    wall: wallRSIOptions_7B,
    window: windowUValueOptions_7B,
    belowGrade: belowGradeRSIOptions_7B,
    airtightness: airtightnessOptions_7B,
    hrv: hrvOptions_7B,
    waterHeater: waterHeaterOptions_7B,
    attic: atticRSIOptions,
  }
} as const;

/* ======================================================
   HELPER FUNCTION
====================================================== */

export function getZoneOptions(zone: ClimateZone) {
  return zoneOptions[zone] ?? zoneOptions["7A"];
}