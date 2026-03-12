export const F280_REQUIRED_CITIES = ["red deer", "innisfail", "medicine hat"];

export const isF280Required = (city: string | null | undefined, province: string | null | undefined): boolean => {
  if (!city || !province) return false;
  const normalizedCity = city.toLowerCase().trim();
  const normalizedProvince = province.toLowerCase().trim();
  
  if (normalizedProvince !== "alberta") return false;
  
  return F280_REQUIRED_CITIES.includes(normalizedCity);
};
