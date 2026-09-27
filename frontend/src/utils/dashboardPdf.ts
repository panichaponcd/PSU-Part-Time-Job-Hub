import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DashboardReportData {
  filteredJobsCount: number;
  filteredAppsCount: number;
  approvedCount: number;
  totalPay: number;
  yearFilter: string;
  termFilter: string;
  jobTypeFilter: string;
  facultyData: Array<{ name: string; fullName: string; count: number }>;
  pieData: Array<{ name: string; value: number; percentage: number }>;
}

export function generateDashboardReport(data: DashboardReportData): void {
  const doc = new jsPDF();
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // 1. Title Header
  doc.setFontSize(16);
  doc.setTextColor(10, 37, 64);
  doc.text('PRINCE OF SONGKLA UNIVERSITY, PHUKET CAMPUS', 14, 18);

  doc.setFontSize(12);
  doc.setTextColor(0, 99, 152);
  doc.text('Part-time Job Hub — Executive Analytics Summary Report', 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${generatedDate}`, 14, 33);
  doc.text(
    `Filter Scope: Year: ${data.yearFilter === 'all' ? 'All' : data.yearFilter} | Term: ${
      data.termFilter === 'all' ? 'All' : data.termFilter
    } | Type: ${data.jobTypeFilter === 'all' ? 'All' : data.jobTypeFilter.toUpperCase()}`,
    14,
    38
  );

  // 2. Summary KPI Table
  autoTable(doc, {
    startY: 44,
    head: [['Key Metric Indicator', 'Value Recorded']],
    body: [
      ['Active Job Listings', data.filteredJobsCount.toString()],
      ['Total Student Applications', data.filteredAppsCount.toString()],
      ['Approved Placements', data.approvedCount.toString()],
      ['Total Allocated Budget', `THB ${data.totalPay.toLocaleString()}`],
    ],
    headStyles: {
      fillColor: [10, 37, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    theme: 'grid',
  });

  // 3. Faculty Distribution Table
  const lastY1 = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(10, 37, 64);
  doc.text('Applications Distribution by Faculty', 14, lastY1);

  autoTable(doc, {
    startY: lastY1 + 4,
    head: [['Faculty / College', 'Unit Code', 'Total Applicants']],
    body: data.facultyData.map((f) => [f.fullName, f.name, f.count.toString()]),
    headStyles: {
      fillColor: [0, 99, 152],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
    },
    theme: 'grid',
  });

  // 4. Job Type Breakdown Table
  const lastY2 = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(10, 37, 64);
  doc.text('Job Provider Distribution (Internal vs External)', 14, lastY2);

  autoTable(doc, {
    startY: lastY2 + 4,
    head: [['Provider Type', 'Listings Count', 'Proportion']],
    body: data.pieData.map((p) => [p.name, p.value.toString(), `${p.percentage}%`]),
    headStyles: {
      fillColor: [10, 37, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
    },
    theme: 'grid',
  });

  // Footer Page Numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `PSU Phuket Job Hub — Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`PSU_Job_Hub_Analytics_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default generateDashboardReport;
