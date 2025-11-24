import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';

interface TieredPrescriptiveComplianceViewProps {
  project: any;
}

const TieredPrescriptiveComplianceView = ({ project }: TieredPrescriptiveComplianceViewProps) => {
  const pointsBreakdown = [
    { label: 'Attic Insulation', points: project.attic_points || 0 },
    { label: 'Wall Insulation', points: project.wall_points || 0 },
    { label: 'Below Grade Insulation', points: project.below_grade_points || 0 },
    { label: 'Windows & Doors', points: project.window_points || 0 },
    { label: 'Airtightness', points: project.airtightness_points || 0 },
    { label: 'HRV/ERV', points: project.hrv_erv_points || 0 },
    { label: 'Water Heater', points: project.water_heating_points || 0 },
  ].filter(item => item.points > 0);

  const getTierInfo = () => {
    const points = project.total_points || 0;
    if (points >= 75) return { tier: 5, required: 75 };
    if (points >= 40) return { tier: 4, required: 40 };
    if (points >= 20) return { tier: 3, required: 20 };
    if (points >= 10) return { tier: 2, required: 10 };
    return { tier: 1, required: 0 };
  };

  const tierInfo = getTierInfo();

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-400" />
          Points System Breakdown (Tier {tierInfo.tier})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-wider text-slate-400">Total Points</p>
          <p className="text-6xl font-bold text-white">{project.total_points?.toFixed(1) || '0.0'}</p>
        </div>
        <div className="space-y-4">
          {pointsBreakdown.map(item => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-medium text-white">+{item.points.toFixed(1)} pts</span>
              </div>
              <Progress value={(item.points / (project.total_points || 1)) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TieredPrescriptiveComplianceView;