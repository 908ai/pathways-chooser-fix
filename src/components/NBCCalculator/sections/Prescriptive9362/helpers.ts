export const isSet = (value: any) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return true;
  return value !== null && value !== undefined;
};

export const getEnvelopeKeys = (selections: any) => {
  const keys: string[] = [
    "hasHrv",
    "ceilingsAtticRSI",
    "hasCathedralOrFlatRoof",
    "wallRSI",
    "belowGradeRSI",
    "floorsSlabsSelected",
    "windowUValue",
    "hasSkylights",
    "airtightness",
  ];

  if (selections.hasHrv === "with_hrv") keys.push("hrvEfficiency");
  if ((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv") {
    keys.push("hasSecondaryHrv");
    if (selections.hasSecondaryHrv === "yes") keys.push("secondaryHrvEfficiency");
  }
  if (selections.hasCathedralOrFlatRoof === "yes") keys.push("cathedralFlatRSIValue");
  if (selections.floorsSlabsSelected.includes("heatedFloors")) keys.push("inFloorHeatRSI");
  if (selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")) keys.push("slabOnGradeIntegralFootingRSI");
  if (selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces")) keys.push("floorsOverUnheatedSpacesRSI");
  if (selections.floorsSlabsSelected.includes("unheatedBelowFrost")) keys.push("unheatedFloorBelowFrostRSI");
  if (selections.floorsSlabsSelected.includes("unheatedAboveFrost")) keys.push("unheatedFloorAboveFrostRSI");
  if (selections.hasSkylights === "yes") keys.push("skylightUValue");

  return keys;
};

export const getMechanicalKeys = (selections: any, isF280RequiredCity: boolean) => {
  const keys: string[] = [
    "heatingType",
    "coolingApplicable",
    "waterHeaterType",
    "hasDWHR",
  ];

  if (selections.heatingType) {
    if (selections.heatingType === "heat-pump") {
      keys.push("heatingEfficiency");
      if (selections.heatingEfficiency === "Other") keys.push("otherHeatingEfficiency");
    } else {
      keys.push("heatingEfficiency");
    }
  }

  if (selections.heatingType === "boiler") {
    keys.push("indirectTank");
    if (selections.indirectTank === "yes") keys.push("indirectTankSize");
  }

  if ((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9362", "9365", "9367"].includes(selections.compliancePath))) {
    keys.push("hasSecondaryHeating");
    if (selections.hasSecondaryHeating === "yes") {
      keys.push("secondaryHeatingType");
      if (selections.secondaryHeatingType === "heat-pump") {
        keys.push("secondaryHeatingEfficiency");
        if (selections.secondaryHeatingEfficiency === "Other") keys.push("otherSecondaryHeatingEfficiency");
      } else {
        keys.push("secondaryHeatingEfficiency");
      }
      if (selections.secondaryHeatingType === "boiler") {
        keys.push("secondaryIndirectTank");
        if (selections.secondaryIndirectTank === "yes") keys.push("secondaryIndirectTankSize");
      }
    }
  }

  if (selections.coolingApplicable === "yes") keys.push("coolingEfficiency");

  if (selections.waterHeaterType === "other") keys.push("otherWaterHeaterType");
  if (selections.waterHeaterType && selections.waterHeaterType !== "boiler") keys.push("waterHeater");

  if ((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9362", "9365", "9367"].includes(selections.compliancePath))) {
    keys.push("hasSecondaryWaterHeater");
    if (selections.hasSecondaryWaterHeater === "yes") {
      keys.push("secondaryWaterHeaterSameAsMain");
      if (selections.secondaryWaterHeaterSameAsMain === "no") {
        keys.push("secondaryWaterHeaterType");
        if (selections.secondaryWaterHeaterType && selections.secondaryWaterHeaterType !== "boiler") {
          keys.push("secondaryWaterHeater");
        }
      }
    }
  }

  if (isF280RequiredCity) keys.push("hasF280Calculation");

  return keys;
};