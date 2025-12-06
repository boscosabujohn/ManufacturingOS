'use client';

import React, { useState, useMemo } from 'react';

// Types
export type WaterSource = 'municipal' | 'well' | 'recycled' | 'rainwater';
export type WaterUse = 'process' | 'cooling' | 'cleaning' | 'sanitary' | 'landscape';

export interface WaterConsumption {
  timestamp: Date;
  source: WaterSource;
  use: WaterUse;
  volume: number; // liters
  cost: number;
}

export interface WaterZone {
  id: string;
  name: string;
  use: WaterUse;
  dailyConsumption: number;
  monthlyConsumption: number;
  percentageOfTotal: number;
  trend: 'up' | 'down' | 'stable';
  hasLeak: boolean;
}

export interface WaterMetrics {
  totalConsumption: number;
  recycledPercentage: number;
  totalCost: number;
  costPerLiter: number;
  dailyAverage: number;
  leakAlerts: number;
  efficiency: number;
}

export interface WaterUsageMonitorProps {
  zones?: WaterZone[];
  metrics?: WaterMetrics;
  onZoneClick?: (zone: WaterZone) => void;
  onLeakAlert?: (zone: WaterZone) => void;
  className?: string;
}

// Configuration
const waterSourceConfig: Record<WaterSource, { name: string; icon: string; color: string }> = {
  municipal: { name: 'Municipal Supply', icon: '🚰', color: 'blue' },
  well: { name: 'Well Water', icon: '💧', color: 'cyan' },
  recycled: { name: 'Recycled Water', icon: '♻️', color: 'green' },
  rainwater: { name: 'Rainwater', icon: '🌧️', color: 'indigo' },
};

const waterUseConfig: Record<WaterUse, { name: string; icon: string; color: string }> = {
  process: { name: 'Process Water', icon: '⚙️', color: 'blue' },
  cooling: { name: 'Cooling Systems', icon: '❄️', color: 'cyan' },
  cleaning: { name: 'Cleaning', icon: '🧹', color: 'purple' },
  sanitary: { name: 'Sanitary', icon: '🚿', color: 'green' },
  landscape: { name: 'Landscape', icon: '🌱', color: 'lime' },
};

// Mock data generators
const generateMockZones = (): WaterZone[] => [
  { id: 'z1', name: 'CNC Coolant System', use: 'cooling', dailyConsumption: 4500, monthlyConsumption: 135000, percentageOfTotal: 35, trend: 'stable', hasLeak: false },
  { id: 'z2', name: 'Parts Washing', use: 'cleaning', dailyConsumption: 2800, monthlyConsumption: 84000, percentageOfTotal: 22, trend: 'down', hasLeak: false },
  { id: 'z3', name: 'Paint Shop', use: 'process', dailyConsumption: 2200, monthlyConsumption: 66000, percentageOfTotal: 17, trend: 'stable', hasLeak: false },
  { id: 'z4', name: 'Restrooms & Cafeteria', use: 'sanitary', dailyConsumption: 1500, monthlyConsumption: 45000, percentageOfTotal: 12, trend: 'stable', hasLeak: false },
  { id: 'z5', name: 'HVAC Cooling Tower', use: 'cooling', dailyConsumption: 1200, monthlyConsumption: 36000, percentageOfTotal: 9, trend: 'up', hasLeak: true },
  { id: 'z6', name: 'Outdoor Areas', use: 'landscape', dailyConsumption: 600, monthlyConsumption: 18000, percentageOfTotal: 5, trend: 'down', hasLeak: false },
];

const generateMockMetrics = (): WaterMetrics => ({
  totalConsumption: 384000,
  recycledPercentage: 32,
  totalCost: 1920,
  costPerLiter: 0.005,
  dailyAverage: 12800,
  leakAlerts: 1,
  efficiency: 78,
});

const generateHourlyData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const baseUsage = 400;
    const peakMultiplier = (i >= 6 && i <= 18) ? 1.5 + Math.sin((i - 6) * Math.PI / 12) * 0.5 : 0.4;
    data.push({
      hour: i,
      consumption: Math.round(baseUsage * peakMultiplier + Math.random() * 100),
      recycled: Math.round(baseUsage * peakMultiplier * 0.3 + Math.random() * 30),
    });
  }
  return data;
};

export function WaterUsageMonitor({
  zones: initialZones,
  metrics: initialMetrics,
  onZoneClick,
  onLeakAlert,
  className = '',
}: WaterUsageMonitorProps) {
  const [view, setView] = useState<'overview' | 'zones' | 'sources' | 'trends'>('overview');
  const [selectedZone, setSelectedZone] = useState<WaterZone | null>(null);

  const zones = useMemo(() => initialZones || generateMockZones(), [initialZones]);
  const metrics = useMemo(() => initialMetrics || generateMockMetrics(), [initialMetrics]);
  const hourlyData = useMemo(() => generateHourlyData(), []);

  const handleZoneClick = (zone: WaterZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-600' },
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      lime: { bg: 'bg-lime-600', text: 'text-lime-400', border: 'border-lime-600' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-600' },
    };
    return colors[color] || colors.blue;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💧</span>
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <p className="text-3xl font-bold text-white">{(metrics.totalConsumption / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Liters Consumed</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">♻️</span>
            <span className="text-xs text-green-400">+5% vs target</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.recycledPercentage}%</p>
          <p className="text-sm text-gray-400">Recycled Water</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <p className="text-3xl font-bold text-white">${metrics.totalCost.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Water Cost</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⚠️</span>
            {metrics.leakAlerts > 0 && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full animate-pulse">
                {metrics.leakAlerts} Alert
              </span>
            )}
          </div>
          <p className={`text-3xl font-bold ${metrics.leakAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.leakAlerts > 0 ? metrics.leakAlerts : '✓'}
          </p>
          <p className="text-sm text-gray-400">Leak Alerts</p>
        </div>
      </div>

      {/* Real-time Consumption */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">24-Hour Water Consumption</h3>
            <p className="text-sm text-gray-400">Fresh vs. recycled water usage</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-400">Fresh</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-400">Recycled</span>
            </div>
          </div>
        </div>

        <div className="h-48 flex items-end gap-1">
          {hourlyData.map((data, i) => {
            const maxTotal = Math.max(...hourlyData.map(d => d.consumption));
            const freshHeight = ((data.consumption - data.recycled) / maxTotal) * 100;
            const recycledHeight = (data.recycled / maxTotal) * 100;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end"
                title={`${data.hour}:00 - Fresh: ${data.consumption - data.recycled}L, Recycled: ${data.recycled}L`}
              >
                <div
                  className="bg-green-600 transition-all hover:opacity-80"
                  style={{ height: `${recycledHeight}%` }}
                />
                <div
                  className="bg-blue-600 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${freshHeight}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>Now</span>
        </div>
      </div>

      {/* Usage by Type */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Usage by Category</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {(() => {
                let cumulative = 0;
                return zones.map(zone => {
                  const config = waterUseConfig[zone.use];
                  const strokeDasharray = `${zone.percentageOfTotal * 2.51} 251`;
                  const strokeDashoffset = -cumulative * 2.51;
                  cumulative += zone.percentageOfTotal;

                  const colorMap: Record<string, string> = {
                    blue: '#3b82f6', cyan: '#06b6d4', purple: '#9333ea',
                    green: '#22c55e', lime: '#84cc16',
                  };

                  return (
                    <circle
                      key={zone.id}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colorMap[config.color]}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{metrics.dailyAverage.toLocaleString()}</span>
              <span className="text-xs text-gray-400">L/day avg</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {zones.map(zone => {
              const config = waterUseConfig[zone.use];
              const colors = getColorClass(config.color);

              return (
                <div key={zone.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded ${colors.bg}`} />
                  <span className="text-gray-300 flex-1">{zone.name}</span>
                  <span className="text-white font-medium">{zone.percentageOfTotal}%</span>
                  {zone.hasLeak && (
                    <span className="text-red-400 animate-pulse" title="Leak detected">⚠️</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderZones = () => (
    <div className="space-y-4">
      {zones.map(zone => {
        const config = waterUseConfig[zone.use];
        const colors = getColorClass(config.color);

        return (
          <div
            key={zone.id}
            className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${colors.border} ${zone.hasLeak ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => handleZoneClick(zone)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    {zone.name}
                    {zone.hasLeak && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full animate-pulse">
                        Leak Detected
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{config.name}</p>
                </div>
              </div>
              <span className={`text-xl ${
                zone.trend === 'down' ? 'text-green-400' :
                zone.trend === 'up' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {zone.trend === 'down' ? '↓' : zone.trend === 'up' ? '↑' : '→'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{zone.dailyConsumption.toLocaleString()}</p>
                <p className="text-sm text-gray-400">L/day</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{(zone.monthlyConsumption / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-400">L/month</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${colors.text}`}>{zone.percentageOfTotal}%</p>
                <p className="text-sm text-gray-400">of total</p>
              </div>
            </div>

            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${zone.percentageOfTotal}%` }} />
            </div>
          </div>
        );
      })}

      {/* Zone Detail Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{waterUseConfig[selectedZone.use].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
                  <p className="text-gray-400">{waterUseConfig[selectedZone.use].name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {selectedZone.hasLeak && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-400 font-medium">Leak Alert Active</p>
                  <p className="text-sm text-gray-400">Abnormal consumption detected. Maintenance notified.</p>
                </div>
                <button
                  onClick={() => onLeakAlert?.(selectedZone)}
                  className="ml-auto px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  Investigate
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{selectedZone.dailyConsumption.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Liters/Day</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{(selectedZone.monthlyConsumption / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-400">Liters/Month</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-cyan-400">{selectedZone.percentageOfTotal}%</p>
                <p className="text-sm text-gray-400">of Total Usage</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">
                  ${(selectedZone.monthlyConsumption * metrics.costPerLiter).toFixed(0)}
                </p>
                <p className="text-sm text-gray-400">Monthly Cost</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSources = () => (
    <div className="space-y-6">
      {/* Source Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(waterSourceConfig).map(([source, config]) => {
          const colors = getColorClass(config.color);
          // Simulated data
          const usage = source === 'municipal' ? 60 : source === 'recycled' ? 32 : source === 'well' ? 5 : 3;
          const volume = Math.round(metrics.totalConsumption * usage / 100);

          return (
            <div key={source} className={`bg-gray-800 rounded-lg p-4 border-l-4 ${colors.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <p className="text-white font-medium">{config.name}</p>
                  <p className={`text-sm ${colors.text}`}>{usage}% of total</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{(volume / 1000).toFixed(0)}k L</p>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${usage}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Water Balance */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Water Balance</h3>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">🚰</span>
            </div>
            <p className="text-xl font-bold text-blue-400">{(metrics.totalConsumption * 0.68 / 1000).toFixed(0)}k L</p>
            <p className="text-sm text-gray-400">Fresh Water In</p>
          </div>

          <div className="text-4xl text-gray-600">→</div>

          <div className="text-center">
            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-xl font-bold text-purple-400">{(metrics.totalConsumption / 1000).toFixed(0)}k L</p>
            <p className="text-sm text-gray-400">Process Usage</p>
          </div>

          <div className="text-4xl text-gray-600">→</div>

          <div className="text-center">
            <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">♻️</span>
            </div>
            <p className="text-xl font-bold text-green-400">{(metrics.totalConsumption * 0.32 / 1000).toFixed(0)}k L</p>
            <p className="text-sm text-gray-400">Recycled</p>
          </div>
        </div>
      </div>

      {/* Efficiency Gauge */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Water Efficiency Score</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="12"
                strokeDasharray={`${metrics.efficiency * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{metrics.efficiency}</span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Recycling Rate</span>
                <span className="text-white">{metrics.recycledPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: `${metrics.recycledPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Leak Detection</span>
                <span className="text-white">{metrics.leakAlerts === 0 ? '100%' : '85%'}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${metrics.leakAlerts === 0 ? 'bg-green-600' : 'bg-yellow-600'}`} style={{ width: metrics.leakAlerts === 0 ? '100%' : '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Usage vs Target</span>
                <span className="text-white">92%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Monthly Trend */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Water Consumption</h3>
        <div className="h-48 flex items-end gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
            const values = [380, 365, 390, 372, 384, 360];
            const maxValue = 400;
            const height = (values[i] / maxValue) * 100;

            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-40">
                  <div
                    className="w-full bg-cyan-600 rounded-t transition-all hover:bg-cyan-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{month}</span>
                <span className="text-xs text-white">{values[i]}k</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year over Year */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Year-over-Year Comparison</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Consumption (YTD)</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-white w-16">2024</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full" style={{ width: '75%' }} />
                </div>
                <span className="text-white w-20 text-right">2.1M L</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white w-16">2023</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-white w-20 text-right">2.4M L</span>
              </div>
            </div>
            <p className="text-green-400 text-sm mt-2">↓ 12.5% reduction</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Water Cost (YTD)</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-white w-16">2024</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '70%' }} />
                </div>
                <span className="text-white w-20 text-right">$10.5k</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white w-16">2023</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full" style={{ width: '82%' }} />
                </div>
                <span className="text-white w-20 text-right">$12.3k</span>
              </div>
            </div>
            <p className="text-green-400 text-sm mt-2">↓ 14.6% savings</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💧</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Water Usage Monitor</h2>
            <p className="text-gray-400">Water consumption tracking and efficiency</p>
          </div>
        </div>

        {/* Leak Alert */}
        {metrics.leakAlerts > 0 && (
          <div className="px-4 py-2 bg-red-600/20 border border-red-600 rounded-lg flex items-center gap-2 animate-pulse">
            <span className="text-xl">⚠️</span>
            <span className="text-red-400 font-medium">{metrics.leakAlerts} Leak Alert</span>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'zones', label: 'Zones', icon: '🏭' },
            { id: 'sources', label: 'Sources', icon: '🚰' },
            { id: 'trends', label: 'Trends', icon: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as typeof view)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === 'overview' && renderOverview()}
      {view === 'zones' && renderZones()}
      {view === 'sources' && renderSources()}
      {view === 'trends' && renderTrends()}
    </div>
  );
}

export default WaterUsageMonitor;
