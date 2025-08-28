export interface NBCOption {
  value: string;
  label: string;
  points: number;
}

export const wallRSIOptions: NBCOption[] = [{
  value: "2.97",
  label: "RSI 2.97 / R-16.9 (Not applicable in Zone 7A)",
  points: 0
}, {
  value: "3.08",
  label: "RSI 3.08 / R-17.5",
  points: 2.1
}, {
  value: "3.69",
  label: "RSI 3.69 / R-21.0",
  points: 6.7
}, {
  value: "3.85",
  label: "RSI 3.85 / R-21.9",
  points: 7.4
}, {
  value: "3.96",
  label: "RSI 3.96 / R-22.5",
  points: 8.2
}, {
  value: "4.29",
  label: "RSI 4.29 / R-24.4",
  points: 9.7
}, {
  value: "4.40",
  label: "RSI 4.40 / R-25.0",
  points: 10.3
}, {
  value: "4.57",
  label: "RSI 4.57 / R-26.0",
  points: 11.1
}, {
  value: "4.73",
  label: "RSI 4.73 / R-26.9",
  points: 11.5
}, {
  value: "4.84",
  label: "RSI 4.84 / R-27.5",
  points: 12.1
}, {
  value: "5.01",
  label: "RSI 5.01 / R-28.4",
  points: 12.7
}, {
  value: "5.45",
  label: "RSI 5.45 / R-31.0",
  points: 14.0
}];

export const windowUValueOptions: NBCOption[] = [{
  value: "1.61",
  label: "U-Value 1.61 (Not applicable in Zone 7A)",
  points: 0
}, {
  value: "1.44",
  label: "U-Value 1.44",
  points: 1.8
}, {
  value: "1.22",
  label: "U-Value 1.22",
  points: 5.5
}];

export const belowGradeRSIOptions: NBCOption[] = [{
  value: "n/a",
  label: "N/A",
  points: 0
}, {
  value: "2.98",
  label: "RSI 2.98 / R-16.9 (Not available for zone 7A or 7B)",
  points: 0
}, {
  value: "3.09",
  label: "RSI 3.09 / R-17.6",
  points: 0.2
}, {
  value: "3.46",
  label: "RSI 3.46 / R-19.7",
  points: 0.6
}, {
  value: "3.90",
  label: "RSI 3.90 / R-22.2",
  points: 1.1
}];

export const buildingVolumeOptions: NBCOption[] = [{
  value: "380-390",
  label: "380 < V ≤ 390 m³",
  points: 1
}, {
  value: "370-380",
  label: "370 < V ≤ 380 m³",
  points: 2
}, {
  value: "360-370",
  label: "360 < V ≤ 370 m³",
  points: 3
}, {
  value: "350-360",
  label: "350 < V ≤ 360 m³",
  points: 4
}, {
  value: "340-350",
  label: "340 < V ≤ 350 m³",
  points: 5
}, {
  value: "330-340",
  label: "330 < V ≤ 340 m³",
  points: 6
}, {
  value: "320-330",
  label: "320 < V ≤ 330 m³",
  points: 7
}, {
  value: "310-320",
  label: "310 < V ≤ 320 m³",
  points: 8
}, {
  value: "300-310",
  label: "300 < V ≤ 310 m³",
  points: 9
}, {
  value: "under-300",
  label: "V ≤ 300 m³",
  points: 10
}];

