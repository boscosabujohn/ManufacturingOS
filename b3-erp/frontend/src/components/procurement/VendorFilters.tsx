'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  MapPin,
  Building2,
  Star
} from 'lucide-react'

interface VendorFiltersProps {
  onFiltersChange: (filters: any) => void
  onSearchChange: (search: string) => void
  categories: string[]
  countries: string[]
  totalCount: number
}

export default function VendorFilters({
  onFiltersChange,
  onSearchChange,
  categories,
  countries,
  totalCount
}: VendorFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    rating: 'all',
    performance: 'all',
    country: 'all',
    paymentTerms: 'all',
    spendRange: 'all',
    registrationDate: 'all'
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Count active filters
    const count = Object.values(newFilters).filter(v => v !== 'all').length
    setActiveFiltersCount(count)

    onFiltersChange(newFilters)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const resetFilters = () => {
    const resetFilters = {
      status: 'all',
      category: 'all',
      rating: 'all',
      performance: 'all',
      country: 'all',
      paymentTerms: 'all',
      spendRange: 'all',
      registrationDate: 'all'
    }
    setFilters(resetFilters)
    setActiveFiltersCount(0)
    onFiltersChange(resetFilters)
  }

  const quickFilters = [
    { label: 'Top Rated', icon: Star, action: () => handleFilterChange('rating', 'top') },
    { label: 'High Spend', icon: DollarSign, action: () => handleFilterChange('spendRange', 'high') },
    { label: 'New Vendors', icon: Calendar, action: () => handleFilterChange('registrationDate', 'recent') },
    { label: 'Best Performance', icon: TrendingUp, action: () => handleFilterChange('performance', 'excellent') }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Main Search Bar */}
      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor name, code, contact person, email, or location..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
            isAdvancedOpen ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 mb-4">
        {quickFilters.map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.label}
              onClick={filter.action}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="border-t pt-4 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="top">4.5+ ⭐ Top Rated</option>
              <option value="good">4.0+ ⭐ Good</option>
              <option value="average">3.5+ ⭐ Average</option>
              <option value="below">Below 3.5 ⭐</option>
            </select>
          </div>

          {/* Performance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
            <select
              value={filters.performance}
              onChange={(e) => handleFilterChange('performance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Performance</option>
              <option value="excellent">Excellent (90%+)</option>
              <option value="good">Good (80-90%)</option>
              <option value="average">Average (70-80%)</option>
              <option value="poor">Poor (&lt;70%)</option>
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Payment Terms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
            <select
              value={filters.paymentTerms}
              onChange={(e) => handleFilterChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Terms</option>
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net45">Net 45</option>
              <option value="net60">Net 60</option>
              <option value="immediate">Immediate</option>
            </select>
          </div>

          {/* Spend Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Spend</label>
            <select
              value={filters.spendRange}
              onChange={(e) => handleFilterChange('spendRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Ranges</option>
              <option value="high">$1M+ High Value</option>
              <option value="medium">$100K-$1M Medium</option>
              <option value="low">$10K-$100K Low</option>
              <option value="minimal">&lt;$10K Minimal</option>
            </select>
          </div>

          {/* Registration Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration</label>
            <select
              value={filters.registrationDate}
              onChange={(e) => handleFilterChange('registrationDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="recent">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">This Year</option>
              <option value="lastyear">Last Year</option>
              <option value="older">Older</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{totalCount}</span> vendors
          {activeFiltersCount > 0 && (
            <span> with <span className="font-semibold text-blue-600">{activeFiltersCount} filters</span> applied</span>
          )}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Award className="h-4 w-4" />
            Vendor Comparison
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <MapPin className="h-4 w-4" />
            Map View
          </button>
        </div>
      </div>
    </div>
  )
}