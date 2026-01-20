'use client'

import { useState } from 'react'
import { ArrowLeft, GitCompare, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, DollarSign, Percent } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BOQComparison {
  projectName: string
  versions: BOQVersion[]
}

interface BOQVersion {
  id: string
  versionName: string
  versionNumber: string
  type: 'internal' | 'vendor_a' | 'vendor_b' | 'revised'
  totalCost: number
  materialCost: number
  laborCost: number
  overheadCost: number
  profitMargin: number
  deliveryDays: number
  warranty: string
  items: ComparisonItem[]
  notes: string
  submittedBy: string
  submittedDate: string
}

interface ComparisonItem {
  itemName: string
  unit: string
  quantity: number
  rate: number
  amount: number
}

export default function BOQComparisonPage() {
  const router = useRouter()
  const [selectedComparison, setSelectedComparison] = useState('comp-001')

  const [comparisons] = useState<BOQComparison[]>([
    {
      projectName: 'Luxury Villa - Modular Kitchen (12x12 ft)',
      versions: [
        {
          id: 'v1',
          versionName: 'Internal Estimate',
          versionNumber: 'V1.0',
          type: 'internal',
          totalCost: 585000,
          materialCost: 409500,
          laborCost: 117000,
          overheadCost: 58500,
          profitMargin: 12.0,
          deliveryDays: 45,
          warranty: '2 Years',
          submittedBy: 'Internal Team',
          submittedDate: '2025-10-10',
          notes: 'Standard pricing with 12% margin',
          items: [
            { itemName: 'Premium Base Cabinet 30"', unit: 'nos', quantity: 5, rate: 28500, amount: 142500 },
            { itemName: 'Designer Wall Cabinet with LED', unit: 'nos', quantity: 4, rate: 22000, amount: 88000 },
            { itemName: 'Italian Marble Countertop', unit: 'sqft', quantity: 60, rate: 1200, amount: 72000 },
            { itemName: 'Chimney Hood 90cm Auto-Clean', unit: 'nos', quantity: 1, rate: 35000, amount: 35000 },
            { itemName: 'Built-in Oven & Microwave', unit: 'nos', quantity: 1, rate: 65000, amount: 65000 }
          ]
        },
        {
          id: 'v2',
          versionName: 'Vendor A Quote',
          versionNumber: 'VA-Q1',
          type: 'vendor_a',
          totalCost: 548000,
          materialCost: 383600,
          laborCost: 109600,
          overheadCost: 54800,
          profitMargin: 10.5,
          deliveryDays: 50,
          warranty: '18 Months',
          submittedBy: 'Premium Kitchens Pvt Ltd',
          submittedDate: '2025-10-12',
          notes: 'Competitive pricing, longer delivery time',
          items: [
            { itemName: 'Premium Base Cabinet 30"', unit: 'nos', quantity: 5, rate: 26500, amount: 132500 },
            { itemName: 'Designer Wall Cabinet with LED', unit: 'nos', quantity: 4, rate: 20500, amount: 82000 },
            { itemName: 'Imported Marble Countertop', unit: 'sqft', quantity: 60, rate: 1150, amount: 69000 },
            { itemName: 'Chimney Hood 90cm', unit: 'nos', quantity: 1, rate: 32000, amount: 32000 },
            { itemName: 'Built-in Appliances', unit: 'nos', quantity: 1, rate: 62000, amount: 62000 }
          ]
        },
        {
          id: 'v3',
          versionName: 'Vendor B Quote',
          versionNumber: 'VB-Q1',
          type: 'vendor_b',
          totalCost: 612000,
          materialCost: 428400,
          laborCost: 122400,
          overheadCost: 61200,
          profitMargin: 14.0,
          deliveryDays: 40,
          warranty: '3 Years',
          submittedBy: 'Elite Interiors & Kitchens',
          submittedDate: '2025-10-13',
          notes: 'Premium quality, faster delivery, extended warranty',
          items: [
            { itemName: 'Premium Base Cabinet 30" Imported', unit: 'nos', quantity: 5, rate: 31000, amount: 155000 },
            { itemName: 'Designer Wall Cabinet Premium', unit: 'nos', quantity: 4, rate: 24000, amount: 96000 },
            { itemName: 'Italian Marble Premium Grade', unit: 'sqft', quantity: 60, rate: 1250, amount: 75000 },
            { itemName: 'Chimney Hood 90cm Premium', unit: 'nos', quantity: 1, rate: 38000, amount: 38000 },
            { itemName: 'Built-in Oven Premium Brand', unit: 'nos', quantity: 1, rate: 70000, amount: 70000 }
          ]
        },
        {
          id: 'v4',
          versionName: 'Revised Internal',
          versionNumber: 'V1.1',
          type: 'revised',
          totalCost: 565000,
          materialCost: 395500,
          laborCost: 113000,
          overheadCost: 56500,
          profitMargin: 11.5,
          deliveryDays: 42,
          warranty: '2 Years',
          submittedBy: 'Internal Team',
          submittedDate: '2025-10-15',
          notes: 'Optimized costs to match market competition',
          items: [
            { itemName: 'Premium Base Cabinet 30"', unit: 'nos', quantity: 5, rate: 27500, amount: 137500 },
            { itemName: 'Designer Wall Cabinet with LED', unit: 'nos', quantity: 4, rate: 21000, amount: 84000 },
            { itemName: 'Italian Marble Countertop', unit: 'sqft', quantity: 60, rate: 1180, amount: 70800 },
            { itemName: 'Chimney Hood 90cm Auto-Clean', unit: 'nos', quantity: 1, rate: 34000, amount: 34000 },
            { itemName: 'Built-in Oven & Microwave', unit: 'nos', quantity: 1, rate: 63500, amount: 63500 }
          ]
        }
      ]
    }
  ])

  const selectedData = comparisons[0] // For this example, using first comparison

  const getLowestCost = () => {
    return Math.min(...selectedData.versions.map(v => v.totalCost))
  }

  const getHighestCost = () => {
    return Math.max(...selectedData.versions.map(v => v.totalCost))
  }

  const getCostDifference = (cost: number) => {
    const lowest = getLowestCost()
    return ((cost - lowest) / lowest) * 100
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internal':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'vendor_a':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'vendor_b':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'revised':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const lowestCostVersion = selectedData.versions.reduce((prev, current) =>
    prev.totalCost < current.totalCost ? prev : current
  )

  const bestValueVersion = selectedData.versions.reduce((prev, current) => {
    const prevScore = (100 - getCostDifference(prev.totalCost)) + (prev.profitMargin * 2) + (prev.deliveryDays < 45 ? 10 : 0)
    const currentScore = (100 - getCostDifference(current.totalCost)) + (current.profitMargin * 2) + (current.deliveryDays < 45 ? 10 : 0)
    return currentScore > prevScore ? current : prev
  })

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
            <h1 className="text-2xl font-bold text-gray-900">BOQ Comparison</h1>
            <p className="text-sm text-gray-600 mt-1">Compare different BOQ versions and vendor quotes</p>
          </div>
        </div>
      </div>

      {/* Project Name */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <GitCompare className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">{selectedData.projectName}</h2>
            <p className="text-sm text-blue-100 mt-1">Comparing {selectedData.versions.length} versions</p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-900">Lowest Cost</h3>
          </div>
          <p className="text-2xl font-bold text-green-900 mb-1">₹{(getLowestCost() / 100000).toFixed(2)}L</p>
          <p className="text-sm text-green-700">{lowestCostVersion.versionName}</p>
          <p className="text-xs text-green-600 mt-1">{lowestCostVersion.submittedBy}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Best Value</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900 mb-1">₹{(bestValueVersion.totalCost / 100000).toFixed(2)}L</p>
          <p className="text-sm text-blue-700">{bestValueVersion.versionName}</p>
          <p className="text-xs text-blue-600 mt-1">Optimal price-quality balance</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-5 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <Percent className="h-6 w-6 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Cost Range</h3>
          </div>
          <p className="text-2xl font-bold text-orange-900 mb-1">{(((getHighestCost() - getLowestCost()) / getLowestCost()) * 100).toFixed(1)}%</p>
          <p className="text-sm text-orange-700">Price Variation</p>
          <p className="text-xs text-orange-600 mt-1">₹{((getHighestCost() - getLowestCost()) / 1000).toFixed(0)}K difference</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Parameter</th>
                {selectedData.versions.map((version) => (
                  <th key={version.id} className="text-center py-4 px-4 text-sm font-semibold text-gray-700">
                    <div>
                      <p>{version.versionName}</p>
                      <p className="text-xs font-normal text-gray-600 mt-1">{version.versionNumber}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Type */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Type</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(version.type)}`}>
                      {version.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Total Cost */}
              <tr className="border-b border-gray-100 bg-blue-50">
                <td className="py-3 px-4 font-bold text-gray-900">Total Cost</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className={`font-bold ${version.totalCost === getLowestCost() ? 'text-green-600' : 'text-gray-900'}`}>
                      ₹{(version.totalCost / 100000).toFixed(2)}L
                    </p>
                    {version.totalCost !== getLowestCost() && (
                      <p className="text-xs text-red-600 mt-1">
                        +{getCostDifference(version.totalCost).toFixed(1)}%
                      </p>
                    )}
                  </td>
                ))}
              </tr>

              {/* Material Cost */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Material Cost</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className="text-gray-900">₹{(version.materialCost / 100000).toFixed(2)}L</p>
                    <p className="text-xs text-gray-600">{((version.materialCost / version.totalCost) * 100).toFixed(0)}%</p>
                  </td>
                ))}
              </tr>

              {/* Labor Cost */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Labor Cost</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className="text-gray-900">₹{(version.laborCost / 100000).toFixed(2)}L</p>
                    <p className="text-xs text-gray-600">{((version.laborCost / version.totalCost) * 100).toFixed(0)}%</p>
                  </td>
                ))}
              </tr>

              {/* Overhead */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Overhead</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center text-gray-900">
                    ₹{(version.overheadCost / 1000).toFixed(0)}K
                  </td>
                ))}
              </tr>

              {/* Profit Margin */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Profit Margin</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className="font-semibold text-green-600">{version.profitMargin}%</p>
                  </td>
                ))}
              </tr>

              {/* Delivery Days */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Delivery Timeline</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className="text-gray-900">{version.deliveryDays} days</p>
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Warranty</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center text-gray-900">
                    {version.warranty}
                  </td>
                ))}
              </tr>

              {/* Submitted By */}
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">Submitted By</td>
                {selectedData.versions.map((version) => (
                  <td key={version.id} className="py-3 px-4 text-center">
                    <p className="text-sm text-gray-900">{version.submittedBy}</p>
                    <p className="text-xs text-gray-600">{new Date(version.submittedDate).toLocaleDateString('en-IN')}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Item-wise Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Item-wise Rate Comparison</h2>
        <div className="space-y-4">
          {selectedData.versions[0].items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{item.itemName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {selectedData.versions.map((version) => {
                  const versionItem = version.items[index]
                  const rates = selectedData.versions.map(v => v.items[index].rate)
                  const minRate = Math.min(...rates)
                  const isLowest = versionItem.rate === minRate

                  return (
                    <div key={version.id} className={`p-3 rounded-lg border ${isLowest ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <p className="text-xs text-gray-600 mb-1">{version.versionName}</p>
                      <p className={`font-bold ${isLowest ? 'text-green-600' : 'text-gray-900'}`}>
                        ₹{versionItem.rate.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {versionItem.quantity} {versionItem.unit}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-bold text-green-900">Recommended Choice</h3>
          </div>
          <p className="text-lg font-semibold text-green-900 mb-2">{bestValueVersion.versionName}</p>
          <p className="text-sm text-green-700 mb-4">{bestValueVersion.notes}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Cost:</span>
              <span className="font-semibold text-green-900">₹{(bestValueVersion.totalCost / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Delivery:</span>
              <span className="font-semibold text-green-900">{bestValueVersion.deliveryDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Warranty:</span>
              <span className="font-semibold text-green-900">{bestValueVersion.warranty}</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h3 className="font-bold text-orange-900">Key Considerations</h3>
          </div>
          <ul className="space-y-2 text-sm text-orange-800">
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Price difference between lowest and highest: ₹{((getHighestCost() - getLowestCost()) / 1000).toFixed(0)}K</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Delivery timeline varies from {Math.min(...selectedData.versions.map(v => v.deliveryDays))} to {Math.max(...selectedData.versions.map(v => v.deliveryDays))} days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Consider warranty periods when making final decision</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Review vendor reputation and past project experience</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
