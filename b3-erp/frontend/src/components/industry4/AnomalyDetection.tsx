'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Thermometer,
  Gauge,
  Clock,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Shield,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type AnomalyType = 'spike' | 'drop' | 'drift' | 'pattern' | 'threshold';
export type AnomalySeverity = 'critical' | 'warning' | 'info';
export type MetricType = 'temperature' | 'vibration' | 'power' | 'pressure' | 'quality' | 'throughput';

export interface Anomaly {
  id: string;
  metricType: MetricType;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  source: string;
  value: number;
  expectedValue: number;
  deviation: number;
  deviationPercent: number;
  unit: string;
  timestamp: Date;
  description: string;
  acknowledged: boolean;
  autoResolved: boolean;
  historicalData: { time: string; value: number; expected: number }[];
}

export interface AnomalyDetectionProps {
  onAnomalyClick?: (anomaly: Anomaly) => void;
  onAcknowledge?: (anomalyId: string) => void;
  refreshInterval?: number;
}

// ============================================================================
// Configuration
// ============================================================================

const metricConfig: Record<MetricType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}> = {
  temperature: {
    icon: Thermometer,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Temperature',
  },
  vibration: {
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Vibration',
  },
  power: {
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Power',
  },
  pressure: {
    icon: Gauge,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Pressure',
  },
  quality: {
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Quality',
  },
  throughput: {
    icon: TrendingUp,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    label: 'Throughput',
  },
};

const severityConfig: Record<AnomalySeverity, {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  icon: React.ElementType;
}> = {
  critical: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    label: 'Critical',
    icon: XCircle,
  },
  warning: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    label: 'Warning',
    icon: AlertTriangle,
  },
  info: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    label: 'Info',
    icon: Info,
  },
};

const anomalyTypeLabels: Record<AnomalyType, string> = {
  spike: 'Sudden Spike',
  drop: 'Sudden Drop',
  drift: 'Gradual Drift',
  pattern: 'Pattern Anomaly',
  threshold: 'Threshold Breach',
};

// ============================================================================
// Mini Sparkline Component
// ============================================================================

function Sparkline({
  data,
  width = 120,
  height = 40,
  showAnomaly = true,
}: {
  data: { time: string; value: number; expected: number }[];
  width?: number;
  height?: number;
  showAnomaly?: boolean;
}) {
  if (data.length < 2) return null;

  const values = data.map(d => d.value);
  const expected = data.map(d => d.expected);
  const allValues = [...values, ...expected];
  const min = Math.min(...allValues) * 0.95;
  const max = Math.max(...allValues) * 1.05;
  const range = max - min || 1;

  const getY = (val: number) => height - ((val - min) / range) * height;

  const valuePath = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = getY(d.value);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const expectedPath = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = getY(d.expected);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // Find anomaly point (last point with significant deviation)
  const lastPoint = data[data.length - 1];
  const anomalyX = width;
  const anomalyY = getY(lastPoint.value);

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Expected range band */}
      <path
        d={expectedPath}
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.5"
      />

      {/* Value line */}
      <path
        d={valuePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Anomaly indicator */}
      {showAnomaly && (
        <>
          <circle
            cx={anomalyX}
            cy={anomalyY}
            r="6"
            fill="#ef4444"
            className="animate-pulse"
          />
          <circle
            cx={anomalyX}
            cy={anomalyY}
            r="3"
            fill="#fff"
          />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// Anomaly Card Component
// ============================================================================

function AnomalyCard({
  anomaly,
  onAcknowledge,
  onClick,
}: {
  anomaly: Anomaly;
  onAcknowledge?: () => void;
  onClick?: () => void;
}) {
  const metric = metricConfig[anomaly.metricType];
  const severity = severityConfig[anomaly.severity];
  const MetricIcon = metric.icon;
  const SeverityIcon = severity.icon;

  const DeviationIcon = anomaly.deviation > 0 ? ArrowUp : anomaly.deviation < 0 ? ArrowDown : Minus;
  const deviationColor = anomaly.deviation > 0 ? 'text-red-500' : 'text-blue-500';

  const timeSince = () => {
    const seconds = Math.floor((Date.now() - anomaly.timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div
      className={`
        relative p-3 rounded-xl border-2 ${severity.borderColor} ${severity.bgColor}
        transition-all duration-300 hover:shadow-lg
        ${anomaly.acknowledged ? 'opacity-60' : ''}
        ${anomaly.autoResolved ? 'border-green-500 bg-green-50' : ''}
      `}
    >
      {/* Pulse indicator for critical */}
      {anomaly.severity === 'critical' && !anomaly.acknowledged && (
        <div className="absolute top-2 right-2">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Metric Icon */}
        <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center flex-shrink-0`}>
          <MetricIcon className={`w-6 h-6 ${metric.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severity.bgColor} ${severity.color} border ${severity.borderColor}`}>
              <SeverityIcon className="w-3 h-3 inline mr-1" />
              {severity.label}
            </span>
            <span className="text-xs text-gray-500">{anomalyTypeLabels[anomaly.anomalyType]}</span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white">{metric.label} Anomaly</h3>
          <p className="text-sm text-gray-500">{anomaly.source}</p>

          {/* Values */}
          <div className="mt-2 flex items-center gap-2">
            <div>
              <p className="text-xs text-gray-500">Current</p>
              <p className="text-lg font-bold text-gray-900">{anomaly.value.toFixed(1)}{anomaly.unit}</p>
            </div>
            <div className={`flex items-center gap-1 ${deviationColor}`}>
              <DeviationIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviationPercent.toFixed(1)}%
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expected</p>
              <p className="text-sm font-medium text-gray-600">{anomaly.expectedValue.toFixed(1)}{anomaly.unit}</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{anomaly.description}</p>
        </div>

        {/* Sparkline */}
        <div className="flex-shrink-0">
          <Sparkline
            data={anomaly.historicalData}
            width={100}
            height={40}
            showAnomaly={!anomaly.autoResolved}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {timeSince()}
        </span>

        <div className="flex items-center gap-2">
          {anomaly.autoResolved ? (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Auto-resolved
            </span>
          ) : !anomaly.acknowledged ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge?.();
              }}
              className="px-3 py-1 text-xs font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Acknowledge
            </button>
          ) : (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Acknowledged
            </span>
          )}

          <button
            onClick={onClick}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Summary Stats Component
// ============================================================================

function SummaryStats({ anomalies }: { anomalies: Anomaly[] }) {
  const critical = anomalies.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warning = anomalies.filter(a => a.severity === 'warning' && !a.acknowledged).length;
  const autoResolved = anomalies.filter(a => a.autoResolved).length;
  const total = anomalies.length;

  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
        <p className="text-xs text-gray-500">Total Detected</p>
      </div>
      <div className="text-center p-3 bg-red-50 rounded-lg">
        <p className="text-2xl font-bold text-red-600">{critical}</p>
        <p className="text-xs text-red-600">Critical</p>
      </div>
      <div className="text-center p-3 bg-yellow-50 rounded-lg">
        <p className="text-2xl font-bold text-yellow-600">{warning}</p>
        <p className="text-xs text-yellow-600">Warnings</p>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <p className="text-2xl font-bold text-green-600">{autoResolved}</p>
        <p className="text-xs text-green-600">Auto-Resolved</p>
      </div>
    </div>
  );
}

// ============================================================================
// Anomaly Detection Component
// ============================================================================

export function AnomalyDetection({
  onAnomalyClick,
  onAcknowledge,
  refreshInterval = 5000,
}: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filter, setFilter] = useState<AnomalySeverity | 'all'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Generate historical data
  const generateHistoricalData = (baseValue: number, anomalyValue: number) => {
    const data: { time: string; value: number; expected: number }[] = [];
    for (let i = 9; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const noise = (Math.random() - 0.5) * baseValue * 0.1;
      data.push({
        time,
        value: i === 0 ? anomalyValue : baseValue + noise,
        expected: baseValue,
      });
    }
    return data;
  };

  // Generate anomalies
  const generateAnomalies = useCallback((): Anomaly[] => {
    const types: MetricType[] = ['temperature', 'vibration', 'power', 'pressure', 'quality', 'throughput'];
    const anomalyTypes: AnomalyType[] = ['spike', 'drop', 'drift', 'threshold'];
    const sources = ['CNC Mill #1', 'CNC Mill #2', 'Press Line A', 'Assembly Station 3', 'Conveyor Belt 2'];

    return Array.from({ length: 6 }, (_, i) => {
      const metricType = types[i % types.length];
      const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
      const severity: AnomalySeverity = i < 2 ? 'critical' : i < 4 ? 'warning' : 'info';

      const baseValues: Record<MetricType, { value: number; unit: string }> = {
        temperature: { value: 65, unit: '°C' },
        vibration: { value: 2.5, unit: 'mm/s' },
        power: { value: 18, unit: 'kW' },
        pressure: { value: 180, unit: 'bar' },
        quality: { value: 98, unit: '%' },
        throughput: { value: 120, unit: '/hr' },
      };

      const base = baseValues[metricType];
      const deviation = (anomalyType === 'spike' || anomalyType === 'drift')
        ? base.value * (0.2 + Math.random() * 0.3)
        : -base.value * (0.2 + Math.random() * 0.3);

      const value = base.value + deviation;
      const deviationPercent = (deviation / base.value) * 100;

      return {
        id: `anomaly-${i + 1}`,
        metricType,
        anomalyType,
        severity,
        source: sources[Math.floor(Math.random() * sources.length)],
        value,
        expectedValue: base.value,
        deviation,
        deviationPercent,
        unit: base.unit,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        description: `Detected ${anomalyType} anomaly: ${metricType} is ${Math.abs(deviationPercent).toFixed(1)}% ${deviation > 0 ? 'above' : 'below'} expected range.`,
        acknowledged: Math.random() > 0.7,
        autoResolved: Math.random() > 0.85,
        historicalData: generateHistoricalData(base.value, value),
      };
    });
  }, []);

  // Initialize
  useEffect(() => {
    setAnomalies(generateAnomalies());
    setIsLoading(false);
  }, [generateAnomalies]);

  // Simulate new anomalies
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setAnomalies(prev => {
          const newAnomalies = generateAnomalies().slice(0, 1);
          return [...newAnomalies, ...prev].slice(0, 10);
        });
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, generateAnomalies]);

  // Handle acknowledge
  const handleAcknowledge = (anomalyId: string) => {
    setAnomalies(prev => prev.map(a =>
      a.id === anomalyId ? { ...a, acknowledged: true } : a
    ));
    onAcknowledge?.(anomalyId);
  };

  // Filter anomalies
  const filteredAnomalies = anomalies.filter(a => {
    const matchesSeverity = filter === 'all' || a.severity === filter;
    const matchesAcknowledged = showAcknowledged || !a.acknowledged;
    return matchesSeverity && matchesAcknowledged;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Anomaly Detection</h2>
              <p className="text-sm text-red-100">Real-time metric deviation alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={soundEnabled ? 'Mute alerts' : 'Enable sounds'}
            >
              {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowAcknowledged(!showAcknowledged)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={showAcknowledged ? 'Hide acknowledged' : 'Show all'}
            >
              {showAcknowledged ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary Stats */}
        <SummaryStats anomalies={anomalies} />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {(Object.keys(severityConfig) as AnomalySeverity[]).map(severity => {
            const config = severityConfig[severity];
            return (
              <button
                key={severity}
                onClick={() => setFilter(severity)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === severity
                    ? `${config.bgColor} ${config.color} border ${config.borderColor}`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Anomaly List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredAnomalies.map(anomaly => (
            <AnomalyCard
              key={anomaly.id}
              anomaly={anomaly}
              onAcknowledge={() => handleAcknowledge(anomaly.id)}
              onClick={() => onAnomalyClick?.(anomaly)}
            />
          ))}

          {filteredAnomalies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mb-3 text-green-400" />
              <p className="font-medium">All Clear!</p>
              <p className="text-sm">No anomalies detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnomalyDetection;
