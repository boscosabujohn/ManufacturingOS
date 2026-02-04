'use client'

import { useState } from 'react'
import { Factory, TrendingUp, DollarSign, Package, Users, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface ProductionSync {
  id: string
  batchNumber: string
  productName: string
  quantityProduced: number
  productionDate: string
  materialCost: number
  laborCost: number
  overheadCost: number
  totalCost: number
  unitCost: number
  syncStatus: 'synced' | 'pending' | 'failed'
  journalEntry: string
  lastSyncTime: string
}

export default function ProductionIntegrationPage() {
  const [syncData] = useState<ProductionSync[]>([
    { id: '1', batchNumber: 'BATCH-2025-001', productName: 'Widget A', quantityProduced: 1000, productionDate: '2025-10-15', materialCost: 450000, laborCost: 150000, overheadCost: 100000, totalCost: 700000, unitCost: 700, syncStatus: 'synced', journalEntry: 'JE-2025-543', lastSyncTime: '2025-10-15 18:30:00' },
    { id: '2', batchNumber: 'BATCH-2025-002', productName: 'Widget B', quantityProduced: 500, productionDate: '2025-10-16', materialCost: 250000, laborCost: 80000, overheadCost: 50000, totalCost: 380000, unitCost: 760, syncStatus: 'synced', journalEntry: 'JE-2025-544', lastSyncTime: '2025-10-16 19:15:00' },
    { id: '3', batchNumber: 'BATCH-2025-003', productName: 'Widget C', quantityProduced: 2000, productionDate: '2025-10-17', materialCost: 800000, laborCost: 200000, overheadCost: 150000, totalCost: 1150000, unitCost: 575, syncStatus: 'pending', journalEntry: '-', lastSyncTime: '-' },
    { id: '4', batchNumber: 'BATCH-2025-004', productName: 'Widget D', quantityProduced: 750, productionDate: '2025-10-18', materialCost: 350000, laborCost: 100000, overheadCost: 75000, totalCost: 525000, unitCost: 700, syncStatus: 'failed', journalEntry: '-', lastSyncTime: '2025-10-18 10:45:00' }
  ])

  const [integrationStats] = useState({
    totalBatchesToday: 12,
    syncedBatches: 9,
    pendingBatches: 2,
    failedBatches: 1,
    totalProductionValue: 4500000,
    lastSyncTime: '2025-10-18 14:30:00'
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-3 py-2">
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Production Integration</h1>
            <p className="text-gray-600 mt-1">Finance-Production module synchronization</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700">
            <RefreshCw className="h-5 w-5" />
            Sync Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Factory className="h-6 w-6 text-indigo-600" />
              <span className="text-sm text-gray-600">Total Batches</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{integrationStats.totalBatchesToday}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Synced</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{integrationStats.syncedBatches}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{integrationStats.pendingBatches}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <span className="text-sm text-gray-600">Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{integrationStats.failedBatches}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">Production Value</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(integrationStats.totalProductionValue)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Production Batch Synchronization</h2>
            <p className="text-sm text-gray-600 mt-1">Last sync: {integrationStats.lastSyncTime}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Batch Number</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Material Cost</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Labor Cost</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Overhead</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Total Cost</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Unit Cost</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Journal Entry</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncData.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span className="font-mono text-sm text-gray-900">{batch.batchNumber}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-900">{batch.productName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{batch.quantityProduced.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(batch.materialCost)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(batch.laborCost)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(batch.overheadCost)}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-gray-900">{formatCurrency(batch.totalCost)}</td>
                    <td className="px-3 py-2 text-sm text-blue-600 font-medium">{formatCurrency(batch.unitCost)}</td>
                    <td className="px-3 py-2">
                      <span className="text-sm font-mono text-gray-900">{batch.journalEntry}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${batch.syncStatus === 'synced' ? 'bg-green-100 text-green-700' :
                            batch.syncStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {batch.syncStatus.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-3 text-white">
          <h3 className="text-lg font-semibold mb-2">Integration Mapping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold mb-2">Production Data Flow</h4>
              <ul className="space-y-1 text-sm">
                <li>• Material consumption → Raw material inventory reduction</li>
                <li>• Labor hours → Work-in-progress allocation</li>
                <li>• Overhead costs → Manufacturing overhead allocation</li>
                <li>• Finished goods → Finished goods inventory increase</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold mb-2">Financial Journal Entries</h4>
              <ul className="space-y-1 text-sm">
                <li>• Dr. Work-in-Progress | Cr. Raw Materials</li>
                <li>• Dr. Work-in-Progress | Cr. Wages Payable</li>
                <li>• Dr. Work-in-Progress | Cr. Manufacturing Overhead</li>
                <li>• Dr. Finished Goods | Cr. Work-in-Progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
