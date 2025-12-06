'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Layers,
  Grid3X3,
  Move,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Wrench,
  XCircle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type MachineStatus = 'running' | 'idle' | 'warning' | 'error' | 'maintenance' | 'offline';

export interface FloorMachine {
  id: string;
  name: string;
  type: string;
  x: number; // Percentage position
  y: number;
  width: number;
  height: number;
  rotation: number;
  status: MachineStatus;
  efficiency: number;
  currentJob?: string;
  operator?: string;
}

export interface FloorZone {
  id: string;
  name: string;
  type: 'production' | 'storage' | 'staging' | 'quality' | 'office' | 'maintenance';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface FactoryFloor3DProps {
  floorId?: string;
  onMachineClick?: (machine: FloorMachine) => void;
  onZoneClick?: (zone: FloorZone) => void;
}

// ============================================================================
// Status Configuration
// ============================================================================

const statusColors: Record<MachineStatus, { fill: string; stroke: string; glow: string }> = {
  running: { fill: '#22c55e', stroke: '#16a34a', glow: '#4ade80' },
  idle: { fill: '#eab308', stroke: '#ca8a04', glow: '#facc15' },
  warning: { fill: '#f97316', stroke: '#ea580c', glow: '#fb923c' },
  error: { fill: '#ef4444', stroke: '#dc2626', glow: '#f87171' },
  maintenance: { fill: '#3b82f6', stroke: '#2563eb', glow: '#60a5fa' },
  offline: { fill: '#6b7280', stroke: '#4b5563', glow: '#9ca3af' },
};

const statusIcons: Record<MachineStatus, React.ElementType> = {
  running: CheckCircle,
  idle: Eye,
  warning: AlertTriangle,
  error: XCircle,
  maintenance: Wrench,
  offline: EyeOff,
};

// ============================================================================
// Machine 3D Component
// ============================================================================

function Machine3D({
  machine,
  scale,
  isSelected,
  onClick,
  showLabels,
}: {
  machine: FloorMachine;
  scale: number;
  isSelected: boolean;
  onClick: () => void;
  showLabels: boolean;
}) {
  const colors = statusColors[machine.status];
  const StatusIcon = statusIcons[machine.status];

  // Calculate 3D-ish appearance with isometric projection
  const depth = 20 * scale;
  const x = machine.x;
  const y = machine.y;
  const w = machine.width;
  const h = machine.height;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer transition-all duration-300"
      style={{ transform: `rotate(${machine.rotation}deg)`, transformOrigin: `${x + w/2}% ${y + h/2}%` }}
    >
      {/* Machine shadow */}
      <rect
        x={`${x + 1}%`}
        y={`${y + 1}%`}
        width={`${w}%`}
        height={`${h}%`}
        fill="rgba(0,0,0,0.2)"
        rx="4"
      />

      {/* Machine side (3D effect) */}
      <polygon
        points={`
          ${x + w}%,${y}%
          ${x + w + 2}%,${y - 1.5}%
          ${x + w + 2}%,${y + h - 1.5}%
          ${x + w}%,${y + h}%
        `}
        fill={colors.stroke}
        opacity="0.7"
      />

      {/* Machine top (3D effect) */}
      <polygon
        points={`
          ${x}%,${y}%
          ${x + 2}%,${y - 1.5}%
          ${x + w + 2}%,${y - 1.5}%
          ${x + w}%,${y}%
        `}
        fill={colors.glow}
        opacity="0.5"
      />

      {/* Machine body */}
      <rect
        x={`${x}%`}
        y={`${y}%`}
        width={`${w}%`}
        height={`${h}%`}
        fill={colors.fill}
        stroke={isSelected ? '#fff' : colors.stroke}
        strokeWidth={isSelected ? 3 : 1.5}
        rx="4"
        className={machine.status === 'running' ? 'animate-pulse' : ''}
      />

      {/* Selection glow */}
      {isSelected && (
        <rect
          x={`${x - 0.5}%`}
          y={`${y - 0.5}%`}
          width={`${w + 1}%`}
          height={`${h + 1}%`}
          fill="none"
          stroke={colors.glow}
          strokeWidth="2"
          rx="6"
          className="animate-pulse"
          opacity="0.7"
        />
      )}

      {/* Status indicator */}
      <circle
        cx={`${x + w - 2}%`}
        cy={`${y + 2}%`}
        r="8"
        fill={colors.fill}
        stroke="#fff"
        strokeWidth="2"
        className={machine.status === 'running' || machine.status === 'error' ? 'animate-pulse' : ''}
      />

      {/* Machine label */}
      {showLabels && (
        <g>
          <rect
            x={`${x}%`}
            y={`${y + h + 1}%`}
            width={`${w}%`}
            height="4%"
            fill="rgba(0,0,0,0.7)"
            rx="2"
          />
          <text
            x={`${x + w/2}%`}
            y={`${y + h + 3.5}%`}
            fill="white"
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {machine.name}
          </text>
        </g>
      )}
    </g>
  );
}

