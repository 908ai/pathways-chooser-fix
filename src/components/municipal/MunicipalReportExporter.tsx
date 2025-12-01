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
    if (dashboardRef.current) {
      toast({ title: "Generating Report", description: "Please wait while we create the dashboard report..." });
      html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color')
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("municipal_dashboard_report.pdf");
        toast({ title: "Dashboard Report Exported", description: "The dashboard summary has been downloaded as a PDF." });
      }).catch(err => {
        console.error("Error generating dashboard PDF:", err);
        toast({ title: "Export Failed", description: "Could not generate the dashboard report.", variant: "destructive" });
      });
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