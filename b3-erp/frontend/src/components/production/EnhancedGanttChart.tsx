'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Calendar,
  Filter,
  Download,
  Maximize2,
  GripVertical,
  Link,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pause,
  MoreHorizontal
} from 'lucide-react';

export interface GanttTask {
  id: string;
  name: string;
  workOrderNumber?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'paused';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignee?: string;
  resource?: string;
  dependencies?: string[]; // Array of task IDs this task depends on
  color?: string;
  group?: string;
  milestone?: boolean;
  metadata?: Record<string, any>;
}

export interface GanttGroup {
  id: string;
  name: string;
  collapsed?: boolean;
}

interface EnhancedGanttChartProps {
  tasks: GanttTask[];
  groups?: GanttGroup[];
  onTaskClick?: (task: GanttTask) => void;
  onTaskUpdate?: (task: GanttTask) => void;
  onTaskDragEnd?: (task: GanttTask, newStartDate: Date, newEndDate: Date) => void;
  onDependencyCreate?: (fromTaskId: string, toTaskId: string) => void;
  viewMode?: 'day' | 'week' | 'month';
  showDependencies?: boolean;
  enableDragDrop?: boolean;
  enableDependencyCreation?: boolean;
  height?: number | string;
  todayMarker?: boolean;
  className?: string;
}

type ViewMode = 'day' | 'week' | 'month';

export function EnhancedGanttChart({
  tasks = [],
  groups = [],
  onTaskClick,
  onTaskUpdate,
  onTaskDragEnd,
  onDependencyCreate,
  viewMode: initialViewMode = 'week',
  showDependencies = true,
  enableDragDrop = true,
  enableDependencyCreation = true,
  height = 600,
  todayMarker = true,
  className = ''
}: EnhancedGanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragType, setDragType] = useState<'move' | 'resize-start' | 'resize-end' | null>(null);
  const [creatingDependency, setCreatingDependency] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Calculate timeline range based on tasks
  const timelineRange = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0)
      };
    }

    const starts = tasks.map(t => t.startDate.getTime());
    const ends = tasks.map(t => t.endDate.getTime());

    const minDate = new Date(Math.min(...starts));
    const maxDate = new Date(Math.max(...ends));

    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 14);

    return { start: minDate, end: maxDate };
  }, [tasks]);

  // Generate timeline columns
  const timelineColumns = useMemo(() => {
    const columns: { date: Date; label: string; isWeekend: boolean; isToday: boolean }[] = [];
    const { start, end } = timelineRange;
    const current = new Date(start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (current <= end) {
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isToday = current.getTime() === today.getTime();

      let label = '';
      if (viewMode === 'day') {
        label = current.toLocaleDateString('en-US', { day: 'numeric' });
      } else if (viewMode === 'week') {
        if (current.getDay() === 1 || columns.length === 0) {
          label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      } else {
        if (current.getDate() === 1) {
          label = current.toLocaleDateString('en-US', { month: 'short' });
        }
      }

      columns.push({
        date: new Date(current),
        label,
        isWeekend,
        isToday
      });

      current.setDate(current.getDate() + 1);
    }

    return columns;
  }, [timelineRange, viewMode]);

  // Column width based on view mode and zoom
  const columnWidth = useMemo(() => {
    const baseWidth = viewMode === 'day' ? 40 : viewMode === 'week' ? 24 : 8;
    return baseWidth * zoom;
  }, [viewMode, zoom]);

  // Calculate task position
  const getTaskPosition = useCallback((task: GanttTask) => {
    const { start } = timelineRange;
    const startDiff = Math.floor((task.startDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      left: startDiff * columnWidth,
      width: Math.max(duration * columnWidth - 4, 20)
    };
  }, [timelineRange, columnWidth]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groups.length === 0) {
      return [{ group: null, tasks }];
    }

    const grouped: { group: GanttGroup | null; tasks: GanttTask[] }[] = [];
    const tasksByGroup = new Map<string, GanttTask[]>();

    tasks?.forEach(task => {
      const groupId = task.group || 'ungrouped';
      if (!tasksByGroup.has(groupId)) {
        tasksByGroup.set(groupId, []);
      }
      tasksByGroup.get(groupId)!.push(task);
    });

    groups.forEach(group => {
      grouped.push({
        group,
        tasks: tasksByGroup.get(group.id) || []
      });
    });

    const ungrouped = tasksByGroup.get('ungrouped');
    if (ungrouped) {
      grouped.push({ group: null, tasks: ungrouped });
    }

    return grouped;
  }, [tasks, groups]);

  // Status colors
  const getStatusColor = (status: GanttTask['status']) => {
    const colors = {
      'not-started': 'bg-gray-400',
      'in-progress': 'bg-blue-500',
      'completed': 'bg-green-500',
      'delayed': 'bg-red-500',
      'paused': 'bg-yellow-500'
    };
    return colors[status];
  };

  const getStatusBgColor = (status: GanttTask['status']) => {
    const colors = {
      'not-started': '#9ca3af',
      'in-progress': '#3b82f6',
      'completed': '#22c55e',
      'delayed': '#ef4444',
      'paused': '#eab308'
    };
    return colors[status];
  };

  // Priority border
  const getPriorityBorder = (priority: GanttTask['priority']) => {
    const colors = {
      urgent: 'border-l-4 border-l-red-500',
      high: 'border-l-4 border-l-orange-500',
      medium: 'border-l-4 border-l-blue-400',
      low: 'border-l-4 border-l-gray-400'
    };
    return colors[priority];
  };

  // Handle task drag
  const handleTaskMouseDown = (e: React.MouseEvent, taskId: string, type: 'move' | 'resize-start' | 'resize-end') => {
    if (!enableDragDrop) return;

    e.preventDefault();
    e.stopPropagation();

    setDraggingTask(taskId);
    setDragStartX(e.clientX);
    setDragType(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingTask || !dragType) return;

    const task = tasks.find(t => t.id === draggingTask);
    if (!task) return;

    const deltaX = e.clientX - dragStartX;
    const deltaDays = Math.round(deltaX / columnWidth);

    if (deltaDays === 0) return;

    const newTask = { ...task };

    if (dragType === 'move') {
      newTask.startDate = new Date(task.startDate);
      newTask.startDate.setDate(newTask.startDate.getDate() + deltaDays);
      newTask.endDate = new Date(task.endDate);
      newTask.endDate.setDate(newTask.endDate.getDate() + deltaDays);
    } else if (dragType === 'resize-start') {
      newTask.startDate = new Date(task.startDate);
      newTask.startDate.setDate(newTask.startDate.getDate() + deltaDays);
      if (newTask.startDate >= newTask.endDate) return;
    } else if (dragType === 'resize-end') {
      newTask.endDate = new Date(task.endDate);
      newTask.endDate.setDate(newTask.endDate.getDate() + deltaDays);
      if (newTask.endDate <= newTask.startDate) return;
    }

    setDragStartX(e.clientX);
    onTaskUpdate?.(newTask);
  }, [draggingTask, dragType, dragStartX, tasks, columnWidth, onTaskUpdate]);

  const handleMouseUp = useCallback(() => {
    if (draggingTask && dragType) {
      const task = tasks.find(t => t.id === draggingTask);
      if (task) {
        onTaskDragEnd?.(task, task.startDate, task.endDate);
      }
    }
    setDraggingTask(null);
    setDragType(null);
  }, [draggingTask, dragType, tasks, onTaskDragEnd]);

  useEffect(() => {
    if (draggingTask) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingTask, handleMouseMove, handleMouseUp]);

  // Draw dependency arrows
  const renderDependencyArrows = () => {
    if (!showDependencies) return null;

    const arrows: JSX.Element[] = [];
    let taskYPositions: Map<string, number> = new Map();

    // Calculate Y positions
    let currentY = 0;
    groupedTasks.forEach(({ group, tasks: groupTasks }) => {
      if (group) currentY += 40; // Group header height
      if (group && collapsedGroups.has(group.id)) return;

      groupTasks.forEach(task => {
        taskYPositions.set(task.id, currentY + 20);
        currentY += 48;
      });
    });

    tasks.forEach(task => {
      if (!task.dependencies) return;

      task.dependencies.forEach(depId => {
        const depTask = tasks.find(t => t.id === depId);
        if (!depTask) return;

        const fromPos = getTaskPosition(depTask);
        const toPos = getTaskPosition(task);
        const fromY = taskYPositions.get(depId) || 0;
        const toY = taskYPositions.get(task.id) || 0;

        const startX = fromPos.left + fromPos.width;
        const endX = toPos.left;
        const midX = startX + (endX - startX) / 2;

        const pathD = `
          M ${startX} ${fromY}
          C ${midX} ${fromY}, ${midX} ${toY}, ${endX} ${toY}
        `;

        arrows.push(
          <g key={`${depId}-${task.id}`}>
            <path
              d={pathD}
              fill="none"
              stroke={hoveredTask === task.id || hoveredTask === depId ? '#3b82f6' : '#9ca3af'}
              strokeWidth={hoveredTask === task.id || hoveredTask === depId ? 2 : 1.5}
              strokeDasharray={hoveredTask === task.id || hoveredTask === depId ? '' : '4 2'}
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      });
    });

    return (
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ width: timelineColumns.length * columnWidth, height: '100%' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
          </marker>
        </defs>
        {arrows}
      </svg>
    );
  };

  // Navigation
  const navigateTimeline = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const offset = viewMode === 'day' ? 7 : viewMode === 'week' ? 14 : 30;
    newDate.setDate(newDate.getDate() + (direction === 'next' ? offset : -offset));
    setCurrentDate(newDate);
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Calculate row number for each task
  let rowIndex = 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2, prev + 0.25))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation */}
          <button
            onClick={() => navigateTimeline('prev')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={() => navigateTimeline('next')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <div className="flex min-h-full">
          {/* Task List */}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-20">
            {/* Header */}
            <div className="h-12 px-4 flex items-center border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
              Task / Work Order
            </div>

            {/* Task Rows */}
            <div>
              {groupedTasks.map(({ group, tasks: groupTasks }) => (
                <React.Fragment key={group?.id || 'ungrouped'}>
                  {/* Group Header */}
                  {group && (
                    <div
                      className="h-10 px-4 flex items-center gap-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-150"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <ChevronRight
                        className={`w-4 h-4 text-gray-500 transition-transform ${!collapsedGroups.has(group.id) ? 'rotate-90' : ''
                          }`}
                      />
                      <span className="font-medium text-sm text-gray-700">{group.name}</span>
                      <span className="text-xs text-gray-500">({groupTasks.length})</span>
                    </div>
                  )}

                  {/* Tasks */}
                  {(!group || !collapsedGroups.has(group.id)) &&
                    groupTasks.map(task => (
                      <div
                        key={task.id}
                        className={`h-12 px-4 flex items-center gap-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedTask === task.id ? 'bg-blue-50' : ''
                          } ${getPriorityBorder(task.priority)}`}
                        onClick={() => {
                          setSelectedTask(task.id);
                          onTaskClick?.(task);
                        }}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        {enableDragDrop && (
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {task.workOrderNumber || task.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {task.assignee || task.resource}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                      </div>
                    ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="flex-1 relative">
            {/* Timeline Header */}
            <div className="h-12 flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              {timelineColumns.map((col, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 border-r border-gray-200 flex items-center justify-center text-xs ${col.isWeekend ? 'bg-gray-100' : ''
                    } ${col.isToday ? 'bg-blue-50' : ''}`}
                  style={{ width: columnWidth }}
                >
                  {col.label && (
                    <span className="font-medium text-gray-700">{col.label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline Grid & Tasks */}
            <div className="relative" style={{ width: timelineColumns.length * columnWidth }}>
              {/* Grid lines */}
              <div className="absolute inset-0 flex">
                {timelineColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 border-r ${col.isWeekend ? 'bg-gray-50' : ''
                      } ${col.isToday && todayMarker ? 'bg-blue-50/50' : ''}`}
                    style={{ width: columnWidth, height: '100%' }}
                  />
                ))}
              </div>

              {/* Today marker */}
              {todayMarker && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{
                    left: Math.floor((new Date().getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24)) * columnWidth
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-xs rounded whitespace-nowrap">
                    Today
                  </div>
                </div>
              )}

              {/* Dependency Arrows */}
              {renderDependencyArrows()}

              {/* Tasks */}
              {groupedTasks.map(({ group, tasks: groupTasks }) => (
                <React.Fragment key={group?.id || 'ungrouped'}>
                  {group && (
                    <div className="h-10" /> // Group header spacer
                  )}

                  {(!group || !collapsedGroups.has(group.id)) &&
                    groupTasks.map(task => {
                      const pos = getTaskPosition(task);
                      const isSelected = selectedTask === task.id;
                      const isHovered = hoveredTask === task.id;
                      const isDragging = draggingTask === task.id;

                      return (
                        <div key={task.id} className="h-12 relative">
                          {/* Task Bar */}
                          <div
                            className={`absolute top-2 h-8 rounded-lg shadow-sm cursor-pointer transition-all ${isDragging ? 'opacity-70 shadow-lg' : ''
                              } ${isSelected || isHovered ? 'ring-2 ring-blue-400' : ''}`}
                            style={{
                              left: pos.left,
                              width: pos.width,
                              backgroundColor: task.color || getStatusBgColor(task.status)
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task.id);
                              onTaskClick?.(task);
                            }}
                            onMouseEnter={() => setHoveredTask(task.id)}
                            onMouseLeave={() => setHoveredTask(null)}
                          >
                            {/* Progress */}
                            <div
                              className="absolute inset-y-0 left-0 bg-white/30 rounded-l-lg"
                              style={{ width: `${task.progress}%` }}
                            />

                            {/* Resize handles */}
                            {enableDragDrop && (
                              <>
                                <div
                                  className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 rounded-l-lg"
                                  onMouseDown={(e) => handleTaskMouseDown(e, task.id, 'resize-start')}
                                />
                                <div
                                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 rounded-r-lg"
                                  onMouseDown={(e) => handleTaskMouseDown(e, task.id, 'resize-end')}
                                />
                              </>
                            )}

                            {/* Move handle */}
                            {enableDragDrop && (
                              <div
                                className="absolute inset-2 cursor-move"
                                onMouseDown={(e) => handleTaskMouseDown(e, task.id, 'move')}
                              />
                            )}

                            {/* Label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-white truncate px-2">
                                {task.milestone ? '◆' : `${task.progress}%`}
                              </span>
                            </div>

                            {/* Dependency connector */}
                            {enableDependencyCreation && (
                              <div
                                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 hover:opacity-100 cursor-crosshair flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (creatingDependency && creatingDependency !== task.id) {
                                    onDependencyCreate?.(creatingDependency, task.id);
                                    setCreatingDependency(null);
                                  } else {
                                    setCreatingDependency(task.id);
                                  }
                                }}
                              >
                                <Link className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-400" />
              <span className="text-gray-600">Not Started</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-gray-600">Delayed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Priority:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-red-500" />
              <span className="text-gray-600">Urgent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-orange-500" />
              <span className="text-gray-600">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-blue-400" />
              <span className="text-gray-600">Medium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedGanttChart;
