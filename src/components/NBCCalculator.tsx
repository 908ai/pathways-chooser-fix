import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calculator, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import { useNBCCalculator } from "@/hooks/useNBCCalculator";
import { Selections } from "./calculator/types";
import ResultsSidebar from "@/components/calculator/ResultsSidebar";
import InstructionsSection from "@/components/calculator/sections/InstructionsSection";
import ContactSection from "@/components/calculator/sections/ContactSection";
import ProjectInfoSection from "@/components/calculator/sections/ProjectInfoSection";
import CompliancePathSection from "@/components/calculator/sections/CompliancePathSection";
import BuildingEnvelopeSection from "@/components/calculator/sections/BuildingEnvelopeSection";
import MechanicalSystemsSection from "@/components/calculator/sections/MechanicalSystemsSection";
import SubmissionSection from "@/components/calculator/sections/SubmissionSection";

interface NBCCalculatorProps {
  onPathwayChange?: (pathwayInfo: string) => void;
}

const NBCCalculator = ({ onPathwayChange }: NBCCalculatorProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [expandedWarnings, setExpandedWarnings] = useState<{ [key: string]: boolean }>({});

  const { selections, setSelections, logic } = useNBCCalculator();

  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId && user) {
      loadProjectForEditing(editProjectId);
    }
  }, [searchParams, user]);

  const loadProjectForEditing = async (projectId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_summaries')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      
      // Convert DB data to form state
      const loadedSelections: Partial<Selections> = {
        // map all fields...
      };
      setSelections(prev => ({ ...prev, ...loadedSelections }));
      if (data.uploaded_files && Array.isArray(data.uploaded_files)) {
        setUploadedFiles(data.uploaded_files);
      }

    } catch (error) {
      console.error("Error loading project for editing:", error);
      toast({ title: "Error", description: "Failed to load project data.", variant: "destructive" });
      navigate('/calculator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Selections, value: any) => {
    setSelections(prev => ({ ...prev, [field]: value }));
    if (field === 'compliancePath' && onPathwayChange) {
        const pathwayMap: { [key: string]: string } = {
            '9362': 'Prescriptive', '9368': 'Prescriptive',
            '9365': 'Performance', '9367': 'Performance',
        };
        onPathwayChange(pathwayMap[value] || '');
    }
  };
  
  const handleFileUploaded = (file: any) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleSubmitApplication = async (pathType: 'performance' | 'prescriptive') => {
    setIsSubmitting(true);
    // Combine selections and uploaded files for submission
    const submissionData = {
      ...selections,
      selectedPathway: pathType,
      uploadedFiles: uploadedFiles,
      complianceStatus: 'submitted',
    };
    
    // Logic to save to Supabase...
    console.log("Submitting application:", submissionData);
    
    // For now, just show the summary form
    setShowProjectSummary(true);
    
    // In a real scenario, you would save and then maybe show a success message
    // and navigate away.
    // setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
      <ResultsSidebar logic={logic} compliancePath={selections.compliancePath} />

      {searchParams.get('edit') && (
        <div className="mb-4 p-4 bg-gradient-to-r from-slate-600/20 to-teal-600/20 backdrop-blur-md border border-slate-400/50 rounded-xl relative z-10">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-slate-300" />
            <div>
              <div className="font-medium text-slate-100">Editing Project</div>
              <div className="text-sm text-slate-200">Make your changes and resubmit to update the project.</div>
            </div>
          </div>
        </div>
      )}

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

        <InstructionsSection />
        <ContactSection />
        
        <ProjectInfoSection selections={selections} handleInputChange={handleInputChange} />
        <CompliancePathSection selections={selections} handleInputChange={handleInputChange} />

        {selections.compliancePath && (
          <>
            <BuildingEnvelopeSection 
              selections={selections} 
              handleInputChange={handleInputChange} 
              logic={logic}
              expandedWarnings={expandedWarnings}
              setExpandedWarnings={setExpandedWarnings}
            />
            <MechanicalSystemsSection 
              selections={selections} 
              handleInputChange={handleInputChange} 
            />
            <SubmissionSection
              selections={selections}
              handleInputChange={handleInputChange}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              handleSubmitApplication={handleSubmitApplication}
              isSubmitting={isSubmitting}
              uploadedFiles={uploadedFiles}
              onFileUploaded={handleFileUploaded}
            />
          </>
        )}
      </div>

      {showProjectSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in-50">
           <ProjectSummaryForm 
             calculatorData={{...selections, uploadedFiles}} 
             onSave={() => {
               setShowProjectSummary(false);
               navigate('/dashboard');
             }}
             editingProjectId={searchParams.get('edit') || undefined}
           />
        </div>
      )}
    </div>
  );
};

export default NBCCalculator;