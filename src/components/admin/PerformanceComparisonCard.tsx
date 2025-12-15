import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, FileText } from 'lucide-react';

interface PerformanceComparisonCardProps {
  projects: any[];
}

const calculateStats = (projects: any[]) => {
  if (projects.length === 0) {
    return {
      count: 0,
      avgUpgradeCost: 0,
      complianceRate: 0,
      avgAtticRsi: 0,
      avgWallRsi: 0,
    };
  }

  const completed = projects.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant' || p.compliance_status === 'fail');
  const compliant = completed.filter(p => p.compliance_status === 'pass' || p.compliance_status === 'Compliant');
  const complianceRate = completed.length > 0 ? (compliant.length / completed.length) * 100 : 0;

  const withCosts = projects.filter(p => typeof p.upgrade_costs === 'number');
  const avgUpgradeCost = withCosts.length > 0 ? withCosts.reduce((sum, p) => sum + p.upgrade_costs, 0) / withCosts.length : 0;

  const getAverage = (field: keyof typeof projects[0]) => {
    const validProjects = projects.filter(p => typeof p[field] === 'number' && p[field] > 0);
    if (validProjects.length === 0) return 0;
    return validProjects.reduce((sum, p) => sum + (p[field] as number), 0) / validProjects.length;
  };

  return {
    count: projects.length,
    avgUpgradeCost,
    complianceRate,
    avgAtticRsi: getAverage('attic_rsi'),
    avgWallRsi: getAverage('wall_rsi'),
  };
};

const PerformanceComparisonCard = ({ projects }: PerformanceComparisonCardProps) => {
  const { prescriptiveStats, performanceStats } = useMemo(() => {
    const prescriptiveProjects = projects.filter(p => p.selected_pathway === '9362' || p.selected_pathway === '9368');
    const performanceProjects = projects.filter(p => p.selected_pathway === '9365' || p.selected_pathway === '9367');
    
    return {
      prescriptiveStats: calculateStats(prescriptiveProjects),
      performanceStats: calculateStats(performanceProjects),
    };
  }, [projects]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptive vs. Performance Comparison</CardTitle>
        <CardDescription>A real-time comparison of submissions to identify trends and cost-saving opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Prescriptive
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Performance
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Total Projects</TableCell>
              <TableCell className="text-center">{prescriptiveStats.count}</TableCell>
              <TableCell className="text-center">{performanceStats.count}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Avg. Upgrade Cost</TableCell>
              <TableCell className="text-center">{formatCurrency(prescriptiveStats.avgUpgradeCost)}</TableCell>
              <TableCell className="text-center">{formatCurrency(performanceStats.avgUpgradeCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Compliance Rate</TableCell>
              <TableCell className="text-center">{prescriptiveStats.complianceRate.toFixed(0)}%</TableCell>
              <TableCell className="text-center">{performanceStats.complianceRate.toFixed(0)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Avg. Attic RSI</TableCell>
              <TableCell className="text-center">{prescriptiveStats.avgAtticRsi.toFixed(2)}</TableCell>
              <TableCell className="text-center">{performanceStats.avgAtticRsi.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Avg. Wall RSI</TableCell>
              <TableCell className="text-center">{prescriptiveStats.avgWallRsi.toFixed(2)}</TableCell>
              <TableCell className="text-center">{performanceStats.avgWallRsi.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparisonCard;