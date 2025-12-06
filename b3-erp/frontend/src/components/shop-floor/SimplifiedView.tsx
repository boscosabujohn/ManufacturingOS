'use client';

import React, { ReactNode, useState } from 'react';
import {
  Package,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  ChevronRight,
  User,
  Calendar,
  Hash,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// Status types for manufacturing operations
export type OperationStatus =
  | 'running'
  | 'paused'
  | 'completed'
  | 'pending'
  | 'error'
  | 'warning'
  | 'idle';

export type QualityStatus = 'pass' | 'fail' | 'pending' | 'na';

// Status indicator component
export interface StatusIndicatorProps {
  status: OperationStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<OperationStatus, { color: string; bg: string; label: string }> = {
  running: { color: 'text-green-500', bg: 'bg-green-500', label: 'Running' },
  paused: { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Paused' },
  completed: { color: 'text-blue-500', bg: 'bg-blue-500', label: 'Completed' },
  pending: { color: 'text-gray-400', bg: 'bg-gray-400', label: 'Pending' },
  error: { color: 'text-red-500', bg: 'bg-red-500', label: 'Error' },
  warning: { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Warning' },
  idle: { color: 'text-gray-500', bg: 'bg-gray-500', label: 'Idle' },
};

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export function StatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  pulse = false,
  className = '',
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`relative inline-flex ${sizeClasses[size]}`}>
        <span className={`${sizeClasses[size]} ${config.bg} rounded-full`} />
        {pulse && (status === 'running' || status === 'warning' || status === 'error') && (
          <span
            className={`absolute inset-0 ${config.bg} rounded-full animate-ping opacity-75`}
          />
        )}
      </span>
      {showLabel && (
        <span className={`font-semibold ${config.color}`}>{config.label}</span>
      )}
    </div>
  );
}

// Work order card - simplified view of a work order
export interface WorkOrderCardProps {
  orderNumber: string;
  productName: string;
  quantity: number;
  completedQty: number;
  status: OperationStatus;
  dueDate?: Date;
  operatorName?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  onClick?: () => void;
  className?: string;
}

export function WorkOrderCard({
  orderNumber,
  productName,
  quantity,
  completedQty,
  status,
  dueDate,
  operatorName,
  priority = 'normal',
  onClick,
  className = '',
}: WorkOrderCardProps) {
  const progress = Math.round((completedQty / quantity) * 100);

  const priorityColors = {
    low: 'border-l-gray-400',
    normal: 'border-l-blue-500',
    high: 'border-l-orange-500',
    urgent: 'border-l-red-500',
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-6 bg-white dark:bg-gray-900
        border-2 border-gray-200 dark:border-gray-700
        border-l-8 ${priorityColors[priority]}
        rounded-xl shadow-sm
        hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
        active:scale-[0.99]
        transition-all duration-150
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Hash className="w-6 h-6 text-gray-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {orderNumber}
          </span>
        </div>
        <StatusIndicator status={status} size="lg" pulse showLabel />
      </div>

      {/* Product Name */}
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">
        {productName}
      </h3>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedQty} / {quantity}
          </span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-right text-lg font-semibold text-gray-600 dark:text-gray-400 mt-1">
          {progress}%
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-lg text-gray-600 dark:text-gray-400">
        {dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Due: {dueDate.toLocaleDateString()}</span>
          </div>
        )}
        {operatorName && (
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{operatorName}</span>
          </div>
        )}
        <ChevronRight className="w-6 h-6 ml-auto" />
      </div>
    </button>
  );
}

// Large KPI display for shop floor
export interface ShopFloorKPIProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export function ShopFloorKPI({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status = 'neutral',
  size = 'lg',
  className = '',
}: ShopFloorKPIProps) {
  const statusColors = {
    good: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    bad: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    neutral: 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600',
  };

  const valueSizes = {
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <div
      className={`
        p-6 rounded-xl border-2 ${statusColors[status]}
        ${className}
      `}
    >
      {/* Label with icon */}
      <div className="flex items-center gap-3 mb-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-xl font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-3">
        <span className={`${valueSizes[size]} font-bold text-gray-900 dark:text-white`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && (
          <span className="text-2xl text-gray-500 dark:text-gray-400">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-2 mt-3 ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
          {trendValue && <span className="text-lg font-medium">{trendValue}</span>}
        </div>
      )}
    </div>
  );
}

// Operation step display
export interface OperationStep {
  id: string;
  number: number;
  name: string;
  status: OperationStatus;
  duration?: string;
  notes?: string;
}

export interface OperationStepsProps {
  steps: OperationStep[];
  currentStepId?: string;
  onStepClick?: (step: OperationStep) => void;
  className?: string;
}

export function OperationSteps({
  steps,
  currentStepId,
  onStepClick,
  className = '',
}: OperationStepsProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        const isCompleted = step.status === 'completed';

        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(step)}
            className={`
              w-full p-5 rounded-xl border-2 text-left
              transition-all duration-150
              ${isCurrent
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2'
                : isCompleted
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
              }
              hover:shadow-md active:scale-[0.99]
            `}
          >
            <div className="flex items-center gap-4">
              {/* Step number */}
              <div
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  text-2xl font-bold
                  ${isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {isCompleted ? <CheckCircle className="w-8 h-8" /> : step.number}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {step.name}
                </h4>
                {step.duration && (
                  <p className="text-lg text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Clock className="w-5 h-5" />
                    {step.duration}
                  </p>
                )}
              </div>

              {/* Status */}
              <StatusIndicator status={step.status} size="lg" />
            </div>

            {step.notes && isCurrent && (
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-lg text-blue-800 dark:text-blue-200">{step.notes}</p>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Quality check item
export interface QualityCheckItem {
  id: string;
  name: string;
  specification?: string;
  status: QualityStatus;
  value?: string;
  notes?: string;
}

export interface QualityCheckListProps {
  items: QualityCheckItem[];
  onItemCheck: (itemId: string, status: QualityStatus) => void;
  readonly?: boolean;
  className?: string;
}

export function QualityCheckList({
  items,
  onItemCheck,
  readonly = false,
  className = '',
}: QualityCheckListProps) {
  const qualityStatusConfig: Record<QualityStatus, { icon: ReactNode; bg: string; border: string }> = {
    pass: { icon: <CheckCircle className="w-8 h-8" />, bg: 'bg-green-500', border: 'border-green-500' },
    fail: { icon: <XCircle className="w-8 h-8" />, bg: 'bg-red-500', border: 'border-red-500' },
    pending: { icon: <Clock className="w-8 h-8" />, bg: 'bg-gray-400', border: 'border-gray-400' },
    na: { icon: <Minus className="w-8 h-8" />, bg: 'bg-gray-300', border: 'border-gray-300' },
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map(item => {
        const config = qualityStatusConfig[item.status];

        return (
          <div
            key={item.id}
            className={`
              p-5 rounded-xl border-2 ${config.border}
              bg-white dark:bg-gray-900
            `}
          >
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className={`${config.bg} text-white p-2 rounded-xl`}>
                {config.icon}
              </div>

              {/* Check info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.name}
                </h4>
                {item.specification && (
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    Spec: {item.specification}
                  </p>
                )}
                {item.value && (
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-1">
                    Measured: {item.value}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              {!readonly && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onItemCheck(item.id, 'pass')}
                    className={`
                      w-16 h-16 rounded-xl flex items-center justify-center
                      ${item.status === 'pass'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-600 dark:bg-green-900/30'
                      }
                      active:scale-95 transition-transform
                    `}
                  >
                    <CheckCircle className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => onItemCheck(item.id, 'fail')}
                    className={`
                      w-16 h-16 rounded-xl flex items-center justify-center
                      ${item.status === 'fail'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                      }
                      active:scale-95 transition-transform
                    `}
                  >
                    <XCircle className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>

            {item.notes && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-lg text-gray-700 dark:text-gray-300">{item.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Simple info display row
export interface InfoRowProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export function InfoRow({
  label,
  value,
  icon,
  size = 'lg',
  className = '',
}: InfoRowProps) {
  const textSizes = {
    md: { label: 'text-base', value: 'text-lg' },
    lg: { label: 'text-lg', value: 'text-xl' },
    xl: { label: 'text-xl', value: 'text-2xl' },
  };

  return (
    <div className={`flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
        {icon && <span className="w-6 h-6">{icon}</span>}
        <span className={textSizes[size].label}>{label}</span>
      </div>
      <span className={`${textSizes[size].value} font-semibold text-gray-900 dark:text-white`}>
        {value}
      </span>
    </div>
  );
}

// Alert banner for important messages
export interface ShopFloorAlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ShopFloorAlert({
  type,
  title,
  message,
  onDismiss,
  action,
  className = '',
}: ShopFloorAlertProps) {
  const typeConfig = {
    info: {
      bg: 'bg-blue-500',
      icon: <Info className="w-8 h-8" />,
    },
    warning: {
      bg: 'bg-amber-500',
      icon: <AlertTriangle className="w-8 h-8" />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <AlertTriangle className="w-8 h-8" />,
    },
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircle className="w-8 h-8" />,
    },
  };

  const config = typeConfig[type];

  return (
    <div className={`${config.bg} text-white p-6 rounded-xl ${className}`}>
      <div className="flex items-start gap-4">
        {config.icon}
        <div className="flex-1 min-w-0">
          <h4 className="text-2xl font-bold">{title}</h4>
          {message && <p className="text-xl mt-1 opacity-90">{message}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XCircle className="w-8 h-8" />
          </button>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg text-xl font-semibold transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Machine status display
export interface MachineStatusProps {
  machineName: string;
  machineId: string;
  status: OperationStatus;
  currentOperation?: string;
  runtime?: string;
  efficiency?: number;
  temperature?: number;
  alerts?: number;
  onClick?: () => void;
  className?: string;
}

export function MachineStatus({
  machineName,
  machineId,
  status,
  currentOperation,
  runtime,
  efficiency,
  temperature,
  alerts = 0,
  onClick,
  className = '',
}: MachineStatusProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-6 bg-white dark:bg-gray-900
        border-2 border-gray-200 dark:border-gray-700
        rounded-xl shadow-sm
        hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
        active:scale-[0.99]
        transition-all duration-150
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {machineName}
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400">ID: {machineId}</p>
        </div>
        <div className="flex items-center gap-3">
          {alerts > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold">
              {alerts}
            </span>
          )}
          <StatusIndicator status={status} size="xl" pulse />
        </div>
      </div>

      {/* Current operation */}
      {currentOperation && (
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          {currentOperation}
        </p>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {runtime && (
          <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{runtime}</p>
            <p className="text-sm text-gray-500">Runtime</p>
          </div>
        )}
        {efficiency !== undefined && (
          <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Target className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <p className={`text-xl font-bold ${
              efficiency >= 90 ? 'text-green-500' :
              efficiency >= 70 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {efficiency}%
            </p>
            <p className="text-sm text-gray-500">Efficiency</p>
          </div>
        )}
        {temperature !== undefined && (
          <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-2xl">🌡️</span>
            <p className={`text-xl font-bold ${
              temperature <= 80 ? 'text-green-500' :
              temperature <= 100 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {temperature}°C
            </p>
            <p className="text-sm text-gray-500">Temp</p>
          </div>
        )}
      </div>
    </button>
  );
}

export type {
  OperationStatus,
  QualityStatus,
  StatusIndicatorProps,
  WorkOrderCardProps,
  ShopFloorKPIProps,
  OperationStep,
  OperationStepsProps,
  QualityCheckItem,
  QualityCheckListProps,
  InfoRowProps,
  ShopFloorAlertProps,
  MachineStatusProps,
};
