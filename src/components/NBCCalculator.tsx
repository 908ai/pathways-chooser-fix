import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, AlertTriangle, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectSummaryModal from "./NBCCalculator/components/ProjectSummaryModal";
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
import ContactSection from "./NBCCalculator/sections/ContactSection";
import ProjectInformationSection from "./NBCCalculator/sections/ProjectInformationSection";

import Prescriptive9362Section from "./NBCCalculator/sections/Prescriptive9362Section";
import Performance9365Section from "./NBCCalculator/sections/Performance9365Section";
import Performance9367Section from "./NBCCalculator/sections/Performance9367Section";
import Prescriptive9368Section from "./NBCCalculator/sections/Prescriptive9368Section";
import Prescriptive9368WithHrvSection from "./NBCCalculator/sections/Prescriptive9368WithHrvSection";
import HrvAdditionalInfoSection from "./NBCCalculator/sections/HrvAdditionalInfoSection";
import EnerGuidePathwaySection from "./NBCCalculator/sections/EnerGuidePathwaySection";
import HelpDrawer from "@/components/HelpDrawer";

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
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Project Information", "Technical Specifications", "Documents & Submission"];
  const formContainerRef = useRef<HTMLDivElement>(null);

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
    interestedCertifications: [] as string[],
    midConstructionBlowerDoorPlanned: false,
    energuidePathway: ""
  });
  const { uploadedFiles, setUploadedFiles, isUploading, uploadFile, removeFile } = useFileUploads(user);

  const [agreementChecked, setAgreementChecked] = useState(false);

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

      const {
        data: companyData,
        error: companyError
      } = await supabase.from('companies').select('*').eq('user_id', user?.id).maybeSingle();
      if (companyError && companyError.code !== 'PGRST116') {
        console.error('Error loading company data:', companyError);
      }
      
      if (project) {
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
        setSelections(newSelections);

        if (project.uploaded_files && Array.isArray(project.uploaded_files) && project.uploaded_files.length > 0) {
          const validFileMetadata = project.uploaded_files.filter((fileMetadata: any) => 
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
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully. Redirecting to dashboard..."
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
    const { firstName, lastName, company, phoneNumber, buildingAddress, buildingType, province, compliancePath, climateZone } = selections;
    if (!firstName || !lastName || !company || !phoneNumber || !buildingAddress || !buildingType || !province || !compliancePath) {
        toast({ title: "Missing Information", description: "Please fill out all required fields in this step.", variant: "destructive" });
        return false;
    }
    if (province === 'alberta' && !climateZone) {
        toast({ title: "Missing Information", description: "Please select a Climate Zone for Alberta.", variant: "destructive" });
        return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
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
      setCurrentStep(step);
      scrollToTop();
    }
  };

  if (isLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">Loading project data...</div>
        <div className="text-muted-foreground">Please wait while we load your project for editing.</div>
      </div>
    </div>;
  }

  return <div className="min-h-screen p-4 relative">
    <HelpDrawer />

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

    {searchParams.get('edit') && <EditModeIndicator />}

    <div ref={formContainerRef} className={`mx-auto space-y-6 relative z-10 transition-all duration-300 ${selections.compliancePath === "9368" ? "max-w-3xl mr-80" : "max-w-4xl"}`}>
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

      <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

      {currentStep === 1 && (
        <ProjectInformationSection
          selections={selections}
          setSelections={setSelections}
          onPathwayChange={onPathwayChange}
        />
      )}

      {currentStep === 2 && (
        <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Prescriptive Building Requirements' : 'Performance Building Specifications'}
            </CardTitle>
            <CardDescription className="text-slate-200">
              {selections.compliancePath === '9362' || selections.compliancePath === '9368' ? 'Specify minimum required values for prescriptive compliance' : 'Enter proposed building specifications for energy modeling'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {selections.compliancePath === "9362" && <Prescriptive9362Section selections={selections} setSelections={setSelections} />}
            {selections.compliancePath === "9368" && <Prescriptive9368Section selections={selections} setSelections={setSelections} />}
            {selections.hasHrv === "with_hrv" && selections.compliancePath === "9368" && <Prescriptive9368WithHrvSection selections={selections} setSelections={setSelections} WarningButton={WarningButton} />}
            {selections.compliancePath === "9365" && <Performance9365Section selections={selections} setSelections={setSelections} handleFileUploadRequest={handleFileUploadRequest} uploadedFiles={uploadedFiles} removeFile={removeFile} />}
            {selections.compliancePath === "9367" && <Performance9367Section selections={selections} setSelections={setSelections} handleFileUploadRequest={handleFileUploadRequest} uploadedFiles={uploadedFiles} removeFile={removeFile} />}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Documents & Submission</CardTitle>
            <CardDescription className="text-slate-200">Upload supporting documents and submit your application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FileUploadSection
              uploadedFiles={uploadedFiles}
              onFileUploadRequest={handleFileUploadRequest}
              isUploading={isUploading}
              removeFile={removeFile}
            />
            {(selections.compliancePath === "9365" || selections.compliancePath === "9367") && <EnerGuidePathwaySection selections={selections} setSelections={setSelections} />}
            {selections.compliancePath && <HrvAdditionalInfoSection selections={selections} setSelections={setSelections} WarningButton={WarningButton} />}
            
            <div className="pt-6 border-t border-slate-600 space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <Checkbox id="agreement" checked={agreementChecked} onCheckedChange={checked => setAgreementChecked(checked as boolean)} />
                <label htmlFor="agreement" className="text-sm text-slate-300 leading-relaxed cursor-pointer">
                  I agree to notify my energy advisor or the Authority Having Jurisdiction (AHJ) before making any changes to the design, including envelope components, windows, or mechanical systems, to ensure the project remains compliant. I understand that design changes may result in additional charges and that failure to communicate changes could risk non-compliance or occupancy delays.
                </label>
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3" onClick={() => handleSubmitApplication(selections.compliancePath.startsWith('9362') || selections.compliancePath.startsWith('9368') ? 'prescriptive' : 'performance')} disabled={isSubmitting || !agreementChecked}>
                  {isSubmitting ? 'Submitting...' : searchParams.get('edit') ? 'Update Application' : 'Submit Application'}
                </Button>
              </div>
              <p className="text-sm text-slate-400 text-center mt-3">
                Your application will be reviewed within 1-2 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>Back</Button>
        ) : (
          <div />
        )}
        {currentStep < steps.length && (
          <Button onClick={nextStep}>Next</Button>
        )}
      </div>

      <ContactSection />
    </div>

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