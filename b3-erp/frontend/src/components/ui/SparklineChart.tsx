'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface SparklineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  showTrend?: boolean
  showDots?: boolean
  fill?: boolean
  className?: string
}

/**
 * SparklineChart - Micro line chart for trends
 *
 * @example
 * <SparklineChart
 *   data={[10, 15, 13, 18, 25, 30, 28, 35]}
 *   color="blue"
 *   showTrend
 *   fill
 * />
 */
export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 100,
  height = 30,
  color = 'blue',
  showTrend = false,
  showDots = false,
  fill = false,
  className = ''
}) => {
  if (!data || data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y }
  })

  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
  }).join(' ')

  const fillPath = fill
    ? `${pathData} L ${width},${height} L 0,${height} Z`
    : pathData

  const colorClasses = {
    blue: { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)' },
    green: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.1)' },
    yellow: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.1)' },
    red: { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.1)' },
    purple: { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.1)' },
    indigo: { stroke: '#6366F1', fill: 'rgba(99, 102, 241, 0.1)' }
  }

  const colors = colorClasses[color]

  // Calculate trend
  const trend = data[data.length - 1] - data[0]
  const trendPercentage = ((trend / data[0]) * 100).toFixed(1)
  const isPositive = trend > 0

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {fill && (
          <path
            d={fillPath}
            fill={colors.fill}
          />
        )}

        <path
          d={pathData}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showDots && points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill={colors.stroke}
          />
        ))}
      </svg>

      {showTrend && (
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(parseFloat(trendPercentage))}%</span>
        </div>
      )}
    </div>
  )
}
