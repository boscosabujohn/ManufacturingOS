// Export Service - CSV, Excel (XLSX), and PDF generation utilities

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  includeHeaders?: boolean;
  dateFormat?: string;
  numberFormat?: string;
  sheetName?: string; // For Excel
  orientation?: 'portrait' | 'landscape'; // For PDF
  pageSize?: 'A4' | 'Letter' | 'Legal'; // For PDF
}

// ==================== CSV Export ====================

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): void {
  const { filename, columns, includeHeaders = true } = options;

  const rows: string[] = [];

  // Add headers
  if (includeHeaders) {
    const headers = columns.map(col => escapeCSVValue(col.header));
    rows.push(headers.join(','));
  }

  // Add data rows
  data.forEach(row => {
    const values = columns.map(col => {
      const value = row[col.key];
      const formatted = col.format ? col.format(value) : value;
      return escapeCSVValue(formatted);
    });
    rows.push(values.join(','));
  });

  const csvContent = rows.join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// ==================== Excel (XLSX) Export ====================

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): void {
  const { filename, columns, title, subtitle, sheetName = 'Sheet1', includeHeaders = true } = options;

  // Build XML for Excel (using SpreadsheetML format)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';

  // Styles
  xml += '<Styles>\n';
  xml += '  <Style ss:ID="Default" ss:Name="Normal"><Font ss:Size="11"/></Style>\n';
  xml += '  <Style ss:ID="Header"><Font ss:Bold="1" ss:Size="11"/><Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/></Style>\n';
  xml += '  <Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/></Style>\n';
  xml += '  <Style ss:ID="Subtitle"><Font ss:Size="11" ss:Color="#666666"/></Style>\n';
  xml += '  <Style ss:ID="Number"><NumberFormat ss:Format="#,##0.00"/></Style>\n';
  xml += '  <Style ss:ID="Date"><NumberFormat ss:Format="yyyy-mm-dd"/></Style>\n';
  xml += '</Styles>\n';

  xml += `<Worksheet ss:Name="${escapeXML(sheetName)}">\n`;
  xml += '<Table>\n';

  // Column widths
  columns.forEach(col => {
    const width = col.width || 100;
    xml += `  <Column ss:Width="${width}"/>\n`;
  });

  let rowIndex = 0;

  // Title row
  if (title) {
    xml += '  <Row>\n';
    xml += `    <Cell ss:StyleID="Title" ss:MergeAcross="${columns.length - 1}"><Data ss:Type="String">${escapeXML(title)}</Data></Cell>\n`;
    xml += '  </Row>\n';
    rowIndex++;
  }

  // Subtitle row
  if (subtitle) {
    xml += '  <Row>\n';
    xml += `    <Cell ss:StyleID="Subtitle" ss:MergeAcross="${columns.length - 1}"><Data ss:Type="String">${escapeXML(subtitle)}</Data></Cell>\n`;
    xml += '  </Row>\n';
    rowIndex++;
  }

  // Empty row after title/subtitle
  if (title || subtitle) {
    xml += '  <Row></Row>\n';
    rowIndex++;
  }

  // Header row
  if (includeHeaders) {
    xml += '  <Row>\n';
    columns.forEach(col => {
      xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXML(col.header)}</Data></Cell>\n`;
    });
    xml += '  </Row>\n';
    rowIndex++;
  }

  // Data rows
  data.forEach(row => {
    xml += '  <Row>\n';
    columns.forEach(col => {
      const value = row[col.key];
      const formatted = col.format ? col.format(value) : value;
      const { type, styleId } = getExcelDataType(value);
      const style = styleId ? ` ss:StyleID="${styleId}"` : '';
      xml += `    <Cell${style}><Data ss:Type="${type}">${escapeXML(formatted)}</Data></Cell>\n`;
    });
    xml += '  </Row>\n';
  });

  xml += '</Table>\n';
  xml += '</Worksheet>\n';
  xml += '</Workbook>';

  downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}

function getExcelDataType(value: any): { type: string; styleId?: string } {
  if (value === null || value === undefined) return { type: 'String' };
  if (typeof value === 'number') return { type: 'Number', styleId: 'Number' };
  if (value instanceof Date) return { type: 'DateTime', styleId: 'Date' };
  return { type: 'String' };
}

function escapeXML(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ==================== PDF Export ====================

export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): void {
  const {
    filename,
    columns,
    title,
    subtitle,
    orientation = 'portrait',
    pageSize = 'A4',
    includeHeaders = true,
  } = options;

  // Generate printable HTML and open in new window for printing
  const html = generatePrintableHTML(data, {
    ...options,
    includeHeaders,
  });

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

function generatePrintableHTML<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): string {
  const { columns, title, subtitle, orientation = 'portrait', pageSize = 'A4', includeHeaders = true } = options;

  const pageSizes: Record<string, string> = {
    A4: '210mm 297mm',
    Letter: '8.5in 11in',
    Legal: '8.5in 14in',
  };

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || 'Export'}</title>
  <style>
    @page {
      size: ${pageSizes[pageSize]} ${orientation};
      margin: 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #333;
    }

    .header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #333;
    }

    .title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 10pt;
      color: #666;
    }

    .meta {
      font-size: 9pt;
      color: #999;
      margin-top: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
      white-space: nowrap;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    .align-center { text-align: center; }
    .align-right { text-align: right; }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #999;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    ${title ? `<div class="title">${escapeHTML(title)}</div>` : ''}
    ${subtitle ? `<div class="subtitle">${escapeHTML(subtitle)}</div>` : ''}
    <div class="meta">Generated on ${new Date().toLocaleString()} | ${data.length} records</div>
  </div>

  <table>
    ${includeHeaders ? `
    <thead>
      <tr>
        ${columns.map(col => `<th class="align-${col.align || 'left'}">${escapeHTML(col.header)}</th>`).join('')}
      </tr>
    </thead>
    ` : ''}
    <tbody>
      ${data.map(row => `
      <tr>
        ${columns.map(col => {
          const value = row[col.key];
          const formatted = col.format ? col.format(value) : (value ?? '');
          return `<td class="align-${col.align || 'left'}">${escapeHTML(formatted)}</td>`;
        }).join('')}
      </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>Total: ${data.length} records</span>
    <span>Page 1</span>
  </div>
</body>
</html>
  `;

  return html;
}

function escapeHTML(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==================== Utility Functions ====================

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== Export Manager ====================

export interface ExportManagerOptions<T> {
  data: T[];
  columns: ExportColumn[];
  filename: string;
  title?: string;
  subtitle?: string;
}

export class ExportManager<T extends Record<string, any>> {
  private options: ExportManagerOptions<T>;

  constructor(options: ExportManagerOptions<T>) {
    this.options = options;
  }

  exportCSV(): void {
    exportToCSV(this.options.data, {
      filename: this.options.filename,
      columns: this.options.columns,
      title: this.options.title,
      subtitle: this.options.subtitle,
    });
  }

  exportExcel(): void {
    exportToExcel(this.options.data, {
      filename: this.options.filename,
      columns: this.options.columns,
      title: this.options.title,
      subtitle: this.options.subtitle,
      sheetName: this.options.title || 'Data',
    });
  }

  exportPDF(): void {
    exportToPDF(this.options.data, {
      filename: this.options.filename,
      columns: this.options.columns,
      title: this.options.title,
      subtitle: this.options.subtitle,
    });
  }

  export(format: ExportFormat): void {
    switch (format) {
      case 'csv':
        this.exportCSV();
        break;
      case 'xlsx':
        this.exportExcel();
        break;
      case 'pdf':
        this.exportPDF();
        break;
    }
  }
}

// ==================== Hook ====================

export function useExport<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  options?: { filename?: string; title?: string; subtitle?: string }
) {
  const filename = options?.filename || `export-${Date.now()}`;
  const title = options?.title;
  const subtitle = options?.subtitle;

  return {
    exportCSV: () => exportToCSV(data, { filename, columns, title, subtitle }),
    exportExcel: () => exportToExcel(data, { filename, columns, title, subtitle, sheetName: title || 'Data' }),
    exportPDF: () => exportToPDF(data, { filename, columns, title, subtitle }),
    exportAs: (format: ExportFormat) => {
      switch (format) {
        case 'csv': exportToCSV(data, { filename, columns, title, subtitle }); break;
        case 'xlsx': exportToExcel(data, { filename, columns, title, subtitle, sheetName: title || 'Data' }); break;
        case 'pdf': exportToPDF(data, { filename, columns, title, subtitle }); break;
      }
    },
  };
}
