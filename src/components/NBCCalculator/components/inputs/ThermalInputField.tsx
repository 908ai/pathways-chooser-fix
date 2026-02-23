import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EffectiveRSIWarning } from "../EffectiveRSIWarning";
import { validateRSI } from "@/components/NBCCalculator/utils/validation";

import {
    sanitizeOnChange,
    sanitizeOnBlur,
    shouldBlockKeyDown,
    InputMode,
} from "@/components/NBCCalculator/utils/inputSanitizers";

interface ThermalInputFieldProps {
    id: string;
    label: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    minRSI: number;
    fieldName: string;
    compliancePath?: string;
    placeholder?: string;
    required?: boolean;
    validationError?: boolean;
    isMissing?: boolean;
    missingFieldClass?: string;
    InfoCollapsible: any;
    allowNA?: boolean;
    keyword?: string;
    showEffectiveWarning?: boolean;
}

export default function ThermalInputField({
    id,
    label,
    value,
    onChange,
    minRSI,
    fieldName,
    placeholder,
    required,
    validationError,
    isMissing,
    missingFieldClass,
    InfoCollapsible,
    allowNA = false,
    keyword,
    showEffectiveWarning = true,
}: ThermalInputFieldProps) {

    // ----------------------------
    // Determine Sanitizer Mode
    // ----------------------------
    let mode: InputMode = "DECIMAL";

    if (keyword) {
        mode = "DECIMAL_OR_KEYWORD";
    } else if (allowNA) {
        mode = "DECIMAL_OR_NA";
    }

    const sanitizerConfig = {
        mode,
        maxDecimals: 2,
        keywordConfig: keyword
            ? {
                  keyword,
                  allowPrefixTyping: true,
              }
            : undefined,
    };

    const trimmed = (value || "").trim();

    const isNA = allowNA && trimmed.toUpperCase() === "N/A";
    const isKeyword =
        keyword &&
        trimmed.toLowerCase() === keyword.toLowerCase();

    return (
        <>
            <label className="text-sm font-medium text-foreground">
                {label} {required && <span className="text-red-400">*</span>}
            </label>

            <Input
                id={id}
                type="text"
                inputMode="decimal"
                value={value}
                placeholder={placeholder}
                onKeyDown={(e) => {
                    if (shouldBlockKeyDown(e, value, sanitizerConfig)) {
                        e.preventDefault();
                    }
                }}
                onChange={(e) => {
                    const result = sanitizeOnChange(e, sanitizerConfig);
                    onChange(result.value);
                }}
                onBlur={(e) => {
                    const result = sanitizeOnBlur(e, sanitizerConfig);
                    if (result.value !== value) {
                        onChange(result.value);
                    }
                }}
                className={cn(
                    (validationError || isMissing) && missingFieldClass,
                    validationError && "border-red-500 ring-2 ring-red-500"
                )}
            />

            {/* ---------- VALIDATION ---------- */}
            {(() => {
                if (!value) return null;
                if (isNA) return null;
                if (isKeyword) return null;

                const validation = validateRSI(value, minRSI, fieldName);

                if (!validation.warning) return null;

                return (
                    <InfoCollapsible
                        title={
                            validation.warning.type === "too-low"
                                ? "🛑 RSI Value Too Low"
                                : validation.warning.type === "rvalue-possible"
                                ? "Possible R-Value"
                                : "R-Value Detected"
                        }
                        variant={
                            validation.warning.type === "too-low"
                                ? "destructive"
                                : "warning"
                        }
                        defaultOpen={
                            validation.warning.type === "too-low"
                        }
                    >
                        <p className="text-xs">
                            {validation.warning.message}
                        </p>
                    </InfoCollapsible>
                );
            })()}

            {showEffectiveWarning && <EffectiveRSIWarning />}
        </>
    );
}