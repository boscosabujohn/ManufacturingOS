'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Filter,
  Info
} from 'lucide-react';

// Types
interface Task {
  id: string;
  name: string;
  workOrderNumber?: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  progress: number;
  dependencies: string[];
  assignee?: string;
  workCenter?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  slack: number; // float/slack time in days
  isCritical?: boolean;
  earlyStart?: Date;
  earlyFinish?: Date;
  lateStart?: Date;
  lateFinish?: Date;
}

interface CriticalPathHighlightProps {
  tasks?: Task[];
  projectStartDate?: Date;
  projectEndDate?: Date;
  onTaskClick?: (taskId: string) => void;
  showGantt?: boolean;
  showNetwork?: boolean;
  highlightMode?: 'critical' | 'near-critical' | 'all';
}

// Sample tasks with critical path data
const generateSampleTasks = (): Task[] => {
  const baseDate = new Date('2025-01-15');

  return [
    {
      id: 't1',
      name: 'Project Kickoff',
      workOrderNumber: 'WO-001',
      startDate: new Date(baseDate),
      endDate: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      duration: 1,
      progress: 100,
      dependencies: [],
      assignee: 'PM Team',
      status: 'completed',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't2',
      name: 'Design Review',
      workOrderNumber: 'WO-002',
      startDate: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      duration: 3,
      progress: 100,
      dependencies: ['t1'],
      assignee: 'Design Team',
      workCenter: 'Design',
      status: 'completed',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't3',
      name: 'Material Procurement',
      workOrderNumber: 'WO-003',
      startDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 11 * 24 * 60 * 60 * 1000),
      duration: 7,
      progress: 85,
      dependencies: ['t2'],
      assignee: 'Procurement',
      workCenter: 'Procurement',
      status: 'in-progress',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't4',
      name: 'Tool Preparation',
      workOrderNumber: 'WO-004',
      startDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      duration: 3,
      progress: 100,
      dependencies: ['t2'],
      assignee: 'Tooling',
      workCenter: 'Tooling',
      status: 'completed',
      slack: 4,
      isCritical: false,
    },
    {
      id: 't5',
      name: 'Laser Cutting',
      workOrderNumber: 'WO-005',
      startDate: new Date(baseDate.getTime() + 11 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000),
      duration: 5,
      progress: 60,
      dependencies: ['t3'],
      assignee: 'Team A',
      workCenter: 'Laser Cutting',
      status: 'in-progress',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't6',
      name: 'Bending Operations',
      workOrderNumber: 'WO-006',
      startDate: new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      duration: 4,
      progress: 20,
      dependencies: ['t5'],
      assignee: 'Team B',
      workCenter: 'Bending',
      status: 'in-progress',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't7',
      name: 'Surface Treatment',
      workOrderNumber: 'WO-007',
      startDate: new Date(baseDate.getTime() + 11 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      duration: 3,
      progress: 100,
      dependencies: ['t3'],
      assignee: 'Surface Team',
      workCenter: 'Surface',
      status: 'completed',
      slack: 6,
      isCritical: false,
    },
    {
      id: 't8',
      name: 'Welding & Assembly',
      workOrderNumber: 'WO-008',
      startDate: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      duration: 6,
      progress: 0,
      dependencies: ['t6', 't7'],
      assignee: 'Team C',
      workCenter: 'Welding',
      status: 'not-started',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't9',
      name: 'Quality Inspection',
      workOrderNumber: 'WO-009',
      startDate: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      duration: 2,
      progress: 0,
      dependencies: ['t8'],
      assignee: 'QC Team',
      workCenter: 'Quality',
      status: 'not-started',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't10',
      name: 'Packaging',
      workOrderNumber: 'WO-010',
      startDate: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      duration: 2,
      progress: 0,
      dependencies: ['t9'],
      assignee: 'Packaging',
      workCenter: 'Packaging',
      status: 'not-started',
      slack: 0,
      isCritical: true,
    },
    {
      id: 't11',
      name: 'Documentation',
      workOrderNumber: 'WO-011',
      startDate: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000),
      endDate: new Date(baseDate.getTime() + 29 * 24 * 60 * 60 * 1000),
      duration: 3,
      progress: 0,
      dependencies: ['t8'],
      assignee: 'Doc Team',
      status: 'not-started',
      slack: 1,
      isCritical: false,
    },
  ];
};

