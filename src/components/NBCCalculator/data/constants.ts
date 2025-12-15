// data/constants.ts

// Options for the compliance path dropdown
export const COMPLIANCE_PATH_OPTIONS = [
  { value: '9362', label: 'NBC 9.36.2. Prescriptive' },
  { value: '9368', label: 'NBC 9.36.8. Points System' },
  { value: '9365', label: 'NBC 9.36.5. Performance' },
  { value: '9367', label: 'EnerGuide Rating System' },
];

// Options for the building type dropdown
export const BUILDING_TYPE_OPTIONS = [
  { value: 'new-construction', label: 'New Construction' },
  { value: 'addition', label: 'Addition' },
  { value: 'renovation', label: 'Renovation' },
];

// Options for the province dropdown
export const PROVINCE_OPTIONS = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'YT', label: 'Yukon' },
];

// --- Missing Constants (Recreated) ---

export const atticRSIOptions = [
  { value: '10.6', label: 'RSI 10.6 (R60)', points: 0 },
  { value: '12.3', label: 'RSI 12.3 (R70)', points: 2 },
  { value: '14.1', label: 'RSI 14.1 (R80)', points: 4 },
];

export const wallRSIOptions = [
  { value: '3.52', label: 'RSI 3.52 (R20)', points: 0 },
  { value: '4.23', label: 'RSI 4.23 (R24)', points: 2 },
  { value: '5.28', label: 'RSI 5.28 (R30)', points: 4 },
];

export const wallRSIOptions_7B = [
  { value: '4.23', label: 'RSI 4.23 (R24)', points: 0 },
  { value: '5.28', label: 'RSI 5.28 (R30)', points: 2 },
  { value: '6.16', label: 'RSI 6.16 (R35)', points: 4 },
];

export const belowGradeRSIOptions = [
  { value: '2.11', label: 'RSI 2.11 (R12)', points: 0 },
  { value: '2.99', label: 'RSI 2.99 (R17)', points: 1 },
  { value: '3.87', label: 'RSI 3.87 (R22)', points: 2 },
];

export const belowGradeRSIOptions_7B = [
  { value: '2.99', label: 'RSI 2.99 (R17)', points: 0 },
  { value: '3.87', label: 'RSI 3.87 (R22)', points: 1 },
  { value: '4.75', label: 'RSI 4.75 (R27)', points: 2 },
];

export const windowUValueOptions = [
  { value: '1.6', label: 'U-Value 1.6 (R3.5)', points: 0 },
  { value: '1.4', label: 'U-Value 1.4 (R4.0)', points: 2 },
  { value: '1.2', label: 'U-Value 1.2 (R4.7)', points: 4 },
];

export const windowUValueOptions_7B = [
  { value: '1.4', label: 'U-Value 1.4 (R4.0)', points: 0 },
  { value: '1.2', label: 'U-Value 1.2 (R4.7)', points: 2 },
  { value: '1.0', label: 'U-Value 1.0 (R5.7)', points: 4 },
];

export const airtightnessOptions = [
  { value: 'AL-1A', label: '2.5 ACH @ 50Pa (Guarded)', points: 2 },
  { value: 'AL-1B', label: '3.2 ACH @ 50Pa (Unguarded)', points: 2 },
  { value: 'AL-2A', label: '2.0 ACH @ 50Pa (Guarded)', points: 4 },
  { value: 'AL-2B', label: '2.5 ACH @ 50Pa (Unguarded)', points: 4 },
];

export const airtightnessOptions_7B = [
  { value: 'AL-1A', label: '2.0 ACH @ 50Pa (Guarded)', points: 2 },
  { value: 'AL-1B', label: '2.5 ACH @ 50Pa (Unguarded)', points: 2 },
  { value: 'AL-2A', label: '1.5 ACH @ 50Pa (Guarded)', points: 4 },
  { value: 'AL-2B', label: '2.0 ACH @ 50Pa (Unguarded)', points: 4 },
];

export const hrvOptions = [
  { value: '65', label: '65% SRE @ -25°C', points: 0 },
  { value: '70', label: '70% SRE @ -25°C', points: 1 },
  { value: '75', label: '75% SRE @ -25°C', points: 2 },
];

export const hrvOptions_7B = [
  { value: '70', label: '70% SRE @ -25°C', points: 0 },
  { value: '75', label: '75% SRE @ -25°C', points: 1 },
  { value: '80', label: '80% SRE @ -25°C', points: 2 },
];

export const waterHeaterOptions = [
  { value: 'gas_tank_0.67EF', label: 'Gas Tank (0.67 EF)', points: 0 },
  { value: 'gas_tankless_0.90EF', label: 'Gas Tankless (0.90 EF)', points: 2 },
  { value: 'electric_tank_0.90EF', label: 'Electric Tank (0.90 EF)', points: 1 },
];

export const waterHeaterOptions_7B = [
    { value: 'gas_tank_0.70EF', label: 'Gas Tank (0.70 EF)', points: 0 },
    { value: 'gas_tankless_0.94EF', label: 'Gas Tankless (0.94 EF)', points: 2 },
    { value: 'electric_tank_0.92EF', label: 'Electric Tank (0.92 EF)', points: 1 },
];

export const buildingVolumeOptions = [
    { value: 'under_380', label: 'Under 380 m³ (13,420 ft³)', points: 1 },
    { value: 'over_380', label: 'Over 380 m³ (13,420 ft³)', points: 0 },
];