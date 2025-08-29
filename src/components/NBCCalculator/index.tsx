import React from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProjectSummaryForm from "@/components/ProjectSummaryForm";
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

// Import custom hooks
import {
  useNBCCalculatorState,
  useProjectEditing,
  useFileManagement,
  useFormSubmission,
  useWarningState
} from './hooks/useNBCCalculator';

// Import helper functions
import {
  getPoints,
  getTierCompliance,
  calculatePrescriptiveCost,
  calculatePerformanceCost,
  calculateCostSavings
} from './utils/helpers';

// Import UI components
import {
  HeaderSection,
  InstructionsSection,
  ContactSection,
  EditModeIndicator,
  ComplianceSidebar,
  ProjectInformationSection
} from './components';

interface NBCCalculatorProps {
  onPathwayChange?: (pathwayInfo: string) => void;
}

const NBCCalculator = ({ onPathwayChange }: NBCCalculatorProps = {}) => {
  const [searchParams] = useSearchParams();

  // Use custom hooks for state management
  const {
    selections,
    setSelections,
    isSubmitting,
    showProjectSummary,
    setShowProjectSummary,
    isLoading,
    agreementChecked,
    setAgreementChecked
  } = useNBCCalculatorState();

  // Use custom hooks for file management
  const {
    uploadedFiles,
    setUploadedFiles,
    removeFile,
    handleFileUploaded
  } = useFileManagement();

  // Use custom hooks for project editing
  const { isLoading: isEditLoading } = useProjectEditing(selections, setSelections, setUploadedFiles);

  // Use custom hooks for form submission
  const { handleSubmitApplication } = useFormSubmission(selections);

  // Use custom hooks for warning state
  const { expandedWarnings, toggleWarning } = useWarningState();

  // Calculate derived values
  const totalPoints = Object.entries(selections).reduce((total, [category, value]) => {
    if (value) {
      if (category === 'waterHeater' && selections.heatingType === 'boiler' && selections.indirectTank === 'yes') {
        return total;
      }
      if (typeof value === 'boolean') {
        return total;
      }
      if (Array.isArray(value)) {
        return total + value.reduce((subTotal, item) => subTotal + getPoints(category, item, selections), 0);
      }
      return total + getPoints(category, value as string, selections);
    }
    return total;
  }, 0);

  const compliance = getTierCompliance(totalPoints, selections);
  const isEditMode = !!searchParams.get('edit');

  const getPathwayDisplayName = (pathway: string) => {
    if (pathway === '9362' || pathway === '9368') return 'Prescriptive';
    if (pathway === '9365' || pathway === '9367') return 'Performance';
    return 'Building Specifications';
  };

  // Show project summary form if requested
  if (showProjectSummary) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${starryMountainsBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-teal-900/80 backdrop-blur-sm"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <ProjectSummaryForm
            calculatorData={{ ...selections, uploadedFiles }}
            onSave={() => setShowProjectSummary(false)}
            editingProjectId={searchParams.get('edit') || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${starryMountainsBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-teal-900/80 backdrop-blur-sm"></div>

      {(isLoading || isEditLoading) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading project data...</span>
            </div>
          </div>
        </div>
      )}

      <ComplianceSidebar
        selections={selections}
        totalPoints={totalPoints}
        compliance={compliance}
        getPoints={(category: string, value: string) => getPoints(category, value, selections)}
        calculatePrescriptiveCost={() => calculatePrescriptiveCost(compliance)}
        calculatePerformanceCost={() => calculatePerformanceCost(compliance)}
        calculateCostSavings={() => calculateCostSavings(compliance)}
      />

      <EditModeIndicator isEditMode={isEditMode} />

      <div className={`mx-auto space-y-6 relative z-10 transition-all duration-300 ${
        selections.compliancePath === "9368" ? "max-w-3xl mr-80" : "max-w-4xl"
      }`}>

        <HeaderSection isEditMode={isEditMode} />
        <InstructionsSection expandedWarnings={expandedWarnings} toggleWarning={toggleWarning} />
        <ContactSection />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {getPathwayDisplayName(selections.compliancePath)} Building Requirements
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Specify minimum required values for compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">

                <ProjectInformationSection
                  selections={selections}
                  setSelections={setSelections}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  handleFileUploaded={handleFileUploaded}
                  removeFile={removeFile}
                  getPathwayDisplayName={getPathwayDisplayName}
                />

                {/* Restored form sections will be added here */}

                <Card className="bg-gradient-to-r from-slate-700/40 to-teal-700/40 border-slate-400/50 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreement"
                          checked={agreementChecked}
                          onCheckedChange={(checked) => setAgreementChecked(checked === true)}
                          className="mt-1"
                        />
                        <label htmlFor="agreement" className="text-sm text-slate-200 leading-relaxed">
                          I acknowledge that this application is for energy code compliance consultation and
                          that final compliance determination rests with the local building authority.
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          onClick={() => handleSubmitApplication('prescriptive')}
                          disabled={!agreementChecked || isSubmitting}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit for Prescriptive Path Review'}
                        </Button>

                        <Button
                          onClick={() => handleSubmitApplication('performance')}
                          disabled={!agreementChecked || isSubmitting}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit for Performance Path Review'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NBCCalculator;