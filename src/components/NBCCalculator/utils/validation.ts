// src/components/NBCCalculator/utils/validation.ts
// Validation utilities for NBC Calculator

export type ThermalWarningType =
  | "too-low"
  | "rvalue-detected"
  | "rvalue-possible";

export type ThermalWarning = {
  type: ThermalWarningType;
  message: string;
};

export type ThermalValidationResult = {
  // "isValid" should only be false for true blocking errors (e.g., below minimum RSI)
  isValid: boolean;

  // Blocking error (if any). Kept separate from warning so UI can style correctly.
  error: ThermalWarning | null;

  // Non-blocking warning/info (e.g., R-value detected/possible)
  warning: ThermalWarning | null;

  meta?: {
    interpretedAs: "RSI" | "R" | "AMBIGUOUS" | "UNKNOWN";
    inputNumber: number | null;
    rsiValue: number | null;
    rValue: number | null;
    confidence: "high" | "medium" | "low";
  };
};

const RSI_TO_R_FACTOR = 5.678;

type ValidateThermalOptions = {
  /**
   * Allow detecting likely R-values and suggesting conversion.
   * This does NOT make the field invalid; it's only a warning.
   */
  allowRValueDetection?: boolean;

  /**
   * RSI-to-R conversion factor.
   * Kept configurable for future-proofing; defaults to 5.678.
   */
  rsiToRFactor?: number;

  /**
   * If true, supports explicit "R-20", "R20", "RSI 3.5" formats.
   * Your current inputs block letters, but paste could still include it.
   */
  allowUnitPrefixes?: boolean;
};

/**
 * Parse numeric input, optionally supporting explicit unit prefixes like "R-20" or "RSI 3.5".
 */
function parseThermalInput(
  inputValue: string,
  opts: { allowUnitPrefixes: boolean }
): { num: number | null; explicitUnit: "R" | "RSI" | null } {
  const raw = (inputValue || "").trim();
  if (!raw) return { num: null, explicitUnit: null };

  if (opts.allowUnitPrefixes) {
    // Examples: "R-20", "R20", "R 20", "RSI 3.5"
    const rMatch = raw.match(/^R\s*-?\s*(\d+(?:\.\d+)?)$/i);
    if (rMatch) {
      const n = parseFloat(rMatch[1]);
      return { num: Number.isFinite(n) ? n : null, explicitUnit: "R" };
    }

    const rsiMatch = raw.match(/^RSI\s*-?\s*(\d+(?:\.\d+)?)$/i);
    if (rsiMatch) {
      const n = parseFloat(rsiMatch[1]);
      return { num: Number.isFinite(n) ? n : null, explicitUnit: "RSI" };
    }
  }

  // Plain number
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return { num: null, explicitUnit: null };
  return { num: n, explicitUnit: null };
}

/**
 * Decide whether a numeric value is more likely RSI or R-value based on minRSI context.
 * This returns a warning (non-blocking) when evidence is strong enough.
 *
 * Key design goal: avoid false positives (e.g. user enters 10 when minRSI is 5).
 */
function detectRValue(
  numValue: number,
  minRSI: number,
  fieldName: string,
  factor: number
): {
  interpretedAs: "RSI" | "R" | "AMBIGUOUS";
  warning: ThermalWarning | null;
  confidence: "high" | "medium" | "low";
  rsiValueAssumingRSI: number;
  rsiValueAssumingR: number;
  rValueAssumingRSI: number;
} {
  const rsiA = numValue; // assume it's RSI
  const rsiB = numValue / factor; // assume it's R
  const rAssumingRSI = numValue * factor;

  // Conservative thresholds derived from minRSI, not fixed global values:
  // - values extremely larger than typical RSI for that assembly are likely R.
  // - keep this conservative to avoid "10 triggers R-warning" for minRSI 5.
  const strongRThreshold = Math.max(25, minRSI * 5); // strong evidence of R
  const possibleRThreshold = Math.max(18, minRSI * 3.5); // medium evidence of R

  // If numValue is extremely large relative to minRSI, almost certainly R.
  if (numValue >= strongRThreshold) {
    return {
      interpretedAs: "R",
      confidence: "high",
      warning: {
        type: "rvalue-detected",
        message: `This looks like an R-value (${numValue.toFixed(1)}). That equals approximately RSI ${rsiB.toFixed(
          2
        )}. Please enter RSI (metric) for ${fieldName}.`,
      },
      rsiValueAssumingRSI: rsiA,
      rsiValueAssumingR: rsiB,
      rValueAssumingRSI: rAssumingRSI,
    };
  }

  // Medium evidence: in a range where many users commonly enter R by habit,
  // AND the converted RSI lands near the minimum (classic confusion case).
  const nearMinBandLow = minRSI * 0.7;
  const nearMinBandHigh = minRSI * 1.3;

  const convertedLooksLikeTarget =
    rsiB >= nearMinBandLow && rsiB <= nearMinBandHigh;

  if (numValue >= possibleRThreshold && convertedLooksLikeTarget) {
    return {
      interpretedAs: "AMBIGUOUS",
      confidence: "medium",
      warning: {
        type: "rvalue-possible",
        message: `This could be an R-value (${numValue.toFixed(1)}). If so, that equals about RSI ${rsiB.toFixed(
          2
        )}. If you intended RSI, ignore this message.`,
      },
      rsiValueAssumingRSI: rsiA,
      rsiValueAssumingR: rsiB,
      rValueAssumingRSI: rAssumingRSI,
    };
  }

  // Default: treat as RSI (no warning). This avoids false positives like "10" for minRSI 5.
  return {
    interpretedAs: "RSI",
    confidence: "low",
    warning: null,
    rsiValueAssumingRSI: rsiA,
    rsiValueAssumingR: rsiB,
    rValueAssumingRSI: rAssumingRSI,
  };
}

