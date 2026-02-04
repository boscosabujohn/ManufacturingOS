'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Types
export type AlertType = 'break' | 'posture' | 'hydration' | 'eye_strain' | 'stretch' | 'noise' | 'temperature' | 'fatigue';
export type AlertPriority = 'info' | 'warning' | 'urgent';

export interface ErgonomicAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  priority: AlertPriority;
  timestamp: Date;
  dismissed: boolean;
  snoozedUntil?: Date;
  iotTriggered?: boolean;
  sensorData?: Record<string, number>;
}

export interface BreakSchedule {
  id: string;
  type: 'micro' | 'short' | 'meal';
  scheduledTime: Date;
  duration: number; // minutes
  completed: boolean;
  skipped: boolean;
}

export interface WellnessMetrics {
  workDuration: number; // minutes since last break
  totalBreaksTaken: number;
  totalBreaksScheduled: number;
  hydrationReminders: number;
  postureCorrectionCount: number;
  stretchesCompleted: number;
  fatigueLevel: number; // 0-100
  stressLevel: number; // 0-100
}

export interface IoTSensorStatus {
  postureCamera: 'connected' | 'disconnected' | 'analyzing';
  ambientSensor: 'connected' | 'disconnected';
  noiseMonitor: 'connected' | 'disconnected';
  wearableDevice: 'connected' | 'disconnected';
}

export interface ErgonomicAlertsProps {
  employeeId?: string;
  employeeName?: string;
  alerts?: ErgonomicAlert[];
  breakSchedule?: BreakSchedule[];
  metrics?: WellnessMetrics;
  iotStatus?: IoTSensorStatus;
  onAlertDismiss?: (alertId: string) => void;
  onAlertSnooze?: (alertId: string, minutes: number) => void;
  onBreakStart?: (breakId: string) => void;
  onBreakComplete?: (breakId: string) => void;
  onBreakSkip?: (breakId: string) => void;
  className?: string;
}

// Fixed date for consistent rendering
const MOCK_NOW = new Date('2024-03-10T10:30:00').getTime();

// Mock data generators
const generateMockAlerts = (): ErgonomicAlert[] => [
  {
    id: 'a1',
    type: 'break',
    title: 'Break Time Reminder',
    message: 'You have been working for 2 hours. Time for a 15-minute break!',
    priority: 'warning',
    timestamp: new Date(MOCK_NOW),
    dismissed: false,
  },
  {
    id: 'a2',
    type: 'posture',
    title: 'Posture Alert',
    message: 'Poor posture detected. Please adjust your standing position.',
    priority: 'info',
    timestamp: new Date(MOCK_NOW - 300000),
    dismissed: false,
    iotTriggered: true,
    sensorData: { spineAngle: 15, shoulderAlignment: 78 },
  },
  {
    id: 'a3',
    type: 'hydration',
    title: 'Hydration Reminder',
    message: 'Remember to drink water! Stay hydrated for better performance.',
    priority: 'info',
    timestamp: new Date(MOCK_NOW - 600000),
    dismissed: false,
  },
  {
    id: 'a4',
    type: 'noise',
    title: 'High Noise Level',
    message: 'Current noise level: 92dB. Consider using hearing protection.',
    priority: 'urgent',
    timestamp: new Date(MOCK_NOW - 120000),
    dismissed: false,
    iotTriggered: true,
    sensorData: { noiseLevel: 92 },
  },
  {
    id: 'a5',
    type: 'fatigue',
    title: 'Fatigue Warning',
    message: 'Your activity patterns suggest fatigue. Consider taking a rest.',
    priority: 'warning',
    timestamp: new Date(MOCK_NOW - 1800000),
    dismissed: true,
    iotTriggered: true,
    sensorData: { heartRateVariability: 45, movementScore: 32 },
  },
];

const generateMockBreakSchedule = (): BreakSchedule[] => [
  { id: 'b1', type: 'micro', scheduledTime: new Date(MOCK_NOW - 7200000), duration: 5, completed: true, skipped: false },
  { id: 'b2', type: 'micro', scheduledTime: new Date(MOCK_NOW - 3600000), duration: 5, completed: true, skipped: false },
  { id: 'b3', type: 'short', scheduledTime: new Date(MOCK_NOW + 900000), duration: 15, completed: false, skipped: false },
  { id: 'b4', type: 'meal', scheduledTime: new Date(MOCK_NOW + 7200000), duration: 30, completed: false, skipped: false },
  { id: 'b5', type: 'micro', scheduledTime: new Date(MOCK_NOW + 10800000), duration: 5, completed: false, skipped: false },
];

