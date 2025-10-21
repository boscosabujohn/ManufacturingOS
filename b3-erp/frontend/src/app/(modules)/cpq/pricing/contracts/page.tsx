'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface ContractPricing {
  id: string
  contractName: string
  customerId: string
  customerName: string
  contractValue: number
  discount: number
  startDate: string
  endDate: string
  status: 'active' | 'expiring-soon' | 'expired'
  renewalDate: string
}

export default function CPQPricingContractsPage() {
  const router = useRouter()

  const [contracts] = useState<ContractPricing[]>([
    {
      id: 'CT-001',
      contractName: 'Annual Supply Agreement - Prestige',
      customerId: 'CUST-1234',
      customerName: 'Prestige Properties Ltd',
      contractValue: 25000000,
      discount: 18,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      renewalDate: '2024-11-01'
    },
    {
      id: 'CT-002',
      contractName: 'Multi-Year Framework - Urban Homes',
      customerId: 'CUST-2156',
      customerName: 'Urban Homes Pvt Ltd',
      contractValue: 18500000,
      discount: 15,
      startDate: '2023-06-01',
      endDate: '2025-05-31',
      status: 'active',
      renewalDate: '2025-03-01'
    },
    {
      id: 'CT-003',
      contractName: 'Premium Partnership - Elite Builders',
      customerId: 'CUST-3421',
      customerName: 'Elite Builders & Developers',
      contractValue: 32000000,
      discount: 20,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'active',
      renewalDate: '2024-12-01'
    },
    {
      id: 'CT-004',
      contractName: 'Volume Commitment - Skyline',
      customerId: 'CUST-4567',
      customerName: 'Skyline Constructions',
      contractValue: 12000000,
      discount: 12,
      startDate: '2024-07-01',
      endDate: '2024-11-30',
      status: 'expiring-soon',
      renewalDate: '2024-10-15'
    },
    {
      id: 'CT-005',
      contractName: 'Standard Agreement - Modern Living',
      customerId: 'CUST-5678',
      customerName: 'Modern Living Interiors',
      contractValue: 8500000,
      discount: 10,
      startDate: '2024-02-01',
      endDate: '2024-10-15',
      status: 'expiring-soon',
      renewalDate: '2024-09-01'
    },
    {
      id: 'CT-006',
      contractName: 'Quarterly Supply - Habitat',
      customerId: 'CUST-6789',
      customerName: 'Habitat Homes',
      contractValue: 5500000,
      discount: 8,
      startDate: '2024-01-01',
      endDate: '2024-09-30',
      status: 'expired',
      renewalDate: '2024-08-15'
    },
    {
      id: 'CT-007',
      contractName: 'Trial Period - Green Valley',
      customerId: 'CUST-7890',
      customerName: 'Green Valley Builders',
      contractValue: 3000000,
      discount: 5,
      startDate: '2024-04-01',
      endDate: '2024-09-30',
      status: 'expired',
      renewalDate: '2024-08-01'
    }
  ])

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-700 border-green-200',
      'expiring-soon': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      expired: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || colors.active
  }

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle className="h-4 w-4" />
    if (status === 'expiring-soon') return <Clock className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  const totalContractValue = contracts.reduce((sum, c) => sum + c.contractValue, 0)
  const activeContracts = contracts.filter(c => c.status === 'active').length
  const expiringSoon = contracts.filter(c => c.status === 'expiring-soon').length

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Contracts</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{contracts.length}</p>
              <p className="text-xs text-blue-700 mt-1">Pricing agreements</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Contracts</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeContracts}</p>
              <p className="text-xs text-green-700 mt-1">Currently in force</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{expiringSoon}</p>
              <p className="text-xs text-yellow-700 mt-1">Action needed</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                ₹{(totalContractValue / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-xs text-purple-700 mt-1">Contract commitments</p>
            </div>
            <FileText className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium">
          All Contracts ({contracts.length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Active ({activeContracts})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Expiring Soon ({expiringSoon})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Expired ({contracts.filter(c => c.status === 'expired').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Renewal</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{contract.contractName}</div>
                    <div className="text-xs text-gray-500">{contract.id}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{contract.customerName}</div>
                    <div className="text-xs text-gray-500">{contract.customerId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{(contract.contractValue / 10000000).toFixed(2)}Cr
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-green-700">{contract.discount}%</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-700">
                      {new Date(contract.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">to</div>
                    <div className="text-xs text-gray-700">
                      {new Date(contract.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {new Date(contract.renewalDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Contract Pricing Features:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Pre-Negotiated Terms:</strong> Fixed pricing and discounts for contract duration</li>
          <li><strong>Volume Commitments:</strong> Guaranteed pricing based on committed purchase volumes</li>
          <li><strong>Renewal Management:</strong> Automated alerts for upcoming renewals and renegotiations</li>
          <li><strong>Compliance Tracking:</strong> Monitor adherence to contract terms and pricing limits</li>
        </ul>
      </div>
    </div>
  )
}
