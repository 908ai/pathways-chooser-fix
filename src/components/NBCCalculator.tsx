import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, AlertTriangle, Edit, Save, FileText, Zap, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";
import FloatingPointsSummary from "./NBCCalculator/components/FloatingPointsSummary";
import Stepper from "./NBCCalculator/components/Stepper";
import FileUploadSection from "./NBCCalculator/sections/FileUploadSection";
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
  waterHeaterOptions_7B,
} from "./NBCCalculator/constants/options";

import { useFileUploads } from "./NBCCalculator/hooks/useFileUploads";
import EditModeIndicator from "./NBCCalculator/sections/EditModeIndicator";
import ContactBanner from "./NBCCalculator/sections/ContactBanner";
import ProjectInformationSection from "./NBCCalculator/sections/ProjectInformationSection";
import CompliancePathSection from "./NBCCalculator/sections/CompliancePathSection";

import Prescriptive9362Section from "./NBCCalculator/sections/Prescriptive9362Section";
import Performance9365Section from "./NBCCalculator/sections/Performance9365Section";
import Performance9367Section from "./NBCCalculator/sections/Performance9367Section";
import Prescriptive9368Section from "./NBCCalculator/sections/Prescriptive9368Section";
import HrvAdditionalInfoSection from "./NBCCalculator/sections/HrvAdditionalInfoSection";
import EnerGuidePathwaySection from "./NBCCalculator/sections/EnerGuidePathwaySection";
import HelpDrawer from "@/components/HelpDrawer";
import { cn } from "@/lib/utils";
import { getPathwayDisplayName, normalizeProvince } from "./NBCCalculator/utils/helpers";
import { getPendingItems } from "@/lib/projectUtils";

const getStepForField = (fieldId: string) => {
  const step1Fields = ['firstName', 'lastName', 'company', 'phoneNumber', 'companyAddress', 'streetAddress', 'unitNumber', 'city', 'postalCode', 'buildingType', 'province', 'climateZone', 'occupancyClass'];
  const step2Fields = ['compliancePath', 'frontDoorOrientation'];
  const step4Fields = ['fileUploadSection'];

  if (step1Fields.includes(fieldId)) return 1;
  if (step2Fields.includes(fieldId)) return 2;
  if (step4Fields.includes(fieldId)) return 4;
  
  // Everything else is on step 3
  return 3;
};

