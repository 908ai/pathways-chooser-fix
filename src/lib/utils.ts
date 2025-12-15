import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getProjectStatusPillClass = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Revisions Requested':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Submitted for Review':
      return 'bg-blue-100 text-blue-800';
    case 'Draft':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};