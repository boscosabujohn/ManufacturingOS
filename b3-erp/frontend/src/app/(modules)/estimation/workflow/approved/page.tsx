'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle,
  Eye,
  FileText,
  Send,
  Download,
  ArrowLeft,
  Search,
  Filter,
  User,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react'

interface ApprovedEstimate {
  id: string
  estimateNumber: string
  projectName: string
  customerName: string
  contactPerson: string
  category: string
  estimatedValue: number
  items: number
  submittedBy: string
  submittedDate: string
  approvedBy: string
  approvedDate: string
  approvalTime: string
  validUntil: string
  daysToExpiry: number
  status: 'sent-to-customer' | 'awaiting-response' | 'under-negotiation' | 'valid'
  responseReceived: boolean
}

export default function EstimateWorkflowApprovedPage() {
  const router = useRouter()

  const [approvedEstimates] = useState<ApprovedEstimate[]>([
    {
      id: 'APP-001',
      estimateNumber: 'EST-2025-0132',
      projectName: 'Premium Villa - Complete Kitchen Package',
      customerName: 'Prestige Estates Pvt Ltd',
      contactPerson: 'Mr. Ramesh Kumar',
      category: 'Luxury Modular Kitchen',
      estimatedValue: 6500000,
      items: 52,
      submittedBy: 'Amit Sharma',
      submittedDate: '2025-10-10',
      approvedBy: 'Mr. Suresh Iyer',
      approvedDate: '2025-10-12',
      approvalTime: '15:30',
      validUntil: '2025-11-12',
      daysToExpiry: 23,
      status: 'sent-to-customer',
      responseReceived: false
    },
    {
      id: 'APP-002',
      estimateNumber: 'EST-2025-0133',
      projectName: 'Multi-Cuisine Restaurant Kitchen',
      customerName: 'Foodventures Hospitality',
      contactPerson: 'Ms. Priya Menon',
      category: 'Commercial Kitchen',
      estimatedValue: 9800000,
      items: 68,
      submittedBy: 'Neha Patel',
      submittedDate: '2025-10-11',
      approvedBy: 'Mr. Rajesh Gupta',
      approvedDate: '2025-10-13',
      approvalTime: '11:20',
      validUntil: '2025-11-13',
      daysToExpiry: 24,
      status: 'under-negotiation',
      responseReceived: true
    },
    {
      id: 'APP-003',
      estimateNumber: 'EST-2025-0134',
      projectName: 'L-Shaped Kitchen with Island',
      customerName: 'Mrs. Anjali Reddy',
      contactPerson: 'Mrs. Anjali Reddy',
      category: 'Island Kitchen',
      estimatedValue: 4250000,
      items: 45,
      submittedBy: 'Vikram Singh',
      submittedDate: '2025-10-12',
      approvedBy: 'Ms. Priya Kapoor',
      approvedDate: '2025-10-14',
      approvalTime: '10:15',
      validUntil: '2025-11-14',
      daysToExpiry: 25,
      status: 'sent-to-customer',
      responseReceived: false
    },
    {
      id: 'APP-004',
      estimateNumber: 'EST-2025-0128',
      projectName: 'Builder Package - 75 Units',
      customerName: 'Lodha Developers Ltd',
      contactPerson: 'Mr. Karthik Iyer',
      category: 'Builder Package',
      estimatedValue: 22500000,
      items: 22,
      submittedBy: 'Ravi Kumar',
      submittedDate: '2025-10-08',
      approvedBy: 'Mr. Anil Sharma (CEO)',
      approvedDate: '2025-10-10',
      approvalTime: '14:00',
      validUntil: '2025-11-10',
      daysToExpiry: 21,
      status: 'awaiting-response',
      responseReceived: false
    },
    {
      id: 'APP-005',
      estimateNumber: 'EST-2025-0135',
      projectName: 'Contemporary Parallel Kitchen',
      customerName: 'Dr. Vikram Patel',
      contactPerson: 'Dr. Vikram Patel',
      category: 'Parallel Kitchen',
      estimatedValue: 2850000,
      items: 36,
      submittedBy: 'Amit Sharma',
      submittedDate: '2025-10-13',
      approvedBy: 'Mr. Suresh Iyer',
      approvedDate: '2025-10-15',
      approvalTime: '09:45',
      validUntil: '2025-11-15',
      daysToExpiry: 26,
      status: 'sent-to-customer',
      responseReceived: false
    },
    {
      id: 'APP-006',
      estimateNumber: 'EST-2025-0136',
      projectName: 'Hotel Suite Kitchenettes - 50 Units',
      customerName: 'Marriott International',
      contactPerson: 'Mr. Aditya Sharma',
      category: 'Institutional Kitchen',
      estimatedValue: 8500000,
      items: 15,
      submittedBy: 'Neha Patel',
      submittedDate: '2025-10-14',
      approvedBy: 'Mr. Rajesh Gupta',
      approvedDate: '2025-10-16',
      approvalTime: '16:30',
      validUntil: '2025-11-16',
      daysToExpiry: 27,
      status: 'awaiting-response',
      responseReceived: false
    },
    {
      id: 'APP-007',
      estimateNumber: 'EST-2025-0131',
      projectName: 'Compact Kitchen with Smart Storage',
      customerName: 'Ms. Neha Kapoor',
      contactPerson: 'Ms. Neha Kapoor',
      category: 'Compact Kitchen',
      estimatedValue: 950000,
      items: 24,
      submittedBy: 'Vikram Singh',
      submittedDate: '2025-10-09',
      approvedBy: 'Ms. Priya Kapoor',
      approvedDate: '2025-10-11',
      approvalTime: '13:15',
      validUntil: '2025-11-11',
      daysToExpiry: 22,
      status: 'sent-to-customer',
      responseReceived: false
    },
    {
      id: 'APP-008',
      estimateNumber: 'EST-2025-0129',
      projectName: 'U-Shaped Kitchen with Breakfast Bar',
      customerName: 'Mr. Sunil Desai',
      contactPerson: 'Mr. Sunil Desai',
      category: 'U-Shaped Kitchen',
      estimatedValue: 3650000,
      items: 42,
      submittedBy: 'Ravi Kumar',
      submittedDate: '2025-10-08',
      approvedBy: 'Mr. Suresh Iyer',
      approvedDate: '2025-10-10',
      approvalTime: '11:00',
      validUntil: '2025-11-10',
      daysToExpiry: 21,
      status: 'under-negotiation',
      responseReceived: true
    },
    {
      id: 'APP-009',
      estimateNumber: 'EST-2025-0130',
      projectName: 'Open Kitchen with Dining Integration',
      customerName: 'Mrs. Kavita Joshi',
      contactPerson: 'Mrs. Kavita Joshi',
      category: 'Open Kitchen',
      estimatedValue: 4950000,
      items: 48,
      submittedBy: 'Amit Sharma',
      submittedDate: '2025-10-09',
      approvedBy: 'Mr. Suresh Iyer',
      approvedDate: '2025-10-11',
      approvalTime: '15:45',
      validUntil: '2025-11-11',
      daysToExpiry: 22,
      status: 'awaiting-response',
      responseReceived: false
    },
    {
      id: 'APP-010',
      estimateNumber: 'EST-2025-0127',
      projectName: 'Corporate Cafeteria Kitchen',
      customerName: 'Infosys Technologies Ltd',
      contactPerson: 'Mr. Harish Rao',
      category: 'Institutional Kitchen',
      estimatedValue: 12500000,
      items: 58,
      submittedBy: 'Neha Patel',
      submittedDate: '2025-10-07',
      approvedBy: 'Mr. Rajesh Gupta',
      approvedDate: '2025-10-09',
      approvalTime: '10:30',
      validUntil: '2025-11-09',
      daysToExpiry: 20,
      status: 'sent-to-customer',
      responseReceived: false
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent-to-customer':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'awaiting-response':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'under-negotiation':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'valid':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getExpiryColor = (days: number) => {
    if (days <= 7) return 'text-red-600'
    if (days <= 15) return 'text-orange-600'
    return 'text-green-600'
  }

  const totalApproved = approvedEstimates.length
  const totalValue = approvedEstimates.reduce((sum, e) => sum + e.estimatedValue, 0)
  const sentToCustomer = approvedEstimates.filter(e => e.status === 'sent-to-customer').length
  const underNegotiation = approvedEstimates.filter(e => e.status === 'under-negotiation').length

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalApproved}</p>
              <p className="text-xs text-green-700 mt-1">Active estimates</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{(totalValue / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-blue-700 mt-1">Approved pipeline</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Sent to Customer</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{sentToCustomer}</p>
              <p className="text-xs text-purple-700 mt-1">Awaiting response</p>
            </div>
            <Send className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Under Negotiation</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{underNegotiation}</p>
              <p className="text-xs text-orange-700 mt-1">In discussion</p>
            </div>
            <ArrowRight className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Approved Estimates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Approved Estimates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search estimates..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedEstimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{estimate.estimateNumber}</p>
                      <p className="text-sm text-gray-900 mt-1">{estimate.projectName}</p>
                      <p className="text-xs text-gray-600 mt-1">{estimate.category} • {estimate.items} items</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{estimate.customerName}</p>
                      <p className="text-xs text-gray-600 mt-1">{estimate.contactPerson}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-green-600">₹{(estimate.estimatedValue / 100000).toFixed(2)}L</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{estimate.approvedDate}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{estimate.approvalTime}</p>
                    <p className="text-xs text-gray-600">by {estimate.approvedBy}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className={`h-4 w-4 ${getExpiryColor(estimate.daysToExpiry)}`} />
                      <span className={`text-sm font-medium ${getExpiryColor(estimate.daysToExpiry)}`}>
                        {estimate.validUntil}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${getExpiryColor(estimate.daysToExpiry)}`}>
                      {estimate.daysToExpiry} days remaining
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(estimate.status)}`}>
                      {estimate.status.toUpperCase().replace('-', ' ')}
                    </span>
                    {estimate.responseReceived && (
                      <p className="text-xs text-green-600 mt-1">✓ Response received</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
