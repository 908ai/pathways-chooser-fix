export const F280_REQUIRED_CITIES = ["red deer", "innisfail", "medicine hat"];

export const isF280Required = (city: string | null | undefined, province: string | null | undefined, compliancePath?: string): boolean => {
  if (!city || !province) return false;
  const normalizedCity = city.toLowerCase().trim();
  const normalizedProvince = province.toLowerCase().trim();
  
  if (normalizedProvince !== "alberta") return false;

  // Medicine Hat requires F280 for ALL application paths
  if (normalizedCity === "medicine hat") return true;

  // Red Deer and Innisfail require F280 for Prescriptive and Performance paths
  // Note: All currently supported paths (9362, 9365, 9367, 9368) are either Prescriptive or Performance
  const isRedDeerOrInnisfail = normalizedCity === "red deer" || normalizedCity === "innisfail";
  if (isRedDeerOrInnisfail) {
    // If compliancePath is not provided, we assume it's one of the regulated paths 
    // since the calculator only handles these paths.
    if (!compliancePath) return true;
    
    const prescriptivePaths = ["9362", "9368"];
    const performancePaths = ["9365", "9367"];
    return prescriptivePaths.includes(compliancePath) || performancePaths.includes(compliancePath);
  }

  return false;
};

export const getTierCompliance = (totalPoints: number, hasHrv: string | null) => {
  if (hasHrv === "no_hrv" || hasHrv === "without_hrv" || hasHrv === "None") {
    return {
      tier: "Not Applicable",
      status: "destructive",
      description: "Prescriptive path requires HRV/ERV"
    };
  }
  if (totalPoints >= 75) return {
    tier: "Tier 5",
    status: "success",
    description: "75+ points + 15 envelope points"
  };
  if (totalPoints >= 40) return {
    tier: "Tier 4",
    status: "success",
    description: "40+ points + 10 envelope points"
  };
  if (totalPoints >= 20) return {
    tier: "Tier 3",
    status: "success",
    description: "20+ points + 5 envelope points"
  };
  if (totalPoints >= 10) return {
    tier: "Tier 2",
    status: "success",
    description: "10+ points"
  };
  return {
    tier: "Tier 1",
    status: "warning",
    description: "Baseline compliance (0 points required)"
  };
};