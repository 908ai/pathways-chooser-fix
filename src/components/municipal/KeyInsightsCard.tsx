import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const insights = [
  "Performance path projects are showing an average cost saving of $5,400 compared to prescriptive builds.",
  "Airtightness has improved by 8% on average across all projects in the last quarter.",
  "Tier 2 is the most commonly achieved tier for new projects, making up 45% of submissions.",
  "Natural Gas remains the dominant heating source, used in over 80% of projects."
];

const KeyInsightsCard = () => {
  // For now, we'll just show the first two insights. This can be made dynamic later.
  const displayedInsights = insights.slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedInsights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="h-2 w-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">{insight}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyInsightsCard;