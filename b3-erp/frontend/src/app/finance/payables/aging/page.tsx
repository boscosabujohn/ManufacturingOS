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
  CheckCircle
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

export default function APAgingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState<string>('all')

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Payable Aging Report</h1>
        <p className="text-gray-600">Track vendor bills by payment due dates and aging</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
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
      <div className="space-y-4">
        {filteredData.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.vendorName}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.vendorCode}
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
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    View Bills
                  </button>
                  <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Statement
                  </button>
                </div>
              </div>

              {/* AP Aging Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                {/* Total Payable */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-2">Total Payable</h4>
                  <p className="text-xl font-bold text-blue-900">₹{(record.totalPayable / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-blue-600 mt-1">{record.billCount} bills</p>
                </div>

                {/* Not Due */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-2">Not Yet Due</h4>
                  <p className="text-xl font-bold text-purple-900">₹{(record.notDue / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-purple-600 mt-1">{((record.notDue / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* Due Soon */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-xs font-semibold text-yellow-900 mb-2">Due Soon</h4>
                  <p className="text-xl font-bold text-yellow-900">₹{(record.dueSoon / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-yellow-600 mt-1">{((record.dueSoon / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 0-30 days */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-900 mb-2">0-30 days</h4>
                  <p className="text-xl font-bold text-orange-900">₹{(record.current / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-orange-600 mt-1">{((record.current / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 30-60 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">30-60 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.days30to60 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.days30to60 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* 60-90 days */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 border border-rose-200">
                  <h4 className="text-xs font-semibold text-rose-900 mb-2">60-90 days</h4>
                  <p className="text-xl font-bold text-rose-900">₹{(record.days60to90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-rose-600 mt-1">{((record.days60to90 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>

                {/* Over 90 days */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <h4 className="text-xs font-semibold text-red-900 mb-2">Over 90 days</h4>
                  <p className="text-xl font-bold text-red-900">₹{(record.over90 / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-red-600 mt-1">{((record.over90 / record.totalPayable) * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
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
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          AP Aging Report Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  )
}
