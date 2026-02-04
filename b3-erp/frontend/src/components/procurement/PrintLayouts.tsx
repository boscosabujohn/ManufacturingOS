'use client'

import React, { useRef } from 'react'
import { Printer, Download, Mail, Share2, FileText, Building, Calendar, User, Phone, MapPin } from 'lucide-react'

// ============= Print Utilities =============
export const usePrint = () => {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current
      const originalContent = document.body.innerHTML

      // Create print window
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Document</title>
              <style>
                @media print {
                  * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }

                  body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    margin: 0;
                    padding: 20px;
                    background: white;
                  }

                  .no-print {
                    display: none !important;
                  }

                  .print-page-break {
                    page-break-before: always;
                  }

                  .print-avoid-break {
                    page-break-inside: avoid;
                  }

                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 20px;
                  }

                  th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                  }

                  th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                  }

                  .header {
                    border-bottom: 2px solid #333;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                  }

                  .footer {
                    border-top: 1px solid #ddd;
                    margin-top: 20px;
                    padding-top: 10px;
                    font-size: 10px;
                    color: #666;
                  }

                  .signature-section {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                  }

                  .signature-box {
                    width: 200px;
                    border-top: 1px solid #333;
                    text-align: center;
                    padding-top: 5px;
                  }
                }

                @page {
                  margin: 1in;
                  size: A4;
                }
              </style>
            </head>
            <body>
              ${printContent.outerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  return { printRef, handlePrint }
}

