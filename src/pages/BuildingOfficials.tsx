import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';
import BuildingOfficialContact from '@/components/BuildingOfficialContact';

const BuildingOfficialsPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <Header showSignOut={true} onSignOut={signOut} pathwayInfo="" />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">For Building Officials</h1>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Supporting builders in meeting NBC Section 9.36 energy efficiency requirements
          </p>
        </div>
        <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardContent className="text-slate-200 space-y-6 pt-6">
            <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
              <p className="mb-4">
                This tool is designed to support builders in meeting the energy efficiency requirements of NBC Section 9.36 (Tier 1 or Tier 2) through either the Prescriptive or Performance Path, using energy modelling to identify compliant, cost-effective upgrade options.
              </p>
            </div>

            <div className="p-4 bg-slate-800/60 border border-green-400/30 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-4">How Do Building Officials Benefit From This Tool?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Clear, jurisdiction-ready documentation:</p>
                    <p className="text-sm text-slate-300">All compliance reports are formatted to meet NBC 9.36 requirements and tailored to your jurisdiction's specific expectations—making your review process faster and easier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Simplified review process:</p>
                    <p className="text-sm text-slate-300">Our reports include prescriptive checklists and performance summaries that minimize back-and-forth with applicants. As energy code specialists, we also provide technical support and applicant guidance—so you can focus on reviewing complete, code-aligned submissions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Confidence in verification:</p>
                    <p className="text-sm text-slate-300">All models are prepared and reviewed by qualified energy professionals, ensuring accuracy and adherence to compliance standards.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Consistent interpretation:</p>
                    <p className="text-sm text-slate-300">The tool promotes consistency across builders and projects by applying a uniform standard for Tier 1 and Tier 2 compliance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-slate-100 mb-1">Fewer errors at intake:</p>
                    <p className="text-sm text-slate-300">Builders are guided through compliant upgrade paths from the outset, reducing the likelihood of non-conforming submissions and rework during permitting.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-800/60 border border-orange-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-300 mb-4">Performance Path</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">We use HOT2000, a Natural Resources Canada–approved software, to model building performance according to NBC 9.36.5.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">A Reference House is generated based on NBC2020's minimum requirements.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">The proposed house is then optimized to meet or exceed the performance of the Reference House.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">Modelling results are reviewed and verified by an NRCan-registered Energy Advisor or qualified consultant.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">Ongoing support for revisions or re-submissions as needed (billable)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 border border-purple-400/30 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Prescriptive Path</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">A Prescriptive Path Report is generated once the builder submits basic project information. This includes required component specs for Tier 1 and Tier 2 based on Climate Zone 7A (or 7B for Alberta).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">For Tier 2, the app automatically calculates points and confirms if compliance is achieved.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">Component upgrades and trade-offs used to meet compliance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">Documentation suitable for permitting submissions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-300">Ongoing support for revisions or re-submissions as needed (billable)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 border border-red-400/30 rounded-lg">
              <h3 className="text-lg font-semibold text-red-300 mb-4">Builder Responsibilities</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">Builders are responsible for submitting final mechanical specs, window information and building assemblies for verification.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">All design changes that affect energy performance must be communicated to the energy advisor (Performance) or AHJ (Prescriptive) prior to construction to maintain compliance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">Final compliance is subject to approval by the Authority Having Jurisdiction (AHJ).</p>
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