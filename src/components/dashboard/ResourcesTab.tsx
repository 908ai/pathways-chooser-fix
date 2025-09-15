import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const ResourcesTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            File Processing Timeline & Expectations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary border rounded-lg">
            <p className="mb-3 text-secondary-foreground">
              Our streamlined process ensures efficient delivery of your energy compliance reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-foreground">Day 1-2</div>
                <div className="text-sm text-muted-foreground">Project review & initial assessment</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-primary">Day 3-5</div>
                <div className="text-sm text-muted-foreground">Initial modeling & recommendations</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-success">Upon Compliance</div>
                <div className="text-sm text-muted-foreground">Invoice → Payment → Report Release</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              * Should files be sent back for corrections, the timeline resets to day 1. Reports are delivered through this portal for easy access and download.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-background rounded-lg">
                <div className="font-semibold text-foreground mb-1">Per-Project Clients</div>
                <div className="text-sm text-muted-foreground">Reports released after payment processing</div>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <div className="font-semibold text-foreground mb-1">Monthly Invoicees</div>
                <div className="text-sm text-muted-foreground">Reports released immediately upon compliance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Code Resources</CardTitle>
            <CardDescription>
              Essential guides for NBC 2020 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://solinvictusenergyservices.com/energy-hack"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-secondary border rounded-lg hover:border-primary transition-colors"
            >
              <div className="font-medium text-secondary-foreground mb-1">Energy Code Hack</div>
              <div className="text-sm text-muted-foreground">Learn which compliance pathway saves you the most money - up to $5000 in potential savings</div>
            </a>
            <a
              href="https://solinvictusenergyservices.com/airtightness"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-secondary border rounded-lg hover:border-primary transition-colors"
            >
              <div className="font-medium text-secondary-foreground mb-1">Airtightness Requirements</div>
              <div className="text-sm text-muted-foreground">Regional requirements for air-tightness testing in BC, Alberta, and Saskatchewan</div>
            </a>
            <a
              href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-secondary border rounded-lg hover:border-primary transition-colors"
            >
              <div className="font-medium text-secondary-foreground mb-1">Blower Door Checklist (PDF)</div>
              <div className="text-sm text-muted-foreground">Complete checklist for blower door testing procedures</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Services</CardTitle>
            <CardDescription>
              Professional calculations and assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://solinvictusenergyservices.com/cancsa-f28012"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-secondary border rounded-lg hover:border-primary transition-colors"
            >
              <div className="font-medium text-secondary-foreground mb-1">CAN/CSA F280-12 Heat Loss/Gain</div>
              <div className="text-sm text-muted-foreground">Room-by-room calculations for properly sizing modern heating and cooling systems</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesTab;