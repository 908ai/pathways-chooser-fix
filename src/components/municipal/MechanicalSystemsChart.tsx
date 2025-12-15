import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

const MechanicalSystemsChart = ({ data }: { data: any[] }) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        heatPumpRate: 0,
        hrvRate: 0,
        gasDhwRate: 0,
        electricDhwRate: 0,
      };
    }

    const total = data.length;
    const heatPumpCount = data.filter(p => p.heating_system_type?.toLowerCase().includes('heat pump')).length;
    const hrvCount = data.filter(p => p.hrv_erv_type && p.hrv_erv_type !== 'None').length;
    const gasDhwCount = data.filter(p => p.water_heating_type?.toLowerCase().includes('gas')).length;
    const electricDhwCount = data.filter(p => p.water_heating_type?.toLowerCase().includes('electric')).length;

    return {
      heatPumpRate: (heatPumpCount / total) * 100,
      hrvRate: (hrvCount / total) * 100,
      gasDhwRate: (gasDhwCount / total) * 100,
      electricDhwRate: (electricDhwCount / total) * 100,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          Mechanical Systems Breakdown
        </CardTitle>
        <CardDescription>Adoption rates of key efficiency technologies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Heat Pumps</span>
            <span className="font-semibold">{stats.heatPumpRate.toFixed(0)}%</span>
          </div>
          <Progress value={stats.heatPumpRate} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">HRVs / ERVs</span>
            <span className="font-semibold">{stats.hrvRate.toFixed(0)}%</span>
          </div>
          <Progress value={stats.hrvRate} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Gas Water Heaters</span>
            <span className="font-semibold">{stats.gasDhwRate.toFixed(0)}%</span>
          </div>
          <Progress value={stats.gasDhwRate} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Electric Water Heaters</span>
            <span className="font-semibold">{stats.electricDhwRate.toFixed(0)}%</span>
          </div>
          <Progress value={stats.electricDhwRate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MechanicalSystemsChart;