'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building,
  Zap,
  Wrench,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  PieChart,
  Factory,
  Truck
} from 'lucide-react'

interface OverheadCost {
  id: string
  costCode: string
  costName: string
  category: string
  subcategory: string
  allocationBasis: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
  allocationRate: number
  applicableTo: string[]
  status: 'within-budget' | 'over-budget' | 'under-budget'
}

interface CategoryTotal {
  category: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
  items: number
}

export default function OverheadCostingPage() {
  const router = useRouter()

  const [overheadCosts] = useState<OverheadCost[]>([
    {
      id: 'OH-001',
      costCode: 'ELEC-PROD',
      costName: 'Production Electricity',
      category: 'Utilities',
      subcategory: 'Electricity',
      allocationBasis: 'Machine Hours',
      budgetedAmount: 850000,
      actualAmount: 895000,
      variance: 45000,
      variancePercent: 5.3,
      allocationRate: 45,
      applicableTo: ['Sink Manufacturing', 'Faucet Manufacturing', 'Cookware Manufacturing'],
      status: 'over-budget'
    },
    {
      id: 'OH-002',
      costCode: 'RENT-FAC',
      costName: 'Factory Rent',
      category: 'Facility',
      subcategory: 'Rent & Lease',
      allocationBasis: 'Floor Area',
      budgetedAmount: 1200000,
      actualAmount: 1200000,
      variance: 0,
      variancePercent: 0,
      allocationRate: 85,
      applicableTo: ['All Departments'],
      status: 'within-budget'
    },
    {
      id: 'OH-003',
      costCode: 'MAINT-MACH',
      costName: 'Machine Maintenance',
      category: 'Maintenance',
      subcategory: 'Equipment',
      allocationBasis: 'Machine Hours',
      budgetedAmount: 450000,
      actualAmount: 485000,
      variance: 35000,
      variancePercent: 7.8,
      allocationRate: 24,
      applicableTo: ['CNC Machines', 'Welding Equipment', 'Casting Machines'],
      status: 'over-budget'
    },
    {
      id: 'OH-004',
      costCode: 'DEPR-EQUIP',
      costName: 'Equipment Depreciation',
      category: 'Depreciation',
      subcategory: 'Machinery',
      allocationBasis: 'Straight Line',
      budgetedAmount: 680000,
      actualAmount: 680000,
      variance: 0,
      variancePercent: 0,
      allocationRate: 35,
      applicableTo: ['Production Equipment'],
      status: 'within-budget'
    },
    {
      id: 'OH-005',
      costCode: 'INSUR-PROP',
      costName: 'Property Insurance',
      category: 'Insurance',
      subcategory: 'Property & Equipment',
      allocationBasis: 'Asset Value',
      budgetedAmount: 320000,
      actualAmount: 315000,
      variance: -5000,
      variancePercent: -1.6,
      allocationRate: 16,
      applicableTo: ['All Assets'],
      status: 'under-budget'
    },
    {
      id: 'OH-006',
      costCode: 'QUAL-TEST',
      costName: 'Quality Testing Materials',
      category: 'Quality Control',
      subcategory: 'Testing',
      allocationBasis: 'Units Produced',
      budgetedAmount: 280000,
      actualAmount: 295000,
      variance: 15000,
      variancePercent: 5.4,
      allocationRate: 15,
      applicableTo: ['All Products'],
      status: 'over-budget'
    },
    {
      id: 'OH-007',
      costCode: 'WATER-IND',
      costName: 'Industrial Water Supply',
      category: 'Utilities',
      subcategory: 'Water',
      allocationBasis: 'Direct Labor Hours',
      budgetedAmount: 180000,
      actualAmount: 175000,
      variance: -5000,
      variancePercent: -2.8,
      allocationRate: 9,
      applicableTo: ['Manufacturing Departments'],
      status: 'within-budget'
    },
    {
      id: 'OH-008',
      costCode: 'SUPER-PROD',
      costName: 'Production Supervision',
      category: 'Supervision',
      subcategory: 'Salaries',
      allocationBasis: 'Direct Labor Hours',
      budgetedAmount: 950000,
      actualAmount: 980000,
      variance: 30000,
      variancePercent: 3.2,
      allocationRate: 48,
      applicableTo: ['Production Departments'],
      status: 'over-budget'
    },
    {
      id: 'OH-009',
      costCode: 'TOOL-CONS',
      costName: 'Tool & Consumables',
      category: 'Indirect Materials',
      subcategory: 'Tools',
      allocationBasis: 'Machine Hours',
      budgetedAmount: 380000,
      actualAmount: 365000,
      variance: -15000,
      variancePercent: -3.9,
      allocationRate: 19,
      applicableTo: ['Machining Operations'],
      status: 'under-budget'
    },
    {
      id: 'OH-010',
      costCode: 'SAFE-EQP',
      costName: 'Safety Equipment & Training',
      category: 'Safety',
      subcategory: 'PPE & Training',
      allocationBasis: 'Number of Workers',
      budgetedAmount: 220000,
      actualAmount: 228000,
      variance: 8000,
      variancePercent: 3.6,
      allocationRate: 11,
      applicableTo: ['All Employees'],
      status: 'over-budget'
    },
    {
      id: 'OH-011',
      costCode: 'WASTE-DISP',
      costName: 'Waste Disposal & Recycling',
      category: 'Environmental',
      subcategory: 'Waste Management',
      allocationBasis: 'Units Produced',
      budgetedAmount: 150000,
      actualAmount: 145000,
      variance: -5000,
      variancePercent: -3.3,
      allocationRate: 8,
      applicableTo: ['Manufacturing Departments'],
      status: 'within-budget'
    },
    {
      id: 'OH-012',
      costCode: 'STORE-MAT',
      costName: 'Material Storage & Handling',
      category: 'Warehousing',
      subcategory: 'Storage',
      allocationBasis: 'Material Volume',
      budgetedAmount: 420000,
      actualAmount: 445000,
      variance: 25000,
      variancePercent: 6.0,
      allocationRate: 22,
      applicableTo: ['Raw Materials', 'Finished Goods'],
      status: 'over-budget'
    }
  ])

  const categoryTotals: CategoryTotal[] = [
    { category: 'Utilities', budgeted: 1030000, actual: 1070000, variance: 40000, variancePercent: 3.9, items: 2 },
    { category: 'Facility', budgeted: 1200000, actual: 1200000, variance: 0, variancePercent: 0, items: 1 },
    { category: 'Maintenance', budgeted: 450000, actual: 485000, variance: 35000, variancePercent: 7.8, items: 1 },
    { category: 'Depreciation', budgeted: 680000, actual: 680000, variance: 0, variancePercent: 0, items: 1 },
    { category: 'Insurance', budgeted: 320000, actual: 315000, variance: -5000, variancePercent: -1.6, items: 1 },
    { category: 'Quality Control', budgeted: 280000, actual: 295000, variance: 15000, variancePercent: 5.4, items: 1 },
    { category: 'Supervision', budgeted: 950000, actual: 980000, variance: 30000, variancePercent: 3.2, items: 1 },
    { category: 'Indirect Materials', budgeted: 380000, actual: 365000, variance: -15000, variancePercent: -3.9, items: 1 },
    { category: 'Safety', budgeted: 220000, actual: 228000, variance: 8000, variancePercent: 3.6, items: 1 },
    { category: 'Environmental', budgeted: 150000, actual: 145000, variance: -5000, variancePercent: -3.3, items: 1 },
    { category: 'Warehousing', budgeted: 420000, actual: 445000, variance: 25000, variancePercent: 6.0, items: 1 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'within-budget':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'over-budget':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'under-budget':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Utilities':
        return <Zap className="h-5 w-5 text-yellow-600" />
      case 'Facility':
        return <Building className="h-5 w-5 text-blue-600" />
      case 'Maintenance':
        return <Wrench className="h-5 w-5 text-orange-600" />
      case 'Warehousing':
        return <Truck className="h-5 w-5 text-purple-600" />
      default:
        return <Factory className="h-5 w-5 text-gray-600" />
    }
  }

  const totalBudgeted = overheadCosts.reduce((sum, c) => sum + c.budgetedAmount, 0)
  const totalActual = overheadCosts.reduce((sum, c) => sum + c.actualAmount, 0)
  const totalVariance = totalActual - totalBudgeted
  const totalVariancePercent = (totalVariance / totalBudgeted) * 100

  const overBudgetCount = overheadCosts.filter(c => c.status === 'over-budget').length
  const withinBudgetCount = overheadCosts.filter(c => c.status === 'within-budget').length

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overhead Costing</h1>
            <p className="text-sm text-gray-600 mt-1">Track and allocate manufacturing overhead costs</p>
          </div>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Budgeted Overhead</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{(totalBudgeted / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-blue-700 mt-1">Annual budget</p>
            </div>
            <PieChart className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Actual Overhead</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalActual / 10000000).toFixed(2)}Cr</p>
              <p className="text-xs text-green-700 mt-1">Current period</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Variance</p>
              <p className={`text-2xl font-bold mt-1 ${getVarianceColor(totalVariance)}`}>
                {totalVariance > 0 ? '+' : ''}₹{(Math.abs(totalVariance) / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-orange-700 mt-1">{totalVariancePercent > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Over Budget Items</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{overBudgetCount}</p>
              <p className="text-xs text-red-700 mt-1">{withinBudgetCount} within budget</p>
            </div>
            <Building className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Category Totals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Overhead by Category</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTotals.map((cat) => (
              <div key={cat.category} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getCategoryIcon(cat.category)}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{cat.category}</p>
                      <p className="text-xs text-gray-600 mt-1">{cat.items} cost {cat.items === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budgeted:</span>
                    <span className="font-semibold text-gray-900">₹{(cat.budgeted / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Actual:</span>
                    <span className="font-semibold text-gray-900">₹{(cat.actual / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Variance:</span>
                    <span className={`font-semibold ${getVarianceColor(cat.variance)}`}>
                      {cat.variance > 0 ? '+' : ''}₹{(Math.abs(cat.variance) / 1000).toFixed(0)}K ({cat.variancePercent > 0 ? '+' : ''}{cat.variancePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overhead Details Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Overhead Cost Details</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search overhead costs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocation Basis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budgeted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {overheadCosts.map((cost) => (
                <tr key={cost.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{cost.costName}</p>
                      <p className="text-xs text-gray-600 mt-1">{cost.costCode} - {cost.subcategory}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{cost.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{cost.allocationBasis}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{(cost.budgetedAmount / 1000).toFixed(0)}K</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{(cost.actualAmount / 1000).toFixed(0)}K</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-semibold ${getVarianceColor(cost.variance)}`}>
                        {cost.variance > 0 ? '+' : ''}₹{(Math.abs(cost.variance) / 1000).toFixed(0)}K
                      </p>
                      <p className={`text-xs ${getVarianceColor(cost.variance)}`}>
                        {cost.variancePercent > 0 ? '+' : ''}{cost.variancePercent.toFixed(1)}%
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">₹{cost.allocationRate}</p>
                    <p className="text-xs text-gray-600">per unit</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cost.status)}`}>
                      {cost.status.toUpperCase().replace('-', ' ')}
                    </span>
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
