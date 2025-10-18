'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Package,
  Users,
  MapPin,
  BarChart3,
  DollarSign
} from 'lucide-react'

export default function ProfitabilityAnalysisPage() {
  const [products] = useState([
    { name: 'Hydraulic Press HP-500', revenue: 25000000, cost: 15000000, profit: 10000000, margin: 40, units: 50 },
    { name: 'CNC Machine CM-350', revenue: 18000000, cost: 10800000, profit: 7200000, margin: 40, units: 30 },
    { name: 'Control Panel CP-1000', revenue: 12000000, cost: 8400000, profit: 3600000, margin: 30, units: 100 }
  ])

  const [customers] = useState([
    { name: 'ABC Manufacturing', revenue: 15000000, cost: 9000000, profit: 6000000, margin: 40 },
    { name: 'XYZ Industries', revenue: 12000000, cost: 7800000, profit: 4200000, margin: 35 },
    { name: 'Global Tech', revenue: 10000000, cost: 6500000, profit: 3500000, margin: 35 }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profitability Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze profitability by product, customer, and segment</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product Profitability</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {products.map((product, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.units} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{product.margin}%</p>
                      <p className="text-xs text-gray-600">Profit Margin</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Revenue</p>
                      <p className="text-lg font-semibold text-blue-900">{formatCurrency(product.revenue)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-orange-600 mb-1">Cost</p>
                      <p className="text-lg font-semibold text-orange-900">{formatCurrency(product.cost)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Profit</p>
                      <p className="text-lg font-semibold text-green-900">{formatCurrency(product.profit)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${product.margin}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Customer Profitability</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {customers.map((customer, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{customer.margin}%</p>
                      <p className="text-xs text-gray-600">Margin</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Revenue</p>
                      <p className="text-lg font-semibold text-blue-900">{formatCurrency(customer.revenue)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-orange-600 mb-1">Cost</p>
                      <p className="text-lg font-semibold text-orange-900">{formatCurrency(customer.cost)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Profit</p>
                      <p className="text-lg font-semibold text-green-900">{formatCurrency(customer.profit)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${customer.margin}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
