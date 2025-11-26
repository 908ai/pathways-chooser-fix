import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

// Define the structure for an insight
interface Insight {
  title: string;
  stats: {
    value: string;
    label: string;
  }[];
  progress: {
    value: number;
    label: string;
  };
}

// Create a list of insights
const insights: Insight[] = [
  {
    title: "Portfolio performance is trending up by 12% this quarter.",
    stats: [
      { value: "105.5 GJ", label: "AVG CONSUMPTION" },
      { value: "Tier 2", label: "AVG TARGET LEVEL" },
    ],
    progress: { value: 85, label: "COMPLIANCE RATE" },
  },
  {
    title: "Performance pathways are saving an average of $5,400 per project.",
    stats: [
      { value: "$8,150", label: "AVG PERFORMANCE COST" },
      { value: "$13,550", label: "AVG PRESCRIPTIVE COST" },
    ],
    progress: { value: 40, label: "% COST SAVING" },
  },
  {
    title: "Upgrading to triple-pane windows is the most common path to Tier 2.",
    stats: [
      { value: "65%", label: "OF TIER 2 PROJECTS" },
      { value: "1.22 U", label: "AVG U-VALUE" },
    ],
    progress: { value: 65, label: "ADOPTION RATE" },
  },
  {
    title: "Airtightness improvements show the highest point gains for Tiered projects.",
    stats: [
      { value: "+9.3 pts", label: "AVG GAIN (AL-3A)" },
      { value: "1.5 ACH", label: "COMMON TARGET" },
    ],
    progress: { value: 75, label: "% PROJECTS TESTED" },
  },
  {
    title: "Performance pathways are chosen in 78% of new projects.",
    stats: [
      { value: "78%", label: "PERFORMANCE PATH" },
      { value: "22%", label: "PRESCRIPTIVE PATH" },
    ],
    progress: { value: 78, label: "PERFORMANCE ADOPTION" },
  },
];

const EfficiencyInsightCard = () => {
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);

  useEffect(() => {
    // Select a random insight when the component mounts
    const randomIndex = Math.floor(Math.random() * insights.length);
    setCurrentInsight(insights[randomIndex]);
  }, []);

  if (!currentInsight) {
    // Return a loading state or null while the insight is being selected
    return null; 
  }

  return (
    <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg rounded-xl p-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs w-fit mb-4">
              <Zap className="h-4 w-4" />
              <span>Efficiency Insight</span>
            </div>
            <h2 className="text-2xl font-bold">{currentInsight.title}</h2>
            <div className="flex gap-8 mt-4">
              {currentInsight.stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-80">{stat.label}</p>
                </div>
              ))}
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
                strokeDasharray={`${currentInsight.progress.value}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{currentInsight.progress.value}%</span>
              <span className="text-xs">{currentInsight.progress.label}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EfficiencyInsightCard;