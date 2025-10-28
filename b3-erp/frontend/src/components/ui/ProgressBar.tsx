'use client'

import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'striped'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  className?: string
}

/**
 * ProgressBar - Visual progress indicator
 *
 * @example
 * <ProgressBar
 *   value={75}
 *   label="Project Completion"
 *   showValue
 *   variant="gradient"
 *   color="blue"
 * />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'default',
  color = 'blue',
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600'
  }

  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    green: 'bg-gradient-to-r from-green-500 to-emerald-500',
    yellow: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    red: 'bg-gradient-to-r from-red-500 to-rose-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    indigo: 'bg-gradient-to-r from-indigo-500 to-blue-500'
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`
            h-full transition-all duration-500 ease-out rounded-full
            ${variant === 'gradient' ? gradientClasses[color] : colorClasses[color]}
            ${variant === 'striped' ? 'bg-striped' : ''}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

export interface MultiProgressBarProps {
  segments: Array<{
    value: number
    label: string
    color: ProgressBarProps['color']
  }>
  max?: number
  showLegend?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * MultiProgressBar - Segmented progress bar
 *
 * @example
 * <MultiProgressBar
 *   segments={[
 *     { value: 30, label: 'Open', color: 'blue' },
 *     { value: 50, label: 'In Progress', color: 'yellow' },
 *     { value: 20, label: 'Resolved', color: 'green' }
 *   ]}
 *   showLegend
 * />
 */
export const MultiProgressBar: React.FC<MultiProgressBarProps> = ({
  segments,
  max = 100,
  showLegend = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600'
  }

  const total = segments.reduce((sum, seg) => sum + seg.value, 0)

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden flex`}>
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100

          return (
            <div
              key={index}
              className={`${segment.color ? colorClasses[segment.color] : ''} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
              title={`${segment.label}: ${segment.value}`}
            />
          )
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-3 mt-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${segment.color ? colorClasses[segment.color] : ''}`} />
              <span className="text-sm text-gray-700">
                {segment.label}: <span className="font-semibold">{segment.value}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
