import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalculatorSectionProps } from './types';

const ResultsSidebar = ({ calculator }: CalculatorSectionProps) => {
  const { totalPoints, complianceStatus, points } = calculator;

  return (
    <Card className="sticky top-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle>Compliance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm uppercase text-gray-300">Total Points</p>
          <p className="text-5xl font-bold">{totalPoints.toFixed(1)}</p>
          <Badge variant={complianceStatus === 'Pass' ? 'default' : 'destructive'}>
            {complianceStatus}
          </Badge>
        </div>
        <div className="space-y-2 pt-4 border-t border-white/20">
          <h4 className="font-semibold">Points Breakdown:</h4>
          {Object.entries(points).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{(value as number || 0).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSidebar;