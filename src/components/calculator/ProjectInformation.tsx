import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorSectionProps } from './types';

const ProjectInformation = ({ calculator }: CalculatorSectionProps) => {
  const { formData, handleInputChange } = calculator;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={formData.firstName || ''} onChange={(e) => handleInputChange('firstName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={formData.lastName || ''} onChange={(e) => handleInputChange('lastName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={formData.company || ''} onChange={(e) => handleInputChange('company', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" value={formData.phoneNumber || ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="buildingAddress">Building Address</Label>
          <Input id="buildingAddress" value={formData.buildingAddress || ''} onChange={(e) => handleInputChange('buildingAddress', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInformation;