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
  IndianRupee
} from 'lucide-react'

interface APAgingRecord {
  id: string
  vendorCode: string
  vendorName: string
  contactPerson: string
  phone: string
  email: string
  totalPayable: number
  notDue: number           // Future due date
  dueSoon: number          // Due within 7 days
  current: number          // 0-30 days overdue
  days30to60: number       // 30-60 days overdue
  days60to90: number       // 60-90 days overdue
  over90: number           // >90 days overdue
  oldestBill: string
  oldestBillDate: string
  billCount: number
  creditDays: number
  lastPaymentDate: string
  lastPaymentAmount: number
  paymentTerms: string
}

interface VendorBill {
  id: string
  billNumber: string
  billDate: string
  dueDate: string
  amount: number
  paidAmount: number
  balanceAmount: number
  status: 'open' | 'partial' | 'overdue' | 'paid'
  agingDays: number
  agingCategory: string
  description: string
  poNumber?: string
  invoiceNumber?: string
}

const mockAPData: APAgingRecord[] = [
  {
    id: '1',
    vendorCode: 'VEND001',
    vendorName: 'Steel Suppliers Pvt Ltd',
    contactPerson: 'Ramesh Gupta',
    phone: '+91-98765-12345',
    email: 'ramesh@steelsuppliers.com',
    totalPayable: 1850000,
    notDue: 650000,
    dueSoon: 450000,
    current: 350000,
    days30to60: 250000,
    days60to90: 100000,
    over90: 50000,
    oldestBill: 'BILL-2024-0234',
    oldestBillDate: '2024-05-10',
    billCount: 9,
    creditDays: 45,
    lastPaymentDate: '2024-09-28',
    lastPaymentAmount: 425000,
    paymentTerms: 'Net 45 days'
  },
  {
    id: '2',
    vendorCode: 'VEND002',
    vendorName: 'Component Traders Ltd',
    contactPerson: 'Sunita Rao',
    phone: '+91-98234-67890',
    email: 'sunita@componenttraders.com',
    totalPayable: 1250000,
    notDue: 400000,
    dueSoon: 350000,
    current: 300000,
    days30to60: 150000,
    days60to90: 50000,
    over90: 0,
    oldestBill: 'BILL-2024-0456',
    oldestBillDate: '2024-07-15',
    billCount: 7,
    creditDays: 30,
    lastPaymentDate: '2024-10-02',
    lastPaymentAmount: 375000,
    paymentTerms: 'Net 30 days'
  },
  {
    id: '3',
    vendorCode: 'VEND003',
    vendorName: 'Hydraulic Parts Co',
    contactPerson: 'Vijay Kumar',
    phone: '+91-97123-45678',
    email: 'vijay@hydraulicparts.com',
    totalPayable: 975000,
    notDue: 275000,
    dueSoon: 250000,
    current: 200000,
    days30to60: 150000,
    days60to90: 75000,
    over90: 25000,
    oldestBill: 'BILL-2024-0567',
    oldestBillDate: '2024-06-20',
    billCount: 6,
    creditDays: 60,
    lastPaymentDate: '2024-09-25',
    lastPaymentAmount: 280000,
    paymentTerms: 'Net 60 days'
  },
  {
    id: '4',
    vendorCode: 'VEND004',
    vendorName: 'Electrical Equipment Suppliers',
    contactPerson: 'Lakshmi Iyer',
    phone: '+91-96543-21098',
    email: 'lakshmi@electricalequip.com',
    totalPayable: 675000,
    notDue: 225000,
    dueSoon: 200000,
    current: 150000,
    days30to60: 75000,
    days60to90: 25000,
    over90: 0,
    oldestBill: 'BILL-2024-0678',
    oldestBillDate: '2024-08-05',
    billCount: 5,
    creditDays: 45,
    lastPaymentDate: '2024-10-08',
    lastPaymentAmount: 195000,
    paymentTerms: 'Net 45 days'
  },
  {
    id: '5',
    vendorCode: 'VEND005',
    vendorName: 'Packaging Materials Inc',
    contactPerson: 'Anil Mehta',
    phone: '+91-95432-10987',
    email: 'anil@packagingmat.com',
    totalPayable: 1425000,
    notDue: 525000,
    dueSoon: 400000,
    current: 300000,
    days30to60: 150000,
    days60to90: 50000,
    over90: 0,
    oldestBill: 'BILL-2024-0789',
    oldestBillDate: '2024-07-25',
    billCount: 8,
    creditDays: 30,
    lastPaymentDate: '2024-09-30',
    lastPaymentAmount: 465000,
    paymentTerms: 'Net 30 days'
  },
  {
    id: '6',
    vendorCode: 'VEND006',
    vendorName: 'Machine Tools Corporation',
    contactPerson: 'Deepak Sharma',
    phone: '+91-94321-09876',
    email: 'deepak@machinetools.com',
    totalPayable: 2150000,
    notDue: 850000,
    dueSoon: 550000,
    current: 450000,
    days30to60: 200000,
    days60to90: 75000,
    over90: 25000,
    oldestBill: 'BILL-2024-0345',
    oldestBillDate: '2024-06-01',
    billCount: 10,
    creditDays: 60,
    lastPaymentDate: '2024-09-22',
    lastPaymentAmount: 625000,
    paymentTerms: 'Net 60 days'
  }
]

