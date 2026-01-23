import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle, X } from "lucide-react";
import ContactBanner from "@/components/NBCCalculator/sections/ContactBanner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const HelpDrawer = ({ open, onOpenChange }: HelpDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transform hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <HelpCircle style={{ width: 35, height: 35 }} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-background border-l">
        <div className="p-6 border-b">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-left text-foreground pr-8">
              Getting Started & Instructions
            </SheetTitle>
          </SheetHeader>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 pb-20">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Welcome! This tool helps you compare different energy code compliance paths under NBC 2020 Part 9 — including both the Prescriptive and Performance options.
              </p>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-foreground text-base">Please follow these instructions:</h4>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-base">1. Choose Your Code Pathway:</h5>
                     <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                       <li>You can follow either the Prescriptive Path (NBC 9.36.2–9.36.4 or 9.36.8 including the Trade-Off option - Article 9.36.2.11) or the Performance Path (NBC 9.36.5 or 9.36.7).</li>
                       <li>Look for the info icons to learn more about how each option affects your project. If you see an orange warning icon, click it to view important details or additional information required for that choice.</li>
                       <li>If you're unsure, we recommend starting with inputs and reviewing your results before deciding or giving us a call directly.</li>
                     </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-base">2. Enter Your Building Details:</h5>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                      <li>Input values for insulation (attic, walls, slab), mechanical systems (heating, cooling, hot water, ventilation), and windows/doors.</li>
                      <li>Select values as accurately as possible. Estimated or placeholder values are okay - we'll flag anything that needs clarification.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-base">3. Understand What You'll See:</h5>
                     <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                       <li>As you make your selections, the app will calculate compliance and high-level cost estimates for both pathways in the background. You'll see upgrade cost comparisons and energy performance insights to help guide your decisions. Results can be tailored to reflect your specific project details.</li>
                     </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-base">4. Additional information required for all pathways:</h5>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                      <li>Identify on the plans any/all assemblies containing heating pipes, cables, or membranes.</li>
                      <li>Indicate the air barrier system being proposed.</li>
                      <li>Provide the following architectural details indicating continuity of insulation and air barrier: Attic hatch, eaves/top of wall, upper floor rim joist, top of basement wall/main floor junction, slab/footing junction, cantilever, bonus room floor over attached garage including ducts, typical outlet box detail, typical window/door jamb.</li>
                    </ul>
                    <div className="ml-6 mt-3 space-y-2 text-muted-foreground text-sm border-l-2 border-primary/20 pl-4 py-1">
                      <p>
                        <span className="font-semibold text-foreground">Note:</span> if Hot Water recirculation is proposed, and the thickness and extent of pipe insulation in the Service Hot Water system.
                      </p>
                      <p>
                        And, if applicable: Party wall meeting outside wall, electric meter/vent pipe/duct in insulated wall, skylight shaft walls, slab edges in walkouts & heated slabs, masonry chimneys and fireplaces.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-foreground mb-2 text-base">5. Need Help?</h5>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                      <li>If you have any questions, just click the "Contact Us" button. You'll talk to a real person from our local team - we're here to help you understand your options.</li>
                    </ul>
                  </div>
                </div>

                 
                  <div className="mt-4 p-4 bg-muted border rounded-lg">
                    <div className="space-y-3">
                      <h5 className="font-bold text-foreground">
                        Application Processing Notice
                      </h5>
                      <p className="text-muted-foreground">
                        Incomplete applications may delay results for both Prescriptive & Performance Path. Our team may follow up if additional info is needed.
                      </p>
                    </div>
                  </div>
              </div>
            </div>
            <div className="mt-8">
              <ContactBanner />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HelpDrawer;