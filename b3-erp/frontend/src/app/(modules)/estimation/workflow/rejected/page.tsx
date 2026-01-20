'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  XCircle,
  Eye,
  RotateCcw,
  MessageSquare,
  ArrowLeft,
  Search,
  Filter,
  Download,
  User,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react'

interface RejectedEstimate {
  id: string
  estimateNumber: string
  projectName: string
  customerName: string
  category: string
  estimatedValue: number
  items: number
  submittedBy: string
  submittedDate: string
  rejectedBy: string
  rejectedDate: string
  rejectionReason: string
  rejectionCategory: 'pricing' | 'scope' | 'compliance' | 'margin' | 'other'
  canRevise: boolean
  revisedEstimate?: string
}

export default function EstimateWorkflowRejectedPage() {
  const router = useRouter()

  const [rejectedEstimates] = useState<RejectedEstimate[]>([
    {
      id: 'REJ-001',
      estimateNumber: 'EST-2025-0120',
      projectName: 'Luxury Villa Kitchen - Premium Setup',
      customerName: 'Elite Homes Pvt Ltd',
      category: 'Luxury Modular Kitchen',
      estimatedValue: 5500000,
      items: 48,
      submittedBy: 'Amit Sharma',
      submittedDate: '2025-10-05',
      rejectedBy: 'Mr. Rajesh Gupta',
      rejectedDate: '2025-10-08',
      rejectionReason: 'Profit margin below company threshold (28.5% vs 30% required). Need to optimize material costs or revise pricing.',
      rejectionCategory: 'margin',
      canRevise: true,
      revisedEstimate: 'EST-2025-0142'
    },
    {
      id: 'REJ-002',
      estimateNumber: 'EST-2025-0118',
      projectName: 'Commercial Kitchen - Fast Food Chain',
      customerName: 'Quick Bites Restaurants',
      category: 'Commercial Kitchen',
      estimatedValue: 8500000,
      items: 52,
      submittedBy: 'Neha Patel',
      submittedDate: '2025-10-03',
      rejectedBy: 'Mr. Anil Sharma',
      rejectedDate: '2025-10-06',
      rejectionReason: 'Pricing significantly below market rates. Risk of quality compromise. Competitor pricing analysis shows 15% underpricing.',
      rejectionCategory: 'pricing',
      canRevise: true
    },
    {
      id: 'REJ-003',
      estimateNumber: 'EST-2025-0122',
      projectName: 'Modular Kitchen - Builder Package',
      customerName: 'Rainbow Developers',
      category: 'Builder Package',
      estimatedValue: 18500000,
      items: 18,
      submittedBy: 'Vikram Singh',
      submittedDate: '2025-10-07',
      rejectedBy: 'Mr. Suresh Iyer',
      rejectedDate: '2025-10-09',
      rejectionReason: 'Scope mismatch - Missing installation and after-sales service terms. Bulk discount structure not aligned with company policy.',
      rejectionCategory: 'scope',
      canRevise: true,
      revisedEstimate: 'EST-2025-0151'
    },
    {
      id: 'REJ-004',
      estimateNumber: 'EST-2025-0115',
      projectName: 'Island Kitchen with Wine Storage',
      customerName: 'Mr. Arvind Malhotra',
      category: 'Island Kitchen',
      estimatedValue: 4250000,
      items: 42,
      submittedBy: 'Ravi Kumar',
      submittedDate: '2025-10-01',
      rejectedBy: 'Ms. Priya Kapoor',
      rejectedDate: '2025-10-03',
      rejectionReason: 'Wine cellar cooling system specifications do not meet compliance requirements. Need certified vendor approval.',
      rejectionCategory: 'compliance',
      canRevise: true
    },
    {
      id: 'REJ-005',
      estimateNumber: 'EST-2025-0119',
      projectName: 'Compact Kitchen for Studio Apartments',
      customerName: 'Ms. Kavita Desai',
      category: 'Compact Kitchen',
      estimatedValue: 650000,
      items: 16,
      submittedBy: 'Amit Sharma',
      submittedDate: '2025-10-04',
      rejectedBy: 'Mr. Suresh Iyer',
      rejectedDate: '2025-10-06',
      rejectionReason: 'Project value too low for current capacity. Minimum project value policy is ₹8L for individual residential projects.',
      rejectionCategory: 'other',
      canRevise: false
    },
    {
      id: 'REJ-006',
      estimateNumber: 'EST-2025-0121',
      projectName: 'Hotel Kitchen - Budget Property',
      customerName: 'Economy Hotels India',
      category: 'Institutional Kitchen',
      estimatedValue: 6800000,
      items: 38,
      submittedBy: 'Neha Patel',
      submittedDate: '2025-10-06',
      rejectedBy: 'Mr. Rajesh Gupta',
      rejectedDate: '2025-10-09',
      rejectionReason: 'Margin too thin (22%) for institutional project. Requires minimum 28% margin due to extended payment terms and warranty obligations.',
      rejectionCategory: 'margin',
      canRevise: true
    },
    {
      id: 'REJ-007',
      estimateNumber: 'EST-2025-0116',
      projectName: 'L-Shaped Kitchen - Contemporary Design',
      customerName: 'Dr. Ramesh Sharma',
      category: 'L-Shaped Kitchen',
      estimatedValue: 2850000,
      items: 32,
      submittedBy: 'Vikram Singh',
      submittedDate: '2025-10-02',
      rejectedBy: 'Ms. Priya Kapoor',
      rejectedDate: '2025-10-04',
      rejectionReason: 'Custom imported hardware pricing not verified with supplier. Final pricing may increase by 8-12%.',
      rejectionCategory: 'pricing',
      canRevise: true
    },
    {
      id: 'REJ-008',
      estimateNumber: 'EST-2025-0117',
      projectName: 'Parallel Kitchen with Utility Area',
      customerName: 'Mrs. Sunita Verma',
      category: 'Parallel Kitchen',
      estimatedValue: 1950000,
      items: 28,
      submittedBy: 'Ravi Kumar',
      submittedDate: '2025-10-02',
      rejectedBy: 'Mr. Suresh Iyer',
      rejectedDate: '2025-10-05',
      rejectionReason: 'Missing electrical and plumbing scope. Estimate incomplete without civil work coordination costs.',
      rejectionCategory: 'scope',
      canRevise: true
    }
  ])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'margin':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'pricing':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'scope':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'compliance':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'other':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalRejected = rejectedEstimates.length
  const totalValue = rejectedEstimates.reduce((sum, e) => sum + e.estimatedValue, 0)
  const canRevise = rejectedEstimates.filter(e => e.canRevise).length
  const alreadyRevised = rejectedEstimates.filter(e => e.revisedEstimate).length

  const rejectionStats = [
    { category: 'margin', count: rejectedEstimates.filter(e => e.rejectionCategory === 'margin').length },
    { category: 'pricing', count: rejectedEstimates.filter(e => e.rejectionCategory === 'pricing').length },
    { category: 'scope', count: rejectedEstimates.filter(e => e.rejectionCategory === 'scope').length },
    { category: 'compliance', count: rejectedEstimates.filter(e => e.rejectionCategory === 'compliance').length },
    { category: 'other', count: rejectedEstimates.filter(e => e.rejectionCategory === 'other').length }
  ]

  return (
    <div className="w-full h-full px-4 py-6">
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
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{totalRejected}</p>
              <p className="text-xs text-red-700 mt-1">This month</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Lost Value</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">₹{(totalValue / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-orange-700 mt-1">Rejected pipeline</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Can Revise</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{canRevise}</p>
              <p className="text-xs text-yellow-700 mt-1">Opportunity to fix</p>
            </div>
            <RotateCcw className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Already Revised</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{alreadyRevised}</p>
              <p className="text-xs text-green-700 mt-1">Re-submitted</p>
            </div>
            <RotateCcw className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Rejection Reasons Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rejection Reasons Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {rejectionStats.map((stat) => (
              <div key={stat.category} className="p-4 rounded-lg border border-gray-200 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(stat.category)}`}>
                  {stat.category.toUpperCase()}
                </span>
                <p className="text-3xl font-bold text-gray-900 mt-3">{stat.count}</p>
                <p className="text-xs text-gray-600 mt-1">estimates</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rejected Estimates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Rejected Estimates</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejection Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rejectedEstimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{estimate.estimateNumber}</p>
                      <p className="text-sm text-gray-900 mt-1">{estimate.projectName}</p>
                      <p className="text-xs text-gray-600 mt-1">{estimate.category} • {estimate.items} items</p>
                      {estimate.revisedEstimate && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <RotateCcw className="h-3 w-3" />
                          Revised: {estimate.revisedEstimate}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{estimate.customerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-600">₹{(estimate.estimatedValue / 100000).toFixed(2)}L</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>{estimate.rejectedDate}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">by {estimate.rejectedBy}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(estimate.rejectionCategory)}`}>
                      {estimate.rejectionCategory.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 line-clamp-2">{estimate.rejectionReason}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      {estimate.canRevise && !estimate.revisedEstimate && (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
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
