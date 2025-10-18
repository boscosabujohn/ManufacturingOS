'use client'

import { useState } from 'react'
import {
  Search,
  FileDown,
  Eye,
  Edit,
  CheckCircle,
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  payPeriod: string
  basicSalary: number
  hra: number
  transportAllowance: number
  medicalAllowance: number
  taxDeduction: number
  pfDeduction: number
  insurance: number
  netSalary: number
  paymentMethod: string
  status: 'draft' | 'processed' | 'paid' | 'on_hold'
}

const mockPayrollData: PayrollRecord[] = [
  {
    id: 'PAY-2025-001',
    employeeId: 'EMP-001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    payPeriod: 'October 2025',
    basicSalary: 75000,
    hra: 30000,
    transportAllowance: 3200,
    medicalAllowance: 1250,
    taxDeduction: 16425,
    pfDeduction: 9000,
    insurance: 1500,
    netSalary: 82525,
    paymentMethod: 'Bank Transfer',
    status: 'paid'
  },
  {
    id: 'PAY-2025-002',
    employeeId: 'EMP-002',
    employeeName: 'Priya Sharma',
    department: 'Quality Control',
    payPeriod: 'October 2025',
    basicSalary: 65000,
    hra: 26000,
    transportAllowance: 2800,
    medicalAllowance: 1250,
    taxDeduction: 14265,
    pfDeduction: 7800,
    insurance: 1200,
    netSalary: 71785,
    paymentMethod: 'Bank Transfer',
    status: 'processed'
  },
  {
    id: 'PAY-2025-003',
    employeeId: 'EMP-003',
    employeeName: 'Amit Patel',
    department: 'Engineering',
    payPeriod: 'October 2025',
    basicSalary: 85000,
    hra: 34000,
    transportAllowance: 3200,
    medicalAllowance: 1250,
    taxDeduction: 24690,
    pfDeduction: 10200,
    insurance: 1500,
    netSalary: 87060,
    paymentMethod: 'Bank Transfer',
    status: 'draft'
  },
  {
    id: 'PAY-2025-004',
    employeeId: 'EMP-004',
    employeeName: 'Sneha Gupta',
    department: 'HR',
    payPeriod: 'Sep 2025',
    basicSalary: 55000,
    hra: 22000,
    transportAllowance: 2400,
    medicalAllowance: 1250,
    taxDeduction: 8067,
    pfDeduction: 6600,
    insurance: 1000,
    netSalary: 64983,
    paymentMethod: 'Bank Transfer',
    status: 'paid'
  },
  {
    id: 'PAY-2025-005',
    employeeId: 'EMP-005',
    employeeName: 'Vikram Singh',
    department: 'Maintenance',
    payPeriod: 'October 2025',
    basicSalary: 45000,
    hra: 18000,
    transportAllowance: 1600,
    medicalAllowance: 1250,
    taxDeduction: 6585,
    pfDeduction: 5400,
    insurance: 800,
    netSalary: 53065,
    paymentMethod: 'Check',
    status: 'on_hold'
  },
  {
    id: 'PAY-2025-006',
    employeeId: 'EMP-006',
    employeeName: 'Anjali Reddy',
    department: 'Finance',
    payPeriod: 'October 2025',
    basicSalary: 70000,
    hra: 28000,
    transportAllowance: 3000,
    medicalAllowance: 1250,
    taxDeduction: 15345,
    pfDeduction: 8400,
    insurance: 1200,
    netSalary: 77305,
    paymentMethod: 'Bank Transfer',
    status: 'draft'
  }
]

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPayroll = mockPayrollData.reduce((sum, record) => sum + record.netSalary, 0)
  const paidThisMonth = mockPayrollData
    .filter(r => r.status === 'paid' && r.payPeriod === 'October 2025')
    .reduce((sum, record) => sum + record.netSalary, 0)
  const pendingPayments = mockPayrollData
    .filter(r => r.status === 'draft' || r.status === 'processed')
    .reduce((sum, record) => sum + record.netSalary, 0)
  const avgSalary = totalPayroll / mockPayrollData.length

  const filteredData = mockPayrollData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'processed': return 'bg-blue-100 text-blue-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'on_hold': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleExport = () => {
    console.log('Exporting payroll report...')
  }

  const handleView = (id: string) => {
    console.log('Viewing payroll:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Editing payroll:', id)
  }

  const handleProcess = (id: string) => {
    console.log('Processing payroll:', id)
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Payroll</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">₹{totalPayroll.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{paidThisMonth.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">₹{pendingPayments.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Salary</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">₹{Math.round(avgSalary).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by employee name or payroll ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="processed">Processed</option>
                <option value="paid">Paid</option>
                <option value="on_hold">On Hold</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="Production">Production</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileDown className="h-5 w-5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payroll ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((record) => {
                const totalAllowances = record.hra + record.transportAllowance + record.medicalAllowance
                const totalDeductions = record.taxDeduction + record.pfDeduction + record.insurance

                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      <div className="text-sm text-gray-500">{record.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.payPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{record.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{totalAllowances.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        HRA + Transport + Medical
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{totalDeductions.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        Tax + PF + Insurance
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{record.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(record.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {record.status === 'draft' && (
                          <button
                            onClick={() => handleProcess(record.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Process"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{' '}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
