'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, User, DollarSign, Package, Clock } from 'lucide-react'

interface RateHistory {
  id: string
  rate: number
  effectiveFrom: string
  effectiveTo: string | null
  supplier: string
  leadTime: number
  minimumOrderQty: number
  changePercentage: number | null
  updatedBy: string
  updatedAt: string
  notes: string
}

export default function MaterialRateHistoryPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params?.id as string

  // Mock data - would come from API
  const materialInfo = {
    materialCode: 'SS304-18G',
    materialName: 'Stainless Steel 304 - 18 Gauge Sheet',
    category: 'Raw Material - Sinks',
    unit: 'KG',
    currentRate: 285.00,
    status: 'active'
  }

  const [history] = useState<RateHistory[]>([
    {
      id: 'HIST-001',
      rate: 285.00,
      effectiveFrom: '2025-10-15',
      effectiveTo: null,
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: 5.56,
      updatedBy: 'Rajesh Kumar',
      updatedAt: '2025-10-15 09:30',
      notes: 'Increased due to raw material cost hike'
    },
    {
      id: 'HIST-002',
      rate: 270.00,
      effectiveFrom: '2025-09-01',
      effectiveTo: '2025-10-14',
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: -3.57,
      updatedBy: 'Amit Sharma',
      updatedAt: '2025-09-01 14:20',
      notes: 'Negotiated better rate with supplier'
    },
    {
      id: 'HIST-003',
      rate: 280.00,
      effectiveFrom: '2025-07-01',
      effectiveTo: '2025-08-31',
      supplier: 'Metal Works Pvt Ltd',
      leadTime: 10,
      minimumOrderQty: 1000,
      changePercentage: 7.69,
      updatedBy: 'Neha Patel',
      updatedAt: '2025-07-01 11:15',
      notes: 'Switched to new supplier, higher MOQ but better quality'
    },
    {
      id: 'HIST-004',
      rate: 260.00,
      effectiveFrom: '2025-04-01',
      effectiveTo: '2025-06-30',
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: 0,
      updatedBy: 'Vikram Singh',
      updatedAt: '2025-04-01 10:00',
      notes: 'Rate remained stable this quarter'
    },
    {
      id: 'HIST-005',
      rate: 260.00,
      effectiveFrom: '2025-01-15',
      effectiveTo: '2025-03-31',
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: 4.00,
      updatedBy: 'Rajesh Kumar',
      updatedAt: '2025-01-15 15:45',
      notes: 'Annual rate revision'
    },
    {
      id: 'HIST-006',
      rate: 250.00,
      effectiveFrom: '2024-10-01',
      effectiveTo: '2025-01-14',
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: -3.85,
      updatedBy: 'Amit Sharma',
      updatedAt: '2024-10-01 09:00',
      notes: 'Market correction, prices decreased'
    },
    {
      id: 'HIST-007',
      rate: 260.00,
      effectiveFrom: '2024-07-01',
      effectiveTo: '2024-09-30',
      supplier: 'Steel India Ltd',
      leadTime: 7,
      minimumOrderQty: 500,
      changePercentage: null,
      updatedBy: 'Neha Patel',
      updatedAt: '2024-07-01 10:30',
      notes: 'Initial rate setup'
    }
  ])

  const handleBack = () => {
    router.push('/estimation/rates/materials')
  }

  const getTrendIcon = (percentage: number | null) => {
    if (percentage === null) return null
    if (percentage > 0) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (percentage < 0) return <TrendingDown className="w-4 h-4 text-green-500" />
    return <div className="w-4 h-4" />
  }

  const getTrendColor = (percentage: number | null) => {
    if (percentage === null) return 'text-gray-600'
    if (percentage > 0) return 'text-red-600'
    if (percentage < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getTrendBgColor = (percentage: number | null) => {
    if (percentage === null) return 'bg-gray-50'
    if (percentage > 0) return 'bg-red-50'
    if (percentage < 0) return 'bg-green-50'
    return 'bg-gray-50'
  }

  // Calculate statistics
  const avgRate = history.reduce((sum, h) => sum + h.rate, 0) / history.length
  const maxRate = Math.max(...history.map(h => h.rate))
  const minRate = Math.min(...history.map(h => h.rate))
  const totalChanges = history.length

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="flex-none bg-white border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rate History</h1>
              <p className="text-sm text-gray-500 mt-1">{materialInfo.materialCode} - {materialInfo.materialName}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            materialInfo.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {materialInfo.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-3">
          {/* Material Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Material Information
            </h2>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Material Code</p>
                <p className="text-base font-semibold text-gray-900">{materialInfo.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="text-base font-medium text-gray-900">{materialInfo.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Unit</p>
                <p className="text-base font-medium text-gray-900">{materialInfo.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Rate</p>
                <p className="text-base font-bold text-blue-600">₹{materialInfo.currentRate.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Current Rate</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">₹{materialInfo.currentRate.toFixed(2)}</p>
                  <p className="text-xs text-blue-700 mt-1">per {materialInfo.unit}</p>
                </div>
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Average Rate</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">₹{avgRate.toFixed(2)}</p>
                  <p className="text-xs text-green-700 mt-1">Historical avg</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Rate Range</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">₹{minRate} - ₹{maxRate}</p>
                  <p className="text-xs text-orange-700 mt-1">Min - Max</p>
                </div>
                <TrendingDown className="h-10 w-10 text-orange-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Changes</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{totalChanges}</p>
                  <p className="text-xs text-purple-700 mt-1">Rate revisions</p>
                </div>
                <Clock className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Rate History Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Rate Change History
            </h2>

            <div className="space-y-2">
              {history.map((record, index) => (
                <div
                  key={record.id}
                  className={`border rounded-lg p-5 ${
                    index === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTrendBgColor(record.changePercentage)}`}>
                        {getTrendIcon(record.changePercentage) || <DollarSign className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-bold text-gray-900">₹{record.rate.toFixed(2)}</p>
                          {record.changePercentage !== null && (
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${getTrendColor(record.changePercentage)}`}>
                              {record.changePercentage > 0 ? '+' : ''}{record.changePercentage.toFixed(2)}%
                            </span>
                          )}
                          {index === 0 && (
                            <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">per {materialInfo.unit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Effective From
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.effectiveFrom).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Effective To
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {record.effectiveTo
                          ? new Date(record.effectiveTo).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'Present'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Supplier</p>
                      <p className="text-sm font-medium text-gray-900">{record.supplier}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lead Time</p>
                      <p className="text-sm font-medium text-gray-900">{record.leadTime} days</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Minimum Order Quantity</p>
                      <p className="text-sm font-medium text-gray-900">{record.minimumOrderQty} {materialInfo.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Updated By
                      </p>
                      <p className="text-sm font-medium text-gray-900">{record.updatedBy}</p>
                      <p className="text-xs text-gray-500">{record.updatedAt}</p>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
