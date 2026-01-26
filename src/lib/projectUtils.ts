export const mapProjectToSelections = (project: any) => {
  if (!project) return {};
  return {
    firstName: 'filled', // Assume filled as project exists
    lastName: 'filled',
    company: 'filled',
    phoneNumber: 'filled',
    streetAddress: project.street_address,
    city: project.city,
    province: project.province,
    postalCode: project.postal_code,
    buildingType: project.building_type,
    climateZone: project.climate_zone,
    occupancyClass: project.occupancy_class,
    compliancePath: project.selected_pathway,
    frontDoorOrientation: project.front_door_orientation,
    energuidePathway: project.energuide_pathway,
    hasHrv: project.hrv_erv_type && project.hrv_erv_type !== 'None' ? 'with_hrv' : project.hrv_erv_type === 'None' ? 'without_hrv' : '',
    hrvEfficiency: project.hrv_erv_efficiency,
    ceilingsAtticRSI: project.attic_rsi,
    hasCathedralOrFlatRoof: project.has_cathedral_or_flat_roof,
    cathedralFlatRSIValue: project.cathedral_flat_rsi,
    wallRSI: project.wall_rsi,
    belowGradeRSI: project.below_grade_rsi,
    floorsSlabsSelected: project.floors_slabs_selected || [],
    inFloorHeatRSI: project.in_floor_heat_rsi,
    windowUValue: project.window_u_value,
    hasSkylights: project.has_skylights,
    skylightUValue: project.skylight_u_value,
    airtightness: project.airtightness_al,
    heatingType: project.heating_system_type,
    heatingEfficiency: project.heating_efficiency,
    indirectTank: project.indirect_tank,
    indirectTankSize: project.indirect_tank_size,
    coolingApplicable: project.cooling_system_type && project.cooling_system_type !== 'None' ? 'yes' : 'no',
    coolingEfficiency: project.cooling_efficiency,
    waterHeaterType: project.water_heating_type,
    waterHeater: project.water_heating_efficiency,
    hasDWHR: project.has_dwhr,
    wantsCertifications: project.wants_certifications,
    midConstructionBlowerDoorPlanned: project.mid_construction_blower_door_planned,
    notes: project.notes, // Added notes mapping
  };
};

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
    required.push({ label: 'At least 1 project document', fieldId: 'fileUploadSection' });
  }

  // Step 3: Conditional Fields
  const pathway = selections.compliancePath;

  if (pathway) {
    switch (pathway) {
      case '9362': // Prescriptive
        addIfMissing(required, 'hasHrv', 'HRV/ERV');
        if (selections.hasHrv === 'with_hrv') addIfMissing(required, 'hrvEfficiency', 'HRV/ERV Efficiency');
        
        addIfMissing(required, 'ceilingsAtticRSI', 'Ceilings/Attic RSI');
        addIfMissing(required, 'hasCathedralOrFlatRoof', 'Cathedral/Flat Roof');
        if (selections.hasCathedralOrFlatRoof === 'yes') addIfMissing(required, 'cathedralFlatRSIValue', 'Cathedral/Flat Roof RSI');
        
        addIfMissing(required, 'wallRSI', 'Above Grade Wall RSI');
        addIfMissing(required, 'belowGradeRSI', 'Below Grade Wall RSI');
        addIfMissing(required, 'floorsSlabsSelected', 'Floors/Slabs');
        
        if (selections.floorsSlabsSelected?.includes("heatedFloors")) addIfMissing(required, 'inFloorHeatRSI', 'Heated Floors RSI');
        if (selections.floorsSlabsSelected?.includes("slabOnGradeIntegralFooting")) addIfMissing(required, 'slabOnGradeIntegralFootingRSI', 'Slab on Grade RSI');
        if (selections.floorsSlabsSelected?.includes("floorsOverUnheatedSpaces")) addIfMissing(required, 'floorsOverUnheatedSpacesRSI', 'Floors over Unheated Spaces RSI');
        if (selections.floorsSlabsSelected?.includes("unheatedBelowFrost")) addIfMissing(required, 'unheatedFloorBelowFrostRSI', 'Unheated Floor Below Frostline');
        if (selections.floorsSlabsSelected?.includes("unheatedAboveFrost")) addIfMissing(required, 'unheatedFloorAboveFrostRSI', 'Unheated Floor Above Frostline RSI');

        addIfMissing(required, 'windowUValue', 'Window U-Value');
        addIfMissing(required, 'hasSkylights', 'Skylights');
        if (selections.hasSkylights === 'yes') addIfMissing(required, 'skylightUValue', 'Skylight U-Value');
        
        addIfMissing(required, 'airtightness', 'Airtightness Level');
        addIfMissing(required, 'heatingType', 'Heating Type');
        if (selections.heatingType) addIfMissing(required, 'heatingEfficiency', 'Heating Efficiency');
        
        addIfMissing(required, 'coolingApplicable', 'Cooling/AC');
        if (selections.coolingApplicable === 'yes') addIfMissing(required, 'coolingEfficiency', 'Cooling Efficiency');
        
        if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
          addIfMissing(required, 'waterHeaterType', 'Water Heater Type');
          if (selections.waterHeaterType && selections.waterHeaterType !== 'boiler') {
            addIfMissing(required, 'waterHeater', 'Water Heater Efficiency');
          }
          if (selections.waterHeaterType === 'other') {
            addIfMissing(required, 'otherWaterHeaterType', 'Specify Other Water Heater Type');
          }
        }
        
        if (selections.heatingType === 'boiler') addIfMissing(required, 'indirectTank', 'Indirect Tank');
        if (selections.heatingType === 'boiler' && selections.indirectTank === 'yes') addIfMissing(required, 'indirectTankSize', 'Indirect Tank Size');
        
        addIfMissing(required, 'hasDWHR', 'Drain Water Heat Recovery');
        break;

      case '9365': // Performance
      case '9367': // Tiered Performance
        // REQUIRED for this step
        addIfMissing(required, 'frontDoorOrientation', 'Front Door Orientation');
        addIfMissing(required, 'energuidePathway', 'EnerGuide Pathway');

        // OPTIONAL technical specs - This is the rewritten logic
        addIfMissing(optional, 'ceilingsAtticRSI', 'Ceilings/Attics');
        addIfMissing(optional, 'hasCathedralOrFlatRoof', 'Cathedral/Flat Roof');
        addIfMissing(optional, 'wallRSI', 'Above Grade Walls');
        addIfMissing(optional, 'belowGradeRSI', 'Below Grade Walls');
        addIfMissing(optional, 'floorsSlabsSelected', 'Floors/Slabs');
        addIfMissing(optional, 'hasInFloorHeat9365', 'In-floor heat');
        addIfMissing(optional, 'hasSkylights', 'Skylights');
        addIfMissing(optional, 'airtightness', 'Airtightness Level');
        addIfMissing(optional, 'hasHrv', 'HRV/ERV');
        addIfMissing(optional, 'heatingType', 'Heating Type');
        addIfMissing(optional, 'coolingApplicable', 'Cooling/AC');
        addIfMissing(optional, 'waterHeaterType', 'Water Heater Type');
        addIfMissing(optional, 'hasDWHR', 'Drain Water Heat Recovery');
        addIfMissing(optional, 'wantsCertifications', 'Interested in Certifications');
        addIfMissing(optional, 'midConstructionBlowerDoorPlanned', 'Mid-Construction Blower Door Test');
        addIfMissing(optional, 'occupancyClass', 'Occupancy Class');
        addIfMissing(optional, 'notes', 'Additional Notes'); // Added notes to optional items

        // Conditional optional fields that depend on other selections
        if (selections.hasCathedralOrFlatRoof === 'yes') {
          addIfMissing(optional, 'cathedralFlatRSI', 'Cathedral/Flat Roofs');
        }
        if (selections.hasSkylights === 'yes') {
          addIfMissing(optional, 'skylightUValue', 'Skylight U-Value');
        }
        if (selections.hasHrv === 'with_hrv') {
          addIfMissing(optional, 'hrvEfficiency', 'HRV/ERV Make/Model');
        }
        if ((selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && selections.hasHrv === "with_hrv") {
          addIfMissing(optional, 'hasSecondaryHrv', 'Secondary Suite HRV/ERV');
          if (selections.hasSecondaryHrv === 'separate') {
            addIfMissing(optional, 'secondaryHrvEfficiency', 'Secondary HRV/ERV Make/Model');
          }
        }
        if (selections.heatingType) {
          addIfMissing(optional, 'heatingEfficiency', 'Heating Make/Model');
          if (selections.heatingType === 'boiler') {
            addIfMissing(optional, 'indirectTank', 'Indirect Tank');
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
        if ((selections.city?.toLowerCase().trim() === "red deer" || selections.city?.toLowerCase().trim() === "innisfail") && selections.province === "alberta") {
          addIfMissing(optional, 'hasF280Calculation', 'F280 Calculation status');
        }
        
        if (selections.floorsSlabsSelected?.includes("floorsUnheated")) {
          addIfMissing(optional, 'floorsUnheatedRSI', 'Floors over Unheated Spaces');
        }
        if (selections.floorsSlabsSelected?.includes("floorsGarage")) {
          addIfMissing(optional, 'floorsGarageRSI', 'Floors above Garages');
        }
        if (selections.floorsSlabsSelected?.includes("unheatedBelowFrost")) {
          addIfMissing(optional, 'unheatedFloorBelowFrostRSI', 'Unheated Floor Below Frostline');
        }
        if (selections.floorsSlabsSelected?.includes("unheatedAboveFrost")) {
          addIfMissing(optional, 'unheatedFloorAboveFrostRSI', 'Unheated Floor Above Frostline');
        }
        if (selections.floorsSlabsSelected?.includes("heatedFloors")) {
          addIfMissing(optional, 'heatedFloorsRSI', 'Heated Floors');
        }
        if (selections.floorsSlabsSelected?.includes("slabOnGradeIntegralFooting")) {
          addIfMissing(optional, 'slabOnGradeIntegralFootingRSI', 'Slab on Grade');
        }
        
        if (selections.wantsCertifications === 'yes') {
          addIfMissing(optional, 'interestedCertifications', 'Selected Certifications');
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
        addIfMissing(optional, 'notes', 'Additional Notes'); // Added notes to optional items
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

export const formatPathwayName = (pathway: string | null): string => {
  if (!pathway) return 'N/A';
  switch (pathway) {
    case '9365': return 'Performance';
    case '9362': return 'Prescriptive';
    case '9367': return 'Tiered Performance';
    case '9368': return 'Tiered Prescriptive';
    // Fallbacks for old data
    case 'performance': return 'Performance';
    case 'prescriptive': return 'Prescriptive';
    default: return pathway;
  }
};

export const getStatusInfo = (status: string | null) => {
  switch (status) {
    case 'pass':
    case 'Compliant':
      return { text: 'Compliant', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/30' };
    case 'fail':
      return { text: 'Non-Compliant', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/30' };
    case 'submitted':
      return { text: 'Submitted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-500/30' };
    case 'draft':
      return { text: 'Draft', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-500/30' };
    case 'needs_revision':
      return { text: 'Needs Revision', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30' };
    default:
      return { text: 'In Progress', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-500/30' };
  }
};

export const pathwayMapping: { [key: string]: string } = {
  '9362': 'Prescriptive',
  '9368': 'Tiered Prescriptive',
  '9365': 'Performance',
  '9367': 'Tiered Performance',
};

export const formatBuildingType = (type: string | null) => {
  if (!type) return 'N/A';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const formatProvince = (province: string | null): string => {
  if (!province) return 'N/A';
  const lowerProvince = province.toLowerCase();
  if (lowerProvince === 'saskatchewan') return 'SK';
  if (lowerProvince === 'alberta') return 'AB';
  return province;
};