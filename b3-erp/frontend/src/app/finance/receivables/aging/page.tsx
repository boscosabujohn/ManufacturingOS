'use client'

import React, { useState, useMemo } from 'react'
import {
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Download,
  Mail,
  Phone,
  TrendingUp,
  CheckCircle,
  X,
  CreditCard,
  Send,
  PhoneCall
} from 'lucide-react'

interface ARAgingRecord {
  id: string
  customerCode: string
  customerName: string
  contactPerson: string
  phone: string
  email: string
  totalReceivable: number
  notDue: number           // Future due date
  dueSoon: number          // Due within 7 days
  current: number          // 0-30 days overdue
  days30to60: number       // 30-60 days overdue
  days60to90: number       // 60-90 days overdue
  over90: number           // >90 days overdue
  oldestInvoice: string
  oldestInvoiceDate: string
  invoiceCount: number
  creditDays: number
  lastPaymentDate: string
  lastPaymentAmount: number
  paymentTerms: string
  creditLimit: number
}

interface CustomerInvoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amount: number
  receivedAmount: number
  balanceAmount: number
  status: 'open' | 'partial' | 'overdue' | 'paid'
  agingDays: number
  agingCategory: string
  description: string
  poNumber?: string
  orderNumber?: string
}

// Mock data for AR aging
const mockARData: ARAgingRecord[] = [
  {
    id: '1',
    customerCode: 'CUST001',
    customerName: 'Acme Corporation',
    contactPerson: 'John Smith',
    phone: '+91-98765-43210',
    email: 'john.smith@acme.com',
    totalReceivable: 2150000,
    notDue: 850000,
    dueSoon: 550000,
    current: 450000,
    days30to60: 200000,
    days60to90: 75000,
    over90: 25000,
    oldestInvoice: 'INV-2024-1001',
    oldestInvoiceDate: '2024-06-01',
    invoiceCount: 10,
    creditDays: 45,
    lastPaymentDate: '2024-10-15',
    lastPaymentAmount: 625000,
    paymentTerms: 'Net 45 days',
    creditLimit: 5000000
  },
  {
    id: '2',
    customerCode: 'CUST002',
    customerName: 'Global Tech Industries',
    contactPerson: 'Sarah Johnson',
    phone: '+91-98234-56780',
    email: 'sarah@globaltech.com',
    totalReceivable: 1750000,
    notDue: 650000,
    dueSoon: 450000,
    current: 350000,
    days30to60: 200000,
    days60to90: 75000,
    over90: 25000,
    oldestInvoice: 'INV-2024-1012',
    oldestInvoiceDate: '2024-06-15',
    invoiceCount: 8,
    creditDays: 30,
    lastPaymentDate: '2024-10-10',
    lastPaymentAmount: 425000,
    paymentTerms: 'Net 30 days',
    creditLimit: 3000000
  },
  {
    id: '3',
    customerCode: 'CUST003',
    customerName: 'Prime Manufacturing Ltd',
    contactPerson: 'Michael Brown',
    phone: '+91-97123-45678',
    email: 'michael@primemfg.com',
    totalReceivable: 1425000,
    notDue: 525000,
    dueSoon: 400000,
    current: 300000,
    days30to60: 150000,
    days60to90: 50000,
    over90: 0,
    oldestInvoice: 'INV-2024-1023',
    oldestInvoiceDate: '2024-07-20',
    invoiceCount: 7,
    creditDays: 60,
    lastPaymentDate: '2024-09-28',
    lastPaymentAmount: 465000,
    paymentTerms: 'Net 60 days',
    creditLimit: 2500000
  },
  {
    id: '4',
    customerCode: 'CUST004',
    customerName: 'Enterprise Solutions Inc',
    contactPerson: 'Emily Davis',
    phone: '+91-96543-21098',
    email: 'emily@enterprise.com',
    totalReceivable: 1250000,
    notDue: 400000,
    dueSoon: 350000,
    current: 300000,
    days30to60: 150000,
    days60to90: 50000,
    over90: 0,
    oldestInvoice: 'INV-2024-1034',
    oldestInvoiceDate: '2024-08-05',
    invoiceCount: 6,
    creditDays: 45,
    lastPaymentDate: '2024-10-05',
    lastPaymentAmount: 375000,
    paymentTerms: 'Net 45 days',
    creditLimit: 2000000
  },
  {
    id: '5',
    customerCode: 'CUST005',
    customerName: 'Innovative Systems Pvt Ltd',
    contactPerson: 'David Wilson',
    phone: '+91-95432-10987',
    email: 'david@innovative.com',
    totalReceivable: 975000,
    notDue: 275000,
    dueSoon: 250000,
    current: 200000,
    days30to60: 150000,
    days60to90: 75000,
    over90: 25000,
    oldestInvoice: 'INV-2024-1045',
    oldestInvoiceDate: '2024-06-25',
    invoiceCount: 5,
    creditDays: 30,
    lastPaymentDate: '2024-09-30',
    lastPaymentAmount: 280000,
    paymentTerms: 'Net 30 days',
    creditLimit: 1500000
  },
  {
    id: '6',
    customerCode: 'CUST006',
    customerName: 'Tech Dynamics Corporation',
    contactPerson: 'Lisa Anderson',
    phone: '+91-94321-09876',
    email: 'lisa@techdynamics.com',
    totalReceivable: 675000,
    notDue: 225000,
    dueSoon: 200000,
    current: 150000,
    days30to60: 75000,
    days60to90: 25000,
    over90: 0,
    oldestInvoice: 'INV-2024-1056',
    oldestInvoiceDate: '2024-08-15',
    invoiceCount: 4,
    creditDays: 45,
    lastPaymentDate: '2024-10-12',
    lastPaymentAmount: 195000,
    paymentTerms: 'Net 45 days',
    creditLimit: 1000000
  }
]

// Mock invoice data for each customer
const mockCustomerInvoices: { [customerId: string]: CustomerInvoice[] } = {
  '1': [
    { id: 'I1-1', invoiceNumber: 'INV-2024-1001', invoiceDate: '2024-06-01', dueDate: '2024-07-16', amount: 25000, receivedAmount: 0, balanceAmount: 25000, status: 'overdue', agingDays: 114, agingCategory: 'Over 90 days', description: 'Manufacturing equipment', orderNumber: 'SO-2024-501' },
    { id: 'I1-2', invoiceNumber: 'INV-2024-1012', invoiceDate: '2024-07-20', dueDate: '2024-09-03', amount: 75000, receivedAmount: 0, balanceAmount: 75000, status: 'overdue', agingDays: 65, agingCategory: '60-90 days', description: 'Industrial components', poNumber: 'PO-ACME-234' },
    { id: 'I1-3', invoiceNumber: 'INV-2024-1023', invoiceDate: '2024-08-25', dueDate: '2024-10-09', amount: 200000, receivedAmount: 0, balanceAmount: 200000, status: 'overdue', agingDays: 29, agingCategory: '30-60 days', description: 'Custom machinery parts', orderNumber: 'SO-2024-567' },
    { id: 'I1-4', invoiceNumber: 'INV-2024-1034', invoiceDate: '2024-09-20', dueDate: '2024-11-04', amount: 450000, receivedAmount: 0, balanceAmount: 450000, status: 'overdue', agingDays: 3, agingCategory: '0-30 days', description: 'Production line equipment', poNumber: 'PO-ACME-289' },
    { id: 'I1-5', invoiceNumber: 'INV-2024-1045', invoiceDate: '2024-10-15', dueDate: '2024-11-19', amount: 550000, receivedAmount: 0, balanceAmount: 550000, status: 'open', agingDays: -12, agingCategory: 'Due Soon', description: 'Assembly machines', orderNumber: 'SO-2024-623' },
    { id: 'I1-6', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-10-30', dueDate: '2024-12-14', amount: 850000, receivedAmount: 0, balanceAmount: 850000, status: 'open', agingDays: -37, agingCategory: 'Not Due', description: 'Automated systems', orderNumber: 'SO-2024-678' },
  ],
  '2': [
    { id: 'I2-1', invoiceNumber: 'INV-2024-1012', invoiceDate: '2024-06-15', dueDate: '2024-07-15', amount: 25000, receivedAmount: 0, balanceAmount: 25000, status: 'overdue', agingDays: 114, agingCategory: 'Over 90 days', description: 'Tech infrastructure', poNumber: 'PO-GT-156' },
    { id: 'I2-2', invoiceNumber: 'INV-2024-1023', invoiceDate: '2024-07-30', dueDate: '2024-08-29', amount: 200000, receivedAmount: 125000, balanceAmount: 75000, status: 'partial', agingDays: 70, agingCategory: '60-90 days', description: 'Server components', orderNumber: 'SO-2024-534' },
    { id: 'I2-3', invoiceNumber: 'INV-2024-1034', invoiceDate: '2024-09-05', dueDate: '2024-10-05', amount: 350000, receivedAmount: 150000, balanceAmount: 200000, status: 'partial', agingDays: 33, agingCategory: '30-60 days', description: 'Network equipment', poNumber: 'PO-GT-178' },
    { id: 'I2-4', invoiceNumber: 'INV-2024-1045', invoiceDate: '2024-10-10', dueDate: '2024-11-09', amount: 450000, receivedAmount: 100000, balanceAmount: 350000, status: 'partial', agingDays: -2, agingCategory: 'Due Soon', description: 'IT infrastructure', orderNumber: 'SO-2024-589' },
    { id: 'I2-5', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-10-25', dueDate: '2024-11-24', amount: 650000, receivedAmount: 0, balanceAmount: 650000, status: 'open', agingDays: -17, agingCategory: 'Not Due', description: 'Data center equipment', orderNumber: 'SO-2024-623' },
  ],
  '3': [
    { id: 'I3-1', invoiceNumber: 'INV-2024-1023', invoiceDate: '2024-07-20', dueDate: '2024-09-18', amount: 150000, receivedAmount: 100000, balanceAmount: 50000, status: 'partial', agingDays: 50, agingCategory: '30-60 days', description: 'Manufacturing supplies', poNumber: 'PO-PM-234' },
    { id: 'I3-2', invoiceNumber: 'INV-2024-1034', invoiceDate: '2024-08-30', dueDate: '2024-10-29', amount: 300000, receivedAmount: 0, balanceAmount: 300000, status: 'overdue', agingDays: 9, agingCategory: '0-30 days', description: 'Production materials', orderNumber: 'SO-2024-578' },
    { id: 'I3-3', invoiceNumber: 'INV-2024-1045', invoiceDate: '2024-10-05', dueDate: '2024-12-04', amount: 400000, receivedAmount: 0, balanceAmount: 400000, status: 'open', agingDays: -27, agingCategory: 'Not Due', description: 'Industrial equipment', poNumber: 'PO-PM-289' },
    { id: 'I3-4', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-10-20', dueDate: '2024-11-14', amount: 525000, receivedAmount: 0, balanceAmount: 525000, status: 'open', agingDays: -7, agingCategory: 'Due Soon', description: 'Machinery parts', orderNumber: 'SO-2024-612' },
  ],
  '4': [
    { id: 'I4-1', invoiceNumber: 'INV-2024-1034', invoiceDate: '2024-08-05', dueDate: '2024-09-19', amount: 150000, receivedAmount: 100000, balanceAmount: 50000, status: 'partial', agingDays: 49, agingCategory: '30-60 days', description: 'Enterprise software', poNumber: 'PO-ES-145' },
    { id: 'I4-2', invoiceNumber: 'INV-2024-1045', invoiceDate: '2024-09-15', dueDate: '2024-10-30', amount: 300000, receivedAmount: 0, balanceAmount: 300000, status: 'overdue', agingDays: 8, agingCategory: '0-30 days', description: 'IT solutions', orderNumber: 'SO-2024-590' },
    { id: 'I4-3', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-10-10', dueDate: '2024-11-19', amount: 350000, receivedAmount: 0, balanceAmount: 350000, status: 'open', agingDays: -12, agingCategory: 'Due Soon', description: 'Cloud services', poNumber: 'PO-ES-178' },
    { id: 'I4-4', invoiceNumber: 'INV-2024-1067', invoiceDate: '2024-10-25', dueDate: '2024-12-09', amount: 400000, receivedAmount: 0, balanceAmount: 400000, status: 'open', agingDays: -32, agingCategory: 'Not Due', description: 'Digital transformation', orderNumber: 'SO-2024-634' },
  ],
  '5': [
    { id: 'I5-1', invoiceNumber: 'INV-2024-1045', invoiceDate: '2024-06-25', dueDate: '2024-07-25', amount: 25000, receivedAmount: 0, balanceAmount: 25000, status: 'overdue', agingDays: 104, agingCategory: 'Over 90 days', description: 'Innovation consulting', orderNumber: 'SO-2024-489' },
    { id: 'I5-2', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-08-15', dueDate: '2024-09-14', amount: 150000, receivedAmount: 75000, balanceAmount: 75000, status: 'partial', agingDays: 54, agingCategory: '30-60 days', description: 'System integration', poNumber: 'PO-IS-234' },
    { id: 'I5-3', invoiceNumber: 'INV-2024-1067', invoiceDate: '2024-09-25', dueDate: '2024-10-25', amount: 200000, receivedAmount: 0, balanceAmount: 200000, status: 'overdue', agingDays: 13, agingCategory: '0-30 days', description: 'Software development', orderNumber: 'SO-2024-567' },
    { id: 'I5-4', invoiceNumber: 'INV-2024-1078', invoiceDate: '2024-10-15', dueDate: '2024-11-14', amount: 250000, receivedAmount: 0, balanceAmount: 250000, status: 'open', agingDays: -7, agingCategory: 'Due Soon', description: 'Tech solutions', poNumber: 'PO-IS-267' },
    { id: 'I5-5', invoiceNumber: 'INV-2024-1089', invoiceDate: '2024-10-28', dueDate: '2024-11-27', amount: 275000, receivedAmount: 0, balanceAmount: 275000, status: 'open', agingDays: -20, agingCategory: 'Not Due', description: 'Innovation services', orderNumber: 'SO-2024-623' },
  ],
  '6': [
    { id: 'I6-1', invoiceNumber: 'INV-2024-1056', invoiceDate: '2024-08-15', dueDate: '2024-09-29', amount: 75000, receivedAmount: 50000, balanceAmount: 25000, status: 'partial', agingDays: 39, agingCategory: '30-60 days', description: 'Tech consulting', poNumber: 'PO-TD-156' },
    { id: 'I6-2', invoiceNumber: 'INV-2024-1067', invoiceDate: '2024-09-20', dueDate: '2024-11-04', amount: 150000, receivedAmount: 0, balanceAmount: 150000, status: 'overdue', agingDays: 3, agingCategory: '0-30 days', description: 'Digital services', orderNumber: 'SO-2024-578' },
    { id: 'I6-3', invoiceNumber: 'INV-2024-1078', invoiceDate: '2024-10-10', dueDate: '2024-11-19', amount: 200000, receivedAmount: 0, balanceAmount: 200000, status: 'open', agingDays: -12, agingCategory: 'Due Soon', description: 'Platform development', poNumber: 'PO-TD-189' },
    { id: 'I6-4', invoiceNumber: 'INV-2024-1089', invoiceDate: '2024-10-25', dueDate: '2024-12-09', amount: 225000, receivedAmount: 0, balanceAmount: 225000, status: 'open', agingDays: -32, agingCategory: 'Not Due', description: 'Tech infrastructure', orderNumber: 'SO-2024-612' },
  ],
}

export default function ARAgingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<string>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<ARAgingRecord | null>(null)
  const [showInvoicesModal, setShowInvoicesModal] = useState(false)
  const [isDownloadingStatement, setIsDownloadingStatement] = useState(false)

  const filteredData = useMemo(() => {
    let data = mockARData.filter(record =>
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (ageFilter === 'not-due') {
      data = data.filter(r => r.notDue > 0)
    } else if (ageFilter === 'due-soon') {
      data = data.filter(r => r.dueSoon > 0)
    } else if (ageFilter === 'current') {
      data = data.filter(r => r.current > 0)
    } else if (ageFilter === '30-60') {
      data = data.filter(r => r.days30to60 > 0)
    } else if (ageFilter === 'overdue') {
      data = data.filter(r => (r.current + r.days30to60 + r.days60to90 + r.over90) > 0)
    }

    return data
  }, [searchTerm, ageFilter])

  const stats = useMemo(() => {
    const total = mockARData.reduce((sum, r) => sum + r.totalReceivable, 0)
    const notDue = mockARData.reduce((sum, r) => sum + r.notDue, 0)
    const dueSoon = mockARData.reduce((sum, r) => sum + r.dueSoon, 0)
    const current = mockARData.reduce((sum, r) => sum + r.current, 0)
    const days30to60 = mockARData.reduce((sum, r) => sum + r.days30to60, 0)
    const days60to90 = mockARData.reduce((sum, r) => sum + r.days60to90, 0)
    const over90 = mockARData.reduce((sum, r) => sum + r.over90, 0)
    const overdue = current + days30to60 + days60to90 + over90
    const overduePercentage = (overdue / total) * 100

    return { total, notDue, dueSoon, current, days30to60, days60to90, over90, overdue, overduePercentage }
  }, [])

  const handleViewInvoices = (customer: ARAgingRecord) => {
    setSelectedCustomer(customer)
    setShowInvoicesModal(true)
  }

  const handleDownloadStatement = (customer: ARAgingRecord) => {
    setIsDownloadingStatement(true)
    setTimeout(() => {
      const statement = `
CUSTOMER STATEMENT
==================

Customer: ${customer.customerName}
Customer Code: ${customer.customerCode}
Contact: ${customer.contactPerson}
Phone: ${customer.phone}
Email: ${customer.email}

Statement Date: ${new Date().toLocaleDateString('en-IN')}

SUMMARY
-------
Total Receivable: ₹${customer.totalReceivable.toLocaleString('en-IN')}
Not Yet Due: ₹${customer.notDue.toLocaleString('en-IN')}
Due Soon (7 days): ₹${customer.dueSoon.toLocaleString('en-IN')}
0-30 days overdue: ₹${customer.current.toLocaleString('en-IN')}
30-60 days overdue: ₹${customer.days30to60.toLocaleString('en-IN')}
60-90 days overdue: ₹${customer.days60to90.toLocaleString('en-IN')}
Over 90 days: ₹${customer.over90.toLocaleString('en-IN')}

Payment Terms: ${customer.paymentTerms}
Credit Days: ${customer.creditDays}
Credit Limit: ₹${customer.creditLimit.toLocaleString('en-IN')}

Last Payment: ₹${customer.lastPaymentAmount.toLocaleString('en-IN')} on ${new Date(customer.lastPaymentDate).toLocaleDateString('en-IN')}

INVOICE DETAILS
---------------
${mockCustomerInvoices[customer.id]?.map(invoice => `
Invoice: ${invoice.invoiceNumber}
Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}
Due: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}
Amount: ₹${invoice.amount.toLocaleString('en-IN')}
Balance: ₹${invoice.balanceAmount.toLocaleString('en-IN')}
Status: ${invoice.status.toUpperCase()}
Description: ${invoice.description}
`).join('\n') || 'No invoices found'}

---
Generated by ManufacturingOS Finance Module
      `.trim()

      const blob = new Blob([statement], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Statement_${customer.customerCode}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsDownloadingStatement(false)
      alert(`Statement for ${customer.customerName} has been downloaded successfully!`)
    }, 1000)
  }

  const handleSendReminder = (customer: ARAgingRecord) => {
    alert(`Collection Reminder Email\n\nTo: ${customer.email}\nCustomer: ${customer.customerName}\n\nThis will send an automated payment reminder email with:\n- Outstanding invoice details\n- Overdue amounts\n- Payment instructions\n- Contact information`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Receivable Aging Report</h1>
        <p className="text-gray-600">Track customer invoices by payment due dates and aging</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Receivable</p>
              <p className="text-2xl font-bold text-blue-900">₹{(stats.total / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Not Yet Due</p>
              <p className="text-2xl font-bold text-purple-900">₹{(stats.notDue / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Due Soon (7d)</p>
              <p className="text-2xl font-bold text-yellow-900">₹{(stats.dueSoon / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">0-30 days OD</p>
              <p className="text-2xl font-bold text-orange-900">₹{(stats.current / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">30+ days OD</p>
              <p className="text-2xl font-bold text-red-900">₹{((stats.days30to60 + stats.days60to90 + stats.over90) / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Overdue %</p>
              <p className="text-2xl font-bold text-green-900">{stats.overduePercentage.toFixed(1)}%</p>
            </div>
            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Customer</label>
            <input
              type="text"
              placeholder="Search by customer name, code, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="not-due">Not Yet Due</option>
              <option value="due-soon">Due Within 7 Days</option>
              <option value="current">0-30 Days Overdue</option>
              <option value="30-60">30-60 Days Overdue</option>
              <option value="overdue">All Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer AR Aging List */}
      <div className="space-y-4">
        {filteredData.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.customerName}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.customerCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {record.contactPerson}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {record.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {record.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewInvoices(record)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View Invoices
                  </button>
                  <button
                    onClick={() => handleSendReminder(record)}
                    className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2 text-sm transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </button>
                  <button
                    onClick={() => handleDownloadStatement(record)}
                    disabled={isDownloadingStatement}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloadingStatement ? 'Downloading...' : 'Statement'}
                  </button>
                </div>
              </div>

              {/* AR Aging Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                {/* Total Receivable */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-2">Total Receivable</h4>
                  <p className="text-xl font-bold text-blue-900">₹{(record.totalReceivable / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-blue-600 mt-1">{record.invoiceCount} invoices</p>
                </div>

                {/* Not Due */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-2">Not Yet Due</h4>
                  <p className="text-xl font-bold text-purple-900">₹{(record.notDue / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-purple-600 mt-1">{((record.notDue / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>

                {/* Due Soon */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-xs font-semibold text-yellow-900 mb-2">Due Soon</h4>
                  <p className="text-xl font-bold text-yellow-900">₹{(record.dueSoon / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-yellow-600 mt-1">{((record.dueSoon / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>

                {/* 0-30 days */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-900 mb-2">0-30 days</h4>
                  <p className="text-xl font-bold text-orange-900">₹{(record.current / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-orange-600 mt-1">{((record.current / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>

                {/* 30-60 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">30-60 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.days30to60 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.days30to60 / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>

                {/* 60-90 days */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 border border-rose-200">
                  <h4 className="text-xs font-semibold text-rose-900 mb-2">60-90 days</h4>
                  <p className="text-xl font-bold text-rose-900">₹{(record.days60to90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-rose-600 mt-1">{((record.days60to90 / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>

                {/* Over 90 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">Over 90 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.over90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.over90 / record.totalReceivable) * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Oldest Invoice</p>
                  <p className="text-sm font-semibold text-gray-900">{record.oldestInvoice}</p>
                  <p className="text-xs text-gray-500">{new Date(record.oldestInvoiceDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Payment Terms</p>
                  <p className="text-sm font-semibold text-gray-900">{record.paymentTerms}</p>
                  <p className="text-xs text-gray-500">{record.creditDays} days credit</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Payment</p>
                  <p className="text-sm font-semibold text-gray-900">₹{(record.lastPaymentAmount / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-gray-500">{new Date(record.lastPaymentDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Overdue Amount</p>
                  <p className="text-sm font-semibold text-red-700">
                    ₹{((record.current + record.days30to60 + record.days60to90 + record.over90) / 100000).toFixed(2)}L
                  </p>
                  <p className="text-xs text-red-600">
                    {(((record.current + record.days30to60 + record.days60to90 + record.over90) / record.totalReceivable) * 100).toFixed(0)}% of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          AR Aging Report Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Collection Categories</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Not Yet Due: Invoices with future due dates</li>
              <li>Due Soon (7 days): Priority collection planning</li>
              <li>0-30 days: Recently overdue, send reminders</li>
              <li>30-60 days: Escalate collection efforts</li>
              <li>60-90 days: Critical, management intervention</li>
              <li>Over 90 days: Legal action consideration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Collection Actions</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Over 90 days: Legal notice, stop credit</li>
              <li>60-90 days: Senior management contact</li>
              <li>30-60 days: Phone calls, formal letters</li>
              <li>0-30 days: Email reminders</li>
              <li>Due Soon: Courtesy reminders</li>
              <li>Monitor credit limits continuously</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Customer Relations</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Maintain professional communication</li>
              <li>Understand payment challenges</li>
              <li>Offer payment plans when appropriate</li>
              <li>Document all collection attempts</li>
              <li>Preserve business relationships</li>
              <li>Balance firmness with courtesy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Review AR aging report daily</li>
              <li>Send invoices promptly</li>
              <li>Follow up on overdue accounts</li>
              <li>Set clear credit policies</li>
              <li>Reward early payments</li>
              <li>Monitor customer payment patterns</li>
              <li>Maintain accurate records</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invoices Modal */}
      {showInvoicesModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedCustomer.customerName}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Customer Code: {selectedCustomer.customerCode} • {selectedCustomer.invoiceCount} Invoices • Total: ₹{selectedCustomer.totalReceivable.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Customer Info Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Contact Person</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      {selectedCustomer.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-600" />
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-600" />
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Credit Limit</p>
                    <p className="font-semibold text-gray-900">₹{(selectedCustomer.creditLimit / 100000).toFixed(2)}L</p>
                    <p className="text-xs text-gray-500">{selectedCustomer.paymentTerms}</p>
                  </div>
                </div>
              </div>

              {/* Invoices List */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h3>
              <div className="space-y-3">
                {mockCustomerInvoices[selectedCustomer.id]?.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(invoice.status)}`}>
                            {invoice.status}
                          </span>
                          {invoice.agingDays > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              {invoice.agingDays} days overdue
                            </span>
                          )}
                          {invoice.agingDays <= 0 && invoice.agingDays > -8 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              Due in {Math.abs(invoice.agingDays)} days
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{invoice.description}</p>
                        {invoice.poNumber && (
                          <p className="text-xs text-gray-500 mt-1">PO: {invoice.poNumber}</p>
                        )}
                        {invoice.orderNumber && (
                          <p className="text-xs text-gray-500">Order: {invoice.orderNumber}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{invoice.balanceAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mt-1">Balance Due</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Invoice Date</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Due Date</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Invoice Amount</p>
                        <p className="text-sm font-semibold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Received Amount</p>
                        <p className="text-sm font-semibold text-green-700">₹{invoice.receivedAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Aging Category</p>
                        <p className="text-sm font-semibold text-gray-900">{invoice.agingCategory}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Record Payment
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        View Document
                      </button>
                      <button className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-xs font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Send Reminder
                      </button>
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs font-medium flex items-center gap-1">
                        <PhoneCall className="h-3 w-3" />
                        Call Customer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Total Outstanding:</span>{' '}
                <span className="text-lg font-bold text-red-700">₹{selectedCustomer.totalReceivable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendReminder(selectedCustomer)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2 text-sm"
                >
                  <Send className="h-4 w-4" />
                  Send Collection Reminder
                </button>
                <button
                  onClick={() => handleDownloadStatement(selectedCustomer)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download Statement
                </button>
                <button
                  onClick={() => setShowInvoicesModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
