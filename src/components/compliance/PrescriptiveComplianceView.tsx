import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { FileText } from 'lucide-react';

interface PrescriptiveComplianceViewProps {
  project: any;
}

const ChecklistItem = ({ label, value, requirement, isMet }: { label: string; value: any; requirement: string; isMet: boolean }) => {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-400">Requirement: {requirement}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${isMet ? 'text-green-400' : 'text-red-400'}`}>{value}</span>
        {isMet ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-red-400" />}
      </div>
    </div>
  );
};

const PrescriptiveComplianceView = ({ project }: PrescriptiveComplianceViewProps) => {
  // Simplified checks for demonstration
  const hasHrv = project.hrv_erv_type !== 'None';
  const checks = [
    { label: 'Attic RSI', value: project.attic_rsi, req: hasHrv ? '≥ 8.67' : '≥ 10.43', met: project.attic_rsi >= (hasHrv ? 8.67 : 10.43) },
    { label: 'Wall RSI', value: project.wall_rsi, req: hasHrv ? '≥ 2.97' : '≥ 3.69', met: project.wall_rsi >= (hasHrv ? 2.97 : 3.69) },
    { label: 'Below Grade RSI', value: project.below_grade_rsi, req: hasHrv ? '≥ 2.98' : '≥ 3.46', met: project.below_grade_rsi >= (hasHrv ? 2.98 : 3.46) },
    { label: 'Window U-Value', value: project.window_u_value, req: '≤ 1.61', met: project.window_u_value <= 1.61 },
  ];

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-400" />
          Prescriptive Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {checks.map(check => (
          <ChecklistItem key={check.label} label={check.label} value={check.value} requirement={check.req} isMet={check.met} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PrescriptiveComplianceView;