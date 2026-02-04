'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  Target
} from 'lucide-react'

interface Ratio {
  name: string
  value: number
  benchmark: number
  formula: string
  interpretation: string
  category: string
}

export default function FinancialRatiosPage() {
  const [ratios] = useState<Ratio[]>([
    { name: 'Current Ratio', value: 2.45, benchmark: 2.0, formula: 'Current Assets / Current Liabilities', interpretation: 'Strong liquidity position', category: 'Liquidity' },
    { name: 'Quick Ratio', value: 1.85, benchmark: 1.5, formula: '(Current Assets - Inventory) / Current Liabilities', interpretation: 'Good short-term liquidity', category: 'Liquidity' },
    { name: 'Cash Ratio', value: 0.95, benchmark: 0.5, formula: 'Cash / Current Liabilities', interpretation: 'Excellent cash position', category: 'Liquidity' },
    { name: 'Gross Profit Margin', value: 38.5, benchmark: 35.0, formula: '(Revenue - COGS) / Revenue × 100', interpretation: 'Above industry average', category: 'Profitability' },
    { name: 'Net Profit Margin', value: 22.3, benchmark: 18.0, formula: 'Net Income / Revenue × 100', interpretation: 'Strong profitability', category: 'Profitability' },
    { name: 'Return on Assets (ROA)', value: 15.2, benchmark: 12.0, formula: 'Net Income / Total Assets × 100', interpretation: 'Efficient asset utilization', category: 'Profitability' },
    { name: 'Return on Equity (ROE)', value: 24.8, benchmark: 20.0, formula: 'Net Income / Shareholders Equity × 100', interpretation: 'Excellent return for shareholders', category: 'Profitability' },
    { name: 'Asset Turnover', value: 1.65, benchmark: 1.5, formula: 'Revenue / Total Assets', interpretation: 'Good asset efficiency', category: 'Efficiency' },
    { name: 'Inventory Turnover', value: 8.2, benchmark: 6.0, formula: 'COGS / Average Inventory', interpretation: 'Efficient inventory management', category: 'Efficiency' },
    { name: 'Receivables Turnover', value: 8.7, benchmark: 8.0, formula: 'Revenue / Average Receivables', interpretation: 'Good collection efficiency', category: 'Efficiency' },
    { name: 'Debt-to-Equity', value: 0.65, benchmark: 1.0, formula: 'Total Debt / Total Equity', interpretation: 'Conservative leverage', category: 'Leverage' },
    { name: 'Debt Ratio', value: 0.39, benchmark: 0.5, formula: 'Total Debt / Total Assets', interpretation: 'Low financial risk', category: 'Leverage' },
    { name: 'Interest Coverage', value: 12.5, benchmark: 5.0, formula: 'EBIT / Interest Expense', interpretation: 'Strong ability to service debt', category: 'Leverage' }
  ])

  const categories = ['Liquidity', 'Profitability', 'Efficiency', 'Leverage']

  const getRatioStatus = (value: number, benchmark: number, category: string) => {
    const diff = value - benchmark
    const isGood = category === 'Leverage' ? diff <= 0 : diff >= 0
    return isGood ? 'good' : 'concern'
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 px-3 py-2">
      <div className="w-full space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Ratios Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial ratio analysis and benchmarking</p>
        </div>

        {categories.map((category) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{category} Ratios</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {ratios
                  .filter(r => r.category === category)
                  .map((ratio, idx) => {
                    const status = getRatioStatus(ratio.value, ratio.benchmark, category)
                    return (
                      <div key={idx} className="border-2 border-gray-200 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{ratio.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{ratio.formula}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${status === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                              {ratio.value.toFixed(2)}{ratio.name.includes('Margin') || ratio.name.includes('Return') || ratio.name.includes('ROA') || ratio.name.includes('ROE') ? '%' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Benchmark</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {ratio.benchmark.toFixed(2)}{ratio.name.includes('Margin') || ratio.name.includes('Return') || ratio.name.includes('ROA') || ratio.name.includes('ROE') ? '%' : ''}
                            </p>
                          </div>
                          <div className={`rounded-lg p-3 ${status === 'good' ? 'bg-green-50' : 'bg-orange-50'}`}>
                            <p className={`text-xs mb-1 ${status === 'good' ? 'text-green-600' : 'text-orange-600'}`}>Status</p>
                            <p className={`text-lg font-semibold ${status === 'good' ? 'text-green-900' : 'text-orange-900'}`}>
                              {ratio.interpretation}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>vs Benchmark</span>
                          <span className={`font-medium ${status === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                            {((ratio.value / ratio.benchmark - 1) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${status === 'good' ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min((ratio.value / ratio.benchmark) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
