import { useNbcCalculator } from '@/hooks/useNbcCalculator';

export type CalculatorHook = ReturnType<typeof useNbcCalculator>;

export interface CalculatorSectionProps {
    calculator: CalculatorHook;
}