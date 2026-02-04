'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Users,
  Wrench,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Bell,
  BellOff,
  UserX,
  Hammer,
  Cog
} from 'lucide-react';

// Types
interface ResourceAllocation {
  resourceId: string;
  taskId: string;
  taskName: string;
  projectId: string;
  projectName: string;
  startDate: Date;
  endDate: Date;
  allocation: number; // percentage
}

interface Resource {
  id: string;
  name: string;
  type: 'human' | 'equipment' | 'workstation';
  capacity: number; // max percentage (usually 100)
  department?: string;
  skills?: string[];
  allocations: ResourceAllocation[];
}

interface Conflict {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'human' | 'equipment' | 'workstation';
  severity: 'critical' | 'warning' | 'info';
  conflictType: 'overallocation' | 'double-booking' | 'skill-mismatch' | 'unavailable';
  period: { start: Date; end: Date };
  currentAllocation: number;
  maxCapacity: number;
  affectedTasks: { id: string; name: string; project: string; allocation: number }[];
  suggestedResolutions: string[];
  acknowledged?: boolean;
}

interface ResourceConflictAlertsProps {
  resources?: Resource[];
  conflicts?: Conflict[];
  onConflictClick?: (conflictId: string) => void;
  onResolveConflict?: (conflictId: string, resolution: string) => void;
  onAcknowledge?: (conflictId: string) => void;
  showResolved?: boolean;
  filterSeverity?: 'all' | 'critical' | 'warning';
}

// Generate sample data
const generateSampleConflicts = (): Conflict[] => {
  const today = new Date();

  return [
    {
      id: 'c1',
      resourceId: 'r1',
      resourceName: 'John Smith',
      resourceType: 'human',
      severity: 'critical',
      conflictType: 'overallocation',
      period: {
        start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
      currentAllocation: 150,
      maxCapacity: 100,
      affectedTasks: [
        { id: 't1', name: 'Laser Cutting - WO-1142', project: 'PRJ-2025-001', allocation: 80 },
        { id: 't2', name: 'Machine Setup - WO-1143', project: 'PRJ-2025-002', allocation: 70 },
      ],
      suggestedResolutions: [
        'Reassign "Machine Setup" to Mike Johnson (available)',
        'Delay "Laser Cutting" by 2 days',
        'Split allocation across shift A and B',
      ],
    },
    {
      id: 'c2',
      resourceId: 'r2',
      resourceName: 'CNC Machine #3',
      resourceType: 'equipment',
      severity: 'critical',
      conflictType: 'double-booking',
      period: {
        start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      currentAllocation: 200,
      maxCapacity: 100,
      affectedTasks: [
        { id: 't3', name: 'Part Machining - WO-1144', project: 'PRJ-2025-001', allocation: 100 },
        { id: 't4', name: 'Prototype Run - WO-1145', project: 'PRJ-2025-003', allocation: 100 },
      ],
      suggestedResolutions: [
        'Move "Prototype Run" to CNC Machine #5',
        'Schedule "Part Machining" for night shift',
        'Prioritize PRJ-2025-001 and delay PRJ-2025-003',
      ],
    },
    {
      id: 'c3',
      resourceId: 'r3',
      resourceName: 'Sarah Chen',
      resourceType: 'human',
      severity: 'warning',
      conflictType: 'overallocation',
      period: {
        start: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
      currentAllocation: 120,
      maxCapacity: 100,
      affectedTasks: [
        { id: 't5', name: 'Quality Inspection - WO-1146', project: 'PRJ-2025-001', allocation: 60 },
        { id: 't6', name: 'Final QC - WO-1147', project: 'PRJ-2025-002', allocation: 60 },
      ],
      suggestedResolutions: [
        'Reduce allocation on "Final QC" to 40%',
        'Assign QC assistant for support',
      ],
    },
    {
      id: 'c4',
      resourceId: 'r4',
      resourceName: 'Welding Station A',
      resourceType: 'workstation',
      severity: 'warning',
      conflictType: 'overallocation',
      period: {
        start: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
      },
      currentAllocation: 130,
      maxCapacity: 100,
      affectedTasks: [
        { id: 't7', name: 'Frame Welding - WO-1148', project: 'PRJ-2025-001', allocation: 80 },
        { id: 't8', name: 'Support Welding - WO-1149', project: 'PRJ-2025-004', allocation: 50 },
      ],
      suggestedResolutions: [
        'Move "Support Welding" to Welding Station B',
        'Extend working hours for Station A',
      ],
    },
    {
      id: 'c5',
      resourceId: 'r5',
      resourceName: 'Mike Johnson',
      resourceType: 'human',
      severity: 'info',
      conflictType: 'skill-mismatch',
      period: {
        start: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      },
      currentAllocation: 100,
      maxCapacity: 100,
      affectedTasks: [
        { id: 't9', name: 'Advanced CNC Programming - WO-1150', project: 'PRJ-2025-002', allocation: 100 },
      ],
      suggestedResolutions: [
        'Reassign to Tom Lee (certified CNC programmer)',
        'Provide supervision from senior technician',
        'Schedule training before task starts',
      ],
    },
  ];
};

/**
 * ResourceConflictAlerts - Visual indicators for over-allocated resources
 * Shows conflicts, severity levels, and suggested resolutions
 */
export function ResourceConflictAlerts({
  resources,
  conflicts: propConflicts,
  onConflictClick,
  onResolveConflict,
  onAcknowledge,
  showResolved = false,
  filterSeverity = 'all',
}: ResourceConflictAlertsProps) {
  const [expandedConflict, setExpandedConflict] = useState<string | null>(null);
  const [acknowledgedConflicts, setAcknowledgedConflicts] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState(filterSeverity);

  const conflicts = propConflicts || generateSampleConflicts();

  // Filter conflicts
  const filteredConflicts = useMemo(() => {
    let result = conflicts.filter(c => !acknowledgedConflicts.has(c.id) || showResolved);

    if (selectedFilter !== 'all') {
      result = result.filter(c => c.severity === selectedFilter);
    }

    // Sort by severity (critical first)
    return result.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [conflicts, selectedFilter, acknowledgedConflicts, showResolved]);

  // Statistics
  const stats = useMemo(() => ({
    total: conflicts.length,
    critical: conflicts.filter(c => c.severity === 'critical').length,
    warning: conflicts.filter(c => c.severity === 'warning').length,
    info: conflicts.filter(c => c.severity === 'info').length,
    acknowledged: acknowledgedConflicts.size,
  }), [conflicts, acknowledgedConflicts]);

  const handleAcknowledge = (conflictId: string) => {
    setAcknowledgedConflicts(prev => new Set([...Array.from(prev), conflictId]));
    onAcknowledge?.(conflictId);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-500',
          badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-500',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
        };
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'human':
        return Users;
      case 'equipment':
        return Cog;
      case 'workstation':
        return Hammer;
      default:
        return Wrench;
    }
  };

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case 'overallocation':
        return 'Over-Allocated';
      case 'double-booking':
        return 'Double Booked';
      case 'skill-mismatch':
        return 'Skill Mismatch';
      case 'unavailable':
        return 'Unavailable';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resource Conflict Alerts</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.total - stats.acknowledged} active conflicts requiring attention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
              }`}
            >
              Critical ({stats.critical})
            </button>
            <button
              onClick={() => setSelectedFilter('warning')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'warning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200'
              }`}
            >
              Warning ({stats.warning})
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-700 dark:text-red-400">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Warning</p>
                <p className="text-2xl font-bold text-orange-600">{stats.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Info</p>
                <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700 dark:text-green-400">Acknowledged</p>
                <p className="text-2xl font-bold text-green-600">{stats.acknowledged}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {filteredConflicts.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Active Conflicts</h3>
            <p className="text-sm text-gray-500 mt-1">All resource allocations are within capacity</p>
          </div>
        ) : (
          filteredConflicts.map(conflict => {
            const styles = getSeverityStyles(conflict.severity);
            const ResourceIcon = getResourceIcon(conflict.resourceType);
            const isExpanded = expandedConflict === conflict.id;
            const overAllocationPercent = Math.round(
              ((conflict.currentAllocation - conflict.maxCapacity) / conflict.maxCapacity) * 100
            );

            return (
              <div key={conflict.id} className={`${styles.bg}`}>
                {/* Conflict Header */}
                <button
                  onClick={() => {
                    setExpandedConflict(isExpanded ? null : conflict.id);
                    onConflictClick?.(conflict.id);
                  }}
                  className="w-full p-3 text-left"
                >
                  <div className="flex items-start gap-2">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                      <ResourceIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {conflict.resourceName}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                          {conflict.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {getConflictTypeLabel(conflict.conflictType)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {conflict.period.start.toLocaleDateString()} - {conflict.period.end.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {conflict.affectedTasks.length} tasks affected
                        </span>
                      </div>

                      {/* Allocation Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Resource Allocation</span>
                          <span className={`font-medium ${
                            conflict.currentAllocation > conflict.maxCapacity
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}>
                            {conflict.currentAllocation}% / {conflict.maxCapacity}%
                            {overAllocationPercent > 0 && (
                              <span className="text-red-500 ml-1">(+{overAllocationPercent}% over)</span>
                            )}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              conflict.currentAllocation > conflict.maxCapacity
                                ? 'bg-red-500'
                                : conflict.currentAllocation > conflict.maxCapacity * 0.8
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(conflict.currentAllocation, 150)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {/* Affected Tasks */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Affected Tasks
                      </h4>
                      <div className="space-y-2">
                        {conflict.affectedTasks.map(task => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{task.project}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              task.allocation > 50 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {task.allocation}% allocation
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Resolutions */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Suggested Resolutions
                      </h4>
                      <div className="space-y-2">
                        {conflict.suggestedResolutions.map((resolution, idx) => (
                          <button
                            key={idx}
                            onClick={() => onResolveConflict?.(conflict.id, resolution)}
                            className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center text-xs font-medium group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{resolution}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAcknowledge(conflict.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        <BellOff className="w-4 h-4" />
                        Acknowledge
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Auto-Resolve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resource Utilization Overview */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resources with High Utilization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { name: 'John Smith', type: 'human', utilization: 150, capacity: 100 },
            { name: 'CNC Machine #3', type: 'equipment', utilization: 200, capacity: 100 },
            { name: 'Welding Station A', type: 'workstation', utilization: 130, capacity: 100 },
          ].map((resource, idx) => {
            const Icon = getResourceIcon(resource.type);
            const isOverloaded = resource.utilization > resource.capacity;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  isOverloaded
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${isOverloaded ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        resource.utilization > resource.capacity
                          ? 'bg-red-500'
                          : resource.utilization > resource.capacity * 0.8
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(resource.utilization, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    isOverloaded ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {resource.utilization}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResourceConflictAlerts;
