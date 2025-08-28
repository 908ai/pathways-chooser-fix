import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NBCOption } from "./nbc-calculator-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPoints = (value: string, options: NBCOption[]): number => {
  if (!value) {
    return 0;
  }
  const option = options.find((opt) => opt.value === value);
  return option ? option.points : 0;
};