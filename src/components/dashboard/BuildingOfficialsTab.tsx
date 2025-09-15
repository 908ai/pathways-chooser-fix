import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BuildingOfficialsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>For Building Officials</CardTitle>
        <CardDescription>
          Supporting builders in meeting NBC Section 9.36 energy efficiency requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary border rounded-lg">
          <p className="mb-4 text-secondary-foreground">
            This tool is designed to support builders in meeting the energy efficiency requirements of NBC Section 9.36 (Tier 1 or Tier 2) through either the Prescriptive or Performance Path, using energy modelling to identify compliant, cost-effective upgrade options.
          </p>
        </div>

        <div className="p-4 bg-secondary border rounded-lg">
          <h3 className="text-lg font-semibold text-success mb-4">How Do Building Officials Benefit From This Tool?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Clear, jurisdiction-ready documentation:</p>
                <p className="text-sm text-muted-foreground">All compliance reports are formatted to meet NBC 9.36 requirements and tailored to your jurisdiction's specific expectations—making your review process faster and easier.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Simplified review process:</p>
                <p className="text-sm text-muted-foreground">Our reports include prescriptive checklists and performance summaries that minimize back-and-forth with applicants. As energy code specialists, we also provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Confidence in verification:</p>
                <p className="text-sm text-muted-foreground">All models are prepared and reviewed by qualified energy professionals, ensuring accuracy and adherence to compliance standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Consistent interpretation:</p>
                <p className="text-sm text-muted-foreground">The tool promotes consistency across builders and projects by applying a uniform standard for Tier 1 and Tier 2 compliance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Fewer errors at intake:</p>
                <p className="text-sm text-muted-foreground">Builders are guided through compliant upgrade paths from the outset, reducing the likelihood of non-conforming submissions and rework during permitting.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-secondary border rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-4">Performance Path</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">We use HOT2000, a Natural Resources Canada–approved software, to model building performance according to NBC 9.36.5.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">A Reference House is generated based on NBC2020's minimum requirements.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">The proposed house is then optimized to meet or exceed the performance of the Reference House.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Modelling results are reviewed and verified by an NRCan-registered Energy Advisor or qualified consultant.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Ongoing support for revisions or re-submissions as needed (billable)</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-secondary border rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-4">Prescriptive Path</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">A Prescriptive Path Report is generated once the builder submits basic project information. This includes required component specs for Tier 1 and Tier 2 based on Climate Zone 7A (or 7B for Alberta).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">For Tier 2, the app automatically calculates points and confirms if compliance is achieved.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Component upgrades and trade-offs used to meet compliance</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Documentation suitable for permitting submissions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-muted-foreground">Ongoing support for revisions or re-submissions as needed (billable)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h3 className="text-lg font-semibold text-destructive mb-4">Builder Responsibilities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">Builders are responsible for submitting final mechanical specs, window information and building assemblies for verification.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">All design changes that affect energy performance must be communicated to the energy advisor (Performance) or AHJ (Prescriptive) prior to construction to maintain compliance.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-muted-foreground">Final compliance is subject to approval by the Authority Having Jurisdiction (AHJ).</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary border rounded-lg">
          <h3 className="text-lg font-semibold text-primary mb-4">Need to Verify Something?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We welcome questions from plan reviewers or inspectors.
          </p>
          <Button variant="default" className="w-full sm:w-auto" asChild>
            <a href="mailto:info@sies.energy?subject=Building Official Inquiry">
              Contact Our Team
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingOfficialsTab;