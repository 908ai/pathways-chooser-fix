import {
  wallRSIOptions,
  windowUValueOptions,
  belowGradeRSIOptions,
  buildingVolumeOptions,
  airtightnessOptions,
  hrvOptions,
  waterHeaterOptions,
  atticRSIOptions,
  wallRSIOptions_7B,
  windowUValueOptions_7B,
  belowGradeRSIOptions_7B,
  airtightnessOptions_7B,
  hrvOptions_7B,
  waterHeaterOptions_7B
} from '../data/constants';

// Helper function to validate RSI values for 9.36.2 (simplified - RSI only)
const validateRSI_9362 = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  // Simple RSI validation - only check if below minimum
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

// Helper function for other sections (keeps R-value detection)
const validateRSI = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  // If the value is suspiciously high, it might be an R-value instead of RSI
  // RSI to R-value conversion: R = RSI × 5.678
  const suspectedRValue = numValue / 5.678;
  const minRValue = minRSI * 5.678;

  // Check if this appears to be an R-value that's too low (below R30)
  if (numValue >= 10 && numValue < 30) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-too-low",
        message: `This appears to be an R-value (${numValue.toFixed(1)}) which is too low. R-values should be at least R30. Please enter a higher R-value or the equivalent RSI value.`
      }
    };
  }

  // Check if this appears to be a valid R-value that should be converted to RSI
  if (numValue > minRSI * 3 && numValue >= 30 && suspectedRValue >= minRSI * 0.8 && suspectedRValue <= minRSI * 1.2) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-suspected",
        message: `This appears to be an R-value (${numValue.toFixed(1)}). Did you mean RSI ${suspectedRValue.toFixed(2)}? Please enter the RSI value, not the R-value.`
      }
    };
  }

  // Standard RSI validation
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

// Function to format pathway display name
const getPathwayDisplayName = (compliancePath: string) => {
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

// Helper function to check if building type is single-detached (including secondary suite)
const isSingleDetached = (buildingType: string) => {
  return buildingType === 'single-detached' || buildingType === 'single-detached-secondary';
};

// Get filtered airtightness options based on building type and climate zone
const getFilteredAirtightnessOptions = (selections: any) => {
  const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
  const isSingleDetachedBuildingType = selections.buildingType === "single-detached" || selections.buildingType === "single-detached-secondary";
  const baseOptions = isZone7B ? airtightnessOptions_7B : airtightnessOptions;

  // For single-detached homes, only show AL-1B through AL-6B (unguarded testing)
  // For multi-unit/townhouse, show both AL-1A through AL-5A and AL-1B through AL-6B
  if (isSingleDetachedBuildingType) {
    return baseOptions.filter(option => option.value.includes('B'));
  }
  return baseOptions;
};

const getPoints = (category: string, value: string, selections: any): number => {
  if (category === "buildingVolume") {
    if (selections.isVolumeOver380 === "yes") return 0;
    const option = buildingVolumeOptions.find(opt => opt.value === value);
    return option?.points || 0;
  }

  // Get the correct options based on climate zone and building type
  const getOptionsForCategory = (cat: string) => {
    const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
    const isSingleDetachedBuildingType = selections.buildingType === "single-detached" || selections.buildingType === "single-detached-secondary";
    switch (cat) {
      case "wallRSI":
        return isZone7B ? wallRSIOptions_7B : wallRSIOptions;
      case "windowUValue":
        return isZone7B ? windowUValueOptions_7B : windowUValueOptions;
      case "belowGradeRSI":
        return isZone7B ? belowGradeRSIOptions_7B : belowGradeRSIOptions;
      case "airtightness":
        const baseOptions = isZone7B ? airtightnessOptions_7B : airtightnessOptions;
        // For single-detached homes, only show AL-1B through AL-6B (unguarded testing)
        // For multi-unit/townhouse, show both AL-1A through AL-5A and AL-1B through AL-6B
        if (isSingleDetachedBuildingType) {
          return baseOptions.filter(option => option.value.includes('B'));
        }
        return baseOptions;
      case "hrv":
        return isZone7B ? hrvOptions_7B : hrvOptions;
      case "waterHeater":
        return isZone7B ? waterHeaterOptions_7B : waterHeaterOptions;
      case "atticRSI":
        return atticRSIOptions;
      default:
        return [];
    }
  };
  const options = getOptionsForCategory(category);
  const option = options.find(opt => opt.value === value);
  return option?.points || 0;
};

const getTierCompliance = (totalPoints: number, selections: any) => {
  // If no HRV/ERV, prescriptive path is not applicable
  if (selections.hasHrv === "no_hrv") {
    return {
      tier: "Not Applicable",
      status: "destructive",
      description: "Prescriptive path requires HRV/ERV"
    };
  }
  if (selections.province === "saskatchewan") {
    // Saskatchewan follows the same NBC requirements as Alberta
    if (totalPoints >= 75) return {
      tier: "Tier 5",
      status: "success",
      description: "75+ points + 15 envelope points"
    };
    if (totalPoints >= 40) return {
      tier: "Tier 4",
      status: "success",
      description: "40+ points + 10 envelope points"
    };
    if (totalPoints >= 20) return {
      tier: "Tier 3",
      status: "success",
      description: "20+ points + 5 envelope points"
    };
    if (totalPoints >= 10) return {
      tier: "Tier 2",
      status: "success",
      description: "10+ points"
    };
    if (totalPoints > 0) return {
      tier: "Tier 1",
      status: "warning",
      description: "Baseline compliance (0 points required)"
    };
    return {
      tier: "Tier 1",
      status: "warning",
      description: "Baseline compliance (0 points required)"
    };
  } else {
    // Alberta requirements (same as Saskatchewan)
    if (totalPoints >= 75) return {
      tier: "Tier 5",
      status: "success",
      description: "75+ points + 15 envelope points"
    };
    if (totalPoints >= 40) return {
      tier: "Tier 4",
      status: "success",
      description: "40+ points + 10 envelope points"
    };
    if (totalPoints >= 20) return {
      tier: "Tier 3",
      status: "success",
      description: "20+ points + 5 envelope points"
    };
    if (totalPoints >= 10) return {
      tier: "Tier 2",
      status: "success",
      description: "10+ points"
    };
    if (totalPoints > 0) return {
      tier: "Tier 1",
      status: "warning",
      description: "Baseline compliance (0 points required)"
    };
    return {
      tier: "Tier 1",
      status: "warning",
      description: "Baseline compliance (0 points required)"
    };
  }
};

const calculatePrescriptiveCost = (tier: any) => {
  if (tier.tier === "Tier 2") {
    return 13550; // Tier 2 prescriptive upgrades
  }
  return 6888; // Tier 1 prescriptive path cost
};

const calculatePerformanceCost = (tier: any) => {
  if (tier.tier === "Tier 2") {
    return 8150; // Tier 2 performance upgrades
  }
  return 1718; // Tier 1 performance path cost
};

const calculateCostSavings = (tier: any) => {
  const prescriptiveCost = calculatePrescriptiveCost(tier);
  const performanceCost = calculatePerformanceCost(tier);
  return prescriptiveCost - performanceCost;
};

export {
  validateRSI_9362,
  validateRSI,
  getPathwayDisplayName,
  isSingleDetached,
  getFilteredAirtightnessOptions,
  getPoints,
  getTierCompliance,
  calculatePrescriptiveCost,
  calculatePerformanceCost,
  calculateCostSavings
};

