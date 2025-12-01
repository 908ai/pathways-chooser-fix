import { useMemo } from 'react';
import StatCard from '@/components/dashboard3/StatCard';
import { Leaf, Zap } from 'lucide-react';

const calculateGhg = (energyConsumption: number | null, province: string | null, heatingType: string | null) => {
  if (!energyConsumption) return 0;

  const heatingTypeLower = heatingType?.toLowerCase() || '';
  let isGas = heatingTypeLower.includes('gas') || heatingTypeLower.includes('furnace') || heatingTypeLower.includes('boiler');

  if (!heatingTypeLower.includes('electric') && !heatingTypeLower.includes('heat pump') && !isGas) {
    isGas = true; // Default to gas if unknown
  }

  let emissionFactor = 50; // kg CO2e per GJ for Natural Gas

  if (!isGas) {
    const provinceLower = province?.toLowerCase();
    if (provinceLower === 'alberta') {
      emissionFactor = 136; // ~490 kg/MWh
    } else if (provinceLower === 'saskatchewan') {
      emissionFactor = 183; // ~660 kg/MWh
    } else {
      emissionFactor = 100; // Generic fallback
    }
  }

  return energyConsumption * emissionFactor; // returns kg CO2e
};

const AggregatePerformanceStats = ({ projects }: { projects: any[] }) => {
  const stats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { avgGhgEmissions: 0, totalGhgAvoided: 0, avgEnergyConsumption: 0 };
    }

    const performanceProjects = projects.filter(p => (p.selected_pathway === '9365' || p.selected_pathway === '9367') && typeof p.annual_energy_consumption === 'number');
    
    if (performanceProjects.length === 0) {
      return { avgGhgEmissions: 0, totalGhgAvoided: 0, avgEnergyConsumption: 0 };
    }

    const totalGhgEmissions = performanceProjects.reduce((sum, p) => sum + calculateGhg(p.annual_energy_consumption, p.province, p.heating_system_type), 0);
    const avgGhgEmissions = totalGhgEmissions / performanceProjects.length;

    const totalGhgAvoided = performanceProjects.reduce((sum, p) => {
      const baselineConsumption = p.annual_energy_consumption * 1.1; // Mock reference house
      const emissions = calculateGhg(p.annual_energy_consumption, p.province, p.heating_system_type);
      const baselineEmissions = calculateGhg(baselineConsumption, p.province, p.heating_system_type);
      return sum + (baselineEmissions - emissions);
    }, 0);

    const avgEnergyConsumption = performanceProjects.reduce((sum, p) => sum + p.annual_energy_consumption, 0) / performanceProjects.length;

    return {
      avgGhgEmissions: avgGhgEmissions / 1000, // convert to tonnes
      totalGhgAvoided: totalGhgAvoided / 1000, // convert to tonnes
      avgEnergyConsumption,
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Avg. GHG Emissions"
        value={`${stats.avgGhgEmissions.toFixed(2)} tCO2e/year`}
        icon={<Leaf className="h-4 w-4 text-muted-foreground" />}
        description="For performance path projects"
      />
      <StatCard
        title="Total GHG Avoided"
        value={`${stats.totalGhgAvoided.toFixed(1)} tCO2e`}
        icon={<Leaf className="h-4 w-4 text-muted-foreground" />}
        description="Compared to baseline"
      />
      <StatCard
        title="Avg. Energy Consumption"
        value={`${stats.avgEnergyConsumption.toFixed(2)} GJ/year`}
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        description="For performance path projects"
      />
    </div>
  );
};

export default AggregatePerformanceStats;