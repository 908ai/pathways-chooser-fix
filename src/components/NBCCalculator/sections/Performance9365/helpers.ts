export const isSet = (value: any) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return true;
  return value !== null && value !== undefined;
};

export const getEnvelopeKeys = (selections: any) => {
  const keys = [
    "ceilingsAtticRSI",
    "hasCathedralOrFlatRoof",
    "wallRSI",
    "belowGradeRSI",
    "floorsSlabsSelected",
    "hasInFloorHeat9365",
    "hasSkylights",
    "airtightness",
  ];

  if (selections.hasCathedralOrFlatRoof === "yes") keys.push("cathedralFlatRSI");
  if (selections.floorsSlabsSelected.includes("floorsUnheated")) keys.push("floorsUnheatedRSI");
  if (selections.floorsSlabsSelected.includes("floorsGarage")) keys.push("floorsGarageRSI");
  if (selections.floorsSlabsSelected.includes("unheatedBelowFrost")) keys.push("unheatedFloorBelowFrostRSI");
  if (selections.floorsSlabsSelected.includes("unheatedAboveFrost")) keys.push("unheatedFloorAboveFrostRSI");
  if (selections.floorsSlabsSelected.includes("heatedFloors")) keys.push("heatedFloorsRSI");
  if (selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")) keys.push("slabOnGradeIntegralFootingRSI");
  if (selections.hasSkylights === "yes") keys.push("skylightUValue");

  return keys;
};

export const getMechanicalKeys = (selections: any) => {
  const keys = [
    "heatingType",
    "coolingApplicable",
    "hasDWHR",
  ];

  if (selections.city && (selections.city.toLowerCase().trim() === "red deer" || selections.city.toLowerCase().trim() === "innisfail") && selections.province === "alberta") {
    keys.push("hasF280Calculation");
  }

  if (selections.heatingType) keys.push("heatingEfficiency");

  if (selections.heatingType === 'boiler') {
    keys.push("indirectTank");
    if (selections.indirectTank === 'yes') keys.push("indirectTankSize");
  }

  // Water heater logic (if not boiler + indirect tank)
  if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
    keys.push("waterHeaterType");
    keys.push("waterHeater");
  }

  if (selections.coolingApplicable === "yes") {
    keys.push("coolingMakeModel");
    keys.push("coolingEfficiency");
  }

  if (selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") {
    keys.push("hasSecondaryHrv");
    if (selections.hasSecondaryHrv === "separate") keys.push("secondaryHrvEfficiency");
  }

  return keys;
};
