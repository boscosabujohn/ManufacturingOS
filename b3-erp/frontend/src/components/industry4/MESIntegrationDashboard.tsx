'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Server,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Database,
  Activity,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error' | 'offline';
export type DataFlow = 'inbound' | 'outbound' | 'bidirectional';
export type EntityType = 'work-order' | 'inventory' | 'machine' | 'quality' | 'schedule' | 'bom';

export interface SyncMetrics {
  totalRecords: number;
  syncedRecords: number;
  pendingRecords: number;
  failedRecords: number;
  lastSyncTime: string;
  avgSyncTime: number;
  throughput: number;
}

export interface DataEntity {
  id: string;
  name: string;
  type: EntityType;
  status: SyncStatus;
  dataFlow: DataFlow;
  erpCount: number;
  mesCount: number;
  lastSync: string;
  nextSync: string;
  syncInterval: number;
  metrics: SyncMetrics;
  recentChanges: number;
  conflicts: number;
}

export interface SyncEvent {
  id: string;
  entityType: EntityType;
  action: 'create' | 'update' | 'delete' | 'sync';
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  recordId: string;
  recordName: string;
  details?: string;
  duration?: number;
}

export interface MESConnection {
  id: string;
  name: string;
  type: 'opcua' | 'mqtt' | 'rest' | 'database';
  status: 'connected' | 'disconnected' | 'error';
  endpoint: string;
  latency: number;
  uptime: number;
  messagesPerSecond: number;
}

export interface MESIntegrationDashboardProps {
  onEntityClick?: (entity: DataEntity) => void;
  onSyncTrigger?: (entityId: string) => void;
  onEventClick?: (event: SyncEvent) => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockEntities = (): DataEntity[] => [
  {
    id: 'entity-1',
    name: 'Work Orders',
    type: 'work-order',
    status: 'synced',
    dataFlow: 'bidirectional',
    erpCount: 1247,
    mesCount: 1247,
    lastSync: '2024-12-05T14:32:15Z',
    nextSync: '2024-12-05T14:37:15Z',
    syncInterval: 5,
    metrics: {
      totalRecords: 1247,
      syncedRecords: 1245,
      pendingRecords: 2,
      failedRecords: 0,
      lastSyncTime: '2024-12-05T14:32:15Z',
      avgSyncTime: 1.2,
      throughput: 850,
    },
    recentChanges: 23,
    conflicts: 0,
  },
  {
    id: 'entity-2',
    name: 'Inventory Levels',
    type: 'inventory',
    status: 'syncing',
    dataFlow: 'bidirectional',
    erpCount: 5621,
    mesCount: 5618,
    lastSync: '2024-12-05T14:30:00Z',
    nextSync: '2024-12-05T14:35:00Z',
    syncInterval: 5,
    metrics: {
      totalRecords: 5621,
      syncedRecords: 5618,
      pendingRecords: 3,
      failedRecords: 0,
      lastSyncTime: '2024-12-05T14:30:00Z',
      avgSyncTime: 3.5,
      throughput: 1200,
    },
    recentChanges: 156,
    conflicts: 2,
  },
  {
    id: 'entity-3',
    name: 'Machine Status',
    type: 'machine',
    status: 'synced',
    dataFlow: 'inbound',
    erpCount: 48,
    mesCount: 48,
    lastSync: '2024-12-05T14:32:45Z',
    nextSync: '2024-12-05T14:32:50Z',
    syncInterval: 0.083,
    metrics: {
      totalRecords: 48,
      syncedRecords: 48,
      pendingRecords: 0,
      failedRecords: 0,
      lastSyncTime: '2024-12-05T14:32:45Z',
      avgSyncTime: 0.1,
      throughput: 9600,
    },
    recentChanges: 892,
    conflicts: 0,
  },
  {
    id: 'entity-4',
    name: 'Quality Results',
    type: 'quality',
    status: 'synced',
    dataFlow: 'inbound',
    erpCount: 3421,
    mesCount: 3421,
    lastSync: '2024-12-05T14:31:30Z',
    nextSync: '2024-12-05T14:36:30Z',
    syncInterval: 5,
    metrics: {
      totalRecords: 3421,
      syncedRecords: 3421,
      pendingRecords: 0,
      failedRecords: 0,
      lastSyncTime: '2024-12-05T14:31:30Z',
      avgSyncTime: 2.1,
      throughput: 650,
    },
    recentChanges: 45,
    conflicts: 0,
  },
  {
    id: 'entity-5',
    name: 'Production Schedule',
    type: 'schedule',
    status: 'error',
    dataFlow: 'outbound',
    erpCount: 89,
    mesCount: 87,
    lastSync: '2024-12-05T14:25:00Z',
    nextSync: '2024-12-05T14:30:00Z',
    syncInterval: 5,
    metrics: {
      totalRecords: 89,
      syncedRecords: 87,
      pendingRecords: 0,
      failedRecords: 2,
      lastSyncTime: '2024-12-05T14:25:00Z',
      avgSyncTime: 0.8,
      throughput: 100,
    },
    recentChanges: 12,
    conflicts: 2,
  },
  {
    id: 'entity-6',
    name: 'Bill of Materials',
    type: 'bom',
    status: 'synced',
    dataFlow: 'outbound',
    erpCount: 2156,
    mesCount: 2156,
    lastSync: '2024-12-05T14:00:00Z',
    nextSync: '2024-12-05T15:00:00Z',
    syncInterval: 60,
    metrics: {
      totalRecords: 2156,
      syncedRecords: 2156,
      pendingRecords: 0,
      failedRecords: 0,
      lastSyncTime: '2024-12-05T14:00:00Z',
      avgSyncTime: 8.5,
      throughput: 250,
    },
    recentChanges: 3,
    conflicts: 0,
  },
];

const generateMockEvents = (): SyncEvent[] => [
  { id: 'evt-1', entityType: 'work-order', action: 'update', status: 'success', timestamp: '2024-12-05T14:32:15Z', recordId: 'WO-2024-1234', recordName: 'Assembly Line A - Batch 45', duration: 120 },
  { id: 'evt-2', entityType: 'inventory', action: 'sync', status: 'success', timestamp: '2024-12-05T14:32:10Z', recordId: 'INV-5621', recordName: 'Raw Material Stock Update', duration: 3500 },
  { id: 'evt-3', entityType: 'machine', action: 'update', status: 'success', timestamp: '2024-12-05T14:32:05Z', recordId: 'MCH-012', recordName: 'CNC Machine 12 - Status Change', duration: 45 },
  { id: 'evt-4', entityType: 'schedule', action: 'create', status: 'failed', timestamp: '2024-12-05T14:31:55Z', recordId: 'SCH-089', recordName: 'Night Shift Schedule', details: 'Connection timeout', duration: 5000 },
  { id: 'evt-5', entityType: 'quality', action: 'create', status: 'success', timestamp: '2024-12-05T14:31:30Z', recordId: 'QC-3421', recordName: 'Inspection Result - Part #A2345', duration: 230 },
  { id: 'evt-6', entityType: 'work-order', action: 'update', status: 'success', timestamp: '2024-12-05T14:31:00Z', recordId: 'WO-2024-1233', recordName: 'Assembly Line B - Status Update', duration: 89 },
  { id: 'evt-7', entityType: 'inventory', action: 'update', status: 'pending', timestamp: '2024-12-05T14:30:55Z', recordId: 'INV-5620', recordName: 'Component Stock Adjustment' },
  { id: 'evt-8', entityType: 'schedule', action: 'update', status: 'failed', timestamp: '2024-12-05T14:30:00Z', recordId: 'SCH-088', recordName: 'Day Shift Modification', details: 'Validation error: overlapping shifts' },
];

const generateMockConnections = (): MESConnection[] => [
  { id: 'conn-1', name: 'Siemens MES', type: 'opcua', status: 'connected', endpoint: 'opc.tcp://mes-server:4840', latency: 12, uptime: 99.98, messagesPerSecond: 450 },
  { id: 'conn-2', name: 'MQTT Broker', type: 'mqtt', status: 'connected', endpoint: 'mqtt://iot-broker:1883', latency: 8, uptime: 99.99, messagesPerSecond: 1200 },
  { id: 'conn-3', name: 'Quality System API', type: 'rest', status: 'connected', endpoint: 'https://quality-api.local/v2', latency: 45, uptime: 99.5, messagesPerSecond: 25 },
  { id: 'conn-4', name: 'Legacy DB', type: 'database', status: 'error', endpoint: 'jdbc:oracle:thin:@legacy:1521/PROD', latency: 0, uptime: 85.2, messagesPerSecond: 0 },
];

// ============================================================================
// Helper Functions
// ============================================================================

const getStatusColor = (status: SyncStatus) => {
  switch (status) {
    case 'synced': return 'text-green-600';
    case 'syncing': return 'text-blue-600';
    case 'pending': return 'text-amber-600';
    case 'error': return 'text-red-600';
    case 'offline': return 'text-gray-500';
  }
};

const getStatusBgColor = (status: SyncStatus) => {
  switch (status) {
    case 'synced': return 'bg-green-100 dark:bg-green-900/30';
    case 'syncing': return 'bg-blue-100 dark:bg-blue-900/30';
    case 'pending': return 'bg-amber-100 dark:bg-amber-900/30';
    case 'error': return 'bg-red-100 dark:bg-red-900/30';
    case 'offline': return 'bg-gray-100 dark:bg-gray-700';
  }
};

const getStatusIcon = (status: SyncStatus) => {
  switch (status) {
    case 'synced': return CheckCircle;
    case 'syncing': return RefreshCw;
    case 'pending': return Clock;
    case 'error': return XCircle;
    case 'offline': return Server;
  }
};

const getDataFlowIcon = (flow: DataFlow) => {
  switch (flow) {
    case 'inbound': return ArrowDown;
    case 'outbound': return ArrowUp;
    case 'bidirectional': return ArrowRightLeft;
  }
};

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString();
};

