import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorSectionProps } from './types';

const Form9365 = ({ calculator }: CalculatorSectionProps) => {
  const { formData, handleInputChange } = calculator;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle>Building Envelope (Performance)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Performance path inputs will go here.</p>
        <div className="space-y-2">
          <Label>Annual Energy Consumption (kWh)</Label>
          <Input type="number" value={formData.annualEnergyConsumption || ''} onChange={(e) => handleInputChange('annualEnergyConsumption', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Form9365;