/**
 * Unified validation for thermal values.
 * - Computes an RSI value used for minimum checks.
 * - Detects likely R-values as non-blocking warnings.
 * - Only blocks when the effective RSI is below the minimum.
 */
export const validateThermalValue = (
  inputValue: string,
  minRSI: number,
  fieldName: string,
  options: ValidateThermalOptions = {}
): ThermalValidationResult => {
  const factor = options.rsiToRFactor ?? RSI_TO_R_FACTOR;
  const allowR = options.allowRValueDetection ?? true;
  const allowUnitPrefixes = options.allowUnitPrefixes ?? true;

  const parsed = parseThermalInput(inputValue, { allowUnitPrefixes });

  if (parsed.num === null) {
    return {
      isValid: true,
      error: null,
      warning: null,
      meta: {
        interpretedAs: "UNKNOWN",
        inputNumber: null,
        rsiValue: null,
        rValue: null,
        confidence: "low",
      },
    };
  }

  const numValue = parsed.num;

  // If explicitly tagged by user (paste), treat with high confidence.
  if (parsed.explicitUnit === "R") {
    const rsi = numValue / factor;
    const rWarning: ThermalWarning = {
      type: "rvalue-detected",
      message: `R-value detected (${numValue.toFixed(1)}). That equals approximately RSI ${rsi.toFixed(
        2
      )}. Please enter RSI (metric) for ${fieldName}.`,
    };

    const belowMin = rsi < minRSI;

    return {
      isValid: !belowMin,
      error: belowMin
        ? {
            type: "too-low",
            message: `The RSI value must be increased to at least ${minRSI} to meet NBC requirements for ${fieldName}.`,
          }
        : null,
      warning: allowR ? rWarning : null,
      meta: {
        interpretedAs: "R",
        inputNumber: numValue,
        rsiValue: rsi,
        rValue: numValue,
        confidence: "high",
      },
    };
  }

  if (parsed.explicitUnit === "RSI") {
    const rsi = numValue;
    const belowMin = rsi < minRSI;

    return {
      isValid: !belowMin,
      error: belowMin
        ? {
            type: "too-low",
            message: `The RSI value must be increased to at least ${minRSI} to meet NBC requirements for ${fieldName}.`,
          }
        : null,
      warning: null,
      meta: {
        interpretedAs: "RSI",
        inputNumber: numValue,
        rsiValue: rsi,
        rValue: rsi * factor,
        confidence: "high",
      },
    };
  }

  // No explicit unit; apply heuristic only if allowed.
  let interpretedAs: "RSI" | "R" | "AMBIGUOUS" = "RSI";
  let warning: ThermalWarning | null = null;
  let confidence: "high" | "medium" | "low" = "low";

  if (allowR) {
    const detected = detectRValue(numValue, minRSI, fieldName, factor);
    interpretedAs = detected.interpretedAs;
    warning = detected.warning;
    confidence = detected.confidence;
  }

  // IMPORTANT: for validation, default to treating input as RSI.
  // We do NOT auto-convert silently (unless explicitly tagged as R).
  // This avoids surprising behavior and false “fails”.
  const effectiveRSI = numValue;

  const belowMin = effectiveRSI < minRSI;

  return {
    isValid: !belowMin,
    error: belowMin
      ? {
          type: "too-low",
          message: `The RSI value must be increased to at least ${minRSI} to meet NBC requirements for ${fieldName}.`,
        }
      : null,
    warning,
    meta: {
      interpretedAs: interpretedAs === "AMBIGUOUS" ? "AMBIGUOUS" : interpretedAs,
      inputNumber: numValue,
      rsiValue: effectiveRSI,
      rValue: effectiveRSI * factor,
      confidence,
    },
  };
};

/**
 * Backwards-compatible wrapper for 9.36.2 sections.
 * Old contract: { isValid, warning }
 *
 * NOTE: warning may exist even when isValid=true (non-blocking info).
 */
export const validateRSI_9362 = (
  inputValue: string,
  minRSI: number,
  fieldName: string
) => {
  const res = validateThermalValue(inputValue, minRSI, fieldName, {
    allowRValueDetection: true,
    allowUnitPrefixes: true,
  });

  // Preserve legacy shape:
  // - If there's a blocking error, return it as warning and isValid=false (old behavior).
  // - Otherwise return isValid=true and warning (if any) as informational.
  if (res.error) {
    return { isValid: false, warning: res.error };
  }
  return { isValid: true, warning: res.warning };
};

/**
 * Backwards-compatible wrapper for other sections (previously had R detection).
 * Old contract: { isValid, warning }
 */
export const validateRSI = (
  inputValue: string,
  minRSI: number,
  fieldName: string
) => {
  const res = validateThermalValue(inputValue, minRSI, fieldName, {
    allowRValueDetection: true,
    allowUnitPrefixes: true,
  });

  if (res.error) {
    return { isValid: false, warning: res.error };
  }
  return { isValid: true, warning: res.warning };
};
