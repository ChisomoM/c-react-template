import jsPDF from 'jspdf';
import { type JoinZuteFormData } from '@/types/join-zute';
import dayjs from 'dayjs';

export const exportApplicationToPDF = async (application: JoinZuteFormData & { id: string }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 20;
  
  // Helper function to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return dayjs().format('DD/MM/YYYY');
    return dayjs(dateStr).format('DD/MM/YYYY');
  };

  let yPos = 20;

  // Load and add the ZUTE logo
  const logoUrl = '/logos/ZUTE-Logo.png';
  try {
    const img = new Image();
    img.src = logoUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    // Add logo centered at top (40x40 size)
    doc.addImage(img, 'PNG', pageWidth / 2 - 20, yPos, 40, 40);
    yPos += 45;
  } catch (error) {
    // If logo fails to load, skip it
    console.error('Failed to load logo:', error);
    yPos += 10;
  }

  // Title (centered) - "Zute joining form 1" indicator
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('(Zute joining form 1)', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // ZUTE Title (centered)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ZAMBIA UNION FOR TEACHER EMPOWERMENT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  doc.text('(ZUTE)', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // School and P.O Box (left aligned) - inline values
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`School ${application.school}`, leftMargin, yPos);
  yPos += 6;
  doc.text(`P.O Box ${application.poBox}`, leftMargin, yPos);
  yPos += 6;
  const formattedDate = formatDate(application.applicationDate);
  doc.text(`Date: ${formattedDate}`, leftMargin, yPos);
  yPos += 15;

  // Recipient Address
  doc.setFont('helvetica', 'bold');
  doc.text('The General Secretary', leftMargin, yPos);
  yPos += 6;
  doc.text('ZAMBIA UNION FOR TEACHER EMPOWERMENT (ZUTE) LUSAKA', leftMargin, yPos);
  yPos += 10;

  // Subject Line
  doc.setFont('helvetica', 'bold');
  doc.text('RE: JOINING ZAMBIA UNION FOR TEACHER EMPOWERMENT (ZUTE)', leftMargin, yPos);
  yPos += 12;

  // Body of letter - Employee details with inline values
  doc.setFont('helvetica', 'normal');
  
  // Create text with inline values
  doc.text(`I ${application.fullName} TS/MAN No: ${application.tsManNo}`, leftMargin, yPos);
  yPos += 6;
  
  doc.text(`Employment No: ${application.employmentNo} Salary scale: ${application.salaryScale}`, leftMargin, yPos);
  yPos += 6;
  
  doc.text(`of ${application.school} School in ${application.district} district of`, leftMargin, yPos);
  yPos += 6;
  doc.text(`${application.province} Province.`, leftMargin, yPos);
  yPos += 10;

  // Decision statement
  const previousUnion = application.previousUnion || '(none)';
  doc.text(`I have decided to join Zambia Union for Teacher Empowerment (ZUTE) from`, leftMargin, yPos);
  yPos += 8;
  doc.text(`${previousUnion}`, leftMargin, yPos);
  yPos += 8;
  doc.text(`I therefore direct the end user to deduct my union contribution from my salary`, leftMargin, yPos);
  yPos += 6;
  doc.text(`and remit it to Zambia Union for Teacher Empowerment (ZUTE).`, leftMargin, yPos);
  yPos += 10;

  // Pay point - inline values
  doc.text(`My pay point is at ${application.payPoint} in ${application.payPointDistrict} district`, leftMargin, yPos);
  yPos += 10;

  // Signature section
  doc.text(`Signature`, leftMargin, yPos);
  
  // Add signature image if available
  if (application.applicantSignature) {
    try {
      const sigImg = new Image();
      sigImg.src = application.applicantSignature;
      await new Promise((resolve, reject) => {
        sigImg.onload = resolve;
        sigImg.onerror = reject;
      });
      // Add signature image maintaining aspect ratio, max width 50, max height 30
      const maxWidth = 50;
      const maxHeight = 30;
      const imgWidth = sigImg.width;
      const imgHeight = sigImg.height;
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      doc.addImage(sigImg, 'PNG', leftMargin + 25, yPos - 5, scaledWidth, scaledHeight);
    } catch (error) {
      console.error('Failed to load signature:', error);
      doc.text('____________________', leftMargin + 25, yPos);
    }
  } else {
    doc.text('____________________', leftMargin + 25, yPos);
  }
  
  doc.text(`NRC: ${application.nrc}`, leftMargin + 70, yPos);
  yPos += 15;

  // Date and Contact - inline values
  const submittedDate = formatDate(application.applicationDate);
  doc.text(`Date ${submittedDate} Contact Number ${application.contactNumber}`, leftMargin, yPos);
  yPos += 10;

  // ZUTE representative signature
  doc.text(`Signature of ZUTE representative ____________________`, leftMargin, yPos);
  yPos += 10;

  // Footer date
  doc.text(`Date ____________________`, leftMargin, yPos);
  yPos += 6;
  doc.text(`Cc: District Education Board Secretary`, leftMargin, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${dayjs().format('MMMM DD, YYYY HH:mm')}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  
  doc.setDrawColor(200, 200, 200);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  // Save the PDF
  const fileName = `ZUTE_Application_${application.fullName.replace(/\s+/g, '_')}_${application.nrc}.pdf`;
  doc.save(fileName);
};
