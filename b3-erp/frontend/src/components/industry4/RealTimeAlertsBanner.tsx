'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Bell,
  Volume2,
  VolumeX,
  X,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'machine' | 'quality' | 'safety' | 'production' | 'maintenance';

export interface ProductionAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface RealTimeAlertsBannerProps {
  onAlertClick?: (alert: ProductionAlert) => void;
  onAcknowledge?: (alertId: string) => void;
  soundEnabled?: boolean;
  maxVisibleAlerts?: number;
}

// ============================================================================
// Alert Configuration
// ============================================================================

const severityConfig: Record<AlertSeverity, {
  icon: React.ElementType;
  bgColor: string;
  borderColor: string;
  textColor: string;
  pulseColor: string;
  soundFrequency: number;
  soundDuration: number;
}> = {
  critical: {
    icon: XCircle,
    bgColor: 'bg-red-600',
    borderColor: 'border-red-700',
    textColor: 'text-white',
    pulseColor: 'bg-red-500',
    soundFrequency: 880,
    soundDuration: 0.3,
  },
  high: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-600',
    textColor: 'text-white',
    pulseColor: 'bg-orange-400',
    soundFrequency: 660,
    soundDuration: 0.25,
  },
  medium: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600',
    textColor: 'text-gray-900',
    pulseColor: 'bg-yellow-400',
    soundFrequency: 440,
    soundDuration: 0.2,
  },
  low: {
    icon: Bell,
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-600',
    textColor: 'text-white',
    pulseColor: 'bg-blue-400',
    soundFrequency: 330,
    soundDuration: 0.15,
  },
};

const typeLabels: Record<AlertType, string> = {
  machine: 'Machine',
  quality: 'Quality',
  safety: 'Safety',
  production: 'Production',
  maintenance: 'Maintenance',
};

// ============================================================================
// Sound Player
// ============================================================================

function playAlertSound(severity: AlertSeverity) {
  if (typeof window === 'undefined') return;

  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const config = severityConfig[severity];

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = config.soundFrequency;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.soundDuration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.soundDuration);

    // Play a second beep for critical alerts
    if (severity === 'critical') {
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.type = 'sine';
        osc2.frequency.value = config.soundFrequency * 1.5;
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.soundDuration);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + config.soundDuration);
      }, 150);
    }
  } catch {
    console.log('Audio not supported');
  }
}

// ============================================================================
// Alert Item Component
// ============================================================================

