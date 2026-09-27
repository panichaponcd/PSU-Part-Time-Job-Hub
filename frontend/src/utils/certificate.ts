import { jsPDF } from 'jspdf';
import psuEmblem from '../assets/PSU_Emblem.png';

export interface CertificateData {
  studentName: string;
  studentId: string;
  faculty: string;
  jobTitle: string;
  score: string | number;
  resultStatus: string;
  completionDate?: string;
}

export function generatePSUCertificate(data: CertificateData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Formal Theme Color (#1a3a6b)
  const psuBlue = [26, 58, 107];

  // 1. Formal Borders
  doc.setLineWidth(1.5);
  doc.setDrawColor(psuBlue[0], psuBlue[1], psuBlue[2]);
  doc.rect(10, 10, 277, 190); // Formal outer frame

  doc.setLineWidth(0.2);
  doc.rect(12, 12, 273, 186); // Inner thin frame

  // 2. University Emblem (Aspect ratio ~0.745, Height: 24mm, Width: 17.88mm)
  if (psuEmblem) {
    try {
      doc.addImage(psuEmblem, 'PNG', 139.56, 18, 17.88, 24);
    } catch (e) {
      console.warn('Emblem could not be embedded into PDF:', e);
    }
  }

  // 3. Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(psuBlue[0], psuBlue[1], psuBlue[2]);
  doc.text('PRINCE OF SONGKLA UNIVERSITY', 148.5, 50, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('PHUKET CAMPUS | DIVISION OF STUDENT DEVELOPMENT', 148.5, 56, { align: 'center' });

  // 4. Main Title
  doc.setFontSize(28);
  doc.setTextColor(psuBlue[0], psuBlue[1], psuBlue[2]);
  doc.text('CERTIFICATE OF COMPLETION', 148.5, 80, { align: 'center' });

  doc.setLineWidth(0.8);
  doc.line(80, 86, 217, 86);

  // 5. Recipient Info
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(16);
  doc.text('This is to certify that', 148.5, 105, { align: 'center' });

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.studentName, 148.5, 118, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Student ID: ${data.studentId} | Faculty: ${data.faculty}`, 148.5, 126, { align: 'center' });

  // 6. Achievement & Rating
  doc.setFontSize(14);
  doc.text('has successfully completed the part-time work assignment for', 148.5, 142, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(psuBlue[0], psuBlue[1], psuBlue[2]);
  doc.text(`"${data.jobTitle}"`, 148.5, 152, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Performance Appraisal Score: ${data.score} / 5.0 (${data.resultStatus})`, 148.5, 162, { align: 'center' });

  // 7. Signature Block
  doc.setTextColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(103.5, 180, 193.5, 180);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('(Mr. Sarawut Japrang)', 148.5, 185, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Acting Head of Student Development & Alumni Relations', 148.5, 190, { align: 'center' });

  // 8. Electronic Validation Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const validatedDate = data.completionDate || new Date().toLocaleDateString('en-GB');
  doc.text(`VALIDATED ELECTRONICALLY ON: ${validatedDate} BY PSU PART-TIME JOB HUB`, 148.5, 196, { align: 'center' });

  doc.save(`PSU_Certificate_${data.studentId}.pdf`);
}
