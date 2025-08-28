import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, AlertTriangle, Info, Upload, X, Edit, FileText, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";
import FileUpload from "@/components/FileUpload";
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
interface NBCOption {
  value: string;
  label: string;
  points: number;
}
const wallRSIOptions: NBCOption[] = [{
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
const windowUValueOptions: NBCOption[] = [{
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
const belowGradeRSIOptions: NBCOption[] = [{
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
const buildingVolumeOptions: NBCOption[] = [{
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
const airtightnessOptions: NBCOption[] = [{
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
const hrvOptions: NBCOption[] = [{
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
const waterHeaterOptions: NBCOption[] = [{
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

// Upgrade costs and requirements data
const upgradesData = [{
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
const atticRSIOptions: NBCOption[] = [{
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

// Zone 7B point allocations (Zone 7B: 6000 to 6999 HDD)
const wallRSIOptions_7B: NBCOption[] = [{
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
const windowUValueOptions_7B: NBCOption[] = [{
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
const belowGradeRSIOptions_7B: NBCOption[] = [{
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
const airtightnessOptions_7B: NBCOption[] = [{
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
const hrvOptions_7B: NBCOption[] = [{
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
const waterHeaterOptions_7B: NBCOption[] = [{
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
interface NBCCalculatorProps {
  onPathwayChange?: (pathwayInfo: string) => void;
}
const NBCCalculator = ({
  onPathwayChange
}: NBCCalculatorProps = {}) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState({
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
    // For Alberta: 7A or 7B
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
    // For 9365 dropdown selection
    // Floors/Slabs checkbox selections
    floorsSlabsSelected: [] as string[],
    // Array to hold multiple selections
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
    // For 9365 path HRV/ERV selection
    hrvMakeModel: "",
    hrvEfficiency: "",
    // Secondary suite HRV fields
    hasSecondaryHrv: "",
    secondaryHrvEfficiency: "",
    waterHeater: "",
    waterHeaterMakeModel: "",
    waterHeaterType: "",
    otherWaterHeaterType: "",
    // Secondary suite water heater fields
    hasSecondaryWaterHeater: "",
    secondaryWaterHeaterSameAsMain: "",
    secondaryWaterHeater: "",
    secondaryWaterHeaterType: "",
    // MURB multiple water heater fields
    hasMurbMultipleWaterHeaters: "",
    murbSecondWaterHeater: "",
    murbSecondWaterHeaterType: "",
    hasDWHR: "",
    heatingType: "",
    heatingMakeModel: "",
    heatingEfficiency: "",
    // Secondary suite heating fields
    hasSecondaryHeating: "",
    secondaryHeatingType: "",
    secondaryHeatingEfficiency: "",
    secondaryIndirectTank: "",
    secondaryIndirectTankSize: "",
    // MURB multiple heating fields
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
    interestedCertifications: [] as string[],
    midConstructionBlowerDoorPlanned: false,
    energuidePathway: "" // yes/no for EnerGuide Rating System pathway
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Load project data if editing
  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId && user) {
      loadProjectForEditing(editProjectId);
    }
  }, [searchParams, user]);
  const loadProjectForEditing = async (projectId: string) => {
    setIsLoading(true);
    console.log('Loading project for editing:', projectId);
    try {
      // Load project data using Supabase client
      const {
        data: project,
        error: projectError
      } = await supabase.from('project_summaries').select('*').eq('id', projectId).maybeSingle();
      if (projectError) {
        console.error('Error loading project:', projectError);
        throw new Error(`Failed to load project: ${projectError.message}`);
      }
      if (!project) {
        console.error('No project found for ID:', projectId);
        throw new Error('Project not found');
      }
      console.log('Project data loaded:', project);

      // Load user company information
      const {
        data: companyData,
        error: companyError
      } = await supabase.from('companies').select('*').eq('user_id', user?.id).maybeSingle();
      if (companyError && companyError.code !== 'PGRST116') {
        console.error('Error loading company data:', companyError);
      } else {
        console.log('Company data loaded:', companyData);
      }
      console.log('Mapping project data to form selections...');
      if (project) {
        // Extract first and last name from project name - format is usually "FirstName LastName - Address"
        const namePart = project.project_name?.split(' - ')[0] || "";
        const nameParts = namePart.split(' ');
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(' ') || "";
        const newSelections = {
          firstName: firstName || companyData?.company_name?.split(' ')[0] || "",
          lastName: lastName || companyData?.company_name?.split(' ').slice(1).join(' ') || "",
          company: companyData?.company_name || "",
          companyAddress: companyData?.address || "",
          buildingAddress: project.location || "",
          buildingType: project.building_type || "",
          phoneNumber: companyData?.phone || "",
          frontDoorOrientation: "",
          province: "",
          climateZone: "",
          occupancyClass: "",
          compliancePath: project.selected_pathway === 'performance' ? '9365' : '9362',
          isVolumeOver380: project.building_volume && project.building_volume > 380 ? "yes" : "no",
          buildingVolume: project.building_volume && project.building_volume !== 0 ? project.building_volume.toString() : "",
          ceilingsAtticRSI: project.attic_rsi && project.attic_rsi !== 0 ? project.attic_rsi.toString() : "",
          ceilingsAtticOtherType: "",
          hasCathedralOrFlatRoof: "",
          cathedralFlatRSI: "",
          cathedralFlatRSIValue: "",
          cathedralFlatOtherType: "",
          wallRSI: project.wall_rsi && project.wall_rsi !== 0 ? project.wall_rsi.toString() : "",
          floorsUnheatedRSI: project.floor_rsi && project.floor_rsi !== 0 ? project.floor_rsi.toString() : "",
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
          windowUValue: project.window_u_value && project.window_u_value !== 0 ? project.window_u_value.toString() : "",
          belowGradeRSI: project.below_grade_rsi && project.below_grade_rsi !== 0 ? project.below_grade_rsi.toString() : "",
          airtightness: project.airtightness_al && project.airtightness_al !== 0 ? project.airtightness_al.toString() : "",
          customAirtightness: "",
          atticRSI: project.attic_rsi && project.attic_rsi !== 0 ? project.attic_rsi.toString() : "",
          hasHrv: project.hrv_erv_type && project.hrv_erv_type !== 'None' ? "yes" : "no",
          hrv: project.hrv_erv_efficiency && project.hrv_erv_efficiency !== 0 ? project.hrv_erv_efficiency.toString() : "",
          hasHrvErv9365: project.hrv_erv_type && project.hrv_erv_type !== 'None' ? "yes" : "no",
          hrvMakeModel: "",
          hrvEfficiency: project.hrv_erv_efficiency && project.hrv_erv_efficiency !== 0 ? project.hrv_erv_efficiency.toString() : "",
          hasSecondaryHrv: "",
          secondaryHrvEfficiency: "",
          waterHeater: project.water_heating_type || "",
          waterHeaterMakeModel: "",
          waterHeaterType: project.water_heating_type || "",
          otherWaterHeaterType: "",
          hasSecondaryWaterHeater: "",
          secondaryWaterHeaterSameAsMain: "",
          secondaryWaterHeater: "",
          secondaryWaterHeaterType: "",
          hasMurbMultipleWaterHeaters: "",
          murbSecondWaterHeater: "",
          murbSecondWaterHeaterType: "",
          hasDWHR: "",
          heatingType: project.heating_system_type || "",
          heatingMakeModel: "",
          heatingEfficiency: project.heating_efficiency && project.heating_efficiency !== 0 ? project.heating_efficiency.toString() : "",
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
          coolingApplicable: project.cooling_system_type && project.cooling_system_type !== "" ? "yes" : "no",
          coolingEfficiency: project.cooling_efficiency && project.cooling_efficiency !== 0 ? project.cooling_efficiency.toString() : "",
          coolingMakeModel: "",
          hasF280Calculation: "",
          additionalInfo: "",
          interestedCertifications: [],
          midConstructionBlowerDoorPlanned: false,
          energuidePathway: ""
        };
        console.log('New selections object:', newSelections);
        setSelections(newSelections);

        // Load uploaded files from storage if they exist
        console.log('Checking for uploaded files in project data...');
        console.log('project.uploaded_files:', project.uploaded_files);
        console.log('project.uploaded_files type:', typeof project.uploaded_files);
        console.log('project.uploaded_files is array:', Array.isArray(project.uploaded_files));
        if (project.uploaded_files && Array.isArray(project.uploaded_files) && project.uploaded_files.length > 0) {
          console.log('Loading uploaded files from storage:', project.uploaded_files);

          // Filter out empty objects and only process files with valid metadata
          const validFileMetadata = project.uploaded_files.filter((fileMetadata: any) => {
            const isValid = fileMetadata && typeof fileMetadata === 'object' && fileMetadata.name && fileMetadata.url;
            console.log('File metadata validation:', fileMetadata, 'is valid:', isValid);
            return isValid;
          });
          console.log('Valid file metadata found:', validFileMetadata);
          if (validFileMetadata.length === 0) {
            console.log('No valid file metadata found, setting empty array');
            setUploadedFiles([]);
          } else {
            const restoredFiles = validFileMetadata.map((fileMetadata: any) => {
              try {
                console.log('Restoring file from metadata:', fileMetadata);

                // Create a proper File object with the metadata we have
                const restoredFile = {
                  name: fileMetadata.name,
                  size: fileMetadata.size || 0,
                  type: fileMetadata.type || 'application/octet-stream',
                  lastModified: Date.now(),
                  webkitRelativePath: '',
                  stream: () => new ReadableStream(),
                  text: () => Promise.resolve(''),
                  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                  slice: () => new Blob(),
                  // Store additional metadata for file detection
                  url: fileMetadata.url,
                  path: fileMetadata.path
                } as File & {
                  url?: string;
                  path?: string;
                };
                console.log('Restored file object:', restoredFile.name, 'size:', restoredFile.size);
                return restoredFile;
              } catch (error) {
                console.error('Error restoring file metadata:', error);
                return null;
              }
            }).filter(file => file !== null) as File[];
            console.log('Final restored files:', restoredFiles.length, 'files');
            console.log('File names:', restoredFiles.map(f => f.name));
            setUploadedFiles(restoredFiles);
          }
        } else {
          console.log('No uploaded files found in project data or uploaded_files is not a valid array');
          setUploadedFiles([]);
        }
        console.log('Form selections updated successfully');
        toast({
          title: "Project Loaded",
          description: "Project data has been loaded for editing. Make your changes and resubmit."
        });
      }
    } catch (error) {
      console.error('Error loading project for editing:', error);
      toast({
        title: "Error",
        description: "Failed to load project data for editing.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [expandedWarnings, setExpandedWarnings] = useState<{
    [key: string]: boolean;
  }>({});
  console.log("NBCCalculator rendering with selections:", selections);
  console.log("Edit project ID from URL:", searchParams.get('edit'));
  console.log("User:", user?.id);
  const toggleWarning = (warningId: string) => {
    setExpandedWarnings(prev => ({
      ...prev,
      [warningId]: !prev[warningId]
    }));
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check authentication with proper error handling
    const {
      data: {
        user
      },
      error: authError
    } = await supabase.auth.getUser();
    if (authError) {
      console.error('Authentication error during file upload:', authError);
      toast({
        title: "Authentication Error",
        description: "Please sign in again to upload files.",
        variant: "destructive"
      });
      return;
    }
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return;
    }
    const uploadPromises = Array.from(files).map(async file => {
      try {
        console.log('DEBUG: Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Create unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`;
        console.log('DEBUG: Generated file path:', fileName);

        // Upload to Supabase Storage
        console.log('DEBUG: Attempting upload to project-files bucket...');
        const {
          data,
          error
        } = await supabase.storage.from('project-files').upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        console.log('DEBUG: Upload response - data:', data, 'error:', error);
        if (error) {
          console.error('DEBUG: Upload error details:', {
            message: error.message,
            error: error
          });
          throw error;
        }

        // Get public URL
        const {
          data: urlData
        } = supabase.storage.from('project-files').getPublicUrl(fileName);
        console.log('DEBUG: Public URL data:', urlData);

        // Create a File object with additional metadata
        const uploadedFile = new File([file], file.name, {
          type: file.type
        });
        (uploadedFile as any).url = urlData.publicUrl;
        (uploadedFile as any).path = fileName;
        (uploadedFile as any).size = file.size;
        console.log('DEBUG: File uploaded successfully:', {
          name: file.name,
          size: file.size,
          type: file.type,
          path: fileName,
          url: urlData.publicUrl
        });
        return uploadedFile;
      } catch (error: any) {
        console.error('DEBUG: Detailed error uploading file:', {
          fileName: file.name,
          errorMessage: error.message,
          fullError: error
        });
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(file => file !== null) as File[];
    const failedUploads = results.filter(file => file === null);
    console.log('DEBUG: Upload results:', {
      totalFiles: files.length,
      successfulUploads: successfulUploads.length,
      failedUploads: failedUploads.length
    });
    if (successfulUploads.length > 0) {
      setUploadedFiles(prev => {
        const newFiles = [...prev, ...successfulUploads];
        console.log('DEBUG: Updated uploadedFiles state:', newFiles.map(f => f.name));
        return newFiles;
      });
      toast({
        title: "Files Uploaded",
        description: `${successfulUploads.length} file(s) uploaded successfully.`
      });
    }

    // Only show error if there were actual failures
    if (failedUploads.length > 0) {
      const failedCount = failedUploads.length;
      toast({
        title: "Some uploads failed",
        description: `${failedCount} file(s) failed to upload.`,
        variant: "destructive"
      });
    }

    // Clear the input
    event.target.value = '';
  };
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle file upload from FileUpload component
  const handleFileUploaded = (fileData: {
    name: string;
    url: string;
    size: number;
    type: string;
    path?: string;
  }) => {
    console.log('DEBUG: File uploaded via FileUpload component:', fileData);

    // Create a File-like object to maintain consistency
    const mockFile = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      lastModified: Date.now(),
      webkitRelativePath: '',
      stream: () => new ReadableStream(),
      text: () => Promise.resolve(''),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      slice: () => new Blob(),
      // Store additional metadata for file detection
      url: fileData.url,
      path: fileData.path
    } as File & {
      url?: string;
      path?: string;
    };
    setUploadedFiles(prev => {
      const newFiles = [...prev, mockFile];
      console.log('DEBUG: Updated uploadedFiles state via FileUpload:', newFiles.map(f => f.name));
      return newFiles;
    });
  };
  const handleSubmitApplication = async (pathType: 'performance' | 'prescriptive') => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found. Please sign in again.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Get company information (use form data as fallback)
      // Get company information using direct API call
      const session = await supabase.auth.getSession();
      let finalCompanyName = selections.company || 'Your Company';
      if (session.data.session) {
        try {
          const SUPABASE_URL = "https://oxvhlrvtmfnmdazwgdtp.supabase.co";
          const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmhscnZ0bWZubWRhendnZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTAyMDAsImV4cCI6MjA2NzQyNjIwMH0.vuSLwKDzf82FzbPJZ9WD0w2hFuWSzHtHBLmsY6NkSQM";
          const response = await fetch(`${SUPABASE_URL}/rest/v1/companies?user_id=eq.${user.id}&select=company_name`, {
            headers: {
              'Content-Profile': 'api',
              'Accept-Profile': 'api',
              'Authorization': `Bearer ${session.data.session.access_token}`,
              'apikey': SUPABASE_KEY
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].company_name) {
              finalCompanyName = data[0].company_name;
            }
          }
        } catch (companyError) {
          console.warn('Could not fetch company data:', companyError);
        }
      }

      // Send confirmation email
      const {
        data,
        error
      } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          userEmail: user.email,
          companyName: finalCompanyName,
          compliancePath: selections.compliancePath,
          selections: selections
        }
      });
      if (error) {
        console.warn('Email sending failed:', error);
        // Don't block submission if email fails
      }

      // Show project summary form
      setShowProjectSummary(true);
      const isEditing = searchParams.get('edit');
      if (isEditing) {
        // When editing, show success message but don't auto-redirect
        toast({
          title: "Ready for Review",
          description: "Please review your project summary below."
        });
      } else {
        // For new submissions, show success and redirect
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully. Redirecting to dashboard..."
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const WarningButton = ({
    warningId,
    title,
    children,
    variant = "warning"
  }: {
    warningId: string;
    title: string;
    children: React.ReactNode;
    variant?: "warning" | "destructive";
  }) => {
    const isExpanded = expandedWarnings[warningId];
    const bgColor = variant === "warning" ? "bg-gradient-to-r from-slate-800/60 to-teal-800/60" : "bg-gradient-to-r from-slate-800/60 to-red-800/60";
    const borderColor = variant === "warning" ? "border-2 border-orange-400" : "border-2 border-red-400";
    return <div className={`p-4 ${bgColor} ${borderColor} rounded-lg backdrop-blur-sm`}>
        <button onClick={() => toggleWarning(warningId)} className="flex items-center gap-3 w-full text-left">
          <span className="text-lg font-bold text-white">
            {title}
          </span>
        </button>
        {isExpanded && <div className="mt-4 animate-accordion-down">
            <div className="text-white font-semibold">
              {children}
            </div>
          </div>}
      </div>;
  };
  // Get filtered airtightness options based on building type and climate zone
  const getFilteredAirtightnessOptions = () => {
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
  const getPoints = (category: string, value: string): number => {
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
  const totalPoints = Object.entries(selections).reduce((total, [category, value]) => {
    if (value) {
      // Exclude water heater points if boiler with indirect tank is selected
      if (category === 'waterHeater' && selections.heatingType === 'boiler' && selections.indirectTank === 'yes') {
        return total;
      }
      // Skip boolean values as they don't contribute to points
      if (typeof value === 'boolean') {
        return total;
      }
      // Handle array values (like floorsSlabsSelected)
      if (Array.isArray(value)) {
        return total + value.reduce((subTotal, item) => subTotal + getPoints(category, item), 0);
      }
      return total + getPoints(category, value);
    }
    return total;
  }, 0);

  // Cost calculation functions
  const calculatePrescriptiveCost = () => {
    const tier = getTierCompliance();
    if (tier.tier === "Tier 2") {
      return 13550; // Tier 2 prescriptive upgrades
    }
    return 6888; // Tier 1 prescriptive path cost
  };
  const calculatePerformanceCost = () => {
    const tier = getTierCompliance();
    if (tier.tier === "Tier 2") {
      return 8150; // Tier 2 performance upgrades
    }
    return 1718; // Tier 1 performance path cost
  };
  const calculateCostSavings = () => {
    const prescriptiveCost = calculatePrescriptiveCost();
    const performanceCost = calculatePerformanceCost();
    return prescriptiveCost - performanceCost;
  };
  const getTierCompliance = () => {
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
  const compliance = getTierCompliance();

  // Show loading state while loading project data for editing
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading project data...</div>
          <div className="text-muted-foreground">Please wait while we load your project for editing.</div>
        </div>
      </div>;
  }
  return <div className="min-h-screen p-4 relative" style={{
    backgroundImage: `url(${starryMountainsBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }}>
      {/* Floating Points Breakdown - only show for tiered prescriptive path */}
      {selections.compliancePath === "9368" && <div className="fixed top-20 right-4 z-50 w-72">
          <Card className="bg-gradient-to-r from-slate-900/95 to-teal-900/95 border border-slate-400/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-white">Points Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
                  <span className="font-bold text-[#fdf3b1] text-6xl">{totalPoints.toFixed(1)}</span>
                </div>
                <p className="text-sm text-slate-200 mb-2">Total Points</p>
                <Badge variant={compliance.status as "default" | "secondary" | "destructive" | "outline"} className={`text-lg px-4 py-2 ${compliance.status === "success" ? "bg-green-100 text-green-800" : compliance.status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                  {compliance.tier}
                </Badge>
              </div>
              
              {/* Points breakdown by category */}
              <div className="space-y-2 text-sm">
                {[{
              key: 'atticRSI',
              label: 'Attic Insulation'
            }, {
              key: 'wallRSI',
              label: 'Wall Insulation'
            }, {
              key: 'windowUValue',
              label: 'Windows'
            }, {
              key: 'belowGradeRSI',
              label: 'Below Grade'
            }, {
              key: 'buildingVolume',
              label: 'Building Volume'
            }, {
              key: 'airtightness',
              label: 'Airtightness'
            }, {
              key: 'hrvSystem',
              label: 'HRV/ERV'
            }, {
              key: 'waterHeater',
              label: 'Water Heater'
            }].map(({
              key,
              label
            }) => {
              const value = selections[key as keyof typeof selections];
              if (!value || typeof value === 'boolean') return null;
              const points = Array.isArray(value) ? value.reduce((total, item) => total + getPoints(key, item), 0) : getPoints(key, value as string);
              if (points === 0) return null;
              return <div key={key} className="flex justify-between items-center text-slate-200">
                       <span className="text-xs">{label}</span>
                       <span className="font-medium text-[#b7fdb1]">+{points.toFixed(1)}</span>
                     </div>;
            })}
              </div>
              
              <div className="border-t border-slate-600 pt-2">
                <p className="text-xs text-slate-300 text-center">
                  {compliance.description}
                </p>
              </div>
              
              {/* Cost Information */}
              {(selections.compliancePath === "9368" || selections.compliancePath === "9362") && <div className="border-t border-slate-600 pt-3 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-sm font-medium text-white">Cost Estimates</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-300 hover:text-white">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" align="start" className="w-80 bg-slate-800 border-slate-600 z-[100]">
                        <div className="space-y-3">
                          <h4 className="font-medium text-white">How Cost Estimates Are Calculated</h4>
                          <div className="text-sm text-slate-300 space-y-2">
                            <p><strong>Prescriptive Path:</strong> Based on baseline construction costs plus upgrades required to meet minimum NBC2020 requirements for each building component.</p>
                            <p><strong>Performance Path:</strong> Calculated using optimized component selections that achieve the same energy performance at potentially lower cost through strategic trade-offs.</p>
                            <p><strong>Estimates Include:</strong> Materials, labor, and installation for insulation, windows, HVAC systems, and air sealing measures.</p>
                            <p><strong>Note:</strong> Costs are estimates for a typical 2,000 sq ft home and may vary based on local pricing, specific products, and installation complexity.</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-300 text-center">
                        ${calculatePrescriptiveCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-300 text-center">
                        Prescriptive Path
                      </div>
                    </div>
                    <div className="bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-300 text-center">
                        ${calculatePerformanceCost().toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-300 text-center">
                        Performance Path
                      </div>
                    </div>
                    {calculateCostSavings() > 0 && <div className="bg-gradient-to-r from-purple-600/20 to-green-600/20 p-3 rounded-lg border border-purple-400/30">
                        <div className="text-lg font-bold text-yellow-300 text-center">
                          ${calculateCostSavings().toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-300 text-center">
                          Potential Savings
                        </div>
                      </div>}
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Estimates for 2,000 sq ft home
                  </p>
                </div>}
            </CardContent>
          </Card>
        </div>}

      {/* Edit Mode Indicator */}
      {searchParams.get('edit') && <div className="mb-4 p-4 bg-gradient-to-r from-slate-600/20 to-teal-600/20 backdrop-blur-md border border-slate-400/50 rounded-xl relative z-10">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-slate-300" />
            <div>
              <div className="font-medium text-slate-100">Editing Project</div>
              <div className="text-sm text-slate-200">Make your changes and resubmit to update the project.</div>
            </div>
          </div>
        </div>}
      <div className={`mx-auto space-y-6 relative z-10 transition-all duration-300 ${selections.compliancePath === "9368" ? "max-w-3xl mr-80" : "max-w-4xl"}`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-teal-300" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-200 via-blue-200 to-teal-200 bg-clip-text text-transparent drop-shadow-lg">NBC2020 Energy Code Pathways Selector</h1>
          </div>
          <p className="text-xl bg-gradient-to-r from-slate-300 to-teal-300 bg-clip-text text-transparent font-medium mb-4 drop-shadow-md">(Alberta & Saskatchewan)</p>
          <p className="text-gray-200 text-lg drop-shadow-md">
            National Building Code of Canada - Energy Performance Compliance Tool
          </p>
        </div>

        {/* Combined Instructions Section */}
        <Card className="border-2 border-slate-400/30 bg-gradient-to-r from-slate-800/40 to-teal-800/40 backdrop-blur-md shadow-2xl">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full" defaultValue="instructions">
              <AccordionItem value="instructions" className="border-none">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-teal-500 text-white text-sm font-semibold shadow-lg">
                      ?
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Getting Started & Instructions</h3>
                      <p className="text-sm text-slate-200">Energy Compliance Calculator Overview</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 pt-2">
                    <p className="text-white">
                      Welcome! This tool helps you compare different energy code compliance paths under NBC 2020 Part 9 — including both the Prescriptive and Performance options.
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Please follow these instructions:</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-white mb-2">1. Choose Your Code Pathway:</h5>
                           <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                             <li>You can follow either the Prescriptive Path (NBC 9.36.2–9.36.4 or 9.36.8) or the Performance Path (NBC 9.36.5 or 9.36.7).</li>
                             <li>Look for the info icons to learn more about how each option affects your project. If you see an orange warning icon, click it to view important details or additional information required for that choice.</li>
                             <li>If you're unsure, we recommend starting with inputs and reviewing your results before deciding or giving us a call directly.</li>
                           </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-white mb-2">2. Enter Your Building Details:</h5>
                          <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                            <li>Input values for insulation (attic, walls, slab), mechanical systems (heating, cooling, hot water, ventilation), and windows/doors.</li>
                            <li>Select values as accurately as possible. Estimated or placeholder values are okay — we'll flag anything that needs clarification.</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-white mb-2">3. Understand What You'll See:</h5>
                           <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                             <li>As you make your selections, the app will calculate compliance and cost estimates for both pathways in the background. You'll see upgrade cost comparisons and energy performance insights to help guide your decisions. Results can be tailored to reflect your specific project details.</li>
                           </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-white mb-2">4. Need Help?</h5>
                          <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                            <li>If you have any questions, just click the "Contact Us" button. You'll talk to a real person from our local team — we're here to help you understand your options.</li>
                          </ul>
                        </div>
                      </div>

                       
                        <div className="mt-4">
                          <div className="space-y-3">
                            <h4 className="text-lg font-bold text-white">
                              Application Processing Notice
                            </h4>
                            <p className="text-white font-semibold">
                              Incomplete applications may delay results for Performance Path. Our team may follow up if additional info is needed.
                            </p>
                          </div>
                        </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-slate-800/50 to-teal-800/50 border-slate-400/40 backdrop-blur-md shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">📞</span>
                <h3 className="text-lg font-semibold text-white">Need Help? We're Here for You!</h3>
              </div>
              <p className="text-slate-100 max-w-2xl mx-auto">
                If you're unsure about anything, please call us directly. You'll speak to a real person from our small, local team. 
                We're here to walk you through the process, answer your questions, and help make energy compliance easy and stress-free.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button size="lg" className="bg-gradient-to-r from-slate-500 to-teal-500 hover:from-slate-600 hover:to-teal-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200" onClick={() => window.open('tel:403-872-2441', '_self')}>
                  📞 Call Us: 403-872-2441
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Form - Takes up 4/5 of the width (2x wider than before) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Prescriptive Building Requirements' : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? 'Performance Building Specifications' : 'Building Specifications'}
                </CardTitle>
                <CardDescription className="text-slate-200">
                  {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Specify minimum required values for prescriptive compliance' : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? 'Enter proposed building specifications for energy modeling' : 'Select performance levels for each building component'}
                </CardDescription>
              </CardHeader>
               <CardContent className="space-y-8">
                 {/* Section 1: Project Information */}
                 <Card className="bg-gradient-to-r from-slate-700/40 to-teal-700/40 border-slate-400/50 backdrop-blur-sm shadow-lg">
                   <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        📋 Project Information
                        {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <Badge variant="outline" className="ml-2 border-orange-400 text-orange-300 bg-orange-900/30">
                            Prescriptive Path
                          </Badge> : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? <Badge variant="outline" className="ml-2 border-blue-400 text-blue-300 bg-blue-900/30">
                            Performance Path
                          </Badge> : null}
                      </CardTitle>
                      <CardDescription className="text-slate-200">
                        Personal details, building location, and compliance path selection
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     {/* Personal/Contact Information */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-white border-b pb-2">Personal & Contact Information <span className="text-red-500">(Required)</span></h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">First Name</label>
                           <Input type="text" placeholder="Enter first name" value={selections.firstName} onChange={e => setSelections(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))} />
                         </div>
                         
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Last Name</label>
                           <Input type="text" placeholder="Enter last name" value={selections.lastName} onChange={e => setSelections(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))} />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Company</label>
                           <Input type="text" placeholder="Enter company name" value={selections.company} onChange={e => setSelections(prev => ({
                          ...prev,
                          company: e.target.value
                        }))} />
                         </div>

                         <div className="space-y-2">
                           <label className="text-sm font-medium">Phone Number</label>
                           <Input type="tel" placeholder="Enter phone number" value={selections.phoneNumber} onChange={e => setSelections(prev => ({
                          ...prev,
                          phoneNumber: e.target.value
                        }))} />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Company Address</label>
                         <Input type="text" placeholder="Enter company address" value={selections.companyAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        companyAddress: e.target.value
                      }))} />
                       </div>
                     </div>

                     {/* Building & Location Information */}
                     <div className="space-y-4">
                       <h4 className="text-md font-medium text-white border-b pb-2">Building & Location Details <span className="text-red-500">(Required)</span></h4>

                       {/* Upload Building Plans */}
                        <div className="space-y-2 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                          <label className="text-sm font-medium">Building Plans & Documents</label>
                          <div className="space-y-2">
                            <FileUpload onFileUploaded={handleFileUploaded} maxFiles={10} acceptedTypes={['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'tiff', 'doc', 'docx', 'xls', 'xlsx', 'txt']} maxSizePerFile={10 * 1024 * 1024} />
                            {uploadedFiles.length > 0 && <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-600">
                                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium">{uploadedFiles.length} file(s) uploaded successfully</span>
                                </div>
                                <div className="space-y-1">
                                  {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-emerald-50/80 border border-emerald-300/50 rounded-md backdrop-blur-sm">
                                       <span className="text-sm truncate text-emerald-900">{file.name}</span>
                                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0 text-green-600 hover:text-red-600">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>)}
                                </div>
                              </div>}
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-medium">Building/Project Address</label>
                         <Input type="text" placeholder="Enter building/project address" value={selections.buildingAddress} onChange={e => setSelections(prev => ({
                        ...prev,
                        buildingAddress: e.target.value
                      }))} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Building Type</label>
                          <Select value={selections.buildingType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        buildingType: value
                      }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select building type" />
                            </SelectTrigger>
                             <SelectContent className="bg-background border shadow-lg z-50">
                               <SelectItem value="single-detached">Single-detached home</SelectItem>
                               <SelectItem value="single-detached-secondary">Single-detached home with a secondary suite</SelectItem>
                               <SelectItem value="multi-unit">Multi-Unit Residential Building or Town/Row-House</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Province</label>
                            <Select value={selections.province} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            province: value,
                            // Reset technical selections when province changes
                            compliancePath: "",
                            hasHrv: "",
                            isVolumeOver380: "",
                            buildingVolume: "",
                            ceilingsAtticRSI: "",
                            hasCathedralOrFlatRoof: "",
                            cathedralFlatRSI: "",
                            wallRSI: "",
                            floorsUnheatedRSI: "",
                            floorsGarageRSI: "",
                            hasSkylights: "",
                            skylightUValue: "",
                            hasSlabOnGrade: "",
                            hasInFloorHeat: "",
                            floorsSlabsSelected: [],
                            foundationWallsRSI: "",
                            slabOnGradeRSI: "",
                            unheatedFloorBelowFrostRSI: "",
                            unheatedFloorAboveFrostRSI: "",
                            heatedFloorsRSI: "",
                            windowUValue: "",
                            belowGradeRSI: "",
                            airtightness: "",
                            atticRSI: "",
                            hrv: "",
                            hasSecondaryHrv: "",
                            secondaryHrvEfficiency: "",
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
                            waterHeater: "",
                            waterHeaterType: "",
                            hasSecondaryWaterHeater: "",
                            secondaryWaterHeaterSameAsMain: "",
                            secondaryWaterHeater: "",
                            secondaryWaterHeaterType: "",
                            hasMurbMultipleWaterHeaters: "",
                            murbSecondWaterHeater: "",
                            murbSecondWaterHeaterType: "",
                            hasDWHR: ""
                          }));
                        }}>
                             <SelectTrigger>
                               <SelectValue placeholder="Select your province" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                               <SelectItem value="alberta">Alberta</SelectItem>
                             </SelectContent>
                           </Select>
                          </div>

                           {/* Climate Zone Selection for Alberta */}
                           {selections.province === "alberta" && <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                 <label className="text-sm font-medium">Climate Zone <span className="text-red-500">*</span></label>
                                 <Dialog>
                                   <DialogTrigger asChild>
                                     <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                       <Info className="h-3 w-3 mr-1" />
                                       More info
                                     </Button>
                                   </DialogTrigger>
                                   <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                     <DialogHeader>
                                       <DialogTitle>Climate Zone Information</DialogTitle>
                                     </DialogHeader>
                                     <div className="space-y-4">
                                       <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                         <h4 className="font-semibold text-green-800 mb-2">Saskatchewan</h4>
                                         <p className="text-green-700">All of Saskatchewan is in Climate Zone 7A (5000 to 5999 HDD)</p>
                                       </div>
                                       
                                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                         <h4 className="font-semibold text-blue-800 mb-2">Alberta Climate Zones</h4>
                                         <img src="/lovable-uploads/9b289384-01b6-4f5f-a713-ddcae27167db.png" alt="Climate Zone Map for Alberta showing Zone 6, 7A, 7B, and 8 with corresponding cities and HDD ranges" className="w-full h-auto rounded-lg border border-gray-200" />
                                         <div className="mt-4 text-xs text-blue-600">
                                           <p><strong>HDD:</strong> Heating Degree Days - a measure of how much (in degrees), and for how long (in days), the outside air temperature was below a certain level.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </DialogContent>
                                 </Dialog>
                               </div>
                              <Select value={selections.climateZone} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          climateZone: value
                        }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select climate zone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7A">Zone 7A (6000+ HDD)</SelectItem>
                                  <SelectItem value="7B">Zone 7B (6000-6999 HDD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>}

                          <div className="space-y-2">
                           <label className="text-sm font-medium">Occupancy Class</label>
                           <Input type="text" placeholder="C" value={selections.occupancyClass} onChange={e => setSelections(prev => ({
                          ...prev,
                          occupancyClass: e.target.value
                        }))} />
                         </div>
                       </div>
                     </div>

                      {/* Compliance Path Selection */}
                       <div className="space-y-4">
                         {(!selections.buildingType || selections.province === "alberta" && !selections.climateZone) && <div className="p-4 bg-purple-50/80 border border-purple-300/50 rounded-md backdrop-blur-sm">
                              <p className="text-sm text-purple-300 font-medium drop-shadow-sm">
                               {!selections.buildingType ? "Please select a building type above to continue with compliance path selection." : "Please select a climate zone above to continue with compliance path selection."}
                             </p>
                           </div>}
                         
                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <h4 className="text-md font-medium text-foreground border-b pb-2">
                           Compliance Path for {isSingleDetached(selections.buildingType) ? "Single-Detached Home" : "Multi-Unit Residential Building"} <span className="text-red-500">(Required)</span>
                           {selections.province === "alberta" && selections.climateZone && <span className="text-sm font-normal text-muted-foreground ml-2">
                               (Climate Zone {selections.climateZone})
                             </span>}
                         </h4>}

                         {selections.buildingType && (selections.province !== "alberta" || selections.climateZone) && <>
                         <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium">Which compliance path are you using?</label>
                            <Dialog>
                              <DialogTrigger asChild>
                                 <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                  <Info className="h-3 w-3 mr-1" />
                                  More Info
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>NBC Part 9 Energy Compliance – Simple Overview</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">NBC Part 9 Energy Compliance – Simple Overview</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      The National Building Code of Canada (NBC) offers four main pathways to show your building meets energy efficiency requirements:
                                    </p>
                                    <div className="w-full h-px bg-muted mb-3" />
                                  </div>
                                  
                                   <div className="space-y-4">
                                     <div>
                                        <h5 className="font-medium text-sm mb-1">1. NBC 2020 9.36.2 – 9.36.4: Base Prescriptive Path</h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is the standard, minimum compliance route.</p>
                                          <p>You meet fixed insulation (RSI) values and HVAC/water heating system requirements — no energy modelling or points system required.</p>
                                          <p>An HRV is optional but influences which RSI values you must meet. No HRV means higher RSI requirements for your walls, foundation and attic.</p>
                                          <p className="text-warning-foreground">⚠️ Warning: This path may lead to higher build costs due to limited flexibility. Assemblies must meet strict minimums without trade-offs, which can increase material and labour costs.</p>
                                          <p className="mt-2">
                                            <strong>Trade-off Option (9.36.2.11):</strong> <a href="/reference/calgary-trade-off-calculator.xlsm" download className="text-emerald-300 underline hover:text-emerald-200">
                                              Download Trade-off Calculator
                                            </a> - Allows flexibility to balance R-values between building components.
                                          </p>
                                        </div>
                                       <div className="w-full h-px bg-muted mt-3" />
                                     </div>

                                     <div>
                                       <h5 className="font-medium text-sm mb-1">2. NBC 9.36.5 – Performance Modelling (Most builders choose this path)</h5>
                                       <div className="text-sm text-muted-foreground space-y-1">
                                         <p>Your design is modelled against a "reference house" which is the exact same house physically that you intend to build, but with all the specifications that meet minimum prescriptive requirements. If your house performs as well or better, it passes.</p>
                                         <p>✅ This path is now the minimum requirement in many jurisdictions for basic code compliance.</p>
                                         <p>✅ Estimated savings of up to $6,000 are possible on a 2,000 sq ft detached home, even when aiming for Tier 2, thanks to flexible trade-offs (e.g., using R20 walls instead of R24 with better airtightness).</p>
                                         <p>✅ More information: solinvictusenergyservices.com/energy-hack</p>
                                         <p className="font-medium mt-2">Benefits:</p>
                                         <div className="ml-2 space-y-1">
                                           <p>• Greater design flexibility (e.g., trade-offs between walls, windows, or systems)</p>
                                           <p>• Supports custom, non-standard, or cost-optimized assemblies</p>
                                           <p>• Allows for right-sized HVAC and reduced mechanical oversizing which can save you money</p>
                                           <p>• Helps optimize comfort and efficiency before construction</p>
                                           <p>• Ideal for developers, volume builders, and custom home projects</p>
                                         </div>
                                       </div>
                                       <div className="w-full h-px bg-muted mt-3" />
                                     </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">3. NBC 9.36.7 – Tiered Performance Path <span className="inline-block ml-2 px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold rounded">(Tier 2-5)</span></h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>An extension of the 9.36.5 performance method that targets higher energy performance tiers (Tier 2 and above).</p>
                                          <p>Requires modelling reductions in energy use, heat loss, and peak cooling.</p>
                                          <p className="font-medium mt-2">Benefits:</p>
                                          <div className="ml-2 space-y-1">
                                            <p>• Test multiple upgrade combinations to meet Tier goals affordably</p>
                                            <p>• Unlock access to incentive programs and energy labelling (e.g., CHBA Net Zero, Sask Power Beyond Code rebates)</p>
                                            <p>• More accurate energy predictions and long-term savings</p>
                                            <p>• Freedom to choose how energy performance is achieved (e.g., envelope upgrades vs. mechanical systems)</p>
                                          </div>
                                          <p className="mt-2"><strong>Note:</strong> HRVs are not required, but typically included to meet Tier thresholds effectively.</p>
                                        </div>
                                        <div className="w-full h-px bg-muted mt-3" />
                                      </div>

                                      <div>
                                        <h5 className="font-medium text-sm mb-1">4. NBC 9.36.8 – Tiered Prescriptive Path <span className="inline-block ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded">(Tier 2-5)</span></h5>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>This is a points-based route to meet Tier 2 and above without energy modelling.</p>
                                          <p>Points are earned for upgrades to insulation, windows, airtightness, HVAC, and more.</p>
                                          <p>An HRV or ERV is mandatory — without it, you cannot use this path.</p>
                                          <p className="text-warning-foreground">⚠️ Warning: May increase build costs due to rigid performance targets. Some flexibility for trade-offs with additional calculations required, otherwise every element must meet its specific upgrade requirement to claim points.</p>
                                        </div>
                                        <div className="w-full h-px bg-muted mt-3" />
                                      </div>
                                   </div>

                                  <div className="p-3 bg-muted rounded-md">
                                    <p className="text-sm font-medium mb-1">In summary:</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>• Use 9.36.2 for minimum code compliance with standard assemblies (least flexible).</p>
                                      <p>• Use 9.36.5 for the most flexibility, lower costs, and now the most common path to Tier 1 compliance.</p>
                                      <p>• Use 9.36.7 if you're aiming for Tier 2+ using simulation and want more control over your design.</p>
                                      <p>• Use 9.36.8 if you prefer a checklist/points-based approach to Tier compliance and are committed to installing an HRV.</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          {/* Current pathway display */}
                          {selections.compliancePath && <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 shadow-sm">
                              {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? <div className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PRESCRIPTIVE PATH SELECTED</div>
                                    <div className="text-sm opacity-80">Following checklist-based requirements</div>
                                  </div>
                                </div> : <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Zap className="h-5 w-5" />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-lg">PERFORMANCE PATH SELECTED</div>
                                    <div className="text-sm opacity-80">Using energy modeling and simulation</div>
                                  </div>
                                </div>}
                            </div>}
                          
                           <Select value={selections.compliancePath} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            compliancePath: value,
                            // Reset only technical selections when compliance path changes (preserve personal info)
                            frontDoorOrientation: "",
                            hasHrv: "",
                            isVolumeOver380: "",
                            buildingVolume: "",
                            ceilingsAtticRSI: "",
                            hasCathedralOrFlatRoof: "",
                            cathedralFlatRSI: "",
                            wallRSI: "",
                            floorsUnheatedRSI: "",
                            floorsGarageRSI: "",
                            hasSkylights: "",
                            skylightUValue: "",
                            hasSlabOnGrade: "",
                            hasInFloorHeat: "",
                            floorsSlabsSelected: [],
                            foundationWallsRSI: "",
                            slabOnGradeRSI: "",
                            unheatedFloorBelowFrostRSI: "",
                            unheatedFloorAboveFrostRSI: "",
                            heatedFloorsRSI: "",
                            windowUValue: "",
                            belowGradeRSI: "",
                            airtightness: "",
                            atticRSI: "",
                            hrv: "",
                            hasSecondaryHrv: "",
                            secondaryHrvEfficiency: "",
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
                            waterHeater: "",
                            waterHeaterType: "",
                            hasSecondaryWaterHeater: "",
                            secondaryWaterHeaterSameAsMain: "",
                            secondaryWaterHeater: "",
                            secondaryWaterHeaterType: "",
                            hasMurbMultipleWaterHeaters: "",
                            murbSecondWaterHeater: "",
                            murbSecondWaterHeaterType: "",
                            hasDWHR: ""
                          }));
                          onPathwayChange?.(getPathwayDisplayName(value));
                        }}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select compliance path" />
                           </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9365" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-600" />
                                      <span>9.36.5 - <strong>Performance</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9362" className="border-l-4 border-l-orange-500">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-orange-600" />
                                      <span>9.36.2 - 9.36.4 <strong>Prescriptive</strong> Path</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9367" className="border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-2">
                                      <Zap className="h-4 w-4 text-blue-600" />
                                      <span>9.36.7 - Tiered <strong>Performance</strong> Path <span className="font-bold text-emerald-600">(Tier 2-5)</span></span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="9368" className="border-l-4 border-l-orange-500">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-orange-600" />
                                      <span>9.36.8 – Tiered <strong>Prescriptive</strong> Path <span className="font-bold text-purple-300">(Tier 2-5)</span></span>
                                    </div>
                                  </SelectItem>
                                 </SelectContent>
                           </Select>
                         </div>
                        
                         {/* Front Door Orientation for Performance Paths */}
                         {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <label className="text-sm font-medium">Front Door Orientation</label>
                                  <Dialog>
                                   <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                        <Info className="h-3 w-3 mr-1" />
                                        More Info
                                      </Button>
                                   </DialogTrigger>
                                   <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                     <DialogHeader>
                                       <DialogTitle>Why Orientation Matters in Energy Efficiency</DialogTitle>
                                     </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold text-sm mb-2">Why Orientation Matters in Energy Efficiency</h4>
                                      </div>
                                      <div className="space-y-4">
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Peak Cooling Loads:</h5>
                                          <p className="text-sm text-muted-foreground">Orientation impacts solar gains throughout the year. In summer and shoulder seasons, limiting solar gain helps prevent overheating—an explicit requirement of the Tiered Energy Codes. In winter, optimizing solar gain helps reduce heating loads, improving performance without sacrificing comfort.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Optimizes Performance Modelling:</h5>
                                          <p className="text-sm text-muted-foreground">Strategic solar design can earn "bonus points" in energy models by reducing heating demand—advantages not available in the prescriptive path.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Glazing Area Impacts Compliance:</h5>
                                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            <li>Reference houses assume a 17–22% window-to-wall ratio.</li>
                                            <li>Homes with less glazing than the reference benefit from reduced heat loss and can earn additional performance credits.</li>
                                          </ul>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Supports Higher Tier Compliance:</h5>
                                          <p className="text-sm text-muted-foreground">Smart orientation and glazing design are low-cost, high-impact strategies that improve energy performance and help meet Tier 1, Tier 2, or Net Zero Ready targets.</p>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Additional Benefits:</h5>
                                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            <li>Smart solar gain strategies can earn "bonus points" by offsetting heating loads in the energy model.</li>
                                            <li>Designs with less glazing than the reference earn performance credits due to reduced heat loss.</li>
                                            <li>Orientation and glazing strategies are low-cost design choices that help meet Tier 1, Tier 2, or even Net Zero Ready targets more easily.</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                   </DialogContent>
                                 </Dialog>
                             </div>
                            <Select value={selections.frontDoorOrientation} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          frontDoorOrientation: value
                        }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select orientation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="N">North (N)</SelectItem>
                                <SelectItem value="NE">Northeast (NE)</SelectItem>
                                <SelectItem value="E">East (E)</SelectItem>
                                <SelectItem value="SE">Southeast (SE)</SelectItem>
                                <SelectItem value="S">South (S)</SelectItem>
                                <SelectItem value="SW">Southwest (SW)</SelectItem>
                                <SelectItem value="W">West (W)</SelectItem>
                                <SelectItem value="NW">Northwest (NW)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>}
                         </>}
                      </div>
                   </CardContent>
                  </Card>

                  {/* EnerGuide Rating System for Performance Paths */}
                  {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium">Would you like to pursue the EnerGuide Rating System (ERS) pathway in conjunction with the Performance Path?</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                  <Info className="h-3 w-3 mr-1" />
                                  More Info
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[700px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-base mb-3">What is the EnerGuide Pathway?</h4>
                                      <p>
                                        The EnerGuide pathway is one way to show that a new home meets energy efficiency requirements under Canada's building code (NBC 2020). Instead of following a strict checklist of materials and specs, this approach uses energy modelling to test how well a home will perform.
                                      </p>
                                    </div>

                                    {/* EnerGuide Label Image */}
                                     <div className="flex justify-center my-6">
                                       <img src="/lovable-uploads/41513243-46b5-48ef-bcf8-fe173a109b21.png" alt="The New EnerGuide Label - showing home energy performance rating and breakdown" className="max-w-full h-auto rounded-lg shadow-md" />
                                     </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">How Does It Work?</h3>
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li>A trained Energy Advisor creates a computer model of your home's design.</li>
                                        <li>That model is compared to a "reference house" built to basic code standards.</li>
                                        <li>If your design uses equal or less energy, it passes—even if you made different design choices than what's prescribed in the code.</li>
                                      </ul>
                                      <p className="mt-2">This means you have more freedom in how you build, as long as the home performs well overall.</p>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">What's Involved?</h3>
                                      <div className="space-y-3">
                                        <div>
                                          <p>The advisor uses special software (usually HOT2000) to calculate things like:</p>
                                          <ul className="list-disc pl-5 space-y-1 mt-1">
                                            <li>Energy use</li>
                                            <li>Heat loss</li>
                                            <li>Cooling needs</li>
                                          </ul>
                                        </div>
                                        <p>They also track airtightness with a blower door test to see how much air leaks out of the home.</p>
                                        <div>
                                          <p>You'll receive three key reports:</p>
                                          <ul className="list-disc pl-5 space-y-1 mt-1">
                                            <li>Pre-construction report (submitted with your permit)</li>
                                            <li>As-built report/label (shows what was actually built, submitted for occupancy)</li>
                                            <li>A mid-construction report is optional.</li>
                                          </ul>
                                          <p className="mt-3 text-sm">Note: There is an incremental cost for the final data collection & air-tightness test.</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">Who Does What?</h3>
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Energy Advisor:</strong> Builds the model, runs tests, creates compliance documents.</li>
                                        <li><strong>Builder:</strong> Must build what's in the model and ensure it meets the code.</li>
                                        <li><strong>Building Official:</strong> Checks paperwork and inspects the home for compliance.</li>
                                      </ul>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">Why Is Airtightness Important?</h3>
                                      <p>
                                        Airtight homes lose less heat and use less energy. In higher code tiers (like Tier 4 or 5), airtightness targets are mandatory and can't be traded off for other upgrades.
                                      </p>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">How It Fits Into the Tiered Code</h3>
                                      <div className="space-y-2">
                                        <p>Canada's new energy code has tiers: the higher the tier, the more efficient the home. Builders can choose between:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>A prescriptive path (points-based, no energy modeling)</li>
                                          <li>A performance path (like ERS, which requires modeling)</li>
                                        </ul>
                                        <p>The EnerGuide path is part of the performance path. It's especially useful for builders wanting to reach higher energy tiers or qualify for rebates.</p>
                                      </div>
                                    </div>

                                    <div className="border-t pt-4">
                                      <h3 className="font-semibold text-base mb-3">Bottom Line</h3>
                                      <p>
                                        The EnerGuide performance path is a flexible, model-based way to prove your new home is energy efficient. It's widely used, especially in places like Saskatchewan, where 90% of projects use this method—often because it's more adaptable, accurate, and rebate-friendly.
                                      </p>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <Select value={selections.energuidePathway} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        energuidePathway: value
                      }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select yes or no" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>}


                  {selections.compliancePath === "9362" && <div className="space-y-4">

                     {/* HRV/ERV Section for 9362 */}
                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">Does this building include an HRV or ERV?</label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                <Info className="h-3 w-3 mr-1" />
                                More Info
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Should I include an HRV (Heat Recovery Ventilator)?</DialogTitle>
                              </DialogHeader>
                             <div className="space-y-4">
                               <div>
                                 <h4 className="font-semibold text-sm mb-2">Should I include an HRV (Heat Recovery Ventilator)?</h4>
                                 <p className="text-xs text-muted-foreground">
                                   An HRV is a system that brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts. It improves indoor air quality and energy efficiency — especially in airtight homes.
                                 </p>
                               </div>
                               
                               <div>
                                 <h5 className="font-medium text-sm mb-1">Why you should consider an HRV:</h5>
                                 <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                   <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                   <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                   <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                   <li><strong>Code compliance:</strong> In many cases, an HRV can help you meet building envelope requirements with less insulation.</li>
                                 </ul>
                               </div>

                               <div>
                                 <h5 className="font-medium text-sm mb-1">When is an HRV required?</h5>
                                 <p className="text-xs text-muted-foreground">
                                   While not always mandatory, HRVs are required or strongly recommended for homes with very low air leakage rates (typically below 2.5 ACH50) to ensure adequate ventilation. They're also required for certain energy efficiency programs.
                                 </p>
                               </div>

                               <div>
                                 <h5 className="font-medium text-sm mb-1">HRV vs. ERV:</h5>
                                 <div className="text-xs text-muted-foreground space-y-1">
                                   <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                   <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                 </div>
                               </div>
                             </div>
                            </DialogContent>
                          </Dialog>
                       </div>
                       <Select value={selections.hasHrv} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasHrv: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select option" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                           <SelectItem value="without_hrv">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                      {selections.hasHrv === "with_hrv" && <div className="space-y-2">
                            <label className="text-sm font-medium">HRV/ERV Efficiency</label>
                             <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.hrvEfficiency || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    hrvEfficiency: e.target.value
                  }))} />
                        </div>}

                      {/* Secondary Suite HRV - Show for buildings with multiple units */}
                      {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                            <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium">Will there be a second HRV/ERV for the secondary suite?</label>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                    <Info className="h-3 w-3 mr-1" />
                                    More Info
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Secondary Suite HRV/ERV Information</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Independent HRV/ERV for Secondary Suite</h4>
                                      <p className="text-xs text-muted-foreground">
                                        A secondary suite may require its own HRV/ERV system to ensure adequate ventilation and maintain indoor air quality independently from the main dwelling unit.
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">When a second HRV/ERV is needed:</h5>
                                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                        <li><strong>Separate ventilation zones:</strong> When the secondary suite requires independent air quality control.</li>
                                        <li><strong>Building code requirements:</strong> Some jurisdictions require separate ventilation systems for secondary suites.</li>
                                        <li><strong>Different occupancy patterns:</strong> When main and secondary units have different ventilation needs.</li>
                                        <li><strong>Privacy and control:</strong> Allowing tenants to control their own indoor air quality.</li>
                                      </ul>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input type="radio" name="hasSecondaryHrv" value="yes" checked={selections.hasSecondaryHrv === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHrv: e.target.value,
                          secondaryHrvEfficiency: "" // Reset when changing
                        }))} className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm">Yes</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="radio" name="hasSecondaryHrv" value="no" checked={selections.hasSecondaryHrv === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHrv: e.target.value,
                          secondaryHrvEfficiency: ""
                        }))} className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm">No</span>
                              </label>
                            </div>
                          </div>

                          {selections.hasSecondaryHrv === "yes" && <div className="space-y-2">
                              <label className="text-sm font-medium">Secondary Suite HRV/ERV Efficiency</label>
                              <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      secondaryHrvEfficiency: e.target.value
                    }))} />
                            </div>}
                        </div>}


                      <div className="space-y-2">
                       <label className="text-sm font-medium">Ceilings below Attics</label>
                         <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? "Min RSI 8.67 w/ HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 w/o HRV" : "Min RSI 8.67 w/ HRV, 10.43 w/o HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                  }))} />
                          {selections.buildingType !== "single-detached-secondary" && (() => {
                    // For 9.36.2: 8.67 RSI with HRV, 10.43 RSI without HRV
                    const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : selections.hasHrv === "without_hrv" ? 10.43 : 8.67;
                    const validation = validateRSI_9362(selections.ceilingsAtticRSI, minRSI, `ceilings below attics`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId="ceilingsAtticRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                                   <p className="text-sm text-destructive/80">
                                    {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "8.67 with HRV" : selections.hasHrv === "without_hrv" ? "10.43 without HRV" : "8.67 with HRV or 10.43 without HRV"} to meet NBC 9.36.2 requirements.`}
                                   </p>
                                </WarningButton>;
                    }
                    return null;
                  })()}
                        {selections.buildingType !== "single-detached-secondary" && <WarningButton warningId="ceilingsAtticRSI-9362" title="Effective RSI/R-Value Required">
                           <p className="text-sm text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>}
                      </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Is there any cathedral ceilings or flat roof?</label>
                       <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: "",
                    cathedralFlatRSIValue: ""
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select option" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="no">No</SelectItem>
                           <SelectItem value="yes">Yes</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                      {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                        <label className="text-sm font-medium">Cathedral / Flat Roofs - Min. 5.02 RSI</label>
                        <Input type="text" placeholder="Enter RSI value (min. 5.02)" value={selections.cathedralFlatRSIValue || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSIValue: e.target.value
                  }))} />
                        {(() => {
                    const minRSI = 5.02;
                    const validation = validateRSI_9362(selections.cathedralFlatRSIValue, minRSI, `cathedral/flat roofs`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId="cathedralFlatRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                                 <p className="text-sm text-destructive/80">
                                  {`The RSI value must be increased to at least 5.02 to meet NBC 9.36.2 requirements for cathedral/flat roofs.`}
                                 </p>
                              </WarningButton>;
                    }
                    return null;
                  })()}
                        <WarningButton warningId="cathedralFlatRSI-9362" title="Effective RSI Value Required">
                           <p className="text-sm text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Above Grade Walls</label>
                         <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? 'Min RSI 2.97 w/ HRV (e.g., R20 Batt/2x6/16"OC)' : selections.hasHrv === "without_hrv" ? 'Min RSI 3.69 w/o HRV (e.g., R20 Batt/2x6/16"OC)' : 'Min RSI 2.97 w/ HRV, 3.69 w/o HRV (e.g., R20 Batt/2x6/16"OC)'} value={selections.wallRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    wallRSI: e.target.value
                  }))} />
                       {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.97 : 3.69;
                    const validation = validateRSI_9362(selections.wallRSI, minRSI, `above grade walls`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId="wallRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                                <p className="text-sm text-destructive/80">
                                 {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.97 with HRV" : "3.69 without HRV"} to meet NBC 9.36.2 requirements for above grade walls.`}
                                </p>
                             </WarningButton>;
                    }
                    return null;
                  })()}
                      <WarningButton warningId="wallRSI-9362" title="Effective RSI/R-Value Required">
                          <p className="text-sm text-white">
                           You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                      </WarningButton>
                    </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Below Grade Walls (Foundation Walls)</label>
                         <Input type="text" placeholder={selections.hasHrv === "with_hrv" ? "Min RSI 2.98 (with HRV, e.g., R12 Batt/2x4/24\"OC)" : selections.hasHrv === "without_hrv" ? "Min RSI 3.46 (without HRV, e.g., R12 Batt/2x4/24\"OC)" : "Select HRV option first"} value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: e.target.value
                  }))} />
                       {(() => {
                    const minRSI = selections.hasHrv === "with_hrv" ? 2.98 : 3.46;
                    const validation = validateRSI_9362(selections.belowGradeRSI, minRSI, `below grade walls`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId="belowGradeRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                                <p className="text-sm text-destructive/80">
                                 {`The RSI value must be increased to at least ${selections.hasHrv === "with_hrv" ? "2.98 with HRV" : "3.46 without HRV"} to meet NBC 9.36.2 requirements for below grade walls.`}
                                </p>
                             </WarningButton>;
                    }
                    return null;
                  })()}
                      <WarningButton warningId="belowGradeRSI-9362" title="Effective RSI/R-Value Required">
                          <p className="text-sm text-white">
                           You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                        </p>
                      </WarningButton>
                    </div>

                     <div className="space-y-4">
                       <label className="text-sm font-medium">Floors/Slabs (Select all that apply)</label>
                       <div className="space-y-2">
                         <label className="flex items-center gap-2">
                           <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} onChange={e => {
                        const value = "unheatedBelowFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                           <span className="text-sm">Unheated Floor Below Frostline</span>
                         </label>
                         <label className="flex items-center gap-2">
                           <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                        const value = "unheatedAboveFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                           <span className="text-sm">Unheated Floor Above Frost Line (or walk-out basement)</span>
                         </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} onChange={e => {
                        const value = "heatedFloors";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value),
                          hasInFloorHeat: e.target.checked ? "yes" : "no"
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Heated Floors</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} onChange={e => {
                        const value = "slabOnGradeIntegralFooting";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                             <span className="text-sm">Slab on grade with integral Footing</span>
                           </label>
                           <label className="flex items-center gap-2">
                             <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces")} onChange={e => {
                        const value = "floorsOverUnheatedSpaces";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                             <span className="text-sm">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                           </label>
                        </div>
                     </div>

                     {selections.floorsSlabsSelected.includes("heatedFloors") && <div className="space-y-2">
                         <label className="text-sm font-medium">Heated Floors</label>
                         <Input type="text" placeholder={`Min RSI ${selections.province === "saskatchewan" ? "2.84 (R-16.1)" : "1.34 (R-7.6)"} for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.inFloorHeatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    inFloorHeatRSI: e.target.value
                  }))} />
                         {(() => {
                    const minRSI = selections.province === "saskatchewan" ? 2.84 : 1.34;
                    const validation = validateRSI_9362(selections.inFloorHeatRSI, minRSI, `heated floors`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId="inFloorHeatRSI-9362-low" title="RSI Value Too Low" variant="destructive">
                                  <p className="text-sm text-destructive/80">
                                   The RSI value must be increased to at least {minRSI} to meet NBC 9.36.2 requirements for heated floors in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}.
                                  </p>
                               </WarningButton>;
                    }
                    return null;
                  })()}
                         <WarningButton warningId="inFloorHeatRSI-9362" title="Effective RSI/R-Value Required">
                            <p className="text-sm text-white">
                             You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>}

                     {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div className="space-y-2">
                         <label className="text-sm font-medium">Slab on grade with integral Footing</label>
                         <Input type="text" placeholder="Min RSI 2.84 or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    slabOnGradeIntegralFootingRSI: e.target.value
                  }))} />
                          <WarningButton warningId="slabOnGradeIntegralFootingRSI-9362" title="Effective RSI/R-Value Required">
                              <p className="text-sm text-white">
                               You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                            </p>
                           </WarningButton>
                           
                           {selections.slabOnGradeIntegralFootingRSI && !isNaN(parseFloat(selections.slabOnGradeIntegralFootingRSI)) && parseFloat(selections.slabOnGradeIntegralFootingRSI) < 2.84 && <WarningButton warningId="slabOnGradeIntegralFootingRSI-min" title="RSI Value Too Low" variant="destructive">
                               <p className="text-xs text-destructive/80">
                                 The RSI value must be at least 2.84 to meet NBC 9.36.2 minimum requirements for slab on grade with integral footing.
                               </p>
                             </WarningButton>}
                        </div>}

                      {selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces") && <div className="space-y-2">
                          <label className="text-sm font-medium">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                          <Input type="text" placeholder="Min RSI 5.02" value={selections.floorsOverUnheatedSpacesRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsOverUnheatedSpacesRSI: e.target.value
                  }))} />
                           <WarningButton warningId="floorsOverUnheatedSpacesRSI-9362" title="Effective RSI/R-Value Required">
                               <p className="text-sm text-white">
                                You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                             </p>
                           </WarningButton>
                         </div>}

                     {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div className="space-y-2">
                         <label className="text-sm font-medium">Unheated Floor Below Frost Line</label>
                         <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorBelowFrostRSI: e.target.value
                  }))} />
                         <div className="p-3 bg-muted border border-border rounded-md">
                            <p className="text-sm text-white font-medium">
                             ℹ️ Unheated Floor Below Frost Line
                           </p>
                           <p className="text-xs text-muted-foreground mt-1">
                             This assembly typically remains uninsulated as per NBC requirements but can be insulated to improve comfort in these areas. Enter 'uninsulated' or specify an RSI value if insulation is provided.
                           </p>
                         </div>
                       </div>}

                     {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div className="space-y-2">
                         <label className="text-sm font-medium">Unheated Floor Above Frost Line</label>
                         <Input type="number" step="0.01" min="0" placeholder="Minimum RSI 1.96" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorAboveFrostRSI: e.target.value
                  }))} />
                         {selections.unheatedFloorAboveFrostRSI && parseFloat(selections.unheatedFloorAboveFrostRSI) < 1.96 && <WarningButton warningId="unheatedFloorAboveFrostRSI-low" title="RSI Value Too Low" variant="destructive">
                             <p className="text-xs text-destructive/80">
                               The RSI value must be increased to at least 1.96 to meet NBC requirements for unheated floor above frost line.
                             </p>
                           </WarningButton>}
                          <WarningButton warningId="unheatedFloorAboveFrostRSI-9362" title="Effective RSI/R-Value Required">
                              <p className="text-sm text-white">
                               You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                            </p>
                          </WarningButton>
                        </div>}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Window & Door U-Value</label>
                       <Input type="text" placeholder="Input Range of U-values - Max U-Value 1.61 W/(m²·K) or Min Energy Rating ≥ 25" value={selections.windowUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    windowUValue: e.target.value
                  }))} />
                       {(() => {
                    // Check if input is a U-value and if it's too high
                    const inputValue = selections.windowUValue;
                    if (inputValue) {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue > 1.61) {
                        return <WarningButton warningId="windowUValue-9362-high" title="U-Value Too High" variant="destructive">
                                  <p className="text-sm text-destructive/80">
                                   The U-value must be 1.61 W/(m²·K) or lower to meet NBC 9.36.2 requirements for windows and doors.
                                  </p>
                               </WarningButton>;
                      }
                    }
                    return null;
                  })()}
                       <WarningButton warningId="windowDoor-verification-9362" title="Window & Door Performance Verification">
                           <p className="text-sm text-white">
                           Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value (ie, highest U-value W/(m²×K).
                         </p>
                        </WarningButton>
                     </div>

                     <div className="space-y-2">
                      <label className="text-sm font-medium">Does the house have skylights?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="hasSkylights-9362" value="yes" checked={selections.hasSkylights === "yes"} onChange={e => setSelections(prev => ({
                        ...prev,
                        hasSkylights: e.target.value
                      }))} className="w-4 h-4 text-primary" />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="hasSkylights-9362" value="no" checked={selections.hasSkylights === "no"} onChange={e => setSelections(prev => ({
                        ...prev,
                        hasSkylights: e.target.value
                      }))} className="w-4 h-4 text-primary" />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                     </div>
                     
                      <WarningButton warningId="skylight-shaft-insulation-9362" title="Important: Skylight Shaft Insulation">
                         <p className="text-xs text-white">
                          Skylight shafts must be insulated. Be prepared to provide further details upon request.
                        </p>
                      </WarningButton>

                    {selections.hasSkylights === "yes" && <div className="space-y-2">
                        <label className="text-sm font-medium">Skylight U-Value</label>
                         <Input type="number" step="0.01" min="0" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    skylightUValue: e.target.value
                  }))} />
                          {(() => {
                    const maxUValue = selections.province === "alberta" && selections.climateZone === "7B" ? 2.41 : 2.75;
                    return selections.skylightUValue && parseFloat(selections.skylightUValue) > maxUValue && <WarningButton warningId="skylightUValue-high-9362" title="U-Value Too High" variant="destructive">
                                 <p className="text-sm text-destructive/80">
                                  The U-value must be reduced to {maxUValue} or lower to meet NBC requirements for skylights in your climate zone.
                                </p>
                              </WarningButton>;
                  })()}
                       </div>}
                     
                      {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9362-2" title="Important: Skylight Shaft Insulation">
                           <p className="text-xs text-white">
                            Skylight shafts must be insulated. Be prepared to provide further details upon request.
                          </p>
                        </WarningButton>}

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Airtightness Level (Unguarded Testing)</label>
                        <Popover>
                          <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                              More Info
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                             <div className="space-y-4">
                               <div>
                                 <h4 className="font-semibold text-sm mb-2">What's a Blower Door Test?</h4>
                                 <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                               </div>
                               
                               <div className="w-full h-px bg-muted"></div>
                               
                               <div className="space-y-4">
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                   <div className="space-y-3 text-sm text-muted-foreground">
                                     <div>
                                       <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                       <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                       <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                     </div>
                                     <div>
                                       <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                       <p className="ml-4">Total leak area per square metre of envelope.</p>
                                       <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                     </div>
                                     <div>
                                       <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                       <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                       <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                     </div>
                                     <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                   </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                   <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                     <p>• A full detached house</p>
                                     <p>• A single unit in a row house or duplex</p>
                                     <p>• A section of a large home or multi-unit building</p>
                                   </div>
                                   <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                   <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                     <p>• Small homes have more corners and connections relative to their size.</p>
                                     <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                     <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                   </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                   <div className="space-y-3 text-sm text-muted-foreground">
                                     <div>
                                       <p className="font-medium">Unguarded Test</p>
                                       <div className="ml-4 space-y-1">
                                         <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                         <p>• Includes leakage between units.</p>
                                         <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                       </div>
                                     </div>
                                     <div>
                                       <p className="font-medium">Guarded Test</p>
                                       <div className="ml-4 space-y-1">
                                         <p>• All adjacent units are depressurized at the same time.</p>
                                         <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                         <p>• Ideal for multi-unit buildings, but more complex.</p>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                   <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                     <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                     <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                   </div>
                                   <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                    <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                      <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                      <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                      <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different.</p>
                                    </div>
                                  </div>
                                  
                                  <div className="w-full h-px bg-muted"></div>
                                  
                                  <div>
                                    <h5 className="font-medium text-sm mb-2">Potential Air Leakage Locations</h5>
                                    <p className="text-sm text-muted-foreground mb-3">Common areas where air leakage occurs in buildings:</p>
                                    <div className="mb-3">
                                      <img src="/lovable-uploads/9d231144-3c4e-430b-9f8c-914698eae23e.png" alt="Figure 9.25-9 Potential air leakage locations in a house showing various points where air can escape including joints at attic hatches, ceiling light fixtures, windows, electrical outlets, around posts and columns, chimney leaks, plumbing stack penetrations, and more" className="w-full h-auto border border-border rounded" onLoad={() => console.log('Air leakage diagram loaded successfully')} onError={e => console.log('Failed to load air leakage diagram:', e)} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Figure 9.25-9 from Housing and Small Buildings - Illustrated User's Guide, National Building Code of Canada 2020, Part 9 of Division B
                                    </p>
                                  </div>
                               </div>

                               <div className="space-y-2">
                                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                   <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                   <div className="space-y-1">
                                     <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                       View the Blower Door Checklist
                                     </a>
                                     <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                       More airtightness information
                                     </a>
                                   </div>
                                 </div>
                               </div>
                             </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                       <Input type="text" placeholder={`Min ${selections.province === "saskatchewan" ? "3.2" : "3.0"} ACH50 for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.airtightness} onChange={e => setSelections(prev => ({
                    ...prev,
                    airtightness: e.target.value
                  }))} />
                       
                       <WarningButton warningId="airtightness-caution-9362" title="Caution: Air-Tightness Targets Without Testing History">
                          <div className="text-xs text-white space-y-2">
                           <p>
                             Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                           </p>
                           <p>
                             We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                           </p>
                           <p>
                             If your final blower door test doesn't meet the target you've claimed, you could:
                           </p>
                           <ul className="list-disc ml-4 space-y-1">
                             <li>Miss required performance metrics</li>
                             <li>Be denied a permit or occupancy</li>
                             <li>Face expensive late-stage upgrades or rework</li>
                           </ul>
                           <p>
                             <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                           </p>
                           <div className="flex items-center gap-1 text-sm mt-3">
                             <span>🔗</span>
                              <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">
                               More information
                             </a>
                           </div>
                         </div>
                       </WarningButton>

                        {(() => {
                    const airtightnessValue = parseFloat(selections.airtightness || "0");

                    // Determine minimum threshold based on province
                    let minimumThreshold = 3.0; // Default for Alberta
                    let thresholdText = "3.0";
                    if (selections.province === "saskatchewan") {
                      minimumThreshold = 3.2;
                      thresholdText = "3.2";
                    }
                    const showWarning = airtightnessValue > 0 && airtightnessValue < minimumThreshold;
                    return showWarning ? <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                                <div className="flex items-start gap-2">
                                  <span className="text-destructive text-lg">⚠️</span>
                                  <div className="space-y-2">
                                     <h4 className="font-medium text-destructive">Airtightness Value Too Low</h4>
                                      <p className="text-sm text-destructive/80">
                                        The airtightness value must be at least {thresholdText} ACH50 for prescriptive unguarded testing in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}. Please increase your target value.
                                     </p>
                                 </div>
                               </div>
                             </div> : null;
                  })()}
                        
                        {/* Mid-Construction Blower Door Test Checkbox */}
                        <div className="space-y-3 pt-4 border-t border-border/20">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="midConstructionBlowerDoor-9362" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                        ...prev,
                        midConstructionBlowerDoorPlanned: e.target.checked
                      }))} className="w-4 h-4 text-primary mt-1" />
                            <div className="flex-1">
                              <label htmlFor="midConstructionBlowerDoor-9362" className="text-sm font-medium cursor-pointer">
                                Mid-Construction Blower Door Test Planned
                              </label>
                            </div>
                          </div>
                          
                          <WarningButton warningId="mid-construction-blower-door-info-9362" title="Benefits of Mid-Construction Blower Door Testing">
                             <div className="text-xs text-white space-y-2">
                              <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                              <ul className="list-disc ml-4 space-y-1">
                                <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                <li>Reduces costly rework later in the build.</li>
                                <li>Improves energy performance, helping meet code or rebate targets.</li>
                                <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                <li>Ensures proper placement of air barrier details.</li>
                                <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                              </ul>
                              <div className="flex items-center gap-1 text-sm mt-3">
                                <span>📄</span>
                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">
                                  View the Blower Door Checklist
                                </a>
                              </div>
                            </div>
                          </WarningButton>
                        </div>
                        </div>

                       <div className="space-y-2">
                        <label className="text-sm font-medium">Heating Type</label>
                        <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select heating type" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="furnace">Furnace</SelectItem>
                            <SelectItem value="boiler">Boiler</SelectItem>
                            <SelectItem value="heat-pump">Heat Pump</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-slate-800/60 to-teal-800/60 border-2 border-orange-400 rounded-lg backdrop-blur-sm">
                         <p className="text-sm text-white font-medium">
                          ⚠️ Mechanical Equipment Documentation
                        </p>
                         <p className="text-sm text-white mt-1">
                            The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">https://solinvictusenergyservices.com/cancsa-f28012</a>
                        </p>
                      </div>

                     {selections.heatingType && <div className="space-y-2">
                         <label className="text-sm font-medium">Heating Efficiency</label>
                          <Input type="text" placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.heatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                  }))} />
                            {selections.heatingEfficiency && selections.heatingType !== 'heat-pump' && (() => {
                    const inputValue = parseFloat(selections.heatingEfficiency);
                    let minValue = 0;
                    let systemType = "";
                    if (selections.heatingType === 'boiler') {
                      minValue = 90;
                      systemType = "Boiler (90 AFUE minimum)";
                    } else {
                      minValue = 95; // Furnace
                      systemType = "Furnace (95% AFUE minimum)";
                    }
                    if (!isNaN(inputValue) && inputValue < minValue) {
                      return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-sm text-destructive font-medium">
                                      ⚠️ Heating Efficiency Too Low
                                    </p>
                                    <p className="text-sm text-destructive/80 mt-1">
                                      {systemType} - Your input of {inputValue} is below the minimum requirement.
                                    </p>
                                  </div>;
                    }
                    return null;
                  })()}
                        </div>}

                      {selections.heatingType === 'boiler' && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Are you installing an indirect tank?</label>
                            <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      indirectTank: value
                    }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select if installing indirect tank" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selections.indirectTank === 'yes' && <div className="space-y-2">
                              <label className="text-sm font-medium">Indirect tank size (gallons)</label>
                              <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                      ...prev,
                      indirectTankSize: e.target.value
                    }))} />
                            </div>}
                        </div>}

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Are you installing cooling/air conditioning?</label>
                       <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select if cooling is applicable" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>


                        {/* Secondary Suite Heating - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
                        {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9365", "9367"].includes(selections.compliancePath)) && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                            <h5 className="font-medium text-white">Secondary Suite Heating System</h5>
                           
                           <div className="space-y-2">
                             <label className="text-sm font-medium">Will there be a separate heating system for the secondary suite?</label>
                             <div className="flex gap-4">
                               <label className="flex items-center gap-2">
                                 <input type="radio" name="hasSecondaryHeating" value="yes" checked={selections.hasSecondaryHeating === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHeating: e.target.value,
                          secondaryHeatingType: "",
                          // Reset when changing
                          secondaryHeatingEfficiency: "",
                          secondaryIndirectTank: "",
                          secondaryIndirectTankSize: ""
                        }))} className="w-4 h-4 text-primary" />
                                 <span className="text-sm">Yes</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="radio" name="hasSecondaryHeating" value="no" checked={selections.hasSecondaryHeating === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHeating: e.target.value,
                          secondaryHeatingType: "",
                          secondaryHeatingEfficiency: "",
                          secondaryIndirectTank: "",
                          secondaryIndirectTankSize: ""
                        }))} className="w-4 h-4 text-primary" />
                                 <span className="text-sm">No</span>
                               </label>
                             </div>
                           </div>

                           {selections.hasSecondaryHeating === "yes" && <>
                               <div className="space-y-2">
                                 <label className="text-sm font-medium">Secondary Suite Heating Type</label>
                                 <Select value={selections.secondaryHeatingType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        secondaryHeatingType: value,
                        secondaryHeatingEfficiency: "",
                        // Reset efficiency when type changes
                        secondaryIndirectTank: "",
                        secondaryIndirectTankSize: ""
                      }))}>
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select heating type" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-background border shadow-lg z-50">
                                     <SelectItem value="furnace">Furnace</SelectItem>
                                     <SelectItem value="boiler">Boiler</SelectItem>
                                     <SelectItem value="heat-pump">Heat Pump</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>

                               {selections.secondaryHeatingType && <div className="space-y-2">
                                   <label className="text-sm font-medium">Secondary Suite Heating Efficiency</label>
                                   <Input type="text" placeholder={selections.secondaryHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.secondaryHeatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.secondaryHeatingEfficiency} onChange={e => setSelections(prev => ({
                        ...prev,
                        secondaryHeatingEfficiency: e.target.value
                      }))} />
                                   {selections.secondaryHeatingEfficiency && selections.secondaryHeatingType !== 'heat-pump' && (() => {
                        const inputValue = parseFloat(selections.secondaryHeatingEfficiency);
                        let minValue = 0;
                        let systemType = "";
                        if (selections.secondaryHeatingType === 'boiler') {
                          minValue = 90;
                          systemType = "Boiler (90 AFUE minimum)";
                        } else {
                          minValue = 95; // Furnace
                          systemType = "Furnace (95% AFUE minimum)";
                        }
                        if (!isNaN(inputValue) && inputValue < minValue) {
                          return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                           <p className="text-sm text-destructive font-medium">
                                             ⚠️ Secondary Heating Efficiency Too Low
                                           </p>
                                           <p className="text-sm text-destructive/80 mt-1">
                                             {systemType} - Your input of {inputValue} is below the minimum requirement.
                                           </p>
                                         </div>;
                        }
                        return null;
                      })()}
                                 </div>}

                               {selections.secondaryHeatingType === 'boiler' && <div className="space-y-4">
                                   <div className="space-y-2">
                                     <label className="text-sm font-medium">Are you installing an indirect tank for the secondary suite?</label>
                                     <Select value={selections.secondaryIndirectTank} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          secondaryIndirectTank: value
                        }))}>
                                       <SelectTrigger>
                                         <SelectValue placeholder="Select option" />
                                       </SelectTrigger>
                                       <SelectContent className="bg-background border shadow-lg z-50">
                                         <SelectItem value="yes">Yes</SelectItem>
                                         <SelectItem value="no">No</SelectItem>
                                       </SelectContent>
                                     </Select>
                                   </div>

                                   {selections.secondaryIndirectTank === 'yes' && <div className="space-y-2">
                                        <label className="text-sm font-medium">Secondary Suite Indirect Tank Size (Gallons)</label>
                                        <Input type="text" placeholder="Enter tank size in gallons (e.g., 40, 50, 60, 80)" value={selections.secondaryIndirectTankSize} onChange={e => setSelections(prev => ({
                          ...prev,
                          secondaryIndirectTankSize: e.target.value
                        }))} />
                                      </div>}
                                 </div>}
                             </>}
                         </div>}


                       {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Service Water Heater Type</label>
                           <Select value={selections.waterHeaterType} onValueChange={value => {
                      setSelections(prev => ({
                        ...prev,
                        waterHeaterType: value,
                        waterHeater: "" // Reset efficiency when type changes
                      }));
                    }}>
                             <SelectTrigger>
                               <SelectValue placeholder="Select water heater type" />
                             </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                 <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                                 <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                                 <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                                 <SelectItem value="electric-tankless">Electric Tankless</SelectItem>
                                 <SelectItem value="electric-heat-pump">Electric Heat Pump</SelectItem>
                                 <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                           </Select>
                          </div>

                          {selections.waterHeaterType === "other" && <div className="space-y-2">
                              <label className="text-sm font-medium">Specify Other Water Heater Type</label>
                              <Input type="text" placeholder="Please specify the water heater type" value={selections.otherWaterHeaterType || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      otherWaterHeaterType: e.target.value
                    }))} />
                            </div>}

                          {selections.waterHeaterType && <div className="space-y-2">
                               <label className="text-sm font-medium">Service Water Heater Efficiency</label>
                               <Input type="text" placeholder={(() => {
                      switch (selections.waterHeaterType) {
                        case "gas-storage":
                          return "Min UEF 0.60-0.81 for Gas Storage Tank";
                        case "gas-tankless":
                          return "Min UEF 0.86 for Gas Tankless";
                        case "electric-storage":
                          return "Min UEF 0.35-0.69 for Electric Storage Tank";
                        case "electric-tankless":
                          return "Min UEF 0.86 for Electric Tankless";
                        case "electric-heat-pump":
                          return "Min UEF 2.1 for Electric Heat Pump";
                        case "other":
                          return "Enter efficiency value";
                        default:
                          return "Enter water heater efficiency";
                      }
                    })()} value={selections.waterHeater} onChange={e => setSelections(prev => ({
                      ...prev,
                      waterHeater: e.target.value
                    }))} />
                            </div>}
                          </>}

                         {/* Secondary Suite Water Heater - Show for single-detached with secondary suite AND multi-unit buildings for performance path */}
                         {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit" && ["9365", "9367"].includes(selections.compliancePath)) && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                             <h5 className="font-medium text-white">Secondary Suite Water Heating</h5>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Will there be a second hot water system for the secondary suite?</label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="hasSecondaryWaterHeater" value="yes" checked={selections.hasSecondaryWaterHeater === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryWaterHeater: e.target.value,
                          secondaryWaterHeaterSameAsMain: "",
                          // Reset when changing
                          secondaryWaterHeater: "",
                          secondaryWaterHeaterType: ""
                        }))} className="w-4 h-4 text-primary" />
                                  <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="hasSecondaryWaterHeater" value="no" checked={selections.hasSecondaryWaterHeater === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryWaterHeater: e.target.value,
                          secondaryWaterHeaterSameAsMain: "",
                          secondaryWaterHeater: "",
                          secondaryWaterHeaterType: ""
                        }))} className="w-4 h-4 text-primary" />
                                  <span className="text-sm">No</span>
                                </label>
                              </div>
                            </div>

                            {selections.hasSecondaryWaterHeater === "yes" && <>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Will it be the same as the main water heater system?</label>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="secondaryWaterHeaterSameAsMain" value="yes" checked={selections.secondaryWaterHeaterSameAsMain === "yes"} onChange={e => setSelections(prev => ({
                            ...prev,
                            secondaryWaterHeaterSameAsMain: e.target.value,
                            secondaryWaterHeater: "",
                            secondaryWaterHeaterType: ""
                          }))} className="w-4 h-4 text-primary" />
                                      <span className="text-sm">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name="secondaryWaterHeaterSameAsMain" value="no" checked={selections.secondaryWaterHeaterSameAsMain === "no"} onChange={e => setSelections(prev => ({
                            ...prev,
                            secondaryWaterHeaterSameAsMain: e.target.value
                          }))} className="w-4 h-4 text-primary" />
                                      <span className="text-sm">No</span>
                                    </label>
                                  </div>
                                </div>

                                {selections.secondaryWaterHeaterSameAsMain === "no" && <>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Secondary Suite Water Heater Type</label>
                                      <Select value={selections.secondaryWaterHeaterType} onValueChange={value => {
                          setSelections(prev => ({
                            ...prev,
                            secondaryWaterHeaterType: value,
                            secondaryWaterHeater: "" // Reset efficiency when type changes
                          }));
                        }}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select water heater type" />
                                        </SelectTrigger>
                                         <SelectContent className="bg-background border shadow-lg z-50">
                                           <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                                           <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                                           <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                                           <SelectItem value="other">Other</SelectItem>
                                         </SelectContent>
                                      </Select>
                                    </div>

                                    {selections.secondaryWaterHeaterType && <div className="space-y-2">
                                        <label className="text-sm font-medium">Secondary Suite Water Heater Efficiency</label>
                                        <Input type="text" placeholder={(() => {
                          switch (selections.secondaryWaterHeaterType) {
                            case "gas-storage":
                              return "Enter efficiency for Gas Storage Tank (UEF ≥0.60-0.81)";
                            case "gas-tankless":
                              return "Enter efficiency for Gas Tankless (UEF ≥0.86)";
                            case "electric-storage":
                              return "Enter efficiency for Electric Storage Tank (UEF ≥0.35-0.69)";
                            case "heat-pump":
                              return "Enter efficiency for Heat Pump Water Heater (EF ≥2.1)";
                            case "other":
                              return "Enter efficiency for water heater";
                            default:
                              return "Enter water heater efficiency";
                          }
                        })()} value={selections.secondaryWaterHeater} onChange={e => setSelections(prev => ({
                          ...prev,
                          secondaryWaterHeater: e.target.value
                        }))} />
                                      </div>}
                                  </>}
                              </>}
                          </div>}

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">Is a drain water heat recovery system being installed?</label>
                          <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                <Info className="h-3 w-3 mr-1" />
                                More Info
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Drain Water Heat Recovery System Information</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="border-b pb-2">
                                  <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                                </div>
                                
                                <div className="space-y-3">
                                   <p className="text-sm text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                  </p>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                       <span className="text-green-600 text-sm">✅</span>
                                       <span className="text-sm">Improves energy efficiency</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-green-600 text-sm">✅</span>
                                       <span className="text-sm">Helps earn NBC tiered compliance points</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-green-600 text-sm">✅</span>
                                       <span className="text-sm">Great for homes with frequent showers</span>
                                    </div>
                                  </div>
                                  
                                   <div className="space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Estimated cost:</strong> $800–$1,200 installed</p>
                                    <p><strong>Best fit:</strong> Homes with vertical drain stacks and electric or heat pump water heaters.</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select yes or no" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>}

                 {selections.compliancePath === "9368" && <div className="space-y-6">



                      {/* Ceiling/Attic Insulation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Effective RSI - Ceilings below Attics</label>
                        <Input type="number" step="0.01" min="0" placeholder={selections.compliancePath === "9368" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "with_hrv" ? "Min RSI 8.67 (R-49.2) with HRV" : selections.hasHrv === "without_hrv" ? "Min RSI 10.43 (R-59.2) without HRV" : "Min RSI 8.67 (R-49.2) with HRV, 10.43 (R-59.2) without HRV"} value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                  }))} />
                          {(() => {
                    // Skip R-value validation for 9368 path - allow any input
                    if (selections.compliancePath === "9368") {
                      return null;
                    }
                    console.log("Ceilings validation debug:", {
                      ceilingsAtticRSI: selections.ceilingsAtticRSI,
                      hasHrv: selections.hasHrv,
                      parsedValue: parseFloat(selections.ceilingsAtticRSI || "0"),
                      minRSI: selections.hasHrv === "with_hrv" ? 8.67 : 10.43
                    });
                    const minRSI = selections.hasHrv === "with_hrv" ? 8.67 : 10.43;
                    const validation = validateRSI(selections.ceilingsAtticRSI, minRSI, `ceilings below attics ${selections.hasHrv === "with_hrv" ? "with HRV" : "without HRV"}`);
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId={`ceilingsAtticRSI-${validation.warning.type}`} title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                    <p className="text-sm text-white">
                                    {validation.warning.message}
                                   </p>
                                </WarningButton>;
                    }
                    return null;
                  })()}
                         <WarningButton warningId="ceilingsAtticRSI-9368" title="Effective RSI/R-Value Required">
                            <p className="text-sm text-white">
                              You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                           </p>
                         </WarningButton>
                       </div>

                       {/* Wall Insulation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Above Grade Walls - RSI Value</label>
                        <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    wallRSI: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select wall insulation level (e.g., R20 Batt/2x6/16&quot;OC)" />
                          </SelectTrigger>
                           <SelectContent className="max-h-[300px] overflow-y-auto">
                             {wallRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                 {option.label} ({option.points} points)
                               </SelectItem>)}
                           </SelectContent>
                        </Select>
                        <WarningButton warningId="wallRSI-9368" title="Effective RSI/R-Value Required">
                           <p className="text-sm text-white">
                             You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>

                      {/* Below Grade Walls */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Below Grade Walls - RSI Value</label>
                        <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select below grade insulation (e.g., R12 Batt/2x4/24&quot;OC)" />
                          </SelectTrigger>
                          <SelectContent>
                            {belowGradeRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)  
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <WarningButton warningId="belowGradeRSI-9368" title="Effective RSI/R-Value Required">
                           <p className="text-sm text-white">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>

                      {/* Windows */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Windows - U-Value</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                More Info
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-lg">Energy Efficiency Points for Windows & Doors</h4>
                                
                                 <p className="text-sm text-white">
                                  You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                </p>
                                
                                 <p className="text-sm text-white">
                                  But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                </p>
                                
                                 <ul className="list-disc ml-5 space-y-1 text-sm text-white">
                                  <li>The wall is 48 m²</li>
                                  <li>The total area of the windows and doors is 7.75 m²</li>
                                  <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                </ul>
                                
                                 <p className="text-sm text-white">
                                  If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                </p>
                                
                                <div className="border-t pt-4">
                                  <h5 className="font-medium mb-2">Why this matters:</h5>
                                   <ul className="list-disc ml-5 space-y-1 text-sm text-white">
                                    <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                    <li>U-value only looks at insulation, not sun or air leaks.</li>
                                    <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                  </ul>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                  <p className="text-xs text-muted-foreground mt-2 italic">
                                    Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                  </p>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Select value={selections.windowUValue} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    windowUValue: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select window performance" />
                          </SelectTrigger>
                          <SelectContent>
                            {windowUValueOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.points} points)
                              </SelectItem>)}
                           </SelectContent>
                         </Select>
                         
                         <WarningButton warningId="windowDoor-verification-9368-main" title="Window & Door Performance Verification">
                            <p className="text-xs text-white">
                             Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please only record the lowest performing window and door (U-Value (ie, highest U-value W/(m²×K)).
                           </p>
                         </WarningButton>
                        {selections.windowUValue && <>
                            
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Energy Efficiency Points for Windows & Doors</label>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                      <Info className="h-3 w-3 mr-1" />
                                      More Info
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Energy Efficiency Points for Windows & Doors</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-sm text-foreground/80">
                                        You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                      </p>
                                      
                                      <p className="text-sm text-foreground/80">
                                        But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                      </p>
                                      
                                      <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                        <li>The wall is 48 m²</li>
                                        <li>The total area of the windows and doors is 7.75 m²</li>
                                        <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                      </ul>
                                      
                                      <p className="text-sm text-foreground/80">
                                        If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                      </p>
                                      
                                      <div className="border-t pt-4">
                                        <h5 className="font-medium mb-2">Why this matters:</h5>
                                        <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                          <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                          <li>U-value only looks at insulation, not sun or air leaks.</li>
                                          <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                        </ul>
                                      </div>
                                      
                                      <div className="border-t pt-4">
                                        <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                        <p className="text-xs text-muted-foreground mt-2 italic">
                                          Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                           </>}
                      </div>

                      {/* Airtightness */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">Airtightness Level</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                More Info
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                               <div className="space-y-4">
                                 <div>
                                   <h4 className="font-semibold text-sm mb-2">What's a Blower Door Test?</h4>
                                   <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div className="space-y-4">
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                         <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                         <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                         <p className="ml-4">Total leak area per square metre of envelope.</p>
                                         <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                         <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                         <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                       </div>
                                       <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• A full detached house</p>
                                       <p>• A single unit in a row house or duplex</p>
                                       <p>• A section of a large home or multi-unit building</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                     <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Small homes have more corners and connections relative to their size.</p>
                                       <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                       <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">Unguarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                           <p>• Includes leakage between units.</p>
                                           <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                         </div>
                                       </div>
                                       <div>
                                         <p className="font-medium">Guarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• All adjacent units are depressurized at the same time.</p>
                                           <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                           <p>• Ideal for multi-unit buildings, but more complex.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                       <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                       <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                       <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                     </div>
                                   </div>
                                 </div>

                                 <div className="space-y-2">
                                   <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                     <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                     <div className="space-y-1">
                                       <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         View the Blower Door Checklist
                                       </a>
                                       <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         More airtightness information
                                       </a>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                       <Select value={selections.airtightness} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    airtightness: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select airtightness level" />
                         </SelectTrigger>
                           <SelectContent>
                             {getFilteredAirtightnessOptions().map(option => <SelectItem key={option.value} value={option.value}>
                                 {option.label} ({option.points} points)
                               </SelectItem>)}
                            </SelectContent>
                        </Select>
                        
                        <WarningButton warningId="airtightness-caution-9368" title="Caution: Air-Tightness Targets Without Testing History">
                           <div className="text-xs text-white space-y-2">
                            <p>
                              Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                            </p>
                            <p>
                              We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                            </p>
                            <p>
                              If your final blower door test doesn't meet the target you've claimed, you could:
                            </p>
                            <ul className="list-disc ml-4 space-y-1">
                              <li>Miss required performance metrics</li>
                              <li>Be denied a permit or occupancy</li>
                              <li>Face expensive late-stage upgrades or rework</li>
                            </ul>
                            <p>
                              <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                            </p>
                            <div className="flex items-center gap-1 text-sm mt-3">
                              <span>🔗</span>
                              <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                More information
                              </a>
                            </div>
                          </div>
                         </WarningButton>
                         
                         {/* Multi-Unit Exercise */}
                         <div className="space-y-3 pt-4 border-t border-border/20">
                           <Popover>
                             <PopoverTrigger asChild>
                               <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-emerald-50/80 border-emerald-300/50 hover:bg-emerald-100/80 hover:border-emerald-400/60 backdrop-blur-sm">
                                 Learn more about points allocation for air-townhouse for MURB/Row/Town-homes
                               </Button>
                             </PopoverTrigger>
                              <PopoverContent className="w-[700px] max-h-[80vh] overflow-y-auto p-4" align="center">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Understanding Airtightness Levels & Points: 4-Unit Row House Scenario</h4>
                                    <p className="text-sm text-muted-foreground">We're showing how a builder can earn energy efficiency points by improving airtightness—that is, how well a building keeps outside air from leaking in (or inside air from leaking out).</p>
                                    <p className="text-sm text-muted-foreground mt-2">Even though we're mainly focusing on single detached homes today, we're using a 4-unit row house in this example to show how things can get a bit more complex in real-world multi-unit builds.</p>
                                  </div>
                                  
                                  {/* Diagram */}
                                  <div className="bg-muted/30 p-3 rounded-md">
                                    <img src="/lovable-uploads/9fef7011-6de1-412c-9331-2c6f86f64d18.png" alt="Figure 9.36.-18: Example of attached zones" className="w-full max-w-md mx-auto" />
                                    <p className="text-xs text-muted-foreground text-center mt-2">Figure 9.36.-18: Example of attached zones</p>
                                    <p className="text-xs text-muted-foreground text-center mt-1 italic">Source: Housing and Small Buildings Illustrated User's Guide - National Building Code of Canada 2020 Part 9 of Division B</p>
                                  </div>
                                  
                                  
                                  {/* Test Results Table */}
                                  <div>
                                    <h5 className="font-medium text-sm mb-3">Test Results for an Example 4 Unit Row House in Climate Zone 7A (Unguarded)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="w-full border-collapse border border-border text-sm">
                                        <thead>
                                          <tr className="bg-muted/50">
                                            <th className="border border-border p-2 text-left font-medium">Metric</th>
                                            <th className="border border-border p-2 text-center font-medium">Left End House</th>
                                            <th className="border border-border p-2 text-center font-medium">Left Middle House</th>
                                            <th className="border border-border p-2 text-center font-medium">Right Middle House</th>
                                            <th className="border border-border p-2 text-center font-medium">Right End House</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className="border border-border p-2 font-medium bg-muted/30">ACH</td>
                                            <td className="border border-border p-2 text-center">1.49</td>
                                            <td className="border border-border p-2 text-center">2.01</td>
                                            <td className="border border-border p-2 text-center">1.95</td>
                                            <td className="border border-border p-2 text-center">1.51</td>
                                          </tr>
                                          <tr>
                                            <td className="border border-border p-2 font-medium bg-muted/30">NLA</td>
                                            <td className="border border-border p-2 text-center">0.97</td>
                                            <td className="border border-border p-2 text-center">1.29</td>
                                            <td className="border border-border p-2 text-center">1.24</td>
                                            <td className="border border-border p-2 text-center">0.95</td>
                                          </tr>
                                          <tr>
                                            <td className="border border-border p-2 font-medium bg-muted/30">NRL</td>
                                            <td className="border border-border p-2 text-center">0.57</td>
                                            <td className="border border-border p-2 text-center">0.75</td>
                                            <td className="border border-border p-2 text-center">0.79</td>
                                            <td className="border border-border p-2 text-center">0.6</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  
                                  <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">Key Rules to Know:</h5>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                     <p>• Builders can skip the prescriptive air barrier checklist (NBC 9.36.2.10) if they do a blower door test and meet certain airtightness levels.</p>
                                     <p>• In multi-unit buildings, each unit is tested individually, but the worst score of all the units is what counts for code and points.</p>
                                     <p>• To earn points, the results must at least meet AL-1B (if unguarded testing is used).</p>
                                   </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">This Example:</h5>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                     <p>• <strong>Project:</strong> 4-unit row house in Prince Albert (Zone 7A)</p>
                                     <p>• <strong>Goal:</strong> Reach Tier 2 compliance, which needs 10 total points</p>
                                     <p>• <strong>Already earned:</strong> 6.7 points from well-insulated above-grade walls</p>
                                     <p>• <strong>Need:</strong> 3.3 more points — aiming to get them from airtightness</p>
                                     <p>• <strong>Test type used:</strong> Unguarded, because units will be occupied at different times</p>
                                   </div>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">Test Results (Worst Values):</h5>
                                   <div className="overflow-x-auto">
                                     <table className="w-full text-xs border-collapse border border-border">
                                       <thead>
                                         <tr className="bg-muted/50">
                                           <th className="border border-border p-2 text-left font-medium">Metric</th>
                                           <th className="border border-border p-2 text-left font-medium">Worst Unit Result</th>
                                           <th className="border border-border p-2 text-left font-medium">AL- Target (From NBC Table 9.36.-B)</th>
                                           <th className="border border-border p-2 text-left font-medium">Airtightness Level Met</th>
                                         </tr>
                                       </thead>
                                       <tbody>
                                         <tr>
                                           <td className="border border-border p-2 font-medium">ACH</td>
                                           <td className="border border-border p-2">2.01 (Left Middle)</td>
                                           <td className="border border-border p-2">AL-3B = 2.0 max</td>
                                           <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                         </tr>
                                         <tr className="bg-muted/20">
                                           <td className="border border-border p-2 font-medium">NLA</td>
                                           <td className="border border-border p-2">1.29 (Left Middle)</td>
                                           <td className="border border-border p-2">AL-3B = 1.28 max</td>
                                           <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                         </tr>
                                         <tr>
                                           <td className="border border-border p-2 font-medium">NRL</td>
                                           <td className="border border-border p-2">0.79 (Right Middle)</td>
                                           <td className="border border-border p-2">AL-3B = 0.78 max</td>
                                           <td className="border border-border p-2 text-destructive font-medium">Fails AL-3B → drops to AL-2B</td>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </div>
                                   <p className="text-xs text-muted-foreground mt-2 italic">Even though the differences are tiny, the worst score in each category is just above the AL-3B thresholds, so the builder can only claim AL-2B.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div>
                                   <h5 className="font-medium text-sm mb-2">Outcome:</h5>
                                   <div className="text-sm text-muted-foreground ml-4 space-y-2">
                                     <p>• Builder cannot claim points for AL-3B or higher.</p>
                                     <p>• Based on AL-2B, they'd earn fewer points (you'd refer to your compliance table for exact value, but likely not enough to hit 10 points total).</p>
                                     <p>• So if the builder wants to stay on track for Tier 2, they need to:</p>
                                      <div className="ml-4 space-y-1">
                                        <p>• Tighten up the leakiest unit(s) (especially Left Middle and Right Middle)</p>
                                        <p>• To stay on track for Tier 2, they could invest in Aerobarrier (air-sealing system) as well</p>
                                        <p>• Or look for other upgrades (e.g. better windows, mechanical systems) to make up the missing points</p>
                                      </div>
                                   </div>
                                 </div>
                                 
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-xs font-medium text-blue-800">💡 Key Takeaways:</p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                      <p>• In multi-unit buildings, one poorly-performing unit can impact the entire project's compliance. This is why consistent construction quality and testing across all units is critical for achieving energy efficiency targets.</p>
                                      <p>• Having some air-tightness results from previous projects to apply and guide decision-making for this particular project would reduce risk and ensure that costly changes don't have to happen if the air-leakage targets aren't met.</p>
                                      <p>• Alternatively, performance energy modelling would have likely also met the performance requirements with a lower overall build cost and less risk if they had started down that path to begin with.</p>
                                    </div>
                                  </div>
                               </div>
                             </PopoverContent>
                           </Popover>
                         </div>
                         
                        {/* Mid-Construction Blower Door Test Checkbox */}
                        <div className="space-y-3 pt-4 border-t border-border/20">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="midConstructionBlowerDoor-9368" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                        ...prev,
                        midConstructionBlowerDoorPlanned: e.target.checked
                      }))} className="w-4 h-4 text-primary mt-1" />
                            <div className="flex-1">
                              <label htmlFor="midConstructionBlowerDoor-9368" className="text-sm font-medium cursor-pointer">
                                Mid-Construction Blower Door Test Planned
                              </label>
                            </div>
                          </div>
                          
                          <WarningButton warningId="mid-construction-blower-door-info-9368" title="Benefits of Mid-Construction Blower Door Testing">
                             <div className="text-xs text-white space-y-2">
                              <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                              <ul className="list-disc ml-4 space-y-1">
                                <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                <li>Reduces costly rework later in the build.</li>
                                <li>Improves energy performance, helping meet code or rebate targets.</li>
                                <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                <li>Ensures proper placement of air barrier details.</li>
                                <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                              </ul>
                              <div className="flex items-center gap-1 text-sm mt-3">
                                <span>📄</span>
                                <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                  View the Blower Door Checklist
                                </a>
                              </div>
                            </div>
                          </WarningButton>
                        </div>
                      </div>

                     {/* HRV/ERV Section for 9368 - Mandatory */}
                     <div className="space-y-3">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">HRV/ERV System (Required for 9.36.8)</label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                               More Info
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-96 p-4" side="right" align="start">
                             <div className="space-y-4">
                               <div>
                                 <h4 className="font-semibold text-sm mb-2">HRV/ERV Required for 9.36.8 Path</h4>
                                 <p className="text-xs text-muted-foreground">
                                   An HRV or ERV is mandatory for the 9.36.8 Tiered Prescriptive Path. This system brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts.
                                 </p>
                               </div>
                               
                               <div>
                                 <h5 className="font-medium text-sm mb-1">Benefits of HRV/ERV systems:</h5>
                                 <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                   <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                   <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                   <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                   <li><strong>Code compliance:</strong> Required for this pathway and enables more flexible building envelope options.</li>
                                 </ul>
                               </div>

                               <div>
                                 <h5 className="font-medium text-sm mb-1">HRV vs. ERV:</h5>
                                 <div className="text-xs text-muted-foreground space-y-1">
                                   <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                   <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                 </div>
                               </div>
                             </div>
                           </PopoverContent>
                         </Popover>
                       </div>
                       
                       {/* Auto-set HRV to required for 9368 and show notification */}
                        <div className="p-3 bg-emerald-50/80 border border-emerald-300/50 rounded-md backdrop-blur-sm">
                          <p className="text-sm text-emerald-900">
                           ✓ HRV/ERV system is required and automatically included for the 9.36.8 Tiered Prescriptive Path.
                         </p>
                       </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">HRV/ERV Efficiency</label>
                          <Select value={selections.hrvEfficiency || ""} onValueChange={value => {
                            setSelections(prev => ({
                              ...prev,
                              hasHrv: "with_hrv", // Auto-set to with_hrv for 9368
                              hrvEfficiency: value
                            }));
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select HRV/ERV efficiency range" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              {hrvOptions.slice(1).map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label} ({option.points} points)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                     </div>

                      {/* Service Water Heater */}
                      {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <div className="space-y-2">
                          <label className="text-sm font-medium">Service Water Heater</label>
                          <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    waterHeater: value
                  }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select water heater type" />
                            </SelectTrigger>
                            <SelectContent>
                              {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                  {option.label} ({option.points} points)
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          </div>}

                        {/* MURB Multiple Heating Systems - Only show for Multi-Unit buildings */}
                        {selections.buildingType === "multi-unit" && <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <h5 className="font-medium text-green-800">Multi-Unit Building Heating Systems</h5>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Will there be multiple heating systems in this building?</label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="hasMurbMultipleHeating" value="yes" checked={selections.hasMurbMultipleHeating === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasMurbMultipleHeating: e.target.value,
                          murbSecondHeatingType: "",
                          // Reset when changing
                          murbSecondHeatingEfficiency: "",
                          murbSecondIndirectTank: "",
                          murbSecondIndirectTankSize: ""
                        }))} className="w-4 h-4 text-primary" />
                                  <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="hasMurbMultipleHeating" value="no" checked={selections.hasMurbMultipleHeating === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasMurbMultipleHeating: e.target.value,
                          murbSecondHeatingType: "",
                          murbSecondHeatingEfficiency: "",
                          murbSecondIndirectTank: "",
                          murbSecondIndirectTankSize: ""
                        }))} className="w-4 h-4 text-primary" />
                                  <span className="text-sm">No</span>
                                </label>
                              </div>
                            </div>

                            {selections.hasMurbMultipleHeating === "yes" && <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Second Heating System Type</label>
                                  <Select value={selections.murbSecondHeatingType} onValueChange={value => setSelections(prev => ({
                        ...prev,
                        murbSecondHeatingType: value,
                        murbSecondHeatingEfficiency: "",
                        // Reset efficiency when type changes
                        murbSecondIndirectTank: "",
                        murbSecondIndirectTankSize: ""
                      }))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select heating type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                      <SelectItem value="furnace">Furnace</SelectItem>
                                      <SelectItem value="boiler">Boiler</SelectItem>
                                      <SelectItem value="heat-pump">Heat Pump</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {selections.murbSecondHeatingType && <div className="space-y-2">
                                    <label className="text-sm font-medium">Second Heating System Efficiency</label>
                                    <Input type="text" placeholder={selections.murbSecondHeatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.murbSecondHeatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.murbSecondHeatingEfficiency} onChange={e => setSelections(prev => ({
                        ...prev,
                        murbSecondHeatingEfficiency: e.target.value
                      }))} />
                                    {selections.murbSecondHeatingEfficiency && selections.murbSecondHeatingType !== 'heat-pump' && (() => {
                        const inputValue = parseFloat(selections.murbSecondHeatingEfficiency);
                        let minValue = 0;
                        let systemType = "";
                        if (selections.murbSecondHeatingType === 'boiler') {
                          minValue = 90;
                          systemType = "Boiler (90 AFUE minimum)";
                        } else {
                          minValue = 95; // Furnace
                          systemType = "Furnace (95% AFUE minimum)";
                        }
                        if (!isNaN(inputValue) && inputValue < minValue) {
                          return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                            <p className="text-sm text-destructive font-medium">
                                              ⚠️ Second Heating System Efficiency Too Low
                                            </p>
                                            <p className="text-sm text-destructive/80 mt-1">
                                              {systemType} - Your input of {inputValue} is below the minimum requirement.
                                            </p>
                                          </div>;
                        }
                        return null;
                      })()}
                                  </div>}

                                {selections.murbSecondHeatingType === 'boiler' && <div className="space-y-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Are you installing an indirect tank for the second heating system?</label>
                                      <Select value={selections.murbSecondIndirectTank} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          murbSecondIndirectTank: value
                        }))}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border shadow-lg z-50">
                                          <SelectItem value="yes">Yes</SelectItem>
                                          <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {selections.murbSecondIndirectTank === 'yes' && <div className="space-y-2">
                                        <label className="text-sm font-medium">Second System Indirect Tank Size</label>
                                        <Select value={selections.murbSecondIndirectTankSize} onValueChange={value => setSelections(prev => ({
                          ...prev,
                          murbSecondIndirectTankSize: value
                        }))}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select tank size" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-background border shadow-lg z-50">
                                            <SelectItem value="40-gal">40 Gallon</SelectItem>
                                            <SelectItem value="50-gal">50 Gallon</SelectItem>
                                            <SelectItem value="60-gal">60 Gallon</SelectItem>
                                            <SelectItem value="80-gal">80 Gallon</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>}
                                  </div>}
                              </div>}
                          </div>}

                        {/* MURB Multiple Water Heaters - Only show for Multi-Unit buildings */}
                        {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && selections.buildingType === "multi-unit" && <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                             <h5 className="font-medium text-orange-800">Multi-Unit Building Water Heating</h5>
                             
                             <div className="space-y-2">
                               <label className="text-sm font-medium">Will there be multiple hot water system types in this building?</label>
                               <div className="flex gap-4">
                                 <label className="flex items-center gap-2">
                                   <input type="radio" name="hasMurbMultipleWaterHeaters" value="yes" checked={selections.hasMurbMultipleWaterHeaters === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasMurbMultipleWaterHeaters: e.target.value,
                          murbSecondWaterHeater: "",
                          // Reset when changing
                          murbSecondWaterHeaterType: ""
                        }))} className="w-4 h-4 text-primary" />
                                   <span className="text-sm">Yes</span>
                                 </label>
                                 <label className="flex items-center gap-2">
                                   <input type="radio" name="hasMurbMultipleWaterHeaters" value="no" checked={selections.hasMurbMultipleWaterHeaters === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasMurbMultipleWaterHeaters: e.target.value,
                          murbSecondWaterHeater: "",
                          murbSecondWaterHeaterType: ""
                        }))} className="w-4 h-4 text-primary" />
                                   <span className="text-sm">No</span>
                                 </label>
                               </div>
                             </div>

                             {selections.hasMurbMultipleWaterHeaters === "yes" && <div className="space-y-4">
                                 <div className="space-y-2">
                                   <label className="text-sm font-medium">Second Water Heater Type</label>
                                   <Select value={selections.murbSecondWaterHeaterType} onValueChange={value => {
                        setSelections(prev => ({
                          ...prev,
                          murbSecondWaterHeaterType: value,
                          murbSecondWaterHeater: "" // Reset efficiency when type changes
                        }));
                      }}>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Select water heater type" />
                                     </SelectTrigger>
                                      <SelectContent className="bg-background border shadow-lg z-50">
                                        <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                                        <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                                        <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                   </Select>
                                 </div>

                                 {selections.murbSecondWaterHeaterType && <div className="space-y-2">
                                     <label className="text-sm font-medium">Second Water Heater Efficiency</label>
                                     <Input type="text" placeholder={(() => {
                        switch (selections.murbSecondWaterHeaterType) {
                          case "gas-storage":
                            return "Enter efficiency for Gas Storage Tank (UEF ≥0.60-0.81)";
                          case "gas-tankless":
                            return "Enter efficiency for Gas Tankless (UEF ≥0.86)";
                          case "electric-storage":
                            return "Enter efficiency for Electric Storage Tank (UEF ≥0.35-0.69)";
                          case "heat-pump":
                            return "Enter efficiency for Heat Pump Water Heater (EF ≥2.1)";
                          case "other":
                            return "Enter efficiency for water heater";
                          default:
                            return "Enter water heater efficiency";
                        }
                      })()} value={selections.murbSecondWaterHeater} onChange={e => setSelections(prev => ({
                        ...prev,
                        murbSecondWaterHeater: e.target.value
                      }))} />
                                   </div>}
                               </div>}
                           </div>}
                    </div>}

                {selections.hasHrv === "no_hrv" && <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ Base Prescriptive Path ({selections.province === "alberta" ? "NBC2020AE" : "NBC2020"} 9.36.2 - 9.36.4)
                    </p>
                      <p className="text-sm text-destructive/80 mt-1">
                       You are now following the base path under {selections.province === "alberta" ? "NBC2020AE" : "NBC2020"} 9.36.2 - 9.36.4
                     </p>
                  </div>}

                 {selections.hasHrv === "with_hrv" && selections.compliancePath === "9368" && <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                              More Info
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96 p-4" side="right" align="start">
                            <div className="space-y-4">
                              <div className="border-b pb-2">
                                <h4 className="font-medium text-sm">ℹ️ What is an F280 Calculation?</h4>
                              </div>
                              
                              <div className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  An F280 calculation is a heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                                </p>
                                
                                <div>
                                  <p className="text-sm font-medium mb-2">Why it's beneficial:</p>
                                  <div className="space-y-1">
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-600 text-sm">•</span>
                                      <span className="text-sm">Ensures HVAC systems are properly sized — not too big or too small.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-600 text-sm">•</span>
                                      <span className="text-sm">Improves comfort, efficiency, and equipment lifespan.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-600 text-sm">•</span>
                                      <span className="text-sm">Reduces energy costs and avoids overspending on unnecessary system capacity.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-600 text-sm">•</span>
                                      <span className="text-sm">Often required for building permits or energy code compliance in many jurisdictions.</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-md">
                                  <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                                  <p className="text-sm text-muted-foreground">
                                    F280 calcs are especially valuable in energy-efficient homes where heating loads can be dramatically lower than traditional assumptions.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Select value={selections.hasF280Calculation} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasF280Calculation: value
                  }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                          <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    


                      <div className="space-y-2">
                        <label className="text-sm font-medium">Is there any cathedral ceilings or flat roof?</label>
                        <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: ""
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                        <label className="text-sm font-medium">Cathedral / Flat Roofs</label>
                       <Input type="number" step="0.01" min="0" placeholder="Min RSI 5.02 or N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSI: e.target.value
                  }))} />
                         {(() => {
                    const minRSI = 5.02;
                    const validation = validateRSI(selections.cathedralFlatRSI, minRSI, "cathedral/flat roofs");
                    if (!validation.isValid && validation.warning) {
                      return <WarningButton warningId={`cathedralFlatRSI-${validation.warning.type}`} title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                  <p className="text-sm text-foreground/80">
                                   {validation.warning.message}
                                  </p>
                               </WarningButton>;
                    }
                    return null;
                  })()}
                        <WarningButton warningId="cathedralFlatRSI-general" title="Effective RSI/R-Value Required">
                           <p className="text-sm text-foreground/80">
                            To claim points under the NBC prescriptive path, you must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                         </WarningButton>
                      </div>}

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Above Grade Walls</label>
                      <Select value={selections.wallRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    wallRSI: value
                  }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wall RSI value (e.g., R20 Batt/2x6/16&quot;OC)" />
                        </SelectTrigger>
                         <SelectContent className="max-h-[300px] overflow-y-auto">
                           {wallRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                               <div className="flex justify-between items-center w-full">
                                 <span>{option.label}</span>
                                 <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                   {option.points} pts
                                 </Badge>
                               </div>
                             </SelectItem>)}
                          </SelectContent>
                       </Select>
                       {selections.wallRSI && <WarningButton warningId="wallRSI-info" title="Effective RSI/R-Value Required">
                            <p className="text-sm text-foreground/80">
                             To claim points under the NBC prescriptive path, you must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                           </p>
                         </WarningButton>}
                      </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Below Grade Walls (Foundation Walls)</label>
                       <Select value={selections.belowGradeRSI} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select below grade RSI value (e.g., R12 Batt/2x4/24&quot;OC)" />
                         </SelectTrigger>
                         <SelectContent>
                           {belowGradeRSIOptions.map(option => <SelectItem key={option.value} value={option.value}>
                               <div className="flex justify-between items-center w-full">
                                 <span>{option.label}</span>
                                 <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                   {option.points} pts
                                 </Badge>
                               </div>
                             </SelectItem>)}
                         </SelectContent>
                       </Select>
                       {selections.belowGradeRSI && <WarningButton warningId="belowGradeRSI-info" title="Effective RSI/R-Value Required">
                            <p className="text-xs text-foreground/80">
                              To claim points under the NBC prescriptive path, you must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                            </p>
                          </WarningButton>}
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                       <Input type="number" step="0.01" min="0" placeholder="Min. RSI 5.02 or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsUnheatedRSI: e.target.value
                  }))} />
                        {selections.floorsUnheatedRSI && parseFloat(selections.floorsUnheatedRSI) < 5.02 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive font-medium">
                              ⚠️ Effective RSI/R-Value Required
                            </p>
                             <p className="text-sm text-destructive/80 mt-1">
                              You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                            </p>
                          </div>}
                        <WarningButton warningId="cathedralFlatRSI-info" title="Effective RSI/R-Value Required">
                          <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Floors over Garage (Bonus Floor)</label>
                       <Input type="number" step="0.01" min="0" placeholder="Min RSI 4.86 or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsGarageRSI: e.target.value
                  }))} />
                        {selections.floorsGarageRSI && parseFloat(selections.floorsGarageRSI) < 4.86 && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive font-medium">
                              ⚠️ Effective RSI/R-Value Required
                            </p>
                            <p className="text-sm text-destructive/80 mt-1">
                              You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                            </p>
                          </div>}
                        <WarningButton warningId="cathedralFlatRSI-general" title="Effective RSI/R-Value Required">
                          <p className="text-xs text-foreground/80">
                            You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                          </p>
                        </WarningButton>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Does the house have a slab on grade with Integral Footing?</label>
                        <Select value={selections.hasSlabOnGrade} onValueChange={value => {
                    setSelections(prev => ({
                      ...prev,
                      hasSlabOnGrade: value,
                      slabOnGradeRSI: ""
                    }));
                  }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select yes or no" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selections.hasSlabOnGrade === "yes" && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Slab on Grade with Integral Footing</label>
                            <Input type="number" step="0.01" min="0" placeholder="Min RSI 2.84 or N/A" value={selections.slabOnGradeRSI} onChange={e => setSelections(prev => ({
                      ...prev,
                      slabOnGradeRSI: e.target.value
                    }))} />
                            {selections.slabOnGradeRSI && parseFloat(selections.slabOnGradeRSI) < 2.84 && <WarningButton warningId="slabOnGradeRSI-low" title="RSI Value Too Low" variant="destructive">
                                 <p className="text-xs text-destructive/80">
                                   The RSI value must be increased to at least 2.84 to meet NBC requirements for slab on grade with integral footing.
                                 </p>
                               </WarningButton>}
                           </div>
                         </div>}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Is the house installing or roughing in in-floor heat?</label>
                        <Select value={selections.hasInFloorHeat} onValueChange={value => {
                    setSelections(prev => ({
                      ...prev,
                      hasInFloorHeat: value,
                      unheatedFloorBelowFrostRSI: "",
                      unheatedFloorAboveFrostRSI: "",
                      heatedFloorsRSI: ""
                    }));
                  }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select yes or no" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(selections.hasInFloorHeat === "yes" || selections.floorsSlabsSelected.includes('heatedFloors')) && <>
                           <WarningButton warningId="inFloorHeating-info" title="In-Floor Heating Requirements">
                             <p className="text-xs text-foreground/80">
                               Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                             </p>
                           </WarningButton>
                           
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Heated Floors</label>
                            <Input type="number" step="0.01" min="0" placeholder={`Enter RSI value (minimum ${selections.province === "saskatchewan" ? "2.84" : "1.34"})`} value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                      ...prev,
                      heatedFloorsRSI: e.target.value
                    }))} />
                             {(() => {
                      const minRSI = selections.province === "saskatchewan" ? 2.84 : 1.34;
                      const validation = validateRSI(selections.heatedFloorsRSI, minRSI, `heated floors in ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`);
                      if (!validation.isValid && validation.warning) {
                        return <WarningButton warningId={`heatedFloorsRSI-${validation.warning.type}`} title={validation.warning.type === "rvalue-suspected" ? "R-Value Detected" : "RSI Value Too Low"} variant={validation.warning.type === "rvalue-suspected" ? "warning" : "destructive"}>
                                      <p className="text-xs text-foreground/80">
                                       {validation.warning.message}
                                      </p>
                                   </WarningButton>;
                      }
                      return null;
                    })()}
                          </div>
                        </>}

                      {selections.hasInFloorHeat === "no" && <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Unheated Floor Below Frost Line</label>
                            <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                      ...prev,
                      unheatedFloorBelowFrostRSI: e.target.value
                    }))} />
                            <div className="p-3 bg-muted border border-border rounded-md">
                              <p className="text-sm text-foreground font-medium">
                                ℹ️ Unheated Floor Below Frost Line
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                This assembly typically remains uninsulated as per NBC requirements but can be insulated to improve comfort in these areas. Enter 'uninsulated' or specify an RSI value if insulation is provided.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Unheated Floor Above Frost Line</label>
                            <Input type="number" step="0.01" min="0" placeholder="Min RSI 1.96 (R-11.1)" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                      ...prev,
                      unheatedFloorAboveFrostRSI: e.target.value
                    }))} />
                            {selections.unheatedFloorAboveFrostRSI && parseFloat(selections.unheatedFloorAboveFrostRSI) < 1.96 && <WarningButton warningId="unheatedFloorAboveFrostRSI-low" title="RSI Value Too Low" variant="destructive">
                                 <p className="text-xs text-destructive/80">
                                   The RSI value must be increased to at least 1.96 to meet NBC requirements for unheated floor above frost line.
                                 </p>
                               </WarningButton>}
                          </div>
                        </>}
                      
                         <WarningButton warningId="wallRSI-info" title="Effective RSI/R-Value Required">
                           <p className="text-xs text-foreground/80">
                             You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                           </p>
                         </WarningButton>

                    <div className="space-y-2">
                       <label className="text-sm font-medium">Window & Door U-Value (W/(m²·K))</label>
                      <Select value={selections.windowUValue} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    windowUValue: value
                  }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select window U-value" />
                        </SelectTrigger>
                        <SelectContent>
                          {windowUValueOptions.map(option => <SelectItem key={option.value} value={option.value}>
                              <div className="flex justify-between items-center w-full">
                                <span>{option.label}</span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                  {option.points} pts
                                </Badge>
                              </div>
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      {selections.windowUValue && <>
                           <WarningButton warningId="windowDoor-verification" title="Window & Door Performance Verification">
                             <p className="text-xs text-foreground/80">
                               Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please only record the lowest performing window and door (U-Value (ie, highest U-value W/(m²×K)).
                             </p>
                           </WarningButton>
                           
                             <div className="flex items-center gap-2">
                               <label className="text-sm font-medium">Energy Efficiency Points for Windows & Doors</label>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                     <Info className="h-3 w-3 mr-1" />
                                     More Info
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                   <DialogHeader>
                                     <DialogTitle>Energy Efficiency Points for Windows & Doors</DialogTitle>
                                   </DialogHeader>
                                   <div className="space-y-4">
                                     <p className="text-sm text-foreground/80">
                                       You can get extra energy efficiency points in the code if your windows and doors perform better than the minimum required by the building code (NBC 9.36). This means they either keep heat in better (low U-value) or let in helpful sunlight to reduce heating needs (high Energy Rating or ER).
                                     </p>
                                     
                                     <p className="text-sm text-foreground/80">
                                       But to use the Energy Rating (ER) method for windows or doors, the total glass/opening area on that wall must be less than 17% of the wall's area. The example in the image shows how to calculate that percentage:
                                     </p>
                                     
                                     <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                       <li>The wall is 48 m²</li>
                                       <li>The total area of the windows and doors is 7.75 m²</li>
                                       <li>7.75 ÷ 48 × 100 = 16%, so this wall qualifies for ER-based compliance.</li>
                                     </ul>
                                     
                                     <p className="text-sm text-foreground/80">
                                       If the openings are over 17%, you usually have to use U-values instead and follow a trade-off approach.
                                     </p>
                                     
                                     <div className="border-t pt-4">
                                       <h5 className="font-medium mb-2">Why this matters:</h5>
                                       <ul className="list-disc ml-5 space-y-1 text-sm text-foreground/80">
                                         <li>ER is good for cold climates – it considers how much sun a window lets in to help heat the home, along with how well it insulates and how airtight it is.</li>
                                         <li>U-value only looks at insulation, not sun or air leaks.</li>
                                         <li>Using ER lets you use things like patio doors or south-facing windows that bring in sun, even if their U-value isn't great—as long as they don't make up too much of the wall.</li>
                                       </ul>
                                     </div>
                                     
                                     <div className="border-t pt-4">
                                       <img src="/lovable-uploads/7665f3ac-355b-4715-9121-ae5d822bc1f0.png" alt="Figure 9.36-20: Example of how to calculate the percent fenestration area" className="w-full h-auto border rounded" />
                                       <p className="text-xs text-muted-foreground mt-2 italic">
                                         Source: Housing and Small Buildings Illustrated User's Guide National Building Code of Canada 2020
                                       </p>
                                     </div>
                                   </div>
                                 </DialogContent>
                               </Dialog>
                             </div>
                           </>}
                       
                       <div className="p-3 bg-muted border border-border rounded-md">
                         <p className="text-sm text-foreground font-medium">
                           ℹ️ One Door Exception
                         </p>
                         <p className="text-xs text-muted-foreground mt-1">
                           Note: There is a "One door exception" that may apply to your project. Please consult the NBC requirements for specific details on this exception.
                         </p>
                       </div>
                      </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Does the house have skylights?</label>
                       <Select value={selections.hasSkylights} onValueChange={value => {
                    setSelections(prev => ({
                      ...prev,
                      hasSkylights: value,
                      skylightUValue: ""
                    }));
                  }}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select if house has skylights" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     {selections.hasSkylights === "yes" && <div className="space-y-2">
                         <label className="text-sm font-medium">Skylight U-Value</label>
                         <Input type="number" step="0.01" min="0" placeholder={`Enter U-value (maximum ${selections.province === "alberta" && selections.climateZone === "7B" ? "2.41" : "2.75"} W/(m²·K))`} value={selections.skylightUValue} onChange={e => setSelections(prev => ({
                    ...prev,
                    skylightUValue: e.target.value
                  }))} />
                          {(() => {
                    const maxUValue = selections.province === "alberta" && selections.climateZone === "7B" ? 2.41 : 2.75;
                    return selections.skylightUValue && parseFloat(selections.skylightUValue) > maxUValue && <WarningButton warningId="skylightUValue-high" title="U-Value Too High" variant="destructive">
                                <p className="text-xs text-destructive/80">
                                  The U-value must be reduced to {maxUValue} or lower to meet NBC requirements for skylights in your climate zone.
                                </p>
                              </WarningButton>;
                  })()}
                        </div>}
                      
                       {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9367" title="Important: Skylight Shaft Insulation">
                           <p className="text-xs text-foreground/80">
                             Skylight shafts must be insulated. Be prepared to provide further details upon request.
                           </p>
                         </WarningButton>}

                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">Airtightness Level (Unguarded Testing)</label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                               More Info
                             </Button>
                           </PopoverTrigger>
                            <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                               <div className="space-y-4">
                                 <div>
                                   <h4 className="font-semibold text-sm mb-2">What's a Blower Door Test?</h4>
                                   <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div className="space-y-4">
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                         <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                         <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                         <p className="ml-4">Total leak area per square metre of envelope.</p>
                                         <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                         <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                         <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                       </div>
                                       <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• A full detached house</p>
                                       <p>• A single unit in a row house or duplex</p>
                                       <p>• A section of a large home or multi-unit building</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                     <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Small homes have more corners and connections relative to their size.</p>
                                       <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                       <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">Unguarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                           <p>• Includes leakage between units.</p>
                                           <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                         </div>
                                       </div>
                                       <div>
                                         <p className="font-medium">Guarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• All adjacent units are depressurized at the same time.</p>
                                           <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                           <p>• Ideal for multi-unit buildings, but more complex.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                       <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                       <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                       <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                     </div>
                                   </div>
                                 </div>

                                 <div className="space-y-2">
                                   <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                     <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                     <div className="space-y-1">
                                       <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         View the Blower Door Checklist
                                       </a>
                                       <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         More airtightness information
                                       </a>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                           </PopoverContent>
                         </Popover>
                       </div>
                      <Select value={selections.airtightness} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    airtightness: value
                  }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select air-tightness level" />
                        </SelectTrigger>
                        <SelectContent>
                          {airtightnessOptions.map(option => <SelectItem key={option.value} value={option.value}>
                              <div className="flex justify-between items-center w-full">
                                 <span>
                                   {option.label.includes('ACH₅₀:') ? <>
                                       {option.label.split('ACH₅₀:')[0]}
                                       <strong>ACH₅₀: </strong>
                                       <strong className="text-primary">
                                         {option.label.split('ACH₅₀:')[1].split(',')[0]}
                                       </strong>
                                       {option.label.split('ACH₅₀:')[1].substring(option.label.split('ACH₅₀:')[1].split(',')[0].length)}
                                     </> : option.label}
                                 </span>
                                <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                  {option.points} pts
                                </Badge>
                              </div>
                            </SelectItem>)}
                         </SelectContent>
                        </Select>
                        
                         <WarningButton warningId="airtightness-caution" title="Caution: Choosing Airtightness Points Without Experience">
                           <div className="text-xs text-foreground space-y-2">
                             <p>
                               Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                             </p>
                             <p>
                               We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                             </p>
                             <p>
                               If your final blower door test doesn't meet the target you've claimed, you could:
                             </p>
                             <ul className="list-disc ml-4 space-y-1">
                               <li>Miss required performance metrics</li>
                               <li>Be denied a permit or occupancy</li>
                               <li>Face expensive late-stage upgrades or rework</li>
                             </ul>
                             <p>
                               If you're unsure of your airtightness performance, consider using performance modelling instead — it offers more flexibility and reduces the risk of non-compliance.
                             </p>
                             <div className="flex items-center gap-1 text-sm mt-3">
                               <span>🔗</span>
                               <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                 More information
                               </a>
                             </div>
                            </div>
                          </WarningButton>
                          
                          {/* Mid-Construction Blower Door Test Checkbox */}
                          <div className="space-y-3 pt-4 border-t border-border/20">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" id="midConstructionBlowerDoor-9367" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                        ...prev,
                        midConstructionBlowerDoorPlanned: e.target.checked
                      }))} className="w-4 h-4 text-primary mt-1" />
                              <div className="flex-1">
                                <label htmlFor="midConstructionBlowerDoor-9367" className="text-sm font-medium cursor-pointer">
                                  Mid-Construction Blower Door Test Planned
                                </label>
                              </div>
                            </div>
                            
                            <WarningButton warningId="mid-construction-blower-door-info-9367" title="Benefits of Mid-Construction Blower Door Testing">
                               <div className="text-xs text-white space-y-2">
                                <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                  <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                  <li>Reduces costly rework later in the build.</li>
                                  <li>Improves energy performance, helping meet code or rebate targets.</li>
                                  <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                  <li>Ensures proper placement of air barrier details.</li>
                                  <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                                </ul>
                                <div className="flex items-center gap-1 text-sm mt-3">
                                  <span>📄</span>
                                  <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    View the Blower Door Checklist
                                  </a>
                                </div>
                              </div>
                            </WarningButton>
                          </div>
                       </div>


                        <div className="space-y-2">
                         <label className="text-sm font-medium">Heating Type</label>
                        <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select heating type" />
                          </SelectTrigger>
                           <SelectContent className="bg-background border shadow-lg z-50">
                             <SelectItem value="furnace">Furnace</SelectItem>
                             <SelectItem value="boiler">Boiler</SelectItem>
                             <SelectItem value="heat-pump">Heat Pump</SelectItem>
                             <SelectItem value="other">Other</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 bg-muted border border-border rounded-md">
                         <p className="text-sm font-medium text-slate-950">
                          ⚠️ Mechanical Equipment Documentation
                        </p>
                        <p className="text-xs mt-1 text-slate-950">
                          The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations. More info at: <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">https://solinvictusenergyservices.com/cancsa-f28012</a>
                        </p>
                      </div>

                     {selections.heatingType && selections.compliancePath as string === '9367' && <div className="space-y-2">
                          <label className="text-sm font-medium">Heating System Make/Model</label>
                          <Input type="text" placeholder="Input heating system make/model (e.g. Carrier 59TP6)" value={selections.heatingMakeModel || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingMakeModel: e.target.value
                  }))} />
                        </div>}

                     {selections.heatingType && selections.compliancePath as string !== '9367' && <div className="space-y-2">
                         <label className="text-sm font-medium">Heating Efficiency</label>
                          <Input type="text" placeholder={selections.heatingType === 'boiler' ? "Enter heating efficiency (e.g. 90 AFUE)" : selections.heatingType === 'heat-pump' ? "Enter heating efficiency (e.g. 18 SEER, 3.5 COP, 4.5 COP for cooling)" : "Enter heating efficiency (e.g. 95% AFUE)"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                  }))} />
                             {selections.heatingEfficiency && selections.heatingType !== 'heat-pump' && (() => {
                    console.log('Heating efficiency validation - type:', selections.heatingType, 'efficiency:', selections.heatingEfficiency);
                    const inputValue = parseFloat(selections.heatingEfficiency);
                    let minValue = 0;
                    let systemType = "";
                    if (selections.heatingType === 'boiler') {
                      minValue = 90;
                      systemType = "Boiler (90 AFUE minimum)";
                    } else {
                      minValue = 95; // Furnace
                      systemType = "Furnace (95% AFUE minimum)";
                    }
                    if (!isNaN(inputValue) && inputValue < minValue) {
                      return <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                     <p className="text-sm text-destructive font-medium">
                                       ⚠️ Heating Efficiency Too Low
                                     </p>
                                     <p className="text-sm text-destructive/80 mt-1">
                                       {systemType} - Your input of {inputValue} is below the minimum requirement.
                                     </p>
                                   </div>;
                    }
                    return null;
                  })()}
                         </div>}

                      {selections.heatingType === 'boiler' && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Are you installing an indirect tank?</label>
                            <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      indirectTank: value
                    }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select if installing indirect tank" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selections.indirectTank === 'yes' && <div className="space-y-2">
                              <label className="text-sm font-medium">Indirect tank size (gallons)</label>
                              <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                      ...prev,
                      indirectTankSize: e.target.value
                    }))} />
                            </div>}
                        </div>}

                      <div className="space-y-2">
                       <label className="text-sm font-medium">Are you installing cooling/air conditioning?</label>
                       <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select if cooling is applicable" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>


                         {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Service Water Heater Type</label>
                              <Select value={selections.waterHeater} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      waterHeater: value
                    }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service water heater type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {waterHeaterOptions.map(option => <SelectItem key={option.value} value={option.value}>
                                      <div className="flex justify-between items-center w-full">
                                        <span>{option.label}</span>
                                        <Badge variant={option.points > 0 ? "default" : "secondary"}>
                                          {option.points} pts
                                        </Badge>
                                      </div>
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                             
                              {selections.waterHeater && selections.compliancePath as string === '9367' && <div className="space-y-2">
                                  <label className="text-sm font-medium">Water Heating Make/Model</label>
                                  <Input type="text" placeholder="Input water heating make/model (e.g. Rheem Pro Prestige)" value={selections.waterHeaterMakeModel || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      waterHeaterMakeModel: e.target.value
                    }))} />
                                </div>}

                              {selections.waterHeater && selections.compliancePath as string !== '9367' && <div className="space-y-2">
                                  <label className="text-sm font-medium">Service Water Heater</label>
                                  <Input type="text" placeholder="Enter water heater efficiency, (e.g. .69 UEF)" value={selections.waterHeaterType} onChange={e => {
                      console.log('Water heater efficiency updated:', e.target.value);
                      setSelections(prev => ({
                        ...prev,
                        waterHeaterType: e.target.value
                      }));
                    }} />
                                </div>}
                          </>}

                      <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">Is a drain water heat recovery system being installed?</label>
                         <Dialog>
                           <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                               <Info className="h-3 w-3 mr-1" />
                               More Info
                             </Button>
                           </DialogTrigger>
                           <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                             <DialogHeader>
                               <DialogTitle>Drain Water Heat Recovery System Information</DialogTitle>
                             </DialogHeader>
                             <div className="space-y-4">
                               <div className="border-b pb-2">
                                 <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                               </div>
                               
                               <div className="space-y-3">
                                 <p className="text-xs text-muted-foreground">
                                   DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                 </p>
                                 
                                 <div className="space-y-2">
                                   <div className="flex items-center gap-2">
                                     <span className="text-green-600 text-xs">✅</span>
                                     <span className="text-xs">Improves energy efficiency</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                     <span className="text-green-600 text-xs">✅</span>
                                     <span className="text-xs">Helps earn NBC tiered compliance points</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                     <span className="text-green-600 text-xs">✅</span>
                                     <span className="text-xs">Great for homes with frequent showers</span>
                                   </div>
                                 </div>
                                 
                                 <div className="space-y-1 text-xs text-muted-foreground">
                                   <p><strong>Estimated cost:</strong> $800–$1,200 installed</p>
                                   <p><strong>Best fit:</strong> Homes with vertical drain stacks and electric or heat pump water heaters.</p>
                                 </div>
                               </div>
                             </div>
                            </DialogContent>
                          </Dialog>
                       </div>
                       <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select yes or no" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                    </>}

                   {selections.compliancePath === "9365" && <>
                       {selections.buildingAddress && selections.buildingAddress.toLowerCase().includes("red deer") && selections.province === "alberta" && <div className="space-y-2">
                           <div className="flex items-center gap-3">
                             <label className="text-sm font-medium">Have you completed the required CSA-F280 Calculation for heating and cooling loads?</label>
                             <Popover>
                               <PopoverTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                    More Info
                                  </Button>
                               </PopoverTrigger>
                               <PopoverContent className="w-96 p-4" side="right" align="start">
                                 <div className="space-y-4">
                                   <div className="border-b pb-2">
                                     <h4 className="font-medium text-sm">ℹ️ What is an F280 Calculation?</h4>
                                   </div>
                                   
                                   <div className="space-y-3">
                                     <p className="text-sm text-muted-foreground">
                                       An F280 calculation is a heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                                     </p>
                                     
                                     <div>
                                       <p className="text-sm font-medium mb-2">Why it's beneficial:</p>
                                       <div className="space-y-1">
                                         <div className="flex items-start gap-2">
                                           <span className="text-green-600 text-sm">•</span>
                                           <span className="text-sm">Ensures HVAC systems are properly sized — not too big or too small.</span>
                                         </div>
                                         <div className="flex items-start gap-2">
                                           <span className="text-green-600 text-sm">•</span>
                                           <span className="text-sm">Improves comfort, efficiency, and equipment lifespan.</span>
                                         </div>
                                         <div className="flex items-start gap-2">
                                           <span className="text-green-600 text-sm">•</span>
                                           <span className="text-sm">Reduces energy costs and avoids overspending on unnecessary system capacity.</span>
                                         </div>
                                         <div className="flex items-start gap-2">
                                           <span className="text-green-600 text-sm">•</span>
                                           <span className="text-sm">Often required for building permits or energy code compliance in many jurisdictions.</span>
                                         </div>
                                       </div>
                                     </div>
                                     
                                     <div className="p-3 bg-muted rounded-md">
                                       <p className="text-sm font-medium mb-1">💡 Pro Tip:</p>
                                       <p className="text-sm text-muted-foreground">
                                         F280 calcs are especially valuable in energy-efficient homes where heating loads can be dramatically lower than traditional assumptions.
                                       </p>
                                     </div>
                                   </div>
                                 </div>
                               </PopoverContent>
                             </Popover>
                           </div>
                           <Select value={selections.hasF280Calculation} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasF280Calculation: value
                  }))}>
                             <SelectTrigger>
                               <SelectValue placeholder="Select option" />
                             </SelectTrigger>
                             <SelectContent className="bg-background border shadow-lg z-50">
                               <SelectItem value="completed">✓ Yes, I have completed the F280 calculation</SelectItem>
                               <SelectItem value="request-quote">Request a quote for F280 calculation</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>}
                       
                       <div className="space-y-2">
                         <label className="text-sm font-medium">Ceilings below Attics</label>
                         <Input type="text" placeholder="e.g., R50 Loose-fill" value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                  }))} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Is there any cathedral ceilings or flat roof?</label>
                          <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: ""
                  }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                           <label className="text-sm font-medium">Cathedral / Flat Roofs</label>
                          <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSI: e.target.value
                  }))} />
                         </div>}

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Above Grade Walls</label>
                          <Input type="text" placeholder="Enter insulation type &/or R-value (e.g., R20 Batt/2x6/16&quot;OC), or N/A" value={selections.wallRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    wallRSI: e.target.value
                  }))} />
                       </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Below Grade Walls (Foundation Walls)</label>
                          <Input type="text" placeholder="Enter insulation type &/or R-value (e.g., R12 Batt/2x4/24&quot;OC), or N/A" value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: e.target.value
                  }))} />
                       </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium">Floors/Slabs (Select all that apply)</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsUnheated")} onChange={e => {
                        const value = "floorsUnheated";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsGarage")} onChange={e => {
                        const value = "floorsGarage";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Floors above Garages</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} onChange={e => {
                        const value = "unheatedBelowFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Unheated Floor Below Frostline</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                        const value = "unheatedAboveFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Unheated Floor Above Frost Line (or walk-out basement)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} onChange={e => {
                        const value = "slabOnGradeIntegralFooting";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Slab on grade with integral Footing</span>
                          </label>
                        </div>
                       </div>

                       {/* In-Floor Heat Dropdown for 9365 */}
                       <div className="space-y-2">
                         <label className="text-sm font-medium">Are you installing or roughing in in-floor heat?</label>
                         <Select value={selections.hasInFloorHeat9365} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasInFloorHeat9365: value,
                    // Add to floorsSlabsSelected if yes, remove if no
                    floorsSlabsSelected: value === 'yes' ? [...prev.floorsSlabsSelected.filter(item => item !== 'heatedFloors'), 'heatedFloors'] : prev.floorsSlabsSelected.filter(item => item !== 'heatedFloors'),
                    // Clear heated floors RSI if selecting no
                    heatedFloorsRSI: value === 'no' ? '' : prev.heatedFloorsRSI
                  }))}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select yes or no" />
                           </SelectTrigger>
                           <SelectContent className="bg-background border shadow-lg z-50">
                             <SelectItem value="yes">Yes</SelectItem>
                             <SelectItem value="no">No</SelectItem>
                           </SelectContent>
                          </Select>
                        </div>

                        {selections.hasInFloorHeat9365 === "yes" && <WarningButton warningId="inFloorHeating-9365-info" title="In-Floor Heating Requirements">
                            <p className="text-xs text-foreground/80">
                              Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                            </p>
                          </WarningButton>}

                        {selections.floorsSlabsSelected.includes("floorsUnheated") && <div className="space-y-2">
                          <label className="text-sm font-medium">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                          <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsUnheatedRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("floorsGarage") && <div className="space-y-2">
                          <label className="text-sm font-medium">Floors above Garages</label>
                          <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsGarageRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div className="space-y-2">
                          <label className="text-sm font-medium">Unheated Floor Below Frost Line</label>
                          <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorBelowFrostRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div className="space-y-2">
                          <label className="text-sm font-medium">Unheated Floor Above Frost Line</label>
                          <Input type="text" placeholder="Enter insulation type & R-value (e.g., 2&quot; XPS or R10 Rigid), or N/A" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorAboveFrostRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("heatedFloors") && <div className="space-y-2">
                          <label className="text-sm font-medium">Heated Floors</label>
                          <Input type="text" placeholder="Enter insulation type & R-value (e.g., 2&quot; XPS&quot; or R10 Rigid)" value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatedFloorsRSI: e.target.value
                  }))} />
                          <WarningButton warningId="heatedFloorsRSI-hydronic-9365" title="⚠️ Hydronic Floor Insulation Required">
                            <p className="text-sm text-foreground/80">
                              Hydronic floors must be insulated to prevent heat loss to the ground or unheated areas below. The insulation should be installed between the heated floor and any unheated space, with proper vapor barrier placement. Minimum insulation values vary by province and specific application - consult local building codes and your mechanical designer for specific requirements.
                            </p>
                          </WarningButton>
                        </div>}

                      {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div className="space-y-2">
                          <label className="text-sm font-medium">Slab on grade with integral Footing</label>
                          <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    slabOnGradeIntegralFootingRSI: e.target.value
                  }))} />
                        </div>}

                         {/* Window Schedule Upload */}
                         <div className="space-y-4 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                          <div className="space-y-2">
                             <label className="text-sm font-medium">Upload window/door schedule from your supplier e.g., "All Weather, Plygem, etc."</label>
                            <div className="flex items-center space-x-4">
                              <Input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png" onChange={handleFileUpload} className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
                            </p>
                             <p className="text-xs text-white font-medium">
                               You're welcome to upload documents later, but please be aware this may cause delays.
                             </p>
                         </div>

                          {uploadedFiles.length > 0 && <div className="space-y-2">
                              <div className="flex items-center gap-2 text-green-600">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</span>
                              </div>
                              <div className="space-y-2">
                                {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center space-x-2">
                                      <Info className="h-4 w-4 text-green-600" />
                                      <span className="text-sm text-green-800">{file.name}</span>
                                      <span className="text-xs text-green-600">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0 text-green-600 hover:text-red-600">
                                      ×
                                    </Button>
                                  </div>)}
                              </div>
                            </div>}
                       </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Do you have skylights?</label>
                        <Select value={selections.hasSkylights} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasSkylights: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {selections.hasSkylights === "yes" && <div className="space-y-2">
                            <label className="text-sm font-medium">Skylight U-Value</label>
                            <Input type="text" placeholder="Enter U-Value (W/(m²·K))" value={selections.skylightUValue || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      skylightUValue: e.target.value
                    }))} />
                          </div>}
                       </div>
                       

                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">Airtightness Level</label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                               More Info
                             </Button>
                           </PopoverTrigger>
                            <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                              <div className="space-y-4">
                                 <div>
                                   <h4 className="font-semibold text-sm mb-2">What's a Blower Door Test?</h4>
                                   <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div className="space-y-4">
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                         <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                         <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                         <p className="ml-4">Total leak area per square metre of envelope.</p>
                                         <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                         <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                         <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                       </div>
                                       <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• A full detached house</p>
                                       <p>• A single unit in a row house or duplex</p>
                                       <p>• A section of a large home or multi-unit building</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                     <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Small homes have more corners and connections relative to their size.</p>
                                       <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                       <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">Unguarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                           <p>• Includes leakage between units.</p>
                                           <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                         </div>
                                       </div>
                                       <div>
                                         <p className="font-medium">Guarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• All adjacent units are depressurized at the same time.</p>
                                           <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                           <p>• Ideal for multi-unit buildings, but more complex.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                       <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                       <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                       <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                     </div>
                                   </div>
                                 </div>

                                 <div className="space-y-2">
                                   <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                     <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                     <div className="space-y-1">
                                       <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         View the Blower Door Checklist
                                       </a>
                                       <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         More airtightness information
                                       </a>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                           </PopoverContent>
                         </Popover>
                       </div>
                        <Input type="text" placeholder={`Min ${selections.province === "saskatchewan" ? "3.2" : "3.0"} ACH50 for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.airtightness} onChange={e => setSelections(prev => ({
                    ...prev,
                    airtightness: e.target.value
                  }))} />
                        
                         <WarningButton warningId="airtightness-caution-9365" title="Caution: Air-Tightness Targets Without Testing History">
                            <div className="text-xs text-white space-y-2">
                             <p>
                               Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                             </p>
                             <p>
                               We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                             </p>
                             <p>
                               If your final blower door test doesn't meet the target you've claimed, you could:
                             </p>
                             <ul className="list-disc ml-4 space-y-1">
                               <li>Miss required performance metrics</li>
                               <li>Be denied a permit or occupancy</li>
                               <li>Face expensive late-stage upgrades or rework</li>
                             </ul>
                             <p>
                               <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                             </p>
                             <div className="flex items-center gap-1 text-sm mt-3">
                               <span>🔗</span>
                               <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                 More information
                               </a>
                             </div>
                            </div>
                          </WarningButton>
                           
                        {(() => {
                    const airtightnessValue = parseFloat(selections.airtightness || "0");

                    // Determine minimum threshold based on province and building type
                    let minimumThreshold = 2.5; // Default for Alberta single-detached
                    let thresholdText = "2.5";
                    if (selections.province === "saskatchewan") {
                      minimumThreshold = 3.2;
                      thresholdText = "3.2";
                    } else if (selections.province === "alberta" && selections.buildingType === "multi-unit") {
                      minimumThreshold = 3.0;
                      thresholdText = "3.0";
                    }
                    const showWarning = airtightnessValue > 0 && airtightnessValue < minimumThreshold;
                    return showWarning ? <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                                <div className="flex items-start gap-2">
                                  <span className="text-destructive text-lg">⚠️</span>
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-destructive">Blower Door Test Required</h4>
                                     <p className="text-sm text-destructive/80">
                                       You've selected an air leakage rate below {thresholdText} ACH@50pa. A blower door test is required prior to occupancy to verify this result.
                                     </p>
                                 </div>
                               </div>
                             </div> : null;
                  })()}
                           
                          {/* Mid-Construction Blower Door Test Checkbox */}
                          <div className="space-y-3 pt-4 border-t border-border/20">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" id="midConstructionBlowerDoor-9367-3" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                        ...prev,
                        midConstructionBlowerDoorPlanned: e.target.checked
                      }))} className="w-4 h-4 text-primary mt-1" />
                              <div className="flex-1">
                                <label htmlFor="midConstructionBlowerDoor-9367-3" className="text-sm font-medium cursor-pointer">
                                  Mid-Construction Blower Door Test Planned
                                </label>
                              </div>
                            </div>
                            
                            <WarningButton warningId="mid-construction-blower-door-info-9367-3" title="Benefits of Mid-Construction Blower Door Testing">
                               <div className="text-xs text-white space-y-2">
                                <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                  <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                  <li>Reduces costly rework later in the build.</li>
                                  <li>Improves energy performance, helping meet code or rebate targets.</li>
                                  <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                  <li>Ensures proper placement of air barrier details.</li>
                                  <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                                </ul>
                                <div className="flex items-center gap-1 text-sm mt-3">
                                  <span>📄</span>
                                  <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    View the Blower Door Checklist
                                  </a>
                                </div>
                              </div>
                            </WarningButton>
                          </div>
                      </div>

                       {!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes') && <>
                           <div className="space-y-2">
                             <label className="text-sm font-medium">Water Heater Type</label>
                            <Select value={selections.waterHeaterType} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      waterHeaterType: value
                    }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select water heater type" />
                              </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                  <SelectItem value="gas">Gas</SelectItem>
                                  <SelectItem value="electric">Electric</SelectItem>
                                </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Water Heater</label>
                            <Input type="text" placeholder="Enter Water Heater Make/Model" value={selections.waterHeater} onChange={e => setSelections(prev => ({
                      ...prev,
                      waterHeater: e.target.value
                    }))} />
                          </div>
                         </>}

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">Is a drain water heat recovery system being installed?</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                More Info
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[500px] p-4" side="right" align="start">
                              <div className="space-y-4">
                                <div className="border-b pb-2">
                                  <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                                </div>
                                
                                <div className="space-y-3">
                                   <p className="text-sm text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                  </p>
                                  
                                  <div className="space-y-2">
                                    <h5 className="font-medium text-sm">How it works:</h5>
                                    <p className="text-sm text-muted-foreground">When hot water goes down the drain (like from a shower), the DWHR unit uses a heat exchanger to transfer that thermal energy to the incoming cold water supply before it reaches your water heater.</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h5 className="font-medium text-sm">Benefits:</h5>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>• Reduces water heating energy consumption</p>
                                      <p>• Lowers utility bills</p>
                                      <p>• Contributes to overall building energy efficiency</p>
                                      <p>• Works continuously with no maintenance required</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                       <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select yes or no" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Heating Type</label>
                       <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select heating type" />
                         </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="furnace">Furnace</SelectItem>
                            <SelectItem value="boiler">Boiler</SelectItem>
                            <SelectItem value="heat-pump">Heat Pump</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <WarningButton warningId="mechanical-equipment-docs-9365" title="⚠️ Mechanical Equipment Documentation">
                           <div className="text-xs text-white space-y-2">
                            <p>
                              The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations.
                            </p>
                            <p>
                              <strong>F280 calculations:</strong> A heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                            </p>
                            <p>
                              <strong>Benefits:</strong> Ensures HVAC systems are properly sized, improves comfort and efficiency, reduces energy costs, and is often required for building permits.
                            </p>
                            <div className="flex items-center gap-1 text-sm mt-3">
                              <span>🔗</span>
                              <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                More information
                              </a>
                            </div>
                          </div>
                        </WarningButton>
                      </div>

                     {selections.heatingType && <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {selections.heatingType === 'furnace' ? 'Furnace' : selections.heatingType === 'boiler' ? 'Boiler' : selections.heatingType === 'heat-pump' ? 'Heat Pump' : 'Heating Efficiency'}
                          </label>
                         <Input type="text" placeholder={selections.heatingType === 'furnace' ? "Enter Furnace Make/Model" : selections.heatingType === 'boiler' ? "Enter Boiler Make/Model" : selections.heatingType === 'heat-pump' ? "Enter Heat Pump Make/Model" : "Enter heating equipment make/model"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                  }))} />
                        </div>}

                      {selections.heatingType === 'boiler' && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Are you installing an indirect tank?</label>
                            <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      indirectTank: value
                    }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select if installing indirect tank" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selections.indirectTank === 'yes' && <div className="space-y-2">
                              <label className="text-sm font-medium">Indirect tank size (gallons)</label>
                              <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                      ...prev,
                      indirectTankSize: e.target.value
                    }))} />
                            </div>}
                        </div>}

                      <div className="space-y-2">
                       <label className="text-sm font-medium">Are you installing cooling/air conditioning?</label>
                       <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select if cooling is applicable" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                      {selections.coolingApplicable === "yes" && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Cooling System Make/Model</label>
                            <Input type="text" value={selections.coolingMakeModel} onChange={e => setSelections(prev => ({
                      ...prev,
                      coolingMakeModel: e.target.value
                    }))} placeholder="Enter cooling system make and model" />
                          </div>
                        </div>}


                        {/* Secondary Suite HRV - Show for buildings with multiple units */}
                        {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                            <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>
                           
                           <div className="space-y-2">
                             <div className="flex items-center gap-3">
                               <label className="text-sm font-medium">Will there be a second HRV/ERV for the secondary suite?</label>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                     <Info className="h-3 w-3 mr-1" />
                                     More Info
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                   <DialogHeader>
                                     <DialogTitle>Secondary Suite HRV/ERV Information</DialogTitle>
                                   </DialogHeader>
                                   <div className="space-y-4">
                                     <div>
                                       <h4 className="font-semibold text-sm mb-2">Independent HRV/ERV for Secondary Suite</h4>
                                       <p className="text-xs text-muted-foreground">
                                         A secondary suite may require its own HRV/ERV system to ensure adequate ventilation and maintain indoor air quality independently from the main dwelling unit.
                                       </p>
                                     </div>
                                     
                                     <div>
                                       <h5 className="font-medium text-sm mb-1">When a second HRV/ERV is needed:</h5>
                                       <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                         <li><strong>Separate ventilation zones:</strong> When the secondary suite requires independent air quality control.</li>
                                         <li><strong>Building code requirements:</strong> Some jurisdictions require separate ventilation systems for secondary suites.</li>
                                         <li><strong>Different occupancy patterns:</strong> When main and secondary units have different ventilation needs.</li>
                                         <li><strong>Privacy and control:</strong> Allowing tenants to control their own indoor air quality.</li>
                                       </ul>
                                     </div>
                                   </div>
                                 </DialogContent>
                               </Dialog>
                             </div>
                             <div className="flex gap-4">
                               <label className="flex items-center gap-2">
                                 <input type="radio" name="hasSecondaryHrv" value="yes" checked={selections.hasSecondaryHrv === "yes"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHrv: e.target.value,
                          secondaryHrvEfficiency: "" // Reset when changing
                        }))} className="w-4 h-4 text-primary" />
                                 <span className="text-sm">Yes</span>
                               </label>
                               <label className="flex items-center gap-2">
                                 <input type="radio" name="hasSecondaryHrv" value="no" checked={selections.hasSecondaryHrv === "no"} onChange={e => setSelections(prev => ({
                          ...prev,
                          hasSecondaryHrv: e.target.value,
                          secondaryHrvEfficiency: ""
                        }))} className="w-4 h-4 text-primary" />
                                 <span className="text-sm">No</span>
                               </label>
                             </div>
                           </div>

                           {selections.hasSecondaryHrv === "yes" && <div className="space-y-2">
                               <label className="text-sm font-medium">Secondary Suite HRV/ERV Efficiency</label>
                               <Input type="text" placeholder="Input HRV/ERV efficiency (e.g. SRE 65%)" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      secondaryHrvEfficiency: e.target.value
                    }))} />
                             </div>}
                         </div>}
                    </>}

                 {selections.compliancePath === "9367" && <>
                       {/* Building volume section removed for 9.36.7 */}

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ceilings below Attics</label>
                          <Input type="text" placeholder='Enter assembly info (e.g., R50 Loose-fill/2x10/16"OC)' value={selections.ceilingsAtticRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    ceilingsAtticRSI: e.target.value
                  }))} />
                         </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Is there any cathedral ceilings or flat roof?</label>
                          <Select value={selections.hasCathedralOrFlatRoof} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasCathedralOrFlatRoof: value,
                    cathedralFlatRSI: ""
                  }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selections.hasCathedralOrFlatRoof === "yes" && <div className="space-y-2">
                          <label className="text-sm font-medium">Cathedral / Flat Roofs</label>
                         <Input type="text" placeholder="Enter insulation type &/or R-value (e.g, R50 Loose-fill)., N/A" value={selections.cathedralFlatRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    cathedralFlatRSI: e.target.value
                  }))} />
                        </div>}

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Above Grade Walls</label>
                          <Input type="text" placeholder='Enter assembly info (e.g., R20 Batt/2x6/16"OC)' value={selections.wallRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    wallRSI: e.target.value
                  }))} />
                       </div>

                         <div className="space-y-2">
                           <label className="text-sm font-medium">Below Grade Walls (Foundation Walls)</label>
                           <Input type="text" placeholder='Enter assembly info (e.g., R12 Batt/2x4/24"OC)' value={selections.belowGradeRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    belowGradeRSI: e.target.value
                  }))} />
                       </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium">Floors/Slabs (Select all that apply)</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsUnheated")} onChange={e => {
                        const value = "floorsUnheated";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("floorsGarage")} onChange={e => {
                        const value = "floorsGarage";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Floors above Garages</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedBelowFrost")} onChange={e => {
                        const value = "unheatedBelowFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Unheated Floor Below Frostline</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("unheatedAboveFrost")} onChange={e => {
                        const value = "unheatedAboveFrost";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Unheated Floor Above Frost Line (or walk-out basement)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("heatedFloors")} onChange={e => {
                        const value = "heatedFloors";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value),
                          hasInFloorHeat: e.target.checked ? "yes" : "no"
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Heated Floors</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting")} onChange={e => {
                        const value = "slabOnGradeIntegralFooting";
                        setSelections(prev => ({
                          ...prev,
                          floorsSlabsSelected: e.target.checked ? [...prev.floorsSlabsSelected, value] : prev.floorsSlabsSelected.filter(item => item !== value)
                        }));
                      }} className="w-4 h-4 text-primary" />
                            <span className="text-sm">Slab on grade with integral Footing</span>
                          </label>
                        </div>
                      </div>

                      {selections.floorsSlabsSelected.includes("floorsUnheated") && <div className="space-y-2">
                          <label className="text-sm font-medium">Floors over Unheated Spaces (Cantilevers or Exposed Floors)</label>
                          <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsUnheatedRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsUnheatedRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("floorsGarage") && <div className="space-y-2">
                          <label className="text-sm font-medium">Floors above Garages</label>
                          <Input type="text" placeholder="Enter insulation type &/or RSI/R-value, or N/A" value={selections.floorsGarageRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    floorsGarageRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("unheatedBelowFrost") && <div className="space-y-2">
                          <label className="text-sm font-medium">Unheated Floor Below Frost Line</label>
                          <Input type="text" placeholder="Enter RSI value or 'uninsulated'" value={selections.unheatedFloorBelowFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorBelowFrostRSI: e.target.value
                  }))} />
                        </div>}

                      {selections.floorsSlabsSelected.includes("unheatedAboveFrost") && <div className="space-y-2">
                          <label className="text-sm font-medium">Unheated Floor Above Frost Line</label>
                          <Input type="text" placeholder="Enter insulation type & R-value (e.g., 2&quot; XPS or R10 Rigid), or N/A" value={selections.unheatedFloorAboveFrostRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    unheatedFloorAboveFrostRSI: e.target.value
                  }))} />
                        </div>}

                       {selections.floorsSlabsSelected.includes("heatedFloors") && <div className="space-y-2">
                           <label className="text-sm font-medium">Heated Floors</label>
                           <Input type="text" placeholder="Enter insulation type & R-value (e.g., 2&quot; XPS or R10 Rigid)" value={selections.heatedFloorsRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatedFloorsRSI: e.target.value
                  }))} />
                           <WarningButton warningId="inFloorHeating-tiered-info" title="In-Floor Heating Requirements">
                             <p className="text-xs text-foreground/80">
                               Since the house has in-floor heating, all floors must be insulated to meet NBC requirements.
                             </p>
                           </WarningButton>
                         </div>}

                      {selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && <div className="space-y-2">
                          <label className="text-sm font-medium">Slab on grade with integral Footing</label>
                          <Input type="text" placeholder="Enter insulation type &/or R-value, or N/A" value={selections.slabOnGradeIntegralFootingRSI} onChange={e => setSelections(prev => ({
                    ...prev,
                    slabOnGradeIntegralFootingRSI: e.target.value
                  }))} />
                        </div>}

                          {/* Window Schedule Upload */}
                         <div className="space-y-4 p-4 bg-red-50/50 border border-red-200 rounded-lg">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload window/door schedule from your supplier e.g., "All Weather, Plygem, etc."</label>
                            <div className="flex items-center space-x-4">
                              <Input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png" onChange={handleFileUpload} className="file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
                            </p>
                             <p className="text-xs text-white font-medium">
                               You're welcome to upload documents later, but please be aware this may cause delays.
                             </p>
                         </div>

                         {uploadedFiles.length > 0 && <div className="space-y-2">
                             <label className="text-sm font-medium">Uploaded Files</label>
                             <div className="space-y-2">
                               {uploadedFiles.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-background border rounded-md">
                                   <div className="flex items-center space-x-2">
                                     <Info className="h-4 w-4 text-primary" />
                                     <span className="text-sm">{file.name}</span>
                                     <span className="text-xs text-muted-foreground">
                                       ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                     </span>
                                   </div>
                                   <Button variant="outline" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                                     ×
                                   </Button>
                                 </div>)}
                             </div>
                           </div>}
                        </div>

                         <div className="space-y-2">
                           <WarningButton warningId="windowUValue-9367" title="Window Schedule Required">
                             <p className="text-sm text-white">
                               Windows and doors in a building often have varying performance values. To verify that the correct specifications have been recorded, the Authority Having Jurisdiction (AHJ) may request a window and door schedule that includes performance details for each unit. Please record the range of lowest-highest performing window and door U-Value (ie, highest U-value W/(m²×K)).
                             </p>
                          </WarningButton>
                        </div>

                       <div className="space-y-2">
                        <label className="text-sm font-medium">Do you have skylights?</label>
                        <Select value={selections.hasSkylights} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasSkylights: value
                  }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {selections.hasSkylights === "yes" && <div className="space-y-2">
                            <label className="text-sm font-medium">Skylight U-Value</label>
                            <Input type="text" placeholder="Enter U-Value (W/(m²·K))" value={selections.skylightUValue || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      skylightUValue: e.target.value
                    }))} />
                          </div>}
                       </div>
                       
                       {selections.hasSkylights === "yes" && <WarningButton warningId="skylight-shaft-insulation-9368" title="Important: Skylight Shaft Insulation">
                            <p className="text-xs text-foreground/80">
                              Skylight shafts must be insulated. Be prepared to provide further details upon request.
                            </p>
                          </WarningButton>}

                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <label className="text-sm font-medium">Airtightness Level</label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                               More Info
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-[600px] max-h-[80vh] overflow-y-auto p-4" side="right" align="start">
                              <div className="space-y-4">
                                 <div>
                                   <h4 className="font-semibold text-sm mb-2">What's a Blower Door Test?</h4>
                                   <p className="text-sm text-muted-foreground">A blower door test measures air leakage in a home. A fan is placed in an exterior door to pressurize or depressurize the building, and sensors track how much air is needed to maintain a pressure difference (usually 50 Pascals). This tells us how "leaky" the building is.</p>
                                 </div>
                                 
                                 <div className="w-full h-px bg-muted"></div>
                                 
                                 <div className="space-y-4">
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What Do the Numbers Mean?</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">• ACH₅₀ (Air Changes per Hour @ 50 Pa):</p>
                                         <p className="ml-4">How many times the air inside the home is replaced in one hour.</p>
                                         <p className="ml-4">Lower is better — ≤1.0 is common for Net Zero Ready homes.</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLA₁₀ (Normalized Leakage Area):</p>
                                         <p className="ml-4">Total leak area per square metre of envelope.</p>
                                         <p className="ml-4">Think: "This building leaks like it has a 10 cm² hole per m² of wall."</p>
                                       </div>
                                       <div>
                                         <p className="font-medium">• NLR₅₀ (Normalized Leakage Rate):</p>
                                         <p className="ml-4">Volume of air leaking per second per m² of surface at 50 Pa.</p>
                                         <p className="ml-4">Useful for comparing attached units or small zones.</p>
                                       </div>
                                       <p className="font-medium text-primary">Lower values = tighter home = better performance</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's a Zone?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">A zone is any part of a building tested for air leakage. It could be:</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• A full detached house</p>
                                       <p>• A single unit in a row house or duplex</p>
                                       <p>• A section of a large home or multi-unit building</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">Each zone is tested separately because leakage patterns vary.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">What's an Attached Zone?</h5>
                                     <p className="text-sm text-muted-foreground">Zones that share a wall, ceiling, or floor with another zone are attached zones. Air can leak through shared assemblies, so careful testing is important — especially in row houses, duplexes, and condos.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Why Small Units Often Show Higher Leakage</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Small homes have more corners and connections relative to their size.</p>
                                       <p>• Mechanical equipment leaks the same amount — but it's a bigger deal in a small space.</p>
                                       <p>• As a result, ACH₅₀ values tend to look worse in smaller units.</p>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Guarded vs. Unguarded Testing</h5>
                                     <div className="space-y-3 text-sm text-muted-foreground">
                                       <div>
                                         <p className="font-medium">Unguarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• Tests one unit at a time, while neighbours are at normal pressure.</p>
                                           <p>• Includes leakage between units.</p>
                                           <p>• Easier to do (especially as units are completed and occupied), but can overestimate leakage.</p>
                                         </div>
                                       </div>
                                       <div>
                                         <p className="font-medium">Guarded Test</p>
                                         <div className="ml-4 space-y-1">
                                           <p>• All adjacent units are depressurized at the same time.</p>
                                           <p>• Blocks airflow between units, giving a more accurate picture of leakage to the outside.</p>
                                           <p>• Ideal for multi-unit buildings, but more complex.</p>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">How Do You Pass?</h5>
                                     <p className="text-sm text-muted-foreground mb-2">You can earn energy code points by hitting an Airtightness Level (AL). You only need to meet one of the three metrics (ACH, NLA, or NLR):</p>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• Use Table 9.36.-A for guarded tests (stricter limits)</p>
                                       <p>• Use Table 9.36.-B for unguarded tests (more lenient for attached buildings)</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground mt-2">In multi-unit buildings, the worst-performing zone sets the final score.</p>
                                   </div>
                                   
                                   <div className="w-full h-px bg-muted"></div>
                                   
                                   <div>
                                     <h5 className="font-medium text-sm mb-2">Other Key Points</h5>
                                     <div className="text-sm text-muted-foreground ml-4 space-y-1">
                                       <p>• For energy modelling, a multi-point test is required, reporting ACH₅₀, pressure exponent, and leakage area.</p>
                                       <p>• For basic code compliance, single- or two-point tests are fine — except NLA₁₀, which needs multi-point.</p>
                                       <p>• Combining zones? You must test each one. Use the lowest Airtightness Level for scoring if they're different. Reference the Illustrated Guide for the image above.</p>
                                     </div>
                                   </div>
                                 </div>

                                 <div className="space-y-2">
                                   <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                                     <p className="text-xs font-medium text-blue-800">📋 Helpful Resources:</p>
                                     <div className="space-y-1">
                                       <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         View the Blower Door Checklist
                                       </a>
                                       <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline hover:text-blue-800 block">
                                         More airtightness information
                                       </a>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                           </PopoverContent>
                         </Popover>
                       </div>
                        <Input type="text" placeholder={`Min ${selections.province === "saskatchewan" ? "3.2" : "3.0"} ACH50 for ${selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}`} value={selections.airtightness} onChange={e => setSelections(prev => ({
                    ...prev,
                    airtightness: e.target.value
                  }))} />
                           
                        {(() => {
                    const airtightnessValue = parseFloat(selections.airtightness || "0");

                    // Determine minimum threshold based on province
                    let minimumThreshold = 3.0; // Default for Alberta
                    let thresholdText = "3.0";
                    if (selections.province === "saskatchewan") {
                      minimumThreshold = 3.2;
                      thresholdText = "3.2";
                    }
                    const showWarning = airtightnessValue > 0 && airtightnessValue < minimumThreshold;
                    return showWarning ? <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                                <div className="flex items-start gap-2">
                                  <span className="text-destructive text-lg">⚠️</span>
                                  <div className="space-y-2">
                                     <h4 className="font-medium text-destructive">Airtightness Value Too Low</h4>
                                      <p className="text-sm text-destructive/80">
                                        The airtightness value must be at least {thresholdText} ACH50 for prescriptive unguarded testing in {selections.province === "saskatchewan" ? "Saskatchewan" : "Alberta"}. Please increase your target value.
                                     </p>
                                 </div>
                               </div>
                             </div> : null;
                  })()}
                           
                          <WarningButton warningId="airtightness-caution-9367" title="Caution: Air-Tightness Targets Without Testing History">
                            <div className="text-xs text-white space-y-2">
                             <p>
                               Choosing an air-tightness target lower than prescribed by NBC2020 without prior test results is risky.
                             </p>
                             <p>
                               We strongly recommend having at least 4–5 blower door tests from similar builds to know what levels you can reliably achieve.
                             </p>
                             <p>
                               If your final blower door test doesn't meet the target you've claimed, you could:
                             </p>
                             <ul className="list-disc ml-4 space-y-1">
                               <li>Miss required performance metrics</li>
                               <li>Be denied a permit or occupancy</li>
                               <li>Face expensive late-stage upgrades or rework</li>
                             </ul>
                             <p>
                               <strong>Good news:</strong> We track airtightness results across all projects so we can help you set realistic targets, reduce build costs, and optimize performance from day one.
                             </p>
                             <div className="flex items-center gap-1 text-sm mt-3">
                               <span>🔗</span>
                               <a href="https://www.solinvictusenergyservices.com/airtightness" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                 More information
                               </a>
                             </div>
                            </div>
                          </WarningButton>
                          
                          {/* Mid-Construction Blower Door Test Checkbox */}
                          <div className="space-y-3 pt-4 border-t border-border/20">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" id="midConstructionBlowerDoor-9368" checked={selections.midConstructionBlowerDoorPlanned} onChange={e => setSelections(prev => ({
                        ...prev,
                        midConstructionBlowerDoorPlanned: e.target.checked
                      }))} className="w-4 h-4 text-primary mt-1" />
                              <div className="flex-1">
                                <label htmlFor="midConstructionBlowerDoor-9368" className="text-sm font-medium cursor-pointer">
                                  Mid-Construction Blower Door Test Planned
                                </label>
                              </div>
                            </div>
                            
                            <WarningButton warningId="mid-construction-blower-door-info-9368" title="Benefits of Mid-Construction Blower Door Testing">
                               <div className="text-xs text-white space-y-2">
                                <p className="font-medium">Benefits of a mid-construction (misconstruction) blower door test:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                  <li>Identifies air leaks early so they can be sealed before drywall.</li>
                                  <li>Reduces costly rework later in the build.</li>
                                  <li>Improves energy performance, helping meet code or rebate targets.</li>
                                  <li>Enhances durability by minimizing moisture movement through assemblies.</li>
                                  <li>Ensures proper placement of air barrier details.</li>
                                  <li>Supports better HVAC sizing with more accurate airtightness data.</li>
                                </ul>
                                <div className="flex items-center gap-1 text-sm mt-3">
                                  <span>📄</span>
                                  <a href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                    View the Blower Door Checklist
                                  </a>
                                </div>
                              </div>
                            </WarningButton>
                          </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Water Heater Type</label>
                       <Select value={selections.waterHeaterType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    waterHeaterType: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select water heater type" />
                         </SelectTrigger>
                           <SelectContent className="bg-background border shadow-lg z-50">
                             <SelectItem value="gas">Gas</SelectItem>
                             <SelectItem value="electric">Electric</SelectItem>
                           </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Water Heater</label>
                       <Input type="text" placeholder="Enter Water Heater Make/Model" value={selections.waterHeater} onChange={e => setSelections(prev => ({
                    ...prev,
                    waterHeater: e.target.value
                  }))} />
                     </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">Is a drain water heat recovery system being installed?</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                More Info
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[500px] p-4" side="right" align="start">
                              <div className="space-y-4">
                                <div className="border-b pb-2">
                                  <h4 className="font-medium text-sm">ℹ️ Drain Water Heat Recovery (DWHR)</h4>
                                </div>
                                
                                <div className="space-y-3">
                                   <p className="text-sm text-muted-foreground">
                                    DWHR systems capture heat from shower drain water and use it to preheat incoming cold water, reducing hot water energy use by 20–40%.
                                  </p>
                                  
                                  <div className="space-y-2">
                                    <h5 className="font-medium text-sm">How it works:</h5>
                                    <p className="text-sm text-muted-foreground">When hot water goes down the drain (like from a shower), the DWHR unit uses a heat exchanger to transfer that thermal energy to the incoming cold water supply before it reaches your water heater.</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h5 className="font-medium text-sm">Benefits:</h5>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>• Reduces water heating energy consumption</p>
                                      <p>• Lowers utility bills</p>
                                      <p>• Contributes to overall building energy efficiency</p>
                                      <p>• Works continuously with no maintenance required</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                       <Select value={selections.hasDWHR} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasDWHR: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select yes or no" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                        </Select>
                        
                        <WarningButton warningId="mechanical-equipment-docs-9367" title="⚠️ Mechanical Equipment Documentation">
                           <div className="text-xs text-white space-y-2">
                            <p>
                              The Authority Having Jurisdiction (AHJ) may request specific makes/models of the mechanical equipment being proposed for heating, cooling, domestic hot water and HRV systems. The AHJ may also request CSA F-280 heat loss & gain calculations.
                            </p>
                            <p>
                              <strong>F280 calculations:</strong> A heating and cooling load calculation based on CSA Standard F280-12 (or updated versions), which is the Canadian standard for determining how much heating or cooling a home needs. It accounts for factors like insulation levels, windows, air leakage, and local climate.
                            </p>
                            <p>
                              <strong>Benefits:</strong> Ensures HVAC systems are properly sized, improves comfort and efficiency, reduces energy costs, and is often required for building permits.
                            </p>
                            <div className="flex items-center gap-1 text-sm mt-3">
                              <span>🔗</span>
                              <a href="https://solinvictusenergyservices.com/cancsa-f28012" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                More information
                              </a>
                            </div>
                          </div>
                        </WarningButton>
                      </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium">Heating Type</label>
                       <Select value={selections.heatingType} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    heatingType: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select heating type" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="furnace">Furnace</SelectItem>
                           <SelectItem value="boiler">Boiler</SelectItem>
                           <SelectItem value="heat-pump">Heat Pump</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     {selections.heatingType && <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {selections.heatingType === 'furnace' ? 'Furnace' : selections.heatingType === 'boiler' ? 'Boiler' : selections.heatingType === 'heat-pump' ? 'Heat Pump' : 'Heating Efficiency'}
                          </label>
                         <Input type="text" placeholder={selections.heatingType === 'furnace' ? "Enter Furnace Make/Model" : selections.heatingType === 'boiler' ? "Enter Boiler Make/Model" : selections.heatingType === 'heat-pump' ? "Enter Heat Pump Make/Model" : "Enter heating equipment make/model"} value={selections.heatingEfficiency} onChange={e => setSelections(prev => ({
                    ...prev,
                    heatingEfficiency: e.target.value
                  }))} />
                        </div>}

                      {selections.heatingType === 'boiler' && <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Are you installing an indirect tank?</label>
                            <Select value={selections.indirectTank} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      indirectTank: value
                    }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select if installing indirect tank" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selections.indirectTank === 'yes' && <div className="space-y-2">
                              <label className="text-sm font-medium">Indirect tank size (gallons)</label>
                              <Input type="number" placeholder="Enter tank size in gallons" value={selections.indirectTankSize} onChange={e => setSelections(prev => ({
                      ...prev,
                      indirectTankSize: e.target.value
                    }))} />
                            </div>}
                        </div>}

                      <div className="space-y-2">
                       <label className="text-sm font-medium">Are you installing cooling/air conditioning?</label>
                       <Select value={selections.coolingApplicable} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    coolingApplicable: value
                  }))}>
                         <SelectTrigger>
                           <SelectValue placeholder="Select if cooling is applicable" />
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-lg z-50">
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                       {selections.coolingApplicable === "yes" && <div className="space-y-4">
                           <div className="space-y-2">
                            <label className="text-sm font-medium">Cooling System Make/Model</label>
                            <Input type="text" value={selections.coolingMakeModel} onChange={e => setSelections(prev => ({
                      ...prev,
                      coolingMakeModel: e.target.value
                    }))} placeholder="Enter cooling system make and model" />
                          </div>
                        </div>}

                      </>}

                     {/* HRV/ERV Section for 9367 moved to Additional Information section */}
                     {selections.compliancePath && <div className="pt-6 border-t space-y-6">
                         <h3 className="text-lg font-semibold text-foreground">HRV/ERV Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium">Does this building include an HRV or ERV?</label>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                     <Info className="h-3 w-3 mr-1" />
                                     More Info
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                   <DialogHeader>
                                     <DialogTitle>Should I include an HRV (Heat Recovery Ventilator)?</DialogTitle>
                                   </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Should I include an HRV (Heat Recovery Ventilator)?</h4>
                                      <p className="text-xs text-muted-foreground">
                                        An HRV is a system that brings in fresh outdoor air while recovering heat from the stale indoor air it exhausts. It improves indoor air quality and energy efficiency — especially in airtight homes.
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">Why you should consider an HRV:</h5>
                                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                                        <li><strong>Better indoor air quality:</strong> Removes stale air, moisture, odors, and pollutants while bringing in fresh air.</li>
                                        <li><strong>Energy savings:</strong> Recovery up to 80-90% of the heat from outgoing air, reducing heating costs.</li>
                                        <li><strong>Comfort:</strong> Maintains consistent temperatures and humidity levels throughout your home.</li>
                                        <li><strong>Code compliance:</strong> In many cases, an HRV can help you meet building envelope requirements with less insulation.</li>
                                      </ul>
                                    </div>

                                    <div>
                                      <h5 className="font-medium text-sm mb-1">When is an HRV required?</h5>
                                      <p className="text-xs text-muted-foreground">
                                        While not always mandatory, HRVs are required or strongly recommended for homes with very low air leakage rates (typically below 2.5 ACH50) to ensure adequate ventilation. They're also required for certain energy efficiency programs.
                                      </p>
                                    </div>

                                    <div>
                                      <h5 className="font-medium text-sm mb-1">HRV vs. ERV:</h5>
                                      <div className="text-xs text-muted-foreground space-y-1">
                                        <p><strong>HRV (Heat Recovery Ventilator):</strong> Recovers heat only. Best for cold, dry climates like most of Canada.</p>
                                        <p><strong>ERV (Energy Recovery Ventilator):</strong> Recovers both heat and moisture. Better for humid climates or homes with high humidity issues.</p>
                                      </div>
                                    </div>
                                  </div>
                                 </DialogContent>
                               </Dialog>
                            </div>
                            <Select value={selections.hasHrv} onValueChange={value => setSelections(prev => ({
                    ...prev,
                    hasHrv: value
                  }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="with_hrv">Yes - with HRV/ERV</SelectItem>
                                <SelectItem value="without_hrv">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                           {selections.hasHrv === "with_hrv" && <div className="space-y-2">
                                <label className="text-sm font-medium">HRV/ERV Make/Model</label>
                                 <Input type="text" placeholder="Input HRV/ERV make/model (e.g. Fantech SHR 1504)" value={selections.hrvEfficiency || ""} onChange={e => setSelections(prev => ({
                    ...prev,
                    hrvEfficiency: e.target.value
                  }))} />
                             </div>}

                           {/* Secondary Suite HRV - Show for buildings with multiple units */}
                           {(selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") && <div className="space-y-4 p-4 bg-muted border border-border rounded-md">
                                <h5 className="font-medium text-foreground">Secondary Suite HRV/ERV</h5>
                               
                               <div className="space-y-2">
                                 <div className="flex items-center gap-3">
                                   <label className="text-sm font-medium">Will there be a second HRV/ERV for the secondary suite?</label>
                                   <Dialog>
                                     <DialogTrigger asChild>
                                       <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                         <Info className="h-3 w-3 mr-1" />
                                         More Info
                                       </Button>
                                     </DialogTrigger>
                                     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                       <DialogHeader>
                                         <DialogTitle>Secondary Suite HRV/ERV Information</DialogTitle>
                                       </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold text-sm mb-2">Secondary Suite HRV/ERV Options</h4>
                                          <p className="text-xs text-muted-foreground">
                                            For buildings with secondary suites, you have options for ventilation systems.
                                          </p>
                                        </div>
                                        
                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Option 1: Shared System</h5>
                                          <p className="text-xs text-muted-foreground">
                                            Use one larger HRV/ERV system to serve both the main dwelling and secondary suite, with proper ducting and controls.
                                          </p>
                                        </div>

                                        <div>
                                          <h5 className="font-medium text-sm mb-1">Option 2: Separate Systems</h5>
                                          <p className="text-xs text-muted-foreground">
                                            Install separate HRV/ERV systems for each unit to provide independent control and operation.
                                          </p>
                                        </div>
                                      </div>
                                     </DialogContent>
                                   </Dialog>
                                 </div>
                                 <Select value={selections.hasSecondaryHrv} onValueChange={value => setSelections(prev => ({
                      ...prev,
                      hasSecondaryHrv: value
                    }))}>
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select option" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-background border shadow-lg z-50">
                                     <SelectItem value="shared">Shared system (one HRV/ERV for both units)</SelectItem>
                                     <SelectItem value="separate">Separate HRV/ERV for secondary suite</SelectItem>
                                     <SelectItem value="none">No secondary HRV/ERV</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>

                               {selections.hasSecondaryHrv === "separate" && <div className="space-y-2">
                                    <label className="text-sm font-medium">Secondary Suite HRV/ERV Make/Model</label>
                                    <Input type="text" placeholder="Input secondary HRV/ERV make/model" value={selections.secondaryHrvEfficiency || ""} onChange={e => setSelections(prev => ({
                      ...prev,
                      secondaryHrvEfficiency: e.target.value
                    }))} />
                                 </div>}
                               </div>}

                          {/* MURB/Secondary Suite Mechanical Systems Warning */}
                          {(selections.buildingType === "multi-unit" || selections.buildingType === "single-detached-secondary") && <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className="text-orange-600 text-lg">⚠️</span>
                                <div className="space-y-2">
                                  <h4 className="font-medium text-orange-800">MURB/Secondary Suite Mechanical Systems</h4>
                                  <p className="text-sm text-orange-700">
                                    For {selections.buildingType === "multi-unit" ? "multi-unit residential buildings (MURBs)" : "homes with secondary suites"}, 
                                    please ensure you list all mechanical system types, make/models, and any other relevant information 
                                    in the comments section below. This includes:
                                  </p>
                                  <ul className="list-disc ml-4 text-sm text-orange-700 space-y-1">
                                    <li>Secondary heating system type and make/model (if applicable)</li>
                                    <li>Secondary/multiple service water heating systems</li>
                                    <li>Secondary HRV/ERV systems</li>
                                    <li>Any additional heating equipment specifications</li>
                                    <li>Special installation requirements or configurations</li>
                                    <li>Zone-specific heating arrangements</li>
                                  </ul>
                                </div>
                              </div>
                            </div>}

                           {/* Certification Interests */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Are you interested in any of the following certifications or programs?</label>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-medium bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300">
                                  <Info className="h-3 w-3 mr-1" />
                                  More Info
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Certification Information</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 text-sm">
                                  {/* Summary Table */}
                                  <div className="bg-muted/30 p-4 rounded-lg">
                                    <h3 className="font-semibold text-base mb-4">Summary Table: Benefits at a Glance</h3>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b">
                                            <th className="text-left py-2 pr-4 font-medium">Program / Feature</th>
                                            <th className="text-left py-2 pr-4 font-medium">Homeowner Benefit</th>
                                            <th className="text-left py-2 font-medium">Builder Benefit</th>
                                          </tr>
                                        </thead>
                                        <tbody className="space-y-2">
                                          <tr className="border-b border-muted">
                                            <td className="py-2 pr-4 font-medium">EnerGuide (GJ/year)</td>
                                            <td className="py-2 pr-4">Understand energy use, access rebates, improve efficiency</td>
                                            <td className="py-2">Required for performance path, supports other certifications</td>
                                          </tr>
                                          <tr className="border-b border-muted">
                                            <td className="py-2 pr-4 font-medium">Net Zero / NZ Ready</td>
                                            <td className="py-2 pr-4">Energy independence, comfort, resale value</td>
                                            <td className="py-2">Market leadership, premium product, support clean energy goals</td>
                                          </tr>
                                          <tr className="border-b border-muted">
                                            <td className="py-2 pr-4 font-medium">Built Green</td>
                                            <td className="py-2 pr-4">Healthier, more durable, environmentally friendly home</td>
                                            <td className="py-2">Flexible tiers, environmental branding</td>
                                          </tr>
                                          <tr className="border-b border-muted">
                                            <td className="py-2 pr-4 font-medium">ENERGY STAR</td>
                                            <td className="py-2 pr-4">Lower bills, trusted label, better comfort</td>
                                            <td className="py-2">Simple compliance path, public recognition</td>
                                          </tr>
                                          <tr className="border-b border-muted">
                                            <td className="py-2 pr-4 font-medium">SaskEnergy Rebates</td>
                                            <td className="py-2 pr-4">Reduces upfront upgrade costs</td>
                                            <td className="py-2">Easier upsell of efficiency features</td>
                                          </tr>
                                          <tr>
                                            <td className="py-2 pr-4 font-medium">Solar-Ready Design</td>
                                            <td className="py-2 pr-4">Prepares for low-cost solar install, supports $40K loan</td>
                                            <td className="py-2">Low-cost upgrade, future-proofs builds</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold text-base mb-3">1. EnerGuide Certification (Natural Resources Canada)</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Provides an energy rating in gigajoules per year (GJ/year)—the lower the number, the better.</li>
                                          <li>Helps identify areas for improvement, lower utility costs, and enhance comfort.</li>
                                          <li>A rating of 0 GJ/year indicates a Net Zero home that offsets 100% of its energy with renewables.</li>
                                          <li>Required for many rebate programs and certifications like Net Zero and ENERGY STAR.</li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>A pathway for compliance under the performance path of the tiered energy code.</li>
                                          <li>Establishes credibility and trust with homebuyers.</li>
                                          <li>Provides the baseline to pursue ENERGY STAR, Net Zero, and Built Green certifications.</li>
                                          <li>Supports marketing efforts and helps communicate the value of energy-efficient construction.</li>
                                          <li>Third party certification provides validation of the performance of the home and how it was constructed with a final blower door test included.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold text-base mb-3">2. Net Zero and Net Zero Ready (CHBA)</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Best-in-class energy efficiency: Net Zero homes produce as much energy as they use annually; Net Zero Ready homes are designed for future solar install.</li>
                                          <li>Significantly lower utility bills and improved comfort, air quality, and noise reduction.</li>
                                          <li>Highly durable and future-proof, with potential for higher resale value.</li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Positions the builder as a leader in high-performance, sustainable design.</li>
                                          <li>Access to CHBA's Net Zero labeling and marketing resources.</li>
                                          <li>Attracts forward-thinking buyers and increases profit margins through differentiated product offerings.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold text-base mb-3">3. Built Green Certification</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Covers a broader spectrum than energy alone: materials, indoor air quality, water conservation, durability, and waste management.</li>
                                          <li>Results in healthier, more comfortable homes with long-term durability and reduced environmental impact.</li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Flexible, tiered system (Bronze to Platinum) allows phased adoption of sustainability goals.</li>
                                          <li>Offers a recognized label for environmentally responsible building.</li>
                                          <li>Aligns with evolving buyer values and regulatory trends.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold text-base mb-3">4. ENERGY STAR for New Homes</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Homes are at least 20% more efficient than code-built homes.</li>
                                          <li>Trusted government-backed label offering assurance of energy savings, comfort, and quieter operation.</li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Clear, prescriptive path to code-exceeding performance.</li>
                                          <li>Helps qualify for rebates and incentives.</li>
                                          <li>Widely recognized by buyers and lenders.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold text-base mb-3">5. SaskEnergy Residential Rebates</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Helps lower the cost of upgrading to more efficient equipment, insulation, windows, and more (up to $9,000 in rebates).</li>
                                          <li>Incentivizes high-performance construction and energy-saving retrofits.</li>
                                          <li>May be stackable with federal programs (e.g., Canada Greener Homes).</li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Helps close the affordability gap for clients.</li>
                                          <li>Makes upselling energy-efficient features more accessible and appealing.</li>
                                          <li>Adds value without increasing construction costs significantly when planned early.</li>
                                          <li>Up to $800 in rebates for builders</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h3 className="font-semibold text-base mb-3">6. Building a Solar-Ready Home</h3>
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium">Homeowner Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Avoids costly retrofits later by pre-installing conduit, roof reinforcement, panel space, and breaker capacity.</li>
                                          <li>Enables faster and more affordable future solar installations.</li>
                                          <li>Adds resale value and aligns with Canada's Net Zero goals.</li>
                                          <li>Canada Greener Homes Loan offers up to $40,000 interest-free for solar if the homeowner has occupied the home for at least 6 months: <a href="https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-loan" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Learn more and apply</a></li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Builder Benefits:</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                          <li>Inexpensive to incorporate during construction—highly valued by buyers and differentiates your home from the competition.</li>
                                          <li>Supports Net Zero Ready certification and prepares homes for future incentives.</li>
                                          <li>Enhances builder reputation in sustainability and long-term value creation.</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                         <div className="space-y-3">
                            {[{
                      id: "energuide",
                      label: "EnerGuide",
                      url: "https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/energuide-rated-new-homes",
                      description: "Official home energy rating system for Canada"
                    }, {
                      id: "chba-net-zero",
                      label: "CHBA Net Zero",
                      url: "https://www.chba.ca/net-zero/",
                      description: "Canadian Home Builders' Association Net Zero certification"
                    }, {
                      id: "built-green",
                      label: "Built Green",
                      url: "https://builtgreencanada.ca",
                      description: "National green building certification program"
                    }, {
                      id: "energy-star",
                      label: "ENERGY STAR",
                      url: "https://natural-resources.canada.ca/energy-efficiency/energy-star/new-homes",
                      description: "High-efficiency homes certification"
                    }, ...(selections.province === "saskatchewan" ? [{
                      id: "sask-energy-beyond-codes",
                      label: "SaskEnergy Beyond Codes Rebate",
                      url: "https://www.saskenergy.com/homes-beyond-code-program",
                      description: "Saskatchewan-specific energy efficiency rebate program"
                    }] : []), {
                      id: "solar-ready",
                      label: "Solar Ready",
                      url: "https://natural-resources.canada.ca/sites/nrcan/files/canmetenergy/files/pubs/SolarReadyGuidelines_en.pdf",
                      description: "Home design prepared for future solar panel installation"
                    }].map(cert => <div key={cert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                                <input type="checkbox" id={cert.id} checked={selections.interestedCertifications.includes(cert.id)} onChange={e => {
                        setSelections(prev => ({
                          ...prev,
                          interestedCertifications: e.target.checked ? [...prev.interestedCertifications, cert.id] : prev.interestedCertifications.filter(id => id !== cert.id)
                        }));
                      }} className="w-4 h-4 text-primary mt-1" />
                                {cert.id === "energuide" && <div className="flex items-center mt-1">
                                    <img src="/lovable-uploads/7eafc507-a263-4914-a980-9adb84046e56.png" alt="EnerGuide Logo" className="h-6 w-auto" />
                                  </div>}
                                {cert.id === "chba-net-zero" && <div className="flex items-center mt-1">
                                    <img src="/lovable-uploads/1aa4ac59-9662-45fa-8013-06a725025afa.png" alt="Net Zero Home Logo" className="h-6 w-auto" />
                                  </div>}
                                {cert.id === "built-green" && <div className="flex items-center mt-1">
                                    <img src="/lovable-uploads/ccb67952-2457-4aeb-806a-e595f87d6fe0.png" alt="Built Green Logo" className="h-6 w-auto" />
                                  </div>}
                                  {cert.id === "energy-star" && <div className="flex items-center mt-1">
                                      <img src="/lovable-uploads/4e1d3921-9d37-4dfa-85a3-8db2e13d50fb.png" alt="Energy Star Logo" className="h-12 w-auto" />
                                    </div>}
                                  {cert.id === "sask-energy-beyond-codes" && <div className="flex items-center mt-1">
                                      <img src="/lovable-uploads/d890e038-24fc-4885-a732-d0055f89ff2e.png" alt="SaskEnergy Logo" className="h-12 w-auto" />
                                   </div>}
                                  {cert.id === "solar-ready" && <div className="flex items-center mt-1">
                                     <img src="/lovable-uploads/solar-ready-sun-bw.png" alt="Solar Ready Sun Logo" className="h-12 w-auto" />
                                  </div>}
                                <div className="flex-1">
                                  <label htmlFor={cert.id} className="text-sm font-medium cursor-pointer">
                                    {cert.label}
                                  </label>
                                 <p className="text-xs text-muted-foreground mt-1">
                                   {cert.description}
                                 </p>
                                 <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/80 mt-1 inline-block">
                                   Learn more →
                                 </a>
                               </div>
                             </div>)}
                          </div>
                        </div>
                        
                        {/* Alert for certification interests */}
                         {selections.interestedCertifications.length > 0 && <WarningButton warningId="performance-modelling-required" title="Performance Modelling Required">
                              <div className="text-xs text-white space-y-2">
                                <p>
                                  Since you're interested in certifications, performance modelling (NBC 9.36.5 or 9.36.7) is required. 
                                  Performance modelling provides greater design flexibility, can reduce construction costs, and is often 
                                  required for certification programs. It also helps optimize your home's energy performance and ensures 
                                  you meet certification requirements efficiently.
                                </p>
                                <p className="font-medium">
                                  Please note: Additional fees may be incurred for performance modelling services. A detailed estimate will be provided upon request.
                                </p>
                                <p className="font-medium">
                                  Contact us to discuss how performance modelling can help achieve your certification goals.
                                </p>
                              </div>
                           </WarningButton>}
                      </div>}

                    {/* Submit Button for Performance Paths */}
                    {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <div className="pt-6 border-t space-y-4">
                        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <Checkbox id="agreement-performance" checked={agreementChecked} onCheckedChange={checked => setAgreementChecked(checked as boolean)} />
                          <label htmlFor="agreement-performance" className="text-sm text-foreground leading-relaxed cursor-pointer">
                             I agree to notify my energy advisor before making any changes to the design, including envelope components, windows, or mechanical systems, to ensure the energy model remains accurate and the project stays compliant during construction. Failure to communicate design changes may result in non-compliance, which could put the project at risk of not meeting energy code requirements or delaying occupancy approval. Design changes may also result in additional charges. I commit to ensuring that the final building plans align with both the energy model and the as-constructed building.
                          </label>
                        </div>
                        <div className="flex justify-center">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3" onClick={() => handleSubmitApplication('performance')} disabled={isSubmitting || !agreementChecked}>
                            {isSubmitting ? 'Submitting...' : searchParams.get('edit') ? 'Update Performance Path Application' : 'Submit Performance Path Application'}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-3">
                          Your application will be reviewed and energy modeling will begin within 1-2 business days.
                        </p>
                      </div>}

                    {/* Submit Button for Prescriptive Paths */}
                    {(selections.compliancePath === "9362" || selections.compliancePath === "9368") && <div className="pt-6 border-t space-y-4">
                        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <Checkbox id="agreement-prescriptive" checked={agreementChecked} onCheckedChange={checked => setAgreementChecked(checked as boolean)} />
                          <label htmlFor="agreement-prescriptive" className="text-sm text-foreground leading-relaxed cursor-pointer">
                             I agree to notify the Authority Having Jurisdiction if any changes to the design occur, including envelope components, windows, or mechanical systems, to ensure the energy plan remains accurate and the project stays compliant during construction. Failure to communicate design changes may result in non-compliance, which could put the project at risk of not meeting energy code requirements or delaying occupancy approval. I commit to ensuring that the final building plans align with both the energy building permit application and the as-constructed building.
                          </label>
                        </div>
                        <div className="flex justify-center">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3" onClick={() => handleSubmitApplication('prescriptive')} disabled={isSubmitting || !agreementChecked}>
                            {isSubmitting ? 'Submitting...' : searchParams.get('edit') ? 'Update Prescriptive Path Application' : 'Submit Prescriptive Path Application'}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-3">
                          Your application will be reviewed within 1-2 business days.
                        </p>
                       </div>}
                  </CardContent>
                </Card>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {selections.compliancePath === "9362" ? (/* Base Prescriptive Path Results */
          <Card className="bg-gradient-to-br from-slate-800/60 to-teal-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-center">Base Prescriptive Path Compliance</CardTitle>
                      
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-md backdrop-blur-sm">
                    <p className="text-sm font-medium text-white mb-1">
                      ✅ Base Prescriptive Path Compliance
                    </p>
                    <p className="text-xs text-slate-200">
                      Following {selections.province === "alberta" ? "NBC2020AE" : "NBC2020"} 9.36.2 - 9.36.4 requirements for minimum building energy performance compliance
                    </p>
                  </div>

                  {/* Building Envelope Specifications */}
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selections.ceilingsAtticRSI && (() => {
                    const option = atticRSIOptions.find(opt => opt.value === selections.ceilingsAtticRSI);
                    return <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                            <span className="text-sm font-medium text-white">Attic/Ceiling (RSI):</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{selections.ceilingsAtticRSI}</div>
                              {option && <div className="text-xs text-slate-300">{option.points} pts</div>}
                            </div>
                          </div>;
                  })()}
                      {selections.wallRSI && (() => {
                    const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
                    const options = isZone7B ? wallRSIOptions_7B : wallRSIOptions;
                    const option = options.find(opt => opt.value === selections.wallRSI);
                    return <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                            <span className="text-sm font-medium text-white">Wall (RSI):</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{selections.wallRSI}</div>
                              {option && <div className="text-xs text-slate-300">{option.points} pts</div>}
                            </div>
                          </div>;
                  })()}
                      {selections.belowGradeRSI && selections.belowGradeRSI !== "n/a" && (() => {
                    const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
                    const options = isZone7B ? belowGradeRSIOptions_7B : belowGradeRSIOptions;
                    const option = options.find(opt => opt.value === selections.belowGradeRSI);
                    return <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                            <span className="text-sm font-medium text-white">Below Grade Walls (RSI):</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{selections.belowGradeRSI}</div>
                              {option && <div className="text-xs text-slate-300">{option.points} pts</div>}
                            </div>
                          </div>;
                  })()}
                      {selections.floorsUnheatedRSI && <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                          <span className="text-sm font-medium text-white">Floors Over Unheated Spaces:</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white">{selections.floorsUnheatedRSI}</div>
                          </div>
                        </div>}
                      {selections.windowUValue && (() => {
                    const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
                    const options = isZone7B ? windowUValueOptions_7B : windowUValueOptions;
                    const option = options.find(opt => opt.value === selections.windowUValue);
                    return <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                            <span className="text-sm font-medium text-white">Window U-Value:</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{selections.windowUValue}</div>
                              {option && <div className="text-xs text-slate-300">{option.points} pts</div>}
                            </div>
                          </div>;
                  })()}
                      {selections.slabOnGradeIntegralFootingRSI && selections.slabOnGradeIntegralFootingRSI !== "n/a" && <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 rounded-lg backdrop-blur-sm">
                          <span className="text-sm font-medium text-white">Slab on Grade:</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white">{selections.slabOnGradeIntegralFootingRSI}</div>
                          </div>
                        </div>}
                    </div>
                    <div className="text-right text-sm text-slate-300 mt-2">
                      
                    </div>
                  </div>

                  {/* Cost Information */}
                  <div className="border-t pt-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4 text-white text-center">Cost Estimate</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-slate-700/40 to-teal-700/40 border border-slate-400/50 p-4 rounded-lg backdrop-blur-sm px-[10px]">
                        <div className="text-2xl font-bold text-white">
                          ${calculatePrescriptiveCost().toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-200">
                          Cost to Meet Prescriptive Path Requirements
                        </div>
                      </div>
                       <div className="bg-gradient-to-r from-teal-700/40 to-slate-700/40 border border-teal-400/50 p-4 rounded-lg backdrop-blur-sm px-[10px]">
                         <div className="text-2xl font-bold text-white">
                          ${calculatePerformanceCost().toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-200">
                          Cost to Meet Performance Path Requirements
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <h4 className="text-lg font-bold text-white">Cost Estimate Disclaimer</h4>
                      <p className="text-sm text-white">
                        These estimates are based on a 2,000 sq ft home in Lloydminster and are intended as a general guide. Actual costs may vary depending on your project's location, builder pricing, and site-specific conditions.
                      </p>
                      <p className="text-sm text-white">
                        The figures reflect minimum code compliance for both prescriptive and performance pathways. Keep in mind, the performance path allows more flexibility, which can affect costs.
                      </p>
                       <p className="text-sm text-white">
                         More information about the cost savings analysis can be found <a href="https://solinvictusenergyservices.com/energy-hack" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-200 font-medium">here</a>.
                       </p>
                    </div>
                    
                      {calculateCostSavings() > 0 && <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-[#e3e3f1]">
                        <div className="text-center mb-2">
                          <div className="text-lg font-semibold text-blue-800 mb-2">
                            Potential Savings with Performance Path:
                          </div>
                          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                            ${calculateCostSavings().toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 text-center">
                          Consider the Performance Path for significant cost savings while maintaining compliance.
                        </p>
                      </div>}
                  </div>
                </CardContent>
              </Card>) : null}
          </div>
        </div>
      </div>
      
      {/* Project Summary Form */}
      {showProjectSummary && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Prescriptive Path Compliance Report' : selections.compliancePath === '9365' || selections.compliancePath === '9367' ? 'Performance Path Energy Model Report' : 'Project Summary'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowProjectSummary(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ProjectSummaryForm calculatorData={{
            // Original user input data
            firstName: selections.firstName,
            lastName: selections.lastName,
            company: selections.company,
            phoneNumber: selections.phoneNumber,
            province: selections.province,
            occupancyClass: selections.occupancyClass,
            buildingAddress: selections.buildingAddress,
            frontDoorOrientation: selections.compliancePath === "9365" || selections.compliancePath === "9367" ? selections.frontDoorOrientation : "",
            energuidePathway: selections.energuidePathway,
            // Original envelope values as strings (not parsed)
            ceilingsAtticRSI: selections.ceilingsAtticRSI,
            wallRSI: selections.wallRSI,
            floorsUnheatedRSI: selections.floorsUnheatedRSI,
            floorsGarageRSI: selections.floorsGarageRSI,
            heatedFloorsRSI: selections.heatedFloorsRSI,
            slabOnGradeRSI: selections.slabOnGradeRSI,
            slabOnGradeIntegralFootingRSI: selections.slabOnGradeIntegralFootingRSI,
            floorsOverUnheatedSpacesRSI: selections.floorsOverUnheatedSpacesRSI,
            belowGradeRSI: selections.belowGradeRSI || selections.foundationWallsRSI,
            windowUValue: selections.windowUValue,
            skylightUValue: selections.skylightUValue,
            // Processed data for calculations
            projectName: `${selections.firstName} ${selections.lastName} - ${selections.buildingAddress}`,
            buildingType: selections.buildingType,
            location: selections.buildingAddress,
            floorArea: parseFloat(selections.buildingVolume) || 0,
            selectedPathway: selections.compliancePath === '9362' ? 'prescriptive' : selections.compliancePath === '9368' ? 'prescriptive' : 'performance',
            // Building Envelope Data - works for all pathways
            atticPoints: getPoints("atticRSI", selections.atticRSI || selections.ceilingsAtticRSI),
            wallRsi: parseFloat(selections.wallRSI) || 0,
            wallPoints: getPoints("wallRSI", selections.wallRSI),
            belowGradeRsi: parseFloat(selections.belowGradeRSI || selections.foundationWallsRSI) || 0,
            belowGradePoints: getPoints("belowGradeRSI", selections.belowGradeRSI || selections.foundationWallsRSI),
            floorRsi: parseFloat(selections.floorsUnheatedRSI || selections.floorsOverUnheatedSpacesRSI) || 0,
            floorPoints: getPoints("floorsUnheatedRSI", selections.floorsUnheatedRSI || selections.floorsOverUnheatedSpacesRSI),
            windowPoints: getPoints("windowUValue", selections.windowUValue),
            // Mechanical Systems - works for all pathways
            heatingSystemType: selections.heatingType || '',
            heatingEfficiency: selections.compliancePath === '9367' ? '' : selections.heatingEfficiency || '',
            // For 9367, we use make/model instead
            heatingPoints: getPoints("heatingType", selections.heatingType),
            coolingSystemType: selections.coolingApplicable === 'yes' ? 'Central AC' : 'None',
            coolingEfficiency: parseFloat(selections.coolingEfficiency) || 0,
            coolingPoints: getPoints("coolingEfficiency", selections.coolingEfficiency),
            waterHeatingType: selections.waterHeater || selections.waterHeaterType || '',
            waterHeatingEfficiency: 0,
            // Would need calculation based on type
            waterHeatingPoints: getPoints("waterHeater", selections.waterHeater),
            hrvErvType: selections.hasHrv === 'with_hrv' ? selections.hrv || 'HRV' : 'None',
            hrvErvEfficiency: parseFloat(selections.hrvEfficiency) || 0,
            hrvErvPoints: getPoints("hrv", selections.hrv),
            hrvMakeModel: selections.hrvMakeModel || selections.hrvEfficiency || '',
            heatingMakeModel: selections.compliancePath as string === '9367' ? selections.heatingMakeModel || selections.heatingEfficiency || '' : '',
            // For 9367, check both make/model and efficiency fields
            waterHeatingMakeModel: selections.compliancePath as string === '9367' ? selections.waterHeaterMakeModel || selections.waterHeater || '' : '',
            // For 9367, use make/model field or water heater selection
            coolingMakeModel: selections.coolingMakeModel,
            // Additional requirements/features
            midConstructionBlowerDoorPlanned: selections.midConstructionBlowerDoorPlanned,
            hasDWHR: selections.hasDWHR,
            // Fix #6: Summary Capture Fix - Push File URLs to Summary  
            uploadedFiles: uploadedFiles.map(file => ({
              name: file.name,
              size: file.size,
              type: file.type,
              url: (file as any).url || '',
              path: (file as any).path || ''
            })),
            indirectTank: selections.indirectTank,
            indirectTankSize: selections.indirectTankSize,
            additionalInfo: selections.additionalInfo,
            interestedCertifications: selections.interestedCertifications,
            hasHrvErv9365: selections.hasHrvErv9365,
            hasInFloorHeat9365: selections.hasInFloorHeat9365,
            floorsSlabsSelected: selections.floorsSlabsSelected,
            // Building Performance - works for all pathways
            airtightnessAl: parseFloat(selections.airtightness || selections.customAirtightness) || 0,
            airtightnessPoints: getPoints("airtightness", selections.airtightness || selections.customAirtightness),
            buildingVolume: parseFloat(selections.buildingVolume) || 0,
            volumePoints: getPoints("buildingVolume", selections.buildingVolume),
            // Performance Path Specific Data
            annualEnergyConsumption: undefined,
            // Not captured in current form
            performanceComplianceResult: selections.compliancePath as string === '9367' ? 'Compliance determined by energy modeling' : undefined,
            // Compliance Results
            totalPoints: totalPoints,
            complianceStatus: 'submitted',
            // Changed to keep projects in progress until admin review
            upgradeCosts: 0 // This would need to be calculated based on selected upgrades
          }} editingProjectId={searchParams.get('edit') || undefined} onSave={() => setShowProjectSummary(false)} />
            </div>
          </div>
        </div>}
    </div>;
};
export default NBCCalculator;