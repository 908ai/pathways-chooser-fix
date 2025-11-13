import { WarningButton } from "@/components/ui/WarningButton";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const EffectiveRSIWarning = () => {
    return (
        <WarningButton title="ℹ️ Effective RSI/R-Value Required">
            <div className="space-y-4">
                <p className="text-white">
                    You must provide calculated proof that each part of the building envelope meets or exceeds the required effective RSI value, using approved methods like the isothermal planes approach. Each wall type — including exterior walls, tall walls, walls next to garages, and attic-adjacent walls like skylight shafts — must be calculated separately. The lowest-performing RSI value should be used in this calculator, unless you choose a single target RSI and ensure all assemblies are built to meet or exceed it. Supporting documentation (such as results from the 🔗<a href="https://natural-resources.canada.ca/energy-efficiency/homes/make-your-home-more-energy-efficient/keeping-the-heat-in/keeping-the-heat-in-chapter-4-insulation/maintaining-effective-thermal-resistance/15631" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">NRCan RSI tables</a> or the 🔗<a href="https://cwc.ca/design-tool/effectiver/" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Canadian Wood Council calculator</a>) must be included in your design drawings and specifications. On-site testing is not required, but interpolation is not permitted, and all assemblies must still comply with the minimum Code requirements.
                </p>
                <Button asChild variant="secondary" className="h-6 px-2 text-xs">
                    <a href="/find-a-provider" target="_blank" rel="noopener noreferrer">
                        <Search className="h-4 w-4" />
                        Find a service provider
                    </a>
                </Button>
            </div>
        </WarningButton>
    );
};