import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Selections } from '../types';
import FileUpload from '@/components/FileUpload';
import { FileUp, Send } from 'lucide-react';

interface SubmissionSectionProps {
  selections: Selections;
  handleInputChange: (field: keyof Selections, value: any) => void;
  agreementChecked: boolean;
  setAgreementChecked: (checked: boolean) => void;
  handleSubmitApplication: (pathType: 'performance' | 'prescriptive') => void;
  isSubmitting: boolean;
  uploadedFiles: File[];
  onFileUploaded: (file: any) => void;
}

const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  selections,
  handleInputChange,
  agreementChecked,
  setAgreementChecked,
  handleSubmitApplication,
  isSubmitting,
  uploadedFiles,
  onFileUploaded
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><FileUp className="h-5 w-5" /> Additional Information & Submission</CardTitle>
        <CardDescription className="text-slate-200">Upload documents, add comments, and submit your application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="additionalInfo" className="text-slate-200">Additional Information / Comments</Label>
          <Textarea
            id="additionalInfo"
            value={selections.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            placeholder="Provide any other relevant details about your project..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-4">
            <Label className="text-slate-200 font-semibold">Upload Project Files</Label>
            <FileUpload onFileUploaded={onFileUploaded} />
            {/* You can add a list of uploaded files here if needed */}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="agreement" checked={agreementChecked} onCheckedChange={(checked) => setAgreementChecked(!!checked)} />
            <Label htmlFor="agreement" className="text-sm text-slate-200">
              I agree to the terms and conditions and confirm the provided information is accurate.
            </Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => handleSubmitApplication('prescriptive')}
              disabled={isSubmitting || !agreementChecked}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Prescriptive Application
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => handleSubmitApplication('performance')}
              disabled={isSubmitting || !agreementChecked}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Performance Application
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionSection;