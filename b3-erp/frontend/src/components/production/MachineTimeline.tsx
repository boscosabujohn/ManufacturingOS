'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Clock,
  Zap,
  Wrench,
  Coffee,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  XCircle
} from 'lucide-react';

export interface MachineEvent {
  id: string;
  machineId: string;
  type: 'production' | 'idle' | 'setup' | 'breakdown' | 'maintenance' | 'break' | 'quality-check';
  startTime: Date;
  endTime: Date;
  workOrderNumber?: string;
  product?: string;
  operator?: string;
  reason?: string;
  output?: number;
  plannedOutput?: number;
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  currentShift?: string;
  utilization?: number;
}

interface MachineTimelineProps {
  machines: Machine[];
  events: MachineEvent[];
  date?: Date;
  shiftStart?: number; // Hour (0-23)
  shiftEnd?: number; // Hour (0-23)
  onEventClick?: (event: MachineEvent) => void;
  onMachineClick?: (machine: Machine) => void;
  showLegend?: boolean;
  className?: string;
}

/**
 * MachineTimeline - Visual timeline showing machine utilization
 */
export function MachineTimeline({
  machines,
  events,
  date = new Date(),
  shiftStart = 6,
  shiftEnd = 22,
  onEventClick,
  onMachineClick,
  showLegend = true,
  className = ''
}: MachineTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<MachineEvent | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentDate, setCurrentDate] = useState(date);
  const [filterType, setFilterType] = useState<string>('all');

  // Calculate hours to display
  const hours = useMemo(() => {
    const h: number[] = [];
    let hour = shiftStart;
    while (hour !== shiftEnd) {
      h.push(hour);
      hour = (hour + 1) % 24;
      if (h.length > 24) break; // Safety
    }
    h.push(shiftEnd);
    return h;
  }, [shiftStart, shiftEnd]);

  const totalHours = hours.length - 1;
  const hourWidth = 80 * zoom;

  // Event colors
  const eventColors: Record<MachineEvent['type'], { bg: string; border: string; text: string }> = {
    production: { bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-700' },
    idle: { bg: 'bg-gray-300', border: 'border-gray-400', text: 'text-gray-600' },
    setup: { bg: 'bg-blue-400', border: 'border-blue-500', text: 'text-blue-700' },
    breakdown: { bg: 'bg-red-500', border: 'border-red-600', text: 'text-red-700' },
    maintenance: { bg: 'bg-orange-400', border: 'border-orange-500', text: 'text-orange-700' },
    break: { bg: 'bg-purple-400', border: 'border-purple-500', text: 'text-purple-700' },
    'quality-check': { bg: 'bg-cyan-400', border: 'border-cyan-500', text: 'text-cyan-700' }
  };

  // Event icons
  const eventIcons: Record<MachineEvent['type'], React.ReactNode> = {
    production: <Play className="w-3 h-3" />,
    idle: <Pause className="w-3 h-3" />,
    setup: <Settings className="w-3 h-3" />,
    breakdown: <XCircle className="w-3 h-3" />,
    maintenance: <Wrench className="w-3 h-3" />,
    break: <Coffee className="w-3 h-3" />,
    'quality-check': <AlertTriangle className="w-3 h-3" />
  };

  // Calculate event position
  const getEventPosition = (event: MachineEvent) => {
    const dayStart = new Date(currentDate);
    dayStart.setHours(shiftStart, 0, 0, 0);

    const startMinutes = (event.startTime.getTime() - dayStart.getTime()) / (1000 * 60);
    const endMinutes = (event.endTime.getTime() - dayStart.getTime()) / (1000 * 60);
    const totalMinutes = totalHours * 60;

    const left = (startMinutes / totalMinutes) * 100;
    const width = ((endMinutes - startMinutes) / totalMinutes) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - Math.max(0, left), Math.max(width, 0.5))}%`
    };
  };

  // Filter events by date and machine
  const getEventsForMachine = (machineId: string) => {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter(e =>
      e.machineId === machineId &&
      e.startTime >= dayStart &&
      e.startTime <= dayEnd &&
      (filterType === 'all' || e.type === filterType)
    );
  };

  // Calculate utilization for a machine
  const calculateUtilization = (machineId: string) => {
    const machineEvents = getEventsForMachine(machineId);
    const productionMinutes = machineEvents
      .filter(e => e.type === 'production')
      .reduce((sum, e) => {
        return sum + (e.endTime.getTime() - e.startTime.getTime()) / (1000 * 60);
      }, 0);

    const totalMinutes = totalHours * 60;
    return (productionMinutes / totalMinutes) * 100;
  };

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Current time marker position
  const getCurrentTimePosition = () => {
    const now = new Date();
    if (now.toDateString() !== currentDate.toDateString()) return null;

    const dayStart = new Date(currentDate);
    dayStart.setHours(shiftStart, 0, 0, 0);

    const minutesSinceStart = (now.getTime() - dayStart.getTime()) / (1000 * 60);
    const totalMinutes = totalHours * 60;

    if (minutesSinceStart < 0 || minutesSinceStart > totalMinutes) return null;

    return (minutesSinceStart / totalMinutes) * 100;
  };

  const currentTimePos = getCurrentTimePosition();

  // Format duration
  const formatDuration = (start: Date, end: Date) => {
    const minutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Machine Utilization Timeline</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
            >
              <option value="all">All Events</option>
              <option value="production">Production</option>
              <option value="idle">Idle</option>
              <option value="setup">Setup</option>
              <option value="breakdown">Breakdown</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2, prev + 0.25))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]" style={{ width: `${hourWidth * hours.length + 200}px` }}>
          {/* Time Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="w-[200px] flex-shrink-0 p-3 border-r border-gray-200 font-medium text-sm text-gray-700">
              Machine
            </div>
            <div className="flex-1 flex relative">
              {hours.map((hour, idx) => (
                <div
                  key={idx}
                  className="border-r border-gray-200 text-center text-xs text-gray-600 py-2"
                  style={{ width: hourWidth }}
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Machine Rows */}
          {machines.map(machine => {
            const machineEvents = getEventsForMachine(machine.id);
            const utilization = calculateUtilization(machine.id);
            const isSelected = selectedMachine === machine.id;

            return (
              <div
                key={machine.id}
                className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {/* Machine Info */}
                <div
                  className="w-[200px] flex-shrink-0 p-3 border-r border-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedMachine(isSelected ? null : machine.id);
                    onMachineClick?.(machine);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      machine.status === 'running' ? 'bg-green-500' :
                      machine.status === 'idle' ? 'bg-gray-400' :
                      machine.status === 'maintenance' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{machine.name}</div>
                      <div className="text-xs text-gray-500">{machine.code}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Utilization</span>
                      <span className={`font-medium ${
                        utilization >= 80 ? 'text-green-600' :
                        utilization >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{utilization.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          utilization >= 80 ? 'bg-green-500' :
                          utilization >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 relative h-20" style={{ width: hourWidth * hours.length }}>
                  {/* Hour grid lines */}
                  <div className="absolute inset-0 flex">
                    {hours.map((_, idx) => (
                      <div
                        key={idx}
                        className="border-r border-gray-100"
                        style={{ width: hourWidth }}
                      />
                    ))}
                  </div>

                  {/* Events */}
                  {machineEvents.map(event => {
                    const pos = getEventPosition(event);
                    const colors = eventColors[event.type];
                    const isHovered = hoveredEvent?.id === event.id;

                    return (
                      <div
                        key={event.id}
                        className={`absolute top-3 h-14 rounded-lg ${colors.bg} cursor-pointer transition-all border-2 ${
                          isHovered ? `${colors.border} shadow-lg scale-[1.02]` : 'border-transparent'
                        }`}
                        style={{
                          left: pos.left,
                          width: pos.width,
                          minWidth: '20px'
                        }}
                        onClick={() => onEventClick?.(event)}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        <div className="h-full flex items-center justify-center gap-1 px-2 overflow-hidden">
                          <span className="text-white">{eventIcons[event.type]}</span>
                          {parseFloat(pos.width) > 5 && (
                            <span className="text-xs font-medium text-white truncate">
                              {event.workOrderNumber || event.type}
                            </span>
                          )}
                        </div>

                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg whitespace-nowrap">
                              <div className="font-semibold mb-1 capitalize">{event.type.replace('-', ' ')}</div>
                              <div className="text-gray-300">
                                {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {' - '}
                                {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-gray-400 mt-1">
                                Duration: {formatDuration(event.startTime, event.endTime)}
                              </div>
                              {event.workOrderNumber && (
                                <div className="text-gray-300 mt-1">WO: {event.workOrderNumber}</div>
                              )}
                              {event.output !== undefined && (
                                <div className="text-gray-300">
                                  Output: {event.output}{event.plannedOutput ? ` / ${event.plannedOutput}` : ''}
                                </div>
                              )}
                              {event.reason && (
                                <div className="text-gray-400 mt-1">{event.reason}</div>
                              )}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Current time marker */}
                  {currentTimePos !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                      style={{ left: `${currentTimePos}%` }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded whitespace-nowrap">
                        Now
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            {Object.entries(eventColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colors.bg}`} />
                <span className="capitalize text-gray-600">{type.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              Avg. Utilization: <span className="font-semibold text-gray-900">
                {machines.length > 0
                  ? (machines.reduce((sum, m) => sum + calculateUtilization(m.id), 0) / machines.length).toFixed(1)
                  : 0}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">
              Total Machines: <span className="font-semibold text-gray-900">{machines.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              Running: <span className="font-semibold text-gray-900">
                {machines.filter(m => m.status === 'running').length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">
              Issues: <span className="font-semibold text-gray-900">
                {machines.filter(m => m.status === 'breakdown').length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MachineTimeline;
