import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { HelpCircle, X } from "lucide-react";
import ContactBanner from "@/components/NBCCalculator/sections/ContactBanner";

interface HelpDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const HelpDrawer = ({ open, onOpenChange }: HelpDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transform hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        >
          <HelpCircle style={{ width: 35, height: 35 }} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background text-foreground border-t">
        <div className="mx-auto w-full max-w-4xl relative">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center text-foreground">
              Getting Started & Instructions
            </DrawerTitle>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3 rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
          <div className="p-4 pb-8 text-muted-foreground max-h-[80vh] overflow-y-auto">
            <div className="space-y-4 text-sm">
              <p>
                Welcome! This tool helps you compare different energy code compliance paths under NBC 2020 Part 9 — including both the Prescriptive and Performance options.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground text-base">Please follow these instructions:</h4>
                
                <div className="space-y-3">
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
                    <h5 className="font-medium text-foreground mb-2 text-base">4. Need Help?</h5>
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
            <div className="mt-6">
              <ContactBanner />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HelpDrawer;