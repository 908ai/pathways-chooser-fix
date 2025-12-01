import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift, Zap, DollarSign } from 'lucide-react';

const calculateGhg = (energyConsumption: number | null, province: string | null, heatingType: string | null) => {
  if (!energyConsumption) return 0;
  const heatingTypeLower = heatingType?.toLowerCase() || '';
  let isGas = heatingTypeLower.includes('gas') || heatingTypeLower.includes('furnace') || heatingTypeLower.includes('boiler');
  if (!heatingTypeLower.includes('electric') && !heatingTypeLower.includes('heat pump') && !isGas) isGas = true;
  let emissionFactor = 50; // kg CO2e per GJ for Natural Gas
  if (!isGas) {
    const provinceLower = province?.toLowerCase();
    if (provinceLower === 'alberta') emissionFactor = 136;
    else if (provinceLower === 'saskatchewan') emissionFactor = 183;
    else emissionFactor = 100;
  }
  return (energyConsumption * emissionFactor); // returns kg CO2e
};

const IncentivePlanningCard = ({ projects }: { projects: any[] }) => {
  const stats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { totalGhgAvoided: 0, netZeroReadyCount: 0, electrifiedCount: 0, totalSavings: 0 };
    }

    const performanceProjects = projects.filter(p => (p.selected_pathway === '9365' || p.selected_pathway === '9367'));

    const totalGhgAvoided = performanceProjects.reduce((sum, p) => {
      const baselineConsumption = (p.annual_energy_consumption || 0) * 1.1; // Mock reference house
      const emissions = calculateGhg(p.annual_energy_consumption, p.province, p.heating_system_type);
      const baselineEmissions = calculateGhg(baselineConsumption, p.province, p.heating_system_type);
      return sum + (baselineEmissions - emissions);
    }, 0) / 1000; // Convert to tonnes

    const netZeroReadyCount = projects.filter(p => (p.total_points && p.total_points >= 40) || (p.airtightness_al && p.airtightness_al <= 1.0)).length;
    const electrifiedCount = projects.filter(p => {
      const heatingType = p.heating_system_type?.toLowerCase() || '';
      return heatingType.includes('electric') || heatingType.includes('heat pump');
    }).length;

    const totalSavings = performanceProjects.reduce((sum, p) => {
      const isTier2OrHigher = p.selected_pathway === '9367';
      const prescriptiveCost = isTier2OrHigher ? 13550 : 6888;
      const performanceCost = isTier2OrHigher ? 8150 : 1718;
      return sum + (prescriptiveCost - performanceCost);
    }, 0);

    return { totalGhgAvoided, netZeroReadyCount, electrifiedCount, totalSavings };
  }, [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Incentive Planning
        </CardTitle>
        <CardDescription>Metrics to support grant applications and program design.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Potential GHG Offsets</p>
            <p className="text-xs text-muted-foreground">Eligible for grant programs</p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.totalGhgAvoided.toFixed(1)} tCO₂e</p>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Net Zero Ready / Electrified Homes</p>
            <p className="text-xs text-muted-foreground">Projects meeting high-performance criteria</p>
          </div>
          <p className="text-xl font-bold text-blue-600">{stats.netZeroReadyCount + stats.electrifiedCount}</p>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-semibold">Est. Homeowner Savings</p>
            <p className="text-xs text-muted-foreground">From choosing performance path</p>
          </div>
          <p className="text-xl font-bold text-purple-600">${stats.totalSavings.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncentivePlanningCard;