'use client'

import React from 'react'
import { Loader2, Package, ShoppingCart, FileText, BarChart3, Users } from 'lucide-react'

// ============= Basic Skeleton Components =============
export const SkeletonText: React.FC<{
  width?: string
  height?: string
  className?: string
}> = ({
  width = '100%',
  height = '16px',
  className = ''
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={{ width, height }}
  />
)

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${sizes[size]} ${className}`} />
  )
}

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
    <div className="animate-pulse space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
)

// ============= Loading Spinners =============
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}> = ({
  size = 'md',
  color = 'text-blue-600',
  text
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`animate-spin ${sizes[size]} ${color}`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export const PulseLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  color?: string
}> = ({
  size = 'md',
  color = 'bg-blue-600'
}) => {
  const sizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} ${color} rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// ============= Page Loading States =============
export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-3">
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-4 bg-gray-200 rounded w-96" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
)

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6
}) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-4 border-b">
      <div className="animate-pulse flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-10 w-64 bg-gray-200 rounded-lg" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="animate-pulse h-4 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div className="animate-pulse h-4 bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export const FormSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-3">
    <div className="animate-pulse space-y-3">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="h-12 bg-gray-200 rounded flex-1" />
        <div className="h-12 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
)

// ============= Specialized Loading States =============
export const VendorListSkeleton: React.FC = () => (
  <div className="space-y-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border p-3">
        <div className="animate-pulse flex items-start gap-2">
          <SkeletonAvatar size="lg" />
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-16" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const OrderCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border p-3">
    <div className="animate-pulse space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  </div>
)

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '300px' }) => (
  <div className="bg-white rounded-lg shadow-sm border p-3">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
      <div className="bg-gray-200 rounded" style={{ height }} />
      <div className="flex justify-center mt-4 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ============= Page-Specific Loading States =============
export const ProcurementDashboardLoading: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-3">
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-80" />
              <div className="h-4 bg-gray-200 rounded w-96" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <ChartSkeleton />
          <TableSkeleton rows={6} columns={7} />
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// ============= Loading Overlay Component =============
export const LoadingOverlay: React.FC<{
  isLoading: boolean
  message?: string
  children: React.ReactNode
}> = ({
  isLoading,
  message = 'Loading...',
  children
}) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" text={message} />
        </div>
      </div>
    )}
  </div>
)

// ============= Button Loading State =============
export const LoadingButton: React.FC<{
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}> = ({
  loading = false,
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-3 py-2 text-lg'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
      {children}
    </button>
  )
}

// ============= Content Loading States =============
export const ContentPlaceholder: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}> = ({ icon, title, description, action }) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-gray-100 rounded-full text-gray-400">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-2">{description}</p>
    {action}
  </div>
)