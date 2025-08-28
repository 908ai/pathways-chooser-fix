import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Selections } from '../types';
import { Zap } from 'lucide-react';

interface MechanicalSystemsSectionProps {
  selections: Selections;
  handleInputChange: (field: keyof Selections, value: any) => void;
}

const MechanicalSystemsSection: React.FC<MechanicalSystemsSectionProps> = ({ selections, handleInputChange }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><Zap className="h-5 w-5" /> Mechanical Systems</CardTitle>
        <CardDescription className="text-slate-200">Provide details for the heating, cooling, ventilation, and water heating systems.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {/* Heating */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Heating System</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heatingType" className="text-slate-200">Heating System Type</Label>
              <Select value={selections.heatingType} onValueChange={(value) => handleInputChange('heatingType', value)}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnace">Furnace</SelectItem>
                  <SelectItem value="boiler">Boiler</SelectItem>
                  <SelectItem value="heat-pump">Air Source Heat Pump</SelectItem>
                  <SelectItem value="electric-baseboard">Electric Baseboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heatingEfficiency" className="text-slate-200">Heating Efficiency (AFUE/%/HSPF)</Label>
              <Input id="heatingEfficiency" value={selections.heatingEfficiency} onChange={(e) => handleInputChange('heatingEfficiency', e.target.value)} placeholder="e.g., 96" />
            </div>
          </div>
        </div>

        {/* Cooling */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Cooling System</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coolingApplicable" className="text-slate-200">Is Cooling System Installed?</Label>
              <Select value={selections.coolingApplicable} onValueChange={(value) => handleInputChange('coolingApplicable', value)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selections.coolingApplicable === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="coolingEfficiency" className="text-slate-200">Cooling Efficiency (SEER)</Label>
                <Input id="coolingEfficiency" value={selections.coolingEfficiency} onChange={(e) => handleInputChange('coolingEfficiency', e.target.value)} placeholder="e.g., 16" />
              </div>
            )}
          </div>
        </div>

        {/* Water Heating */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Water Heating</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waterHeaterType" className="text-slate-200">Water Heater Type</Label>
              <Select value={selections.waterHeaterType} onValueChange={(value) => handleInputChange('waterHeaterType', value)}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gas-storage">Gas Storage Tank</SelectItem>
                  <SelectItem value="gas-tankless">Gas Tankless</SelectItem>
                  <SelectItem value="electric-storage">Electric Storage Tank</SelectItem>
                  <SelectItem value="heat-pump">Heat Pump Water Heater</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterHeater" className="text-slate-200">Water Heater Efficiency (EF/UEF)</Label>
              <Input id="waterHeater" value={selections.waterHeater} onChange={(e) => handleInputChange('waterHeater', e.target.value)} placeholder="e.g., 0.96" />
            </div>
          </div>
        </div>

        {/* Ventilation */}
        <div className="space-y-4">
          <Label className="text-slate-200 font-semibold">Ventilation (HRV/ERV)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hasHrvErv9365" className="text-slate-200">HRV/ERV Installed?</Label>
              <Select value={selections.hasHrvErv9365} onValueChange={(value) => handleInputChange('hasHrvErv9365', value)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selections.hasHrvErv9365 === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="hrvEfficiency" className="text-slate-200">HRV/ERV Efficiency (SRE %)</Label>
                <Input id="hrvEfficiency" value={selections.hrvEfficiency} onChange={(e) => handleInputChange('hrvEfficiency', e.target.value)} placeholder="e.g., 75" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MechanicalSystemsSection;