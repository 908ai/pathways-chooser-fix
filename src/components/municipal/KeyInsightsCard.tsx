import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const insights = [
  "Performance path projects show an average cost saving of $5,400 compared to prescriptive builds.",
  "Airtightness has improved by 8% on average across all projects in the last quarter.",
  "Tier 2 is the most commonly achieved tier for new projects, making up 45% of submissions.",
  "Natural Gas remains the dominant heating source, used in over 80% of projects.",
  "Projects in Alberta are 15% more likely to use heat pumps compared to Saskatchewan."
];

const KeyInsightsCard = () => {
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);

  useEffect(() => {
    // Select two random, unique insights
    const shuffled = [...insights].sort(() => 0.5 - Math.random());
    setSelectedInsights(shuffled.slice(0, 2));
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-indigo-900/50 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedInsights.map((insight, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <div className="w-1 h-10 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-lg font-medium text-foreground/90">
              {insight}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyInsightsCard;