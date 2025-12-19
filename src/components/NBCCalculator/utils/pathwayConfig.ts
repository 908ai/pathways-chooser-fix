import { Zap, FileText } from "lucide-react";

export type PathwayConfig = {
  label: string;
  icon: React.ElementType;
  colorClass: string;
};

export const PATHWAY_CONFIG: Record<string, PathwayConfig> = {
  "9362": {
    label: "Prescriptive",
    icon: FileText,
    colorClass: "text-orange-500",
  },
  "9368": {
    label: "Tiered Prescriptive",
    icon: FileText,
    colorClass: "text-orange-500",
  },
  "9365": {
    label: "Performance",
    icon: Zap,
    colorClass: "text-blue-500",
  },
  "9367": {
    label: "Tiered Performance",
    icon: Zap,
    colorClass: "text-blue-500",
  },
};