export const airtightnessOptions: NBCOption[] = [{
  value: "AL-1A",
  label: "AL-1A (ACH₅₀: 2.5, NLA₁₀: 1.20, NLR₅₀: 0.89)",
  points: 0
}, {
  value: "AL-2A",
  label: "AL-2A (ACH₅₀: 2.0, NLA₁₀: 0.96, NLR₅₀: 0.71)",
  points: 4.6
}, {
  value: "AL-3A",
  label: "AL-3A (ACH₅₀: 1.5, NLA₁₀: 0.72, NLR₅₀: 0.53)",
  points: 9.3
}, {
  value: "AL-4A",
  label: "AL-4A (ACH₅₀: 1.0, NLA₁₀: 0.48, NLR₅₀: 0.35)",
  points: 13.9
}, {
  value: "AL-5A",
  label: "AL-5A (ACH₅₀: 0.6, NLA₁₀: 0.29, NLR₅₀: 0.21)",
  points: 17.8
}, {
  value: "AL-1B",
  label: "AL-1B (ACH₅₀: 3.0, NLA₁₀: 1.92, NLR₅₀: 1.17)",
  points: 0
}, {
  value: "AL-2B",
  label: "AL-2B (ACH₅₀: 2.5, NLA₁₀: 1.6, NLR₅₀: 0.98)",
  points: 0
}, {
  value: "AL-3B",
  label: "AL-3B (ACH₅₀: 2.0, NLA₁₀: 1.28, NLR₅₀: 0.78)",
  points: 4.6
}, {
  value: "AL-4B",
  label: "AL-4B (ACH₅₀: 1.5, NLA₁₀: 0.96, NLR₅₀: 0.59)",
  points: 9.1
}, {
  value: "AL-5B",
  label: "AL-5B (ACH₅₀: 1.0, NLA₁₀: 0.64, NLR₅₀: 0.39)",
  points: 13.6
}, {
  value: "AL-6B",
  label: "AL-6B (ACH₅₀: 0.6, NLA₁₀: 0.38, NLR₅₀: 0.23)",
  points: 17.4
}];

export const hrvOptions: NBCOption[] = [{
  value: "none",
  label: "None - Not Applicable",
  points: 0
}, {
  value: "60-65",
  label: "60% ≤ SRE < 65%",
  points: 0.6
}, {
  value: "65-75",
  label: "65% ≤ SRE < 75%",
  points: 1.7
}, {
  value: "75-84",
  label: "75% ≤ SRE < 84%",
  points: 2.7
}];

export const waterHeaterOptions: NBCOption[] = [{
  value: "residential-duty-079",
  label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.79)",
  points: 1.5
}, {
  value: "residential-duty-085",
  label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.85)",
  points: 2.0
}, {
  value: "heat-pump",
  label: "Heat pump water heater (EF ≥ 2.35)",
  points: 3.0
}, {
  value: "tankless-condensing",
  label: "Gas-fired tankless condensing water heater (EF ≥ 0.95 or UEF ≥ 0.92)",
  points: 3.1
}, {
  value: "residential-storage",
  label: "Gas-fired residential storage-type service water heater (EF ≥ 0.80 or UEF ≥ 0.83)",
  points: 3.1
}, {
  value: "gas-storage-low",
  label: "Gas-fired storage tank (under performance targets)",
  points: 0
}, {
  value: "electric-storage-low",
  label: "Electric storage tank (under performance targets)",
  points: 0
}];

export const upgradesData = [{
  "upgrade": "Attic - R40 → R50",
  "cost": 400,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Attic - R50 → R60",
  "cost": 400,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "AG Walls - R20 → R22",
  "cost": 2500,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Rim Joist - R20 → R22",
  "cost": 400,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "BG Walls - R20 → R22",
  "cost": 1000,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "BG Walls - R22 → R24",
  "cost": 1000,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Slab - Add R11",
  "cost": 1500,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Windows - Upgrade to 1.3 Triple Pane",
  "cost": 3000,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Windows - Upgrade to 1.48 Double Pane",
  "cost": 3000,
  "prescriptiveRequired": false,
  "performanceRequired": true
}, {
  "upgrade": "Blower Door Test",
  "cost": 350,
  "prescriptiveRequired": true,
  "performanceRequired": true
}, {
  "upgrade": "HRV Installation",
  "cost": 2000,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "Condensing Hot Water Heater",
  "cost": 1000,
  "prescriptiveRequired": true,
  "performanceRequired": false
}, {
  "upgrade": "96 AFUE Furnace",
  "cost": 0,
  "prescriptiveRequired": false,
  "performanceRequired": false
}];

export const atticRSIOptions: NBCOption[] = [{
  value: "8.67",
  label: "RSI 8.67 (Minimum for Tiered Compliance)",
  points: 0
}, {
  value: "9.50",
  label: "RSI 9.50",
  points: 1.2
}, {
  value: "10.43",
  label: "RSI 10.43 (Higher performance)",
  points: 2.5
}, {
  value: "11.50",
  label: "RSI 11.50",
  points: 3.8
}, {
  value: "12.50",
  label: "RSI 12.50",
  points: 4.5
}];

export const wallRSIOptions_7B: NBCOption[] = [{
  value: "2.97",
  label: "RSI 2.97 / R-16.9 (Not applicable in Zone 7B)",
  points: 0
}, {
  value: "3.08",
  label: "RSI 3.08 / R-17.5 (Not applicable in Zone 7B)",
  points: 0
}, {
  value: "3.69",
  label: "RSI 3.69 / R-21.0",
  points: 5.4
}, {
  value: "3.85",
  label: "RSI 3.85 / R-21.9",
  points: 6.2
}, {
  value: "3.96",
  label: "RSI 3.96 / R-22.5",
  points: 7.0
}, {
  value: "4.29",
  label: "RSI 4.29 / R-24.4",
  points: 8.6
}, {
  value: "4.40",
  label: "RSI 4.40 / R-25.0",
  points: 9.3
}, {
  value: "4.57",
  label: "RSI 4.57 / R-26.0",
  points: 10.1
}, {
  value: "4.73",
  label: "RSI 4.73 / R-26.9",
  points: 10.6
}];

export const windowUValueOptions_7B: NBCOption[] = [{
  value: "1.61",
  label: "U-Value 1.61 (Not applicable in Zone 7B)",
  points: 0
}, {
  value: "1.44",
  label: "U-Value 1.44 (Not applicable in Zone 7B)",
  points: 0
}, {
  value: "1.22",
  label: "U-Value 1.22",
  points: 3.2
}];

export const belowGradeRSIOptions_7B: NBCOption[] = [{
  value: "n/a",
  label: "N/A",
  points: 0
}, {
  value: "2.98",
  label: "RSI 2.98 / R-16.9 (Not applicable in Zone 7B)",
  points: 0
}, {
  value: "3.09",
  label: "RSI 3.09 / R-17.6",
  points: 0.2
}, {
  value: "3.46",
  label: "RSI 3.46 / R-19.7",
  points: 0.7
}, {
  value: "3.90",
  label: "RSI 3.90 / R-22.2",
  points: 1.3
}];

export const airtightnessOptions_7B: NBCOption[] = [{
  value: "AL-1A",
  label: "AL-1A (ACH₅₀: 2.5, NLA₁₀: 1.20, NLR₅₀: 0.89)",
  points: 0
}, {
  value: "AL-2A",
  label: "AL-2A (ACH₅₀: 2.0, NLA₁₀: 0.96, NLR₅₀: 0.71)",
  points: 6.1
}, {
  value: "AL-3A",
  label: "AL-3A (ACH₅₀: 1.5, NLA₁₀: 0.72, NLR₅₀: 0.53)",
  points: 12.1
}, {
  value: "AL-4A",
  label: "AL-4A (ACH₅₀: 1.0, NLA₁₀: 0.48, NLR₅₀: 0.35)",
  points: 18.0
}, {
  value: "AL-5A",
  label: "AL-5A (ACH₅₀: 0.6, NLA₁₀: 0.29, NLR₅₀: 0.21)",
  points: 22.7
}, {
  value: "AL-1B",
  label: "AL-1B (ACH₅₀: 3.0, NLA₁₀: 1.92, NLR₅₀: 1.17)",
  points: 0
}, {
  value: "AL-2B",
  label: "AL-2B (ACH₅₀: 2.5, NLA₁₀: 1.6, NLR₅₀: 0.98)",
  points: 0
}, {
  value: "AL-3B",
  label: "AL-3B (ACH₅₀: 2.0, NLA₁₀: 1.28, NLR₅₀: 0.78)",
  points: 4.1
}, {
  value: "AL-4B",
  label: "AL-4B (ACH₅₀: 1.5, NLA₁₀: 0.96, NLR₅₀: 0.59)",
  points: 8.2
}, {
  value: "AL-5B",
  label: "AL-5B (ACH₅₀: 1.0, NLA₁₀: 0.64, NLR₅₀: 0.39)",
  points: 12.3
}, {
  value: "AL-6B",
  label: "AL-6B (ACH₅₀: 0.6, NLA₁₀: 0.38, NLR₅₀: 0.23)",
  points: 15.6
}];

export const hrvOptions_7B: NBCOption[] = [{
  value: "none",
  label: "None - Not Applicable",
  points: 0
}, {
  value: "60-65",
  label: "60% ≤ SRE < 65%",
  points: 0.8
}, {
  value: "65-75",
  label: "65% ≤ SRE < 75%",
  points: 2.3
}, {
  value: "75-84",
  label: "75% ≤ SRE < 84%",
  points: 3.7
}];

export const waterHeaterOptions_7B: NBCOption[] = [{
  value: "residential-duty-079",
  label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.79)",
  points: 1.5
}, {
  value: "residential-duty-085",
  label: "Gas-fired residential-duty commercial storage-type (UEF ≥ 0.85)",
  points: 2.0
}, {
  value: "heat-pump",
  label: "Heat pump water heater (EF ≥ 2.35)",
  points: 3.0
}, {
  value: "tankless-condensing",
  label: "Gas-fired tankless condensing water heater (EF ≥ 0.95 or UEF ≥ 0.92)",
  points: 3.1
}, {
  value: "residential-storage",
  label: "Gas-fired residential storage-type service water heater (EF ≥ 0.80 or UEF ≥ 0.83)",
  points: 3.1
}, {
  value: "gas-storage-low",
  label: "Gas-fired storage tank (under performance targets)",
  points: 0
}, {
  value: "electric-storage-low",
  label: "Electric storage tank (under performance targets)",
  points: 0
}];

export const validateRSI_9362 = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  if (numValue < minRSI) {
    return {
      isValid: false,
      warning: {
        type: "too-low",
        message: `The RSI value must be increased to at least ${minRSI} to meet NBC 9.36.2 requirements for ${fieldName}.`
      }
    };
  }
  return {
    isValid: true,
    warning: null
  };
};

export const validateRSI = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  const suspectedRValue = numValue / 5.678;

  if (numValue >= 10 && numValue < 30) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-too-low",
        message: `This appears to be an R-value (${numValue.toFixed(1)}) which is too low. R-values should be at least R30. Please enter a higher R-value or the equivalent RSI value.`
      }
    };
  }

  if (numValue > minRSI * 3 && numValue >= 30 && suspectedRValue >= minRSI * 0.8 && suspectedRValue <= minRSI * 1.2) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-suspected",
        message: `This appears to be an R-value (${numValue.toFixed(1)}). Did you mean RSI ${suspectedRValue.toFixed(2)}? Please enter the RSI value, not the R-value.`
      }
    };
  }

  if (numValue < minRSI) {
    return {
      isValid: false,
      warning: {
        type: "too-low",
        message: `The RSI value must be increased to at least ${minRSI} to meet NBC requirements for ${fieldName}.`
      }
    };
  }
  return {
    isValid: true,
    warning: null
  };
};

export const getPathwayDisplayName = (compliancePath: string) => {
  if (compliancePath === '9365') {
    return 'NBC 9.36.5 Performance Path';
  } else if (compliancePath === '9362') {
    return 'NBC 9.36.2-9.36.4 Prescriptive Path';
  } else if (compliancePath === '9367') {
    return 'NBC 9.36.7 Tiered Performance Path';
  } else if (compliancePath === '9368') {
    return 'NBC 9.36.8 Tiered Prescriptive Path';
  }
  return '';
};

export const isSingleDetached = (buildingType: string) => {
  return buildingType === 'single-detached' || buildingType === 'single-detached-secondary';
};