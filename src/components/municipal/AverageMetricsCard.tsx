import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Wind, Zap, Square } from 'lucide-react';

const AverageMetricsCard = ({ data }: { data: any[] }) => {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return { avgAirtightness: 0, avgEnergyConsumption: 0, avgAtticRsi: 0, avgWallRsi: 0, avgEnerguide: 0, avgWwr: 0 };
    }

    const getAverage = (field: keyof typeof data[0]) => {
      const validProjects = data.filter(p => typeof p[field] === 'number' && p[field] > 0);
      if (validProjects.length === 0) return 0;
      return validProjects.reduce((sum, p) => sum + (p[field] as number), 0) / validProjects.length;
    };

    const performanceProjects = data.filter(p => (p.selected_pathway === '9365' || p.selected_pathway === '9367') && typeof p.annual_energy_consumption === 'number');
    const avgEnergyConsumption = performanceProjects.length > 0
      ? performanceProjects.reduce((sum, p) => sum + p.annual_energy_consumption, 0) / performanceProjects.length
      : 0;

    return {
      avgAirtightness: getAverage('airtightness_al'),
      avgEnergyConsumption,
      avgAtticRsi: getAverage('attic_rsi'),
      avgWallRsi: getAverage('wall_rsi'),
      avgEnerguide: getAverage('energuide_rating'),
      avgWwr: getAverage('window_to_wall_ratio'),
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">Average Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            <span className="text-muted-foreground">Airtightness (ACH₅₀)</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgAirtightness.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-muted-foreground">Energy Use (GJ/year)</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgEnergyConsumption.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <span className="text-muted-foreground">Attic RSI</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgAtticRsi.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <span className="text-muted-foreground">Wall RSI</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgWallRsi.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">EnerGuide Rating</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgEnerguide > 0 ? metrics.avgEnerguide.toFixed(0) : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Square className="h-5 w-5 text-purple-500" />
            <span className="text-muted-foreground">Window-to-Wall Ratio</span>
          </div>
          <span className="font-bold text-lg">{metrics.avgWwr > 0 ? `${(metrics.avgWwr * 100).toFixed(1)}%` : 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageMetricsCard;