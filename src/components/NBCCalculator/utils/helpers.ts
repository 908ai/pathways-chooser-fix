// src/components/NBCCalculator/utils/helpers.ts
import {
  buildingVolumeOptions,
  wallRSIOptions_7B,
  wallRSIOptions,
  windowUValueOptions_7B,
  windowUValueOptions,
  belowGradeRSIOptions_7B,
  belowGradeRSIOptions,
  airtightnessOptions_7B,
  airtightnessOptions,
  hrvOptions_7B,
  hrvOptions,
  waterHeaterOptions_7B,
  waterHeaterOptions,
  atticRSIOptions
} from '../constants/options';
import { Selections } from '../hooks/useNBCCalculator';

// Function to format pathway display name
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

// Helper function to check if building type is single-detached (including secondary suite)
export const isSingleDetached = (buildingType: string) => { 
  return buildingType === 'single-detached' || buildingType === 'single-detached-secondary';
};

export const getPoints = (category: string, value: string, selections: Selections): number => {
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

export const getTierCompliance = (totalPoints: number, selections: Selections) => {
  if (selections.hasHrv === "no_hrv") {
    return {
      tier: "Not Applicable",
      status: "destructive",
      description: "Prescriptive path requires HRV/ERV"
    };
  }
  if (selections.province === "saskatchewan") {
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

export const calculatePrescriptiveCost = (totalPoints: number, selections: Selections) => {
  const tier = getTierCompliance(totalPoints, selections);
  if (tier.tier === "Tier 2") {
    return 13550;
  }
  return 6888;
};

export const calculatePerformanceCost = (totalPoints: number, selections: Selections) => {
  const tier = getTierCompliance(totalPoints, selections);
  if (tier.tier === "Tier 2") {
    return 8150;
  }
  return 1718;
};

export const calculateCostSavings = (totalPoints: number, selections: Selections) => {
  const prescriptiveCost = calculatePrescriptiveCost(totalPoints, selections);
  const performanceCost = calculatePerformanceCost(totalPoints, selections);
  return prescriptiveCost - performanceCost;
};