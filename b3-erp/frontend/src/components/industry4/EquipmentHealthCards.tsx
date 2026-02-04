'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Thermometer,
  Gauge,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Wrench,
  Calendar,
  BarChart3,
  Heart,
  Shield,
  RefreshCw,
  ChevronRight,
  XCircle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: { min: number; max: number };
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

export interface MaintenancePrediction {
  component: string;
  predictedFailure: Date;
  confidence: number;
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  healthScore: number;
  status: HealthStatus;
  metrics: HealthMetric[];
  predictions: MaintenancePrediction[];
  lastMaintenance: Date;
  nextScheduledMaintenance: Date;
  totalRuntime: number; // hours
  meanTimeBetweenFailures: number; // hours
  reliabilityScore: number;
}

export interface EquipmentHealthCardsProps {
  onEquipmentClick?: (equipment: Equipment) => void;
  onMaintenanceSchedule?: (equipmentId: string, prediction: MaintenancePrediction) => void;
}

// ============================================================================
// Health Status Configuration
// ============================================================================

const healthConfig: Record<HealthStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}> = {
  excellent: {
    label: 'Excellent',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    icon: CheckCircle,
  },
  good: {
    label: 'Good',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    icon: CheckCircle,
  },
  fair: {
    label: 'Fair',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    icon: AlertTriangle,
  },
  poor: {
    label: 'Poor',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    icon: XCircle,
  },
};

// ============================================================================
// Health Score Gauge Component
// ============================================================================

function HealthScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const getColor = () => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#3b82f6';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Heart className="w-5 h-5 text-gray-400 mb-1" />
        <span className="text-2xl font-bold" style={{ color: getColor() }}>
          {score}
        </span>
        <span className="text-xs text-gray-500">Health</span>
      </div>
    </div>
  );
}

// ============================================================================
// Metric Bar Component
// ============================================================================

function MetricBar({ metric }: { metric: HealthMetric }) {
  const Icon = metric.icon;
  const percentage = ((metric.value - metric.min) / (metric.max - metric.min)) * 100;
  const isInOptimal = metric.value >= metric.optimal.min && metric.value <= metric.optimal.max;

  const getBarColor = () => {
    if (isInOptimal) return 'bg-green-500';
    if (metric.value < metric.optimal.min) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity;
  const trendColor = metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-gray-400';

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">{metric.name}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {metric.value.toFixed(1)}{metric.unit}
            </span>
            <TrendIcon className={`w-3 h-3 ${trendColor}`} />
          </div>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Prediction Card Component
// ============================================================================

function PredictionCard({
  prediction,
  onSchedule,
}: {
  prediction: MaintenancePrediction;
  onSchedule?: () => void;
}) {
  const severityConfig = {
    low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  };

  const config = severityConfig[prediction.severity];
  const daysUntilFailure = Math.ceil((prediction.predictedFailure.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`p-3 rounded-lg border ${config.border} ${config.bg}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-sm font-medium ${config.color}`}>{prediction.component}</p>
          <p className="text-xs text-gray-500">
            Predicted failure in {daysUntilFailure} days
          </p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-medium ${config.color} capitalize`}>
            {prediction.severity}
          </span>
          <p className="text-xs text-gray-400">{prediction.confidence}% confidence</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2">{prediction.recommendation}</p>
      <button
        onClick={onSchedule}
        className={`w-full py-1.5 text-xs font-medium rounded ${config.color} hover:opacity-80 transition-opacity border ${config.border}`}
      >
        Schedule Maintenance
      </button>
    </div>
  );
}

// ============================================================================
// Equipment Health Card Component
// ============================================================================

function EquipmentHealthCard({
  equipment,
  onClick,
  onSchedule,
}: {
  equipment: Equipment;
  onClick?: () => void;
  onSchedule?: (prediction: MaintenancePrediction) => void;
}) {
  const config = healthConfig[equipment.status];
  const StatusIcon = config.icon;
  const hasCriticalPrediction = equipment.predictions.some(p => p.severity === 'critical' || p.severity === 'high');

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${config.borderColor}
        overflow-hidden transition-all duration-300 hover:shadow-xl
        ${hasCriticalPrediction ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
      `}
    >
      {/* Header */}
      <div className={`px-4 py-3 ${config.bgColor} border-b ${config.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
              <Cpu className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
              <p className="text-xs text-gray-600">{equipment.type} • {equipment.location}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}>
            <StatusIcon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Health Score and Key Stats */}
        <div className="flex items-center gap-3 mb-2">
          <HealthScoreGauge score={equipment.healthScore} size={100} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Runtime
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {equipment.totalRuntime.toLocaleString()}h
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                MTBF
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {equipment.meanTimeBetweenFailures}h
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Reliability
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {equipment.reliabilityScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3 mb-2">
          {equipment.metrics.slice(0, 4).map((metric, index) => (
            <MetricBar key={index} metric={metric} />
          ))}
        </div>

        {/* Maintenance Schedule */}
        <div className="flex items-center justify-between text-sm mb-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Next Maintenance</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {equipment.nextScheduledMaintenance.toLocaleDateString()}
          </span>
        </div>

        {/* Predictions */}
        {equipment.predictions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Predictive Maintenance Alerts
            </h4>
            {equipment.predictions.slice(0, 2).map((prediction, index) => (
              <PredictionCard
                key={index}
                prediction={prediction}
                onSchedule={() => onSchedule?.(prediction)}
              />
            ))}
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={onClick}
          className="w-full mt-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          View Full Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Equipment Health Cards Component
// ============================================================================

export function EquipmentHealthCards({
  onEquipmentClick,
  onMaintenanceSchedule,
}: EquipmentHealthCardsProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<HealthStatus | 'all'>('all');

  // Generate simulated equipment data
  useEffect(() => {
    const generateEquipment = (): Equipment[] => {
      const types = ['CNC Mill', 'CNC Lathe', 'Press', 'Welder', 'Grinder', 'Assembly Station'];
      const locations = ['Production Hall A', 'Production Hall B', 'Assembly Area', 'Quality Zone'];

      return Array.from({ length: 8 }, (_, i) => {
        const healthScore = Math.floor(40 + Math.random() * 60);
        const status: HealthStatus =
          healthScore >= 90 ? 'excellent' :
          healthScore >= 75 ? 'good' :
          healthScore >= 60 ? 'fair' :
          healthScore >= 40 ? 'poor' : 'critical';

        const predictions: MaintenancePrediction[] = [];
        if (healthScore < 80) {
          predictions.push({
            component: ['Spindle bearing', 'Drive belt', 'Hydraulic pump', 'Motor brushes'][Math.floor(Math.random() * 4)],
            predictedFailure: new Date(Date.now() + (healthScore < 50 ? 7 : 30) * 24 * 60 * 60 * 1000),
            confidence: 70 + Math.floor(Math.random() * 25),
            recommendation: 'Schedule preventive maintenance to avoid unplanned downtime',
            severity: healthScore < 50 ? 'critical' : healthScore < 60 ? 'high' : 'medium',
          });
        }
        if (healthScore < 60) {
          predictions.push({
            component: ['Coolant system', 'Air filter', 'Lubrication system'][Math.floor(Math.random() * 3)],
            predictedFailure: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            confidence: 60 + Math.floor(Math.random() * 30),
            recommendation: 'Inspect and replace worn components',
            severity: 'medium',
          });
        }

        return {
          id: `equip-${i + 1}`,
          name: `${types[i % types.length]} ${String(i + 1).padStart(2, '0')}`,
          type: types[i % types.length],
          location: locations[i % locations.length],
          healthScore,
          status,
          metrics: [
            { name: 'Temperature', value: 45 + Math.random() * 30, unit: '°C', min: 0, max: 100, optimal: { min: 40, max: 70 }, trend: 'stable', icon: Thermometer },
            { name: 'Vibration', value: 1 + Math.random() * 4, unit: 'mm/s', min: 0, max: 10, optimal: { min: 0, max: 3 }, trend: 'up', icon: Activity },
            { name: 'Power Draw', value: 10 + Math.random() * 15, unit: 'kW', min: 0, max: 30, optimal: { min: 8, max: 22 }, trend: 'stable', icon: Zap },
            { name: 'Pressure', value: 150 + Math.random() * 50, unit: 'bar', min: 100, max: 250, optimal: { min: 140, max: 200 }, trend: 'down', icon: Gauge },
          ],
          predictions,
          lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          nextScheduledMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
          totalRuntime: Math.floor(5000 + Math.random() * 15000),
          meanTimeBetweenFailures: Math.floor(500 + Math.random() * 1500),
          reliabilityScore: Math.floor(85 + Math.random() * 15),
        };
      });
    };

    setEquipment(generateEquipment());
    setIsLoading(false);
  }, []);

  // Filter equipment
  const filteredEquipment = equipment.filter(e =>
    filter === 'all' ? true : e.status === filter
  );

  // Count by status
  const statusCounts = equipment.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {} as Record<HealthStatus, number>);

  // Count critical predictions
  const criticalPredictions = equipment.reduce((acc, e) =>
    acc + e.predictions.filter(p => p.severity === 'critical' || p.severity === 'high').length, 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Equipment Health Monitor</h2>
                <p className="text-sm text-emerald-100">Predictive maintenance dashboard</p>
              </div>
            </div>

            {criticalPredictions > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-300" />
                <span className="text-sm font-medium">{criticalPredictions} Critical Alert(s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
              }`}
            >
              All ({equipment.length})
            </button>

            {(Object.keys(healthConfig) as HealthStatus[]).map(status => {
              const count = statusCounts[status] || 0;
              const config = healthConfig[status];
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    filter === status
                      ? `${config.bgColor} ${config.color} border ${config.borderColor}`
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredEquipment.map(equip => (
          <EquipmentHealthCard
            key={equip.id}
            equipment={equip}
            onClick={() => onEquipmentClick?.(equip)}
            onSchedule={(prediction) => onMaintenanceSchedule?.(equip.id, prediction)}
          />
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Cpu className="w-12 h-12 mb-3 text-gray-300" />
          <p>No equipment matches the selected filter</p>
        </div>
      )}
    </div>
  );
}

export default EquipmentHealthCards;
