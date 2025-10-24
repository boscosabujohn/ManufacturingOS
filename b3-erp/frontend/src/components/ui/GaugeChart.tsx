'use client'

import React from 'react'

export interface GaugeChartProps {
  value: number
  max?: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'auto'
  showValue?: boolean
  thresholds?: {
    low: number
    medium: number
    high: number
  }
  unit?: string
  className?: string
}

/**
 * GaugeChart - Semicircle gauge chart for KPI display
 *
 * @example
 * <GaugeChart
 *   value={85}
 *   label="Customer Satisfaction"
 *   color="auto"
 *   showValue
 *   unit="%"
 *   thresholds={{ low: 60, medium: 80, high: 90 }}
 * />
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  label,
  size = 'md',
  color = 'auto',
  showValue = true,
  thresholds,
  unit = '',
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  // Auto color based on thresholds
  const getColor = () => {
    if (color !== 'auto') return color

    if (!thresholds) return 'blue'

    if (percentage >= thresholds.high) return 'green'
    if (percentage >= thresholds.medium) return 'yellow'
    if (percentage >= thresholds.low) return 'red'
    return 'red'
  }

  const currentColor = getColor()

  const sizeConfig = {
    sm: { size: 120, strokeWidth: 8, fontSize: 'text-lg' },
    md: { size: 160, strokeWidth: 12, fontSize: 'text-2xl' },
    lg: { size: 200, strokeWidth: 16, fontSize: 'text-3xl' }
  }

  const colorClasses = {
    blue: { stroke: 'stroke-blue-600', text: 'text-blue-600' },
    green: { stroke: 'stroke-green-600', text: 'text-green-600' },
    yellow: { stroke: 'stroke-yellow-600', text: 'text-yellow-600' },
    red: { stroke: 'stroke-red-600', text: 'text-red-600' },
    purple: { stroke: 'stroke-purple-600', text: 'text-purple-600' }
  }

  const config = sizeConfig[size]
  const colors = colorClasses[currentColor]

  const radius = (config.size - config.strokeWidth) / 2
  const circumference = Math.PI * radius // Half circle
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: config.size, height: config.size / 2 + 20 }}>
        <svg
          width={config.size}
          height={config.size / 2 + 20}
          viewBox={`0 0 ${config.size} ${config.size / 2 + 20}`}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <path
            d={`M ${config.strokeWidth / 2},${config.size / 2}
                A ${radius},${radius} 0 0,1 ${config.size - config.strokeWidth / 2},${config.size / 2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d={`M ${config.strokeWidth / 2},${config.size / 2}
                A ${radius},${radius} 0 0,1 ${config.size - config.strokeWidth / 2},${config.size / 2}`}
            fill="none"
            className={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out'
            }}
          />
        </svg>

        {/* Value Display */}
        {showValue && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className={`font-bold ${config.fontSize} ${colors.text}`}>
              {Math.round(percentage)}{unit}
            </span>
          </div>
        )}
      </div>

      {label && (
        <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
      )}

      {thresholds && (
        <div className="flex items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-600" />
            <span className="text-gray-600">≥{thresholds.high}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-600" />
            <span className="text-gray-600">≥{thresholds.medium}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-gray-600">&lt;{thresholds.low}</span>
          </div>
        </div>
      )}
    </div>
  )
}
