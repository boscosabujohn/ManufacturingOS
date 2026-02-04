'use client';

import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

// Types
export type KPIStatus = 'success' | 'warning' | 'critical' | 'neutral' | 'info';
export type KPITrend = 'up' | 'down' | 'neutral';

export interface KPIThreshold {
  warning?: number;
  critical?: number;
  direction?: 'above' | 'below'; // above = value above threshold is bad
}

export interface KPISparklineData {
  value: number;
  label?: string;
}

export interface KPICardProps {
  title: string;
  value: number | string;
  formattedValue?: string;
  previousValue?: number;
  change?: number;
  changeLabel?: string;
  trend?: KPITrend;
  target?: number;
  targetLabel?: string;
  unit?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  sparklineData?: KPISparklineData[];
  threshold?: KPIThreshold;
  status?: KPIStatus;
  onClick?: () => void;
  onDrillThrough?: () => void;
  description?: string;
  lastUpdated?: Date;
  loading?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

// Status configurations
const statusConfig: Record<KPIStatus, { color: string; bgColor: string; icon: React.ReactNode }> = {
  success: {
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  warning: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  critical: {
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  neutral: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    icon: <Minus className="w-4 h-4" />,
  },
  info: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: <Info className="w-4 h-4" />,
  },
};

// Calculate status from threshold
function getStatusFromThreshold(value: number, threshold: KPIThreshold): KPIStatus {
  const { warning, critical, direction = 'above' } = threshold;

  if (direction === 'above') {
    if (critical !== undefined && value >= critical) return 'critical';
    if (warning !== undefined && value >= warning) return 'warning';
    return 'success';
  } else {
    if (critical !== undefined && value <= critical) return 'critical';
    if (warning !== undefined && value <= warning) return 'warning';
    return 'success';
  }
}

// Sparkline component
interface SparklineProps {
  data: KPISparklineData[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showArea?: boolean;
}

function Sparkline({
  data,
  width = 80,
  height = 32,
  color = '#3B82F6',
  fillColor,
  showArea = true,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return '';

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!showArea || data.length < 2) return '';

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`;
  }, [data, width, height, showArea]);

  if (data.length < 2) return null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {showArea && fillColor && (
        <path
          d={areaPath}
          fill={fillColor}
          opacity={0.2}
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={(() => {
            const values = data.map(d => d.value);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min || 1;
            const lastValue = data[data.length - 1].value;
            return 2 + (height - 4) - ((lastValue - min) / range) * (height - 4);
          })()}
          r={2}
          fill={color}
        />
      )}
    </svg>
  );
}

// Main KPI Card component
export function KPICard({
  title,
  value,
  formattedValue,
  previousValue,
  change,
  changeLabel,
  trend,
  target,
  targetLabel,
  unit,
  prefix,
  suffix,
  icon,
  sparklineData,
  threshold,
  status: providedStatus,
  onClick,
  onDrillThrough,
  description,
  lastUpdated,
  loading = false,
  variant = 'default',
  className = '',
}: KPICardProps) {
  // Calculate status from threshold if not provided
  const status = useMemo(() => {
    if (providedStatus) return providedStatus;
    if (threshold && typeof value === 'number') {
      return getStatusFromThreshold(value, threshold);
    }
    return 'neutral';
  }, [providedStatus, threshold, value]);

  // Calculate trend from change
  const calculatedTrend = useMemo(() => {
    if (trend) return trend;
    if (change !== undefined) {
      return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    }
    return 'neutral';
  }, [trend, change]);

  // Format display value
  const displayValue = formattedValue || (
    typeof value === 'number' ? value.toLocaleString() : value
  );

  const config = statusConfig[status];

  const TrendIcon = calculatedTrend === 'up' ? TrendingUp
    : calculatedTrend === 'down' ? TrendingDown
    : Minus;

  const trendColor = calculatedTrend === 'up'
    ? 'text-green-600'
    : calculatedTrend === 'down'
      ? 'text-red-600'
      : 'text-gray-400';

  // Sparkline color based on trend
  const sparklineColor = calculatedTrend === 'up'
    ? '#10B981'
    : calculatedTrend === 'down'
      ? '#EF4444'
      : '#3B82F6';

  if (variant === 'compact') {
    return (
      <div
        className={`p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${
          onClick || onDrillThrough ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700' : ''
        } ${className}`}
        onClick={onClick || onDrillThrough}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{title}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {prefix}{displayValue}{suffix}
            </p>
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <Sparkline data={sparklineData} width={60} height={24} color={sparklineColor} />
          )}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={`p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${
          onClick || onDrillThrough ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all' : ''
        } ${className}`}
        onClick={onClick || onDrillThrough}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {status !== 'neutral' && (
            <div className={`p-1 rounded ${config.bgColor} ${config.color}`}>
              {config.icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {prefix}{displayValue}{suffix}
            </p>
            {unit && <p className="text-sm text-gray-500">{unit}</p>}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <Sparkline
              data={sparklineData}
              width={100}
              height={40}
              color={sparklineColor}
              showArea
            />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
              )}
            </div>
          )}
          {target !== undefined && (
            <div className="text-sm text-gray-500">
              Target: <span className="font-medium">{target.toLocaleString()}</span>
              {targetLabel && <span className="ml-1">{targetLabel}</span>}
            </div>
          )}
          {onDrillThrough && (
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              Details <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-2">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${
        onClick || onDrillThrough ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all' : ''
      } ${className}`}
      onClick={onClick || onDrillThrough}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        </div>
        {status !== 'neutral' && (
          <div className={`${config.color}`} title={status}>
            {config.icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}{displayValue}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-sm">
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <Sparkline data={sparklineData} color={sparklineColor} />
        )}
      </div>

      {target !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Target</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {target.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                typeof value === 'number' && value >= target
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, typeof value === 'number' ? (value / target) * 100 : 0)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// KPI Grid component
interface KPIGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function KPIGrid({ children, columns = 4, className = '' }: KPIGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2 ${className}`}>
      {children}
    </div>
  );
}

export { Sparkline, getStatusFromThreshold };
export type { SparklineProps, KPIGridProps };
