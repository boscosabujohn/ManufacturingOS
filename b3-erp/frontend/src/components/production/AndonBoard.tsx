'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Factory,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pause,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Users,
  Package,
  Timer,
  Bell,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Settings
} from 'lucide-react';

export interface ProductionLine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'changeover' | 'breakdown' | 'idle';
  currentProduct?: string;
  workOrderNumber?: string;
  target: number;
  actual: number;
  oee: number;
  cycleTime: number; // seconds
  operator?: string;
  shift?: string;
  alerts?: Alert[];
  lastUpdate: Date;
}

export interface Alert {
  id: string;
  type: 'quality' | 'safety' | 'maintenance' | 'material' | 'general';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged?: boolean;
}

export interface AndonMetrics {
  totalOEE: number;
  totalOutput: number;
  totalTarget: number;
  activeLines: number;
  totalLines: number;
  qualityRate: number;
  availability: number;
  performance: number;
}

interface AndonBoardProps {
  lines: ProductionLine[];
  metrics?: AndonMetrics;
  onAlertAcknowledge?: (alertId: string, lineId: string) => void;
  onLineClick?: (line: ProductionLine) => void;
  refreshInterval?: number; // ms
  onRefresh?: () => void;
  showClock?: boolean;
  companyName?: string;
  plantName?: string;
  className?: string;
}

/**
 * AndonBoard - Large display view for production status
 * Designed for big screens on the shop floor
 */
export function AndonBoard({
  lines,
  metrics,
  onAlertAcknowledge,
  onLineClick,
  refreshInterval = 30000,
  onRefresh,
  showClock = true,
  companyName = 'OptiForge',
  plantName = 'Plant 1',
  className = ''
}: AndonBoardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [blinkingAlerts, setBlinkingAlerts] = useState(true);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh
  useEffect(() => {
    if (refreshInterval && onRefresh) {
      const timer = setInterval(() => {
        onRefresh();
        setLastRefresh(new Date());
      }, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [refreshInterval, onRefresh]);

  // Blinking animation for alerts
  useEffect(() => {
    const timer = setInterval(() => {
      setBlinkingAlerts(prev => !prev);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Calculate metrics if not provided
  const calculatedMetrics = useMemo<AndonMetrics>(() => {
    if (metrics) return metrics;

    const totalTarget = lines.reduce((sum, l) => sum + l.target, 0);
    const totalOutput = lines.reduce((sum, l) => sum + l.actual, 0);
    const avgOEE = lines.length > 0 ? lines.reduce((sum, l) => sum + l.oee, 0) / lines.length : 0;
    const activeLines = lines.filter(l => l.status === 'running').length;

    return {
      totalOEE: avgOEE,
      totalOutput,
      totalTarget,
      activeLines,
      totalLines: lines.length,
      qualityRate: 98.5, // Default
      availability: 92.3,
      performance: 87.8
    };
  }, [metrics, lines]);

  // Get status color
  const getStatusColor = (status: ProductionLine['status']) => {
    const colors = {
      running: 'bg-green-500',
      stopped: 'bg-red-500',
      changeover: 'bg-yellow-500',
      breakdown: 'bg-red-600',
      idle: 'bg-gray-400'
    };
    return colors[status];
  };

  const getStatusBgGradient = (status: ProductionLine['status']) => {
    const gradients = {
      running: 'from-green-500 to-green-600',
      stopped: 'from-red-500 to-red-600',
      changeover: 'from-yellow-500 to-yellow-600',
      breakdown: 'from-red-600 to-red-700',
      idle: 'from-gray-400 to-gray-500'
    };
    return gradients[status];
  };

  const getStatusIcon = (status: ProductionLine['status']) => {
    const icons = {
      running: CheckCircle2,
      stopped: XCircle,
      changeover: RefreshCw,
      breakdown: AlertTriangle,
      idle: Pause
    };
    return icons[status];
  };

  // Alert counts
  const criticalAlerts = lines.flatMap(l => l.alerts || []).filter(a => a.severity === 'critical' && !a.acknowledged);
  const warningAlerts = lines.flatMap(l => l.alerts || []).filter(a => a.severity === 'warning' && !a.acknowledged);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${className}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Company Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Factory className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{companyName}</h1>
              <p className="text-gray-400">{plantName} - Production Andon</p>
            </div>
          </div>

          {/* Alerts Summary */}
          <div className="flex items-center gap-4">
            {criticalAlerts.length > 0 && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                blinkingAlerts ? 'bg-red-600' : 'bg-red-700'
              } transition-colors`}>
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">{criticalAlerts.length} Critical</span>
              </div>
            )}
            {warningAlerts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">{warningAlerts.length} Warnings</span>
              </div>
            )}
          </div>

          {/* Clock & Controls */}
          <div className="flex items-center gap-6">
            {showClock && (
              <div className="text-right">
                <div className="text-3xl font-mono font-bold">{formatTime(currentTime)}</div>
                <div className="text-sm text-gray-400">{formatDate(currentTime)}</div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title={soundEnabled ? 'Mute alerts' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => { onRefresh?.(); setLastRefresh(new Date()); }}
                className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Top Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {/* OEE */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-200 text-sm font-medium">Overall OEE</span>
              <Activity className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.totalOEE.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-1 text-sm text-blue-200">
              {calculatedMetrics.totalOEE >= 85 ? (
                <><TrendingUp className="w-4 h-4" /> On Target</>
              ) : (
                <><TrendingDown className="w-4 h-4" /> Below Target</>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-200 text-sm font-medium">Output</span>
              <Package className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.totalOutput.toLocaleString()}</div>
            <div className="text-sm text-green-200 mt-1">
              Target: {calculatedMetrics.totalTarget.toLocaleString()}
            </div>
          </div>

          {/* Active Lines */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm font-medium">Active Lines</span>
              <Factory className="w-5 h-5 text-purple-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.activeLines}/{calculatedMetrics.totalLines}</div>
            <div className="text-sm text-purple-200 mt-1">
              {((calculatedMetrics.activeLines / calculatedMetrics.totalLines) * 100).toFixed(0)}% Running
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-200 text-sm font-medium">Availability</span>
              <Clock className="w-5 h-5 text-cyan-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.availability.toFixed(1)}%</div>
            <div className="h-2 bg-cyan-800 rounded-full mt-2">
              <div
                className="h-full bg-cyan-300 rounded-full"
                style={{ width: `${calculatedMetrics.availability}%` }}
              />
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-200 text-sm font-medium">Performance</span>
              <Zap className="w-5 h-5 text-orange-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.performance.toFixed(1)}%</div>
            <div className="h-2 bg-orange-800 rounded-full mt-2">
              <div
                className="h-full bg-orange-300 rounded-full"
                style={{ width: `${calculatedMetrics.performance}%` }}
              />
            </div>
          </div>

          {/* Quality */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-pink-200 text-sm font-medium">Quality</span>
              <CheckCircle2 className="w-5 h-5 text-pink-200" />
            </div>
            <div className="text-4xl font-bold">{calculatedMetrics.qualityRate.toFixed(1)}%</div>
            <div className="h-2 bg-pink-800 rounded-full mt-2">
              <div
                className="h-full bg-pink-300 rounded-full"
                style={{ width: `${calculatedMetrics.qualityRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Production Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lines.map(line => {
            const StatusIcon = getStatusIcon(line.status);
            const efficiency = line.target > 0 ? (line.actual / line.target) * 100 : 0;
            const hasAlerts = (line.alerts || []).some(a => !a.acknowledged);
            const criticalAlert = (line.alerts || []).find(a => a.severity === 'critical' && !a.acknowledged);

            return (
              <div
                key={line.id}
                onClick={() => onLineClick?.(line)}
                className={`relative bg-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${
                  criticalAlert && blinkingAlerts ? 'ring-4 ring-red-500' : ''
                }`}
              >
                {/* Status Banner */}
                <div className={`h-2 bg-gradient-to-r ${getStatusBgGradient(line.status)}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{line.name}</h3>
                      <p className="text-gray-400 text-sm">{line.workOrderNumber || 'No active order'}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${getStatusColor(line.status)}`}>
                      <StatusIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Current Product */}
                  {line.currentProduct && (
                    <div className="mb-4 px-3 py-2 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Current Product</p>
                      <p className="text-white font-medium truncate">{line.currentProduct}</p>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase">Output</p>
                      <p className="text-2xl font-bold text-white">{line.actual}</p>
                      <p className="text-xs text-gray-500">/ {line.target} target</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase">OEE</p>
                      <p className={`text-2xl font-bold ${
                        line.oee >= 85 ? 'text-green-400' : line.oee >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {line.oee.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{efficiency.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          efficiency >= 100 ? 'bg-green-500' : efficiency >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(efficiency, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{line.operator || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Timer className="w-4 h-4" />
                      <span>{line.cycleTime}s</span>
                    </div>
                  </div>

                  {/* Alert Badge */}
                  {hasAlerts && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 rounded-full ${
                        criticalAlert ? 'bg-red-500' : 'bg-yellow-500'
                      } ${blinkingAlerts ? 'opacity-100' : 'opacity-50'}`} />
                    </div>
                  )}
                </div>

                {/* Active Alert Banner */}
                {criticalAlert && (
                  <div className={`px-5 py-3 bg-red-600 ${blinkingAlerts ? 'opacity-100' : 'opacity-80'}`}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{criticalAlert.message}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Alerts */}
        {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
          <div className="mt-6 bg-gray-800 rounded-2xl p-5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Alerts
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...criticalAlerts, ...warningAlerts].slice(0, 10).map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-900/50' : 'bg-yellow-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-400">
                        {alert.timestamp.toLocaleTimeString()} - {alert.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlertAcknowledge?.(alert.id, '');
                    }}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh: {refreshInterval / 1000}s
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Changeover</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Stopped</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Idle</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AndonBoard;
