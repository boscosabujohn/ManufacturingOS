'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Server,
  Database,
  Cloud,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  Globe,
  HardDrive,
  Cpu,
  MemoryStick,
  Gauge,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Settings,
  Bell,
  History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'offline' | 'unknown';
export type SystemType = 'erp' | 'mes' | 'scada' | 'plc' | 'database' | 'api' | 'iot' | 'cloud' | 'storage';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
  trend: 'up' | 'down' | 'stable';
}

export interface HealthCheck {
  id: string;
  name: string;
  status: HealthStatus;
  lastCheck: string;
  responseTime?: number;
  message?: string;
}

export interface ConnectedSystem {
  id: string;
  name: string;
  type: SystemType;
  status: HealthStatus;
  endpoint: string;
  version?: string;
  lastHeartbeat: string;
  uptime: number;
  latency: number;
  throughput: number;
  errorRate: number;
  metrics: SystemMetric[];
  healthChecks: HealthCheck[];
  dependencies: string[];
  alerts: string[];
}

export interface HealthEvent {
  id: string;
  systemId: string;
  systemName: string;
  type: 'status-change' | 'alert' | 'recovery' | 'warning';
  previousStatus?: HealthStatus;
  newStatus?: HealthStatus;
  message: string;
  timestamp: string;
}

