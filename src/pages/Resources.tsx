import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ExternalLink } from 'lucide-react';

const ResourcesPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Resources</h1>
          <p className="text-slate-500 mt-1">
            Guides, timelines, and technical services for NBC 9.36 compliance.
          </p>
        </div>
        <div className="space-y-6 max-w-5xl mx-auto">
          <Card className="bg-white shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Clock className="h-5 w-5 text-slate-500" />
                File Processing Timeline & Expectations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="mb-3">
                  Our streamlined process ensures efficient delivery of your energy compliance reports.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Day 1-2</div>
                    <div className="text-sm text-blue-700">Project review & initial assessment</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-800">Day 3-5</div>
                    <div className="text-sm text-orange-700">Initial modeling & recommendations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Upon Compliance</div>
                    <div className="text-sm text-green-700">Invoice → Payment → Report Release</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  * Should files be sent back for corrections, the timeline resets to day 1. Reports are delivered through this portal for easy access and download.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800 mb-1">Per-Project Clients</div>
                    <div className="text-sm text-purple-700">Reports released after payment processing</div>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="font-semibold text-teal-800 mb-1">Monthly Invoicees</div>
                    <div className="text-sm text-teal-700">Reports released immediately upon compliance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">Energy Code Resources</CardTitle>
                <CardDescription className="text-slate-500">
                  Essential guides for NBC 2020 compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://solinvictusenergyservices.com/energy-hack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                    <span>Energy Code Hack</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600">Learn which compliance pathway saves you the most money - up to $5000 in potential savings</div>
                </a>
                <a
                  href="https://solinvictusenergyservices.com/airtightness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                    <span>Airtightness Requirements</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600">Regional requirements for air-tightness testing in BC, Alberta, and Saskatchewan</div>
                </a>
                <a
                  href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                    <span>Blower Door Checklist (PDF)</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600">Complete checklist for blower door testing procedures</div>
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">Technical Services</CardTitle>
                <CardDescription className="text-slate-500">
                  Professional calculations and assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://solinvictusenergyservices.com/cancsa-f28012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                    <span>CAN/CSA F280-12 Heat Loss/Gain</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-600">Room-by-room calculations for properly sizing modern heating and cooling systems</div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;