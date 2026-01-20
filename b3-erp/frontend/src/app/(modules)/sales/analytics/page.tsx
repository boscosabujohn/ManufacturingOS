'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, BarChart3, PieChart, Target, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SalesAnalyticsPage() {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState('month')

  // Monthly sales data for kitchen products
  const monthlySales = [
    { month: 'Jan', revenue: 245, orders: 156, avgOrder: 157 },
    { month: 'Feb', revenue: 289, orders: 178, avgOrder: 162 },
    { month: 'Mar', revenue: 312, orders: 195, avgOrder: 160 },
    { month: 'Apr', revenue: 278, orders: 167, avgOrder: 166 },
    { month: 'May', revenue: 356, orders: 218, avgOrder: 163 },
    { month: 'Jun', revenue: 398, orders: 245, avgOrder: 162 },
    { month: 'Jul', revenue: 423, orders: 267, avgOrder: 158 },
    { month: 'Aug', revenue: 445, orders: 289, avgOrder: 154 },
    { month: 'Sep', revenue: 467, orders: 298, avgOrder: 157 },
    { month: 'Oct', revenue: 512, orders: 325, avgOrder: 158 }
  ]

  // Category performance
  const categoryData = [
    { category: 'Kitchen Sinks', revenue: 1245000, orders: 234, growth: 12.5, color: 'blue' },
    { category: 'Kitchen Faucets', revenue: 1567000, orders: 289, growth: 18.3, color: 'purple' },
    { category: 'Cookware', revenue: 987000, orders: 456, growth: -5.2, color: 'red' },
    { category: 'Kitchen Appliances', revenue: 2345000, orders: 567, growth: 23.7, color: 'green' },
    { category: 'Kitchen Storage', revenue: 1876000, orders: 345, growth: 15.8, color: 'orange' },
    { category: 'Kitchen Ventilation', revenue: 1234000, orders: 178, growth: 8.4, color: 'indigo' },
    { category: 'Countertops', revenue: 3456000, orders: 234, growth: 31.2, color: 'pink' },
    { category: 'Kitchen Accessories', revenue: 678000, orders: 789, growth: 6.7, color: 'yellow' }
  ]

  // Top performing products
  const topProducts = [
    { name: 'Premium Quartz Countertop', code: 'KIT-CT-002', revenue: 1245000, units: 2089, avgPrice: 596 },
    { name: 'Modular Kitchen Base Cabinet 24"', code: 'KIT-CB-001', revenue: 1156000, units: 465, avgPrice: 2486 },
    { name: '750W Mixer Grinder', code: 'KIT-AP-001', revenue: 987000, units: 1245, avgPrice: 793 },
    { name: 'Brass Kitchen Faucet', code: 'KIT-FC-002', revenue: 876000, units: 589, avgPrice: 1487 },
    { name: 'Chimney Hood 60cm', code: 'KIT-CH-001', revenue: 765000, units: 389, avgPrice: 1967 }
  ]

  // Regional performance
  const regionalData = [
    { region: 'North India', revenue: 3456000, growth: 15.2, orders: 567, color: 'blue' },
    { region: 'South India', revenue: 4123000, growth: 22.8, orders: 678, color: 'green' },
    { region: 'East India', revenue: 2345000, growth: -3.4, orders: 345, color: 'red' },
    { region: 'West India', revenue: 3987000, growth: 18.5, orders: 589, color: 'purple' }
  ]

  // Current month stats
  const currentStats = {
    revenue: 51200000,
    revenueGrowth: 18.5,
    orders: 325,
    ordersGrowth: 12.3,
    avgOrderValue: 157538,
    avgOrderGrowth: 5.5,
    customers: 234,
    customersGrowth: 8.7,
    conversionRate: 23.5,
    conversionGrowth: 2.3
  }

  return (
    <div className="w-full h-full px-4 py-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive sales performance insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-100">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold">₹{(currentStats.revenue / 10000000).toFixed(2)}Cr</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{currentStats.revenueGrowth}% vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-100">Total Orders</p>
            <ShoppingCart className="h-5 w-5 text-green-200" />
          </div>
          <p className="text-3xl font-bold">{currentStats.orders}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{currentStats.ordersGrowth}% vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Avg Order Value</p>
            <BarChart3 className="h-5 w-5 text-purple-200" />
          </div>
          <p className="text-3xl font-bold">₹{(currentStats.avgOrderValue / 1000).toFixed(0)}K</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{currentStats.avgOrderGrowth}% vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-100">Active Customers</p>
            <Users className="h-5 w-5 text-orange-200" />
          </div>
          <p className="text-3xl font-bold">{currentStats.customers}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{currentStats.customersGrowth}% vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-pink-100">Conversion Rate</p>
            <Target className="h-5 w-5 text-pink-200" />
          </div>
          <p className="text-3xl font-bold">{currentStats.conversionRate}%</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">{currentStats.conversionGrowth}% vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Link href="/sales/analytics/reports" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reports</h3>
              <p className="text-xs text-gray-600">Sales reports</p>
            </div>
          </div>
        </Link>

        <Link href="/sales/analytics/products" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Products</h3>
              <p className="text-xs text-gray-600">Product analytics</p>
            </div>
          </div>
        </Link>

        <Link href="/sales/analytics/customers" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Customers</h3>
              <p className="text-xs text-gray-600">Customer insights</p>
            </div>
          </div>
        </Link>

        <Link href="/sales/analytics/forecast" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Forecast</h3>
              <p className="text-xs text-gray-600">Sales predictions</p>
            </div>
          </div>
        </Link>

        <Link href="/sales/analytics/targets" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Target className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Targets</h3>
              <p className="text-xs text-gray-600">Goals & targets</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Trend (₹ Lakhs)</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Jan - Oct 2025</span>
          </div>
        </div>
        <div className="space-y-4">
          {monthlySales.map((data, index) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 w-12">{data.month}</span>
                <span className="text-gray-600 w-20 text-right">{data.orders} orders</span>
                <span className="font-semibold text-gray-900 w-24 text-right">₹{data.revenue}L</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-3">
                <div
                  className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${(data.revenue / 512) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
            <PieChart className="h-5 w-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{cat.orders} orders</span>
                    <span className={`flex items-center gap-1 ${cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cat.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(cat.growth)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${cat.color}-500`}
                      style={{ width: `${(cat.revenue / 3456000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 w-20 text-right">₹{(cat.revenue / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Regional Performance</h2>
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </div>
          <div className="space-y-6">
            {regionalData.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{region.region}</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {region.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {Math.abs(region.growth)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-${region.color}-500`}
                      style={{ width: `${(region.revenue / 4123000) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{region.orders} orders</span>
                  <span className="font-semibold text-gray-900">₹{(region.revenue / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing Kitchen Products</h2>
          <Package className="h-5 w-5 text-gray-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Code</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 font-mono">{product.code}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-gray-900">{product.units.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-gray-700">₹{product.avgPrice.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-green-600">₹{(product.revenue / 100000).toFixed(2)}L</span>
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