// ============================================================================
// Floor Zone Component
// ============================================================================

function FloorZone3D({
  zone,
  onClick,
  showLabels,
}: {
  zone: FloorZone;
  onClick: () => void;
  showLabels: boolean;
}) {
  const zoneColors: Record<string, string> = {
    production: 'rgba(59, 130, 246, 0.2)',
    storage: 'rgba(139, 92, 246, 0.2)',
    staging: 'rgba(234, 179, 8, 0.2)',
    quality: 'rgba(34, 197, 94, 0.2)',
    office: 'rgba(107, 114, 128, 0.2)',
    maintenance: 'rgba(249, 115, 22, 0.2)',
  };

  const borderColors: Record<string, string> = {
    production: 'rgba(59, 130, 246, 0.5)',
    storage: 'rgba(139, 92, 246, 0.5)',
    staging: 'rgba(234, 179, 8, 0.5)',
    quality: 'rgba(34, 197, 94, 0.5)',
    office: 'rgba(107, 114, 128, 0.5)',
    maintenance: 'rgba(249, 115, 22, 0.5)',
  };

  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect
        x={`${zone.x}%`}
        y={`${zone.y}%`}
        width={`${zone.width}%`}
        height={`${zone.height}%`}
        fill={zoneColors[zone.type]}
        stroke={borderColors[zone.type]}
        strokeWidth="2"
        strokeDasharray="5,5"
        rx="4"
      />
      {showLabels && (
        <text
          x={`${zone.x + zone.width / 2}%`}
          y={`${zone.y + 3}%`}
          fill={borderColors[zone.type].replace('0.5', '1')}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          {zone.name}
        </text>
      )}
    </g>
  );
}

// ============================================================================
// Factory Floor 3D View Component
// ============================================================================

