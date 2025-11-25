import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => {
  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <div className="text-slate-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;