const generateMockMetrics = (): WellnessMetrics => ({
  workDuration: 117,
  totalBreaksTaken: 2,
  totalBreaksScheduled: 5,
  hydrationReminders: 3,
  postureCorrectionCount: 4,
  stretchesCompleted: 2,
  fatigueLevel: 42,
  stressLevel: 35,
});

const generateMockIoTStatus = (): IoTSensorStatus => ({
  postureCamera: 'analyzing',
  ambientSensor: 'connected',
  noiseMonitor: 'connected',
  wearableDevice: 'connected',
});

const alertTypeConfig: Record<AlertType, { icon: string; color: string; label: string }> = {
  break: { icon: '☕', color: 'blue', label: 'Break' },
  posture: { icon: '🧘', color: 'purple', label: 'Posture' },
  hydration: { icon: '💧', color: 'cyan', label: 'Hydration' },
  eye_strain: { icon: '👁️', color: 'indigo', label: 'Eye Strain' },
  stretch: { icon: '🤸', color: 'green', label: 'Stretch' },
  noise: { icon: '🔊', color: 'orange', label: 'Noise' },
  temperature: { icon: '🌡️', color: 'red', label: 'Temperature' },
  fatigue: { icon: '😴', color: 'amber', label: 'Fatigue' },
};

export function ErgonomicAlerts({
  employeeName = 'Operator',
  alerts: initialAlerts,
  breakSchedule: initialBreakSchedule,
  metrics: initialMetrics,
  iotStatus: initialIoTStatus,
  onAlertDismiss,
  onAlertSnooze,
  onBreakStart,
  onBreakComplete,
  onBreakSkip,
  className = '',
}: ErgonomicAlertsProps) {
  const [alerts, setAlerts] = useState<ErgonomicAlert[]>(initialAlerts || generateMockAlerts());
  const [breakSchedule, setBreakSchedule] = useState<BreakSchedule[]>(initialBreakSchedule || generateMockBreakSchedule());
  const [metrics, setMetrics] = useState<WellnessMetrics>(initialMetrics || generateMockMetrics());
  const [iotStatus] = useState<IoTSensorStatus>(initialIoTStatus || generateMockIoTStatus());
  const [view, setView] = useState<'alerts' | 'schedule' | 'wellness' | 'settings'>('alerts');
  const [activeBreak, setActiveBreak] = useState<BreakSchedule | null>(null);
  const [breakTimer, setBreakTimer] = useState<number>(0);
  const [showSnoozeModal, setShowSnoozeModal] = useState<string | null>(null);

  // Work duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        workDuration: prev.workDuration + 1,
      }));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Break timer
  useEffect(() => {
    if (activeBreak && breakTimer > 0) {
      const interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            setActiveBreak(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeBreak, breakTimer]);

  const handleDismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, dismissed: true } : a));
    onAlertDismiss?.(alertId);
  }, [onAlertDismiss]);

  const handleSnoozeAlert = useCallback((alertId: string, minutes: number) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? { ...a, snoozedUntil: new Date(Date.now() + minutes * 60000) }
        : a
    ));
    onAlertSnooze?.(alertId, minutes);
    setShowSnoozeModal(null);
  }, [onAlertSnooze]);

  const handleStartBreak = useCallback((breakItem: BreakSchedule) => {
    setActiveBreak(breakItem);
    setBreakTimer(breakItem.duration * 60);
    onBreakStart?.(breakItem.id);
  }, [onBreakStart]);

  const handleCompleteBreak = useCallback(() => {
    if (activeBreak) {
      setBreakSchedule(prev => prev.map(b =>
        b.id === activeBreak.id ? { ...b, completed: true } : b
      ));
      setMetrics(prev => ({
        ...prev,
        totalBreaksTaken: prev.totalBreaksTaken + 1,
        workDuration: 0,
      }));
      onBreakComplete?.(activeBreak.id);
      setActiveBreak(null);
      setBreakTimer(0);
    }
  }, [activeBreak, onBreakComplete]);

  const handleSkipBreak = useCallback((breakId: string) => {
    setBreakSchedule(prev => prev.map(b =>
      b.id === breakId ? { ...b, skipped: true } : b
    ));
    onBreakSkip?.(breakId);
  }, [onBreakSkip]);

  const activeAlerts = alerts.filter(a => !a.dismissed && (!a.snoozedUntil || a.snoozedUntil < new Date()));
  const nextBreak = breakSchedule.find(b => !b.completed && !b.skipped && b.scheduledTime > new Date());

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-900/30 border-red-700';
      case 'warning': return 'bg-yellow-900/30 border-yellow-700';
      default: return 'bg-blue-900/30 border-blue-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const renderAlerts = () => (
    <div className="space-y-2">
      {/* Active Break Overlay */}
      {activeBreak && (
        <div className="bg-green-900/50 border border-green-600 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">☕</span>
              <div>
                <p className="text-white text-xl font-bold">Break Time!</p>
                <p className="text-green-300">{activeBreak.type === 'meal' ? 'Meal Break' : activeBreak.type === 'short' ? 'Short Break' : 'Micro Break'}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-mono font-bold text-white">{formatTime(breakTimer)}</p>
              <p className="text-sm text-green-300">remaining</p>
            </div>
          </div>

          <div className="h-2 bg-green-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(breakTimer / (activeBreak.duration * 60)) * 100}%` }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCompleteBreak}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
            >
              End Break Early
            </button>
            <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors">
              +5 min
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {activeAlerts.length === 0 && !activeBreak ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-2 block">✅</span>
          <p className="text-white text-xl font-medium">All caught up!</p>
          <p className="text-gray-400">No active wellness alerts at the moment</p>
        </div>
      ) : (
        activeAlerts.map(alert => {
          const config = alertTypeConfig[alert.type];
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${getPriorityColor(alert.priority)} transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">{alert.title}</p>
                      {alert.iotTriggered && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded">
                          IoT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSnoozeModal(alert.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Snooze"
                  >
                    ⏰
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {alert.sensorData && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Sensor Data:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(alert.sensorData).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-3">
      {/* Next Break */}
      {nextBreak && (
        <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Next Break</p>
              <p className="text-2xl font-bold text-white">
                {nextBreak.type === 'meal' ? 'Meal Break' : nextBreak.type === 'short' ? 'Short Break' : 'Micro Break'}
              </p>
              <p className="text-blue-400">
                In {Math.round((nextBreak.scheduledTime.getTime() - Date.now()) / 60000)} minutes • {nextBreak.duration} min duration
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStartBreak(nextBreak)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
              >
                Start Now
              </button>
              <button
                onClick={() => handleSkipBreak(nextBreak.id)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Timeline */}
      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Today&apos;s Break Schedule</h3>
        <div className="space-y-3">
          {breakSchedule.map(breakItem => (
            <div
              key={breakItem.id}
              className={`flex items-center gap-2 p-3 rounded-lg ${breakItem.completed ? 'bg-green-900/20 border border-green-700' :
                  breakItem.skipped ? 'bg-gray-700/50 opacity-50' :
                    'bg-gray-700'
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${breakItem.completed ? 'bg-green-600' :
                  breakItem.skipped ? 'bg-gray-600' :
                    'bg-blue-600'
                }`}>
                {breakItem.completed ? '✓' :
                  breakItem.skipped ? '—' :
                    breakItem.type === 'meal' ? '🍽️' :
                      breakItem.type === 'short' ? '☕' : '⚡'}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {breakItem.type === 'meal' ? 'Meal Break' :
                    breakItem.type === 'short' ? 'Short Break' : 'Micro Break'}
                </p>
                <p className="text-sm text-gray-400">
                  {breakItem.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' • '}{breakItem.duration} minutes
                </p>
              </div>
              {!breakItem.completed && !breakItem.skipped && breakItem.scheduledTime <= new Date() && (
                <button
                  onClick={() => handleStartBreak(breakItem)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Start
                </button>
              )}
              {breakItem.completed && <span className="text-green-400">Completed</span>}
              {breakItem.skipped && <span className="text-gray-400">Skipped</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWellness = () => (
    <div className="space-y-3">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-xl p-3">
          <p className="text-gray-400 text-sm">Time Since Break</p>
          <p className={`text-3xl font-bold ${metrics.workDuration > 120 ? 'text-red-400' : metrics.workDuration > 90 ? 'text-yellow-400' : 'text-green-400'}`}>
            {formatDuration(metrics.workDuration)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {metrics.workDuration > 120 ? 'Break overdue!' : metrics.workDuration > 90 ? 'Break soon' : 'On track'}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3">
          <p className="text-gray-400 text-sm">Breaks Taken</p>
          <p className="text-3xl font-bold text-blue-400">
            {metrics.totalBreaksTaken}/{metrics.totalBreaksScheduled}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((metrics.totalBreaksTaken / metrics.totalBreaksScheduled) * 100)}% compliance
          </p>
        </div>
      </div>

      {/* Wellness Gauges */}
      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Wellness Indicators</h3>
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Fatigue Level</span>
              <span className={`font-bold ${metrics.fatigueLevel > 70 ? 'text-red-400' : metrics.fatigueLevel > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {metrics.fatigueLevel}%
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${metrics.fatigueLevel > 70 ? 'bg-red-600' :
                    metrics.fatigueLevel > 50 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                style={{ width: `${metrics.fatigueLevel}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Stress Level</span>
              <span className={`font-bold ${metrics.stressLevel > 70 ? 'text-red-400' : metrics.stressLevel > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {metrics.stressLevel}%
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${metrics.stressLevel > 70 ? 'bg-red-600' :
                    metrics.stressLevel > 50 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                style={{ width: `${metrics.stressLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Today&apos;s Activity</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <p className="text-3xl mb-1">💧</p>
            <p className="text-2xl font-bold text-cyan-400">{metrics.hydrationReminders}</p>
            <p className="text-xs text-gray-400">Hydration Reminders</p>
          </div>
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <p className="text-3xl mb-1">🧘</p>
            <p className="text-2xl font-bold text-purple-400">{metrics.postureCorrectionCount}</p>
            <p className="text-xs text-gray-400">Posture Corrections</p>
          </div>
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <p className="text-3xl mb-1">🤸</p>
            <p className="text-2xl font-bold text-green-400">{metrics.stretchesCompleted}</p>
            <p className="text-xs text-gray-400">Stretches Done</p>
          </div>
        </div>
      </div>

      {/* IoT Sensor Status */}
      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">IoT Sensor Status</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(iotStatus).map(([sensor, status]) => (
            <div key={sensor} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 capitalize">{sensor.replace(/([A-Z])/g, ' $1')}</span>
              <span className={`flex items-center gap-2 ${status === 'connected' || status === 'analyzing' ? 'text-green-400' : 'text-red-400'
                }`}>
                <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' :
                    status === 'analyzing' ? 'bg-blue-500 animate-pulse' :
                      'bg-red-500'
                  }`} />
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Alert Preferences</h3>
        <div className="space-y-2">
          {Object.entries(alertTypeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <span className="text-white">{config.label} Alerts</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Break Intervals</h3>
        <div className="space-y-2">
          <div>
            <label className="text-gray-400 text-sm">Micro Break Frequency</label>
            <select className="w-full mt-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 outline-none">
              <option>Every 30 minutes</option>
              <option>Every 45 minutes</option>
              <option>Every 60 minutes</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Short Break Duration</label>
            <select className="w-full mt-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 outline-none">
              <option>10 minutes</option>
              <option>15 minutes</option>
              <option>20 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-2xl">
            🧘
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Wellness & Ergonomics</h2>
            <p className="text-gray-400">Stay healthy, stay productive - {employeeName}</p>
          </div>
        </div>

        {/* Active Alerts Badge */}
        {activeAlerts.length > 0 && view !== 'alerts' && (
          <button
            onClick={() => setView('alerts')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors animate-pulse"
          >
            <span>🔔</span>
            <span>{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* View Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-3">
        {[
          { id: 'alerts', label: 'Alerts', icon: '🔔' },
          { id: 'schedule', label: 'Schedule', icon: '📅' },
          { id: 'wellness', label: 'Wellness', icon: '💚' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as typeof view)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${view === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === 'alerts' && activeAlerts.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'alerts' && renderAlerts()}
      {view === 'schedule' && renderSchedule()}
      {view === 'wellness' && renderWellness()}
      {view === 'settings' && renderSettings()}

      {/* Snooze Modal */}
      {showSnoozeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
          <div className="bg-gray-800 rounded-xl p-3 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2">Snooze Alert</h3>
            <p className="text-gray-400 mb-2">Remind me again in:</p>
            <div className="grid grid-cols-2 gap-3">
              {[5, 10, 15, 30].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSnoozeAlert(showSnoozeModal, mins)}
                  className="py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  {mins} minutes
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSnoozeModal(null)}
              className="w-full mt-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ErgonomicAlerts;
