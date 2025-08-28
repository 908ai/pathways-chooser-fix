import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalculatorSectionProps } from './types';

const CompliancePathSelection = ({ calculator }: CalculatorSectionProps) => {
  const { formData, handleInputChange } = calculator;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle>Compliance Path Selection</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Compliance Path</Label>
          <Select value={formData.compliancePath} onValueChange={(value) => handleInputChange('compliancePath', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9362">NBC 9.36.2 Prescriptive</SelectItem>
              <SelectItem value="9365">NBC 9.36.5 Performance</SelectItem>
              <SelectItem value="9367">NBC 9.36.7 Tiered Performance</SelectItem>
              <SelectItem value="9368">NBC 9.36.8 Tiered Prescriptive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Province</Label>
          <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alberta">Alberta</SelectItem>
              <SelectItem value="saskatchewan">Saskatchewan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Building Type</Label>
          <Select value={formData.buildingType} onValueChange={(value) => handleInputChange('buildingType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Building Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-detached">Single Detached</SelectItem>
              <SelectItem value="single-detached-secondary">Single Detached with Secondary Suite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompliancePathSelection;