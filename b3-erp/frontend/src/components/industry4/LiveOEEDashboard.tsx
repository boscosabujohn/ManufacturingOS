'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface OEEData {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface OEEGaugeProps {
  data: OEEData;
  label: string;
  variant?: 'availability' | 'performance' | 'quality' | 'oee';
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  animated?: boolean;
}

// ============================================================================
// Gauge Component
// ============================================================================

function CircularGauge({
  value,
  target,
  label,
  color,
  size = 'md',
  trend,
  showTrend = true,
  animated = true,
}: {
  value: number;
  target: number;
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  trend?: 'up' | 'down' | 'stable';
  showTrend?: boolean;
  animated?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  // Animate value changes
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 1000;
    const startTime = performance.now();

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };

    requestAnimationFrame(animateValue);
    prevValueRef.current = value;
  }, [value, animated]);

  const sizes = {
    sm: { width: 120, stroke: 8, fontSize: 'text-lg' },
    md: { width: 160, stroke: 10, fontSize: 'text-2xl' },
    lg: { width: 200, stroke: 12, fontSize: 'text-3xl' },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (displayValue / 100) * circumference;
  const targetProgress = (target / 100) * circumference;

  const getStatusColor = (val: number, tgt: number) => {
    if (val >= tgt) return 'text-green-500';
    if (val >= tgt * 0.9) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = () => {
    if (!showTrend || !trend) return null;
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg className="transform -rotate-90" width={width} height={width}>
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Target indicator */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - targetProgress}
            className="text-gray-300 dark:text-gray-600"
            strokeLinecap="round"
          />

          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{
              filter: displayValue >= target ? 'drop-shadow(0 0 6px currentColor)' : 'none',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-bold ${getStatusColor(displayValue, target)}`}>
            {displayValue.toFixed(1)}%
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Target: {target}%</span>
            {getTrendIcon()}
          </div>
        </div>
      </div>

      <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
}

// ============================================================================
// Live OEE Dashboard Component
// ============================================================================

export interface LiveOEEDashboardProps {
  productionLineId?: string;
  refreshInterval?: number;
  showDetails?: boolean;
  onAlert?: (type: string, value: number) => void;
}

export function LiveOEEDashboard({
  productionLineId = 'line-1',
  refreshInterval = 5000,
  showDetails = true,
  onAlert,
}: LiveOEEDashboardProps) {
  const [oeeData, setOeeData] = useState<OEEData>({
    availability: 0,
    performance: 0,
    quality: 0,
    oee: 0,
    target: 85,
    trend: 'stable',
    lastUpdated: new Date(),
  });
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated WebSocket data fetch
  const fetchOEEData = useCallback(() => {
    // Simulate real-time data with some randomness
    const baseAvailability = 92;
    const basePerformance = 88;
    const baseQuality = 97;

    const newData: OEEData = {
      availability: Math.min(100, Math.max(70, baseAvailability + (Math.random() - 0.5) * 10)),
      performance: Math.min(100, Math.max(65, basePerformance + (Math.random() - 0.5) * 12)),
      quality: Math.min(100, Math.max(85, baseQuality + (Math.random() - 0.5) * 6)),
      oee: 0,
      target: 85,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
      lastUpdated: new Date(),
    };

    // Calculate OEE
    newData.oee = (newData.availability * newData.performance * newData.quality) / 10000;

    // Check for alerts
    if (onAlert) {
      if (newData.availability < 80) onAlert('availability', newData.availability);
      if (newData.performance < 75) onAlert('performance', newData.performance);
      if (newData.quality < 90) onAlert('quality', newData.quality);
      if (newData.oee < newData.target) onAlert('oee', newData.oee);
    }

    setOeeData(newData);
    setIsConnected(true);
    setConnectionStatus('connected');
  }, [onAlert]);

  // Start/stop data fetching
  useEffect(() => {
    setConnectionStatus('connecting');

    // Initial fetch
    setTimeout(() => {
      fetchOEEData();
    }, 500);

    // Set up interval
    intervalRef.current = setInterval(fetchOEEData, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchOEEData, refreshInterval]);

  const getOEEStatus = () => {
    if (oeeData.oee >= oeeData.target) {
      return { label: 'On Target', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    if (oeeData.oee >= oeeData.target * 0.9) {
      return { label: 'Near Target', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
    return { label: 'Below Target', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
  };

  const status = getOEEStatus();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Live OEE Monitor</h2>
              <p className="text-sm text-blue-100">Production Line: {productionLineId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`} />
              <span className="text-xs text-blue-100 capitalize">{connectionStatus}</span>
            </div>

            {/* OEE Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Gauges */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CircularGauge
            value={oeeData.availability}
            target={95}
            label="Availability"
            color="#22c55e"
            size="md"
            trend={oeeData.trend}
          />
          <CircularGauge
            value={oeeData.performance}
            target={90}
            label="Performance"
            color="#3b82f6"
            size="md"
            trend={oeeData.trend}
          />
          <CircularGauge
            value={oeeData.quality}
            target={99}
            label="Quality"
            color="#8b5cf6"
            size="md"
            trend={oeeData.trend}
          />
          <CircularGauge
            value={oeeData.oee}
            target={oeeData.target}
            label="OEE"
            color={oeeData.oee >= oeeData.target ? '#22c55e' : '#ef4444'}
            size="md"
            trend={oeeData.trend}
          />
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium">Uptime</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {((oeeData.availability / 100) * 8).toFixed(1)}h / 8h
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">Cycle Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(60 / (oeeData.performance / 100 * 0.8 + 0.2)).toFixed(1)}s
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Good Parts</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(oeeData.quality * 10)} / {Math.round(100 * 10)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-xs font-medium">Last Update</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {oeeData.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveOEEDashboard;
