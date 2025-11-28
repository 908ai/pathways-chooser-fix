import { useMemo } from 'react';
import StatCard from '@/components/dashboard3/StatCard';
import { TrendingUp, DollarSign, Zap } from 'lucide-react';

interface AggregatePerformanceStatsProps {
  projects: any[];
}

const AggregatePerformanceStats = ({ projects }: AggregatePerformanceStatsProps) => {
  const stats = useMemo(() => {
    if (projects.length === 0) {
      return {
        avgEnergyConsumption: 0,
        avgUpgradeCost: 0,
        ghgSavings: 0, // Placeholder
      };
    }

    const performanceProjects = projects.filter(p => (p.selected_pathway === '9365' || p.selected_pathway === '9367') && typeof p.annual_energy_consumption === 'number');
    const avgEnergyConsumption = performanceProjects.length > 0
      ? performanceProjects.reduce((sum, p) => sum + p.annual_energy_consumption, 0) / performanceProjects.length
      : 0;

    const projectsWithCosts = projects.filter(p => typeof p.upgrade_costs === 'number');
    const avgUpgradeCost = projectsWithCosts.length > 0
      ? projectsWithCosts.reduce((sum, p) => sum + p.upgrade_costs, 0) / projectsWithCosts.length
      : 0;
      
    // Placeholder for GHG calculation. 1 GJ of natural gas is ~50 kg CO2e.
    // This is a very rough estimate.
    const ghgSavings = performanceProjects.reduce((sum, p) => {
        const referenceConsumption = p.annual_energy_consumption * 1.1; // Mock reference
        const savings = referenceConsumption - p.annual_energy_consumption;
        return sum + (savings * 50); // kg CO2e
    }, 0) / 1000; // Convert to tonnes

    return {
      avgEnergyConsumption,
      avgUpgradeCost,
      ghgSavings,
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Avg. Energy Consumption"
        value={`${stats.avgEnergyConsumption.toFixed(2)} GJ/year`}
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        description="For performance path projects"
      />
      <StatCard
        title="Avg. Upgrade Cost"
        value={`$${stats.avgUpgradeCost.toFixed(0)}`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        description="Across all projects with cost data"
      />
      <StatCard
        title="Est. GHG Savings"
        value={`${stats.ghgSavings.toFixed(1)} tonnes CO2e`}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        description="Cumulative estimate for performance projects"
      />
    </div>
  );
};

export default AggregatePerformanceStats;