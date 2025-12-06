'use client';

import React, { useState, useMemo } from 'react';

// Types
export type EnergyType = 'electricity' | 'natural_gas' | 'solar' | 'diesel' | 'compressed_air';
export type ConsumptionTrend = 'increasing' | 'decreasing' | 'stable';

export interface EnergyConsumption {
  timestamp: Date;
  type: EnergyType;
  value: number;
  unit: string;
  cost: number;
}

export interface EnergyZone {
  id: string;
  name: string;
  type: 'production' | 'warehouse' | 'office' | 'hvac' | 'lighting';
  consumption: number; // kWh
  percentage: number;
  trend: ConsumptionTrend;
  peakLoad: number;
  avgLoad: number;
}

export interface CostProjection {
  period: string;
  projected: number;
  budget: number;
  variance: number;
}

export interface EnergyMetrics {
  totalConsumption: number;
  totalCost: number;
  renewablePercentage: number;
  peakDemand: number;
  avgDemand: number;
  costPerUnit: number;
  co2Avoided: number;
}

export interface EnergyConsumptionDashboardProps {
  zones?: EnergyZone[];
  projections?: CostProjection[];
  metrics?: EnergyMetrics;
  onZoneClick?: (zone: EnergyZone) => void;
  className?: string;
}

// Configuration
const energyTypeConfig: Record<EnergyType, { name: string; icon: string; color: string; unit: string }> = {
  electricity: { name: 'Electricity', icon: '⚡', color: 'yellow', unit: 'kWh' },
  natural_gas: { name: 'Natural Gas', icon: '🔥', color: 'orange', unit: 'therms' },
  solar: { name: 'Solar', icon: '☀️', color: 'green', unit: 'kWh' },
  diesel: { name: 'Diesel', icon: '⛽', color: 'gray', unit: 'L' },
  compressed_air: { name: 'Compressed Air', icon: '💨', color: 'cyan', unit: 'm³' },
};

const zoneTypeConfig: Record<string, { icon: string; color: string }> = {
  production: { icon: '🏭', color: 'blue' },
  warehouse: { icon: '📦', color: 'purple' },
  office: { icon: '🏢', color: 'green' },
  hvac: { icon: '❄️', color: 'cyan' },
  lighting: { icon: '💡', color: 'yellow' },
};

// Mock data generators
const generateMockZones = (): EnergyZone[] => [
  { id: 'z1', name: 'CNC Department', type: 'production', consumption: 4500, percentage: 35, trend: 'stable', peakLoad: 180, avgLoad: 125 },
  { id: 'z2', name: 'Assembly Line', type: 'production', consumption: 3200, percentage: 25, trend: 'decreasing', peakLoad: 140, avgLoad: 95 },
  { id: 'z3', name: 'HVAC System', type: 'hvac', consumption: 2100, percentage: 16, trend: 'increasing', peakLoad: 95, avgLoad: 65 },
  { id: 'z4', name: 'Warehouse', type: 'warehouse', consumption: 1500, percentage: 12, trend: 'stable', peakLoad: 70, avgLoad: 45 },
  { id: 'z5', name: 'Office Building', type: 'office', consumption: 850, percentage: 7, trend: 'decreasing', peakLoad: 45, avgLoad: 30 },
  { id: 'z6', name: 'Facility Lighting', type: 'lighting', consumption: 650, percentage: 5, trend: 'decreasing', peakLoad: 35, avgLoad: 25 },
];

const generateMockProjections = (): CostProjection[] => [
  { period: 'Jan', projected: 42000, budget: 45000, variance: -6.7 },
  { period: 'Feb', projected: 38500, budget: 42000, variance: -8.3 },
  { period: 'Mar', projected: 41200, budget: 43000, variance: -4.2 },
  { period: 'Apr', projected: 44800, budget: 44000, variance: 1.8 },
  { period: 'May', projected: 48500, budget: 46000, variance: 5.4 },
  { period: 'Jun', projected: 52000, budget: 48000, variance: 8.3 },
];

const generateMockMetrics = (): EnergyMetrics => ({
  totalConsumption: 12800,
  totalCost: 48500,
  renewablePercentage: 28,
  peakDemand: 565,
  avgDemand: 385,
  costPerUnit: 0.12,
  co2Avoided: 1250,
});

const generateHourlyUsage = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    // Simulate typical manufacturing usage pattern
    const baseLoad = 300;
    const peakMultiplier = (i >= 6 && i <= 18) ? 1.5 + Math.sin((i - 6) * Math.PI / 12) * 0.5 : 0.6;
    const consumption = baseLoad * peakMultiplier + Math.random() * 50;
    const solar = i >= 6 && i <= 18 ? Math.sin((i - 6) * Math.PI / 12) * 80 : 0;

    data.push({
      hour: i,
      grid: Math.round(consumption - solar),
      solar: Math.round(solar),
      total: Math.round(consumption),
    });
  }
  return data;
};

export function EnergyConsumptionDashboard({
  zones: initialZones,
  projections: initialProjections,
  metrics: initialMetrics,
  onZoneClick,
  className = '',
}: EnergyConsumptionDashboardProps) {
  const [view, setView] = useState<'overview' | 'zones' | 'costs' | 'trends'>('overview');
  const [selectedZone, setSelectedZone] = useState<EnergyZone | null>(null);

  const zones = useMemo(() => initialZones || generateMockZones(), [initialZones]);
  const projections = useMemo(() => initialProjections || generateMockProjections(), [initialProjections]);
  const metrics = useMemo(() => initialMetrics || generateMockMetrics(), [initialMetrics]);
  const hourlyUsage = useMemo(() => generateHourlyUsage(), []);

  const handleZoneClick = (zone: EnergyZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-600' },
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-600' },
      gray: { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-600' },
    };
    return colors[color] || colors.gray;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.totalConsumption.toLocaleString()}</p>
          <p className="text-sm text-gray-400">kWh Consumed</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <p className="text-3xl font-bold text-white">${metrics.totalCost.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Energy Cost</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">☀️</span>
            <span className="text-xs text-green-400">+5% vs last month</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.renewablePercentage}%</p>
          <p className="text-sm text-gray-400">Renewable Energy</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xs text-gray-400">Saved</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{metrics.co2Avoided.toLocaleString()}</p>
          <p className="text-sm text-gray-400">kg CO₂ Avoided</p>
        </div>
      </div>

      {/* Real-time Power Usage */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Real-Time Power Consumption</h3>
            <p className="text-sm text-gray-400">24-hour usage pattern</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-sm text-gray-400">Grid</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-400">Solar</span>
            </div>
          </div>
        </div>

        <div className="h-48 flex items-end gap-1">
          {hourlyUsage.map((data, i) => {
            const maxTotal = Math.max(...hourlyUsage.map(d => d.total));
            const gridHeight = (data.grid / maxTotal) * 100;
            const solarHeight = (data.solar / maxTotal) * 100;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end"
                title={`${data.hour}:00 - Grid: ${data.grid}kW, Solar: ${data.solar}kW`}
              >
                <div
                  className="bg-green-600 transition-all hover:opacity-80"
                  style={{ height: `${solarHeight}%` }}
                />
                <div
                  className="bg-yellow-600 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${gridHeight}%` }}
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
          <span>23:00</span>
        </div>
      </div>

      {/* Demand Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Power Demand</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Current Load</p>
              <p className="text-3xl font-bold text-white">{metrics.avgDemand} kW</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Peak Today</p>
              <p className="text-3xl font-bold text-yellow-400">{metrics.peakDemand} kW</p>
            </div>
          </div>
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 via-yellow-600 to-red-600"
              style={{ width: `${(metrics.avgDemand / 700) * 100}%` }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-red-500"
              style={{ left: `${(metrics.peakDemand / 700) * 100}%` }}
              title={`Peak: ${metrics.peakDemand}kW`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0 kW</span>
            <span>350 kW</span>
            <span>700 kW (Max Capacity)</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cost per kWh</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${75 * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">${metrics.costPerUnit}</span>
                <span className="text-xs text-gray-400">/kWh</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Grid Rate</span>
                <span className="text-white">$0.14/kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Peak Rate</span>
                <span className="text-yellow-400">$0.22/kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Solar (effective)</span>
                <span className="text-green-400">$0.00/kWh</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-2">
                <span className="text-gray-400">Blended Average</span>
                <span className="text-white font-bold">${metrics.costPerUnit}/kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderZones = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {zones.map(zone => {
          const config = zoneTypeConfig[zone.type];
          const colors = getColorClass(config.color);

          return (
            <div
              key={zone.id}
              className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${colors.border}`}
              onClick={() => handleZoneClick(zone)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="text-white font-medium">{zone.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{zone.type}</p>
                  </div>
                </div>
                <span className={`text-xl ${
                  zone.trend === 'decreasing' ? 'text-green-400' :
                  zone.trend === 'increasing' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {zone.trend === 'decreasing' ? '↓' : zone.trend === 'increasing' ? '↑' : '→'}
                </span>
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-white">{zone.consumption.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">kWh today</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${colors.text}`}>{zone.percentage}%</p>
                  <p className="text-xs text-gray-400">of total</p>
                </div>
              </div>

              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${zone.percentage}%` }} />
              </div>

              <div className="flex justify-between mt-3 pt-3 border-t border-gray-700 text-sm">
                <span className="text-gray-400">Peak: <span className="text-white">{zone.peakLoad}kW</span></span>
                <span className="text-gray-400">Avg: <span className="text-white">{zone.avgLoad}kW</span></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Detail Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{zoneTypeConfig[selectedZone.type].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
                  <p className="text-gray-400 capitalize">{selectedZone.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{selectedZone.consumption.toLocaleString()}</p>
                <p className="text-sm text-gray-400">kWh Today</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{selectedZone.percentage}%</p>
                <p className="text-sm text-gray-400">of Total Usage</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{selectedZone.peakLoad} kW</p>
                <p className="text-sm text-gray-400">Peak Load</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{selectedZone.avgLoad} kW</p>
                <p className="text-sm text-gray-400">Average Load</p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Trend Analysis</h4>
              <p className={`flex items-center gap-2 ${
                selectedZone.trend === 'decreasing' ? 'text-green-400' :
                selectedZone.trend === 'increasing' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                <span className="text-2xl">
                  {selectedZone.trend === 'decreasing' ? '📉' : selectedZone.trend === 'increasing' ? '📈' : '➡️'}
                </span>
                <span>
                  {selectedZone.trend === 'decreasing' ? 'Consumption is decreasing - Good progress!' :
                   selectedZone.trend === 'increasing' ? 'Consumption is increasing - Review needed' :
                   'Consumption is stable'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      {/* Cost Projections Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Cost Projections vs Budget</h3>
        <div className="h-64 flex items-end gap-4 px-4">
          {projections.map((proj, i) => {
            const maxValue = Math.max(...projections.map(p => Math.max(p.projected, p.budget)));
            const projectedHeight = (proj.projected / maxValue) * 100;
            const budgetHeight = (proj.budget / maxValue) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
                  <div
                    className={`flex-1 rounded-t transition-all ${proj.variance > 0 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ height: `${projectedHeight}%` }}
                    title={`Projected: $${proj.projected.toLocaleString()}`}
                  />
                  <div
                    className="flex-1 bg-gray-600 rounded-t"
                    style={{ height: `${budgetHeight}%` }}
                    title={`Budget: $${proj.budget.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-400">{proj.period}</span>
                <span className={`text-xs font-medium ${proj.variance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {proj.variance > 0 ? '+' : ''}{proj.variance.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-400">Projected (Under Budget)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-sm text-gray-400">Projected (Over Budget)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded" />
            <span className="text-sm text-gray-400">Budget</span>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">YTD Spend</h4>
          <p className="text-3xl font-bold text-white">$267,000</p>
          <p className="text-sm text-green-400 mt-1">-4.2% vs budget</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Projected Annual</h4>
          <p className="text-3xl font-bold text-white">$534,000</p>
          <p className="text-sm text-yellow-400 mt-1">+2.1% vs budget</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-gray-400 text-sm mb-2">Solar Savings</h4>
          <p className="text-3xl font-bold text-green-400">$42,500</p>
          <p className="text-sm text-green-400 mt-1">YTD avoided costs</p>
        </div>
      </div>

      {/* Rate Schedule */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rate Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left text-gray-400 font-medium">Period</th>
                <th className="p-3 text-left text-gray-400 font-medium">Time</th>
                <th className="p-3 text-center text-gray-400 font-medium">Rate</th>
                <th className="p-3 text-center text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="p-3 text-white">Off-Peak</td>
                <td className="p-3 text-gray-400">10pm - 6am</td>
                <td className="p-3 text-center text-green-400 font-medium">$0.08/kWh</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Inactive</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="p-3 text-white">Mid-Peak</td>
                <td className="p-3 text-gray-400">6am - 12pm, 6pm - 10pm</td>
                <td className="p-3 text-center text-yellow-400 font-medium">$0.14/kWh</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Active</span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="p-3 text-white">On-Peak</td>
                <td className="p-3 text-gray-400">12pm - 6pm</td>
                <td className="p-3 text-center text-red-400 font-medium">$0.22/kWh</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Inactive</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Weekly Comparison */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Consumption Comparison</h3>
        <div className="space-y-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const thisWeek = 10000 + Math.random() * 5000;
            const lastWeek = 10000 + Math.random() * 5000;
            const max = 15000;

            return (
              <div key={day} className="flex items-center gap-4">
                <span className="w-12 text-gray-400">{day}</span>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(thisWeek / max) * 100}%` }}
                    />
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full"
                      style={{ width: `${(lastWeek / max) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-32 text-right">
                  <p className="text-white text-sm">{Math.round(thisWeek).toLocaleString()} kWh</p>
                  <p className={`text-xs ${thisWeek < lastWeek ? 'text-green-400' : 'text-red-400'}`}>
                    {thisWeek < lastWeek ? '↓' : '↑'} {Math.abs(((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded" />
            <span className="text-sm text-gray-400">This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded" />
            <span className="text-sm text-gray-400">Last Week</span>
          </div>
        </div>
      </div>

      {/* Energy Efficiency Score */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Energy Efficiency Score</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="12"
                strokeDasharray={`${82 * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">82</span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Equipment Efficiency</span>
                <span className="text-white">88%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">HVAC Optimization</span>
                <span className="text-white">75%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Lighting Efficiency</span>
                <span className="text-white">92%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Renewable Integration</span>
                <span className="text-white">72%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
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
          <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Energy Consumption Dashboard</h2>
            <p className="text-gray-400">Power usage trends and cost projections</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'zones', label: 'Zones', icon: '🏭' },
            { id: 'costs', label: 'Costs', icon: '💰' },
            { id: 'trends', label: 'Trends', icon: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as typeof view)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === tab.id
                  ? 'bg-yellow-600 text-white'
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
      {view === 'costs' && renderCosts()}
      {view === 'trends' && renderTrends()}
    </div>
  );
}

export default EnergyConsumptionDashboard;
