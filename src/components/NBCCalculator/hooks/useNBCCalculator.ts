import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Define and export the main state shape for the calculator
export interface Selections {
  [key: string]: any;
  compliancePath: string;
  buildingType: string;
  province: string;
  buildingAddress: string;
  comments: string;
  atticRSI: string;
  wallRSI: string;
  belowGradeRSI: string;
  windowUValue: string;
  heatingType: string;
  waterHeater: string;
  hasHrv: string;
  hrvEfficiency: string;
  airtightness: string;
}

const initialSelections: Selections = {
  compliancePath: '9368',
  buildingType: 'new-construction',
  province: 'BC',
  buildingAddress: '',
  comments: '',
  atticRSI: '',
  wallRSI: '',
  belowGradeRSI: '',
  windowUValue: '',
  heatingType: '',
  waterHeater: '',
  hasHrv: 'yes_hrv',
  hrvEfficiency: '',
  airtightness: '',
};

// Hook for core calculator state
export const useNBCCalculatorState = () => {
  const [selections, setSelections] = useState<Selections>(initialSelections);
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
    setAgreementChecked,
  };
};

// Hook for managing file uploads
export const useFileManagement = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUploaded = (fileData: { url: string; file: File }) => {
    setUploadedFiles(prevFiles => [...prevFiles, fileData.file]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  return { uploadedFiles, setUploadedFiles, removeFile, handleFileUploaded };
};

// Hook for handling project editing logic
export const useProjectEditing = (
  selections: Selections,
  setSelections: React.Dispatch<React.SetStateAction<Selections>>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>
) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const projectId = searchParams.get('edit');

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      // Simulate fetching project data
      console.log(`Fetching data for project ${projectId}...`);
      setTimeout(() => {
        // Dummy data for demonstration
        const fetchedData = {
          ...initialSelections,
          buildingAddress: '123 Editing St, Calgary',
          province: 'AB',
        };
        setSelections(fetchedData);
        setUploadedFiles([]); // Reset files for the loaded project
        setIsLoading(false);
      }, 1000);
    }
  }, [projectId, setSelections, setUploadedFiles]);

  return { isLoading };
};

// Hook for form submission logic
export const useFormSubmission = (selections: Selections) => {
  const handleSubmitApplication = (pathway: 'prescriptive' | 'performance') => {
    console.log(`Submitting for ${pathway} path with selections:`, selections);
    // Submission logic would go here
  };

  return { handleSubmitApplication };
};

// Hook for managing warning/info section visibility
export const useWarningState = () => {
  const [expandedWarnings, setExpandedWarnings] = useState<Record<string, boolean>>({});
  const toggleWarning = (id: string) => {
    setExpandedWarnings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return { expandedWarnings, toggleWarning };
};