// ============================================================================
// Connection Status Component
// ============================================================================

function ConnectionStatus({ connections }: { connections: MESConnection[] }) {
  const getConnectionIcon = (type: MESConnection['type']) => {
    switch (type) {
      case 'opcua': return Server;
      case 'mqtt': return Zap;
      case 'rest': return Activity;
      case 'database': return Database;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Server className="w-4 h-4" />
          MES Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connections.map(conn => {
            const Icon = getConnectionIcon(conn.type);
            const isConnected = conn.status === 'connected';

            return (
              <div
                key={conn.id}
                className={`p-3 rounded-lg border ${
                  conn.status === 'error' ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' :
                  conn.status === 'connected' ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' :
                  'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                      <Icon className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{conn.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{conn.endpoint}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {conn.status.toUpperCase()}
                      </span>
                    </div>
                    {isConnected && (
                      <p className="text-xs text-gray-500 mt-1">
                        {conn.latency}ms • {conn.messagesPerSecond}/s
                      </p>
                    )}
                  </div>
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
// Sync Overview Component
// ============================================================================

function SyncOverview({ entities }: { entities: DataEntity[] }) {
  const stats = useMemo(() => {
    const synced = entities.filter(e => e.status === 'synced').length;
    const syncing = entities.filter(e => e.status === 'syncing').length;
    const errors = entities.filter(e => e.status === 'error').length;
    const totalRecords = entities.reduce((sum, e) => sum + e.erpCount, 0);
    const totalConflicts = entities.reduce((sum, e) => sum + e.conflicts, 0);
    const avgThroughput = Math.round(entities.reduce((sum, e) => sum + e.metrics.throughput, 0) / entities.length);

    return { synced, syncing, errors, total: entities.length, totalRecords, totalConflicts, avgThroughput };
  }, [entities]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.synced}/{stats.total}</p>
              <p className="text-xs text-gray-500">Entities Synced</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-8 h-8 text-blue-500 ${stats.syncing > 0 ? 'animate-spin' : ''}`} />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.syncing}</p>
              <p className="text-xs text-gray-500">Currently Syncing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              <p className="text-xs text-gray-500">Sync Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{(stats.totalRecords / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500">Total Records</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.totalConflicts}</p>
              <p className="text-xs text-gray-500">Data Conflicts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-indigo-500" />
            <div>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgThroughput}</p>
              <p className="text-xs text-gray-500">Avg Records/min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Entity Sync Card Component
// ============================================================================

function EntitySyncCard({
  entity,
  onSync,
  onClick,
}: {
  entity: DataEntity;
  onSync?: (id: string) => void;
  onClick?: (entity: DataEntity) => void;
}) {
  const StatusIcon = getStatusIcon(entity.status);
  const FlowIcon = getDataFlowIcon(entity.dataFlow);

  return (
    <Card className={`${entity.status === 'error' ? 'border-red-300 dark:border-red-700' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getStatusBgColor(entity.status)}`}>
              <StatusIcon className={`w-5 h-5 ${getStatusColor(entity.status)} ${entity.status === 'syncing' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4
                className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onClick?.(entity)}
              >
                {entity.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBgColor(entity.status)} ${getStatusColor(entity.status)}`}>
                  {entity.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FlowIcon className="w-3 h-3" />
                  {entity.dataFlow}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSync?.(entity.id)}
            disabled={entity.status === 'syncing'}
          >
            <RefreshCw className={`w-4 h-4 ${entity.status === 'syncing' ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Record Counts */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
            <p className="text-xs text-blue-600">ERP Records</p>
            <p className="text-lg font-bold">{entity.erpCount.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
            <p className="text-xs text-purple-600">MES Records</p>
            <p className="text-lg font-bold">{entity.mesCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Sync Progress */}
        {entity.status === 'syncing' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Syncing...</span>
              <span>{Math.round((entity.metrics.syncedRecords / entity.metrics.totalRecords) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(entity.metrics.syncedRecords / entity.metrics.totalRecords) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Last Sync</p>
            <p className="font-medium">{formatTime(entity.lastSync)}</p>
          </div>
          <div>
            <p className="text-gray-500">Interval</p>
            <p className="font-medium">{entity.syncInterval >= 1 ? `${entity.syncInterval}m` : `${Math.round(entity.syncInterval * 60)}s`}</p>
          </div>
          <div>
            <p className="text-gray-500">Throughput</p>
            <p className="font-medium">{entity.metrics.throughput}/min</p>
          </div>
        </div>

        {/* Conflicts Warning */}
        {entity.conflicts > 0 && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            {entity.conflicts} data conflict{entity.conflicts > 1 ? 's' : ''} detected
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Sync Events Log Component
// ============================================================================

function SyncEventsLog({
  events,
  onEventClick,
}: {
  events: SyncEvent[];
  onEventClick?: (event: SyncEvent) => void;
}) {
  const getEventIcon = (action: SyncEvent['action']) => {
    switch (action) {
      case 'create': return <ArrowUp className="w-3 h-3" />;
      case 'update': return <RefreshCw className="w-3 h-3" />;
      case 'delete': return <XCircle className="w-3 h-3" />;
      case 'sync': return <ArrowRightLeft className="w-3 h-3" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Sync Events
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {events.map(event => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                event.status === 'failed' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' :
                event.status === 'pending' ? 'border-amber-200 dark:border-amber-800' : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${
                    event.status === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/50' :
                    event.status === 'failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/50' :
                    'bg-amber-100 text-amber-600 dark:bg-amber-900/50'
                  }`}>
                    {getEventIcon(event.action)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.recordName}</p>
                    <p className="text-xs text-gray-500">
                      <span className="capitalize">{event.entityType.replace('-', ' ')}</span> • {event.action}
                    </p>
                    {event.details && (
                      <p className="text-xs text-red-600 mt-1">{event.details}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatTime(event.timestamp)}</p>
                  {event.duration && (
                    <p className="text-xs text-gray-400">{event.duration}ms</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function MESIntegrationDashboard({
  onEntityClick,
  onSyncTrigger,
  onEventClick,
}: MESIntegrationDashboardProps) {
  const [entities, setEntities] = useState<DataEntity[]>([]);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const [connections, setConnections] = useState<MESConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setEntities(generateMockEntities());
    setEvents(generateMockEvents());
    setConnections(generateMockConnections());
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = (entityId: string) => {
    console.log('Triggering sync for:', entityId);
    onSyncTrigger?.(entityId);
  };

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
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              MES Integration Dashboard
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SyncOverview entities={entities} />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Entity Cards */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map(entity => (
              <EntitySyncCard
                key={entity.id}
                entity={entity}
                onSync={handleSync}
                onClick={onEntityClick}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <ConnectionStatus connections={connections} />
          <SyncEventsLog events={events} onEventClick={onEventClick} />
        </div>
      </div>
    </div>
  );
}