export interface IntegrationHealthMonitorProps {
  onSystemClick?: (system: ConnectedSystem) => void;
  onAlertClick?: (system: ConnectedSystem, alert: string) => void;
  onHealthCheckClick?: (system: ConnectedSystem, check: HealthCheck) => void;
  refreshInterval?: number;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockSystems = (): ConnectedSystem[] => [
  {
    id: 'sys-1',
    name: 'ERP Core System',
    type: 'erp',
    status: 'healthy',
    endpoint: 'https://erp.manufacturing.local',
    version: 'v4.2.1',
    lastHeartbeat: '2024-12-05T14:32:58Z',
    uptime: 99.98,
    latency: 45,
    throughput: 1250,
    errorRate: 0.02,
    metrics: [
      { name: 'CPU Usage', value: 42, unit: '%', threshold: { warning: 70, critical: 90 }, trend: 'stable' },
      { name: 'Memory', value: 68, unit: '%', threshold: { warning: 80, critical: 95 }, trend: 'up' },
      { name: 'Active Connections', value: 156, unit: '', threshold: { warning: 200, critical: 250 }, trend: 'stable' },
      { name: 'Queue Size', value: 23, unit: '', threshold: { warning: 100, critical: 500 }, trend: 'down' },
    ],
    healthChecks: [
      { id: 'hc-1', name: 'Database Connection', status: 'healthy', lastCheck: '2024-12-05T14:32:55Z', responseTime: 12 },
      { id: 'hc-2', name: 'API Gateway', status: 'healthy', lastCheck: '2024-12-05T14:32:55Z', responseTime: 8 },
      { id: 'hc-3', name: 'Cache Service', status: 'healthy', lastCheck: '2024-12-05T14:32:55Z', responseTime: 2 },
    ],
    dependencies: ['sys-5', 'sys-6'],
    alerts: [],
  },
  {
    id: 'sys-2',
    name: 'MES Controller',
    type: 'mes',
    status: 'healthy',
    endpoint: 'opc.tcp://mes-controller:4840',
    version: 'v3.8.0',
    lastHeartbeat: '2024-12-05T14:32:59Z',
    uptime: 99.95,
    latency: 18,
    throughput: 3500,
    errorRate: 0.05,
    metrics: [
      { name: 'CPU Usage', value: 55, unit: '%', threshold: { warning: 70, critical: 90 }, trend: 'stable' },
      { name: 'Memory', value: 72, unit: '%', threshold: { warning: 80, critical: 95 }, trend: 'stable' },
      { name: 'Active Sessions', value: 48, unit: '', threshold: { warning: 60, critical: 80 }, trend: 'stable' },
      { name: 'Message Rate', value: 3500, unit: '/min', threshold: { warning: 5000, critical: 8000 }, trend: 'up' },
    ],
    healthChecks: [
      { id: 'hc-4', name: 'OPC-UA Server', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 5 },
      { id: 'hc-5', name: 'PLC Communication', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 3 },
      { id: 'hc-6', name: 'Data Historian', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 15 },
    ],
    dependencies: ['sys-3', 'sys-4'],
    alerts: [],
  },
  {
    id: 'sys-3',
    name: 'SCADA System',
    type: 'scada',
    status: 'degraded',
    endpoint: 'scada://hmi-server:502',
    version: 'v2.4.5',
    lastHeartbeat: '2024-12-05T14:32:55Z',
    uptime: 98.5,
    latency: 125,
    throughput: 800,
    errorRate: 1.2,
    metrics: [
      { name: 'CPU Usage', value: 78, unit: '%', threshold: { warning: 70, critical: 90 }, trend: 'up' },
      { name: 'Memory', value: 85, unit: '%', threshold: { warning: 80, critical: 95 }, trend: 'up' },
      { name: 'Tag Count', value: 12500, unit: '', threshold: { warning: 15000, critical: 20000 }, trend: 'stable' },
      { name: 'Scan Rate', value: 450, unit: 'ms', threshold: { warning: 500, critical: 1000 }, trend: 'up' },
    ],
    healthChecks: [
      { id: 'hc-7', name: 'HMI Server', status: 'degraded', lastCheck: '2024-12-05T14:32:50Z', responseTime: 350, message: 'High response time' },
      { id: 'hc-8', name: 'Modbus Gateway', status: 'healthy', lastCheck: '2024-12-05T14:32:55Z', responseTime: 8 },
      { id: 'hc-9', name: 'Alarm Server', status: 'healthy', lastCheck: '2024-12-05T14:32:55Z', responseTime: 12 },
    ],
    dependencies: ['sys-4'],
    alerts: ['High memory usage detected', 'Response time exceeds threshold'],
  },
  {
    id: 'sys-4',
    name: 'PLC Network',
    type: 'plc',
    status: 'healthy',
    endpoint: 'ethernet-ip://plc-rack:44818',
    version: 'FW 32.011',
    lastHeartbeat: '2024-12-05T14:32:59Z',
    uptime: 99.99,
    latency: 5,
    throughput: 10000,
    errorRate: 0.001,
    metrics: [
      { name: 'Scan Time', value: 12, unit: 'ms', threshold: { warning: 20, critical: 50 }, trend: 'stable' },
      { name: 'I/O Modules', value: 48, unit: '', threshold: { warning: 55, critical: 60 }, trend: 'stable' },
      { name: 'Network Load', value: 35, unit: '%', threshold: { warning: 60, critical: 80 }, trend: 'stable' },
    ],
    healthChecks: [
      { id: 'hc-10', name: 'Main PLC', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 2 },
      { id: 'hc-11', name: 'Safety PLC', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 1 },
      { id: 'hc-12', name: 'I/O Network', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 3 },
    ],
    dependencies: [],
    alerts: [],
  },
  {
    id: 'sys-5',
    name: 'PostgreSQL Database',
    type: 'database',
    status: 'healthy',
    endpoint: 'postgres://db-master:5432',
    version: '15.2',
    lastHeartbeat: '2024-12-05T14:32:58Z',
    uptime: 99.99,
    latency: 8,
    throughput: 5000,
    errorRate: 0.01,
    metrics: [
      { name: 'Connections', value: 89, unit: '', threshold: { warning: 150, critical: 200 }, trend: 'stable' },
      { name: 'Query Time', value: 12, unit: 'ms', threshold: { warning: 50, critical: 100 }, trend: 'stable' },
      { name: 'Cache Hit', value: 98.5, unit: '%', threshold: { warning: 90, critical: 80 }, trend: 'stable' },
      { name: 'Disk Usage', value: 67, unit: '%', threshold: { warning: 80, critical: 90 }, trend: 'up' },
    ],
    healthChecks: [
      { id: 'hc-13', name: 'Master Node', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 5 },
      { id: 'hc-14', name: 'Replica Node', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 6 },
      { id: 'hc-15', name: 'Replication Lag', status: 'healthy', lastCheck: '2024-12-05T14:32:58Z', responseTime: 0 },
    ],
    dependencies: ['sys-6'],
    alerts: [],
  },
  {
    id: 'sys-6',
    name: 'Cloud Storage',
    type: 'storage',
    status: 'healthy',
    endpoint: 'https://storage.cloud.local',
    version: 'S3 API',
    lastHeartbeat: '2024-12-05T14:32:57Z',
    uptime: 99.9,
    latency: 85,
    throughput: 500,
    errorRate: 0.1,
    metrics: [
      { name: 'Used Space', value: 2.4, unit: 'TB', threshold: { warning: 4, critical: 4.8 }, trend: 'up' },
      { name: 'Bandwidth', value: 125, unit: 'MB/s', threshold: { warning: 200, critical: 250 }, trend: 'stable' },
      { name: 'Objects', value: 1.2, unit: 'M', threshold: { warning: 5, critical: 10 }, trend: 'up' },
    ],
    healthChecks: [
      { id: 'hc-16', name: 'API Endpoint', status: 'healthy', lastCheck: '2024-12-05T14:32:57Z', responseTime: 45 },
      { id: 'hc-17', name: 'Write Access', status: 'healthy', lastCheck: '2024-12-05T14:32:57Z', responseTime: 120 },
    ],
    dependencies: [],
    alerts: [],
  },
  {
    id: 'sys-7',
    name: 'IoT Gateway',
    type: 'iot',
    status: 'critical',
    endpoint: 'mqtt://iot-gateway:1883',
    version: 'v1.5.2',
    lastHeartbeat: '2024-12-05T14:30:00Z',
    uptime: 85.5,
    latency: 0,
    throughput: 0,
    errorRate: 100,
    metrics: [
      { name: 'Connected Devices', value: 0, unit: '', threshold: { warning: 50, critical: 10 }, trend: 'down' },
      { name: 'Message Queue', value: 15000, unit: '', threshold: { warning: 5000, critical: 10000 }, trend: 'up' },
    ],
    healthChecks: [
      { id: 'hc-18', name: 'MQTT Broker', status: 'critical', lastCheck: '2024-12-05T14:32:00Z', message: 'Connection refused' },
      { id: 'hc-19', name: 'Device Registry', status: 'critical', lastCheck: '2024-12-05T14:32:00Z', message: 'Service unavailable' },
    ],
    dependencies: ['sys-2'],
    alerts: ['CRITICAL: IoT Gateway offline', 'Message queue overflow risk', '245 devices disconnected'],
  },
  {
    id: 'sys-8',
    name: 'API Gateway',
    type: 'api',
    status: 'healthy',
    endpoint: 'https://api.manufacturing.local',
    version: 'v2.1.0',
    lastHeartbeat: '2024-12-05T14:32:59Z',
    uptime: 99.95,
    latency: 25,
    throughput: 2500,
    errorRate: 0.15,
    metrics: [
      { name: 'Requests/min', value: 2500, unit: '', threshold: { warning: 5000, critical: 8000 }, trend: 'stable' },
      { name: 'Avg Response', value: 45, unit: 'ms', threshold: { warning: 100, critical: 200 }, trend: 'stable' },
      { name: 'Error Rate', value: 0.15, unit: '%', threshold: { warning: 1, critical: 5 }, trend: 'stable' },
    ],
    healthChecks: [
      { id: 'hc-20', name: 'Load Balancer', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 2 },
      { id: 'hc-21', name: 'Rate Limiter', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 1 },
      { id: 'hc-22', name: 'Auth Service', status: 'healthy', lastCheck: '2024-12-05T14:32:59Z', responseTime: 15 },
    ],
    dependencies: ['sys-1'],
    alerts: [],
  },
];

const generateMockEvents = (): HealthEvent[] => [
  { id: 'evt-1', systemId: 'sys-7', systemName: 'IoT Gateway', type: 'status-change', previousStatus: 'degraded', newStatus: 'critical', message: 'Connection lost to MQTT broker', timestamp: '2024-12-05T14:30:00Z' },
  { id: 'evt-2', systemId: 'sys-3', systemName: 'SCADA System', type: 'warning', message: 'Memory usage exceeds 80% threshold', timestamp: '2024-12-05T14:25:00Z' },
  { id: 'evt-3', systemId: 'sys-3', systemName: 'SCADA System', type: 'status-change', previousStatus: 'healthy', newStatus: 'degraded', message: 'Response time degradation detected', timestamp: '2024-12-05T14:20:00Z' },
  { id: 'evt-4', systemId: 'sys-2', systemName: 'MES Controller', type: 'recovery', previousStatus: 'degraded', newStatus: 'healthy', message: 'Service recovered after restart', timestamp: '2024-12-05T13:45:00Z' },
  { id: 'evt-5', systemId: 'sys-5', systemName: 'PostgreSQL Database', type: 'alert', message: 'Disk usage approaching warning threshold', timestamp: '2024-12-05T12:00:00Z' },
];

// ============================================================================
// Helper Functions
// ============================================================================

const getStatusColor = (status: HealthStatus) => {
  switch (status) {
    case 'healthy': return 'text-green-600';
    case 'degraded': return 'text-amber-600';
    case 'critical': return 'text-red-600';
    case 'offline': return 'text-gray-500';
    case 'unknown': return 'text-gray-400';
  }
};

const getStatusBgColor = (status: HealthStatus) => {
  switch (status) {
    case 'healthy': return 'bg-green-100 dark:bg-green-900/30';
    case 'degraded': return 'bg-amber-100 dark:bg-amber-900/30';
    case 'critical': return 'bg-red-100 dark:bg-red-900/30';
    case 'offline': return 'bg-gray-100 dark:bg-gray-700';
    case 'unknown': return 'bg-gray-50 dark:bg-gray-800';
  }
};

const getStatusIcon = (status: HealthStatus) => {
  switch (status) {
    case 'healthy': return CheckCircle;
    case 'degraded': return AlertTriangle;
    case 'critical': return XCircle;
    case 'offline': return WifiOff;
    case 'unknown': return Clock;
  }
};

const getSystemIcon = (type: SystemType) => {
  switch (type) {
    case 'erp': return Globe;
    case 'mes': return Activity;
    case 'scada': return Gauge;
    case 'plc': return Cpu;
    case 'database': return Database;
    case 'api': return Cloud;
    case 'iot': return Wifi;
    case 'cloud': return Cloud;
    case 'storage': return HardDrive;
  }
};

const formatUptime = (uptime: number) => {
  return `${uptime.toFixed(2)}%`;
};

// ============================================================================
// Health Overview Component
// ============================================================================

function HealthOverview({ systems }: { systems: ConnectedSystem[] }) {
  const stats = useMemo(() => {
    const healthy = systems.filter(s => s.status === 'healthy').length;
    const degraded = systems.filter(s => s.status === 'degraded').length;
    const critical = systems.filter(s => s.status === 'critical').length;
    const avgUptime = Math.round(systems.reduce((sum, s) => sum + s.uptime, 0) / systems.length * 100) / 100;
    const avgLatency = Math.round(systems.filter(s => s.latency > 0).reduce((sum, s) => sum + s.latency, 0) / systems.filter(s => s.latency > 0).length);
    const totalAlerts = systems.reduce((sum, s) => sum + s.alerts.length, 0);

    return { healthy, degraded, critical, total: systems.length, avgUptime, avgLatency, totalAlerts };
  }, [systems]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
              <p className="text-xs text-gray-500">Healthy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.degraded}</p>
              <p className="text-xs text-gray-500">Degraded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.avgUptime}%</p>
              <p className="text-xs text-gray-500">Avg Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.avgLatency}ms</p>
              <p className="text-xs text-gray-500">Avg Latency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.totalAlerts}</p>
              <p className="text-xs text-gray-500">Active Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Metric Bar Component
// ============================================================================

function MetricBar({ metric }: { metric: SystemMetric }) {
  const getBarColor = () => {
    if (metric.value >= metric.threshold.critical) return 'bg-red-500';
    if (metric.value >= metric.threshold.warning) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const maxValue = metric.threshold.critical * 1.2;
  const percentage = Math.min((metric.value / maxValue) * 100, 100);

  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{metric.name}</span>
        <span className="font-medium flex items-center gap-1">
          {metric.value}{metric.unit}
          {TrendIcon && <TrendIcon className={`w-3 h-3 ${metric.trend === 'up' ? 'text-red-500' : 'text-green-500'}`} />}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        {/* Warning threshold marker */}
        <div
          className="absolute h-full w-0.5 bg-amber-400 z-10"
          style={{ left: `${(metric.threshold.warning / maxValue) * 100}%` }}
        />
        {/* Critical threshold marker */}
        <div
          className="absolute h-full w-0.5 bg-red-400 z-10"
          style={{ left: `${(metric.threshold.critical / maxValue) * 100}%` }}
        />
        {/* Value bar */}
        <div
          className={`h-full rounded-full transition-all ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// System Card Component
// ============================================================================

function SystemCard({
  system,
  onClick,
  onAlertClick,
}: {
  system: ConnectedSystem;
  onClick?: (system: ConnectedSystem) => void;
  onAlertClick?: (system: ConnectedSystem, alert: string) => void;
}) {
  const StatusIcon = getStatusIcon(system.status);
  const SystemIcon = getSystemIcon(system.type);

  return (
    <Card className={`${system.status === 'critical' ? 'border-red-300 dark:border-red-700 animate-pulse' : system.status === 'degraded' ? 'border-amber-300 dark:border-amber-700' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getStatusBgColor(system.status)}`}>
              <SystemIcon className={`w-5 h-5 ${getStatusColor(system.status)}`} />
            </div>
            <div>
              <h4
                className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onClick?.(system)}
              >
                {system.name}
              </h4>
              <p className="text-xs text-gray-500 font-mono">{system.endpoint}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(system.status)} ${getStatusColor(system.status)}`}>
                  {system.status.toUpperCase()}
                </span>
                {system.version && (
                  <span className="text-xs text-gray-500">{system.version}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${system.status === 'healthy' ? 'bg-green-500' : system.status === 'degraded' ? 'bg-amber-500 animate-pulse' : system.status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-gray-400'}`} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Uptime</p>
            <p className="font-semibold">{formatUptime(system.uptime)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Latency</p>
            <p className="font-semibold">{system.latency}ms</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Throughput</p>
            <p className="font-semibold">{system.throughput}/m</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Errors</p>
            <p className={`font-semibold ${system.errorRate > 1 ? 'text-red-600' : ''}`}>{system.errorRate}%</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-4 space-y-2">
          {system.metrics.slice(0, 3).map((metric, index) => (
            <MetricBar key={index} metric={metric} />
          ))}
        </div>

        {/* Health Checks */}
        <div className="mt-4 flex flex-wrap gap-1">
          {system.healthChecks.map(check => {
            const CheckIcon = getStatusIcon(check.status);
            return (
              <div
                key={check.id}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusBgColor(check.status)}`}
                title={check.message || `${check.name}: ${check.responseTime}ms`}
              >
                <CheckIcon className={`w-3 h-3 ${getStatusColor(check.status)}`} />
                <span>{check.name}</span>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        {system.alerts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {system.alerts.map((alert, index) => (
                <button
                  key={index}
                  className="w-full text-left flex items-center gap-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs hover:bg-red-200 transition-colors"
                  onClick={() => onAlertClick?.(system, alert)}
                >
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{alert}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Events Timeline Component
// ============================================================================

function EventsTimeline({ events }: { events: HealthEvent[] }) {
  const getEventIcon = (type: HealthEvent['type']) => {
    switch (type) {
      case 'status-change': return RefreshCw;
      case 'alert': return AlertTriangle;
      case 'recovery': return CheckCircle;
      case 'warning': return AlertTriangle;
    }
  };

  const getEventColor = (type: HealthEvent['type']) => {
    switch (type) {
      case 'status-change': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'alert': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'recovery': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Events
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map(event => {
            const Icon = getEventIcon(event.type);
            return (
              <div key={event.id} className="flex items-start gap-3">
                <div className={`p-1.5 rounded ${getEventColor(event.type)}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.systemName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{event.message}</p>
                  {event.previousStatus && event.newStatus && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {event.previousStatus} → {event.newStatus}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function IntegrationHealthMonitor({
  onSystemClick,
  onAlertClick,
  onHealthCheckClick,
  refreshInterval = 5000,
}: IntegrationHealthMonitorProps) {
  const [systems, setSystems] = useState<ConnectedSystem[]>([]);
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<HealthStatus | 'all'>('all');

  useEffect(() => {
    setSystems(generateMockSystems());
    setEvents(generateMockEvents());
    setIsLoading(false);

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const filteredSystems = useMemo(() => {
    if (filterStatus === 'all') return systems;
    return systems.filter(s => s.status === filterStatus);
  }, [systems, filterStatus]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Integration Health Monitor
            </CardTitle>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as HealthStatus | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="degraded">Degraded</option>
                <option value="critical">Critical</option>
                <option value="offline">Offline</option>
              </select>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HealthOverview systems={systems} />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* System Cards */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSystems.map(system => (
              <SystemCard
                key={system.id}
                system={system}
                onClick={onSystemClick}
                onAlertClick={onAlertClick}
              />
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="xl:col-span-1">
          <EventsTimeline events={events} />
        </div>
      </div>
    </div>
  );
}
