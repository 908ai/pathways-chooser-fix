import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Selections, CalculatorLogic } from '../types';
import WarningButton from '../WarningButton';
import { validateRSI, validateRSI_9362 } from '../utils';
import { Building } from 'lucide-react';

interface BuildingEnvelopeSectionProps {
  selections: Selections;
  handleInputChange: (field: keyof Selections, value: any) => void;
  logic: CalculatorLogic;
  expandedWarnings: { [key: string]: boolean };
  setExpandedWarnings: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const BuildingEnvelopeSection: React.FC<BuildingEnvelopeSectionProps> = ({ selections, handleInputChange, logic }) => {
  const wallRSIValidation = validateRSI(selections.wallRSI, 3.69, "Above-Grade Walls");
  const atticRSIValidation = validateRSI(selections.ceilingsAtticRSI, 8.81, "Attic/Ceiling");
  const foundationRSIValidation = validateRSI_9362(selections.foundationWallsRSI, 2.98, "Foundation Walls");

  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><Building className="h-5 w-5" /> Building Envelope</CardTitle>
        <CardDescription className="text-slate-200">Specify the insulation, windows, and airtightness details for the building.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {/* Attic/Ceiling */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Attic / Ceilings</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ceilingsAtticRSI" className="text-slate-200">Attic/Ceiling RSI</Label>
              <Input id="ceilingsAtticRSI" value={selections.ceilingsAtticRSI} onChange={(e) => handleInputChange('ceilingsAtticRSI', e.target.value)} placeholder="e.g., 10.57" />
              {!atticRSIValidation.isValid && <WarningButton title="Attention Required" warningId="atticRSI" variant="destructive">{atticRSIValidation.warning?.message}</WarningButton>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hasCathedralOrFlatRoof" className="text-slate-200">Cathedral or Flat Roof?</Label>
              <Select value={selections.hasCathedralOrFlatRoof} onValueChange={(value) => handleInputChange('hasCathedralOrFlatRoof', value)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Walls */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Walls</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wallRSI" className="text-slate-200">Above-Grade Wall RSI</Label>
              <Input id="wallRSI" value={selections.wallRSI} onChange={(e) => handleInputChange('wallRSI', e.target.value)} placeholder="e.g., 4.57" />
              {!wallRSIValidation.isValid && <WarningButton title="Attention Required" warningId="wallRSI" variant="destructive">{wallRSIValidation.warning?.message}</WarningButton>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="belowGradeRSI" className="text-slate-200">Below-Grade Wall RSI</Label>
              <Input id="belowGradeRSI" value={selections.belowGradeRSI} onChange={(e) => handleInputChange('belowGradeRSI', e.target.value)} placeholder="e.g., 3.87" />
            </div>
          </div>
        </div>

        {/* Floors & Slabs */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Floors & Slabs</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floorsUnheatedRSI" className="text-slate-200">Floors Over Unheated Spaces RSI</Label>
              <Input id="floorsUnheatedRSI" value={selections.floorsUnheatedRSI} onChange={(e) => handleInputChange('floorsUnheatedRSI', e.target.value)} placeholder="e.g., 5.46" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundationWallsRSI" className="text-slate-200">Foundation Walls RSI</Label>
              <Input id="foundationWallsRSI" value={selections.foundationWallsRSI} onChange={(e) => handleInputChange('foundationWallsRSI', e.target.value)} placeholder="e.g., 3.87" />
              {!foundationRSIValidation.isValid && <WarningButton title="Attention Required" warningId="foundationRSI" variant="destructive">{foundationRSIValidation.warning?.message}</WarningButton>}
            </div>
          </div>
        </div>

        {/* Windows & Airtightness */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Windows & Airtightness</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windowUValue" className="text-slate-200">Window U-Value</Label>
              <Input id="windowUValue" value={selections.windowUValue} onChange={(e) => handleInputChange('windowUValue', e.target.value)} placeholder="e.g., 1.22" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airtightness" className="text-slate-200">Airtightness (ACH50)</Label>
              <Input id="airtightness" value={selections.airtightness} onChange={(e) => handleInputChange('airtightness', e.target.value)} placeholder="e.g., 1.5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingEnvelopeSection;