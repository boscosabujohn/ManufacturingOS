import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// Types
export interface ESIReturn {
  id: string;
  returnPeriod: string;
  periodType: 'half-yearly';
  fromMonth: string;
  toMonth: string;
  establishmentCode: string;
  employeeCount: number;
  totalWages: number;
  employeeContribution: number;
  employerContribution: number;
  totalDue: number;
  filedOn?: string;
  filedBy?: string;
  acknowledgeNumber?: string;
  status: 'draft' | 'pending' | 'filed' | 'accepted';
  dueDate: string;
}

export interface EmployeeESIContribution {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  esiNumber: string;
  grossSalary: number;
  esiWages: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  eligible: boolean;
}

export interface ESIContributionMonth {
  id: string;
  monthYear: string;
  payPeriod: string;
  employeeCount: number;
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalWages: number;
  totalPayable: number;
  dueDate: string;
  status: 'draft' | 'verified' | 'submitted';
  records: EmployeeESIContribution[];
}

/**
 * Generate ESI Return Upload Template (Excel)
 */
export async function generateESIReturnTemplate(): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Instructions Sheet
  const instructions = [
    ['ESI Return Upload Template'],
    [''],
    ['Instructions:'],
    ['1. Fill in employee details in the "Employee Data" sheet'],
    ['2. Do not modify column headers'],
    ['3. ESI Number should be 17 digits'],
    ['4. Wages should be numeric values only'],
    ['5. Employee contribution rate: 0.75%'],
    ['6. Employer contribution rate: 3.0%'],
    ['7. Save and upload the file'],
    [''],
    ['Required Fields:'],
    ['- Employee ID', '- Employee Name', '- ESI Number', '- Gross Wages'],
    [''],
    ['Optional Fields:'],
    ['- Designation', '- Department', '- Days Worked', '- Remarks']
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Employee Data Sheet (Template)
  const employeeHeaders = [
    'Employee ID',
    'Employee Name',
    'ESI Number',
    'Designation',
    'Department',
    'Gross Wages',
    'Days Worked',
    'Employee Contribution (0.75%)',
    'Employer Contribution (3.0%)',
    'Total Contribution',
    'Remarks'
  ];

  // Sample data rows
  const sampleData = [
    ['EMP001', 'John Doe', '12345678901234567', 'Operator', 'Production', 18000, 26, 135, 540, 675, ''],
    ['EMP002', 'Jane Smith', '12345678901234568', 'Supervisor', 'Quality', 20000, 26, 150, 600, 750, ''],
  ];

  const employeeData = [employeeHeaders, ...sampleData];
  const employeeSheet = XLSX.utils.aoa_to_sheet(employeeData);

  // Set column widths
  employeeSheet['!cols'] = [
    { wch: 12 }, // Employee ID
    { wch: 20 }, // Employee Name
    { wch: 20 }, // ESI Number
    { wch: 20 }, // Designation
    { wch: 15 }, // Department
    { wch: 12 }, // Gross Wages
    { wch: 12 }, // Days Worked
    { wch: 22 }, // Employee Contribution
    { wch: 22 }, // Employer Contribution
    { wch: 18 }, // Total Contribution
    { wch: 20 }, // Remarks
  ];

  XLSX.utils.book_append_sheet(workbook, employeeSheet, 'Employee Data');

  // Generate and download
  XLSX.writeFile(workbook, `ESI_Return_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Generate ESI Contribution Return (Excel)
 */
export async function generateESIContributionReturn(data: ESIContributionMonth): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  const summary = [
    ['ESI CONTRIBUTION RETURN'],
    ['Period:', data.monthYear],
    ['Pay Period:', data.payPeriod],
    ['Due Date:', new Date(data.dueDate).toLocaleDateString('en-IN')],
    [''],
    ['SUMMARY'],
    ['Covered Employees:', data.employeeCount],
    ['Total ESI Wages:', `₹${data.totalWages.toLocaleString('en-IN')}`],
    ['Employee Contribution (0.75%):', `₹${data.totalEmployeeContribution.toLocaleString('en-IN')}`],
    ['Employer Contribution (3.0%):', `₹${data.totalEmployerContribution.toLocaleString('en-IN')}`],
    ['Total Payable:', `₹${data.totalPayable.toLocaleString('en-IN')}`],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Employee Details Sheet
  const headers = [
    'S.No',
    'Employee ID',
    'Employee Name',
    'ESI Number',
    'Designation',
    'Department',
    'Gross Salary',
    'ESI Wages',
    'Employee Share (0.75%)',
    'Employer Share (3.0%)',
    'Total Contribution',
    'Eligible'
  ];

  const rows = data.records.map((record, index) => [
    index + 1,
    record.employeeId,
    record.employeeName,
    record.esiNumber || 'N/A',
    record.designation,
    record.department,
    record.grossSalary,
    record.esiWages,
    record.employeeContribution,
    record.employerContribution,
    record.totalContribution,
    record.eligible ? 'Yes' : 'No'
  ]);

  const employeeData = [headers, ...rows];
  const employeeSheet = XLSX.utils.aoa_to_sheet(employeeData);

  // Set column widths
  employeeSheet['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 }
  ];

  XLSX.utils.book_append_sheet(workbook, employeeSheet, 'Employee Details');

  // Generate and download
  XLSX.writeFile(workbook, `ESI_Return_${data.monthYear.replace(/\s/g, '_')}.xlsx`);
}

/**
 * Generate ESI Challan (PDF)
 */
export async function generateESIChallan(data: ESIReturn | ESIContributionMonth): Promise<void> {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ESIC PAYMENT CHALLAN', 105, 20, { align: 'center' });

  // Add line
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Establishment Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Establishment Details:', 20, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const establishmentCode = 'establishmentCode' in data ? data.establishmentCode : 'ESINBNG12345';
  doc.text(`Code: ${establishmentCode}`, 20, 42);
  doc.text('Name: ManufacturingOS Manufacturing Pvt Ltd', 20, 48);
  doc.text('Address: Bangalore, Karnataka - 560001', 20, 54);

  // Payment Period
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Period:', 20, 65);
  doc.setFont('helvetica', 'normal');

  const periodText = 'returnPeriod' in data ? data.returnPeriod : data.monthYear;
  doc.text(periodText, 20, 71);

  // Contribution Details
  doc.setFont('helvetica', 'bold');
  doc.text('Contribution Details:', 20, 82);

  const contributionData = [
    ['Description', 'Amount (₹)'],
    ['Total ESI Wages', ('totalWages' in data ? data.totalWages : data.totalWages).toLocaleString('en-IN')],
    ['Employee Contribution (0.75%)', ('employeeContribution' in data ? data.employeeContribution : data.totalEmployeeContribution).toLocaleString('en-IN')],
    ['Employer Contribution (3.0%)', ('employerContribution' in data ? data.employerContribution : data.totalEmployerContribution).toLocaleString('en-IN')],
    ['Total Payable', ('totalDue' in data ? data.totalDue : data.totalPayable).toLocaleString('en-IN')],
  ];

  autoTable(doc, {
    startY: 87,
    head: [contributionData[0]],
    body: contributionData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });

  // Payment Instructions
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Instructions:', 20, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1. Pay online via ESIC portal: www.esic.nic.in', 20, finalY + 6);
  doc.text('2. Payment due by 21st of the following month', 20, finalY + 12);
  doc.text('3. Use establishment code for payment', 20, finalY + 18);
  doc.text('4. Keep payment receipt for records', 20, finalY + 24);

  // Generate QR Code
  const qrData = `ESIC|${establishmentCode}|${periodText}|${('totalDue' in data ? data.totalDue : data.totalPayable)}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrData);
  doc.addImage(qrCodeDataUrl, 'PNG', 160, finalY + 5, 30, 30);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by ManufacturingOS ERP System', 105, 280, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 285, { align: 'center' });

  // Save
  const filename = `ESI_Challan_${periodText.replace(/\s/g, '_')}.pdf`;
  doc.save(filename);
}

/**
 * Generate ESI Return Receipt (PDF)
 */
export async function generateESIReceipt(data: ESIReturn): Promise<void> {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(220, 53, 69);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ESIC RETURN RECEIPT', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Employee State Insurance Corporation', 105, 30, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Acknowledgement Number (Large)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Acknowledgement Number:', 20, 55);
  doc.setTextColor(220, 53, 69);
  doc.setFontSize(16);
  doc.text(data.acknowledgeNumber || 'Pending', 20, 65);
  doc.setTextColor(0, 0, 0);

  // Return Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Return Details:', 20, 80);

  const returnDetails = [
    ['Field', 'Value'],
    ['Return ID', data.id],
    ['Return Period', data.returnPeriod],
    ['Period Type', 'Half-Yearly'],
    ['Establishment Code', data.establishmentCode],
    ['Filing Status', data.status.toUpperCase()],
    ['Filed On', data.filedOn ? new Date(data.filedOn).toLocaleString('en-IN') : 'Not filed yet'],
    ['Filed By', data.filedBy || '-'],
    ['Due Date', new Date(data.dueDate).toLocaleDateString('en-IN')],
  ];

  autoTable(doc, {
    startY: 85,
    head: [returnDetails[0]],
    body: returnDetails.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 100 }
    }
  });

  // Contribution Summary
  const summaryY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Contribution Summary:', 20, summaryY);

  const summaryData = [
    ['Description', 'Amount (₹)'],
    ['Number of Employees', data.employeeCount.toString()],
    ['Total Wages', data.totalWages.toLocaleString('en-IN')],
    ['Employee Contribution', data.employeeContribution.toLocaleString('en-IN')],
    ['Employer Contribution', data.employerContribution.toLocaleString('en-IN')],
    ['Total Due', data.totalDue.toLocaleString('en-IN')],
  ];

  autoTable(doc, {
    startY: summaryY + 5,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });

  // Status Badge
  const badgeY = (doc as any).lastAutoTable.finalY + 15;
  if (data.status === 'accepted') {
    doc.setFillColor(40, 167, 69);
    doc.roundedRect(60, badgeY, 90, 15, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ RETURN ACCEPTED', 105, badgeY + 10, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  // Generate QR Code for verification
  const qrData = `ESIC-RETURN|${data.id}|${data.acknowledgeNumber}|${data.status}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrData);
  doc.addImage(qrCodeDataUrl, 'PNG', 160, badgeY - 10, 35, 35);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a system generated receipt.', 105, 265, { align: 'center' });
  doc.text('For queries, visit www.esic.nic.in or contact your HR department.', 105, 270, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 280, { align: 'center' });

  // Save
  doc.save(`ESI_Receipt_${data.id}.pdf`);
}

/**
 * Generate ESI Return Draft (PDF)
 */
export async function generateESIDraft(data: ESIReturn): Promise<void> {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ESI RETURN DRAFT', 105, 20, { align: 'center' });
  doc.setTextColor(255, 0, 0);
  doc.setFontSize(12);
  doc.text('(DRAFT - NOT FOR SUBMISSION)', 105, 28, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Add line
  doc.setLineWidth(0.5);
  doc.line(20, 33, 190, 33);

  // Return Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Return Information:', 20, 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Return ID: ${data.id}`, 20, 50);
  doc.text(`Period: ${data.returnPeriod}`, 20, 56);
  doc.text(`Type: Half-Yearly Return`, 20, 62);
  doc.text(`Due Date: ${new Date(data.dueDate).toLocaleDateString('en-IN')}`, 20, 68);

  // Establishment Details
  doc.setFont('helvetica', 'bold');
  doc.text('Establishment Details:', 20, 79);
  doc.setFont('helvetica', 'normal');
  doc.text(`Code: ${data.establishmentCode}`, 20, 85);

  // Contribution Details
  const contributionData = [
    ['Description', 'Count/Amount'],
    ['Total Employees Covered', data.employeeCount.toString()],
    ['Total Wages (₹)', data.totalWages.toLocaleString('en-IN')],
    ['Employee Contribution (₹)', data.employeeContribution.toLocaleString('en-IN')],
    ['Employer Contribution (₹)', data.employerContribution.toLocaleString('en-IN')],
    ['Total Payable (₹)', data.totalDue.toLocaleString('en-IN')],
  ];

  autoTable(doc, {
    startY: 95,
    head: [contributionData[0]],
    body: contributionData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [108, 117, 125], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 50, halign: 'right' }
    }
  });

  // Instructions
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions:', 20, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1. Verify all employee details and contribution amounts', 20, finalY + 6);
  doc.text('2. Ensure all ESI numbers are correct', 20, finalY + 12);
  doc.text('3. Check that total wages match payroll records', 20, finalY + 18);
  doc.text('4. Once verified, file the return through the system', 20, finalY + 24);
  doc.text('5. Payment must be made by the due date to avoid penalties', 20, finalY + 30);

  // Watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  doc.text('DRAFT', 105, 150, { align: 'center', angle: 45 });

  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text('This is a draft document for internal review only.', 105, 280, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 285, { align: 'center' });

  // Save
  doc.save(`ESI_Draft_${data.id}.pdf`);
}

/**
 * Parse uploaded ESI return file
 */
export async function parseESIReturnFile(file: File): Promise<{
  success: boolean;
  data?: any[];
  errors?: string[];
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Read the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate data
        const errors: string[] = [];

        jsonData.forEach((row: any, index) => {
          if (!row['Employee ID']) {
            errors.push(`Row ${index + 2}: Employee ID is required`);
          }
          if (!row['Employee Name']) {
            errors.push(`Row ${index + 2}: Employee Name is required`);
          }
          if (!row['ESI Number'] || row['ESI Number'].toString().length !== 17) {
            errors.push(`Row ${index + 2}: Valid ESI Number (17 digits) is required`);
          }
          if (!row['Gross Wages'] || isNaN(row['Gross Wages'])) {
            errors.push(`Row ${index + 2}: Valid Gross Wages is required`);
          }
        });

        if (errors.length > 0) {
          resolve({ success: false, errors });
        } else {
          resolve({ success: true, data: jsonData });
        }
      } catch (error) {
        resolve({
          success: false,
          errors: ['Failed to parse file. Please ensure it is a valid Excel file.']
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Failed to read file. Please try again.']
      });
    };

    reader.readAsBinaryString(file);
  });
}
