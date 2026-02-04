'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Eye,
  FileText,
  TrendingUp,
  ExternalLink,
  ArrowLeft,
  Search,
  Filter,
  Download,
  User,
  DollarSign,
  Calendar,
  Award
} from 'lucide-react'

interface ConvertedEstimate {
  id: string
  estimateNumber: string
  orderNumber: string
  projectName: string
  customerName: string
  contactPerson: string
  category: string
  estimatedValue: number
  finalOrderValue: number
  variance: number
  variancePercent: number
  items: number
  createdBy: string
  estimateDate: string
  approvedDate: string
  convertedDate: string
  conversionTime: number
  paymentTerms: string
  deliveryTimeline: string
  status: 'order-confirmed' | 'in-production' | 'partial-delivered' | 'completed'
}

export default function EstimateWorkflowConvertedPage() {
  const router = useRouter()

  const [convertedEstimates] = useState<ConvertedEstimate[]>([
    {
      id: 'CONV-001',
      estimateNumber: 'EST-2025-0105',
      orderNumber: 'SO-2025-0824',
      projectName: 'Luxury Penthouse - Ultra Premium Kitchen',
      customerName: 'DLF Luxury Homes',
      contactPerson: 'Mr. Arun Mehta',
      category: 'Premium Modular Kitchen',
      estimatedValue: 7500000,
      finalOrderValue: 7850000,
      variance: 350000,
      variancePercent: 4.7,
      items: 58,
      createdBy: 'Amit Sharma',
      estimateDate: '2025-09-28',
      approvedDate: '2025-10-01',
      convertedDate: '2025-10-15',
      conversionTime: 17,
      paymentTerms: '30% Advance, 40% on delivery, 30% after installation',
      deliveryTimeline: '45 days',
      status: 'in-production'
    },
    {
      id: 'CONV-002',
      estimateNumber: 'EST-2025-0108',
      orderNumber: 'SO-2025-0831',
      projectName: 'Fine Dining Restaurant - Complete Kitchen',
      customerName: 'Gourmet Restaurants Pvt Ltd',
      contactPerson: 'Chef Vikram Singh',
      category: 'Commercial Kitchen',
      estimatedValue: 12500000,
      finalOrderValue: 12200000,
      variance: -300000,
      variancePercent: -2.4,
      items: 72,
      createdBy: 'Neha Patel',
      estimateDate: '2025-09-30',
      approvedDate: '2025-10-03',
      convertedDate: '2025-10-17',
      conversionTime: 17,
      paymentTerms: '40% Advance, 40% on delivery, 20% post-installation',
      deliveryTimeline: '60 days',
      status: 'order-confirmed'
    },
    {
      id: 'CONV-003',
      estimateNumber: 'EST-2025-0110',
      orderNumber: 'SO-2025-0837',
      projectName: 'Island Kitchen with Breakfast Counter',
      customerName: 'Mrs. Priya Desai',
      contactPerson: 'Mrs. Priya Desai',
      category: 'Island Kitchen',
      estimatedValue: 4850000,
      finalOrderValue: 4850000,
      variance: 0,
      variancePercent: 0,
      items: 46,
      createdBy: 'Vikram Singh',
      estimateDate: '2025-10-02',
      approvedDate: '2025-10-05',
      convertedDate: '2025-10-18',
      conversionTime: 16,
      paymentTerms: 'Net 30',
      deliveryTimeline: '40 days',
      status: 'in-production'
    },
    {
      id: 'CONV-004',
      estimateNumber: 'EST-2025-0095',
      orderNumber: 'SO-2025-0802',
      projectName: 'Builder Package - 60 Standard Kitchens',
      customerName: 'Godrej Properties',
      contactPerson: 'Mr. Rajesh Agarwal',
      category: 'Builder Package',
      estimatedValue: 18000000,
      finalOrderValue: 19500000,
      variance: 1500000,
      variancePercent: 8.3,
      items: 20,
      createdBy: 'Ravi Kumar',
      estimateDate: '2025-09-20',
      approvedDate: '2025-09-25',
      convertedDate: '2025-10-08',
      conversionTime: 18,
      paymentTerms: '25% Advance, 50% on delivery, 25% post-installation',
      deliveryTimeline: '90 days (phased)',
      status: 'partial-delivered'
    },
    {
      id: 'CONV-005',
      estimateNumber: 'EST-2025-0112',
      orderNumber: 'SO-2025-0842',
      projectName: 'L-Shaped Kitchen - Contemporary Design',
      customerName: 'Dr. Suresh Krishnan',
      contactPerson: 'Dr. Suresh Krishnan',
      category: 'L-Shaped Kitchen',
      estimatedValue: 3250000,
      finalOrderValue: 3400000,
      variance: 150000,
      variancePercent: 4.6,
      items: 38,
      createdBy: 'Amit Sharma',
      estimateDate: '2025-10-04',
      approvedDate: '2025-10-07',
      convertedDate: '2025-10-19',
      conversionTime: 15,
      paymentTerms: '40% Advance, 60% on completion',
      deliveryTimeline: '35 days',
      status: 'order-confirmed'
    },
    {
      id: 'CONV-006',
      estimateNumber: 'EST-2025-0100',
      orderNumber: 'SO-2025-0815',
      projectName: 'Corporate Cafeteria Kitchen',
      customerName: 'TCS Limited',
      contactPerson: 'Ms. Anjali Nair',
      category: 'Institutional Kitchen',
      estimatedValue: 9800000,
      finalOrderValue: 9600000,
      variance: -200000,
      variancePercent: -2.0,
      items: 52,
      createdBy: 'Neha Patel',
      estimateDate: '2025-09-25',
      approvedDate: '2025-09-28',
      convertedDate: '2025-10-12',
      conversionTime: 17,
      paymentTerms: 'Net 45',
      deliveryTimeline: '55 days',
      status: 'completed'
    },
    {
      id: 'CONV-007',
      estimateNumber: 'EST-2025-0106',
      orderNumber: 'SO-2025-0826',
      projectName: 'Parallel Kitchen with Utility',
      customerName: 'Mr. Karan Malhotra',
      contactPerson: 'Mr. Karan Malhotra',
      category: 'Parallel Kitchen',
      estimatedValue: 2650000,
      finalOrderValue: 2750000,
      variance: 100000,
      variancePercent: 3.8,
      items: 32,
      createdBy: 'Vikram Singh',
      estimateDate: '2025-09-28',
      approvedDate: '2025-10-02',
      convertedDate: '2025-10-16',
      conversionTime: 18,
      paymentTerms: '50% Advance, 50% on delivery',
      deliveryTimeline: '30 days',
      status: 'in-production'
    },
    {
      id: 'CONV-008',
      estimateNumber: 'EST-2025-0114',
      orderNumber: 'SO-2025-0845',
      projectName: 'U-Shaped Kitchen with Breakfast Bar',
      customerName: 'Mrs. Meera Reddy',
      contactPerson: 'Mrs. Meera Reddy',
      category: 'U-Shaped Kitchen',
      estimatedValue: 3850000,
      finalOrderValue: 3850000,
      variance: 0,
      variancePercent: 0,
      items: 42,
      createdBy: 'Ravi Kumar',
      estimateDate: '2025-10-06',
      approvedDate: '2025-10-09',
      convertedDate: '2025-10-20',
      conversionTime: 14,
      paymentTerms: '30% Advance, 40% on delivery, 30% post-installation',
      deliveryTimeline: '42 days',
      status: 'order-confirmed'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'order-confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'in-production':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'partial-delivered':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const totalConverted = convertedEstimates.length
  const totalEstimatedValue = convertedEstimates.reduce((sum, e) => sum + e.estimatedValue, 0)
  const totalOrderValue = convertedEstimates.reduce((sum, e) => sum + e.finalOrderValue, 0)
  const avgConversionTime = convertedEstimates.reduce((sum, e) => sum + e.conversionTime, 0) / totalConverted
  const conversionRate = ((totalOrderValue - totalEstimatedValue) / totalEstimatedValue) * 100

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Action Buttons */}
      <div className="mb-3 flex justify-end">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Converted Orders</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalConverted}</p>
              <p className="text-xs text-green-700 mt-1">This month</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Order Value</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{(totalOrderValue / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-blue-700 mt-1">Total revenue</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Value Uplift</p>
              <p className={`text-2xl font-bold mt-1 ${getVarianceColor(conversionRate)}`}>
                {conversionRate > 0 ? '+' : ''}{conversionRate.toFixed(1)}%
              </p>
              <p className="text-xs text-purple-700 mt-1">vs estimates</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Conversion Time</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{avgConversionTime.toFixed(0)}</p>
              <p className="text-xs text-orange-700 mt-1">days</p>
            </div>
            <Calendar className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Converted Estimates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Converted Estimates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estimate → Order</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estimate Value</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Value</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {convertedEstimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-blue-600 text-sm">{estimate.estimateNumber}</p>
                        <span className="text-gray-400">→</span>
                        <p className="font-medium text-green-600 text-sm">{estimate.orderNumber}</p>
                      </div>
                      <p className="text-sm text-gray-900 mt-1">{estimate.projectName}</p>
                      <p className="text-xs text-gray-600 mt-1">{estimate.category} • {estimate.items} items</p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{estimate.customerName}</p>
                      <p className="text-xs text-gray-600 mt-1">{estimate.contactPerson}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-600">₹{(estimate.estimatedValue / 100000).toFixed(2)}L</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm font-bold text-green-600">₹{(estimate.finalOrderValue / 100000).toFixed(2)}L</p>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <p className={`text-sm font-semibold ${getVarianceColor(estimate.variance)}`}>
                        {estimate.variance > 0 ? '+' : ''}₹{(Math.abs(estimate.variance) / 1000).toFixed(0)}K
                      </p>
                      <p className={`text-xs ${getVarianceColor(estimate.variance)}`}>
                        {estimate.variancePercent > 0 ? '+' : ''}{estimate.variancePercent.toFixed(1)}%
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{estimate.conversionTime} days</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{estimate.convertedDate}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(estimate.status)}`}>
                      {estimate.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4" />
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
