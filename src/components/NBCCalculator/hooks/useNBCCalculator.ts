import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Initial state for the NBC Calculator form
const initialSelections = {
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
};

// Custom hook for managing the main calculator state
export const useNBCCalculatorState = () => {
  const [selections, setSelections] = useState(initialSelections);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  return {
    selections,
    setSelections,
    isSubmitting,
    setIsSubmitting,
    showProjectSummary,
    setShowProjectSummary,
    isLoading,
    setIsLoading,
    agreementChecked,
    setAgreementChecked
  };
};

// Custom hook for managing project editing functionality
export const useProjectEditing = (selections: any, setSelections: any, setUploadedFiles: any) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const loadProjectForEditing = async (projectId: string) => {
    setIsLoading(true);
    console.log('Loading project for editing:', projectId);
    try {
      // Load project data using Supabase client
      const { data: project, error: projectError } = await supabase
        .from('project_summaries')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

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
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

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
        description: "Failed to load project data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load project data if editing
  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId && user) {
      loadProjectForEditing(editProjectId);
    }
  }, [searchParams, user]);

  return {
    isLoading,
    loadProjectForEditing
  };
};

// Custom hook for managing file uploads and file state
export const useFileManagement = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check authentication with proper error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        console.log('DEBUG: Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Create unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`;
        console.log('DEBUG: Generated file path:', fileName);

        // Upload to Supabase Storage
        console.log('DEBUG: Attempting upload to project-files bucket...');
        const { data, error } = await supabase.storage
          .from('project-files')
          .upload(fileName, file, {
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
        const { data: urlData } = supabase.storage
          .from('project-files')
          .getPublicUrl(fileName);
        console.log('DEBUG: Public URL data:', urlData);

        // Create a File object with additional metadata
        const uploadedFile = new File([file], file.name, { type: file.type });
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

  return {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    removeFile,
    handleFileUploaded
  };
};

// Custom hook for managing form submission
export const useFormSubmission = (selections: any) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);

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
      let finalCompanyName = selections.company || 'Your Company';
      if (user) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('company_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (companyError) {
          console.warn('Could not fetch company data:', companyError);
        } else if (companyData?.company_name) {
          finalCompanyName = companyData.company_name;
        }
      }

      // Send confirmation email
      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
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

  return {
    isSubmitting,
    setIsSubmitting,
    showProjectSummary,
    setShowProjectSummary,
    handleSubmitApplication
  };
};

// Custom hook for managing warning states
export const useWarningState = () => {
  const [expandedWarnings, setExpandedWarnings] = useState<{ [key: string]: boolean }>({});

  const toggleWarning = (warningId: string) => {
    setExpandedWarnings(prev => ({
      ...prev,
      [warningId]: !prev[warningId]
    }));
  };

  return {
    expandedWarnings,
    toggleWarning
  };
};

