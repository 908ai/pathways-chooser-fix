import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const ResourcesTab = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Clock className="h-5 w-5" />
            File Processing Timeline & Expectations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-200 space-y-4">
          <div className="p-4 bg-slate-800/60 border border-blue-400/30 rounded-lg">
            <p className="mb-3">
              Our streamlined process ensures efficient delivery of your energy compliance reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                <div className="font-semibold text-blue-300">Day 1-2</div>
                <div className="text-sm">Project review & initial assessment</div>
              </div>
              <div className="text-center p-3 bg-orange-900/30 rounded-lg">
                <div className="font-semibold text-orange-300">Day 3-5</div>
                <div className="text-sm">Initial modeling & recommendations</div>
              </div>
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <div className="font-semibold text-green-300">Upon Compliance</div>
                <div className="text-sm">Invoice → Payment → Report Release</div>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              * Should files be sent back for corrections, the timeline resets to day 1. Reports are delivered through this portal for easy access and download.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <div className="font-semibold text-purple-300 mb-1">Per-Project Clients</div>
                <div className="text-sm">Reports released after payment processing</div>
              </div>
              <div className="p-3 bg-teal-900/30 rounded-lg">
                <div className="font-semibold text-teal-300 mb-1">Monthly Invoicees</div>
                <div className="text-sm">Reports released immediately upon compliance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Energy Code Resources</CardTitle>
            <CardDescription className="text-slate-200">
              Essential guides for NBC 2020 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://solinvictusenergyservices.com/energy-hack"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
            >
              <div className="font-medium text-white mb-1">Energy Code Hack</div>
              <div className="text-sm text-slate-300">Learn which compliance pathway saves you the most money - up to $5000 in potential savings</div>
            </a>
            <a
              href="https://solinvictusenergyservices.com/airtightness"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
            >
              <div className="font-medium text-white mb-1">Airtightness Requirements</div>
              <div className="text-sm text-slate-300">Regional requirements for air-tightness testing in BC, Alberta, and Saskatchewan</div>
            </a>
            <a
              href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
            >
              <div className="font-medium text-white mb-1">Blower Door Checklist (PDF)</div>
              <div className="text-sm text-slate-300">Complete checklist for blower door testing procedures</div>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Technical Services</CardTitle>
            <CardDescription className="text-slate-200">
              Professional calculations and assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://solinvictusenergyservices.com/cancsa-f28012"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-800/60 border border-slate-600/50 rounded-lg hover:border-blue-400/50 transition-colors"
            >
              <div className="font-medium text-white mb-1">CAN/CSA F280-12 Heat Loss/Gain</div>
              <div className="text-sm text-slate-300">Room-by-room calculations for properly sizing modern heating and cooling systems</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesTab;