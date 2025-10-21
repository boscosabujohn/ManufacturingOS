'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingUp, Calendar, Package, DollarSign, BarChart3, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ForecastData {
  month: string
  actualRevenue?: number
  forecastRevenue: number
  actualOrders?: number
  forecastOrders: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
}

interface CategoryForecast {
  category: string
  currentSales: number
  forecastSales: number
  growth: number
  confidence: number
  risk: 'low' | 'medium' | 'high'
  keyDrivers: string[]
}

export default function ForecastPage() {
  const router = useRouter()
  const [forecastPeriod, setForecastPeriod] = useState('3months')

  const [monthlyForecast] = useState<ForecastData[]>([
    { month: 'Aug 2025', actualRevenue: 44500, forecastRevenue: 44200, actualOrders: 289, forecastOrders: 285, confidence: 95, trend: 'up' },
    { month: 'Sep 2025', actualRevenue: 46700, forecastRevenue: 46500, actualOrders: 298, forecastOrders: 295, confidence: 93, trend: 'up' },
    { month: 'Oct 2025', actualRevenue: 51200, forecastRevenue: 50800, actualOrders: 325, forecastOrders: 320, confidence: 91, trend: 'up' },
    { month: 'Nov 2025', forecastRevenue: 54500, forecastOrders: 348, confidence: 87, trend: 'up' },
    { month: 'Dec 2025', forecastRevenue: 58900, forecastOrders: 375, confidence: 85, trend: 'up' },
    { month: 'Jan 2026', forecastRevenue: 48700, forecastOrders: 310, confidence: 78, trend: 'down' },
    { month: 'Feb 2026', forecastRevenue: 51200, forecastOrders: 325, confidence: 76, trend: 'up' },
    { month: 'Mar 2026', forecastRevenue: 56800, forecastOrders: 360, confidence: 74, trend: 'up' },
    { month: 'Apr 2026', forecastRevenue: 59300, forecastOrders: 378, confidence: 72, trend: 'up' },
    { month: 'May 2026', forecastRevenue: 63400, forecastOrders: 405, confidence: 70, trend: 'up' },
    { month: 'Jun 2026', forecastRevenue: 67800, forecastOrders: 435, confidence: 68, trend: 'up' }
  ])

  const [categoryForecasts] = useState<CategoryForecast[]>([
    {
      category: 'Countertops',
      currentSales: 3456000,
      forecastSales: 4534000,
      growth: 31.2,
      confidence: 89,
      risk: 'low',
      keyDrivers: ['Real estate boom', 'Premium segment growth', 'Renovation demand']
    },
    {
      category: 'Kitchen Appliances',
      currentSales: 2345000,
      forecastSales: 2901000,
      growth: 23.7,
      confidence: 85,
      risk: 'low',
      keyDrivers: ['Smart home trend', 'Energy efficiency focus', 'Festival season']
    },
    {
      category: 'Kitchen Faucets',
      currentSales: 1567000,
      forecastSales: 1854000,
      growth: 18.3,
      confidence: 82,
      risk: 'medium',
      keyDrivers: ['Bathroom modernization', 'Water-saving features', 'Design trends']
    },
    {
      category: 'Kitchen Storage',
      currentSales: 1876000,
      forecastSales: 2173000,
      growth: 15.8,
      confidence: 88,
      risk: 'low',
      keyDrivers: ['Space optimization trend', 'Modular kitchen demand', 'Builder projects']
    },
    {
      category: 'Kitchen Sinks',
      currentSales: 1245000,
      forecastSales: 1401000,
      growth: 12.5,
      confidence: 86,
      risk: 'low',
      keyDrivers: ['Construction activity', 'Replacement market', 'Stainless steel preference']
    },
    {
      category: 'Kitchen Ventilation',
      currentSales: 1234000,
      forecastSales: 1338000,
      growth: 8.4,
      confidence: 80,
      risk: 'medium',
      keyDrivers: ['Open kitchen trend', 'Health consciousness', 'Auto-clean feature']
    },
    {
      category: 'Kitchen Accessories',
      currentSales: 678000,
      forecastSales: 723000,
      growth: 6.7,
      confidence: 78,
      risk: 'medium',
      keyDrivers: ['Organization trend', 'Budget-friendly upgrades', 'DIY home improvement']
    },
    {
      category: 'Cookware',
      currentSales: 987000,
      forecastSales: 936000,
      growth: -5.2,
      confidence: 75,
      risk: 'high',
      keyDrivers: ['Market saturation', 'Quality concerns', 'Competition from online brands']
    }
  ])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      case 'stable':
        return <Activity className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const totalForecastRevenue = categoryForecasts.reduce((sum, cat) => sum + cat.forecastSales, 0)
  const totalCurrentRevenue = categoryForecasts.reduce((sum, cat) => sum + cat.currentSales, 0)
  const overallGrowth = ((totalForecastRevenue - totalCurrentRevenue) / totalCurrentRevenue) * 100

  const nextMonthForecast = monthlyForecast.find(m => !m.actualRevenue)
  const avgConfidence = categoryForecasts.reduce((sum, cat) => sum + cat.confidence, 0) / categoryForecasts.length

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Forecast</h1>
            <p className="text-sm text-gray-600 mt-1">AI-powered sales predictions for kitchen products</p>
          </div>
        </div>
        <select
          value={forecastPeriod}
          onChange={(e) => setForecastPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="1month">Next Month</option>
          <option value="3months">Next 3 Months</option>
          <option value="6months">Next 6 Months</option>
          <option value="12months">Next 12 Months</option>
        </select>
      </div>

      {/* Key Forecast Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-100">Next Month Forecast</p>
            <Calendar className="h-5 w-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold">₹{nextMonthForecast ? (nextMonthForecast.forecastRevenue / 100000).toFixed(1) : '0'}L</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {getTrendIcon(nextMonthForecast?.trend || 'stable')}
              <span className="text-sm">{nextMonthForecast?.forecastOrders} orders</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-100">Q4 2025 Forecast</p>
            <DollarSign className="h-5 w-5 text-green-200" />
          </div>
          <p className="text-3xl font-bold">₹{(totalForecastRevenue / 10000000).toFixed(2)}Cr</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{overallGrowth.toFixed(1)}% growth</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Avg Confidence</p>
            <BarChart3 className="h-5 w-5 text-purple-200" />
          </div>
          <p className="text-3xl font-bold">{avgConfidence.toFixed(0)}%</p>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">High accuracy</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-100">Risk Alert</p>
            <AlertTriangle className="h-5 w-5 text-orange-200" />
          </div>
          <p className="text-3xl font-bold">{categoryForecasts.filter(c => c.risk === 'high').length}</p>
          <p className="text-xs text-orange-100 mt-2">Categories need attention</p>
        </div>
      </div>

      {/* Monthly Forecast Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue Forecast (₹ Lakhs)</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Forecast</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {monthlyForecast.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 w-32">
                  <span className="font-medium text-gray-700">{data.month}</span>
                  {getTrendIcon(data.trend)}
                </div>
                <div className="flex-1 flex items-center gap-4">
                  {data.actualRevenue && (
                    <div className="text-blue-600 font-medium w-24 text-right">
                      ₹{(data.actualRevenue / 1000).toFixed(0)}L
                    </div>
                  )}
                  <div className="text-purple-600 font-semibold w-24 text-right">
                    ₹{(data.forecastRevenue / 1000).toFixed(0)}L
                  </div>
                  <div className="text-gray-600 w-20 text-right">
                    {data.forecastOrders} orders
                  </div>
                  <div className="w-24">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.confidence >= 85 ? 'bg-green-100 text-green-700' :
                      data.confidence >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {data.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {data.actualRevenue && (
                  <div className="relative flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="absolute top-0 left-0 h-3 rounded-full bg-blue-500"
                      style={{ width: `${(data.actualRevenue / 67800) * 100}%` }}
                    />
                  </div>
                )}
                <div className="relative flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="absolute top-0 left-0 h-3 rounded-full bg-purple-500"
                    style={{ width: `${(data.forecastRevenue / 67800) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Forecasts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Category-wise Forecast Analysis</h2>
          <Package className="h-5 w-5 text-gray-600" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryForecasts.map((forecast) => (
            <div key={forecast.category} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{forecast.category}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(forecast.risk)}`}>
                    {forecast.risk.toUpperCase()} RISK
                  </span>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 justify-end ${forecast.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {forecast.growth >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingUp className="h-5 w-5 rotate-180" />}
                    <span className="font-bold text-lg">{Math.abs(forecast.growth)}%</span>
                  </div>
                  <span className="text-xs text-gray-600">Growth</span>
                </div>
              </div>

              {/* Current vs Forecast */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Current Sales</p>
                  <p className="font-semibold text-blue-900">₹{(forecast.currentSales / 100000).toFixed(2)}L</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Forecast Sales</p>
                  <p className="font-semibold text-green-900">₹{(forecast.forecastSales / 100000).toFixed(2)}L</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Confidence Level</span>
                  <span className="font-semibold text-gray-900">{forecast.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      forecast.confidence >= 85 ? 'bg-green-500' :
                      forecast.confidence >= 75 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${forecast.confidence}%` }}
                  />
                </div>
              </div>

              {/* Key Drivers */}
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Key Growth Drivers:</p>
                <ul className="space-y-1">
                  {forecast.keyDrivers.map((driver, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {driver}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Accuracy */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900 mb-2">Forecast Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-indigo-700 mb-1">Model Type</p>
                <p className="font-semibold text-indigo-900">Time Series + ML Hybrid</p>
              </div>
              <div>
                <p className="text-indigo-700 mb-1">Historical Data Period</p>
                <p className="font-semibold text-indigo-900">24 Months</p>
              </div>
              <div>
                <p className="text-indigo-700 mb-1">Last Updated</p>
                <p className="font-semibold text-indigo-900">Oct 20, 2025</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-700">
                <strong>Note:</strong> Forecasts are based on historical sales patterns, seasonal trends, market conditions, and economic indicators.
                Actual results may vary based on external factors such as competition, market dynamics, and unforeseen events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
