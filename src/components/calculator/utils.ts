// Helper function to validate RSI values for 9.36.2 (simplified - RSI only)
export const validateRSI_9362 = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  // Simple RSI validation - only check if below minimum
  if (numValue < minRSI) {
    return {
      isValid: false,
      warning: {
        type: "too-low",
        message: `The RSI value must be increased to at least ${minRSI} to meet NBC 9.36.2 requirements for ${fieldName}.`
      }
    };
  }
  return {
    isValid: true,
    warning: null
  };
};

// Helper function for other sections (keeps R-value detection)
export const validateRSI = (inputValue: string, minRSI: number, fieldName: string) => {
  if (!inputValue) return {
    isValid: true,
    warning: null
  };
  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) return {
    isValid: true,
    warning: null
  };

  // If the value is suspiciously high, it might be an R-value instead of RSI
  // RSI to R-value conversion: R = RSI × 5.678
  const suspectedRValue = numValue / 5.678;
  const minRValue = minRSI * 5.678;

  // Check if this appears to be an R-value that's too low (below R30)
  if (numValue >= 10 && numValue < 30) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-too-low",
        message: `This appears to be an R-value (${numValue.toFixed(1)}) which is too low. R-values should be at least R30. Please enter a higher R-value or the equivalent RSI value.`
      }
    };
  }

  // Check if this appears to be a valid R-value that should be converted to RSI
  if (numValue > minRSI * 3 && numValue >= 30 && suspectedRValue >= minRSI * 0.8 && suspectedRValue <= minRSI * 1.2) {
    return {
      isValid: false,
      warning: {
        type: "rvalue-suspected",
        message: `This appears to be an R-value (${numValue.toFixed(1)}). Did you mean RSI ${suspectedRValue.toFixed(2)}? Please enter the RSI value, not the R-value.`
      }
    };
  }

  // Standard RSI validation
  if (numValue < minRSI) {
    return {
      isValid: false,
      warning: {
        type: "too-low",
        message: `The RSI value must be increased to at least ${minRSI} to meet NBC requirements for ${fieldName}.`
      }
    };
  }
  return {
    isValid: true,
    warning: null
  };
};

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