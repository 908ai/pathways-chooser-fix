import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Selections } from '../types';
import { FileText } from 'lucide-react';

interface CompliancePathSectionProps {
  selections: Selections;
  handleInputChange: (field: keyof Selections, value: any) => void;
}

const CompliancePathSection: React.FC<CompliancePathSectionProps> = ({ selections, handleInputChange }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5" /> Compliance Path Selection</CardTitle>
        <CardDescription className="text-slate-200">Choose the NBC 2020 compliance path for your project.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup
          value={selections.compliancePath}
          onValueChange={(value) => handleInputChange('compliancePath', value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors">
            <RadioGroupItem value="9362" id="9362" />
            <Label htmlFor="9362" className="font-medium text-slate-100 cursor-pointer w-full">
              NBC 9.36.2-9.36.4 Prescriptive Path
              <p className="text-xs font-normal text-slate-300 mt-1">Follows a checklist of minimum requirements for building components.</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors">
            <RadioGroupItem value="9365" id="9365" />
            <Label htmlFor="9365" className="font-medium text-slate-100 cursor-pointer w-full">
              NBC 9.36.5 Performance Path
              <p className="text-xs font-normal text-slate-300 mt-1">Uses energy modeling to show the proposed design is as good as the prescriptive path.</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors">
            <RadioGroupItem value="9368" id="9368" />
            <Label htmlFor="9368" className="font-medium text-slate-100 cursor-pointer w-full">
              NBC 9.36.8 Tiered Prescriptive Path
              <p className="text-xs font-normal text-slate-300 mt-1">A points-based system for achieving higher energy performance tiers.</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-colors">
            <RadioGroupItem value="9367" id="9367" />
            <Label htmlFor="9367" className="font-medium text-slate-100 cursor-pointer w-full">
              NBC 9.36.7 Tiered Performance Path
              <p className="text-xs font-normal text-slate-300 mt-1">Energy modeling to meet specific energy consumption targets for higher tiers.</p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default CompliancePathSection;