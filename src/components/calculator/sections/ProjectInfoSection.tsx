import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Selections } from '../types';
import { User } from 'lucide-react';

interface ProjectInfoSectionProps {
  selections: Selections;
  handleInputChange: (field: keyof Selections, value: any) => void;
}

const ProjectInfoSection: React.FC<ProjectInfoSectionProps> = ({ selections, handleInputChange }) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><User className="h-5 w-5" /> Project & Contact Information</CardTitle>
        <CardDescription className="text-slate-200">Enter details about the project and the primary contact person.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                <Input id="firstName" value={selections.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                <Input id="lastName" value={selections.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-200">Company Name</Label>
              <Input id="company" value={selections.company} onChange={(e) => handleInputChange('company', e.target.value)} placeholder="Builder Co." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-slate-200">Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={selections.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="(403) 555-1234" />
            </div>
          </div>
          {/* Project Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buildingAddress" className="text-slate-200">Project / Building Address</Label>
              <Input id="buildingAddress" value={selections.buildingAddress} onChange={(e) => handleInputChange('buildingAddress', e.target.value)} placeholder="123 Main St, Calgary, AB" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province" className="text-slate-200">Province</Label>
                <Select value={selections.province} onValueChange={(value) => handleInputChange('province', value)}>
                  <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alberta">Alberta</SelectItem>
                    <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="climateZone" className="text-slate-200">Climate Zone</Label>
                <Select value={selections.climateZone} onValueChange={(value) => handleInputChange('climateZone', value)}>
                  <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7A">Zone 7A</SelectItem>
                    <SelectItem value="7B">Zone 7B</SelectItem>
                    <SelectItem value="8">Zone 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingType" className="text-slate-200">Building Type</Label>
              <Select value={selections.buildingType} onValueChange={(value) => handleInputChange('buildingType', value)}>
                <SelectTrigger><SelectValue placeholder="Select Building Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-detached">Single Detached</SelectItem>
                  <SelectItem value="single-detached-secondary">Single Detached with Secondary Suite</SelectItem>
                  <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                  <SelectItem value="row-house">Row House</SelectItem>
                  <SelectItem value="stacked-row-house">Stacked Row House</SelectItem>
                  <SelectItem value="multi-unit">Multi-Unit Residential Building (MURB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoSection;