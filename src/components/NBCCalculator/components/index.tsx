import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileManager, FileItem } from "@/components/ui/file-manager";
import { Selections } from '../hooks/useNBCCalculator';
import { COMPLIANCE_PATH_OPTIONS, BUILDING_TYPE_OPTIONS, PROVINCE_OPTIONS } from '../data/constants';

// Define Prop Types for each component
type SelectionsSetter = React.Dispatch<React.SetStateAction<Selections>>;

interface ProjectInformationSectionProps {
  selections: Selections;
  setSelections: SelectionsSetter;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  handleFileUploaded: (fileData: { url: string; file: File }) => void;
  removeFile: (fileName: string) => void;
  getPathwayDisplayName: (pathway: string) => string;
}

interface HeaderSectionProps {
  isEditMode: boolean;
}

interface InstructionsSectionProps {
  expandedWarnings: Record<string, boolean>;
  toggleWarning: (id: string) => void;
}

// --- UI Components ---

export const HeaderSection: React.FC<HeaderSectionProps> = ({ isEditMode }) => (
  <div className="text-center pt-8 pb-4">
    <h1 className="text-4xl font-bold text-white tracking-tight">
      {isEditMode ? 'Edit Project' : 'NBC 9.36 Energy Compliance Calculator'}
    </h1>
    <p className="text-slate-300 mt-2">
      {isEditMode ? 'Update your project details and resubmit.' : 'Determine your building\'s compliance tier.'}
    </p>
  </div>
);

export const InstructionsSection: React.FC<InstructionsSectionProps> = ({ expandedWarnings, toggleWarning }) => (
  <Card className="bg-slate-800/60 border-slate-400/30 text-slate-200">
    <CardHeader>
      <CardTitle>Instructions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>Select your compliance path and enter the required building information.</p>
      <p>The calculator will determine your compliance tier based on the points system.</p>
    </CardContent>
  </Card>
);

export const ContactSection: React.FC = () => (
  <Card className="bg-slate-800/60 border-slate-400/30 text-slate-200">
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent>
      <p>For questions or assistance, please contact us at <a href="mailto:support@example.com" className="text-blue-400 hover:underline">support@example.com</a>.</p>
    </CardContent>
  </Card>
);

export const EditModeIndicator: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  if (!isEditMode) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full shadow-lg z-50">
      <p className="font-semibold">Editing Project</p>
    </div>
  );
};

export const ComplianceSidebar: React.FC<any> = ({
  selections,
  totalPoints,
  compliance,
  getPoints,
  calculatePrescriptiveCost,
  calculatePerformanceCost,
  calculateCostSavings,
}) => {
  if (selections.compliancePath !== "9368") return null;
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-slate-900/80 backdrop-blur-sm p-6 shadow-2xl z-20 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Compliance Summary</h2>
      <div className="space-y-4 text-slate-300">
        <div>
          <p className="font-semibold text-white">Total Points: {totalPoints}</p>
          <p className="font-semibold text-white">Compliance Tier: <span className={`font-bold ${compliance.tier.startsWith('Tier') ? 'text-green-400' : 'text-red-400'}`}>{compliance.tier}</span></p>
        </div>
        {/* Other sidebar content */}
      </div>
    </div>
  );
};

export const ProjectInformationSection: React.FC<ProjectInformationSectionProps> = ({
  selections,
  setSelections,
  uploadedFiles,
  setUploadedFiles,
  handleFileUploaded,
  getPathwayDisplayName,
}) => {
  const handleSelectionChange = (key: keyof Selections, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const fileItems: FileItem[] = uploadedFiles.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    lastModified: file.lastModified,
  }));

  const handleFilesChange = (items: FileItem[]) => {
    const newUploadedFiles = uploadedFiles.filter(f =>
      items.some(item => item.name === f.name && item.size === f.size)
    );
    setUploadedFiles(newUploadedFiles);
  };

  return (
    <Card className="bg-slate-700/40 border-slate-400/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Project Information</CardTitle>
        <CardDescription className="text-slate-300">
          Enter details about your project and select a compliance pathway.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="space-y-2">
          <Label htmlFor="compliancePath" className="text-slate-200">Compliance Path</Label>
          <Select
            value={selections.compliancePath}
            onValueChange={(value) => handleSelectionChange('compliancePath', value)}
          >
            <SelectTrigger id="compliancePath"><SelectValue placeholder="Select a path" /></SelectTrigger>
            <SelectContent>
              {COMPLIANCE_PATH_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildingType" className="text-slate-200">Building Type</Label>
          <Select
            value={selections.buildingType}
            onValueChange={(value) => handleSelectionChange('buildingType', value)}
          >
            <SelectTrigger id="buildingType"><SelectValue placeholder="Select a type" /></SelectTrigger>
            <SelectContent>
              {BUILDING_TYPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="province" className="text-slate-200">Province</Label>
          <Select
            value={selections.province}
            onValueChange={(value) => handleSelectionChange('province', value)}
          >
            <SelectTrigger id="province"><SelectValue placeholder="Select a province" /></SelectTrigger>
            <SelectContent>
              {PROVINCE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildingAddress" className="text-slate-200">Project Address</Label>
          <Input
            id="buildingAddress"
            value={selections.buildingAddress}
            onChange={(e) => handleSelectionChange('buildingAddress', e.target.value)}
            className="text-white"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-slate-200">Project Files</Label>
          <FileManager
            files={fileItems}
            onFilesChange={handleFilesChange}
            onFileUploaded={handleFileUploaded}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="comments" className="text-slate-200">Comments</Label>
          <Textarea
            id="comments"
            value={selections.comments}
            onChange={(e) => handleSelectionChange('comments', e.target.value)}
            className="text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
};