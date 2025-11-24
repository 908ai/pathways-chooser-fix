export const getPendingItems = (selections: any, uploadedFiles: any[]) => {
  const required: { label: string; fieldId: string }[] = [];
  const optional: { label: string; fieldId: string }[] = [];

  const addIfMissing = (list: { label: string; fieldId: string }[], fieldId: keyof typeof selections, label: string) => {
    const value = selections[fieldId];
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      list.push({ label, fieldId: String(fieldId) });
    }
  };

  // Step 1: Always Required
  addIfMissing(required, 'firstName', 'First Name');
  addIfMissing(required, 'lastName', 'Last Name');
  addIfMissing(required, 'company', 'Company Name');
  addIfMissing(required, 'phoneNumber', 'Phone Number');
  addIfMissing(required, 'streetAddress', 'Project Street Address');
  addIfMissing(required, 'city', 'Project City');
  addIfMissing(required, 'province', 'Project Province');
  addIfMissing(required, 'postalCode', 'Project Postal Code');
  addIfMissing(required, 'buildingType', 'Building Type');
  if (selections.province === 'alberta') {
    addIfMissing(required, 'climateZone', 'Climate Zone');
  }

  // Step 2: Always Required
  addIfMissing(required, 'compliancePath', 'Compliance Path');

  // Step 4: Always Required
  if (uploadedFiles.length === 0) {
    required.push({ label: 'At least one project document (e.g., building plans)', fieldId: 'fileUploadSection' });
  }

  // Step 3: Conditional Fields
  const pathway = selections.compliancePath;

  if (pathway) {
    switch (pathway) {
      case '9362': // Prescriptive
        addIfMissing(required, 'hasHrv', 'HRV/ERV selection');
        if (selections.hasHrv === 'with_hrv') addIfMissing(required, 'hrvEfficiency', 'HRV/ERV Efficiency');
        
        addIfMissing(required, 'ceilingsAtticRSI', 'Ceilings/Attic RSI');
        addIfMissing(required, 'hasCathedralOrFlatRoof', 'Cathedral/Flat Roof selection');
        if (selections.hasCathedralOrFlatRoof === 'yes') addIfMissing(required, 'cathedralFlatRSIValue', 'Cathedral/Flat Roof RSI');
        
        addIfMissing(required, 'wallRSI', 'Above Grade Wall RSI');
        addIfMissing(required, 'belowGradeRSI', 'Below Grade Wall RSI');
        addIfMissing(required, 'floorsSlabsSelected', 'Floors/Slabs selection');
        
        if (selections.floorsSlabsSelected?.includes("heatedFloors")) addIfMissing(required, 'inFloorHeatRSI', 'Heated Floors RSI');
        if (selections.floorsSlabsSelected?.includes("slabOnGradeIntegralFooting")) addIfMissing(required, 'slabOnGradeIntegralFootingRSI', 'Slab on Grade RSI');
        if (selections.floorsSlabsSelected?.includes("floorsOverUnheatedSpaces")) addIfMissing(required, 'floorsOverUnheatedSpacesRSI', 'Floors over Unheated Spaces RSI');
        if (selections.floorsSlabsSelected?.includes("unheatedBelowFrost")) addIfMissing(required, 'unheatedFloorBelowFrostRSI', 'Unheated Floor Below Frostline info');
        if (selections.floorsSlabsSelected?.includes("unheatedAboveFrost")) addIfMissing(required, 'unheatedFloorAboveFrostRSI', 'Unheated Floor Above Frostline RSI');

        addIfMissing(required, 'windowUValue', 'Window U-Value');
        addIfMissing(required, 'hasSkylights', 'Skylights selection');
        if (selections.hasSkylights === 'yes') addIfMissing(required, 'skylightUValue', 'Skylight U-Value');
        
        addIfMissing(required, 'airtightness', 'Airtightness Level');
        addIfMissing(required, 'heatingType', 'Heating Type');
        if (selections.heatingType) addIfMissing(required, 'heatingEfficiency', 'Heating Efficiency');
        
        addIfMissing(required, 'coolingApplicable', 'Cooling/AC selection');
        if (selections.coolingApplicable === 'yes') addIfMissing(required, 'coolingEfficiency', 'Cooling Efficiency');
        
        if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
          addIfMissing(required, 'waterHeaterType', 'Water Heater Type');
          if (selections.waterHeaterType && selections.waterHeaterType !== 'boiler') addIfMissing(required, 'waterHeater', 'Water Heater Efficiency');
          if (selections.waterHeaterType === 'other') addIfMissing(required, 'otherWaterHeaterType', 'Other Water Heater Type');
        }
        
        if (selections.heatingType === 'boiler') addIfMissing(required, 'indirectTank', 'Indirect Tank selection');
        if (selections.heatingType === 'boiler' && selections.indirectTank === 'yes') addIfMissing(required, 'indirectTankSize', 'Indirect Tank Size');
        
        addIfMissing(required, 'hasDWHR', 'Drain Water Heat Recovery selection');
        break;

      case '9365': // Performance
      case '9367': // Tiered Performance
        // REQUIRED for this step
        addIfMissing(required, 'frontDoorOrientation', 'Front Door Orientation');
        addIfMissing(required, 'energuidePathway', 'EnerGuide Pathway selection');

        // OPTIONAL technical specs
        addIfMissing(optional, 'ceilingsAtticRSI', 'Ceilings/Attics assembly info');
        addIfMissing(optional, 'hasCathedralOrFlatRoof', 'Cathedral/Flat Roof selection');
        addIfMissing(optional, 'wallRSI', 'Above Grade Walls assembly info');
        addIfMissing(optional, 'belowGradeRSI', 'Below Grade Walls assembly info');
        addIfMissing(optional, 'floorsSlabsSelected', 'Floors/Slabs selection');
        addIfMissing(optional, 'hasInFloorHeat9365', 'In-floor heat selection');
        addIfMissing(optional, 'hasSkylights', 'Skylights selection');
        addIfMissing(optional, 'airtightness', 'Airtightness Level');
        addIfMissing(optional, 'hasHrv', 'HRV/ERV selection');
        addIfMissing(optional, 'heatingType', 'Heating Type');
        addIfMissing(optional, 'coolingApplicable', 'Cooling/AC selection');
        addIfMissing(optional, 'waterHeaterType', 'Water Heater Type');
        addIfMissing(optional, 'hasDWHR', 'Drain Water Heat Recovery selection');
        addIfMissing(optional, 'interestedCertifications', 'Certification interests');
        addIfMissing(optional, 'midConstructionBlowerDoorPlanned', 'Mid-Construction Blower Door Test');
        addIfMissing(optional, 'occupancyClass', 'Occupancy Class');

        // Conditional optional fields that depend on other selections
        if (selections.hasCathedralOrFlatRoof === 'yes') {
          addIfMissing(optional, 'cathedralFlatRSI', 'Cathedral/Flat Roofs assembly info');
        }
        if (selections.hasSkylights === 'yes') {
          addIfMissing(optional, 'skylightUValue', 'Skylight U-Value');
        }
        if (selections.hasHrv === 'with_hrv') {
          addIfMissing(optional, 'hrvEfficiency', 'HRV/ERV Make/Model');
        }
        if ((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv") {
          addIfMissing(optional, 'hasSecondaryHrv', 'Secondary Suite HRV/ERV selection');
          if (selections.hasSecondaryHrv === 'separate') {
            addIfMissing(optional, 'secondaryHrvEfficiency', 'Secondary HRV/ERV Make/Model');
          }
        }
        if (selections.heatingType) {
          addIfMissing(optional, 'heatingEfficiency', 'Heating Make/Model');
          if (selections.heatingType === 'boiler') {
            addIfMissing(optional, 'indirectTank', 'Indirect Tank selection');
            if (selections.indirectTank === 'yes') {
              addIfMissing(optional, 'indirectTankSize', 'Indirect Tank Size');
            }
          }
        }
        if (selections.coolingApplicable === 'yes') {
          addIfMissing(optional, 'coolingMakeModel', 'Cooling System Make/Model');
          addIfMissing(optional, 'coolingEfficiency', 'Cooling System Efficiency');
        }
        if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
          if (selections.waterHeaterType) {
            addIfMissing(optional, 'waterHeater', 'Water Heater Make/Model');
          }
        }
        if (selections.city?.toLowerCase().trim() === "red deer" && selections.province === "alberta") {
          addIfMissing(optional, 'hasF280Calculation', 'F280 Calculation status');
        }
        
        if (selections.floorsSlabsSelected?.includes("floorsUnheated")) {
          addIfMissing(optional, 'floorsUnheatedRSI', 'Floors over Unheated Spaces info');
        }
        if (selections.floorsSlabsSelected?.includes("floorsGarage")) {
          addIfMissing(optional, 'floorsGarageRSI', 'Floors above Garages info');
        }
        if (selections.floorsSlabsSelected?.includes("unheatedBelowFrost")) {
          addIfMissing(optional, 'unheatedFloorBelowFrostRSI', 'Unheated Floor Below Frostline info');
        }
        if (selections.floorsSlabsSelected?.includes("unheatedAboveFrost")) {
          addIfMissing(optional, 'unheatedFloorAboveFrostRSI', 'Unheated Floor Above Frostline info');
        }
        if (selections.floorsSlabsSelected?.includes("heatedFloors")) {
          addIfMissing(optional, 'heatedFloorsRSI', 'Heated Floors info');
        }
        if (selections.floorsSlabsSelected?.includes("slabOnGradeIntegralFooting")) {
          addIfMissing(optional, 'slabOnGradeIntegralFootingRSI', 'Slab on Grade info');
        }
        break;

      case '9368': // Tiered Prescriptive
        addIfMissing(required, 'ceilingsAtticRSI', 'Ceilings/Attic RSI');
        addIfMissing(required, 'wallRSI', 'Above Grade Wall RSI');
        addIfMissing(required, 'belowGradeRSI', 'Below Grade Wall RSI');
        addIfMissing(required, 'windowUValue', 'Window U-Value');
        addIfMissing(required, 'airtightness', 'Airtightness Level');
        addIfMissing(required, 'hrvEfficiency', 'HRV/ERV Efficiency');
        addIfMissing(required, 'waterHeater', 'Water Heater Type');
        break;
    }
  }
  
  addIfMissing(optional, 'midConstructionBlowerDoorPlanned', 'Mid-Construction Blower Door Test');
  addIfMissing(optional, 'occupancyClass', 'Occupancy Class');

  const totalRequiredFields = 10; // An approximation for progress calculation
  const completedCount = totalRequiredFields - required.length;
  const progress = Math.max(0, (completedCount / totalRequiredFields) * 100);

  return { required, optional, progress };
};