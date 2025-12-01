import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { getStatusInfo, pathwayMapping, formatBuildingType, formatProvince } from '@/lib/projectUtils';

interface MunicipalReportExporterProps {
  projects: any[];
  dashboardRef: React.RefObject<HTMLDivElement>;
}

const MunicipalReportExporter = ({ projects, dashboardRef }: MunicipalReportExporterProps) => {
  const { toast } = useToast();

  const handleExportCsv = () => {
    const headers = [
      "Project Name", "Location", "Province", "Building Type", "Pathway", "Status", "Created", "Last Updated"
    ];
    const rows = projects.map((p: any) => [
      `"${p.project_name || ''}"`,
      `"${p.location || ''}"`,
      `"${formatProvince(p.province) || ''}"`,
      `"${formatBuildingType(p.building_type) || ''}"`,
      `"${pathwayMapping[p.selected_pathway] || 'N/A'}"`,
      `"${getStatusInfo(p.compliance_status).text || ''}"`,
      `"${new Date(p.created_at).toLocaleDateString()}"`,
      `"${new Date(p.updated_at).toLocaleDateString()}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "municipal_projects_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV Exported", description: "Filtered project data has been downloaded." });
  };

  const handleExportPdfSummary = () => {
    const doc = new jsPDF();
    doc.text("Municipal Projects Summary", 14, 16);

    const tableColumn = ["Project Name", "Location", "Pathway", "Status", "Last Updated"];
    const tableRows: any[][] = [];

    projects.forEach((p: any) => {
      const projectData = [
        p.project_name || 'N/A',
        p.location || 'N/A',
        pathwayMapping[p.selected_pathway] || 'N/A',
        getStatusInfo(p.compliance_status).text || '',
        new Date(p.updated_at).toLocaleDateString()
      ];
      tableRows.push(projectData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('municipal_projects_summary.pdf');
    toast({ title: "PDF Summary Exported", description: "Filtered project summary has been downloaded." });
  };

  const handleExportDashboard = () => {
    const input = dashboardRef.current;
    if (input) {
      toast({ title: "Generating Report", description: "Please wait while we create the dashboard report..." });

      const logo = new Image();
      logo.src = '/assets/energy-navigator-logo.png';
      logo.onload = () => {
        html2canvas(input, {
          scale: 2,
          useCORS: true,
          backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color'),
          width: input.scrollWidth,
          height: input.scrollHeight,
          windowWidth: input.scrollWidth,
          windowHeight: input.scrollHeight,
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const headerHeight = 150;
          const margin = 40;
          const headerYCenter = headerHeight / 2;
          
          const pdfWidth = canvas.width;
          const pdfHeight = canvas.height + headerHeight;

          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [pdfWidth, pdfHeight]
          });

          // Add Header
          const logoWidth = 300;
          const logoHeight = logo.height * (logoWidth / logo.width);
          pdf.addImage(logo, 'PNG', margin, headerYCenter - (logoHeight / 2), logoWidth, logoHeight);

          pdf.setFontSize(40);
          pdf.text('Municipal Dashboard Report', pdfWidth / 2, headerYCenter, { align: 'center', baseline: 'middle' });

          pdf.setFontSize(24);
          pdf.text(new Date().toLocaleDateString(), pdfWidth - margin, headerYCenter, { align: 'right', baseline: 'middle' });
          
          // Add Dashboard Image
          pdf.addImage(imgData, 'PNG', 0, headerHeight, canvas.width, canvas.height);
          
          pdf.save("municipal_dashboard_report.pdf");
          toast({ title: "Dashboard Report Exported", description: "The dashboard summary has been downloaded as a PDF." });
        }).catch(err => {
          console.error("Error generating dashboard PDF:", err);
          toast({ title: "Export Failed", description: "Could not generate the dashboard report.", variant: "destructive" });
        });
      };
      logo.onerror = () => {
        toast({ title: "Export Failed", description: "Could not load assets for the report.", variant: "destructive" });
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting & Exports</CardTitle>
        <CardDescription>
          Download a report of the projects or a snapshot of the dashboard based on your selected filters.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={handleExportCsv} disabled={projects.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Projects as CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdfSummary} disabled={projects.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Projects as PDF
        </Button>
        <Button variant="outline" onClick={handleExportDashboard}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Download Dashboard Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default MunicipalReportExporter;