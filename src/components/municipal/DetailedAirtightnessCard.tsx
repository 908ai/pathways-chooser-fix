import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailedAirtightnessCardProps {
  data: any[];
  onOpenMap: () => void;
}

const DetailedAirtightnessCard = ({ data, onOpenMap }: DetailedAirtightnessCardProps) => {
  const stats = useMemo(() => {
    const testedProjects = data.filter(p => typeof p.airtightness_al === 'number' && p.airtightness_al > 0);
    if (testedProjects.length === 0) {
      return {
        totalTested: 0,
        lowest: 0,
        highest: 0,
        avgByType: {},
      };
    }

    const values = testedProjects.map(p => p.airtightness_al);
    const lowest = Math.min(...values);
    const highest = Math.max(...values);

    const avgByType = testedProjects.reduce((acc, p) => {
      const type = p.building_type || 'Unknown';
      if (!acc[type]) {
        acc[type] = { sum: 0, count: 0 };
      }
      acc[type].sum += p.airtightness_al;
      acc[type].count++;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    Object.keys(avgByType).forEach(type => {
      // @ts-ignore
      avgByType[type] = avgByType[type].sum / avgByType[type].count;
    });

    return {
      totalTested: testedProjects.length,
      lowest,
      highest,
      avgByType,
    };
  }, [data]);

  const formatBuildingType = (type: string) => {
    if (!type) return 'Unknown';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Wind className="h-5 w-5 text-muted-foreground" />
          Detailed Airtightness (ACH₅₀)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{stats.totalTested}</p>
            <p className="text-xs text-muted-foreground">Homes Tested</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.lowest.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Lowest Result</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.highest.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Highest Result</p>
          </div>
        </div>
        {Object.keys(stats.avgByType).length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Average by Building Type:</h4>
            <div className="space-y-2">
              {Object.entries(stats.avgByType).map(([type, avg]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatBuildingType(type)}</span>
                  <span className="font-semibold">{(avg as number).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="pt-4 border-t">
          <Button variant="link" className="p-0 h-auto text-primary" onClick={onOpenMap}>
            <Map className="h-4 w-4 mr-2" />
            View Airtightness Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedAirtightnessCard;