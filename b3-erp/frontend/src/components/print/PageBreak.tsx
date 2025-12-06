'use client';

import React, { ReactNode, Children, isValidElement, useRef, useEffect, useState } from 'react';

// ============================================================================
// Page Break Components
// ============================================================================

export interface PageBreakProps {
  className?: string;
}

/**
 * Force a page break before this element
 */
export function PageBreakBefore({ className = '' }: PageBreakProps) {
  return <div className={`page-break-before ${className}`} style={{ pageBreakBefore: 'always' }} />;
}

/**
 * Force a page break after this element
 */
export function PageBreakAfter({ className = '' }: PageBreakProps) {
  return <div className={`page-break-after ${className}`} style={{ pageBreakAfter: 'always' }} />;
}

/**
 * Prevent page breaks inside this element
 */
export interface AvoidBreakProps {
  children: ReactNode;
  className?: string;
}

export function AvoidBreak({ children, className = '' }: AvoidBreakProps) {
  return (
    <div
      className={`avoid-break ${className}`}
      style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      {children}
    </div>
  );
}

/**
 * Keep element with following content (avoid orphans)
 */
export function KeepWithNext({ children, className = '' }: AvoidBreakProps) {
  return (
    <div
      className={`keep-with-next ${className}`}
      style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid' }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Print Table with Intelligent Page Breaks
// ============================================================================

export interface PrintTableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface PrintTableProps<T> {
  data: T[];
  columns: PrintTableColumn<T>[];
  keyField: keyof T;
  title?: string;
  caption?: string;
  showRowNumbers?: boolean;
  repeatHeader?: boolean;
  repeatFooter?: boolean;
  footer?: ReactNode;
  maxRowsPerPage?: number;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}

export function PrintTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  title,
  caption,
  showRowNumbers = false,
  repeatHeader = true,
  repeatFooter = false,
  footer,
  maxRowsPerPage,
  striped = true,
  bordered = true,
  compact = false,
  className = '',
}: PrintTableProps<T>) {
  const getNestedValue = (obj: T, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  // Split data into pages if maxRowsPerPage is set
  const pages: T[][] = [];
  if (maxRowsPerPage && maxRowsPerPage > 0) {
    for (let i = 0; i < data.length; i += maxRowsPerPage) {
      pages.push(data.slice(i, i + maxRowsPerPage));
    }
  } else {
    pages.push(data);
  }

  const renderTable = (pageData: T[], pageIndex: number, isLastPage: boolean) => (
    <table
      className={`
        print-table w-full border-collapse
        ${bordered ? 'border border-gray-300' : ''}
        ${compact ? 'text-sm' : 'text-base'}
        ${className}
      `}
      style={{
        pageBreakInside: 'auto',
      }}
    >
      {caption && <caption className="text-left font-medium mb-2">{caption}</caption>}

      <thead
        className={repeatHeader ? '' : ''}
        style={{ display: repeatHeader ? 'table-header-group' : undefined }}
      >
        {title && (
          <tr>
            <th
              colSpan={columns.length + (showRowNumbers ? 1 : 0)}
              className="px-4 py-3 text-left text-lg font-bold bg-gray-100 border-b-2 border-gray-400"
            >
              {title}
            </th>
          </tr>
        )}
        <tr className="bg-gray-100">
          {showRowNumbers && (
            <th className={`px-2 py-2 ${bordered ? 'border border-gray-300' : ''} text-center w-12`}>
              #
            </th>
          )}
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className={`
                px-4 py-2 font-semibold
                ${bordered ? 'border border-gray-300' : ''}
                text-${col.align || 'left'}
              `}
              style={{ width: col.width }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {pageData.map((row, rowIndex) => {
          const globalIndex = pageIndex * (maxRowsPerPage || data.length) + rowIndex;
          return (
            <tr
              key={String(row[keyField])}
              className={striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
              style={{
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              {showRowNumbers && (
                <td className={`px-2 py-2 ${bordered ? 'border border-gray-300' : ''} text-center text-gray-500`}>
                  {globalIndex + 1}
                </td>
              )}
              {columns.map((col) => {
                const value = getNestedValue(row, String(col.key));
                return (
                  <td
                    key={String(col.key)}
                    className={`
                      px-4 py-2
                      ${bordered ? 'border border-gray-300' : ''}
                      text-${col.align || 'left'}
                    `}
                  >
                    {col.render ? col.render(value, row, globalIndex) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>

      {footer && (repeatFooter || isLastPage) && (
        <tfoot style={{ display: repeatFooter ? 'table-footer-group' : undefined }}>
          <tr>
            <td colSpan={columns.length + (showRowNumbers ? 1 : 0)}>
              {footer}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );

  if (pages.length === 1) {
    return renderTable(pages[0], 0, true);
  }

  return (
    <>
      {pages.map((pageData, pageIndex) => (
        <div key={pageIndex} className={pageIndex > 0 ? 'page-break-before' : ''}>
          {renderTable(pageData, pageIndex, pageIndex === pages.length - 1)}
          {pageIndex < pages.length - 1 && (
            <div className="text-right text-sm text-gray-500 mt-2 print:block hidden">
              Page {pageIndex + 1} of {pages.length}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ============================================================================
// Print Chart Container with Page Break Logic
// ============================================================================

export interface PrintChartProps {
  children: ReactNode;
  title?: string;
  caption?: string;
  maxHeight?: string;
  forcePageBreak?: boolean;
  className?: string;
}

export function PrintChart({
  children,
  title,
  caption,
  maxHeight = '400px',
  forcePageBreak = false,
  className = '',
}: PrintChartProps) {
  return (
    <figure
      className={`
        print-chart
        ${forcePageBreak ? 'page-break-before' : ''}
        ${className}
      `}
      style={{
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
      }}
    >
      {title && (
        <h3
          className="text-lg font-semibold mb-2"
          style={{ pageBreakAfter: 'avoid' }}
        >
          {title}
        </h3>
      )}
      <div
        className="chart-container print-color"
        style={{
          maxHeight,
          overflow: 'hidden',
          pageBreakInside: 'avoid',
        }}
      >
        {children}
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ============================================================================
// Print Section with Auto Page Breaks
// ============================================================================

export interface PrintSectionProps {
  children: ReactNode;
  title?: string;
  level?: 1 | 2 | 3 | 4;
  pageBreakBefore?: boolean;
  keepTogether?: boolean;
  className?: string;
}

export function PrintSection({
  children,
  title,
  level = 2,
  pageBreakBefore = false,
  keepTogether = false,
  className = '',
}: PrintSectionProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  const headingSizes = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-base',
  };

  return (
    <section
      className={`
        print-section mb-6
        ${pageBreakBefore ? 'page-break-before' : ''}
        ${keepTogether ? 'keep-together' : ''}
        ${className}
      `}
      style={{
        pageBreakBefore: pageBreakBefore ? 'always' : undefined,
        pageBreakInside: keepTogether ? 'avoid' : undefined,
      }}
    >
      {title && (
        <HeadingTag
          className={`font-bold ${headingSizes[level]} mb-3`}
          style={{ pageBreakAfter: 'avoid' }}
        >
          {title}
        </HeadingTag>
      )}
      {children}
    </section>
  );
}

// ============================================================================
// Auto-Paginated Content
// ============================================================================

export interface AutoPaginateProps {
  children: ReactNode;
  pageHeight?: number; // in pixels
  pageMargin?: number;
  showPageNumbers?: boolean;
  className?: string;
}

export function AutoPaginate({
  children,
  pageHeight = 1000,
  pageMargin = 48,
  showPageNumbers = true,
  className = '',
}: AutoPaginateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<ReactNode[][]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const childArray = Children.toArray(children);
    const calculatedPages: ReactNode[][] = [];
    let currentPage: ReactNode[] = [];
    let currentHeight = 0;

    childArray.forEach((child, index) => {
      // Estimate height (this is simplified - real implementation would measure)
      const estimatedHeight = isValidElement(child) ? 100 : 50;

      if (currentHeight + estimatedHeight > pageHeight - pageMargin * 2) {
        if (currentPage.length > 0) {
          calculatedPages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }
      }

      currentPage.push(child);
      currentHeight += estimatedHeight;
    });

    if (currentPage.length > 0) {
      calculatedPages.push(currentPage);
    }

    setPages(calculatedPages);
  }, [children, pageHeight, pageMargin]);

  return (
    <div ref={containerRef} className={`auto-paginate ${className}`}>
      {pages.map((pageContent, pageIndex) => (
        <div
          key={pageIndex}
          className={`print-page ${pageIndex > 0 ? 'page-break-before' : ''}`}
          style={{
            minHeight: pageHeight,
            padding: pageMargin,
            pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : undefined,
          }}
        >
          {pageContent}
          {showPageNumbers && (
            <div className="text-center text-sm text-gray-500 mt-4 print:block">
              Page {pageIndex + 1} of {pages.length}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Widow/Orphan Control
// ============================================================================

export interface OrphanControlProps {
  children: ReactNode;
  minLines?: number;
  className?: string;
}

/**
 * Prevent orphan lines (single lines at the top of a page)
 */
export function OrphanControl({ children, minLines = 2, className = '' }: OrphanControlProps) {
  return (
    <div
      className={`orphan-control ${className}`}
      style={{
        orphans: minLines,
        widows: minLines,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Print List with Page Break Logic
// ============================================================================

export interface PrintListProps {
  items: ReactNode[];
  ordered?: boolean;
  columns?: 1 | 2 | 3;
  itemsPerPage?: number;
  className?: string;
}

export function PrintList({
  items,
  ordered = false,
  columns = 1,
  itemsPerPage,
  className = '',
}: PrintListProps) {
  const ListTag = ordered ? 'ol' : 'ul';

  const columnClasses = {
    1: '',
    2: 'columns-2 gap-8',
    3: 'columns-3 gap-6',
  };

  // Split into pages if needed
  const pages: ReactNode[][] = [];
  if (itemsPerPage) {
    for (let i = 0; i < items.length; i += itemsPerPage) {
      pages.push(items.slice(i, i + itemsPerPage));
    }
  } else {
    pages.push(items);
  }

  const renderList = (pageItems: ReactNode[]) => (
    <ListTag
      className={`
        ${ordered ? 'list-decimal' : 'list-disc'}
        list-inside
        ${columnClasses[columns]}
        ${className}
      `}
    >
      {pageItems.map((item, index) => (
        <li
          key={index}
          className="mb-2"
          style={{ breakInside: 'avoid' }}
        >
          {item}
        </li>
      ))}
    </ListTag>
  );

  if (pages.length === 1) {
    return renderList(pages[0]);
  }

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className={pageIndex > 0 ? 'page-break-before' : ''}>
          {renderList(pageItems)}
        </div>
      ))}
    </>
  );
}

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
};
