import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
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
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import {
  NBCOption,
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
  upgradesData
} from "./NBCCalculator/constants/options";

import { validateRSI, validateRSI_9362 } from "./NBCCalculator/utils/validation";
import { getPathwayDisplayName, isSingleDetached } from "./NBCCalculator/utils/helpers";

import { useFileUploads } from "./NBCCalculator/hooks/useFileUploads";
import EditModeIndicator from "./NBCCalculator/sections/EditModeIndicator";
import InstructionsSection from "./NBCCalculator/sections/InstructionsSection";
import ContactSection from "./NBCCalculator/sections/ContactSection";
import ProjectSummaryModal from "./NBCCalculator/components/ProjectSummaryModal";
import FloatingPointsSummary from "./NBCCalculator/components/FloatingPointsSummary";
import ProjectInformationSection from "./NBCCalculator/sections/ProjectInformationSection";

import Prescriptive9362Section from "./NBCCalculator/sections/Prescriptive9362Section";
import Performance9365Section from "./NBCCalculator/sections/Performance9365Section";
import Performance9367Section from "./NBCCalculator/sections/Performance9367Section";
import Prescriptive9368Section from "./NBCCalculator/sections/Prescriptive9368Section";
import Prescriptive9368WithHrvSection from "./NBCCalculator/sections/Prescriptive9368WithHrvSection";
import HrvAdditionalInfoSection from "./NBCCalculator/sections/HrvAdditionalInfoSection";
import EnerGuidePathwaySection from "./NBCCalculator/sections/EnerGuidePathwaySection";

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
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
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
  const { uploadedFiles, setUploadedFiles, isUploading, uploadFile, removeFile } = useFileUploads(user);

  const [agreementChecked, setAgreementChecked] = useState(false);

  // Load project data if editing, or generate a new ID for a new project
  // 1. Define a função fora do useEffect
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
      toast({ title: "Draft Project Created", description: "You can now upload files." });
      return newId;
    } catch (error: any) {
      toast({ title: "Error Creating Project", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. useEffect só trata edição
  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId) {
      setProjectId(editProjectId);
      if (user) {
        loadProjectForEditing(editProjectId);
      }
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
            const isValid = fileMetadata && typeof fileMetadata === 'object' && fileMetadata.name && (fileMetadata.url || fileMetadata.path);
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
      // 1) Sessão atual
      const { data: sessionData } = await supabase.auth.getSession();

      // 2) Company name (usa form como fallback)
      let finalCompanyName = selections.company || "Your Company";

      if (sessionData.session) {
        try {
          // ✅ NOVO: consulta via SDK (substitui o fetch)
          const { data: companies, error: companiesError } = await supabase
            .from("companies")
            .select("company_name")
            .eq("user_id", user.id)
            .limit(1);

          if (!companiesError && companies?.[0]?.company_name) {
            finalCompanyName = companies[0].company_name;
          }
        } catch (companyError) {
          console.warn("Could not fetch company data:", companyError);
        }
      }

      // // Send confirmation email
      // const {
      //   data,
      //   error
      // } = await supabase.functions.invoke('send-confirmation-email', {
      //   body: {
      //     userEmail: user.email,
      //     companyName: finalCompanyName,
      //     compliancePath: selections.compliancePath,
      //     selections: selections
      //   }
      // });
      // if (error) {
      //   console.warn('Email sending failed:', error);
      //   // Don't block submission if email fails
      // }

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
        setAutoSaveTrigger(true);
        // For new submissions, show success and redirect
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully. Redirecting to dashboard..."
        });

        // // Redirect to dashboard after a short delay
        // setTimeout(() => {
        //   navigate('/dashboard');
        // }, 2000);
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
      <FloatingPointsSummary
        selections={selections}
        totalPoints={totalPoints}
        compliance={compliance}
        getPoints={getPoints}
        calculatePrescriptiveCost={calculatePrescriptiveCost}
        calculatePerformanceCost={calculatePerformanceCost}
        calculateCostSavings={calculateCostSavings}
      />
    </div>}

    {/* Edit Mode Indicator */}
    {searchParams.get('edit') && <EditModeIndicator />}

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
      <InstructionsSection />

      {/* Contact Section */}
      <ContactSection />

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
              <ProjectInformationSection
                selections={selections}
                setSelections={setSelections}
                uploadedFiles={uploadedFiles}
                onFileUploadRequest={handleFileUploadRequest}
                isUploading={isUploading}
                removeFile={removeFile}
                onPathwayChange={onPathwayChange}
                projectId={projectId}
              />

              {/* EnerGuide Rating System for Performance Paths */}
              {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && (
                <EnerGuidePathwaySection selections={selections} setSelections={setSelections} />
              )}

              {selections.compliancePath === "9362" && (
                <Prescriptive9362Section selections={selections} setSelections={setSelections} />
              )}

              {selections.compliancePath === "9368" && (
                <Prescriptive9368Section
                  selections={selections}
                  setSelections={setSelections}
                />
              )}

              {selections.hasHrv === "no_hrv" && <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Base Prescriptive Path ({selections.province === "alberta" ? "NBC2020AE" : "NBC2020"} 9.36.2 - 9.36.4)
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  You are now following the base path under {selections.province === "alberta" ? "NBC2020AE" : "NBC2020"} 9.36.2 - 9.36.4
                </p>
              </div>}

              {selections.hasHrv === "with_hrv" && selections.compliancePath === "9368" && (
                <Prescriptive9368WithHrvSection
                  selections={selections}
                  setSelections={setSelections}
                  WarningButton={WarningButton}
                />
              )}

              {selections.compliancePath === "9365" && (
                <Performance9365Section
                  selections={selections}
                  setSelections={setSelections}
                  handleFileUploadRequest={handleFileUploadRequest}
                  uploadedFiles={uploadedFiles}
                  removeFile={removeFile}
                />
              )}

              {selections.compliancePath === "9367" && (
                <Performance9367Section
                  selections={selections}
                  setSelections={setSelections}
                  handleFileUploadRequest={handleFileUploadRequest}
                  uploadedFiles={uploadedFiles}
                  removeFile={removeFile}
                />
              )}

              {/* HRV/ERV Section for 9367 moved to Additional Information section */}
              {selections.compliancePath && (
                <HrvAdditionalInfoSection
                  selections={selections}
                  setSelections={setSelections}
                  WarningButton={WarningButton}
                />
              )}

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
    {showProjectSummary && (
      <ProjectSummaryModal
        setShowProjectSummary={setShowProjectSummary}
        selections={selections}
        totalPoints={totalPoints}
        searchParams={searchParams}
        getPoints={getPoints}
        uploadedFiles={uploadedFiles}
        autoSave={autoSaveTrigger}
        projectId={projectId}
      />
    )}
  </div>;
};
export default NBCCalculator;