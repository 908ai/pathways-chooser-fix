// src/components/NBCCalculator/utils/helpers.ts

// Function to format pathway display name
export const getPathwayDisplayName = (compliancePath: string) => { 
  if (compliancePath === '9365') {
    return 'NBC 9.36.5 Performance Path';
  } else if (compliancePath === '9362') {
    return 'NBC 9.36.2-9.36.4 Prescriptive Path';
  } else if (compliancePath === '9367') {
    return 'NBC 9.36.7 Tiered Performance Path';
  } else if (compliancePath === '9368') {
    return 'NBC 9.36.8 Tiered Prescriptive Path';
  }
  return '';
};

// Helper function to check if building type is single-detached (including secondary suite)
export const isSingleDetached = (buildingType: string) => { 
  return buildingType === 'single-detached' || buildingType === 'single-detached-secondary';
};
