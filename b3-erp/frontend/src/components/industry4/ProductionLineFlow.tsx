'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Package,
  Truck,
  Factory,
  Cog,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type StationStatus = 'active' | 'idle' | 'error' | 'maintenance';

export interface Station {
  id: string;
  name: string;
  type: 'input' | 'process' | 'quality' | 'output';
  status: StationStatus;
  processTime: number; // seconds
  currentItem?: string;
  itemsProcessed: number;
  efficiency: number;
}

export interface WorkItem {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  currentStation: number;
  progress: number; // 0-100
  color: string;
}

export interface ProductionLineFlowProps {
  lineId?: string;
  onStationClick?: (station: Station) => void;
  onItemClick?: (item: WorkItem) => void;
}

// ============================================================================
// Station Configuration
// ============================================================================

const stationTypeConfig: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  input: {
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  process: {
    icon: Cog,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  quality: {
    icon: ClipboardCheck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  output: {
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
};

const statusConfig: Record<StationStatus, {
  color: string;
  borderColor: string;
  label: string;
}> = {
  active: {
    color: 'bg-green-500',
    borderColor: 'border-green-500',
    label: 'Active',
  },
  idle: {
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    label: 'Idle',
  },
  error: {
    color: 'bg-red-500',
    borderColor: 'border-red-500',
    label: 'Error',
  },
  maintenance: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    label: 'Maintenance',
  },
};

// ============================================================================
// Animated Work Item Component
// ============================================================================

function AnimatedWorkItem({
  item,
  stationCount,
  containerWidth,
}: {
  item: WorkItem;
  stationCount: number;
  containerWidth: number;
}) {
  const stationWidth = containerWidth / stationCount;
  const basePosition = item.currentStation * stationWidth;
  const progressOffset = (item.progress / 100) * stationWidth;
  const position = basePosition + progressOffset - 20; // Center the item

  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-linear"
      style={{ left: `${position}px` }}
    >
      <div
        className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center ${
          item.status === 'rejected' ? 'bg-red-500' :
          item.status === 'completed' ? 'bg-green-500' : item.color
        }`}
      >
        <Box className="w-5 h-5 text-white" />
      </div>
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
          {item.name}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Station Component
// ============================================================================

function StationNode({
  station,
  isFirst,
  isLast,
  onClick,
}: {
  station: Station;
  isFirst: boolean;
  isLast: boolean;
  onClick?: () => void;
}) {
  const typeConfig = stationTypeConfig[station.type];
  const status = statusConfig[station.status];
  const Icon = typeConfig.icon;

  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Station Node */}
      <button
        onClick={onClick}
        className={`
          relative w-24 h-24 rounded-xl border-2 ${status.borderColor}
          ${typeConfig.bgColor} transition-all duration-300
          hover:shadow-lg hover:scale-105 cursor-pointer
        `}
      >
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1">
          <span className={`flex h-4 w-4 items-center justify-center`}>
            {station.status === 'active' && (
              <span className={`animate-ping absolute h-full w-full rounded-full ${status.color} opacity-75`} />
            )}
            <span className={`relative rounded-full h-3 w-3 ${status.color}`} />
          </span>
        </div>

        {/* Icon */}
        <div className="flex flex-col items-center justify-center h-full">
          <Icon className={`w-8 h-8 ${typeConfig.color}`} />
          {station.status === 'active' && station.currentItem && (
            <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2">
              <Cog className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Processing indicator */}
        {station.status === 'active' && station.currentItem && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-1000"
              style={{ width: `${(station.itemsProcessed % 10) * 10}%` }}
            />
          </div>
        )}
      </button>

      {/* Station Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{station.name}</p>
        <p className={`text-xs ${status.color.replace('bg-', 'text-')}`}>
          {status.label}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">
          {station.itemsProcessed} items | {station.efficiency}%
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Connector Arrow Component
// ============================================================================

function ConnectorArrow({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center w-16">
      <div className={`relative w-full h-1 ${isActive ? 'bg-green-400' : 'bg-gray-300'} rounded`}>
        {/* Animated flow particles */}
        {isActive && (
          <>
            <div className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-flow-1" />
            <div className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-flow-2" />
          </>
        )}
        <ArrowRight className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}

// ============================================================================
// Production Line Flow Component
// ============================================================================

export function ProductionLineFlow({
  lineId = 'line-1',
  onStationClick,
  onItemClick,
}: ProductionLineFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isRunning, setIsRunning] = useState(true);
  const [stations, setStations] = useState<Station[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [stats, setStats] = useState({
    totalProduced: 0,
    totalRejected: 0,
    throughput: 0,
  });

  // Initialize stations
  useEffect(() => {
    const initialStations: Station[] = [
      { id: 'raw-materials', name: 'Raw Materials', type: 'input', status: 'active', processTime: 5, itemsProcessed: 0, efficiency: 98 },
      { id: 'cutting', name: 'Cutting', type: 'process', status: 'active', processTime: 8, itemsProcessed: 0, efficiency: 94 },
      { id: 'machining', name: 'Machining', type: 'process', status: 'active', processTime: 12, itemsProcessed: 0, efficiency: 91 },
      { id: 'assembly', name: 'Assembly', type: 'process', status: 'active', processTime: 10, itemsProcessed: 0, efficiency: 96 },
      { id: 'qc', name: 'Quality Check', type: 'quality', status: 'active', processTime: 6, itemsProcessed: 0, efficiency: 99 },
      { id: 'shipping', name: 'Shipping', type: 'output', status: 'active', processTime: 4, itemsProcessed: 0, efficiency: 100 },
    ];
    setStations(initialStations);
  }, []);

  // Handle container resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning || stations.length === 0) return;

    const interval = setInterval(() => {
      // Randomly spawn new items
      if (Math.random() > 0.7 && workItems.filter(w => w.currentStation === 0 && w.progress < 50).length < 2) {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-cyan-500'];
        const newItem: WorkItem = {
          id: `item-${Date.now()}`,
          name: `Part #${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'processing',
          currentStation: 0,
          progress: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setWorkItems(prev => [...prev, newItem]);
      }

      // Update items progress
      setWorkItems(prev => {
        const updated = prev.map(item => {
          if (item.status === 'completed' || item.status === 'rejected') return item;

          let newProgress = item.progress + 5 + Math.random() * 5;
          let newStation = item.currentStation;
          let newStatus: WorkItem['status'] = item.status;

          if (newProgress >= 100) {
            if (newStation >= stations.length - 1) {
              // Item completed
              newStatus = Math.random() > 0.95 ? 'rejected' : 'completed';
              setStats(s => ({
                ...s,
                totalProduced: newStatus === 'completed' ? s.totalProduced + 1 : s.totalProduced,
                totalRejected: newStatus === 'rejected' ? s.totalRejected + 1 : s.totalRejected,
              }));
            } else {
              // Move to next station
              newStation += 1;
              newProgress = 0;

              // Update station stats
              setStations(prevStations => prevStations.map((s, i) =>
                i === item.currentStation
                  ? { ...s, itemsProcessed: s.itemsProcessed + 1 }
                  : s
              ));
            }
          }

          return {
            ...item,
            progress: newProgress,
            currentStation: newStation,
            status: newStatus,
          };
        });

        // Remove completed/rejected items after a delay
        return updated.filter(item => {
          if (item.status === 'processing' || item.status === 'pending') return true;
          return item.progress < 150;
        });
      });

      // Randomly update station status
      if (Math.random() > 0.98) {
        setStations(prev => {
          const idx = Math.floor(Math.random() * (prev.length - 2)) + 1;
          const statuses: StationStatus[] = ['active', 'idle', 'error'];
          return prev.map((s, i) =>
            i === idx ? { ...s, status: statuses[Math.floor(Math.random() * statuses.length)] } : s
          );
        });
      }

      // Calculate throughput
      setStats(s => ({
        ...s,
        throughput: Math.round(s.totalProduced / ((Date.now() % 60000) / 60000 + 1)),
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, stations.length, workItems]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Production Line Flow</h2>
              <p className="text-sm text-orange-100">Line: {lineId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>{stats.totalProduced}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-300" />
                <span>{stats.totalRejected}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{stats.throughput}/min</span>
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isRunning ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Production Line Visualization */}
      <div className="p-6">
        {/* Stations */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-between mb-8"
        >
          {stations.map((station, index) => (
            <React.Fragment key={station.id}>
              <StationNode
                station={station}
                isFirst={index === 0}
                isLast={index === stations.length - 1}
                onClick={() => onStationClick?.(station)}
              />
              {index < stations.length - 1 && (
                <ConnectorArrow isActive={station.status === 'active'} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Work Items Flow Track */}
        <div className="relative h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Track */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 mx-4 rounded-full">
              {/* Flow animation */}
              <div className="h-full w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-flow-track" />
              </div>
            </div>
          </div>

          {/* Work Items */}
          {workItems.map(item => (
            <AnimatedWorkItem
              key={item.id}
              item={item}
              stationCount={stations.length}
              containerWidth={containerWidth}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {(Object.keys(statusConfig) as StationStatus[]).map(status => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig[status].color}`} />
                <span className="text-gray-600 dark:text-gray-400">{statusConfig[status].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes flow-1 {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flow-2 {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flow-track {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-flow-1 {
          animation: flow-1 1.5s linear infinite;
        }
        .animate-flow-2 {
          animation: flow-2 1.5s linear infinite 0.75s;
        }
        .animate-flow-track {
          animation: flow-track 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default ProductionLineFlow;
