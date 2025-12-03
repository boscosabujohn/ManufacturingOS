'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Percent,
  TrendingUp,
  Target,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calculator,
  Edit2,
  Save
} from 'lucide-react'

interface MarkupRule {
  id: string
  ruleCode: string
  ruleName: string
  category: string
  subcategory: string
  costBasis: 'direct-cost' | 'full-cost' | 'variable-cost'
  markupPercent: number
  minimumPrice?: number
  maximumPrice?: number
  applicableRange: string
  priority: number
  status: 'active' | 'inactive'
  products: number
  avgSellingPrice: number
  avgMargin: number
}

interface CategoryMarkup {
  category: string
  defaultMarkup: number
  minMarkup: number
  maxMarkup: number
  products: number
  avgActualMarkup: number
}

export default function PricingMarkupPage() {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)

  const [markupRules] = useState<MarkupRule[]>([
    {
      id: 'MU-001',
      ruleCode: 'SINK-STD',
      ruleName: 'Standard Kitchen Sinks',
      category: 'Kitchen Sinks',
      subcategory: 'Standard Models',
      costBasis: 'full-cost',
      markupPercent: 48.0,
      minimumPrice: 5000,
      maximumPrice: 20000,
      applicableRange: 'All standard sink models',
      priority: 1,
      status: 'active',
      products: 8,
      avgSellingPrice: 11250,
      avgMargin: 32.4
    },
    {
      id: 'MU-002',
      ruleCode: 'SINK-PREM',
      ruleName: 'Premium Kitchen Sinks',
      category: 'Kitchen Sinks',
      subcategory: 'Premium Models',
      costBasis: 'full-cost',
      markupPercent: 52.0,
      minimumPrice: 15000,
      maximumPrice: 50000,
      applicableRange: 'Premium & luxury sink models',
      priority: 1,
      status: 'active',
      products: 5,
      avgSellingPrice: 28500,
      avgMargin: 34.2
    },
    {
      id: 'MU-003',
      ruleCode: 'FAU-CHR',
      ruleName: 'Chrome Faucets',
      category: 'Kitchen Faucets',
      subcategory: 'Chrome Finish',
      costBasis: 'full-cost',
      markupPercent: 50.6,
      minimumPrice: 3000,
      maximumPrice: 15000,
      applicableRange: 'All chrome plated faucets',
      priority: 1,
      status: 'active',
      products: 12,
      avgSellingPrice: 6200,
      avgMargin: 33.6
    },
    {
      id: 'MU-004',
      ruleCode: 'FAU-BRASS',
      ruleName: 'Brass Faucets',
      category: 'Kitchen Faucets',
      subcategory: 'Brass Finish',
      costBasis: 'full-cost',
      markupPercent: 55.0,
      minimumPrice: 5000,
      maximumPrice: 25000,
      applicableRange: 'Brass and antique finish faucets',
      priority: 1,
      status: 'active',
      products: 6,
      avgSellingPrice: 9800,
      avgMargin: 35.5
    },
    {
      id: 'MU-005',
      ruleCode: 'CW-NS',
      ruleName: 'Non-Stick Cookware',
      category: 'Cookware',
      subcategory: 'Non-Stick',
      costBasis: 'full-cost',
      markupPercent: 56.0,
      minimumPrice: 800,
      maximumPrice: 8000,
      applicableRange: 'All non-stick coated cookware',
      priority: 1,
      status: 'active',
      products: 15,
      avgSellingPrice: 2150,
      avgMargin: 35.9
    },
    {
      id: 'MU-006',
      ruleCode: 'CW-SS',
      ruleName: 'Stainless Steel Cookware',
      category: 'Cookware',
      subcategory: 'Stainless Steel',
      costBasis: 'full-cost',
      markupPercent: 55.0,
      minimumPrice: 1500,
      maximumPrice: 12000,
      applicableRange: 'SS cookware without coating',
      priority: 1,
      status: 'active',
      products: 10,
      avgSellingPrice: 3600,
      avgMargin: 35.5
    },
    {
      id: 'MU-007',
      ruleCode: 'CHIM-STD',
      ruleName: 'Standard Kitchen Chimneys',
      category: 'Kitchen Appliances',
      subcategory: 'Standard Chimneys',
      costBasis: 'full-cost',
      markupPercent: 51.4,
      minimumPrice: 15000,
      maximumPrice: 40000,
      applicableRange: '60cm & 90cm standard models',
      priority: 1,
      status: 'active',
      products: 8,
      avgSellingPrice: 24500,
      avgMargin: 33.9
    },
    {
      id: 'MU-008',
      ruleCode: 'CHIM-AUTO',
      ruleName: 'Auto-Clean Chimneys',
      category: 'Kitchen Appliances',
      subcategory: 'Auto-Clean Models',
      costBasis: 'full-cost',
      markupPercent: 58.0,
      minimumPrice: 25000,
      maximumPrice: 85000,
      applicableRange: 'Auto-clean chimney systems',
      priority: 1,
      status: 'active',
      products: 5,
      avgSellingPrice: 42000,
      avgMargin: 36.7
    },
    {
      id: 'MU-009',
      ruleCode: 'CAB-BASE',
      ruleName: 'Base Cabinets',
      category: 'Kitchen Cabinets',
      subcategory: 'Base Units',
      costBasis: 'full-cost',
      markupPercent: 44.5,
      minimumPrice: 8000,
      maximumPrice: 30000,
      applicableRange: 'All modular base cabinets',
      priority: 1,
      status: 'active',
      products: 12,
      avgSellingPrice: 16500,
      avgMargin: 30.8
    },
    {
      id: 'MU-010',
      ruleCode: 'CAB-WALL',
      ruleName: 'Wall Cabinets',
      category: 'Kitchen Cabinets',
      subcategory: 'Wall Units',
      costBasis: 'full-cost',
      markupPercent: 45.3,
      minimumPrice: 6000,
      maximumPrice: 25000,
      applicableRange: 'Wall mounted cabinets',
      priority: 1,
      status: 'active',
      products: 10,
      avgSellingPrice: 12800,
      avgMargin: 31.2
    },
    {
      id: 'MU-011',
      ruleCode: 'CT-GRAN',
      ruleName: 'Granite Countertops',
      category: 'Countertops',
      subcategory: 'Granite',
      costBasis: 'full-cost',
      markupPercent: 47.4,
      minimumPrice: 20000,
      maximumPrice: 80000,
      applicableRange: 'All granite countertop slabs',
      priority: 1,
      status: 'active',
      products: 8,
      avgSellingPrice: 38500,
      avgMargin: 32.1
    },
    {
      id: 'MU-012',
      ruleCode: 'CT-QUARTZ',
      ruleName: 'Quartz Countertops',
      category: 'Countertops',
      subcategory: 'Quartz',
      costBasis: 'full-cost',
      markupPercent: 47.4,
      minimumPrice: 25000,
      maximumPrice: 90000,
      applicableRange: 'Engineered quartz countertops',
      priority: 1,
      status: 'active',
      products: 6,
      avgSellingPrice: 41200,
      avgMargin: 32.2
    }
  ])

  const categoryMarkups: CategoryMarkup[] = [
    { category: 'Kitchen Sinks', defaultMarkup: 50.0, minMarkup: 45.0, maxMarkup: 55.0, products: 13, avgActualMarkup: 49.8 },
    { category: 'Kitchen Faucets', defaultMarkup: 52.5, minMarkup: 48.0, maxMarkup: 58.0, products: 18, avgActualMarkup: 52.3 },
    { category: 'Cookware', defaultMarkup: 55.5, minMarkup: 50.0, maxMarkup: 60.0, products: 25, avgActualMarkup: 55.7 },
    { category: 'Kitchen Appliances', defaultMarkup: 54.0, minMarkup: 50.0, maxMarkup: 60.0, products: 13, avgActualMarkup: 54.2 },
    { category: 'Kitchen Cabinets', defaultMarkup: 45.0, minMarkup: 40.0, maxMarkup: 50.0, products: 22, avgActualMarkup: 44.9 },
    { category: 'Countertops', defaultMarkup: 47.5, minMarkup: 45.0, maxMarkup: 52.0, products: 14, avgActualMarkup: 47.4 },
    { category: 'Kitchen Accessories', defaultMarkup: 51.5, minMarkup: 45.0, maxMarkup: 60.0, products: 18, avgActualMarkup: 50.8 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCostBasisColor = (basis: string) => {
    switch (basis) {
      case 'full-cost':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'direct-cost':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'variable-cost':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalProducts = markupRules.reduce((sum, r) => sum + r.products, 0)
  const avgMarkup = markupRules.reduce((sum, r) => sum + r.markupPercent, 0) / markupRules.length
  const activeRules = markupRules.filter(r => r.status === 'active').length

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calculator
        </button>
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Rules</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{activeRules}</p>
              <p className="text-xs text-blue-700 mt-1">Total {markupRules.length} rules</p>
            </div>
            <Target className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Markup</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{avgMarkup.toFixed(1)}%</p>
              <p className="text-xs text-green-700 mt-1">Across all rules</p>
            </div>
            <Percent className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Products Covered</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalProducts}</p>
              <p className="text-xs text-purple-700 mt-1">Unique products</p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Categories</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{categoryMarkups.length}</p>
              <p className="text-xs text-orange-700 mt-1">Product categories</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Markup Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Markup Guidelines</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryMarkups.map((cat) => (
              <div key={cat.category} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{cat.category}</p>
                    <p className="text-xs text-gray-600 mt-1">{cat.products} products</p>
                  </div>
                  <Calculator className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Default:</span>
                    <span className="font-semibold text-gray-900">{cat.defaultMarkup.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium text-gray-900">{cat.minMarkup}% - {cat.maxMarkup}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(cat.avgActualMarkup / cat.maxMarkup) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Actual Avg:</span>
                    <span className="font-semibold text-green-600">{cat.avgActualMarkup.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Markup Rules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Markup Rules</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Basis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Markup %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Results</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {markupRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{rule.ruleName}</p>
                      <p className="text-xs text-gray-600 mt-1">{rule.ruleCode} - {rule.subcategory}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{rule.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCostBasisColor(rule.costBasis)}`}>
                      {rule.costBasis.toUpperCase().replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === rule.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={rule.markupPercent}
                          className="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-green-600">{rule.markupPercent.toFixed(1)}%</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      ₹{(rule.minimumPrice! / 1000).toFixed(0)}K - ₹{(rule.maximumPrice! / 1000).toFixed(0)}K
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{rule.products}</p>
                    <p className="text-xs text-gray-600">products</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{(rule.avgSellingPrice / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-green-600">{rule.avgMargin.toFixed(1)}% margin</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(rule.status)}`}>
                      {rule.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === rule.id ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(rule.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
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
