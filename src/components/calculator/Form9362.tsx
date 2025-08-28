import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalculatorSectionProps } from './types';
import WarningButton from './WarningButton';
import { wallRSIOptions, wallRSIOptions_7B } from '@/lib/nbc-calculator-data';

const Form9362 = ({ calculator }: CalculatorSectionProps) => {
  const { formData, handleInputChange, warnings, expandedWarnings, toggleWarning } = calculator;
  const zone = formData.province === 'saskatchewan' ? '7B' : '7A';
  const wallOptions = zone === '7B' ? wallRSIOptions_7B : wallRSIOptions;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle>Building Envelope (Prescriptive)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Above-Grade Wall RSI</Label>
            <Select value={formData.wallRSI || ''} onValueChange={(value) => handleInputChange('wallRSI', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Wall RSI" />
              </SelectTrigger>
              <SelectContent>
                {wallOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ceilings/Attic RSI</Label>
            <Input value={formData.ceilingsAtticRSI || ''} onChange={(e) => handleInputChange('ceilingsAtticRSI', e.target.value)} placeholder="Enter RSI value" />
          </div>
        </div>
        {warnings.wallRSI && (
          <WarningButton
            warningId="wallRSI"
            title="Wall Insulation Warning"
            expandedWarnings={expandedWarnings}
            toggleWarning={toggleWarning}
            variant="destructive"
          >
            {warnings.wallRSI.message}
          </WarningButton>
        )}
      </CardContent>
    </Card>
  );
};

export default Form9362;