const NBCCalculator = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Project Information", "Compliance Path", "Technical Specifications", "Documents & Submission"];
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [editingProjectStatus, setEditingProjectStatus] = useState<string | null>(null);

  const [selections, setSelections] = useState({
    firstName: "",
    lastName: "",
    company: "",
    companyAddress: "",
    streetAddress: "",
    unitNumber: "",
    city: "",
    postalCode: "",
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
    floorsSlabsSelected: [] as string[],
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
    hasDWHR: "",
    heatingType: "",
    heatingMakeModel: "",
    otherHeatingMakeModel: "",
    heatingEfficiency: "",
    otherHeatingEfficiency: "",
    hasSecondaryHeating: "",
    secondaryHeatingType: "",
    secondaryHeatingEfficiency: "",
    otherSecondaryHeatingEfficiency: "",
    secondaryIndirectTank: "",
    secondaryIndirectTankSize: "",
    hasMurbMultipleHeating: "",
    murbSecondHeatingType: "",
    murbSecondHeatingEfficiency: "",
    murbSecondIndirectTank: "",
    murbSecondIndirectTankSize: "",
    hasMurbMultipleWaterHeaters: "",
    murbSecondWaterHeaterType: "",
    murbSecondWaterHeater: "",
    indirectTank: "",
    indirectTankSize: "",
    coolingApplicable: "",
    coolingEfficiency: "",
    coolingMakeModel: "",
    hasF280Calculation: "",
    comments: "",
    interestedCertifications: [] as string[],
    wantsCertifications: "",
    midConstructionBlowerDoorPlanned: false,
    energuidePathway: ""
  });
  const { uploadedFiles, setUploadedFiles, isUploading, uploadFile, removeFile } = useFileUploads(user);

  const [agreementChecked, setAgreementChecked] = useState(false);

  const handleFixItem = (fieldId: string) => {
    const step = getStepForField(fieldId);
    setCurrentStep(step);
    setShowProjectSummary(false);
    
    // Use a timeout to allow React to re-render the correct step's components
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect for better UX
        element.classList.add('ring-2', 'ring-offset-2', 'ring-yellow-400', 'transition-all', 'duration-300', 'rounded-md');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-offset-2', 'ring-yellow-400', 'rounded-md');
        }, 2500);
      } else {
        console.warn(`Element with id "${fieldId}" not found on step ${step}.`);
      }
    }, 150); // Increased timeout slightly to be safer
  };

  useEffect(() => {
    const showHelp = searchParams.get('showHelp');
    const editProjectId = searchParams.get('edit');
    if (showHelp === 'true' && !editProjectId) {
      setIsHelpDrawerOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth >= 1024) {
          setIsSticky(!entry.isIntersecting);
        } else {
          setIsSticky(false);
        }
      },
      { rootMargin: "0px" }
    );

    observer.observe(sentinel);

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSticky(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const ensureProjectExists = async (): Promise<string | null> => {
    if (projectId) return projectId;
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a project.", variant: "destructive" });
      return null;
    }

    setIsLoading(true);
    try {
      const newProjectName = `Draft Project - ${new Date().toLocaleString()}`;
      const { data, error } = await supabase
        .from('project_summaries')
        .insert({
          user_id: user.id,
          project_name: newProjectName,
          compliance_status: 'draft'
        })
        .select('id')
        .single();

      if (error) throw error;

      const newId = data.id;
      setProjectId(newId);

      // Log the project creation event
      const { error: eventError } = await supabase.from('project_events').insert({
        project_id: newId,
        user_id: user.id,
        event_type: 'project_created',
      });

      if (eventError) {
        console.error('Error logging project creation event:', eventError);
        // Non-critical, so we don't throw. The user can still proceed.
      }

      toast({ title: "Draft Project Created", description: "You can now upload files." });
      return newId;
    } catch (error: any) {
      toast({ title: "Error Creating Project", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId) {
      setProjectId(editProjectId);
      if (user) {
        loadProjectForEditing(editProjectId);
      }
    }
  }, [searchParams, user]);

  useEffect(() => {
    const focusField = searchParams.get('focus');
    // Only run this if we are NOT loading a project and there is a field to focus on.
    if (focusField && !isLoading) {
      handleFixItem(focusField);
    }
  }, [searchParams, isLoading]); // Add isLoading as a dependency

  useEffect(() => {
    // Clear validation errors as user fills them out
    if (Object.keys(validationErrors).length > 0) {
      const newErrors = { ...validationErrors };
      let changed = false;
      (Object.keys(validationErrors) as Array<keyof typeof validationErrors>).forEach((key) => {
        if (selections[key as keyof typeof selections]) {
          delete newErrors[key];
          changed = true;
        }
      });
      if (changed) {
        setValidationErrors(newErrors);
      }
    }
  }, [selections, validationErrors]);

  const loadProjectForEditing = async (projectId: string) => {
    setIsLoading(true);
    try {
      const {
        data: project,
        error: projectError
      } = await supabase.from('project_summaries').select('*').eq('id', projectId).maybeSingle();
      if (projectError) {
        throw new Error(`Failed to load project: ${projectError.message}`);
      }
      if (!project) {
        throw new Error('Project not found');
      }
      const p = project as any; // Cast to any to access new properties
      setEditingProjectName(p.project_name);
      setEditingProjectStatus(p.compliance_status);

      const {
        data: companyData,
        error: companyError
      } = await supabase.from('companies').select('*').eq('user_id', user?.id).maybeSingle();
      if (companyError && companyError.code !== 'PGRST116') {
        console.error('Error loading company data:', companyError);
      }

      if (p) {
        const namePart = p.project_name?.split(' - ')[0] || "";
        const nameParts = namePart.split(' ');
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(' ') || "";
        
        let loadedCompliancePath = p.selected_pathway || "";
        if (loadedCompliancePath === 'performance') {
          loadedCompliancePath = '9365'; // Default for old data
        } else if (loadedCompliancePath === 'prescriptive') {
          loadedCompliancePath = '9362'; // Default for old data
        }

        const newSelections = {
          firstName: firstName || companyData?.company_name?.split(' ')[0] || "",
          lastName: lastName || companyData?.company_name?.split(' ').slice(1).join(' ') || "",
          company: companyData?.company_name || "",
          companyAddress: companyData?.address || "",
          streetAddress: p.street_address || p.location || "",
          unitNumber: p.unit_number || "",
          city: p.city || "",
          postalCode: p.postal_code || "",
          buildingType: p.building_type || "",
          phoneNumber: companyData?.phone || "",
          province: p.province || "",
          frontDoorOrientation: p.front_door_orientation || "",
          climateZone: p.climate_zone || "",
          occupancyClass: p.occupancy_class || "",
          compliancePath: loadedCompliancePath,
          isVolumeOver380: p.building_volume && p.building_volume > 380 ? "yes" : "no",
          buildingVolume: p.building_volume && p.building_volume !== 0 ? p.building_volume.toString() : "",
          ceilingsAtticRSI: p.attic_rsi && p.attic_rsi !== 0 ? p.attic_rsi.toString() : "",
          ceilingsAtticOtherType: p.ceilings_attic_other_type || "",
          hasCathedralOrFlatRoof: p.has_cathedral_or_flat_roof || "",
          cathedralFlatRSI: p.cathedral_flat_rsi ? String(p.cathedral_flat_rsi) : "",
          cathedralFlatRSIValue: p.cathedral_flat_rsi ? String(p.cathedral_flat_rsi) : "",
          cathedralFlatOtherType: p.cathedral_flat_other_type || "",
          wallRSI: p.wall_rsi && p.wall_rsi !== 0 ? p.wall_rsi.toString() : "",
          floorsUnheatedRSI: p.floor_rsi && p.floor_rsi !== 0 ? p.floor_rsi.toString() : "",
          floorsGarageRSI: p.floors_garage_rsi ? String(p.floors_garage_rsi) : "",
          hasSkylights: p.has_skylights || "",
          skylightUValue: p.skylight_u_value || "",
          hasSlabOnGrade: p.slab_on_grade_rsi ? "yes" : "no",
          hasSlabIntegralFooting: p.slab_on_grade_integral_footing_rsi ? "yes" : "no",
          slabInsulation: p.slab_insulation_type || "",
          slabInsulationValue: p.slab_insulation_value ? String(p.slab_insulation_value) : "",
          hasInFloorHeat: p.has_in_floor_heat ? "yes" : "no",
          hasInFloorHeat9365: p.has_in_floor_heat || "",
          floorsSlabsSelected: p.floors_slabs_selected || [],
          inFloorHeatRSI: p.in_floor_heat_rsi ? String(p.in_floor_heat_rsi) : "",
          foundationWallsRSI: "",
          slabOnGradeRSI: p.slab_on_grade_rsi ? String(p.slab_on_grade_rsi) : "",
          slabOnGradeIntegralFootingRSI: p.slab_on_grade_integral_footing_rsi ? String(p.slab_on_grade_integral_footing_rsi) : "",
          floorsOverUnheatedSpacesRSI: p.floor_rsi ? String(p.floor_rsi) : "",
          unheatedFloorBelowFrostRSI: p.unheated_floor_below_frost_rsi || "",
          unheatedFloorAboveFrostRSI: p.unheated_floor_above_frost_rsi ? String(p.unheated_floor_above_frost_rsi) : "",
          heatedFloorsRSI: p.heated_floors_rsi ? String(p.heated_floors_rsi) : "",
          windowUValue: p.window_u_value && p.window_u_value !== 0 ? p.window_u_value.toString() : "",
          belowGradeRSI: p.below_grade_rsi && p.below_grade_rsi !== 0 ? p.below_grade_rsi.toString() : "",
          airtightness: p.airtightness_al && p.airtightness_al !== 0 ? p.airtightness_al.toString() : "",
          customAirtightness: "",
          atticRSI: p.attic_rsi && p.attic_rsi !== 0 ? p.attic_rsi.toString() : "",
          hasHrv: p.hrv_erv_type && p.hrv_erv_type !== 'None' ? "with_hrv" : "without_hrv",
          hrv: p.hrv_erv_efficiency && p.hrv_erv_efficiency !== 0 ? p.hrv_erv_efficiency.toString() : "",
          hasHrvErv9365: p.hrv_erv_type && p.hrv_erv_type !== 'None' ? "with_hrv" : "without_hrv",
          hrvMakeModel: p.hrv_make_model || "",
          hrvEfficiency: p.hrv_erv_efficiency && p.hrv_erv_efficiency !== 0 ? p.hrv_erv_efficiency.toString() : "",
          hasSecondaryHrv: p.has_secondary_hrv || "",
          secondaryHrvEfficiency: p.secondary_hrv_efficiency || "",
          waterHeater: p.water_heating_type || "",
          waterHeaterMakeModel: p.water_heater_make_model || "",
          waterHeaterType: p.water_heating_type || "",
          otherWaterHeaterType: p.other_water_heater_type || "",
          hasSecondaryWaterHeater: p.has_secondary_water_heater || "",
          secondaryWaterHeaterSameAsMain: p.secondary_water_heater_same_as_main || "",
          secondaryWaterHeater: p.secondary_water_heater || "",
          secondaryWaterHeaterType: p.secondary_water_heater_type || "",
          hasDWHR: p.has_dwhr || "",
          heatingType: p.heating_system_type || "",
          heatingMakeModel: p.heating_make_model || "",
          otherHeatingMakeModel: p.other_heating_make_model || "",
          heatingEfficiency: p.heating_efficiency ? p.heating_efficiency.toString() : "",
          otherHeatingEfficiency: p.other_heating_efficiency || "",
          hasSecondaryHeating: p.has_secondary_heating || "",
          secondaryHeatingType: p.secondary_heating_system_type || "",
          secondaryHeatingEfficiency: p.secondary_heating_efficiency || "",
          otherSecondaryHeatingEfficiency: p.other_secondary_heating_efficiency || "",
          secondaryIndirectTank: p.secondary_indirect_tank || "",
          secondaryIndirectTankSize: p.secondary_indirect_tank_size || "",
          hasMurbMultipleHeating: p.has_murb_multiple_heating ? 'yes' : '',
          murbSecondHeatingType: p.murb_second_heating_type || "",
          murbSecondHeatingEfficiency: p.murb_second_heating_efficiency || "",
          murbSecondIndirectTank: p.murb_second_indirect_tank || "",
          murbSecondIndirectTankSize: p.murb_second_indirect_tank_size || "",
          hasMurbMultipleWaterHeaters: p.has_murb_multiple_water_heaters ? 'yes' : '',
          murbSecondWaterHeaterType: p.murb_second_water_heater_type || "",
          murbSecondWaterHeater: p.murb_second_water_heater || "",
          indirectTank: p.indirect_tank || "",
          indirectTankSize: p.indirect_tank_size || "",
          coolingApplicable: p.cooling_system_type && p.cooling_system_type !== "" ? "yes" : "no",
          coolingEfficiency: p.cooling_efficiency && p.cooling_efficiency !== 0 ? p.cooling_efficiency.toString() : "",
          coolingMakeModel: p.cooling_make_model || "",
          hasF280Calculation: p.has_f280_calculation || "",
          comments: p.comments || "",
          interestedCertifications: p.interested_certifications || [],
          wantsCertifications: p.wants_certifications || "",
          midConstructionBlowerDoorPlanned: p.mid_construction_blower_door_planned || false,
          energuidePathway: p.energuide_pathway || ""
        };
        setSelections(newSelections);

        if (p.uploaded_files && Array.isArray(p.uploaded_files) && p.uploaded_files.length > 0) {
          const validFileMetadata = p.uploaded_files.filter((fileMetadata: any) =>
            fileMetadata && typeof fileMetadata === 'object' && fileMetadata.name && (fileMetadata.url || fileMetadata.path)
          );
          if (validFileMetadata.length > 0) {
            const restoredFiles = validFileMetadata.map((fileMetadata: any) => {
              try {
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
                  url: fileMetadata.url,
                  path: fileMetadata.path
                } as File & {
                  url?: string;
                  path?: string;
                };
                return restoredFile;
              } catch (error) {
                return null;
              }
            }).filter(file => file !== null) as File[];
            setUploadedFiles(restoredFiles);
          }
        } else {
          setUploadedFiles([]);
        }
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

  const toggleWarning = (warningId: string) => {
    setExpandedWarnings(prev => ({
      ...prev,
      [warningId]: !prev[warningId]
    }));
  };

  const handleSubmitApplication = async (pathType: "performance" | "prescriptive") => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      setShowProjectSummary(true);
      const isEditing = searchParams.get('edit');
      if (isEditing) {
        toast({
          title: "Ready for Review",
          description: "Please review your project summary below."
        });
      } else {
        setAutoSaveTrigger(true);
        const description = pathType === 'performance'
          ? "Your application has been submitted successfully. Your project will be reviewed and energy modeling will begin within 1-2 business days."
          : "Your application has been submitted successfully. Your application will be reviewed within 1-2 business days.";
        toast({
          title: "Application Submitted!",
          description: description
        });
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

  const handleFileUploadRequest = async (file: File) => {
    const currentProjectId = await ensureProjectExists();
    if (currentProjectId) {
      await uploadFile(file, currentProjectId);
    }
  };

  const handleSaveDraft = async (isIncrementalSave = false) => {
    if (!user) {
      if (!isIncrementalSave) {
        toast({ title: "Authentication Error", description: "You must be logged in to save a draft.", variant: "destructive" });
      }
      return;
    }

    setIsSavingDraft(true);

    try {
      const currentProjectId = projectId || await ensureProjectExists();
      if (!currentProjectId) {
        throw new Error("Could not create or find a project to save.");
      }
      
      const draftData = {
        project_name: selections.streetAddress ? `${selections.firstName} ${selections.lastName} - ${selections.streetAddress}, ${selections.city}` : editingProjectName || `Draft Project - ${new Date().toLocaleString()}`,
        building_type: selections.buildingType,
        street_address: selections.streetAddress,
        unit_number: selections.unitNumber,
        city: selections.city,
        postal_code: selections.postalCode,
        province: selections.province,
        climate_zone: selections.climateZone,
        occupancy_class: selections.occupancyClass,
        location: [selections.streetAddress, selections.city, selections.province].filter(Boolean).join(', '),
        selected_pathway: selections.compliancePath,
        attic_rsi: parseFloat(selections.ceilingsAtticRSI) || null,
        wall_rsi: parseFloat(selections.wallRSI) || null,
        below_grade_rsi: parseFloat(selections.belowGradeRSI || selections.foundationWallsRSI) || null,
        floor_rsi: parseFloat(selections.floorsUnheatedRSI || selections.floorsOverUnheatedSpacesRSI) || null,
        window_u_value: parseFloat(selections.windowUValue) || null,
        heating_system_type: selections.heatingType,
        heating_efficiency: selections.heatingEfficiency ? String(selections.heatingEfficiency) : null,
        cooling_system_type: selections.coolingApplicable === 'yes' ? 'Central AC' : 'None',
        cooling_efficiency: parseFloat(selections.coolingEfficiency) || null,
        water_heating_type: selections.waterHeater || selections.waterHeaterType,
        hrv_erv_type: selections.hasHrv === 'with_hrv' ? selections.hrv || 'HRV' : 'None',
        hrv_erv_efficiency: parseFloat(selections.hrvEfficiency) || null,
        airtightness_al: parseFloat(selections.airtightness || selections.customAirtightness) || null,
        building_volume: parseFloat(selections.buildingVolume) || null,
        compliance_status: (editingProjectStatus === 'needs_revision' || editingProjectStatus === 'update_allowed') ? editingProjectStatus : 'draft',
        total_points: totalPoints,
        interested_certifications: selections.interestedCertifications,
        wants_certifications: selections.wantsCertifications,
        mid_construction_blower_door_planned: selections.midConstructionBlowerDoorPlanned,
      };

      const { error } = await supabase
        .from('project_summaries')
        .update(draftData)
        .eq('id', currentProjectId);

      if (error) throw error;

      if (isIncrementalSave) {
        toast({ title: "Progress Saved", description: "Your changes have been saved." });
      } else {
        toast({ title: "Draft Saved", description: "Your progress has been saved successfully." });
      }

    } catch (error: any) {
      console.error("Error saving draft:", error);
      if (!isIncrementalSave) {
        toast({ title: "Save Failed", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsSavingDraft(false);
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

  const getPoints = (category: string, value: string): number => {
    if (category === "buildingVolume") {
      if (selections.isVolumeOver380 === "yes") return 0;
      const option = buildingVolumeOptions.find(opt => opt.value === value);
      return option?.points || 0;
    }

    const getOptionsForCategory = (cat: string) => {
      const isZone7B = selections.province === "alberta" && selections.climateZone === "7B";
      switch (cat) {
        case "wallRSI":
          return isZone7B ? wallRSIOptions_7B : wallRSIOptions;
        case "windowUValue":
          return isZone7B ? windowUValueOptions_7B : windowUValueOptions;
        case "belowGradeRSI":
          return isZone7B ? belowGradeRSIOptions_7B : belowGradeRSIOptions;
        case "airtightness":
          return isZone7B ? airtightnessOptions_7B : airtightnessOptions;
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
      if (category === 'waterHeater' && selections.heatingType === 'boiler' && selections.indirectTank === 'yes') {
        return total;
      }
      if (typeof value === 'boolean') {
        return total;
      }
      if (Array.isArray(value)) {
        return total + value.reduce((subTotal, item) => subTotal + getPoints(category, item), 0);
      }
      return total + getPoints(category, value);
    }
    return total;
  }, 0);

  const calculatePrescriptiveCost = () => {
    const tier = getTierCompliance();
    if (tier.tier === "Tier 2") {
      return 13550;
    }
    return 6888;
  };
  const calculatePerformanceCost = () => {
    const tier = getTierCompliance();
    if (tier.tier === "Tier 2") {
      return 8150;
    }
    return 1718;
  };
  const calculateCostSavings = () => {
    const prescriptiveCost = calculatePrescriptiveCost();
    const performanceCost = calculatePerformanceCost();
    return prescriptiveCost - performanceCost;
  };
  const getTierCompliance = () => {
    if (selections.hasHrv === "no_hrv") {
      return {
        tier: "Not Applicable",
        status: "destructive",
        description: "Prescriptive path requires HRV/ERV"
      };
    }
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
    return {
      tier: "Tier 1",
      status: "warning",
      description: "Baseline compliance (0 points required)"
    };
  };
  const compliance = getTierCompliance();

  const scrollToTop = () => {
    formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep1 = () => {
    const { firstName, lastName, company, phoneNumber, streetAddress, city, postalCode, buildingType, province, climateZone, companyAddress } = selections;
    const errors: Record<string, boolean> = {};

    if (!firstName) errors.firstName = true;
    if (!lastName) errors.lastName = true;
    if (!company) errors.company = true;
    if (!companyAddress) errors.companyAddress = true;
    if (!phoneNumber) errors.phoneNumber = true;
    if (!streetAddress) errors.streetAddress = true;
    if (!city) errors.city = true;
    if (!postalCode) errors.postalCode = true;
    if (!buildingType) errors.buildingType = true;
    if (!province) errors.province = true;
    if (province === 'alberta' && !climateZone) errors.climateZone = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({ title: "Missing Information", description: "Please fill out all required fields in this step.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { compliancePath } = selections;
    if (!compliancePath) {
      toast({ title: "Missing Information", description: "Please select a compliance path to continue.", variant: "destructive" });
      setValidationErrors({ compliancePath: true });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errors: Record<string, boolean> = {};
    const { compliancePath } = selections;

    if (compliancePath === '9362') {
      const requiredFields: (keyof typeof selections)[] = [
        'hasHrv', 'ceilingsAtticRSI', 'hasCathedralOrFlatRoof', 'wallRSI',
        'belowGradeRSI', 'floorsSlabsSelected', 'windowUValue', 'hasSkylights',
        'airtightness', 'heatingType', 'coolingApplicable', 'hasDWHR'
      ];

      requiredFields.forEach(field => {
        const value = selections[field];
        if (Array.isArray(value) && value.length === 0) {
          errors[field] = true;
        } else if (value === '' || value === null || value === undefined) {
          errors[field] = true;
        }
      });

      if (selections.hasHrv === 'with_hrv' && !selections.hrvEfficiency) errors.hrvEfficiency = true;
      if (selections.hasCathedralOrFlatRoof === 'yes' && !selections.cathedralFlatRSIValue) errors.cathedralFlatRSIValue = true;
      if (selections.hasSkylights === 'yes' && !selections.skylightUValue) errors.skylightUValue = true;
      if (selections.heatingType && !selections.heatingEfficiency) errors.heatingEfficiency = true;
      
      if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
        if (!selections.waterHeaterType) errors.waterHeaterType = true;
        if (selections.waterHeaterType && selections.waterHeaterType !== 'boiler' && !selections.waterHeater) {
          errors.waterHeater = true;
        }
        if (selections.waterHeaterType === 'other' && !selections.otherWaterHeaterType) errors.otherWaterHeaterType = true;
      }
      
      if (selections.floorsSlabsSelected.includes("heatedFloors") && !selections.inFloorHeatRSI) errors.inFloorHeatRSI = true;
      if (selections.floorsSlabsSelected.includes("slabOnGradeIntegralFooting") && !selections.slabOnGradeIntegralFootingRSI) errors.slabOnGradeIntegralFootingRSI = true;
      if (selections.floorsSlabsSelected.includes("floorsOverUnheatedSpaces") && !selections.floorsOverUnheatedSpacesRSI) errors.floorsOverUnheatedSpacesRSI = true;
      if (selections.floorsSlabsSelected.includes("unheatedBelowFrost") && !selections.unheatedFloorBelowFrostRSI) errors.unheatedFloorBelowFrostRSI = true;
      if (selections.floorsSlabsSelected.includes("unheatedAboveFrost") && !selections.unheatedFloorAboveFrostRSI) errors.unheatedFloorAboveFrostRSI = true;
      if (selections.heatingType === 'boiler' && !selections.indirectTank) errors.indirectTank = true;
      if (selections.heatingType === 'boiler' && selections.indirectTank === 'yes' && !selections.indirectTankSize) errors.indirectTankSize = true;
      if (selections.coolingApplicable === 'yes' && !selections.coolingEfficiency) errors.coolingEfficiency = true;

      if (selections.buildingType === "single-detached-secondary" || selections.buildingType === "multi-unit") {
        if (selections.hasHrv === 'with_hrv' && !selections.hasSecondaryHrv) errors.hasSecondaryHrv = true;
        if (selections.hasHrv === 'with_hrv' && selections.hasSecondaryHrv === 'yes' && !selections.secondaryHrvEfficiency) errors.secondaryHrvEfficiency = true;
        if (!selections.hasSecondaryHeating) errors.hasSecondaryHeating = true;
        if (selections.hasSecondaryHeating === 'yes') {
            if (!selections.secondaryHeatingType) errors.secondaryHeatingType = true;
            if (selections.secondaryHeatingType && !selections.secondaryHeatingEfficiency) errors.secondaryHeatingEfficiency = true;
            if (selections.secondaryHeatingType === 'boiler') {
                if (!selections.secondaryIndirectTank) errors.secondaryIndirectTank = true;
                if (selections.secondaryIndirectTank === 'yes' && !selections.secondaryIndirectTankSize) errors.secondaryIndirectTankSize = true;
            }
        }
        if (!selections.hasSecondaryWaterHeater) errors.hasSecondaryWaterHeater = true;
        if (selections.hasSecondaryWaterHeater === 'yes') {
            if (!selections.secondaryWaterHeaterSameAsMain) errors.secondaryWaterHeaterSameAsMain = true;
            if (selections.secondaryWaterHeaterSameAsMain === 'no') {
                if (!selections.secondaryWaterHeaterType) errors.secondaryWaterHeaterType = true;
                if (selections.secondaryWaterHeaterType && !selections.secondaryWaterHeater) errors.secondaryWaterHeater = true;
            }
        }
      }
    }

    if (compliancePath === '9368') {
      const requiredFields: (keyof typeof selections)[] = [
        'ceilingsAtticRSI', 'wallRSI', 'belowGradeRSI', 'windowUValue',
        'airtightness', 'hrvEfficiency'
      ];

      if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
        requiredFields.push('waterHeater');
      }

      if (selections.buildingType === "multi-unit") {
        requiredFields.push('hasMurbMultipleHeating');
        if (selections.hasMurbMultipleHeating === 'yes') {
          requiredFields.push('murbSecondHeatingType');
          if (selections.murbSecondHeatingType) {
            requiredFields.push('murbSecondHeatingEfficiency');
            if (selections.murbSecondHeatingType === 'boiler') {
              requiredFields.push('murbSecondIndirectTank');
              if (selections.murbSecondIndirectTank === 'yes') {
                requiredFields.push('murbSecondIndirectTankSize');
              }
            }
          }
        }

        if (!(selections.heatingType === 'boiler' && selections.indirectTank === 'yes')) {
            requiredFields.push('hasMurbMultipleWaterHeaters');
            if (selections.hasMurbMultipleWaterHeaters === 'yes') {
                requiredFields.push('murbSecondWaterHeaterType');
                if (selections.murbSecondWaterHeaterType) {
                    requiredFields.push('murbSecondWaterHeater');
                }
            }
        }
      }

      requiredFields.forEach(field => {
        const value = selections[field];
        if (value === '' || value === null || value === undefined) {
          errors[field] = true;
        }
      });
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.log("Validation failed. Missing fields:", Object.keys(errors));
      toast({ title: "Missing Information", description: "Please fill out all required fields in this step.", variant: "destructive" });
      return { isValid: false, errors };
    }

    return { isValid: true, errors: {} };
  };

  const nextStep = async () => {
    let validationResult = { isValid: true, errors: {} as Record<string, boolean> };
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep === 2) {
      if (!validateStep2()) return;
    }
    if (currentStep === 3) {
      validationResult = validateStep3();
      if (!validationResult.isValid) {
        // Scroll to first error
        const fieldOrder: (keyof typeof selections)[] = [
          'hasHrv', 'hrvEfficiency', 'hasSecondaryHrv', 'secondaryHrvEfficiency',
          'ceilingsAtticRSI', 'hasCathedralOrFlatRoof', 'cathedralFlatRSIValue',
          'wallRSI', 'belowGradeRSI', 'floorsSlabsSelected', 'windowUValue',
          'hasSkylights', 'skylightUValue', 'airtightness', 'midConstructionBlowerDoorPlanned',
          'heatingType', 'heatingEfficiency', 'coolingApplicable', 'waterHeaterType',
          'waterHeater', 'hasDWHR', 'hasSecondaryHeating', 'secondaryHeatingType', 'secondaryHeatingEfficiency',
          'secondaryIndirectTank', 'secondaryIndirectTankSize', 'hasSecondaryWaterHeater', 'secondaryWaterHeaterSameAsMain',
          'secondaryWaterHeaterType', 'secondaryWaterHeater'
        ];
        
        const firstErrorKey = fieldOrder.find(key => validationResult.errors[key]);

        if (firstErrorKey) {
          const element = document.getElementById(firstErrorKey);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    const isEditing = !!searchParams.get('edit');
    if (isEditing) {
      await handleSaveDraft(true);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      if (step === 1) {
        setCurrentStep(1);
        scrollToTop();
        return;
      }
      if (step > 1 && validateStep1()) {
        setCurrentStep(step);
        scrollToTop();
      }
    }
  };

  const { required: pendingItems, optional: optionalPendingItems } = getPendingItems(selections, uploadedFiles);

  const showSaveDraftButton = !editingProjectStatus || (editingProjectStatus !== 'pass' && editingProjectStatus !== 'fail' && editingProjectStatus !== 'Compliant' && editingProjectStatus !== 'submitted');

  if (isLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Loading project data...</div>
        <div className="text-muted-foreground">Please wait while we load your project for editing.</div>
      </div>
    </div>;
  }

  return (
    <div className="relative">
      <div ref={sentinelRef} className="absolute top-0 h-px" />
      <HelpDrawer open={isHelpDrawerOpen} onOpenChange={setIsHelpDrawerOpen} />
     
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        isSticky={isSticky}
        projectName={
          editingProjectName ||
          (selections.streetAddress
            ? `${selections.firstName} ${selections.lastName} – ${selections.streetAddress}, ${selections.city} ${normalizeProvince(selections.province)} `
            : "New Project")
        }
        compliancePath={selections.compliancePath}
        isEditing={!!searchParams.get('edit')}
        buildingType={selections.buildingType}
        climateZone={selections.climateZone}
      />

      <div className="relative flex justify-center">
        <div className={cn(
          "relative transition-all duration-300 w-full",
          selections.compliancePath === "9368" ? "lg:max-w-3xl" : "max-w-4xl"
        )}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calculator className="h-8 w-8 text-muted-foreground" />
              <h1 className="text-4xl font-bold text-foreground">NBC 9.36 Energy Code Pathways Selector</h1>
            </div>
            <p className="text-xl text-muted-foreground font-medium mb-4">(Alberta & Saskatchewan)</p>
            <p className="text-muted-foreground text-lg">
              National Building Code of Canada - Energy Performance Compliance Tool
            </p>
          </div>

          <Card ref={formContainerRef} className="w-full">
            <CardContent className="p-6 space-y-6">

              <ContactBanner />
              {currentStep === 1 && (
                <ProjectInformationSection
                  selections={selections}
                  setSelections={setSelections}
                  validationErrors={validationErrors}
                />
              )}

              {currentStep === 2 && (
                <CompliancePathSection
                  selections={selections}
                  setSelections={setSelections}
                />
              )}

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center gap-2">
                      {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? (
                        <FileText className="h-6 w-6 text-orange-500" />
                      ) : (
                        <Zap className="h-6 w-6 text-blue-500" />
                      )}
                      {getPathwayDisplayName(selections.compliancePath)}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Specify minimum required values for prescriptive compliance' : 'Enter proposed building specifications for energy modeling'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {(selections.compliancePath === "9365" ||
                      selections.compliancePath === "9367") && (
                        <EnerGuidePathwaySection
                          selections={selections}
                          setSelections={setSelections}
                        />
                      )}
                    {selections.compliancePath === "9362" && <Prescriptive9362Section selections={selections} setSelections={setSelections} validationErrors={validationErrors} />}
                    {selections.compliancePath === "9368" && <Prescriptive9368Section 
                      selections={selections} 
                      setSelections={setSelections} 
                      validationErrors={validationErrors}
                      handleFileUploadRequest={handleFileUploadRequest}
                      uploadedFiles={uploadedFiles}
                      removeFile={removeFile}
                    />}
                    {selections.compliancePath === "9365" && <Performance9365Section selections={selections} setSelections={setSelections} handleFileUploadRequest={handleFileUploadRequest} uploadedFiles={uploadedFiles} removeFile={removeFile} />}
                    {selections.compliancePath === "9367" && <Performance9367Section selections={selections} setSelections={setSelections} handleFileUploadRequest={handleFileUploadRequest} uploadedFiles={uploadedFiles} removeFile={removeFile} />}
                    {selections.compliancePath && (
                      <HrvAdditionalInfoSection
                        selections={selections}
                        setSelections={setSelections}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      Documents & Submission
                    </CardTitle>
                    <CardDescription>
                      Upload supporting documents and submit your application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div id="fileUploadSection">
                      <FileUploadSection
                        uploadedFiles={uploadedFiles}
                        onFileUploadRequest={handleFileUploadRequest}
                        isUploading={isUploading}
                        removeFile={removeFile}
                      />
                    </div>

                    {/* Results for Performance & Prescriptive Paths */}
                    {(selections.compliancePath === "9362" || selections.compliancePath === "9365" || selections.compliancePath === "9367") && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Compliance Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-sm text-slate-500 uppercase tracking-wider">Compliance Status</p>
                              <p className="text-2xl font-bold text-orange-500">TBD</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 uppercase tracking-wider">Upgrade Costs</p>
                              <p className="text-2xl font-bold text-purple-500">$0</p>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                              <span className="font-bold">Review Timeline:</span> A review will take place within 1-2 days.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Results for 9368 */}
                    {selections.compliancePath === "9368" && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Compliance Results</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center py-8">
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm text-slate-500 uppercase tracking-wider">Total Points</p>
                              <p className="text-7xl font-bold text-purple-500">{totalPoints.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 uppercase tracking-wider">Compliance Tier</p>
                              <p className={`text-5xl font-bold ${compliance.status === "success" ? "text-green-600" : compliance.status === "warning" ? "text-yellow-500" : "text-red-600"}`}>{compliance.tier}</p>
                              <p className="text-sm text-slate-500 mt-1">{compliance.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Submit section — conditional on path */}
                    <div className="pt-6 border-t space-y-4">
                      {selections.compliancePath === "9365" ||
                        selections.compliancePath === "9367" ? (
                        <>
                          {/* Performance Path */}
                          <div className="flex items-start space-x-3 p-4 bg-slate-50 border rounded-lg">
                            <Checkbox
                              id="agreement-performance"
                              checked={agreementChecked}
                              onCheckedChange={(checked) =>
                                setAgreementChecked(checked as boolean)
                              }
                              className={`
                                mt-0.5 h-5 w-5
                                border-2 border-slate-400
                                transition-all duration-200

                                ${!agreementChecked ? 'animate-soft-pulse' : ''}

                                data-[state=checked]:bg-green-600
                                data-[state=checked]:border-green-600
                                data-[state=checked]:text-white
                                data-[state=checked]:shadow-[0_0_0_3px_rgba(34,197,94,0.45)]
                              `}
                            />                            
                            <label
                              htmlFor="agreement-performance"
                              className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                            >
                              I agree to notify my energy advisor before making any changes to
                              the design, including envelope components, windows, or
                              mechanical systems, to ensure the energy model remains accurate
                              and the project stays compliant during construction. Failure to
                              communicate design changes may result in non-compliance, which
                              could put the project at risk of not meeting energy code
                              requirements or delaying occupancy approval. Design changes may
                              also result in additional charges. I commit to ensuring that the
                              final building plans align with both the energy model and the
                              as-constructed building.
                            </label>
                          </div>

                          <div className="flex justify-center">
                            <Button
                              size="lg"
                              className="font-semibold px-8 py-3"
                              onClick={() => handleSubmitApplication("performance")}
                              disabled={isSubmitting || !agreementChecked}
                            >
                              {isSubmitting
                                ? "Submitting..."
                                : searchParams.get("edit")
                                  ? "Update Performance Path Application"
                                  : "Submit Performance Path Application"}
                            </Button>
                          </div>

                          <p className="text-sm text-slate-500 text-center mt-3">
                            Your application will be reviewed and energy modeling will begin
                            within 1-2 business days.
                          </p>
                        </>
                      ) : (
                        <>
                          {/* Prescriptive Path */}
                          <div className="flex items-start space-x-3 p-4 bg-slate-50 border rounded-lg">
                            <Checkbox
                              id="agreement-prescriptive"
                              checked={agreementChecked}
                              onCheckedChange={(checked) =>
                                setAgreementChecked(checked as boolean)
                              }
                              className={`
                                mt-0.5 h-5 w-5
                                border-2 border-slate-400
                                transition-all duration-200

                                ${!agreementChecked ? 'animate-soft-pulse' : ''}

                                data-[state=checked]:bg-green-600
                                data-[state=checked]:border-green-600
                                data-[state=checked]:text-white
                                data-[state=checked]:shadow-[0_0_0_3px_rgba(34,197,94,0.45)]
                              `}
                            />
                            <label
                              htmlFor="agreement-prescriptive"
                              className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                            >
                              I agree to notify the Authority Having Jurisdiction if any
                              changes to the design occur, including envelope components,
                              windows, or mechanical systems, to ensure the energy plan
                              remains accurate and the project stays compliant during
                              construction. Failure to communicate design changes may result
                              in non-compliance, which could put the project at risk of not
                              meeting energy code requirements or delaying occupancy approval.
                              I commit to ensuring that the final building plans align with
                              both the energy building permit application and the
                              as-constructed building.
                            </label>
                          </div>

                          <div className="flex justify-center">
                            <Button
                              size="lg"
                              className="font-semibold px-8 py-3"
                              onClick={() => handleSubmitApplication("prescriptive")}
                              disabled={isSubmitting || !agreementChecked}
                            >
                              {isSubmitting
                                ? "Submitting..."
                                : searchParams.get("edit")
                                  ? "Update Prescriptive Path Application"
                                  : "Submit Prescriptive Path Application"}
                            </Button>
                          </div>

                          <p className="text-sm text-slate-500 text-center mt-3">
                            Your application will be reviewed within 1-2 business days.
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center gap-4 mt-8">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                )}
                {showSaveDraftButton && (
                  <Button variant="secondary" onClick={() => handleSaveDraft(false)} disabled={isSavingDraft}>
                    {isSavingDraft ? 'Saving...' : 'Save Draft'}
                  </Button>
                )}
                {currentStep < steps.length && (
                  <Button onClick={nextStep}>Next</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {selections.compliancePath === "9368" && (
          <div className="hidden lg:block fixed top-24 right-4 w-80">
            <FloatingPointsSummary
              selections={selections}
              totalPoints={totalPoints}
              compliance={compliance}
              getPoints={getPoints}
              calculatePrescriptiveCost={calculatePrescriptiveCost}
              calculatePerformanceCost={calculatePerformanceCost}
              calculateCostSavings={calculateCostSavings}
            />
          </div>
        )}
      </div>

      {showProjectSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Project Summary & Submission
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowProjectSummary(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ProjectSummaryForm
                selections={selections}
                uploadedFiles={uploadedFiles}
                autoSave={autoSaveTrigger}
                editingProjectId={projectId || undefined}
                onSave={() => setShowProjectSummary(false)}
                requiredPendingItems={pendingItems}
                optionalPendingItems={optionalPendingItems}
                onFixItem={handleFixItem}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NBCCalculator;