// Mock bills data for each vendor
const mockVendorBills: { [vendorId: string]: VendorBill[] } = {
  '1': [
    { id: 'B1-1', billNumber: 'BILL-2024-0234', billDate: '2024-05-10', dueDate: '2024-06-24', amount: 50000, paidAmount: 0, balanceAmount: 50000, status: 'overdue', agingDays: 136, agingCategory: 'Over 90 days', description: 'Steel rods - 50 MT', poNumber: 'PO-2024-145', invoiceNumber: 'INV-SS-234' },
    { id: 'B1-2', billNumber: 'BILL-2024-0456', billDate: '2024-07-15', dueDate: '2024-08-29', amount: 100000, paidAmount: 0, balanceAmount: 100000, status: 'overdue', agingDays: 70, agingCategory: '60-90 days', description: 'Steel sheets - 30 MT', poNumber: 'PO-2024-198' },
    { id: 'B1-3', billNumber: 'BILL-2024-0678', billDate: '2024-08-20', dueDate: '2024-10-04', amount: 250000, paidAmount: 0, balanceAmount: 250000, status: 'overdue', agingDays: 34, agingCategory: '30-60 days', description: 'Steel beams - 100 MT', poNumber: 'PO-2024-234' },
    { id: 'B1-4', billNumber: 'BILL-2024-0789', billDate: '2024-09-15', dueDate: '2024-10-30', amount: 350000, paidAmount: 0, balanceAmount: 350000, status: 'overdue', agingCategory: '0-30 days', agingDays: 8, description: 'Steel plates - 75 MT', poNumber: 'PO-2024-267' },
    { id: 'B1-5', billNumber: 'BILL-2024-0890', billDate: '2024-10-10', dueDate: '2024-11-14', amount: 450000, paidAmount: 0, balanceAmount: 450000, status: 'open', agingDays: -7, agingCategory: 'Due Soon', description: 'Steel coils - 120 MT', poNumber: 'PO-2024-289' },
    { id: 'B1-6', billNumber: 'BILL-2024-0901', billDate: '2024-10-25', dueDate: '2024-12-09', amount: 650000, paidAmount: 0, balanceAmount: 650000, status: 'open', agingDays: -32, agingCategory: 'Not Due', description: 'Special steel alloy - 200 MT', poNumber: 'PO-2024-312' },
  ],
  '2': [
    { id: 'B2-1', billNumber: 'BILL-2024-0456', billDate: '2024-07-15', dueDate: '2024-08-14', amount: 150000, paidAmount: 0, balanceAmount: 150000, status: 'overdue', agingDays: 85, agingCategory: '60-90 days', description: 'Electronic components batch 1', invoiceNumber: 'CT-INV-456' },
    { id: 'B2-2', billNumber: 'BILL-2024-0567', billDate: '2024-08-25', dueDate: '2024-09-24', amount: 300000, paidAmount: 0, balanceAmount: 300000, status: 'overdue', agingDays: 44, agingCategory: '30-60 days', description: 'Circuit boards - 500 units' },
    { id: 'B2-3', billNumber: 'BILL-2024-0678', billDate: '2024-09-20', dueDate: '2024-10-20', amount: 350000, paidAmount: 0, balanceAmount: 350000, status: 'open', agingDays: -13, agingCategory: 'Due Soon', description: 'Sensors and controllers' },
    { id: 'B2-4', billNumber: 'BILL-2024-0789', billDate: '2024-10-15', dueDate: '2024-11-14', amount: 400000, paidAmount: 0, balanceAmount: 400000, status: 'open', agingDays: -7, agingCategory: 'Not Due', description: 'Microprocessors - 200 units' },
  ],
  '3': [
    { id: 'B3-1', billNumber: 'BILL-2024-0567', billDate: '2024-06-20', dueDate: '2024-08-19', amount: 25000, paidAmount: 0, balanceAmount: 25000, status: 'overdue', agingDays: 80, agingCategory: '60-90 days', description: 'Hydraulic pumps - 5 units' },
    { id: 'B3-2', billNumber: 'BILL-2024-0678', billDate: '2024-08-10', dueDate: '2024-10-09', amount: 75000, paidAmount: 0, balanceAmount: 75000, status: 'overdue', agingDays: 29, agingCategory: '0-30 days', description: 'Hydraulic cylinders - 10 units' },
    { id: 'B3-3', billNumber: 'BILL-2024-0789', billDate: '2024-09-05', dueDate: '2024-11-04', amount: 200000, paidAmount: 0, balanceAmount: 200000, status: 'overdue', agingDays: 3, agingCategory: '0-30 days', description: 'Hydraulic valves - 20 units' },
    { id: 'B3-4', billNumber: 'BILL-2024-0890', billDate: '2024-10-01', dueDate: '2024-11-10', amount: 250000, paidAmount: 0, balanceAmount: 250000, status: 'open', agingDays: -3, agingCategory: 'Due Soon', description: 'Hydraulic filters - 50 units' },
    { id: 'B3-5', billNumber: 'BILL-2024-0901', billDate: '2024-10-20', dueDate: '2024-12-19', amount: 275000, paidAmount: 0, balanceAmount: 275000, status: 'open', agingDays: -42, agingCategory: 'Not Due', description: 'Hydraulic hoses - 100 units' },
  ],
  '4': [
    { id: 'B4-1', billNumber: 'BILL-2024-0678', billDate: '2024-08-05', dueDate: '2024-09-19', amount: 75000, paidAmount: 50000, balanceAmount: 25000, status: 'partial', agingDays: 49, agingCategory: '30-60 days', description: 'Electrical cables - 1000m' },
    { id: 'B4-2', billNumber: 'BILL-2024-0789', billDate: '2024-09-10', dueDate: '2024-10-25', amount: 150000, paidAmount: 0, balanceAmount: 150000, status: 'overdue', agingDays: 13, agingCategory: '0-30 days', description: 'Circuit breakers - 50 units' },
    { id: 'B4-3', billNumber: 'BILL-2024-0890', billDate: '2024-10-05', dueDate: '2024-11-12', amount: 200000, paidAmount: 0, balanceAmount: 200000, status: 'open', agingDays: -5, agingCategory: 'Due Soon', description: 'Transformers - 10 units' },
    { id: 'B4-4', billNumber: 'BILL-2024-0901', billDate: '2024-10-20', dueDate: '2024-12-04', amount: 225000, paidAmount: 0, balanceAmount: 225000, status: 'open', agingDays: -27, agingCategory: 'Not Due', description: 'Switchgear panels - 5 units' },
  ],
  '5': [
    { id: 'B5-1', billNumber: 'BILL-2024-0789', billDate: '2024-07-25', dueDate: '2024-08-24', amount: 150000, paidAmount: 100000, balanceAmount: 50000, status: 'partial', agingDays: 75, agingCategory: '60-90 days', description: 'Packaging boxes - 10000 units' },
    { id: 'B5-2', billNumber: 'BILL-2024-0890', billDate: '2024-08-30', dueDate: '2024-09-29', amount: 150000, paidAmount: 0, balanceAmount: 150000, status: 'overdue', agingDays: 39, agingCategory: '30-60 days', description: 'Bubble wrap - 500 rolls' },
    { id: 'B5-3', billNumber: 'BILL-2024-0901', billDate: '2024-09-25', dueDate: '2024-10-25', amount: 300000, paidAmount: 0, balanceAmount: 300000, status: 'overdue', agingDays: 13, agingCategory: '0-30 days', description: 'Pallets - 1000 units' },
    { id: 'B5-4', billNumber: 'BILL-2024-1012', billDate: '2024-10-10', dueDate: '2024-11-14', amount: 400000, paidAmount: 0, balanceAmount: 400000, status: 'open', agingDays: -7, agingCategory: 'Due Soon', description: 'Stretch film - 200 rolls' },
    { id: 'B5-5', billNumber: 'BILL-2024-1123', billDate: '2024-10-25', dueDate: '2024-11-24', amount: 525000, paidAmount: 0, balanceAmount: 525000, status: 'open', agingDays: -17, agingCategory: 'Not Due', description: 'Labels and tape - bulk order' },
  ],
  '6': [
    { id: 'B6-1', billNumber: 'BILL-2024-0345', billDate: '2024-06-01', dueDate: '2024-07-31', amount: 25000, paidAmount: 0, balanceAmount: 25000, status: 'overdue', agingDays: 99, agingCategory: 'Over 90 days', description: 'Cutting tools - set of 20' },
    { id: 'B6-2', billNumber: 'BILL-2024-0456', billDate: '2024-07-20', dueDate: '2024-09-18', amount: 75000, paidAmount: 0, balanceAmount: 75000, status: 'overdue', agingDays: 50, agingCategory: '30-60 days', description: 'Drilling machine parts' },
    { id: 'B6-3', billNumber: 'BILL-2024-0567', billDate: '2024-08-25', dueDate: '2024-10-24', amount: 200000, paidAmount: 0, balanceAmount: 200000, status: 'overdue', agingDays: 14, agingCategory: '0-30 days', description: 'CNC machine components' },
    { id: 'B6-4', billNumber: 'BILL-2024-0678', billDate: '2024-09-30', dueDate: '2024-11-29', amount: 450000, paidAmount: 0, balanceAmount: 450000, status: 'open', agingDays: -22, agingCategory: 'Not Due', description: 'Lathe machine - 1 unit' },
    { id: 'B6-5', billNumber: 'BILL-2024-0789', billDate: '2024-10-15', dueDate: '2024-11-09', amount: 550000, paidAmount: 0, balanceAmount: 550000, status: 'open', agingDays: -2, agingCategory: 'Due Soon', description: 'Milling machine parts' },
    { id: 'B6-6', billNumber: 'BILL-2024-0890', billDate: '2024-10-25', dueDate: '2024-12-24', amount: 850000, paidAmount: 0, balanceAmount: 850000, status: 'open', agingDays: -47, agingCategory: 'Not Due', description: 'Grinding machine - complete unit' },
  ],
}

export default function APAgingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<string>('all')
  const [selectedVendor, setSelectedVendor] = useState<APAgingRecord | null>(null)
  const [showBillsModal, setShowBillsModal] = useState(false)
  const [isDownloadingStatement, setIsDownloadingStatement] = useState(false)

  const filteredData = useMemo(() => {
    let data = mockAPData.filter(record =>
      record.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    const total = mockAPData.reduce((sum, r) => sum + r.totalPayable, 0)
    const notDue = mockAPData.reduce((sum, r) => sum + r.notDue, 0)
    const dueSoon = mockAPData.reduce((sum, r) => sum + r.dueSoon, 0)
    const current = mockAPData.reduce((sum, r) => sum + r.current, 0)
    const days30to60 = mockAPData.reduce((sum, r) => sum + r.days30to60, 0)
    const days60to90 = mockAPData.reduce((sum, r) => sum + r.days60to90, 0)
    const over90 = mockAPData.reduce((sum, r) => sum + r.over90, 0)
    const overdue = current + days30to60 + days60to90 + over90
    const overduePercentage = (overdue / total) * 100

    return { total, notDue, dueSoon, current, days30to60, days60to90, over90, overdue, overduePercentage }
  }, [])

  const handleViewBills = (vendor: APAgingRecord) => {
    setSelectedVendor(vendor)
    setShowBillsModal(true)
  }

  const handleDownloadStatement = (vendor: APAgingRecord) => {
    setIsDownloadingStatement(true)
    // Simulate download process
    setTimeout(() => {
      // Create a simple text-based statement (in production, this would be a proper PDF)
      const statement = `
VENDOR STATEMENT
================

Vendor: ${vendor.vendorName}
Vendor Code: ${vendor.vendorCode}
Contact: ${vendor.contactPerson}
Phone: ${vendor.phone}
Email: ${vendor.email}

Statement Date: ${new Date().toLocaleDateString('en-IN')}

SUMMARY
-------
Total Payable: ₹${vendor.totalPayable.toLocaleString('en-IN')}
Not Yet Due: ₹${vendor.notDue.toLocaleString('en-IN')}
Due Soon (7 days): ₹${vendor.dueSoon.toLocaleString('en-IN')}
0-30 days overdue: ₹${vendor.current.toLocaleString('en-IN')}
30-60 days overdue: ₹${vendor.days30to60.toLocaleString('en-IN')}
60-90 days overdue: ₹${vendor.days60to90.toLocaleString('en-IN')}
Over 90 days: ₹${vendor.over90.toLocaleString('en-IN')}

Payment Terms: ${vendor.paymentTerms}
Credit Days: ${vendor.creditDays}

Last Payment: ₹${vendor.lastPaymentAmount.toLocaleString('en-IN')} on ${new Date(vendor.lastPaymentDate).toLocaleDateString('en-IN')}

BILL DETAILS
------------
${mockVendorBills[vendor.id]?.map(bill => `
Bill: ${bill.billNumber}
Date: ${new Date(bill.billDate).toLocaleDateString('en-IN')}
Due: ${new Date(bill.dueDate).toLocaleDateString('en-IN')}
Amount: ₹${bill.amount.toLocaleString('en-IN')}
Balance: ₹${bill.balanceAmount.toLocaleString('en-IN')}
Status: ${bill.status.toUpperCase()}
Description: ${bill.description}
`).join('\n') || 'No bills found'}

---
Generated by ManufacturingOS Finance Module
      `.trim()

      // Create a download link
      const blob = new Blob([statement], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Statement_${vendor.vendorCode}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsDownloadingStatement(false)
      alert(`Statement for ${vendor.vendorName} has been downloaded successfully!`)
    }, 1000)
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
    <div className="p-6 ">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Payable Aging Report</h1>
        <p className="text-gray-600">Track vendor bills by payment due dates and aging</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Payable</p>
              <p className="text-2xl font-bold text-blue-900">₹{(stats.total / 100000).toFixed(1)}L</p>
            </div>
            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-3 border border-purple-200">
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

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-3 border border-yellow-200">
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

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-3 border border-orange-200">
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

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-3 border border-red-200">
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

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-3 border border-green-200">
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
      <div className="bg-white rounded-lg shadow mb-3 p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Vendor</label>
            <input
              type="text"
              placeholder="Search by vendor name, code, or contact..."
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

      {/* Vendor AP Aging List */}
      <div className="space-y-2">
        {filteredData.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.vendorName}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.vendorCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
                    onClick={() => handleViewBills(record)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View Bills
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

              {/* AP Aging Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2">
                {/* Total Payable */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-2">Total Payable</h4>
                  <p className="text-xl font-bold text-blue-900">₹{(record.totalPayable / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-blue-600 mt-1">{record.billCount} bills</p>
                </div>

                {/* Not Due */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-2">Not Yet Due</h4>
                  <p className="text-xl font-bold text-purple-900">₹{(record.notDue / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-purple-600 mt-1">{((record.notDue / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* Due Soon */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                  <h4 className="text-xs font-semibold text-yellow-900 mb-2">Due Soon</h4>
                  <p className="text-xl font-bold text-yellow-900">₹{(record.dueSoon / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-yellow-600 mt-1">{((record.dueSoon / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 0-30 days */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-900 mb-2">0-30 days</h4>
                  <p className="text-xl font-bold text-orange-900">₹{(record.current / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-orange-600 mt-1">{((record.current / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 30-60 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">30-60 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.days30to60 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.days30to60 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 60-90 days */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-3 border border-rose-200">
                  <h4 className="text-xs font-semibold text-rose-900 mb-2">60-90 days</h4>
                  <p className="text-xl font-bold text-rose-900">₹{(record.days60to90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-rose-600 mt-1">{((record.days60to90 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* Over 90 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">Over 90 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.over90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.over90 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Oldest Bill</p>
                  <p className="text-sm font-semibold text-gray-900">{record.oldestBill}</p>
                  <p className="text-xs text-gray-500">{new Date(record.oldestBillDate).toLocaleDateString('en-IN')}</p>
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
                    {(((record.current + record.days30to60 + record.days60to90 + record.over90) / record.totalPayable) * 100).toFixed(0)}% of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-3 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          AP Aging Report Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Payment Categories</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Not Yet Due: Bills with future due dates</li>
              <li>Due Soon (7 days): Priority payment planning</li>
              <li>0-30 days: Recently overdue, contact vendor</li>
              <li>30-60 days: Escalate for immediate payment</li>
              <li>60-90 days: Critical, may damage vendor relationship</li>
              <li>Over 90 days: Very critical, legal issues possible</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Payment Priority Actions</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Over 90 days: Immediate payment, highest priority</li>
              <li>60-90 days: Schedule payment within 7 days</li>
              <li>30-60 days: Include in next payment run</li>
              <li>0-30 days: Monitor and plan payment</li>
              <li>Due Soon: Prepare for timely payment</li>
              <li>Not Due: Track for future payment schedule</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Vendor Management</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Maintain good payment track record</li>
              <li>Negotiate favorable payment terms</li>
              <li>Take early payment discounts when available</li>
              <li>Communicate delays proactively</li>
              <li>Resolve payment disputes quickly</li>
              <li>Maintain accurate vendor records</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Review AP aging report weekly</li>
              <li>Prioritize payments based on criticality</li>
              <li>Optimize cash flow management</li>
              <li>Avoid late payment penalties</li>
              <li>Build strong vendor relationships</li>
              <li>Maintain proper documentation</li>
              <li>Schedule recurring payments automatically</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bills Modal */}
      {showBillsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedVendor.vendorName}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Vendor Code: {selectedVendor.vendorCode} • {selectedVendor.billCount} Bills • Total: ₹{selectedVendor.totalPayable.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setShowBillsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Vendor Info Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 mb-3 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Contact Person</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      {selectedVendor.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-600" />
                      {selectedVendor.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-600" />
                      {selectedVendor.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Payment Terms</p>
                    <p className="font-semibold text-gray-900">{selectedVendor.paymentTerms}</p>
                  </div>
                </div>
              </div>

              {/* Bills List */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bill Details</h3>
              <div className="space-y-3">
                {mockVendorBills[selectedVendor.id]?.map((bill) => (
                  <div
                    key={bill.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{bill.billNumber}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(bill.status)}`}>
                            {bill.status}
                          </span>
                          {bill.agingDays > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              {bill.agingDays} days overdue
                            </span>
                          )}
                          {bill.agingDays <= 0 && bill.agingDays > -8 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              Due in {Math.abs(bill.agingDays)} days
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{bill.description}</p>
                        {bill.poNumber && (
                          <p className="text-xs text-gray-500 mt-1">PO: {bill.poNumber}</p>
                        )}
                        {bill.invoiceNumber && (
                          <p className="text-xs text-gray-500">Invoice: {bill.invoiceNumber}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{bill.balanceAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mt-1">Balance Due</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Bill Date</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(bill.billDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Due Date</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(bill.dueDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Bill Amount</p>
                        <p className="text-sm font-semibold text-gray-900">₹{bill.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Paid Amount</p>
                        <p className="text-sm font-semibold text-green-700">₹{bill.paidAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Aging Category</p>
                        <p className="text-sm font-semibold text-gray-900">{bill.agingCategory}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Make Payment
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        View Document
                      </button>
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Send Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Total Outstanding:</span>{' '}
                <span className="text-lg font-bold text-red-700">₹{selectedVendor.totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadStatement(selectedVendor)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download Statement
                </button>
                <button
                  onClick={() => setShowBillsModal(false)}
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
