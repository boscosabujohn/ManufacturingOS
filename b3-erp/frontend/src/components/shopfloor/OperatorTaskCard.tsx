'use client';

import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Package,
  Wrench,
  FileText,
  Timer,
  User,
  MapPin
} from 'lucide-react';

export interface Task {
  id: string;
  workOrderNumber: string;
  productName: string;
  operation: string;
  quantity: number;
  completedQty: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'issue';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedTime?: number; // in minutes
  actualTime?: number;
  machine?: string;
  location?: string;
  instructions?: string;
  materials?: { name: string; quantity: number; unit: string }[];
}

interface OperatorTaskCardProps {
  task: Task;
  onStart?: (taskId: string) => void;
  onPause?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onReportIssue?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

/**
 * OperatorTaskCard - Large touch-friendly task card for shop floor operators
 */
export function OperatorTaskCard({
  task,
  onStart,
  onPause,
  onComplete,
  onReportIssue,
  onViewDetails,
  showActions = true,
  compact = false
}: OperatorTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      icon: Clock
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
      icon: Play
    },
    paused: {
      label: 'Paused',
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
      icon: Pause
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
      icon: CheckCircle2
    },
    issue: {
      label: 'Issue Reported',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
      icon: AlertTriangle
    }
  };

  const priorityConfig = {
    low: { label: 'Low', color: 'border-l-gray-400' },
    normal: { label: 'Normal', color: 'border-l-blue-500' },
    high: { label: 'High', color: 'border-l-orange-500' },
    urgent: { label: 'Urgent', color: 'border-l-red-500 animate-pulse' }
  };

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const progress = task.quantity > 0 ? Math.round((task.completedQty / task.quantity) * 100) : 0;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden border-l-4 ${priority.color}`}
    >
      {/* Main Card Content */}
      <div
        className={`p-4 ${compact ? '' : 'sm:p-5'}`}
        onClick={() => onViewDetails?.(task.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {task.workOrderNumber}
              </span>
              {task.priority === 'urgent' && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 text-xs font-bold rounded-full">
                  URGENT
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {task.productName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {task.operation}
            </p>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{status.label}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {task.completedQty} / {task.quantity} ({progress}%)
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progress >= 100
                  ? 'bg-green-500'
                  : progress >= 50
                    ? 'bg-blue-500'
                    : 'bg-blue-400'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap gap-4 text-sm">
          {task.machine && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Wrench className="w-4 h-4" />
              <span>{task.machine}</span>
            </div>
          )}
          {task.location && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{task.location}</span>
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Timer className="w-4 h-4" />
              <span>{task.estimatedTime} min est.</span>
            </div>
          )}
        </div>

        {/* Expandable Details */}
        {!compact && (isExpanded || task.instructions || task.materials) && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="flex items-center gap-1 mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        )}

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Instructions */}
            {task.instructions && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <FileText className="w-4 h-4" />
                  Instructions
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  {task.instructions}
                </p>
              </div>
            )}

            {/* Materials */}
            {task.materials && task.materials.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <Package className="w-4 h-4" />
                  Required Materials
                </h4>
                <div className="space-y-2">
                  {task.materials.map((material, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    >
                      <span className="text-gray-900 dark:text-white">{material.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {material.quantity} {material.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons - Large touch targets */}
      {showActions && task.status !== 'completed' && (
        <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
          {task.status === 'pending' && (
            <>
              <button
                onClick={() => onStart?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Start Task</span>
              </button>
              <button
                onClick={() => onViewDetails?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <FileText className="w-6 h-6" />
                <span className="text-lg">Details</span>
              </button>
            </>
          )}

          {task.status === 'in_progress' && (
            <>
              <button
                onClick={() => onPause?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <Pause className="w-6 h-6" />
                <span className="text-lg">Pause</span>
              </button>
              <button
                onClick={() => onComplete?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-lg">Complete</span>
              </button>
            </>
          )}

          {task.status === 'paused' && (
            <>
              <button
                onClick={() => onStart?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Resume</span>
              </button>
              <button
                onClick={() => onReportIssue?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="text-lg">Report Issue</span>
              </button>
            </>
          )}

          {task.status === 'issue' && (
            <>
              <button
                onClick={() => onStart?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Resume Work</span>
              </button>
              <button
                onClick={() => onViewDetails?.(task.id)}
                className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                style={{ minHeight: '60px' }}
              >
                <FileText className="w-6 h-6" />
                <span className="text-lg">View Issue</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default OperatorTaskCard;
