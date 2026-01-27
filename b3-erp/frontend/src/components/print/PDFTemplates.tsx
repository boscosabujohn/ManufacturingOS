'use client';

import React, { ReactNode } from 'react';

// ============================================================================
// Base PDF Template
// ============================================================================

export interface CompanyInfo {
  name: string;
  logo?: string;
  address?: string[];
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
}

export interface PDFTemplateProps {
  company: CompanyInfo;
  documentNumber?: string;
  documentDate?: Date;
  children: ReactNode;
  watermark?: string;
  confidential?: boolean;
  showFooter?: boolean;
  footerText?: string;
  className?: string;
}

export function PDFTemplate({
  company,
  documentNumber,
  documentDate = new Date(),
  children,
  watermark,
  confidential = false,
  showFooter = true,
  footerText,
  className = '',
}: PDFTemplateProps) {
  return (
    <div className={`pdf-template relative font-sans text-gray-900 ${className}`}>
      {/* Watermark */}
      {watermark && (
        <div
          className="watermark fixed inset-0 flex items-center justify-center pointer-events-none z-0"
          aria-hidden="true"
        >
          <span
            className="text-8xl font-bold text-gray-200 transform -rotate-45 select-none"
            style={{ opacity: 0.15 }}
          >
            {watermark}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="flex items-start justify-between mb-8 pb-4 border-b-2 border-gray-300">
        <div className="flex items-center gap-4">
          {company.logo && (
            <img src={company.logo} alt={company.name} className="h-16 w-auto" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            {company.address?.map((line, i) => (
              <p key={i} className="text-sm text-gray-600">{line}</p>
            ))}
          </div>
        </div>
        <div className="text-right">
          {company.phone && <p className="text-sm text-gray-600">{company.phone}</p>}
          {company.email && <p className="text-sm text-gray-600">{company.email}</p>}
          {company.website && <p className="text-sm text-gray-600">{company.website}</p>}
          {documentNumber && (
            <p className="mt-2 text-sm font-medium">Doc #: {documentNumber}</p>
          )}
          <p className="text-sm text-gray-600">
            Date: {documentDate.toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Confidential banner */}
      {confidential && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-6 text-center font-medium">
          CONFIDENTIAL - For authorized recipients only
        </div>
      )}

      {/* Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
          {footerText || (
            <>
              <p>{company.name} | {company.address?.[0]}</p>
              {company.taxId && <p>Tax ID: {company.taxId}</p>}
            </>
          )}
        </footer>
      )}
    </div>
  );
}

// ============================================================================
// Quote Template
// ============================================================================

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface QuoteTemplateProps {
  company: CompanyInfo;
  quoteNumber: string;
  quoteDate?: Date;
  validUntil?: Date;
  customer: {
    name: string;
    company?: string;
    address?: string[];
    email?: string;
    phone?: string;
  };
  lineItems: QuoteLineItem[];
  subtotal: number;
  tax?: number;
  taxRate?: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string[];
  paymentTerms?: string;
  preparedBy?: string;
  watermark?: string;
  className?: string;
}

export function QuoteTemplate({
  company,
  quoteNumber,
  quoteDate = new Date(),
  validUntil,
  customer,
  lineItems,
  subtotal,
  tax,
  taxRate,
  discount,
  total,
  notes,
  terms,
  paymentTerms,
  preparedBy,
  watermark = 'QUOTE',
  className = '',
}: QuoteTemplateProps) {
  return (
    <PDFTemplate
      company={company}
      documentNumber={quoteNumber}
      documentDate={quoteDate}
      watermark={watermark}
      className={className}
    >
      {/* Quote title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">QUOTATION</h2>
        <p className="text-gray-600">Quote #{quoteNumber}</p>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Quote To</h3>
          <p className="font-semibold">{customer.name}</p>
          {customer.company && <p>{customer.company}</p>}
          {customer.address?.map((line, i) => (
            <p key={i} className="text-gray-600">{line}</p>
          ))}
          {customer.email && <p className="text-gray-600">{customer.email}</p>}
          {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
        </div>
        <div className="text-right">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Quote Date</h3>
            <p>{quoteDate.toLocaleDateString()}</p>
          </div>
          {validUntil && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Valid Until</h3>
              <p>{validUntil.toLocaleDateString()}</p>
            </div>
          )}
          {paymentTerms && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Payment Terms</h3>
              <p>{paymentTerms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Line items table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
            {lineItems.some(item => item.discount) && (
              <th className="border border-gray-300 px-4 py-2 text-right">Discount</th>
            )}
            <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{item.description}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {item.quantity} {item.unit || ''}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                ${item.unitPrice.toFixed(2)}
              </td>
              {lineItems.some(i => i.discount) && (
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {item.discount ? `${item.discount}%` : '-'}
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                ${item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discount && discount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200 text-green-600">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          {tax !== undefined && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Tax {taxRate ? `(${taxRate}%)` : ''}:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-line">{notes}</p>
        </div>
      )}

      {/* Terms */}
      {terms && terms.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {terms.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Signature */}
      {preparedBy && (
        <div className="mt-12">
          <div className="border-t border-gray-400 w-48 pt-2">
            <p className="text-sm text-gray-600">Prepared by: {preparedBy}</p>
          </div>
        </div>
      )}
    </PDFTemplate>
  );
}

// ============================================================================
// Invoice Template
// ============================================================================

export interface InvoiceTemplateProps extends Omit<QuoteTemplateProps, 'quoteNumber' | 'quoteDate' | 'validUntil' | 'watermark'> {
  invoiceNumber: string;
  invoiceDate?: Date;
  dueDate?: Date;
  poNumber?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  amountPaid?: number;
  balanceDue?: number;
}

export function InvoiceTemplate({
  company,
  invoiceNumber,
  invoiceDate = new Date(),
  dueDate,
  poNumber,
  customer,
  lineItems,
  subtotal,
  tax,
  taxRate,
  discount,
  total,
  amountPaid = 0,
  balanceDue,
  notes,
  terms,
  paymentTerms,
  status = 'sent',
  className = '',
}: InvoiceTemplateProps) {
  const actualBalanceDue = balanceDue ?? (total - amountPaid);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <PDFTemplate
      company={company}
      documentNumber={invoiceNumber}
      documentDate={invoiceDate}
      watermark={status === 'paid' ? 'PAID' : status === 'draft' ? 'DRAFT' : undefined}
      className={className}
    >
      {/* Invoice title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
          <p className="text-gray-600">Invoice #{invoiceNumber}</p>
        </div>
        <span className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Bill to / Invoice details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
          <p className="font-semibold">{customer.name}</p>
          {customer.company && <p>{customer.company}</p>}
          {customer.address?.map((line, i) => (
            <p key={i} className="text-gray-600">{line}</p>
          ))}
        </div>
        <div className="text-right">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span className="text-gray-500">Invoice Date:</span>
            <span className="font-medium">{invoiceDate.toLocaleDateString()}</span>
            {dueDate && (
              <>
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium">{dueDate.toLocaleDateString()}</span>
              </>
            )}
            {poNumber && (
              <>
                <span className="text-gray-500">PO Number:</span>
                <span className="font-medium">{poNumber}</span>
              </>
            )}
            {paymentTerms && (
              <>
                <span className="text-gray-500">Payment Terms:</span>
                <span className="font-medium">{paymentTerms}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Line items */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-right">Rate</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-4 py-3">{item.description}</td>
              <td className="px-4 py-3 text-center">{item.quantity}</td>
              <td className="px-4 py-3 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-medium">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-72 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount && discount > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          {tax !== undefined && (
            <div className="flex justify-between py-2">
              <span>Tax {taxRate ? `(${taxRate}%)` : ''}:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {amountPaid > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Amount Paid:</span>
              <span>-${amountPaid.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 text-xl font-bold border-t border-gray-400">
            <span>Balance Due:</span>
            <span className={actualBalanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
              ${actualBalanceDue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-gray-600">{notes}</p>
        </div>
      )}

      {/* Payment instructions */}
      {actualBalanceDue > 0 && (
        <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Payment Instructions</h3>
          <p className="text-blue-700 text-sm">
            Please make payment within the specified terms. Include invoice number {invoiceNumber} with your payment.
          </p>
        </div>
      )}
    </PDFTemplate>
  );
}

// ============================================================================
// Report Template
// ============================================================================

export interface ReportSection {
  id: string;
  title: string;
  content: ReactNode;
  pageBreakBefore?: boolean;
}

export interface ReportTemplateProps {
  company: CompanyInfo;
  title: string;
  subtitle?: string;
  reportDate?: Date;
  reportPeriod?: { from: Date; to: Date };
  preparedBy?: string;
  preparedFor?: string;
  sections: ReportSection[];
  showTableOfContents?: boolean;
  confidential?: boolean;
  watermark?: string;
  className?: string;
}

export function ReportTemplate({
  company,
  title,
  subtitle,
  reportDate = new Date(),
  reportPeriod,
  preparedBy,
  preparedFor,
  sections,
  showTableOfContents = true,
  confidential = false,
  watermark,
  className = '',
}: ReportTemplateProps) {
  return (
    <PDFTemplate
      company={company}
      documentDate={reportDate}
      watermark={watermark}
      confidential={confidential}
      className={className}
    >
      {/* Title page */}
      <div className="text-center py-12 mb-8 border-b-2 border-gray-300 page-break-after">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {subtitle && <h2 className="text-xl text-gray-600 mb-8">{subtitle}</h2>}

        <div className="space-y-2 text-gray-600">
          {reportPeriod && (
            <p>
              Report Period: {reportPeriod.from.toLocaleDateString()} - {reportPeriod.to.toLocaleDateString()}
            </p>
          )}
          <p>Generated: {reportDate.toLocaleDateString()}</p>
          {preparedBy && <p>Prepared by: {preparedBy}</p>}
          {preparedFor && <p>Prepared for: {preparedFor}</p>}
        </div>
      </div>

      {/* Table of Contents */}
      {showTableOfContents && sections.length > 1 && (
        <div className="mb-8 page-break-after">
          <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
          <nav>
            <ol className="list-decimal list-inside space-y-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-blue-600 hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={section.pageBreakBefore ? 'page-break-before' : ''}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {index + 1}. {section.title}
          </h2>
          <div className="mb-8">
            {section.content}
          </div>
        </section>
      ))}
    </PDFTemplate>
  );
}

