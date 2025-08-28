import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const InstructionsSection = () => {
  return (
    <Card className="border-2 border-slate-400/30 bg-gradient-to-r from-slate-800/40 to-teal-800/40 backdrop-blur-md shadow-2xl">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full" defaultValue="instructions">
          <AccordionItem value="instructions" className="border-none">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-teal-500 text-white text-sm font-semibold shadow-lg">
                  ?
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Getting Started & Instructions</h3>
                  <p className="text-sm text-slate-200">Energy Compliance Calculator Overview</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <p className="text-white">
                  Welcome! This tool helps you compare different energy code compliance paths under NBC 2020 Part 9 — including both the Prescriptive and Performance options.
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Please follow these instructions:</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-white mb-2">1. Choose Your Code Pathway:</h5>
                       <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                         <li>You can follow either the Prescriptive Path (NBC 9.36.2–9.36.4 or 9.36.8) or the Performance Path (NBC 9.36.5 or 9.36.7).</li>
                         <li>Look for the info icons to learn more about how each option affects your project. If you see an orange warning icon, click it to view important details or additional information required for that choice.</li>
                         <li>If you're unsure, we recommend starting with inputs and reviewing your results before deciding or giving us a call directly.</li>
                       </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">2. Enter Your Building Details:</h5>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>Input values for insulation (attic, walls, slab), mechanical systems (heating, cooling, hot water, ventilation), and windows/doors.</li>
                        <li>Select values as accurately as possible. Estimated or placeholder values are okay — we'll flag anything that needs clarification.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">3. Understand What You'll See:</h5>
                       <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                         <li>As you make your selections, the app will calculate compliance and cost estimates for both pathways in the background. You'll see upgrade cost comparisons and energy performance insights to help guide your decisions. Results can be tailored to reflect your specific project details.</li>
                       </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">4. Need Help?</h5>
                      <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>If you have any questions, just click the "Contact Us" button. You'll talk to a real person from our local team — we're here to help you understand your options.</li>
                      </ul>
                    </div>
                  </div>

                   
                    <div className="mt-4">
                      <div className="space-y-3">
                        <h4 className="text-lg font-bold text-white">
                          Application Processing Notice
                        </h4>
                        <p className="text-white font-semibold">
                          Incomplete applications may delay results for Performance Path. Our team may follow up if additional info is needed.
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default InstructionsSection;