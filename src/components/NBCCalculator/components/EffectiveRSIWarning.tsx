import { WarningButton } from "@/components/ui/WarningButton";
import { Link as LinkIcon } from "lucide-react";

export const EffectiveRSIWarning = () => {
    return (
        <WarningButton title="Effective RSI/R-Value Required">
            <div className="space-y-3">
                <p>
                    You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately.
                </p>
                <p>
                    The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it.
                </p>
                <p>
                    Supporting documentation (such as results from the <a href="https://natural-resources.canada.ca/energy-efficiency/energy-star/tables-calculating-effective-thermal-resistance-opaque-assemblies" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300">NRCan RSI tables</a> or the <a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications.
                </p>
                <p>
                    On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                </p>
                <div className="pt-2">
                    <a href="/find-a-provider" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 text-sm inline-flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Find a service provider for calculations
                    </a>
                </div>
            </div>
        </WarningButton>
    );
};