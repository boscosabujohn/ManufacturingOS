'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, Edit, Percent, FileText, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TaxRate {
  id: string
  name: string
  taxType: 'GST' | 'IGST' | 'CGST+SGST' | 'VAT' | 'Custom'
  rate: number
  cgstRate?: number
  sgstRate?: number
  igstRate?: number
  hsnCode?: string
  sacCode?: string
  category: string
  applicableProducts: string[]
  description: string
  status: 'active' | 'inactive'
  effectiveDate: string
  usageCount: number
}

export default function TaxSettingsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')

  const [taxRates] = useState<TaxRate[]>([
    {
      id: 'TAX-001',
      name: 'GST 18% - Kitchen Appliances',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '8516',
      category: 'Kitchen Appliances',
      applicableProducts: ['Mixer Grinders', 'Induction Cooktops', 'Kitchen Appliances'],
      description: 'GST rate for electric kitchen appliances under HSN 8516. Includes mixer grinders, induction cooktops, and other electric appliances.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 1567
    },
    {
      id: 'TAX-002',
      name: 'GST 18% - Kitchen Sinks',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '7324',
      category: 'Kitchen Sinks',
      applicableProducts: ['Stainless Steel Sinks', 'Kitchen Sinks', 'All Sink Types'],
      description: 'GST for sanitary ware including kitchen sinks made of stainless steel, iron, or steel (HSN 7324).',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 2345
    },
    {
      id: 'TAX-003',
      name: 'GST 18% - Kitchen Faucets',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '8481',
      category: 'Kitchen Faucets',
      applicableProducts: ['Kitchen Faucets', 'Taps', 'Faucet Accessories'],
      description: 'GST on taps, cocks, valves and similar appliances (HSN 8481). Includes kitchen faucets in all materials.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 1234
    },
    {
      id: 'TAX-004',
      name: 'GST 12% - Cookware',
      taxType: 'CGST+SGST',
      rate: 12,
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      hsnCode: '7615',
      category: 'Cookware',
      applicableProducts: ['Cookware', 'Utensils', 'Pressure Cookers', 'Pots & Pans'],
      description: 'Reduced GST rate for aluminum cookware and utensils (HSN 7615). Includes pressure cookers, non-stick pans, and other cooking vessels.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 3456
    },
    {
      id: 'TAX-005',
      name: 'GST 18% - Modular Kitchen Cabinets',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '9403',
      category: 'Kitchen Storage',
      applicableProducts: ['Kitchen Cabinets', 'Modular Kitchen', 'Storage Units'],
      description: 'GST for furniture including modular kitchen cabinets and storage units (HSN 9403).',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 892
    },
    {
      id: 'TAX-006',
      name: 'GST 28% - Chimney Hoods',
      taxType: 'CGST+SGST',
      rate: 28,
      cgstRate: 14,
      sgstRate: 14,
      igstRate: 28,
      hsnCode: '8414',
      category: 'Kitchen Ventilation',
      applicableProducts: ['Chimney Hoods', 'Kitchen Exhaust Fans', 'Ventilation Systems'],
      description: 'Higher GST slab for luxury and comfort items including kitchen chimneys and exhaust systems (HSN 8414).',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 456
    },
    {
      id: 'TAX-007',
      name: 'GST 18% - Granite Countertops',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '6802',
      category: 'Countertops',
      applicableProducts: ['Granite Countertops', 'Marble Slabs', 'Stone Work'],
      description: 'GST on worked monumental or building stone (HSN 6802). Includes granite and marble countertops.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 678
    },
    {
      id: 'TAX-008',
      name: 'GST 18% - Quartz Countertops',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      hsnCode: '6810',
      category: 'Countertops',
      applicableProducts: ['Quartz Countertops', 'Engineered Stone', 'Composite Stone'],
      description: 'GST for articles of cement, concrete or artificial stone (HSN 6810). Includes quartz and engineered stone countertops.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 534
    },
    {
      id: 'TAX-009',
      name: 'GST 12% - Kitchen Accessories',
      taxType: 'CGST+SGST',
      rate: 12,
      cgstRate: 6,
      sgstRate: 6,
      igstRate: 12,
      hsnCode: '7323',
      category: 'Kitchen Accessories',
      applicableProducts: ['Kitchen Organizers', 'Baskets', 'Dish Drainers', 'Accessories'],
      description: 'GST on table, kitchen or other household articles of iron or steel (HSN 7323). Includes organizers, racks, and accessories.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 2134
    },
    {
      id: 'TAX-010',
      name: 'Installation Services - GST 18%',
      taxType: 'CGST+SGST',
      rate: 18,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      sacCode: '995439',
      category: 'Services',
      applicableProducts: ['Installation Services', 'Fitting Services', 'Assembly Services'],
      description: 'GST on installation, fitting and assembly services (SAC 995439). Applicable for modular kitchen and appliance installation.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 789
    },
    {
      id: 'TAX-011',
      name: 'IGST 18% - Interstate Sales',
      taxType: 'IGST',
      rate: 18,
      igstRate: 18,
      category: 'Interstate',
      applicableProducts: ['All Products'],
      description: 'Integrated GST for interstate transactions. Applicable when supplier and buyer are in different states.',
      status: 'active',
      effectiveDate: '2017-07-01',
      usageCount: 4567
    },
    {
      id: 'TAX-012',
      name: 'GST 5% - Essential Items (Historical)',
      taxType: 'CGST+SGST',
      rate: 5,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 5,
      hsnCode: '7323',
      category: 'Basic Items',
      applicableProducts: ['Basic Utensils', 'Simple Cookware'],
      description: 'Historical tax rate. Now mostly replaced by 12% rate. Kept for reference.',
      status: 'inactive',
      effectiveDate: '2017-07-01',
      usageCount: 1234
    }
  ])

  const taxTypes = ['all', 'GST', 'IGST', 'CGST+SGST', 'VAT', 'Custom']

  const getTaxTypeColor = (type: string) => {
    switch (type) {
      case 'GST':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'IGST':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'CGST+SGST':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'VAT':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Custom':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRateColor = (rate: number) => {
    if (rate <= 5) return 'bg-green-100 text-green-700'
    if (rate <= 12) return 'bg-blue-100 text-blue-700'
    if (rate <= 18) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  const filteredRates = taxRates.filter(rate =>
    selectedType === 'all' || rate.taxType === selectedType
  )

  const stats = {
    totalRates: taxRates.filter(t => t.status === 'active').length,
    avgRate: taxRates.filter(t => t.status === 'active').reduce((sum, t) => sum + t.rate, 0) / taxRates.filter(t => t.status === 'active').length,
    totalUsage: taxRates.reduce((sum, t) => sum + t.usageCount, 0),
    hsnCodes: taxRates.filter(t => t.hsnCode && t.status === 'active').length
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Tax Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Configure GST and tax rates for kitchen products</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Tax Rate
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Active Tax Rates</p>
              <p className="text-3xl font-bold mt-1">{stats.totalRates}</p>
              <p className="text-xs text-blue-100 mt-1">Configured rates</p>
            </div>
            <Percent className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Avg Tax Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.avgRate.toFixed(1)}%</p>
              <p className="text-xs text-green-100 mt-1">Weighted average</p>
            </div>
            <FileText className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">HSN Codes</p>
              <p className="text-3xl font-bold mt-1">{stats.hsnCodes}</p>
              <p className="text-xs text-purple-100 mt-1">Unique codes</p>
            </div>
            <Package className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100">Total Usage</p>
              <p className="text-3xl font-bold mt-1">{(stats.totalUsage / 1000).toFixed(1)}K</p>
              <p className="text-xs text-orange-100 mt-1">Times applied</p>
            </div>
            <CheckCircle className="h-10 w-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Tax Type Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {taxTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Tax Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Tax Rates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRates.map((taxRate) => (
          <div key={taxRate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{taxRate.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTaxTypeColor(taxRate.taxType)}`}>
                      {taxRate.taxType}
                    </span>
                    {taxRate.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getRateColor(taxRate.rate)}`}>
                  <p className="text-2xl font-bold">{taxRate.rate}%</p>
                </div>
              </div>

              {/* HSN/SAC Code */}
              {(taxRate.hsnCode || taxRate.sacCode) && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-700 mb-1">{taxRate.hsnCode ? 'HSN Code' : 'SAC Code'}</p>
                      <p className="font-mono font-semibold text-indigo-900">{taxRate.hsnCode || taxRate.sacCode}</p>
                    </div>
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              )}

              {/* Tax Breakdown (for CGST+SGST) */}
              {taxRate.taxType === 'CGST+SGST' && taxRate.cgstRate && taxRate.sgstRate && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200 text-center">
                    <p className="text-xs text-green-700">CGST</p>
                    <p className="font-semibold text-green-900">{taxRate.cgstRate}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200 text-center">
                    <p className="text-xs text-green-700">SGST</p>
                    <p className="font-semibold text-green-900">{taxRate.sgstRate}%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 border border-purple-200 text-center">
                    <p className="text-xs text-purple-700">IGST</p>
                    <p className="font-semibold text-purple-900">{taxRate.igstRate}%</p>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">Product Category:</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Package className="h-3 w-3" />
                  {taxRate.category}
                </span>
              </div>

              {/* Description */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{taxRate.description}</p>
              </div>

              {/* Applicable Products */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">Applicable To:</p>
                <div className="flex flex-wrap gap-2">
                  {taxRate.applicableProducts.map((product, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Effective Date & Usage */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Effective Date</p>
                  <p className="font-semibold text-blue-900">{new Date(taxRate.effectiveDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs text-orange-700 mb-1">Usage Count</p>
                  <p className="font-semibold text-orange-900">{taxRate.usageCount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className={`flex-1 px-4 py-2 rounded-lg ${
                  taxRate.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {taxRate.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRates.length === 0 && (
        <div className="text-center py-12">
          <Percent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tax rates found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
