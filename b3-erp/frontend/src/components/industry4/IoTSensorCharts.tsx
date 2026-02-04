'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Thermometer,
  Activity,
  Zap,
  Gauge,
  Waves,
  Battery,
  Droplets,
  Wind,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SensorReading {
  timestamp: Date;
  value: number;
}

export interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'vibration' | 'power' | 'pressure' | 'humidity' | 'airflow';
  unit: string;
  currentValue: number;
  readings: SensorReading[];
  minThreshold: number;
  maxThreshold: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export interface IoTSensorChartsProps {
  machineId?: string;
  refreshInterval?: number;
  maxDataPoints?: number;
  onThresholdAlert?: (sensor: SensorData) => void;
}

// ============================================================================
// Sensor Configuration
// ============================================================================

const sensorConfig: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}> = {
  temperature: {
    icon: Thermometer,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    gradientFrom: '#ef4444',
    gradientTo: '#fca5a5',
  },
  vibration: {
    icon: Activity,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    gradientFrom: '#8b5cf6',
    gradientTo: '#c4b5fd',
  },
  power: {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    gradientFrom: '#eab308',
    gradientTo: '#fde047',
  },
  pressure: {
    icon: Gauge,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    gradientFrom: '#3b82f6',
    gradientTo: '#93c5fd',
  },
  humidity: {
    icon: Droplets,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
    gradientFrom: '#06b6d4',
    gradientTo: '#67e8f9',
  },
  airflow: {
    icon: Wind,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    gradientFrom: '#22c55e',
    gradientTo: '#86efac',
  },
};

// ============================================================================
// Mini Line Chart Component
// ============================================================================

function MiniLineChart({
  data,
  width = 200,
  height = 60,
  color,
  minThreshold,
  maxThreshold,
}: {
  data: SensorReading[];
  width?: number;
  height?: number;
  color: string;
  minThreshold?: number;
  maxThreshold?: number;
}) {
  if (data.length < 2) return null;

  const values = data.map(d => d.value);
  const min = Math.min(...values, minThreshold || Infinity) * 0.95;
  const max = Math.max(...values, maxThreshold || -Infinity) * 1.05;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create area path
  const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;

  // Threshold lines
  const minThresholdY = minThreshold ? height - ((minThreshold - min) / range) * height : null;
  const maxThresholdY = maxThreshold ? height - ((maxThreshold - min) / range) * height : null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />

      {/* Threshold lines */}
      {minThresholdY && minThresholdY >= 0 && minThresholdY <= height && (
        <line
          x1="0"
          y1={minThresholdY}
          x2={width}
          y2={minThresholdY}
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />
      )}
      {maxThresholdY && maxThresholdY >= 0 && maxThresholdY <= height && (
        <line
          x1="0"
          y1={maxThresholdY}
          x2={width}
          y2={maxThresholdY}
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />
      )}

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current value dot */}
      <circle
        cx={width}
        cy={height - ((values[values.length - 1] - min) / range) * height}
        r="4"
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
}

// ============================================================================
// Sensor Card Component
// ============================================================================

function SensorCard({
  sensor,
  onAlertClick,
}: {
  sensor: SensorData;
  onAlertClick?: () => void;
}) {
  const config = sensorConfig[sensor.type];
  const Icon = config.icon;

  const getStatusColor = () => {
    switch (sensor.status) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getTrendIcon = () => {
    switch (sensor.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${getStatusColor()}`}>
      {/* Alert indicator */}
      {sensor.status !== 'normal' && (
        <button
          onClick={onAlertClick}
          className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition-colors"
        >
          <AlertTriangle className={`w-5 h-5 ${sensor.status === 'critical' ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{sensor.name}</h4>
          <p className="text-xs text-gray-500 capitalize">{sensor.type}</p>
        </div>
      </div>

      {/* Current Value */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {sensor.currentValue.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 ml-1">{sensor.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span className="text-xs text-gray-500">
            {sensor.trend === 'up' ? '+' : sensor.trend === 'down' ? '-' : ''}
            {Math.abs(sensor.readings.length > 1
              ? sensor.currentValue - sensor.readings[sensor.readings.length - 2]?.value
              : 0
            ).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-3">
        <MiniLineChart
          data={sensor.readings}
          width={200}
          height={50}
          color={config.gradientFrom}
          minThreshold={sensor.minThreshold}
          maxThreshold={sensor.maxThreshold}
        />
      </div>

      {/* Threshold Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {sensor.minThreshold}{sensor.unit}</span>
        <span>Max: {sensor.maxThreshold}{sensor.unit}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Large Chart Component
// ============================================================================

function LargeLineChart({
  sensors,
  height = 200,
}: {
  sensors: SensorData[];
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const chartHeight = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, chartHeight);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw each sensor line
    sensors.forEach(sensor => {
      const config = sensorConfig[sensor.type];
      const readings = sensor.readings;
      if (readings.length < 2) return;

      const values = readings.map(r => r.value);
      const min = Math.min(...values) * 0.9;
      const max = Math.max(...values) * 1.1;
      const range = max - min || 1;

      ctx.strokeStyle = config.gradientFrom;
      ctx.lineWidth = 2;
      ctx.beginPath();

      readings.forEach((reading, i) => {
        const x = (i / (readings.length - 1)) * width;
        const y = chartHeight - ((reading.value - min) / range) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    });
  }, [sensors, height]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="w-full"
    />
  );
}

// ============================================================================
// IoT Sensor Charts Component
// ============================================================================

export function IoTSensorCharts({
  machineId = 'machine-01',
  refreshInterval = 2000,
  maxDataPoints = 30,
  onThresholdAlert,
}: IoTSensorChartsProps) {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  // Generate initial sensor data
  const initializeSensors = useCallback((): SensorData[] => {
    const now = new Date();
    const sensorDefinitions = [
      { id: 'temp-1', name: 'Motor Temperature', type: 'temperature', unit: '°C', base: 65, variance: 10, min: 40, max: 85 },
      { id: 'vib-1', name: 'Spindle Vibration', type: 'vibration', unit: 'mm/s', base: 2.5, variance: 1, min: 0, max: 5 },
      { id: 'power-1', name: 'Power Draw', type: 'power', unit: 'kW', base: 18, variance: 5, min: 5, max: 25 },
      { id: 'pressure-1', name: 'Hydraulic Pressure', type: 'pressure', unit: 'bar', base: 180, variance: 20, min: 150, max: 220 },
      { id: 'humidity-1', name: 'Enclosure Humidity', type: 'humidity', unit: '%', base: 45, variance: 10, min: 30, max: 60 },
      { id: 'airflow-1', name: 'Cooling Airflow', type: 'airflow', unit: 'm³/h', base: 120, variance: 15, min: 80, max: 150 },
    ];

    return sensorDefinitions.map(def => {
      const readings: SensorReading[] = [];
      for (let i = maxDataPoints - 1; i >= 0; i--) {
        readings.push({
          timestamp: new Date(now.getTime() - i * refreshInterval),
          value: def.base + (Math.random() - 0.5) * def.variance * 2,
        });
      }

      const currentValue = readings[readings.length - 1].value;
      const prevValue = readings[readings.length - 2]?.value || currentValue;

      return {
        id: def.id,
        name: def.name,
        type: def.type as SensorData['type'],
        unit: def.unit,
        currentValue,
        readings,
        minThreshold: def.min,
        maxThreshold: def.max,
        trend: currentValue > prevValue ? 'up' : currentValue < prevValue ? 'down' : 'stable',
        status: currentValue > def.max || currentValue < def.min ? 'critical' :
                currentValue > def.max * 0.9 || currentValue < def.min * 1.1 ? 'warning' : 'normal',
      };
    });
  }, [maxDataPoints, refreshInterval]);

  // Initialize sensors
  useEffect(() => {
    setSensors(initializeSensors());
  }, [initializeSensors]);

  // Update sensor data periodically
  useEffect(() => {
    const updateSensors = () => {
      setSensors(prevSensors => prevSensors.map(sensor => {
        const sensorDef = {
          temperature: { base: 65, variance: 10, min: 40, max: 85 },
          vibration: { base: 2.5, variance: 1, min: 0, max: 5 },
          power: { base: 18, variance: 5, min: 5, max: 25 },
          pressure: { base: 180, variance: 20, min: 150, max: 220 },
          humidity: { base: 45, variance: 10, min: 30, max: 60 },
          airflow: { base: 120, variance: 15, min: 80, max: 150 },
        }[sensor.type];

        const lastValue = sensor.currentValue;
        // Add some continuity to the data
        const newValue = Math.max(
          sensorDef.min * 0.8,
          Math.min(
            sensorDef.max * 1.2,
            lastValue + (Math.random() - 0.5) * sensorDef.variance
          )
        );

        const newReadings = [
          ...sensor.readings.slice(-maxDataPoints + 1),
          { timestamp: new Date(), value: newValue },
        ];

        const status = newValue > sensorDef.max || newValue < sensorDef.min ? 'critical' :
                      newValue > sensorDef.max * 0.9 || newValue < sensorDef.min * 1.1 ? 'warning' : 'normal';

        const updatedSensor: SensorData = {
          ...sensor,
          currentValue: newValue,
          readings: newReadings,
          trend: newValue > lastValue ? 'up' : newValue < lastValue ? 'down' : 'stable',
          status,
        };

        // Trigger alert callback if threshold exceeded
        if (status === 'critical' && onThresholdAlert) {
          onThresholdAlert(updatedSensor);
        }

        return updatedSensor;
      }));
    };

    const interval = setInterval(updateSensors, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, maxDataPoints, onThresholdAlert]);

  // Count alerts
  const alertCount = sensors.filter(s => s.status !== 'normal').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">IoT Sensor Data</h2>
              <p className="text-sm text-teal-100">Machine: {machineId}</p>
            </div>
          </div>

          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <span className="text-sm font-medium">{alertCount} Alert(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {sensors.map(sensor => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onAlertClick={() => setSelectedSensor(sensor.id)}
            />
          ))}
        </div>

        {/* Combined Chart View */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Combined Sensor Trends (Last {maxDataPoints} readings)
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <LargeLineChart sensors={sensors} height={150} />
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {sensors.map(sensor => {
                const config = sensorConfig[sensor.type];
                return (
                  <div key={sensor.id} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.gradientFrom }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">{sensor.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IoTSensorCharts;