/**
 * CriticalPathHighlight - Visualizes critical path in project schedules
 * Highlights tasks with zero slack that determine project duration
 */
export function CriticalPathHighlight({
  tasks: propTasks,
  projectStartDate,
  projectEndDate,
  onTaskClick,
  showGantt = true,
  showNetwork = false,
  highlightMode = 'critical',
}: CriticalPathHighlightProps) {
  const [expandedView, setExpandedView] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const tasks = propTasks || generateSampleTasks();

  // Calculate critical path statistics
  const stats = useMemo(() => {
    const criticalTasks = tasks.filter(t => t.isCritical);
    const nearCriticalTasks = tasks.filter(t => !t.isCritical && t.slack <= 2);
    const criticalDuration = criticalTasks.reduce((sum, t) => sum + t.duration, 0);
    const totalDuration = Math.max(...tasks.map(t => {
      const daysDiff = (t.endDate.getTime() - tasks[0].startDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff;
    }));

    const delayedCritical = criticalTasks.filter(t => t.status === 'delayed').length;
    const atRisk = criticalTasks.filter(t => t.progress < 50 && t.status === 'in-progress').length;

    return {
      criticalCount: criticalTasks.length,
      nearCriticalCount: nearCriticalTasks.length,
      totalTasks: tasks.length,
      criticalDuration,
      totalDuration: Math.round(totalDuration),
      delayedCritical,
      atRisk,
      criticalPath: criticalTasks.map(t => t.id),
    };
  }, [tasks]);

  // Get timeline range
  const timelineRange = useMemo(() => {
    const start = projectStartDate || new Date(Math.min(...tasks.map(t => t.startDate.getTime())));
    const end = projectEndDate || new Date(Math.max(...tasks.map(t => t.endDate.getTime())));
    const days: Date[] = [];

    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { start, end, days, totalDays: days.length };
  }, [tasks, projectStartDate, projectEndDate]);

  // Calculate task position on timeline
  const getTaskPosition = (task: Task) => {
    const startOffset = (task.startDate.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);

    return {
      left: (startOffset / timelineRange.totalDays) * 100,
      width: (duration / timelineRange.totalDays) * 100,
    };
  };

  // Filter tasks based on highlight mode
  const filteredTasks = useMemo(() => {
    switch (highlightMode) {
      case 'critical':
        return tasks.filter(t => t.isCritical);
      case 'near-critical':
        return tasks.filter(t => t.isCritical || t.slack <= 2);
      default:
        return tasks;
    }
  }, [tasks, highlightMode]);

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(selectedTask === taskId ? null : taskId);
    onTaskClick?.(taskId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Path Analysis</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.criticalCount} critical tasks • {stats.totalDuration} days total duration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              defaultValue={highlightMode}
            >
              <option value="critical">Critical Only</option>
              <option value="near-critical">Near Critical (≤2 days slack)</option>
              <option value="all">All Tasks</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Critical Tasks</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.criticalCount}</div>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Near Critical</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.nearCriticalCount}</div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Project Duration</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalDuration} days</div>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.atRisk}</div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Total Float</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {tasks.reduce((sum, t) => sum + t.slack, 0)} days
            </div>
          </div>
        </div>
      </div>

      {/* Critical Path Info Banner */}
      <div className="px-6 py-3 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Critical Path:</strong> Tasks with zero slack that determine the minimum project duration.
              Any delay in these tasks will directly delay the project completion.
            </p>
          </div>
        </div>
      </div>

      {/* Gantt Chart View */}
      {showGantt && (
        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Timeline Header */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-2">
                <div className="w-64 flex-shrink-0 p-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                  Task / Work Order
                </div>
                <div className="flex-1 relative">
                  <div className="flex">
                    {timelineRange.days.filter((_, i) => i % 7 === 0).map((date, idx) => (
                      <div
                        key={idx}
                        className="flex-1 text-center text-xs text-gray-500 py-1 border-l border-gray-100 dark:border-gray-700"
                      >
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Rows */}
              <div className="space-y-1">
                {(expandedView ? tasks : filteredTasks).map((task, idx) => {
                  const position = getTaskPosition(task);
                  const isSelected = selectedTask === task.id;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className={`flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {/* Task Info */}
                      <div className={`w-64 flex-shrink-0 p-2 border-l-4 ${
                        task.isCritical
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                          : task.slack <= 2
                          ? 'border-orange-400'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center gap-2">
                          {task.isCritical && <Zap className="w-3 h-3 text-red-500" />}
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {task.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{task.workOrderNumber}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs ${
                            task.slack === 0 ? 'text-red-600 font-medium' : 'text-gray-500'
                          }`}>
                            {task.slack === 0 ? 'No slack' : `${task.slack}d slack`}
                          </span>
                        </div>
                      </div>

                      {/* Gantt Bar */}
                      <div className="flex-1 relative h-10 px-2">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex">
                          {timelineRange.days.filter((_, i) => i % 7 === 0).map((_, idx) => (
                            <div key={idx} className="flex-1 border-l border-gray-100 dark:border-gray-700" />
                          ))}
                        </div>

                        {/* Task Bar */}
                        <div
                          className={`absolute top-1 h-8 rounded-md flex items-center overflow-hidden transition-all ${
                            task.isCritical
                              ? 'bg-red-500 shadow-sm shadow-red-200 dark:shadow-red-900/50'
                              : task.slack <= 2
                              ? 'bg-orange-400'
                              : 'bg-blue-400'
                          }`}
                          style={{
                            left: `${position.left}%`,
                            width: `${Math.max(position.width, 2)}%`,
                          }}
                        >
                          {/* Progress fill */}
                          <div
                            className="absolute inset-0 bg-white/30"
                            style={{ width: `${task.progress}%` }}
                          />

                          {/* Task label */}
                          <span className="relative px-2 text-xs font-medium text-white truncate">
                            {task.duration}d • {task.progress}%
                          </span>

                          {/* Critical indicator */}
                          {task.isCritical && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                              <Zap className="w-3 h-3 text-white/80" />
                            </div>
                          )}
                        </div>

                        {/* Dependency arrows would go here */}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More/Less */}
              {filteredTasks.length !== tasks.length && (
                <button
                  onClick={() => setExpandedView(!expandedView)}
                  className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  {expandedView ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Critical Path Only
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show All Tasks ({tasks.length - filteredTasks.length} more)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Critical Path Chain */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Critical Path Chain</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tasks.filter(t => t.isCritical).map((task, idx, arr) => (
            <React.Fragment key={task.id}>
              <button
                onClick={() => handleTaskClick(task.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 transition-colors ${
                  selectedTask === task.id
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-red-200 dark:border-red-800 hover:border-red-400 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-red-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{task.duration} days</div>
              </button>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Selected Task Details */}
      {selectedTask && (
        <div className="px-6 pb-6">
          {tasks.filter(t => t.id === selectedTask).map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-l-4 ${
                task.isCritical
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {task.isCritical && <Zap className="w-4 h-4 text-red-500" />}
                    {task.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {task.workOrderNumber} • {task.workCenter || 'General'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'delayed' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Float/Slack</p>
                  <p className={`text-sm font-medium ${task.slack === 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {task.slack} days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.progress}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.assignee || '-'}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Timeline</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {task.startDate.toLocaleDateString()} → {task.endDate.toLocaleDateString()}
                </p>
              </div>

              {task.dependencies.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Dependencies</p>
                  <div className="flex gap-2">
                    {task.dependencies.map(depId => {
                      const depTask = tasks.find(t => t.id === depId);
                      return (
                        <span
                          key={depId}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          {depTask?.name || depId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Critical (0 slack)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-400" />
            <span className="text-gray-600 dark:text-gray-400">Near-Critical (≤2d slack)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-400" />
            <span className="text-gray-600 dark:text-gray-400">Non-Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Critical Path Indicator</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CriticalPathHighlight;
