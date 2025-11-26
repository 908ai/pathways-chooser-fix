import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgClassName?: string;
  description?: string;
}

const StatCard = ({ title, value, icon, iconBgClassName, description }: StatCardProps) => {
  return (
    <Card className="bg-white shadow-sm rounded-lg p-4">
      <CardContent className="p-0">
        <div className="flex justify-end mb-2">
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", iconBgClassName)}>
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <p className="text-sm text-slate-500">{title}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;