'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Zap,
  Thermometer,
  Clock,
  TrendingUp,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type MachineStatus = 'running' | 'idle' | 'warning' | 'error' | 'maintenance' | 'offline';

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  efficiency: number;
  temperature: number;
  powerConsumption: number;
  cycleTime: number;
  partsProduced: number;
  targetParts: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  alerts: string[];
  operator?: string;
}

export interface MachineStatusGridProps {
  productionLineId?: string;
  refreshInterval?: number;
  onMachineClick?: (machine: Machine) => void;
  onAlertClick?: (machineId: string, alert: string) => void;
}

// ============================================================================
// Status Configuration
// ============================================================================

const statusConfig: Record<MachineStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  pulseColor: string;
}> = {
  running: {
    label: 'Running',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    icon: CheckCircle,
    pulseColor: 'bg-green-500',
  },
  idle: {
    label: 'Idle',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    icon: Clock,
    pulseColor: 'bg-yellow-500',
  },
  warning: {
    label: 'Warning',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    icon: AlertTriangle,
    pulseColor: 'bg-orange-500',
  },
  error: {
    label: 'Error',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    icon: XCircle,
    pulseColor: 'bg-red-500',
  },
  maintenance: {
    label: 'Maintenance',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    icon: Wrench,
    pulseColor: 'bg-blue-500',
  },
  offline: {
    label: 'Offline',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
    icon: XCircle,
    pulseColor: 'bg-gray-400',
  },
};

// ============================================================================
// Machine Card Component
// ============================================================================

function MachineCard({
  machine,
  onClick,
  onAlertClick,
}: {
  machine: Machine;
  onClick?: () => void;
  onAlertClick?: (alert: string) => void;
}) {
  const config = statusConfig[machine.status];
  const StatusIcon = config.icon;
  const progressPercent = (machine.partsProduced / machine.targetParts) * 100;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-xl border-2 ${config.borderColor} ${config.bgColor}
        cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
        dark:bg-gray-800 dark:border-opacity-50
      `}
    >
      {/* Status Indicator with Pulse */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {machine.status === 'running' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${config.pulseColor}`} />
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-12 h-12 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
          <Cpu className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{machine.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{machine.type}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {config.label}
      </div>

      {/* Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Efficiency</p>
            <p className={`text-sm font-semibold ${machine.efficiency >= 85 ? 'text-green-600' : machine.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {machine.efficiency.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Temp</p>
            <p className={`text-sm font-semibold ${machine.temperature <= 60 ? 'text-green-600' : machine.temperature <= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
              {machine.temperature}°C
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Power</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {machine.powerConsumption}kW
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Cycle</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {machine.cycleTime}s
            </p>
          </div>
        </div>
      </div>

      {/* Production Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Production</span>
          <span>{machine.partsProduced} / {machine.targetParts}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent >= 90 ? 'bg-green-500' :
              progressPercent >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {machine.alerts.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">{machine.alerts.length} Alert(s)</span>
          </div>
          <div className="space-y-1">
            {machine.alerts.slice(0, 2).map((alert, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onAlertClick?.(alert);
                }}
                className="w-full text-left text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded truncate hover:bg-red-100"
              >
                {alert}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Operator */}
      {machine.operator && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500">
            Operator: <span className="font-medium text-gray-700 dark:text-gray-300">{machine.operator}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Machine Status Grid Component
// ============================================================================

export function MachineStatusGrid({
  productionLineId = 'line-1',
  refreshInterval = 3000,
  onMachineClick,
  onAlertClick,
}: MachineStatusGridProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<MachineStatus | 'all'>('all');

  // Generate simulated machine data
  const generateMachineData = useCallback((): Machine[] => {
    const machineTypes = ['CNC Mill', 'CNC Lathe', 'Press', 'Welder', 'Assembly', 'Inspection'];
    const operators = ['John D.', 'Sarah M.', 'Mike R.', 'Emily K.', 'Chris P.', null];
    const alerts = [
      'Temperature exceeding threshold',
      'Maintenance overdue',
      'Low coolant level',
      'Vibration anomaly detected',
      'Power fluctuation',
    ];

    return Array.from({ length: 12 }, (_, i) => {
      const randomStatus = (): MachineStatus => {
        const rand = Math.random();
        if (rand > 0.7) return 'running';
        if (rand > 0.5) return 'running';
        if (rand > 0.35) return 'idle';
        if (rand > 0.2) return 'warning';
        if (rand > 0.1) return 'maintenance';
        if (rand > 0.05) return 'error';
        return 'offline';
      };

      const status = randomStatus();
      const hasAlerts = status === 'warning' || status === 'error' || Math.random() > 0.8;

      return {
        id: `machine-${i + 1}`,
        name: `Machine ${String(i + 1).padStart(2, '0')}`,
        type: machineTypes[i % machineTypes.length],
        status,
        efficiency: status === 'running' ? 75 + Math.random() * 20 : status === 'idle' ? 0 : 40 + Math.random() * 30,
        temperature: 45 + Math.random() * 35,
        powerConsumption: status === 'running' ? 15 + Math.random() * 10 : status === 'idle' ? 2 : 8 + Math.random() * 5,
        cycleTime: 30 + Math.random() * 60,
        partsProduced: Math.floor(Math.random() * 800),
        targetParts: 1000,
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        alerts: hasAlerts ? alerts.slice(0, Math.floor(Math.random() * 3) + 1) : [],
        operator: operators[Math.floor(Math.random() * operators.length)] || undefined,
      };
    });
  }, []);

  // Fetch/update machine data
  useEffect(() => {
    const fetchData = () => {
      setMachines(generateMachineData());
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [generateMachineData, refreshInterval]);

  // Filter machines
  const filteredMachines = machines.filter(m =>
    statusFilter === 'all' ? true : m.status === statusFilter
  );

  // Status summary
  const statusSummary = machines.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<MachineStatus, number>);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading machine data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Machine Status Grid</h2>
              <p className="text-sm text-indigo-100">Production Line: {productionLineId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-indigo-200">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Summary Bar */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            All ({machines.length})
          </button>

          {(Object.keys(statusConfig) as MachineStatus[]).map(status => {
            const count = statusSummary[status] || 0;
            const config = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === status
                    ? `${config.bgColor} ${config.color} border ${config.borderColor}`
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${config.pulseColor}`} />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Machine Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredMachines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onClick={() => onMachineClick?.(machine)}
              onAlertClick={(alert) => onAlertClick?.(machine.id, alert)}
            />
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Cpu className="w-12 h-12 mb-3 text-gray-300" />
            <p>No machines match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MachineStatusGrid;
