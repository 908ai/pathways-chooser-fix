import { useState, useMemo } from 'react';
import { Selections, NBCOption, CalculatorLogic } from '@/components/calculator/types';
import * as C from '@/components/calculator/constants';

const initialSelections: Selections = {
    firstName: "",
    lastName: "",
    company: "",
    companyAddress: "",
    buildingAddress: "",
    buildingType: "",
    phoneNumber: "",
    frontDoorOrientation: "",
    province: "",
    climateZone: "",
    occupancyClass: "",
    compliancePath: "",
    isVolumeOver380: "",
    buildingVolume: "",
    ceilingsAtticRSI: "",
    ceilingsAtticOtherType: "",
    hasCathedralOrFlatRoof: "",
    cathedralFlatRSI: "",
    cathedralFlatRSIValue: "",
    cathedralFlatOtherType: "",
    wallRSI: "",
    floorsUnheatedRSI: "",
    floorsGarageRSI: "",
    hasSkylights: "",
    skylightUValue: "",
    hasSlabOnGrade: "",
    hasSlabIntegralFooting: "",
    slabInsulation: "",
    slabInsulationValue: "",
    hasInFloorHeat: "",
    hasInFloorHeat9365: "",
    floorsSlabsSelected: [],
    inFloorHeatRSI: "",
    foundationWallsRSI: "",
    slabOnGradeRSI: "",
    slabOnGradeIntegralFootingRSI: "",
    floorsOverUnheatedSpacesRSI: "",
    unheatedFloorBelowFrostRSI: "",
    unheatedFloorAboveFrostRSI: "",
    heatedFloorsRSI: "",
    windowUValue: "",
    belowGradeRSI: "",
    airtightness: "",
    customAirtightness: "",
    atticRSI: "",
    hasHrv: "",
    hrv: "",
    hasHrvErv9365: "",
    hrvMakeModel: "",
    hrvEfficiency: "",
    hasSecondaryHrv: "",
    secondaryHrvEfficiency: "",
    waterHeater: "",
    waterHeaterMakeModel: "",
    waterHeaterType: "",
    otherWaterHeaterType: "",
    hasSecondaryWaterHeater: "",
    secondaryWaterHeaterSameAsMain: "",
    secondaryWaterHeater: "",
    secondaryWaterHeaterType: "",
    hasMurbMultipleWaterHeaters: "",
    murbSecondWaterHeater: "",
    murbSecondWaterHeaterType: "",
    hasDWHR: "",
    heatingType: "",
    heatingMakeModel: "",
    heatingEfficiency: "",
    hasSecondaryHeating: "",
    secondaryHeatingType: "",
    secondaryHeatingEfficiency: "",
    secondaryIndirectTank: "",
    secondaryIndirectTankSize: "",
    hasMurbMultipleHeating: "",
    murbSecondHeatingType: "",
    murbSecondHeatingEfficiency: "",
    murbSecondIndirectTank: "",
    murbSecondIndirectTankSize: "",
    indirectTank: "",
    indirectTankSize: "",
    coolingApplicable: "",
    coolingEfficiency: "",
    coolingMakeModel: "",
    hasF280Calculation: "",
    additionalInfo: "",
    interestedCertifications: [],
    midConstructionBlowerDoorPlanned: false,
    energuidePathway: ""
};

export const useNBCCalculator = () => {
    const [selections, setSelections] = useState<Selections>(initialSelections);

    const logic = useMemo<CalculatorLogic>(() => {
        const getPoints = (category: string, value: string): number => {
            if (category === "buildingVolume") {
                if (selections.isVolumeOver380 === "yes") return 0;
                const option = C.buildingVolumeOptions.find(opt => opt.value === value);
                return option?.points || 0;
            }

            const getOptionsForCategory = (cat: string) => {
                const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
                const isSingleDetachedBuildingType = selections.buildingType === "single-detached" || selections.buildingType === "single-detached-secondary";
                switch (cat) {
                    case "wallRSI": return isZone7B ? C.wallRSIOptions_7B : C.wallRSIOptions;
                    case "windowUValue": return isZone7B ? C.windowUValueOptions_7B : C.windowUValueOptions;
                    case "belowGradeRSI": return isZone7B ? C.belowGradeRSIOptions_7B : C.belowGradeRSIOptions;
                    case "airtightness":
                        const baseOptions = isZone7B ? C.airtightnessOptions_7B : C.airtightnessOptions;
                        if (isSingleDetachedBuildingType) {
                            return baseOptions.filter(option => option.value.includes('B'));
                        }
                        return baseOptions;
                    case "hrv": return isZone7B ? C.hrvOptions_7B : C.hrvOptions;
                    case "waterHeater": return isZone7B ? C.waterHeaterOptions_7B : C.waterHeaterOptions;
                    case "atticRSI": return C.atticRSIOptions;
                    default: return [];
                }
            };
            const options = getOptionsForCategory(category);
            const option = options.find(opt => opt.value === value);
            return option?.points || 0;
        };

        const totalPoints = Object.entries(selections).reduce((total, [category, value]) => {
            if (value) {
                if (category === 'waterHeater' && selections.heatingType === 'boiler' && selections.indirectTank === 'yes') {
                    return total;
                }
                if (typeof value === 'boolean') {
                    return total;
                }
                if (Array.isArray(value)) {
                    return total + value.reduce((subTotal, item) => subTotal + getPoints(category, item), 0);
                }
                return total + getPoints(category, value as string);
            }
            return total;
        }, 0);

        const getTierCompliance = () => {
            if (selections.hasHrv === "no_hrv") {
                return { tier: "Not Applicable", status: "destructive", description: "Prescriptive path requires HRV/ERV" };
            }
            if (selections.province === "saskatchewan" || selections.province === "alberta") {
                if (totalPoints >= 75) return { tier: "Tier 5", status: "success", description: "75+ points + 15 envelope points" };
                if (totalPoints >= 40) return { tier: "Tier 4", status: "success", description: "40+ points + 10 envelope points" };
                if (totalPoints >= 20) return { tier: "Tier 3", status: "success", description: "20+ points + 5 envelope points" };
                if (totalPoints >= 10) return { tier: "Tier 2", status: "success", description: "10+ points" };
                return { tier: "Tier 1", status: "warning", description: "Baseline compliance (0 points required)" };
            }
            return { tier: "Tier 1", status: "warning", description: "Baseline compliance (0 points required)" };
        };

        const compliance = getTierCompliance();

        const calculatePrescriptiveCost = () => {
            if (compliance.tier === "Tier 2") return 13550;
            return 6888;
        };
        const calculatePerformanceCost = () => {
            if (compliance.tier === "Tier 2") return 8150;
            return 1718;
        };
        const calculateCostSavings = () => calculatePrescriptiveCost() - calculatePerformanceCost();

        const getFilteredAirtightnessOptions = () => {
            const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
            const isSingleDetachedBuildingType = selections.buildingType === "single-detached" || selections.buildingType === "single-detached-secondary";
            const baseOptions = isZone7B ? C.airtightnessOptions_7B : C.airtightnessOptions;
            if (isSingleDetachedBuildingType) {
                return baseOptions.filter(option => option.value.includes('B'));
            }
            return baseOptions;
        };

        return {
            totalPoints,
            compliance,
            costs: {
                prescriptive: calculatePrescriptiveCost(),
                performance: calculatePerformanceCost(),
                savings: calculateCostSavings(),
            },
            getFilteredAirtightnessOptions,
        };
    }, [selections]);

    return {
        selections,
        setSelections,
        logic,
    };
};