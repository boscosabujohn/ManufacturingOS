'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Types
export interface TooltipDataItem {
  label: string;
  value: number | string;
  formattedValue?: string;
  color?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface ChartTooltipProps {
  visible: boolean;
  position: TooltipPosition;
  title?: string;
  subtitle?: string;
  items: TooltipDataItem[];
  footer?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
  showPercentage?: boolean;
  total?: number;
  containerRef?: React.RefObject<HTMLElement>;
  offset?: { x: number; y: number };
  className?: string;
}

// Trend indicator component
function TrendIndicator({ value, label }: { value: number; label?: string }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const colorClass = value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <span className={`flex items-center gap-1 text-xs ${colorClass}`}>
      <Icon className="w-3 h-3" />
      {Math.abs(value).toFixed(1)}%
      {label && <span className="text-gray-400 ml-0.5">{label}</span>}
    </span>
  );
}

export function ChartTooltip({
  visible,
  position,
  title,
  subtitle,
  items,
  footer,
  variant = 'default',
  showTrend = true,
  showPercentage = false,
  total,
  containerRef,
  offset = { x: 10, y: 10 },
  className = '',
}: ChartTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position to prevent overflow
  useEffect(() => {
    if (!visible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const container = containerRef?.current || document.body;
    const containerRect = container.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let x = position.x + offset.x;
    let y = position.y + offset.y;

    // Adjust horizontal position
    if (x + tooltipRect.width > containerRect.right) {
      x = position.x - tooltipRect.width - offset.x;
    }
    if (x < containerRect.left) {
      x = containerRect.left + 5;
    }

    // Adjust vertical position
    if (y + tooltipRect.height > containerRect.bottom) {
      y = position.y - tooltipRect.height - offset.y;
    }
    if (y < containerRect.top) {
      y = containerRect.top + 5;
    }

    setAdjustedPosition({ x, y });
  }, [visible, position, offset, containerRef]);

  if (!visible || items.length === 0) return null;

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-50 pointer-events-none transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <div className={`bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl ${
        variant === 'compact' ? 'p-2' : 'p-3'
      }`}>
        {/* Header */}
        {(title || subtitle) && (
          <div className={`${variant === 'compact' ? 'mb-1' : 'mb-2'} ${
            variant === 'detailed' ? 'pb-2 border-b border-gray-700' : ''
          }`}>
            {title && (
              <p className={`font-medium ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
        )}

        {/* Items */}
        <div className={`space-y-${variant === 'compact' ? '0.5' : '1.5'}`}>
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {item.color && (
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <div className="min-w-0">
                  <span className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} truncate block`}>
                    {item.label}
                  </span>
                  {item.sublabel && variant === 'detailed' && (
                    <span className="text-xs text-gray-400">{item.sublabel}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-semibold ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                  {item.formattedValue || (typeof item.value === 'number' ? item.value.toLocaleString() : item.value)}
                </span>

                {showPercentage && total && typeof item.value === 'number' && (
                  <span className="text-xs text-gray-400">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                )}

                {showTrend && item.trend !== undefined && (
                  <TrendIndicator value={item.trend} label={item.trendLabel} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`${variant === 'compact' ? 'mt-1' : 'mt-2'} pt-2 border-t border-gray-700`}>
            <p className="text-xs text-gray-400">{footer}</p>
          </div>
        )}

        {/* Total (if detailed variant) */}
        {variant === 'detailed' && total !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-bold">{total.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Crosshair tooltip for line/area charts
export interface CrosshairTooltipProps {
  visible: boolean;
  position: TooltipPosition;
  xValue: string | number | Date;
  series: {
    name: string;
    value: number;
    color: string;
    active?: boolean;
  }[];
  formatXValue?: (value: string | number | Date) => string;
  formatYValue?: (value: number) => string;
}

export function CrosshairTooltip({
  visible,
  position,
  xValue,
  series,
  formatXValue,
  formatYValue,
}: CrosshairTooltipProps) {
  const formattedX = formatXValue
    ? formatXValue(xValue)
    : xValue instanceof Date
      ? xValue.toLocaleDateString()
      : String(xValue);

  const items: TooltipDataItem[] = series.map(s => ({
    label: s.name,
    value: s.value,
    formattedValue: formatYValue ? formatYValue(s.value) : s.value.toLocaleString(),
    color: s.color,
  }));

  return (
    <ChartTooltip
      visible={visible}
      position={position}
      title={formattedX}
      items={items}
      variant="default"
    />
  );
}

// Status tooltip with indicator
export interface StatusTooltipProps {
  visible: boolean;
  position: TooltipPosition;
  status: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  value?: string | number;
  action?: string;
}

export function StatusTooltip({
  visible,
  position,
  status,
  title,
  message,
  value,
  action,
}: StatusTooltipProps) {
  const statusConfig = {
    success: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500' },
    warning: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-500', bg: 'bg-yellow-500' },
    error: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500' },
    info: { icon: <Info className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500' },
  };

  const config = statusConfig[status];

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x + 10, top: position.y + 10 }}
    >
      <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-3 max-w-xs">
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded ${config.bg} bg-opacity-20 ${config.color}`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{message}</p>
            {value && (
              <p className="text-sm font-semibold mt-1">{value}</p>
            )}
            {action && (
              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                {action} <ArrowRight className="w-3 h-3" />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing tooltip state
export function useChartTooltip<T = unknown>() {
  const [state, setState] = useState<{
    visible: boolean;
    position: TooltipPosition;
    data: T | null;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
    data: null,
  });

  const show = useCallback((position: TooltipPosition, data: T) => {
    setState({ visible: true, position, data });
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));
  }, []);

  const move = useCallback((position: TooltipPosition) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  return {
    ...state,
    show,
    hide,
    move,
  };
}

// Tooltip trigger wrapper
export interface TooltipTriggerProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
}

export function TooltipTrigger({ children, content, delay = 0 }: TooltipTriggerProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  }, [delay]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {visible && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: position.x + 10, top: position.y + 10 }}
        >
          {content}
        </div>
      )}
    </>
  );
}

// TooltipDataItem and TooltipPosition are already exported at their definitions