export function FactoryFloor3D({
  floorId = 'floor-1',
  onMachineClick,
  onZoneClick,
}: FactoryFloor3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [machines, setMachines] = useState<FloorMachine[]>([]);
  const [zones, setZones] = useState<FloorZone[]>([]);

  // Initialize floor data
  useEffect(() => {
    const initialZones: FloorZone[] = [
      { id: 'z1', name: 'CNC Production', type: 'production', x: 5, y: 5, width: 40, height: 40, color: 'blue' },
      { id: 'z2', name: 'Assembly Area', type: 'production', x: 50, y: 5, width: 45, height: 25, color: 'blue' },
      { id: 'z3', name: 'Raw Material Storage', type: 'storage', x: 5, y: 50, width: 25, height: 25, color: 'purple' },
      { id: 'z4', name: 'Staging Area', type: 'staging', x: 35, y: 50, width: 20, height: 25, color: 'yellow' },
      { id: 'z5', name: 'Quality Control', type: 'quality', x: 60, y: 35, width: 35, height: 20, color: 'green' },
      { id: 'z6', name: 'Finished Goods', type: 'storage', x: 60, y: 60, width: 35, height: 20, color: 'purple' },
      { id: 'z7', name: 'Maintenance Bay', type: 'maintenance', x: 5, y: 80, width: 20, height: 15, color: 'orange' },
    ];

    const initialMachines: FloorMachine[] = [
      { id: 'm1', name: 'CNC Mill 01', type: 'CNC Mill', x: 8, y: 10, width: 10, height: 12, rotation: 0, status: 'running', efficiency: 92, currentJob: 'WO-4521', operator: 'John D.' },
      { id: 'm2', name: 'CNC Mill 02', type: 'CNC Mill', x: 22, y: 10, width: 10, height: 12, rotation: 0, status: 'running', efficiency: 88, currentJob: 'WO-4522', operator: 'Sarah M.' },
      { id: 'm3', name: 'CNC Lathe 01', type: 'CNC Lathe', x: 8, y: 28, width: 10, height: 12, rotation: 0, status: 'idle', efficiency: 0, operator: 'Mike R.' },
      { id: 'm4', name: 'CNC Lathe 02', type: 'CNC Lathe', x: 22, y: 28, width: 10, height: 12, rotation: 0, status: 'warning', efficiency: 65, currentJob: 'WO-4523' },
      { id: 'm5', name: 'Press 01', type: 'Press', x: 36, y: 15, width: 8, height: 10, rotation: 0, status: 'running', efficiency: 95, currentJob: 'WO-4524' },
      { id: 'm6', name: 'Welder 01', type: 'Welder', x: 55, y: 10, width: 8, height: 8, rotation: 0, status: 'running', efficiency: 90, currentJob: 'WO-4525' },
      { id: 'm7', name: 'Welder 02', type: 'Welder', x: 68, y: 10, width: 8, height: 8, rotation: 0, status: 'maintenance', efficiency: 0 },
      { id: 'm8', name: 'Assembly Station 1', type: 'Assembly', x: 82, y: 10, width: 10, height: 8, rotation: 0, status: 'running', efficiency: 85, currentJob: 'WO-4526' },
      { id: 'm9', name: 'QC Station', type: 'Inspection', x: 70, y: 40, width: 12, height: 10, rotation: 0, status: 'running', efficiency: 98 },
      { id: 'm10', name: 'Grinder 01', type: 'Grinder', x: 36, y: 30, width: 7, height: 8, rotation: 0, status: 'error', efficiency: 0 },
      { id: 'm11', name: 'Packaging', type: 'Packaging', x: 75, y: 65, width: 15, height: 10, rotation: 0, status: 'running', efficiency: 91, currentJob: 'WO-4527' },
    ];

    setZones(initialZones);
    setMachines(initialMachines);
  }, []);

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => {
        if (Math.random() > 0.9) {
          const statuses: MachineStatus[] = ['running', 'running', 'running', 'idle', 'warning'];
          return {
            ...m,
            status: m.status === 'error' || m.status === 'maintenance' ? m.status : statuses[Math.floor(Math.random() * statuses.length)],
            efficiency: m.status === 'running' ? 75 + Math.random() * 25 : m.efficiency,
          };
        }
        return m;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setSelectedMachine(null);
  };

  // Handle machine click
  const handleMachineClick = (machine: FloorMachine) => {
    setSelectedMachine(machine.id);
    onMachineClick?.(machine);
  };

  // Count machines by status
  const statusCounts = machines.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<MachineStatus, number>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">3D Factory Floor View</h2>
              <p className="text-sm text-slate-300">Floor: {floorId} | {machines.length} machines</p>
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex items-center gap-4">
            {(Object.entries(statusCounts) as [MachineStatus, number][]).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors[status].fill }}
                />
                <span className="text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={resetView}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-lg transition-colors ${showLabels ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
            title="Toggle Labels"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowZones(!showZones)}
            className={`p-2 rounded-lg transition-colors ${showZones ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
            title="Toggle Zones"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
            className={`p-2 rounded-lg transition-colors ${viewMode === '3d' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
            title="Toggle 3D View"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Move className="w-4 h-4" />
          <span>Drag to pan | Scroll to zoom</span>
          <span className="ml-4">Scale: {(scale * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Floor View */}
      <div
        ref={containerRef}
        className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => handleZoom(e.deltaY > 0 ? -0.05 : 0.05)}
      >
        {/* Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Zones */}
          {showZones && zones.map(zone => (
            <FloorZone3D
              key={zone.id}
              zone={zone}
              onClick={() => onZoneClick?.(zone)}
              showLabels={showLabels}
            />
          ))}

          {/* Machines */}
          {machines.map(machine => (
            <Machine3D
              key={machine.id}
              machine={machine}
              scale={scale}
              isSelected={selectedMachine === machine.id}
              onClick={() => handleMachineClick(machine)}
              showLabels={showLabels}
            />
          ))}
        </svg>

        {/* Selected Machine Info Panel */}
        {selectedMachine && (
          <div className="absolute top-4 right-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(() => {
              const machine = machines.find(m => m.id === selectedMachine);
              if (!machine) return null;
              const colors = statusColors[machine.status];
              const StatusIcon = statusIcons[machine.status];

              return (
                <>
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: colors.fill }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{machine.name}</h3>
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-white/80">{machine.type}</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium capitalize" style={{ color: colors.fill }}>{machine.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Efficiency</span>
                      <span className="font-medium">{machine.efficiency.toFixed(1)}%</span>
                    </div>
                    {machine.currentJob && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Current Job</span>
                        <span className="font-medium text-blue-600">{machine.currentJob}</span>
                      </div>
                    )}
                    {machine.operator && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Operator</span>
                        <span className="font-medium">{machine.operator}</span>
                      </div>
                    )}
                    <button
                      className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => onMachineClick?.(machine)}
                    >
                      View Details
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {(Object.entries(statusColors) as [MachineStatus, typeof statusColors.running][]).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.fill }}
              />
              <span className="text-gray-600 dark:text-gray-400 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FactoryFloor3D;
