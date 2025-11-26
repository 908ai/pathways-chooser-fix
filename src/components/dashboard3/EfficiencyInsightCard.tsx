import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

const EfficiencyInsightCard = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg rounded-xl p-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs w-fit mb-4">
              <Zap className="h-4 w-4" />
              <span>Efficiency Insight</span>
            </div>
            <h2 className="text-2xl font-bold">Average Portfolio Performance is trending up by 12%</h2>
            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-3xl font-bold">105.5 GJ</p>
                <p className="text-xs opacity-80">AVG CONSUMPTION</p>
              </div>
              <div>
                <p className="text-3xl font-bold">Tier 2</p>
                <p className="text-xs opacity-80">TARGET LEVEL</p>
              </div>
            </div>
          </div>
          <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="stroke-current text-white/30"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
              <path
                className="stroke-current text-white"
                strokeDasharray="85, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">85%</span>
              <span className="text-xs">COMPLIANCE</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EfficiencyInsightCard;