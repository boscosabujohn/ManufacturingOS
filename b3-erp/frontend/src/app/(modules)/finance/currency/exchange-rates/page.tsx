'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  BarChart3,
  Download,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  previousRate: number
  change: number
  changePercent: number
  effectiveDate: string
  source: string
  type: 'spot' | 'forward' | 'historical'
}

interface RateHistory {
  date: string
  rate: number
  source: string
}

export default function ExchangeRatesPage() {
  const [selectedPair, setSelectedPair] = useState('USD-INR')
  const [rateType, setRateType] = useState('spot')

  const [exchangeRates] = useState<ExchangeRate[]>([
    {
      id: 'EXR-001',
      fromCurrency: 'USD',
      toCurrency: 'INR',
      rate: 83.25,
      previousRate: 83.15,
      change: 0.10,
      changePercent: 0.12,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    },
    {
      id: 'EXR-002',
      fromCurrency: 'EUR',
      toCurrency: 'INR',
      rate: 90.15,
      previousRate: 90.25,
      change: -0.10,
      changePercent: -0.11,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    },
    {
      id: 'EXR-003',
      fromCurrency: 'GBP',
      toCurrency: 'INR',
      rate: 105.45,
      previousRate: 105.30,
      change: 0.15,
      changePercent: 0.14,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    },
    {
      id: 'EXR-004',
      fromCurrency: 'JPY',
      toCurrency: 'INR',
      rate: 0.56,
      previousRate: 0.56,
      change: 0.00,
      changePercent: 0.00,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    },
    {
      id: 'EXR-005',
      fromCurrency: 'AED',
      toCurrency: 'INR',
      rate: 22.65,
      previousRate: 22.60,
      change: 0.05,
      changePercent: 0.22,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    },
    {
      id: 'EXR-006',
      fromCurrency: 'SGD',
      toCurrency: 'INR',
      rate: 62.10,
      previousRate: 62.05,
      change: 0.05,
      changePercent: 0.08,
      effectiveDate: '2025-10-18',
      source: 'RBI',
      type: 'spot'
    }
  ])

  const [rateHistory] = useState<RateHistory[]>([
    { date: '2025-10-18', rate: 83.25, source: 'RBI' },
    { date: '2025-10-17', rate: 83.15, source: 'RBI' },
    { date: '2025-10-16', rate: 83.20, source: 'RBI' },
    { date: '2025-10-15', rate: 83.10, source: 'RBI' },
    { date: '2025-10-14', rate: 83.05, source: 'RBI' },
    { date: '2025-10-11', rate: 83.00, source: 'RBI' },
    { date: '2025-10-10', rate: 82.95, source: 'RBI' }
  ])

  const appreciatingCurrencies = exchangeRates.filter(r => r.change > 0).length
  const depreciatingCurrencies = exchangeRates.filter(r => r.change < 0).length
  const lastUpdate = new Date().toLocaleString('en-IN')

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exchange Rate Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage foreign exchange rates</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              <Download className="h-5 w-5" />
              Export Rates
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
              <RefreshCw className="h-5 w-5" />
              Update Rates
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Currency Pairs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{exchangeRates.length}</p>
                <p className="text-xs text-blue-700 mt-1">Active rates</p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Appreciating</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{appreciatingCurrencies}</p>
                <p className="text-xs text-green-700 mt-1">Currencies up</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Depreciating</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{depreciatingCurrencies}</p>
                <p className="text-xs text-red-700 mt-1">Currencies down</p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Last Update</p>
                <p className="text-sm font-bold text-purple-900 mt-1">Just now</p>
                <p className="text-xs text-purple-700 mt-1">{lastUpdate}</p>
              </div>
              <Clock className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Current Rates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Current Exchange Rates</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="spot">Spot Rates</option>
                  <option value="forward">Forward Rates</option>
                  <option value="historical">Historical Rates</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exchangeRates.map((rate) => (
                <div key={rate.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Exchange Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{rate.fromCurrency}/{rate.toCurrency}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${rate.change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {rate.change >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">{rate.rate.toFixed(4)}</span>
                      <span className={`text-sm font-semibold ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(4)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Change:</span>
                      <span className={`font-semibold ${rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Previous:</span>
                      <span className="font-medium text-gray-900">{rate.previousRate.toFixed(4)}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Source: {rate.source}</span>
                        <span className="text-gray-500">{new Date(rate.effectiveDate).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate History Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">USD/INR Rate History (7 Days)</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {rateHistory.map((history, index) => {
                const prevRate = index < rateHistory.length - 1 ? rateHistory[index + 1].rate : history.rate
                const change = history.rate - prevRate
                const changePercent = ((change / prevRate) * 100)

                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-600">
                          {new Date(history.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(history.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-gray-300" />
                      <div>
                        <p className="text-xs text-gray-600">Exchange Rate</p>
                        <p className="text-xl font-bold text-gray-900">{history.rate.toFixed(4)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Change</p>
                        <p className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(4)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        {change >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : change < 0 ? (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Rate Update Alerts */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-200 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Exchange Rate Update Settings</h3>
              <p className="text-sm text-yellow-800 mb-4">
                Rates are automatically updated daily from RBI at 12:00 PM IST. Manual updates can be triggered anytime.
              </p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                  Configure Auto-Update
                </button>
                <button className="px-4 py-2 bg-white text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium">
                  Set Rate Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
