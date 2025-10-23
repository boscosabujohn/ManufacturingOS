'use client'

import { useState } from 'react'
import { ArrowLeft, FileText, Plus, Edit, Trash2, Eye, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TermsTemplate {
  id: string
  name: string
  type: 'general' | 'warranty' | 'return' | 'delivery' | 'payment' | 'custom'
  category: string
  content: string
  status: 'active' | 'draft' | 'archived'
  applicableTo: string[]
  createdDate: string
  lastModified: string
  usageCount: number
}

export default function TermsSettingsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')

  const [templates] = useState<TermsTemplate[]>([
    {
      id: 'TERM-001',
      name: 'Kitchen Products General Terms & Conditions',
      type: 'general',
      category: 'All Kitchen Products',
      content: 'This agreement covers the sale and purchase of kitchen products including sinks, faucets, appliances, cabinets, and accessories. All products are subject to availability and pricing at time of order confirmation. Specifications may change without notice.',
      status: 'active',
      applicableTo: ['All Products', 'All Customers'],
      createdDate: '2024-01-15',
      lastModified: '2025-09-20',
      usageCount: 1245
    },
    {
      id: 'TERM-002',
      name: 'Kitchen Appliances Warranty Terms',
      type: 'warranty',
      category: 'Kitchen Appliances',
      content: 'All kitchen appliances come with manufacturer warranty. Mixer grinders: 2 years motor warranty, 1 year product warranty. Induction cooktops: 1 year comprehensive warranty. Chimney hoods: 1 year on product, 5 years on motor. Warranty void if tampered or damaged by customer.',
      status: 'active',
      applicableTo: ['Kitchen Appliances', 'All Customers'],
      createdDate: '2024-02-10',
      lastModified: '2025-10-01',
      usageCount: 567
    },
    {
      id: 'TERM-003',
      name: 'Kitchen Products Return Policy',
      type: 'return',
      category: 'All Kitchen Products',
      content: 'Returns accepted within 7 days of delivery for manufacturing defects only. Product must be unused and in original packaging. Return shipping costs borne by customer unless product is defective. Refund processed within 7-10 business days. Custom-made products (countertops, cabinets) are non-returnable.',
      status: 'active',
      applicableTo: ['All Products', 'Retail Customers', 'Dealers'],
      createdDate: '2024-01-20',
      lastModified: '2025-08-15',
      usageCount: 892
    },
    {
      id: 'TERM-004',
      name: 'Modular Kitchen Delivery & Installation',
      type: 'delivery',
      category: 'Kitchen Storage',
      content: 'Modular kitchen cabinets delivered and installed by our certified technicians. Installation includes assembly, fitting, and alignment. Customer must ensure site is ready with proper measurements, electrical points, and water connections. Any site modification costs are additional and borne by customer.',
      status: 'active',
      applicableTo: ['Kitchen Storage', 'Kitchen Cabinets', 'Builders', 'Contractors'],
      createdDate: '2024-03-05',
      lastModified: '2025-09-10',
      usageCount: 234
    },
    {
      id: 'TERM-005',
      name: 'Countertop Material & Installation Terms',
      type: 'custom',
      category: 'Countertops',
      content: 'Countertops are custom-made to customer specifications. Final measurements taken on-site after cabinet installation. Granite and quartz slabs are natural materials - color and pattern variations are inherent characteristics. Installation includes cutting, polishing, and sealing. Cutouts for sinks and cooktops included as per approved design.',
      status: 'active',
      applicableTo: ['Countertops', 'All Customers'],
      createdDate: '2024-02-28',
      lastModified: '2025-10-05',
      usageCount: 445
    },
    {
      id: 'TERM-006',
      name: 'Bulk Order Payment Terms - Builders',
      type: 'payment',
      category: 'Builder Segment',
      content: 'For builder projects: 30% advance payment on order confirmation, 40% on delivery, 30% on installation completion. Credit facility available for approved builders with Net 45 payment terms. Delayed payments attract 2% monthly interest. Orders dispatched only after advance payment clearance.',
      status: 'active',
      applicableTo: ['Builders', 'Contractors', 'Bulk Orders'],
      createdDate: '2024-04-15',
      lastModified: '2025-09-25',
      usageCount: 178
    },
    {
      id: 'TERM-007',
      name: 'Kitchen Sink Installation Guidelines',
      type: 'delivery',
      category: 'Kitchen Sinks',
      content: 'Stainless steel sinks supplied with installation kit including drain assembly, clips, and sealant. Installation by customer or their contractor. Undermount sinks require proper cabinet support. Top-mount sinks easier to install. We provide installation manual and video guide. Professional installation available at additional cost.',
      status: 'active',
      applicableTo: ['Kitchen Sinks', 'All Customers'],
      createdDate: '2024-03-20',
      lastModified: '2025-08-30',
      usageCount: 334
    },
    {
      id: 'TERM-008',
      name: 'Cookware Quality & Care Instructions',
      type: 'warranty',
      category: 'Cookware',
      content: 'Non-stick cookware warranty covers coating defects for 6 months from purchase. Pressure cookers have 2-year warranty on gasket and 5-year warranty on body. Proper care required - avoid metal utensils on non-stick, hand wash recommended. Warranty void if used on high flame or overheated.',
      status: 'active',
      applicableTo: ['Cookware', 'All Customers'],
      createdDate: '2024-05-10',
      lastModified: '2025-07-20',
      usageCount: 678
    },
    {
      id: 'TERM-009',
      name: 'Dealer & Distributor Terms',
      type: 'payment',
      category: 'Dealer Segment',
      content: 'Authorized dealers get Net 30 payment terms with approved credit limit. Minimum order quantity applies. Discounts as per dealer agreement. Products dispatched only to registered dealer address. Dealers responsible for end-customer warranty support. Quarterly targets must be met to maintain dealer status.',
      status: 'active',
      applicableTo: ['Dealers', 'Distributors'],
      createdDate: '2024-01-30',
      lastModified: '2025-10-10',
      usageCount: 156
    },
    {
      id: 'TERM-010',
      name: 'Kitchen Faucet Warranty & Maintenance',
      type: 'warranty',
      category: 'Kitchen Faucets',
      content: 'Kitchen faucets have 5-year warranty on cartridge and 10-year warranty on finish (chrome/brass). Warranty covers manufacturing defects only. Not covered: normal wear, water quality damage, improper installation. Annual maintenance recommended for optimal performance. Aerator cleaning required every 3 months.',
      status: 'active',
      applicableTo: ['Kitchen Faucets', 'All Customers'],
      createdDate: '2024-06-01',
      lastModified: '2025-09-15',
      usageCount: 423
    },
    {
      id: 'TERM-011',
      name: 'Institutional Sales Terms - Updated 2025',
      type: 'payment',
      category: 'Institutional Segment',
      content: 'Hospitals, hotels, and institutions: Net 60 payment terms post delivery. Bulk discount applicable. Annual maintenance contract available. Products certified for commercial use. Installation and training included. Dedicated account manager assigned for orders above ₹10L.',
      status: 'draft',
      applicableTo: ['Institutions', 'Hospitals', 'Hotels'],
      createdDate: '2025-10-15',
      lastModified: '2025-10-18',
      usageCount: 0
    },
    {
      id: 'TERM-012',
      name: 'Old Terms - Kitchen Products 2023',
      type: 'general',
      category: 'All Kitchen Products',
      content: 'Previous version of general terms and conditions. Archived for reference only. Not applicable to new orders.',
      status: 'archived',
      applicableTo: ['All Products'],
      createdDate: '2023-01-01',
      lastModified: '2024-01-14',
      usageCount: 2341
    }
  ])

  const termTypes = ['all', 'general', 'warranty', 'return', 'delivery', 'payment', 'custom']

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'warranty':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'return':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivery':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'payment':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'custom':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredTemplates = templates.filter(template =>
    selectedType === 'all' || template.type === selectedType
  )

  const stats = {
    totalTemplates: templates.filter(t => t.status !== 'archived').length,
    activeTemplates: templates.filter(t => t.status === 'active').length,
    draftTemplates: templates.filter(t => t.status === 'draft').length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
            <p className="text-sm text-gray-600 mt-1">Manage sales terms and conditions templates</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Template
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Templates</p>
              <p className="text-3xl font-bold mt-1">{stats.totalTemplates}</p>
              <p className="text-xs text-blue-100 mt-1">Active + Draft</p>
            </div>
            <FileText className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Active</p>
              <p className="text-3xl font-bold mt-1">{stats.activeTemplates}</p>
              <p className="text-xs text-green-100 mt-1">In use</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-100">Draft</p>
              <p className="text-3xl font-bold mt-1">{stats.draftTemplates}</p>
              <p className="text-xs text-yellow-100 mt-1">Pending review</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Usage</p>
              <p className="text-3xl font-bold mt-1">{(stats.totalUsage / 1000).toFixed(1)}K</p>
              <p className="text-xs text-purple-100 mt-1">Times used</p>
            </div>
            <FileText className="h-10 w-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {termTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{template.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                  {template.status.toUpperCase()}
                </span>
              </div>

              {/* Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(template.type)}`}>
                  {template.type.toUpperCase()}
                </span>
              </div>

              {/* Content Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 line-clamp-4">{template.content}</p>
              </div>

              {/* Applicable To */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-medium">Applicable To:</p>
                <div className="flex flex-wrap gap-2">
                  {template.applicableTo.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">{new Date(template.createdDate).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Modified</p>
                  <p className="font-medium text-gray-900">{new Date(template.lastModified).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Usage Count */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 mb-1">Usage Count</p>
                <p className="font-semibold text-blue-900">{template.usageCount.toLocaleString('en-IN')} times</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
