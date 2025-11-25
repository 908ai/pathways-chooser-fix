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
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-400" />
          Average RSI Values
        </CardTitle>
        <CardDescription className="text-slate-300">Your typical building envelope performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Attic / Ceiling</span>
          <span className="font-bold text-lg">{data.attic.toFixed(2)} RSI</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Above-Grade Walls</span>
          <span className="font-bold text-lg">{data.wall.toFixed(2)} RSI</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Below-Grade Walls</span>
          <span className="font-bold text-lg">{data.belowGrade.toFixed(2)} RSI</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageRsiCard;