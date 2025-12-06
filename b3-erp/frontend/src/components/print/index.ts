// Print & Export Components
// Feature 26: Print optimization and PDF generation

// Print Stylesheet - Optimized print CSS for all pages
export {
  PrintStylesheet,
  PrintVisibility,
  PrintOnly,
  ScreenOnly,
  PrintHeader,
  PrintFooter,
  PrintButton,
} from './PrintStylesheet';
export type {
  PrintStylesheetProps,
  PrintVisibilityProps,
  PrintHeaderProps,
  PrintFooterProps,
  PrintButtonProps,
} from './PrintStylesheet';

// Print Preview - Preview before printing
export {
  PrintPreview,
  PrintPreviewTrigger,
} from './PrintPreview';
export type {
  PrintPreviewProps,
  PrintPreviewTriggerProps,
} from './PrintPreview';

// PDF Templates - Branded templates for quotes, invoices, reports
export {
  PDFTemplate,
  QuoteTemplate,
  InvoiceTemplate,
  ReportTemplate,
} from './PDFTemplates';
export type {
  CompanyInfo,
  PDFTemplateProps,
  QuoteLineItem,
  QuoteTemplateProps,
  InvoiceTemplateProps,
  ReportSection,
  ReportTemplateProps,
} from './PDFTemplates';

// Page Break Logic - Intelligent page breaks for tables/charts
export {
  PageBreakBefore,
  PageBreakAfter,
  AvoidBreak,
  KeepWithNext,
  PrintTable,
  PrintChart,
  PrintSection,
  AutoPaginate,
  OrphanControl,
  PrintList,
} from './PageBreak';
export type {
  PageBreakProps,
  AvoidBreakProps,
  PrintTableColumn,
  PrintTableProps,
  PrintChartProps,
  PrintSectionProps,
  AutoPaginateProps,
  OrphanControlProps,
  PrintListProps,
} from './PageBreak';

// Watermarks - Draft/Confidential watermarks for PDFs
export {
  Watermark,
  WatermarkContainer,
  SecurityWatermark,
  StatusWatermark,
  LogoWatermark,
  WatermarkStyles,
} from './Watermark';
export type {
  WatermarkPreset,
  WatermarkStyle,
  WatermarkProps,
  WatermarkContainerProps,
  SecurityWatermarkProps,
  DocumentStatus,
  StatusWatermarkProps,
  LogoWatermarkProps,
} from './Watermark';
