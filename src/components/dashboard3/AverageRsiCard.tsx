import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

interface AverageRsiCardProps {
  data: {
    attic: number;
    wall: number;
    belowGrade: number;
  };
}

const AverageRsiCard = ({ data }: AverageRsiCardProps) => {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          Average RSI Values
        </CardTitle>
        <CardDescription className="text-slate-500">Your typical building envelope performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Attic / Ceiling</span>
          <span className="font-bold text-lg text-slate-800">{data.attic.toFixed(2)} RSI</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Above-Grade Walls</span>
          <span className="font-bold text-lg text-slate-800">{data.wall.toFixed(2)} RSI</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Below-Grade Walls</span>
          <span className="font-bold text-lg text-slate-800">{data.belowGrade.toFixed(2)} RSI</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageRsiCard;