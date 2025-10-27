'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calculator,
  Send,
  Download
} from 'lucide-react'

interface BonusProcessing {
  id: string
  employeeId: string
  employeeName: string
  designation: string
  department: string
  bonusType: 'statutory' | 'performance' | 'festive' | 'retention' | 'adhoc'
  eligibilityPeriod: string
  workingDays: number
  totalDays: number
  basicSalary: number
  eligibleSalary: number
  bonusPercentage: number
  bonusAmount: number
  tax: number
  netBonus: number
  calculatedDate: string
  status: 'calculated' | 'approved' | 'on-hold' | 'processed' | 'paid'
  approvedBy?: string
  approvedDate?: string
  paymentDate?: string
  remarks?: string
  performanceRating?: 'outstanding' | 'excellent' | 'good' | 'average'
}

const mockBonusRecords: BonusProcessing[] = [
  {
    id: 'BON-2025-001',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    designation: 'Senior Production Manager',
    department: 'Production',
    bonusType: 'statutory',
    eligibilityPeriod: 'Apr 2024 - Mar 2025',
    workingDays: 365,
    totalDays: 365,
    basicSalary: 45000,
    eligibleSalary: 540000,
    bonusPercentage: 8.33,
    bonusAmount: 44982,
    tax: 4498,
    netBonus: 40484,
    calculatedDate: '2025-03-15',
    status: 'approved',
    approvedBy: 'HR Director',
    approvedDate: '2025-03-20',
    remarks: 'Statutory bonus - Payment of Bonus Act'
  },
  {
    id: 'BON-2025-002',
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    designation: 'Quality Control Manager',
    department: 'Quality Assurance',
    bonusType: 'performance',
    eligibilityPeriod: 'Q4 FY 2024-25',
    workingDays: 90,
    totalDays: 90,
    basicSalary: 42000,
    eligibleSalary: 126000,
    bonusPercentage: 15.0,
    bonusAmount: 18900,
    tax: 1890,
    netBonus: 17010,
    calculatedDate: '2025-03-25',
    status: 'paid',
    approvedBy: 'CEO',
    approvedDate: '2025-03-26',
    paymentDate: '2025-03-31',
    performanceRating: 'excellent',
    remarks: 'Q4 performance bonus - excellent rating'
  },
  {
    id: 'BON-2025-003',
    employeeId: 'EMP003',
    employeeName: 'Amit Patel',
    designation: 'Warehouse Supervisor',
    department: 'Logistics',
    bonusType: 'festive',
    eligibilityPeriod: 'Diwali 2025',
    workingDays: 180,
    totalDays: 180,
    basicSalary: 32000,
    eligibleSalary: 192000,
    bonusPercentage: 5.0,
    bonusAmount: 9600,
    tax: 960,
    netBonus: 8640,
    calculatedDate: '2025-10-15',
    status: 'calculated',
    remarks: 'Diwali bonus - 1 month basic pro-rated'
  },
  {
    id: 'BON-2025-004',
    employeeId: 'EMP004',
    employeeName: 'Sneha Reddy',
    designation: 'Production Supervisor',
    department: 'Production',
    bonusType: 'statutory',
    eligibilityPeriod: 'Apr 2024 - Mar 2025',
    workingDays: 300,
    totalDays: 365,
    basicSalary: 28000,
    eligibleSalary: 280000,
    bonusPercentage: 8.33,
    bonusAmount: 19258,
    tax: 1926,
    netBonus: 17332,
    calculatedDate: '2025-03-15',
    status: 'on-hold',
    remarks: 'On hold - Document verification pending'
  },
  {
    id: 'BON-2025-005',
    employeeId: 'EMP005',
    employeeName: 'Vikram Singh',
    designation: 'Maintenance Technician',
    department: 'Maintenance',
    bonusType: 'performance',
    eligibilityPeriod: 'Q4 FY 2024-25',
    workingDays: 90,
    totalDays: 90,
    basicSalary: 30000,
    eligibleSalary: 90000,
    bonusPercentage: 12.0,
    bonusAmount: 10800,
    tax: 1080,
    netBonus: 9720,
    calculatedDate: '2025-03-25',
    status: 'approved',
    approvedBy: 'Operations Head',
    approvedDate: '2025-03-27',
    performanceRating: 'good',
    remarks: 'Q4 performance bonus - good rating'
  },
  {
    id: 'BON-2025-006',
    employeeId: 'EMP006',
    employeeName: 'Anita Desai',
    designation: 'HR Executive',
    department: 'Human Resources',
    bonusType: 'retention',
    eligibilityPeriod: '3 Years Completion',
    workingDays: 1095,
    totalDays: 1095,
    basicSalary: 35000,
    eligibleSalary: 420000,
    bonusPercentage: 10.0,
    bonusAmount: 42000,
    tax: 4200,
    netBonus: 37800,
    calculatedDate: '2025-05-01',
    status: 'calculated',
    remarks: '3-year retention bonus - 1 month basic'
  },
  {
    id: 'BON-2025-007',
    employeeId: 'EMP007',
    employeeName: 'Rahul Verma',
    designation: 'Accounts Manager',
    department: 'Finance',
    bonusType: 'performance',
    eligibilityPeriod: 'Q4 FY 2024-25',
    workingDays: 90,
    totalDays: 90,
    basicSalary: 48000,
    eligibleSalary: 144000,
    bonusPercentage: 20.0,
    bonusAmount: 28800,
    tax: 2880,
    netBonus: 25920,
    calculatedDate: '2025-03-25',
    status: 'paid',
    approvedBy: 'CFO',
    approvedDate: '2025-03-26',
    paymentDate: '2025-03-31',
    performanceRating: 'outstanding',
    remarks: 'Q4 performance bonus - outstanding rating'
  },
  {
    id: 'BON-2025-008',
    employeeId: 'EMP008',
    employeeName: 'Meera Krishnan',
    designation: 'Purchase Executive',
    department: 'Purchase',
    bonusType: 'adhoc',
    eligibilityPeriod: 'Cost Saving Initiative',
    workingDays: 60,
    totalDays: 60,
    basicSalary: 32000,
    eligibleSalary: 64000,
    bonusPercentage: 15.0,
    bonusAmount: 9600,
    tax: 960,
    netBonus: 8640,
    calculatedDate: '2025-02-10',
    status: 'processed',
    approvedBy: 'COO',
    approvedDate: '2025-02-12',
    remarks: 'Ad-hoc bonus - Cost reduction achievement'
  }
]

export default function BonusProcessingPage() {
  const [bonusRecords, setBonusRecords] = useState<BonusProcessing[]>(mockBonusRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  const filteredRecords = useMemo(() => {
    return bonusRecords.filter(record => {
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.designation.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter
      const matchesType = typeFilter === 'all' || record.bonusType === typeFilter
      const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter

      return matchesSearch && matchesStatus && matchesType && matchesDepartment
    })
  }, [bonusRecords, searchTerm, statusFilter, typeFilter, departmentFilter])

  const stats = useMemo(() => {
    const total = bonusRecords.length
    const calculated = bonusRecords.filter(r => r.status === 'calculated').length
    const approved = bonusRecords.filter(r => r.status === 'approved').length
    const processed = bonusRecords.filter(r => r.status === 'processed').length
    const paid = bonusRecords.filter(r => r.status === 'paid').length
    const totalAmount = bonusRecords.reduce((sum, r) => sum + r.bonusAmount, 0)
    const totalTax = bonusRecords.reduce((sum, r) => sum + r.tax, 0)

    return { total, calculated, approved, processed, paid, totalAmount, totalTax }
  }, [bonusRecords])

  const departments = useMemo(() => {
    return Array.from(new Set(bonusRecords.map(r => r.department))).sort()
  }, [bonusRecords])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calculated': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800'
      case 'processed': return 'bg-purple-100 text-purple-800'
      case 'paid': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'statutory': return 'bg-blue-100 text-blue-800'
      case 'performance': return 'bg-green-100 text-green-800'
      case 'festive': return 'bg-orange-100 text-orange-800'
      case 'retention': return 'bg-purple-100 text-purple-800'
      case 'adhoc': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = (recordId: string) => {
    setBonusRecords(prev => prev.map(r =>
      r.id === recordId
        ? {
            ...r,
            status: 'approved',
            approvedBy: 'HR Manager',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : r
    ))
  }

  const handleProcess = (recordId: string) => {
    setBonusRecords(prev => prev.map(r =>
      r.id === recordId ? { ...r, status: 'processed' } : r
    ))
  }

  const handlePay = (recordId: string) => {
    setBonusRecords(prev => prev.map(r =>
      r.id === recordId
        ? {
            ...r,
            status: 'paid',
            paymentDate: new Date().toISOString().split('T')[0]
          }
        : r
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonus Processing</h1>
        <p className="text-gray-600">Calculate, approve, and process employee bonuses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Records</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Calculated</p>
              <p className="text-2xl font-bold text-purple-900">{stats.calculated}</p>
            </div>
            <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">Processed</p>
              <p className="text-2xl font-bold text-indigo-900">{stats.processed}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-900">{stats.paid}</p>
            </div>
            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-yellow-900">₹{(stats.totalAmount / 1000).toFixed(0)}K</p>
            </div>
            <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, ID, record number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="calculated">Calculated</option>
              <option value="approved">Approved</option>
              <option value="on-hold">On Hold</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="statutory">Statutory</option>
              <option value="performance">Performance</option>
              <option value="festive">Festive</option>
              <option value="retention">Retention</option>
              <option value="adhoc">Ad-hoc</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bonus Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.employeeName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.bonusType)}`}>
                      {record.bonusType.charAt(0).toUpperCase() + record.bonusType.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {record.employeeId}
                    </span>
                    <span>{record.designation}</span>
                    <span>{record.department}</span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {record.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {record.status === 'calculated' && (
                    <button
                      onClick={() => handleApprove(record.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                  )}
                  {record.status === 'approved' && (
                    <button
                      onClick={() => handleProcess(record.id)}
                      className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 text-sm"
                    >
                      <Clock className="h-4 w-4" />
                      Process
                    </button>
                  )}
                  {record.status === 'processed' && (
                    <button
                      onClick={() => handlePay(record.id)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <Send className="h-4 w-4" />
                      Mark Paid
                    </button>
                  )}
                  <button className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Eligibility Details */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-xs font-semibold text-blue-900 mb-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Eligibility
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-blue-600">Period</p>
                      <p className="text-sm font-semibold text-blue-900">{record.eligibilityPeriod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">Working Days</p>
                      <p className="text-sm font-semibold text-blue-900">
                        {record.workingDays} / {record.totalDays}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">Basic Salary</p>
                      <p className="text-sm font-semibold text-blue-900">
                        ₹{record.basicSalary.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calculation Details */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-3 flex items-center gap-1">
                    <Calculator className="h-3 w-3" />
                    Calculation
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-purple-600">Eligible Salary</p>
                      <p className="text-sm font-semibold text-purple-900">
                        ₹{record.eligibleSalary.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Bonus %</p>
                      <p className="text-sm font-semibold text-purple-900">{record.bonusPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Gross Bonus</p>
                      <p className="text-sm font-semibold text-purple-900">
                        ₹{record.bonusAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tax & Net Amount */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <h4 className="text-xs font-semibold text-green-900 mb-3 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Payment
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-green-600">Gross Amount</p>
                      <p className="text-sm font-semibold text-green-900">
                        ₹{record.bonusAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Tax (10%)</p>
                      <p className="text-sm font-semibold text-red-700">
                        -₹{record.tax.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Net Bonus</p>
                      <p className="text-sm font-semibold text-green-900">
                        ₹{record.netBonus.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approval Info */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-xs font-semibold text-yellow-900 mb-3 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approval
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-yellow-600">Calculated Date</p>
                      <p className="text-sm font-semibold text-yellow-900">
                        {new Date(record.calculatedDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-600">Approved By</p>
                      <p className="text-sm font-semibold text-yellow-900">
                        {record.approvedBy || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-600">Approved Date</p>
                      <p className="text-sm font-semibold text-yellow-900">
                        {record.approvedDate ? new Date(record.approvedDate).toLocaleDateString('en-IN') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                  <h4 className="text-xs font-semibold text-indigo-900 mb-3 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-indigo-600">Payment Date</p>
                      <p className="text-sm font-semibold text-indigo-900">
                        {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString('en-IN') : 'Pending'}
                      </p>
                    </div>
                    {record.performanceRating && (
                      <div>
                        <p className="text-xs text-indigo-600">Performance</p>
                        <p className="text-sm font-semibold text-indigo-900 capitalize">
                          {record.performanceRating}
                        </p>
                      </div>
                    )}
                    {record.remarks && (
                      <div>
                        <p className="text-xs text-indigo-600">Remarks</p>
                        <p className="text-sm font-semibold text-indigo-900">{record.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Guidelines */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Bonus Processing Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Statutory Bonus (Payment of Bonus Act)</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Minimum: 8.33% of annual wages (₹7,000 salary ceiling)</li>
              <li>Maximum: 20% of annual wages</li>
              <li>Eligibility: 30 working days in accounting year</li>
              <li>Payment: Within 8 months of year-end</li>
              <li>Proportionate for partial service</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Bonus</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Outstanding (90%+): 15-20% of quarterly basic</li>
              <li>Excellent (80-89%): 10-15% of quarterly basic</li>
              <li>Good (70-79%): 5-10% of quarterly basic</li>
              <li>Average (60-69%): 2-5% of quarterly basic</li>
              <li>Paid quarterly or annually based on KPIs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Festive Bonus</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Typically 1 month basic salary or fixed amount</li>
              <li>Paid during Diwali, Dussehra, or year-end</li>
              <li>Pro-rated based on service period</li>
              <li>Taxable as salary income</li>
              <li>May vary by company policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Processing Workflow</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Calculate bonus as per scheme rules</li>
              <li>Deduct applicable tax (10% TDS if &gt; ₹50,000)</li>
              <li>Obtain management approval</li>
              <li>Process payment via payroll or separate</li>
              <li>Maintain records for 3 years (statutory)</li>
              <li>Issue bonus slips to employees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