function AlertItem({
  alert,
  onAcknowledge,
  onClick,
  isCompact = false,
}: {
  alert: ProductionAlert;
  onAcknowledge?: () => void;
  onClick?: () => void;
  isCompact?: boolean;
}) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  const timeSince = () => {
    const seconds = Math.floor((Date.now() - alert.timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (isCompact) {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-3 px-4 py-2 cursor-pointer
          ${config.bgColor} ${config.textColor} ${config.borderColor}
          border-b last:border-b-0 hover:brightness-110 transition-all
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium truncate">{alert.title}</span>
        <span className="text-xs opacity-75">{timeSince()}</span>
        {!alert.acknowledged && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAcknowledge?.();
            }}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 ${config.borderColor}
        ${alert.acknowledged ? 'opacity-60' : ''} ${config.bgColor} ${config.textColor}
        transition-all duration-300 hover:shadow-lg
      `}
    >
      {/* Pulse animation for unacknowledged critical alerts */}
      {!alert.acknowledged && alert.severity === 'critical' && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className={`absolute inset-0 ${config.pulseColor} animate-pulse opacity-30`} />
        </div>
      )}

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${alert.severity === 'medium' ? 'bg-yellow-600/20' : 'bg-white/20'}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{alert.title}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              alert.severity === 'medium' ? 'bg-yellow-600/30' : 'bg-white/20'
            }`}>
              {typeLabels[alert.type]}
            </span>
          </div>
          <p className={`text-sm ${alert.severity === 'medium' ? 'text-gray-800' : 'text-white/90'}`}>
            {alert.message}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeSince()}
            </span>
            <span>Source: {alert.source}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!alert.acknowledged && (
            <button
              onClick={onAcknowledge}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Acknowledge"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          {alert.actionUrl && (
            <button
              onClick={onClick}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={alert.actionLabel || 'View Details'}
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Real-Time Alerts Banner Component
// ============================================================================

export function RealTimeAlertsBanner({
  onAlertClick,
  onAcknowledge,
  soundEnabled = true,
  maxVisibleAlerts = 5,
}: RealTimeAlertsBannerProps) {
  const [alerts, setAlerts] = useState<ProductionAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMuted, setIsMuted] = useState(!soundEnabled);
  const [showAll, setShowAll] = useState(false);
  const lastAlertIdRef = useRef<string | null>(null);

  // Generate simulated alerts
  const generateAlert = useCallback((): ProductionAlert => {
    const alertTemplates = [
      { title: 'Machine Overheating', message: 'CNC Mill #3 temperature exceeded 85°C threshold', type: 'machine' as AlertType, severity: 'critical' as AlertSeverity },
      { title: 'Quality Deviation', message: 'Batch #4521 dimensional variance above tolerance', type: 'quality' as AlertType, severity: 'high' as AlertSeverity },
      { title: 'Safety Interlock', message: 'Emergency stop triggered on Assembly Line 2', type: 'safety' as AlertType, severity: 'critical' as AlertSeverity },
      { title: 'Production Delay', message: 'Work Order WO-789 behind schedule by 45 minutes', type: 'production' as AlertType, severity: 'medium' as AlertSeverity },
      { title: 'Maintenance Due', message: 'Hydraulic Press #1 scheduled maintenance overdue', type: 'maintenance' as AlertType, severity: 'medium' as AlertSeverity },
      { title: 'Low Material', message: 'Raw material stock below minimum threshold', type: 'production' as AlertType, severity: 'high' as AlertSeverity },
      { title: 'Vibration Anomaly', message: 'Spindle vibration detected on Lathe #2', type: 'machine' as AlertType, severity: 'high' as AlertSeverity },
      { title: 'Tool Wear Alert', message: 'Cutting tool lifespan at 95%, replacement needed', type: 'maintenance' as AlertType, severity: 'low' as AlertSeverity },
      { title: 'Calibration Required', message: 'Inspection gauge requires calibration', type: 'quality' as AlertType, severity: 'low' as AlertSeverity },
    ];

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const sources = ['Machine #1', 'Machine #2', 'Line A', 'Line B', 'QC Station', 'Assembly'];

    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...template,
      source: sources[Math.floor(Math.random() * sources.length)],
      timestamp: new Date(),
      acknowledged: false,
      actionUrl: '/production/alerts',
      actionLabel: 'View Details',
    };
  }, []);

  // Add initial alerts
  useEffect(() => {
    const initialAlerts = Array.from({ length: 3 }, () => generateAlert());
    setAlerts(initialAlerts);
  }, [generateAlert]);

  // Simulate incoming alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = generateAlert();
        setAlerts(prev => [newAlert, ...prev].slice(0, 20));

        // Play sound for new alert
        if (!isMuted && newAlert.id !== lastAlertIdRef.current) {
          playAlertSound(newAlert.severity);
          lastAlertIdRef.current = newAlert.id;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [generateAlert, isMuted]);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    onAcknowledge?.(alertId);
  };

  const handleClearAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => !a.acknowledged && a.severity === 'critical').length;
  const visibleAlerts = showAll ? alerts : alerts.slice(0, maxVisibleAlerts);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header Bar */}
      <div
        className={`
          px-4 py-3 cursor-pointer transition-colors
          ${criticalCount > 0 ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AlertTriangle className={`w-6 h-6 ${criticalCount > 0 ? 'animate-pulse' : ''}`} />
              {unacknowledgedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {unacknowledgedCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Production Alerts</h3>
              <p className={`text-sm ${criticalCount > 0 ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {criticalCount > 0
                  ? `${criticalCount} critical alert${criticalCount > 1 ? 's' : ''} requiring attention`
                  : `${unacknowledgedCount} unacknowledged alert${unacknowledgedCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-lg transition-colors ${
                criticalCount > 0 ? 'hover:bg-white/20' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {/* Clear All */}
            {unacknowledgedCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  criticalCount > 0
                    ? 'bg-white/20 hover:bg-white/30'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
              >
                Clear All
              </button>
            )}

            {/* Expand/Collapse */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {isExpanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Critical Alerts - Always Full View */}
          {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).map(alert => (
            <div key={alert.id} className="p-4">
              <AlertItem
                alert={alert}
                onAcknowledge={() => handleAcknowledge(alert.id)}
                onClick={() => onAlertClick?.(alert)}
              />
            </div>
          ))}

          {/* Other Alerts - Compact View */}
          <div className="max-h-64 overflow-y-auto">
            {visibleAlerts
              .filter(a => a.severity !== 'critical' || a.acknowledged)
              .map(alert => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => handleAcknowledge(alert.id)}
                  onClick={() => onAlertClick?.(alert)}
                  isCompact
                />
              ))}
          </div>

          {/* Show More */}
          {alerts.length > maxVisibleAlerts && (
            <div className="p-3 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                {showAll ? 'Show Less' : `Show ${alerts.length - maxVisibleAlerts} More`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RealTimeAlertsBanner;
