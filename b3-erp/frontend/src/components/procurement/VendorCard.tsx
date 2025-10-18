'use client'

import { useState } from 'react'
import {
  Building2,
  Star,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Award
} from 'lucide-react'

interface VendorCardProps {
  vendor: {
    id: string
    vendorCode: string
    vendorName: string
    contactPerson: string
    email: string
    phone: string
    category: string
    rating: number
    status: 'active' | 'inactive' | 'blacklisted' | 'pending_approval'
    totalOrders: number
    totalSpend: number
    onTimeDelivery: number
    qualityScore: number
    paymentTerms: string
    address: string
    city: string
    country: string
    registeredDate: string
    lastOrderDate: string
    tags?: string[]
    certifications?: string[]
    responseTime?: number
    disputeRate?: number
  }
  viewMode: 'grid' | 'list'
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCompare?: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export default function VendorCard({
  vendor,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onCompare,
  isSelected = false,
  onSelect
}: VendorCardProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      blacklisted: 'bg-red-100 text-red-700 border-red-200',
      pending_approval: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getPerformanceIndicator = (score: number) => {
    if (score >= 90) return { color: 'text-green-600', icon: TrendingUp, label: 'Excellent' }
    if (score >= 75) return { color: 'text-blue-600', icon: CheckCircle, label: 'Good' }
    if (score >= 60) return { color: 'text-yellow-600', icon: Clock, label: 'Average' }
    return { color: 'text-red-600', icon: AlertCircle, label: 'Poor' }
  }

  const performanceScore = (vendor.onTimeDelivery + vendor.qualityScore) / 2
  const performance = getPerformanceIndicator(performanceScore)

  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-lg border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} hover:shadow-md transition-all p-4`}>
        <div className="flex items-center gap-4">
          {/* Selection Checkbox */}
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(vendor.id)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          )}

          {/* Vendor Avatar */}
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          {/* Main Info */}
          <div className="flex-1 grid grid-cols-6 gap-4 items-center">
            {/* Vendor Details */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{vendor.vendorName}</h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{vendor.vendorCode} • {vendor.category}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {vendor.city}, {vendor.country}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {vendor.email}
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="col-span-2 flex items-center gap-6">
              {/* Rating */}
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star className={`h-5 w-5 ${getRatingColor(vendor.rating)} fill-current`} />
                  <span className={`text-lg font-bold ${getRatingColor(vendor.rating)}`}>
                    {vendor.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Rating</p>
              </div>

              {/* On-Time Delivery */}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{vendor.onTimeDelivery}%</p>
                <p className="text-xs text-gray-500">On-Time</p>
              </div>

              {/* Quality Score */}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{vendor.qualityScore}%</p>
                <p className="text-xs text-gray-500">Quality</p>
              </div>

              {/* Performance Badge */}
              <div className={`flex items-center gap-1 ${performance.color}`}>
                <performance.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{performance.label}</span>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">${(vendor.totalSpend / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500">Total Spend</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{vendor.totalOrders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => onView(vendor.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(vendor.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              {onCompare && (
                <button
                  onClick={() => onCompare(vendor.id)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Compare"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(vendor.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className={`bg-white rounded-xl border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} hover:shadow-lg transition-all overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(vendor.id)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
              />
            )}
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{vendor.vendorName}</h3>
              <p className="text-sm text-gray-500">{vendor.vendorCode}</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(vendor.status)} mt-1`}>
                {vendor.status}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onView(vendor.id)
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(vendor.id)
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="h-4 w-4" />
                  Edit Vendor
                </button>
                {onCompare && (
                  <button
                    onClick={() => {
                      onCompare(vendor.id)
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Compare
                  </button>
                )}
                <div className="border-t my-1"></div>
                <button
                  onClick={() => {
                    onDelete(vendor.id)
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Rating and Performance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className={`h-5 w-5 ${getRatingColor(vendor.rating)} fill-current`} />
            <span className={`text-lg font-bold ${getRatingColor(vendor.rating)}`}>
              {vendor.rating.toFixed(1)}
            </span>
          </div>
          <div className={`flex items-center gap-1 ${performance.color}`}>
            <performance.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{performance.label}</span>
          </div>
        </div>

        {/* Category and Location */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Category</span>
            <span className="font-medium text-gray-900">{vendor.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Location</span>
            <span className="font-medium text-gray-900">{vendor.city}, {vendor.country}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Contact</span>
            <span className="font-medium text-gray-900">{vendor.contactPerson}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{vendor.onTimeDelivery}%</p>
            <p className="text-xs text-gray-500">On-Time</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{vendor.qualityScore}%</p>
            <p className="text-xs text-gray-500">Quality</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-green-700">${(vendor.totalSpend / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Total Spend</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{vendor.totalOrders}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
        </div>

        {/* Tags */}
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-3 border-t">
            {vendor.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Certifications */}
        {vendor.certifications && vendor.certifications.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Award className="h-3.5 w-3.5 text-yellow-600" />
            {vendor.certifications.join(', ')}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Since {new Date(vendor.registeredDate).getFullYear()}
        </span>
        <span className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          Last order: {vendor.lastOrderDate}
        </span>
      </div>
    </div>
  )
}