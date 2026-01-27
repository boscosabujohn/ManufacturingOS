'use client';

import React, { ReactNode } from 'react';

// ============================================================================
// Print Stylesheet Component
// ============================================================================

export interface PrintStylesheetProps {
  /** Page size: letter, A4, legal */
  pageSize?: 'letter' | 'A4' | 'legal';
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Page margins in inches or cm */
  margins?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** Show/hide header on print */
  showHeader?: boolean;
  /** Show/hide footer on print */
  showFooter?: boolean;
  /** Header content for print */
  headerContent?: string;
  /** Footer content for print */
  footerContent?: string;
  /** Custom CSS additions */
  customCSS?: string;
}

const pageSizes = {
  letter: { width: '8.5in', height: '11in' },
  A4: { width: '210mm', height: '297mm' },
  legal: { width: '8.5in', height: '14in' },
};

export function PrintStylesheet({
  pageSize = 'letter',
  orientation = 'portrait',
  margins = { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
  showHeader = true,
  showFooter = true,
  headerContent,
  footerContent,
  customCSS = '',
}: PrintStylesheetProps) {
  const size = pageSizes[pageSize];
  const pageWidth = orientation === 'portrait' ? size.width : size.height;
  const pageHeight = orientation === 'portrait' ? size.height : size.width;

  return (
    <style jsx global>{`
      /* ============================================
         PRINT OPTIMIZATION STYLESHEET
         WCAG 2.1 AA Compliant
         ============================================ */

      @media print {
        /* Page Setup */
        @page {
          size: ${pageWidth} ${pageHeight};
          margin: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
        }

        @page :first {
          margin-top: ${margins.top};
        }

        /* Reset and Base Styles */
        *,
        *::before,
        *::after {
          background: transparent !important;
          color: #000 !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }

        html, body {
          width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
          font-size: 12pt;
          line-height: 1.4;
          font-family: 'Times New Roman', Times, serif;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-family: Arial, Helvetica, sans-serif;
          page-break-after: avoid;
          orphans: 3;
          widows: 3;
        }

        h1 { font-size: 24pt; margin: 0 0 12pt 0; }
        h2 { font-size: 18pt; margin: 18pt 0 6pt 0; }
        h3 { font-size: 14pt; margin: 12pt 0 6pt 0; }
        h4 { font-size: 12pt; margin: 12pt 0 6pt 0; }

        p, li {
          orphans: 3;
          widows: 3;
        }

        /* Links */
        a[href]::after {
          content: " (" attr(href) ")";
          font-size: 9pt;
          color: #666 !important;
        }

        a[href^="#"]::after,
        a[href^="javascript:"]::after {
          content: "";
        }

        /* Images */
        img {
          max-width: 100% !important;
          page-break-inside: avoid;
        }

        /* Tables */
        table {
          border-collapse: collapse;
          width: 100%;
          page-break-inside: auto;
        }

        thead {
          display: table-header-group;
        }

        tfoot {
          display: table-footer-group;
        }

        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        th, td {
          border: 1px solid #000 !important;
          padding: 6pt 8pt;
          text-align: left;
          font-size: 10pt;
        }

        th {
          background-color: #f0f0f0 !important;
          font-weight: bold;
        }

        /* Hide Elements */
        .no-print,
        .print-hide,
        [data-print="hide"],
        nav,
        aside,
        .sidebar,
        .navigation,
        .toolbar,
        .btn,
        button:not(.print-button),
        input,
        select,
        textarea,
        .modal,
        .dialog,
        .popup,
        .toast,
        .tooltip,
        .dropdown-menu,
        .mobile-menu,
        iframe,
        video,
        audio,
        .advertisement,
        .ad,
        .social-share,
        .comments,
        .scroll-to-top,
        footer:not(.print-footer) {
          display: none !important;
        }

        /* Show Print-Only Elements */
        .print-only,
        .print-show,
        [data-print="show"] {
          display: block !important;
        }

        /* Print Header */
        ${showHeader ? `
        .print-header {
          display: block !important;
          position: running(header);
          text-align: center;
          font-size: 10pt;
          color: #666 !important;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6pt;
          margin-bottom: 12pt;
        }

        @page {
          @top-center {
            content: element(header);
          }
        }
        ` : ''}

        /* Print Footer */
        ${showFooter ? `
        .print-footer {
          display: block !important;
          position: running(footer);
          text-align: center;
          font-size: 9pt;
          color: #666 !important;
          border-top: 1px solid #ccc;
          padding-top: 6pt;
          margin-top: 12pt;
        }

        .print-footer .page-number::after {
          content: counter(page) " of " counter(pages);
        }

        @page {
          @bottom-center {
            content: element(footer);
          }
        }
        ` : ''}

        /* Page Break Classes */
        .page-break-before {
          page-break-before: always;
        }

        .page-break-after {
          page-break-after: always;
        }

        .page-break-avoid {
          page-break-inside: avoid;
        }

        /* Keep Together */
        .keep-together {
          page-break-inside: avoid;
        }

        /* Force Color Print for Charts/Graphs */
        .print-color {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* Backgrounds for specific elements */
        .print-bg,
        [data-print-bg="true"] {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* Status indicators that need color */
        .status-indicator,
        .badge,
        .tag,
        .chip {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          border: 1px solid currentColor !important;
        }

        /* Charts and Graphs */
        .chart-container,
        .graph-container,
        svg {
          page-break-inside: avoid;
          max-height: 5in;
        }

        /* Cards and Boxes */
        .card,
        .box,
        .panel {
          border: 1px solid #ccc !important;
          page-break-inside: avoid;
          margin-bottom: 12pt;
          padding: 12pt;
        }

        /* Lists */
        ul, ol {
          padding-left: 18pt;
        }

        li {
          margin-bottom: 3pt;
        }

        /* Code blocks */
        pre, code {
          font-family: 'Courier New', monospace;
          font-size: 9pt;
          background-color: #f5f5f5 !important;
          border: 1px solid #ccc !important;
          padding: 6pt;
          page-break-inside: avoid;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        /* Blockquotes */
        blockquote {
          border-left: 3pt solid #ccc;
          margin-left: 0;
          padding-left: 12pt;
          font-style: italic;
        }

        /* Horizontal Rules */
        hr {
          border: none;
          border-top: 1px solid #000;
          margin: 12pt 0;
        }

        /* Form Data Display */
        .form-field-print {
          margin-bottom: 6pt;
        }

        .form-field-print label {
          font-weight: bold;
          margin-right: 6pt;
        }

        /* Signature Lines */
        .signature-line {
          border-bottom: 1px solid #000;
          min-width: 200pt;
          display: inline-block;
          margin-top: 24pt;
        }

        /* Print-specific layout */
        .print-columns-2 {
          column-count: 2;
          column-gap: 24pt;
        }

        .print-columns-3 {
          column-count: 3;
          column-gap: 18pt;
        }

        /* Watermark placeholder */
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 72pt;
          color: rgba(0, 0, 0, 0.1) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          z-index: -1;
          pointer-events: none;
        }

        /* Custom CSS */
        ${customCSS}
      }

      /* Screen-only preview of print layout */
      .print-preview-mode {
        background: #e0e0e0;
        padding: 20px;
      }

      .print-preview-mode .print-page {
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 0 auto 20px;
        padding: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
        width: ${pageWidth};
        min-height: ${pageHeight};
        box-sizing: border-box;
      }
    `}</style>
  );
}

// ============================================================================
// Print Utility Classes Component
// ============================================================================

export interface PrintVisibilityProps {
  children: ReactNode;
  mode: 'print-only' | 'screen-only' | 'both';
  className?: string;
}

export function PrintVisibility({ children, mode, className = '' }: PrintVisibilityProps) {
  const visibilityClass = mode === 'print-only'
    ? 'print-only hidden print:block'
    : mode === 'screen-only'
      ? 'print-hide print:hidden'
      : '';

  return (
    <div className={`${visibilityClass} ${className}`}>
      {children}
    </div>
  );
}

// Print-only content wrapper
export function PrintOnly({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`hidden print:block ${className}`} data-print="show">
      {children}
    </div>
  );
}

// Screen-only content wrapper (hidden on print)
export function ScreenOnly({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`print:hidden ${className}`} data-print="hide">
      {children}
    </div>
  );
}

// ============================================================================
// Print Header/Footer Components
// ============================================================================

export interface PrintHeaderProps {
  logo?: string;
  companyName?: string;
  documentTitle?: string;
  date?: Date;
  className?: string;
}

export function PrintHeader({
  logo,
  companyName = 'ManufacturingOS',
  documentTitle,
  date = new Date(),
  className = '',
}: PrintHeaderProps) {
  return (
    <div className={`print-header hidden print:block ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
        <div className="flex items-center gap-3">
          {logo && <img src={logo} alt="" className="h-8" />}
          <span className="font-bold text-lg">{companyName}</span>
        </div>
        <div className="text-right text-sm text-gray-600">
          {documentTitle && <div className="font-medium">{documentTitle}</div>}
          <div>{date.toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}

export interface PrintFooterProps {
  showPageNumbers?: boolean;
  companyInfo?: string;
  confidential?: boolean;
  className?: string;
}

export function PrintFooter({
  showPageNumbers = true,
  companyInfo,
  confidential = false,
  className = '',
}: PrintFooterProps) {
  return (
    <div className={`print-footer hidden print:block ${className}`}>
      <div className="flex items-center justify-between border-t border-gray-300 pt-2 mt-4 text-sm text-gray-600">
        <div>
          {confidential && <span className="font-medium text-red-600">CONFIDENTIAL</span>}
          {companyInfo && <span className="ml-4">{companyInfo}</span>}
        </div>
        {showPageNumbers && (
          <div className="page-number" />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Print Button Component
// ============================================================================

export interface PrintButtonProps {
  targetId?: string;
  beforePrint?: () => void | Promise<void>;
  afterPrint?: () => void;
  className?: string;
  children?: ReactNode;
}

export function PrintButton({
  targetId,
  beforePrint,
  afterPrint,
  className = '',
  children = 'Print',
}: PrintButtonProps) {
  const handlePrint = async () => {
    if (beforePrint) {
      await beforePrint();
    }

    if (targetId) {
      // Print specific element
      const element = document.getElementById(targetId);
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; }
                @media print {
                  body { margin: 0; padding: 20px; }
                }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
      }
    } else {
      window.print();
    }

    if (afterPrint) {
      window.addEventListener('afterprint', afterPrint, { once: true });
    }
  };

  return (
    <button
      onClick={handlePrint}
      className={`print-button inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 print:hidden ${className}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {children}
    </button>
  );
}

