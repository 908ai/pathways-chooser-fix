import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import BuildingOfficialContact from '@/components/BuildingOfficialContact';

const BuildingOfficialsPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">For Building Officials</h1>
          <p className="text-slate-500 mt-1">
            Supporting builders in meeting NBC Section 9.36 energy efficiency requirements
          </p>
        </div>
        <Card className="bg-white shadow-sm rounded-lg max-w-4xl mx-auto">
          <CardContent className="p-6 space-y-6 text-slate-600">
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
              <p>
                This tool is designed to support builders in meeting the energy efficiency requirements of NBC Section 9.36 (Tier 1 or Tier 2) through either the Prescriptive or Performance Path, using energy modelling to identify compliant, cost-effective upgrade options.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">How Do Building Officials Benefit From This Tool?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">Clear, jurisdiction-ready documentation:</p>
                    <p className="text-sm text-slate-600">All compliance reports are formatted to meet NBC 9.36 requirements and tailored to your jurisdiction's specific expectations—making your review process faster and easier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">Simplified review process:</p>
                    <p className="text-sm text-slate-600">Our reports include prescriptive checklists and performance summaries that minimize back-and-forth with applicants. As energy code specialists, we also provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">Confidence in verification:</p>
                    <p className="text-sm text-slate-600">All models are prepared and reviewed by qualified energy professionals, ensuring accuracy and adherence to compliance standards.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">Consistent interpretation:</p>
                    <p className="text-sm text-slate-600">The tool promotes consistency across builders and projects by applying a uniform standard for Tier 1 and Tier 2 compliance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-800 mb-1">Fewer errors at intake:</p>
                    <p className="text-sm text-slate-600">Builders are guided through compliant upgrade paths from the outset, reducing the likelihood of non-conforming submissions and rework during permitting.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">Performance Path</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">We use HOT2000, a Natural Resources Canada–approved software, to model building performance according to NBC 9.36.5.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">A Proposed House is created using your building plans, envelope specifications and mechanical systems.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">A Reference House is generated based on the Proposed House and NBC2020's minimum requirements.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">The proposed house is then optimized to meet or exceed the performance of the Reference House.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">Modelling results are reviewed and verified by an NRCan-registered Energy Advisor or qualified consultant.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">Ongoing support for revisions or re-submissions as needed (billable).</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Prescriptive Path</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">A Prescriptive Path Report is generated once the builder submits basic project information. This includes required component specs for Tier 1 and Tier 2 based on Climate Zone 7A (or 7B for Alberta).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">For Tier 2, the app automatically calculates points and confirms if compliance is achieved.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">Component upgrades and trade-offs used to meet compliance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">Documentation suitable for permitting submissions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-600">Ongoing support for revisions or re-submissions as needed (billable).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Builder Responsibilities</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-600">Builders are responsible for submitting final mechanical specs, window information and building assemblies for verification.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-600">All design changes that affect energy performance must be communicated to the energy advisor (Performance) or AHJ (Prescriptive) prior to construction to maintain compliance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-600">Final compliance is subject to approval by the Authority Having Jurisdiction (AHJ).</p>
                </div>
              </div>
            </div>
            
            <BuildingOfficialContact />

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default BuildingOfficialsPage;