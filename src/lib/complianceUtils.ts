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