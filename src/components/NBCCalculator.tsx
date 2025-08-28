import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import { useNBCCalculator } from "@/hooks/useNBCCalculator";
import ResultsSidebar from "@/components/calculator/ResultsSidebar";
import InstructionsSection from "@/components/calculator/sections/InstructionsSection";
import ContactSection from "@/components/calculator/sections/ContactSection";
// Import section components when they are created
// import ProjectInfoSection from "./calculator/sections/ProjectInfoSection";
// ... other sections

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [expandedWarnings, setExpandedWarnings] = useState<{ [key: string]: boolean }>({});

  const { selections, setSelections, logic } = useNBCCalculator();

  // Load project data if editing
  useEffect(() => {
    const editProjectId = searchParams.get('edit');
    if (editProjectId && user) {
      loadProjectForEditing(editProjectId);
    }
  }, [searchParams, user]);

  const loadProjectForEditing = async (projectId: string) => {
    // ... (keep existing loadProjectForEditing logic)
  };

  const handleSubmitApplication = async (pathType: 'performance' | 'prescriptive') => {
    // ... (keep existing handleSubmitApplication logic)
  };

  // ... (keep other handlers like handleFileUpload, removeFile, etc.)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading project data...</div>
          <div className="text-muted-foreground">Please wait while we load your project for editing.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative" style={{
      backgroundImage: `url(${starryMountainsBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
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

        <div className="grid lg:grid-cols-5 gap-6">
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
                {/* TODO: Replace this with the new section components */}
                <p className="text-white text-center p-8">Calculator form sections will be placed here.</p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            {/* Results for non-9368 paths will go here */}
          </div>
        </div>
      </div>

      {showProjectSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          {/* ... (keep existing ProjectSummaryForm modal logic) */}
        </div>
      )}
    </div>
  );
};

export default NBCCalculator;