// ============= Print Header Component =============
interface PrintHeaderProps {
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
    logo?: string
  }
  documentTitle: string
  documentNumber: string
  date: string
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  companyInfo,
  documentTitle,
  documentNumber,
  date
}) => (
  <div className="header print-avoid-break">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        {companyInfo.logo && (
          <img src={companyInfo.logo} alt="Company Logo" className="h-16 w-auto" />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{companyInfo.name}</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {companyInfo.address}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {companyInfo.phone}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {companyInfo.email}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-lg font-semibold text-gray-900">{documentTitle}</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Document #: <span className="font-medium">{documentNumber}</span></div>
          <div>Date: <span className="font-medium">{date}</span></div>
        </div>
      </div>
    </div>
  </div>
)

// ============= Purchase Order Print Layout =============
interface POData {
  poNumber: string
  date: string
  deliveryDate: string
  vendor: {
    name: string
    address: string
    contact: string
    phone: string
    email: string
  }
  billTo: {
    name: string
    address: string
    contact: string
  }
  shipTo: {
    name: string
    address: string
    contact: string
  }
  items: Array<{
    description: string
    partNumber: string
    quantity: number
    unit: string
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  terms: string
  notes?: string
}

export const PurchaseOrderPrint: React.FC<{
  data: POData
  companyInfo: PrintHeaderProps['companyInfo']
  onPrint: () => void
}> = ({ data, companyInfo, onPrint }) => {
  const { printRef, handlePrint } = usePrint()

  return (
    <div className="bg-white">
      {/* Print Controls */}
      <div className="no-print bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Purchase Order - {data.poNumber}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div ref={printRef} className="p-8 ">
        <PrintHeader
          companyInfo={companyInfo}
          documentTitle="PURCHASE ORDER"
          documentNumber={data.poNumber}
          date={data.date}
        />

        {/* Vendor and Shipping Information */}
        <div className="grid grid-cols-3 gap-3 mb-3 print-avoid-break">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">VENDOR</h3>
            <div className="text-sm space-y-1">
              <div className="font-medium">{data.vendor.name}</div>
              <div>{data.vendor.address}</div>
              <div>Contact: {data.vendor.contact}</div>
              <div>Phone: {data.vendor.phone}</div>
              <div>Email: {data.vendor.email}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">BILL TO</h3>
            <div className="text-sm space-y-1">
              <div className="font-medium">{data.billTo.name}</div>
              <div>{data.billTo.address}</div>
              <div>Contact: {data.billTo.contact}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">SHIP TO</h3>
            <div className="text-sm space-y-1">
              <div className="font-medium">{data.shipTo.name}</div>
              <div>{data.shipTo.address}</div>
              <div>Contact: {data.shipTo.contact}</div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-2 print-avoid-break">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">PO Number:</span> {data.poNumber}
            </div>
            <div>
              <span className="font-medium">Order Date:</span> {data.date}
            </div>
            <div>
              <span className="font-medium">Required Delivery:</span> {data.deliveryDate}
            </div>
            <div>
              <span className="font-medium">Payment Terms:</span> {data.terms}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-2">
          <thead>
            <tr>
              <th className="text-left">Description</th>
              <th className="text-left">Part Number</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Unit</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.partNumber}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">{item.unit}</td>
                <td className="text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-3">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Tax:</span>
              <span>${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Shipping:</span>
              <span>${data.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-300 font-semibold">
              <span>TOTAL:</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mb-3 print-avoid-break">
            <h3 className="font-semibold text-gray-900 mb-2">NOTES:</h3>
            <div className="text-sm border border-gray-300 p-3 rounded">
              {data.notes}
            </div>
          </div>
        )}

        {/* Signature Section */}
        <div className="signature-section print-avoid-break">
          <div className="signature-box">
            <div className="font-medium">Authorized By</div>
            <div className="text-xs mt-1">Procurement Manager</div>
          </div>
          <div className="signature-box">
            <div className="font-medium">Vendor Acknowledgment</div>
            <div className="text-xs mt-1">Date</div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-center">
          <p>This purchase order is subject to our terms and conditions.</p>
          <p>Please acknowledge receipt and confirm delivery date.</p>
        </div>
      </div>
    </div>
  )
}

// ============= RFQ Print Layout =============
interface RFQData {
  rfqNumber: string
  date: string
  dueDate: string
  vendor: {
    name: string
    contact: string
    email: string
  }
  items: Array<{
    description: string
    specifications: string
    quantity: number
    unit: string
    estimatedPrice?: number
  }>
  terms: string
  notes?: string
}

export const RFQPrint: React.FC<{
  data: RFQData
  companyInfo: PrintHeaderProps['companyInfo']
}> = ({ data, companyInfo }) => {
  const { printRef, handlePrint } = usePrint()

  return (
    <div className="bg-white">
      {/* Print Controls */}
      <div className="no-print bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Request for Quotation - {data.rfqNumber}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div ref={printRef} className="p-8 ">
        <PrintHeader
          companyInfo={companyInfo}
          documentTitle="REQUEST FOR QUOTATION"
          documentNumber={data.rfqNumber}
          date={data.date}
        />

        {/* RFQ Information */}
        <div className="grid grid-cols-2 gap-3 mb-3 print-avoid-break">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">VENDOR INFORMATION</h3>
            <div className="text-sm space-y-1">
              <div className="font-medium">{data.vendor.name}</div>
              <div>Contact: {data.vendor.contact}</div>
              <div>Email: {data.vendor.email}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">QUOTATION DETAILS</h3>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">RFQ Number:</span> {data.rfqNumber}</div>
              <div><span className="font-medium">Issue Date:</span> {data.date}</div>
              <div><span className="font-medium">Response Due:</span> <span className="text-red-600 font-medium">{data.dueDate}</span></div>
              <div><span className="font-medium">Terms:</span> {data.terms}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-3">ITEMS REQUESTED FOR QUOTATION</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Item Description</th>
                <th className="text-left">Specifications</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Unit</th>
                <th className="text-right">Your Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="align-top">{item.description}</td>
                  <td className="align-top text-sm">{item.specifications}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{item.unit}</td>
                  <td className="text-right border border-gray-300 h-8"></td>
                  <td className="text-right border border-gray-300 h-8"></td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="text-right font-semibold">TOTAL QUOTATION:</td>
                <td className="border border-gray-300 h-8"></td>
                <td className="border border-gray-300 h-8"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quote Response Section */}
        <div className="mb-3 print-avoid-break">
          <h3 className="font-semibold text-gray-900 mb-3">VENDOR RESPONSE SECTION</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-3">
              <div>
                <label className="font-medium">Delivery Time:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
              <div>
                <label className="font-medium">Warranty Period:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
              <div>
                <label className="font-medium">Payment Terms:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-medium">Valid Until:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
              <div>
                <label className="font-medium">Shipping Terms:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
              <div>
                <label className="font-medium">Contact Person:</label>
                <div className="border border-gray-300 h-6 mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="mb-3 print-avoid-break">
          <h3 className="font-semibold text-gray-900 mb-2">ADDITIONAL TERMS & CONDITIONS</h3>
          <div className="text-xs space-y-1 border border-gray-300 p-3">
            <p>1. Please provide complete specifications and technical documentation</p>
            <p>2. Include shipping costs and delivery schedule in your quotation</p>
            <p>3. Quote must be valid for minimum 30 days from submission</p>
            <p>4. Payment terms are net 30 days unless otherwise specified</p>
            <p>5. All prices should be in USD and include applicable taxes</p>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mb-3 print-avoid-break">
            <h3 className="font-semibold text-gray-900 mb-2">SPECIAL NOTES:</h3>
            <div className="text-sm border border-gray-300 p-3">
              {data.notes}
            </div>
          </div>
        )}

        {/* Signature Section */}
        <div className="signature-section print-avoid-break">
          <div className="signature-box">
            <div className="font-medium">Vendor Signature</div>
            <div className="text-xs mt-1">Name & Title</div>
          </div>
          <div className="signature-box">
            <div className="font-medium">Date</div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-center">
          <p>Please return completed quotation by {data.dueDate}</p>
          <p>Email: procurement@company.com | Phone: {companyInfo.phone}</p>
        </div>
      </div>
    </div>
  )
}

// ============= Report Print Layout =============
interface ReportData {
  title: string
  period: string
  generatedDate: string
  summary: {
    totalOrders: number
    totalValue: number
    avgOrderValue: number
    topVendor: string
  }
  data: Array<{
    category: string
    orders: number
    value: number
    percentage: number
  }>
  charts?: Array<{
    title: string
    type: 'bar' | 'pie' | 'line'
    data: any[]
  }>
}

export const ReportPrint: React.FC<{
  data: ReportData
  companyInfo: PrintHeaderProps['companyInfo']
}> = ({ data, companyInfo }) => {
  const { printRef, handlePrint } = usePrint()

  return (
    <div className="bg-white">
      {/* Print Controls */}
      <div className="no-print bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">{data.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div ref={printRef} className="p-8 ">
        <PrintHeader
          companyInfo={companyInfo}
          documentTitle={data.title.toUpperCase()}
          documentNumber={`RPT-${Date.now()}`}
          date={data.generatedDate}
        />

        {/* Report Summary */}
        <div className="mb-3 print-avoid-break">
          <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">EXECUTIVE SUMMARY</h3>
          <div className="text-sm">
            <p className="mb-2"><span className="font-medium">Report Period:</span> {data.period}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div><span className="font-medium">Total Orders:</span> {data.summary.totalOrders}</div>
                <div><span className="font-medium">Total Value:</span> ${data.summary.totalValue.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div><span className="font-medium">Average Order Value:</span> ${data.summary.avgOrderValue.toLocaleString()}</div>
                <div><span className="font-medium">Top Vendor:</span> {data.summary.topVendor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">DETAILED BREAKDOWN</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Category</th>
                <th className="text-center">Orders</th>
                <th className="text-right">Value</th>
                <th className="text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td className="text-center">{item.orders}</td>
                  <td className="text-right">${item.value.toLocaleString()}</td>
                  <td className="text-right">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts Placeholder */}
        {data.charts && (
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">VISUAL ANALYSIS</h3>
            {data.charts.map((chart, index) => (
              <div key={index} className="mb-2 print-avoid-break">
                <h4 className="font-medium text-gray-900 mb-2">{chart.title}</h4>
                <div className="border border-gray-300 h-48 flex items-center justify-center text-gray-500">
                  Chart: {chart.title} ({chart.type})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="footer text-center">
          <p>This report was generated on {data.generatedDate}</p>
          <p>Confidential - For internal use only</p>
        </div>
      </div>
    </div>
  )
}