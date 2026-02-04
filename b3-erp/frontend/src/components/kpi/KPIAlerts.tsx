'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  BellOff,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Filter,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';
import { KPIStatus, KPIThreshold } from './KPICard';

// Types
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertState = 'active' | 'acknowledged' | 'resolved';

export interface KPIAlert {
  id: string;
  kpiId: string;
  kpiName: string;
  severity: AlertSeverity;
  state: AlertState;
  message: string;
  value: number;
  threshold: number;
  thresholdType: 'above' | 'below';
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  duration?: number; // minutes since triggered
}

export interface KPIAlertRule {
  id: string;
  kpiId: string;
  kpiName: string;
  enabled: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  direction: 'above' | 'below';
  notifyEmail?: boolean;
  notifySlack?: boolean;
  notifyInApp?: boolean;
  cooldownMinutes?: number;
}

// Alert Badge Component
interface AlertBadgeProps {
  severity: AlertSeverity;
  count?: number;
  pulse?: boolean;
  className?: string;
}

export function AlertBadge({ severity, count, pulse = false, className = '' }: AlertBadgeProps) {
  const colors = {
    critical: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium ${colors[severity]} ${pulse ? 'animate-pulse' : ''} ${className}`}>
      {count !== undefined ? count : '!'}
    </span>
  );
}

// Alert Indicator Component (for KPI cards)
interface AlertIndicatorProps {
  status: KPIStatus;
  threshold?: KPIThreshold;
  value?: number;
  showTooltip?: boolean;
  className?: string;
}

export function AlertIndicator({
  status,
  threshold,
  value,
  showTooltip = true,
  className = '',
}: AlertIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (status === 'neutral' || status === 'success') return null;

  const Icon = status === 'critical' ? AlertCircle : AlertTriangle;
  const colorClass = status === 'critical'
    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
    : 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';

  return (
    <div className={`relative ${className}`}>
      <button
        className={`p-1.5 rounded-lg ${colorClass} transition-colors hover:opacity-80`}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <Icon className="w-4 h-4" />
      </button>

      {showTooltip && showDetails && threshold && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          <p className="font-medium mb-1">
            {status === 'critical' ? 'Critical Alert' : 'Warning'}
          </p>
          <p className="text-gray-300">
            Value: {value?.toLocaleString()}
          </p>
          <p className="text-gray-300">
            Threshold: {status === 'critical' ? threshold.critical : threshold.warning}
          </p>
        </div>
      )}
    </div>
  );
}

// Alert List Component
interface KPIAlertListProps {
  alerts: KPIAlert[];
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onViewKPI?: (kpiId: string) => void;
  showFilters?: boolean;
  maxHeight?: string;
  className?: string;
}

export function KPIAlertList({
  alerts,
  onAcknowledge,
  onResolve,
  onDismiss,
  onViewKPI,
  showFilters = true,
  maxHeight = '400px',
  className = '',
}: KPIAlertListProps) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [stateFilter, setStateFilter] = useState<AlertState | 'all'>('all');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      if (stateFilter !== 'all' && alert.state !== stateFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, stateFilter]);

  const alertCounts = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical' && a.state === 'active').length,
    warning: alerts.filter(a => a.severity === 'warning' && a.state === 'active').length,
    total: alerts.filter(a => a.state === 'active').length,
  }), [alerts]);

  const severityColors = {
    critical: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
  };

  const severityIcons = {
    critical: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Bell className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">KPI Alerts</h3>
          {alertCounts.total > 0 && (
            <div className="flex items-center gap-1">
              {alertCounts.critical > 0 && (
                <AlertBadge severity="critical" count={alertCounts.critical} pulse />
              )}
              {alertCounts.warning > 0 && (
                <AlertBadge severity="warning" count={alertCounts.warning} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as AlertState | 'all')}
            className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400"
          >
            <option value="all">All States</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      )}

      {/* Alert List */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <BellOff className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No alerts to display</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 ${severityColors[alert.severity]} ${
                  alert.state === 'resolved' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {severityIcons[alert.severity]}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {alert.kpiName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.triggeredAt.toLocaleString()}
                        </span>
                        {alert.duration && (
                          <span>Duration: {alert.duration}m</span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          alert.state === 'active'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : alert.state === 'acknowledged'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {alert.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {alert.state === 'active' && onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Acknowledge"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {alert.state !== 'resolved' && onResolve && (
                      <button
                        onClick={() => onResolve(alert.id)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                        title="Resolve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {onViewKPI && (
                      <button
                        onClick={() => onViewKPI(alert.kpiId)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        title="View KPI"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Alert Rules Manager
interface AlertRulesManagerProps {
  rules: KPIAlertRule[];
  onUpdateRule: (rule: KPIAlertRule) => void;
  onDeleteRule: (ruleId: string) => void;
  className?: string;
}

export function AlertRulesManager({
  rules,
  onUpdateRule,
  onDeleteRule,
  className = '',
}: AlertRulesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">Alert Rules</h3>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {rules.map(rule => (
          <div key={rule.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateRule({ ...rule, enabled: !rule.enabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    rule.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      rule.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <span className="font-medium text-gray-900 dark:text-white">
                  {rule.kpiName}
                </span>
              </div>
              <button
                onClick={() => onDeleteRule(rule.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <label className="block text-gray-500 mb-1">Warning Threshold</label>
                <input
                  type="number"
                  value={rule.warningThreshold || ''}
                  onChange={(e) => onUpdateRule({
                    ...rule,
                    warningThreshold: e.target.value ? Number(e.target.value) : undefined,
                  })}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                  placeholder="Not set"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Critical Threshold</label>
                <input
                  type="number"
                  value={rule.criticalThreshold || ''}
                  onChange={(e) => onUpdateRule({
                    ...rule,
                    criticalThreshold: e.target.value ? Number(e.target.value) : undefined,
                  })}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                  placeholder="Not set"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={rule.direction === 'above'}
                  onChange={() => onUpdateRule({ ...rule, direction: 'above' })}
                  className="text-blue-600"
                />
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Above
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={rule.direction === 'below'}
                  onChange={() => onUpdateRule({ ...rule, direction: 'below' })}
                  className="text-blue-600"
                />
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Below
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for managing alerts
export function useKPIAlerts(initialAlerts: KPIAlert[] = []) {
  const [alerts, setAlerts] = useState<KPIAlert[]>(initialAlerts);

  const addAlert = useCallback((alert: Omit<KPIAlert, 'id'>) => {
    const newAlert: KPIAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
    };
    setAlerts(prev => [newAlert, ...prev]);
    return newAlert;
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, acknowledgedBy?: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? { ...a, state: 'acknowledged' as AlertState, acknowledgedAt: new Date(), acknowledgedBy }
        : a
    ));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? { ...a, state: 'resolved' as AlertState, resolvedAt: new Date() }
        : a
    ));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const activeCount = useMemo(
    () => alerts.filter(a => a.state === 'active').length,
    [alerts]
  );

  const criticalCount = useMemo(
    () => alerts.filter(a => a.severity === 'critical' && a.state === 'active').length,
    [alerts]
  );

  return {
    alerts,
    addAlert,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    activeCount,
    criticalCount,
  };
}

export type { KPIAlertListProps, AlertRulesManagerProps, AlertIndicatorProps, AlertBadgeProps };
