'use client';

import React, { useState, useMemo } from 'react';

// Types
export type EmissionScope = 'scope1' | 'scope2' | 'scope3';
export type EmissionSource = 'electricity' | 'fuel' | 'transport' | 'materials' | 'waste' | 'water';
export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface EmissionData {
  timestamp: Date;
  value: number; // kg CO2e
  source: EmissionSource;
  scope: EmissionScope;
}

export interface ProductEmission {
  id: string;
  productName: string;
  batchId: string;
  totalEmissions: number; // kg CO2e
  emissionsPerUnit: number; // kg CO2e per unit
  unitsProduced: number;
  breakdown: Record<EmissionSource, number>;
  trend: 'up' | 'down' | 'stable';
  vsTarget: number; // percentage vs target
}

export interface EmissionTarget {
  scope: EmissionScope;
  target: number; // kg CO2e
  current: number;
  period: string;
}

export interface CarbonFootprintTrackerProps {
  emissions?: EmissionData[];
  productEmissions?: ProductEmission[];
  targets?: EmissionTarget[];
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onProductClick?: (product: ProductEmission) => void;
  className?: string;
}

// Mock data generators
const emissionSourceConfig: Record<EmissionSource, { name: string; icon: string; color: string }> = {
  electricity: { name: 'Electricity', icon: '⚡', color: 'yellow' },
  fuel: { name: 'Fuel & Gas', icon: '🔥', color: 'orange' },
  transport: { name: 'Transport', icon: '🚛', color: 'blue' },
  materials: { name: 'Raw Materials', icon: '📦', color: 'purple' },
  waste: { name: 'Waste', icon: '🗑️', color: 'gray' },
  water: { name: 'Water', icon: '💧', color: 'cyan' },
};

const scopeConfig: Record<EmissionScope, { name: string; description: string; color: string }> = {
  scope1: { name: 'Scope 1', description: 'Direct emissions', color: 'red' },
  scope2: { name: 'Scope 2', description: 'Indirect (energy)', color: 'yellow' },
  scope3: { name: 'Scope 3', description: 'Value chain', color: 'blue' },
};

const generateMockProductEmissions = (): ProductEmission[] => [
  {
    id: 'p1',
    productName: 'Assembly Unit A-7',
    batchId: 'BATCH-2024-1847',
    totalEmissions: 1250,
    emissionsPerUnit: 8.3,
    unitsProduced: 150,
    breakdown: { electricity: 450, fuel: 180, transport: 220, materials: 320, waste: 50, water: 30 },
    trend: 'down',
    vsTarget: -12,
  },
  {
    id: 'p2',
    productName: 'Component B-12',
    batchId: 'BATCH-2024-1848',
    totalEmissions: 890,
    emissionsPerUnit: 4.5,
    unitsProduced: 200,
    breakdown: { electricity: 320, fuel: 150, transport: 180, materials: 180, waste: 35, water: 25 },
    trend: 'stable',
    vsTarget: -5,
  },
  {
    id: 'p3',
    productName: 'Widget C-5',
    batchId: 'BATCH-2024-1849',
    totalEmissions: 2100,
    emissionsPerUnit: 10.5,
    unitsProduced: 200,
    breakdown: { electricity: 680, fuel: 420, transport: 350, materials: 480, waste: 100, water: 70 },
    trend: 'up',
    vsTarget: 8,
  },
  {
    id: 'p4',
    productName: 'Frame D-3',
    batchId: 'BATCH-2024-1850',
    totalEmissions: 560,
    emissionsPerUnit: 5.6,
    unitsProduced: 100,
    breakdown: { electricity: 180, fuel: 90, transport: 120, materials: 130, waste: 25, water: 15 },
    trend: 'down',
    vsTarget: -18,
  },
];

const generateMockTargets = (): EmissionTarget[] => [
  { scope: 'scope1', target: 5000, current: 4200, period: 'This Month' },
  { scope: 'scope2', target: 8000, current: 7500, period: 'This Month' },
  { scope: 'scope3', target: 12000, current: 11200, period: 'This Month' },
];

const generateHourlyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000);
    data.push({
      hour: timestamp.getHours(),
      scope1: Math.floor(150 + Math.random() * 100),
      scope2: Math.floor(250 + Math.random() * 150),
      scope3: Math.floor(350 + Math.random() * 200),
    });
  }
  return data;
};

export function CarbonFootprintTracker({
  productEmissions: initialProductEmissions,
  targets: initialTargets,
  timeRange = 'day',
  onTimeRangeChange,
  onProductClick,
  className = '',
}: CarbonFootprintTrackerProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(timeRange);
  const [view, setView] = useState<'overview' | 'products' | 'breakdown'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<ProductEmission | null>(null);

  const productEmissions = useMemo(
    () => initialProductEmissions || generateMockProductEmissions(),
    [initialProductEmissions]
  );
  const targets = useMemo(() => initialTargets || generateMockTargets(), [initialTargets]);
  const hourlyData = useMemo(() => generateHourlyData(), []);

  const totalEmissions = useMemo(() => {
    return targets.reduce((sum, t) => sum + t.current, 0);
  }, [targets]);

  const totalTarget = useMemo(() => {
    return targets.reduce((sum, t) => sum + t.target, 0);
  }, [targets]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleProductClick = (product: ProductEmission) => {
    setSelectedProduct(product);
    onProductClick?.(product);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      red: { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-600' },
      yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-600' },
      gray: { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-600' },
    };
    return colors[color] || colors.gray;
  };

  const renderOverview = () => (
    <div className="space-y-3">
      {/* Total Emissions Gauge */}
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white">Total Carbon Footprint</h3>
            <p className="text-gray-400">{selectedTimeRange === 'day' ? 'Today' : `This ${selectedTimeRange}`}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{(totalEmissions / 1000).toFixed(1)}</p>
            <p className="text-gray-400">tonnes CO₂e</p>
          </div>
        </div>

        <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              totalEmissions / totalTarget > 1 ? 'bg-red-600' :
              totalEmissions / totalTarget > 0.9 ? 'bg-yellow-600' : 'bg-green-600'
            }`}
            style={{ width: `${Math.min((totalEmissions / totalTarget) * 100, 100)}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-white"
            style={{ left: `${Math.min((totalTarget / totalTarget) * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">0</span>
          <span className={`font-medium ${
            totalEmissions < totalTarget ? 'text-green-400' : 'text-red-400'
          }`}>
            {totalEmissions < totalTarget
              ? `${((1 - totalEmissions / totalTarget) * 100).toFixed(1)}% under target`
              : `${((totalEmissions / totalTarget - 1) * 100).toFixed(1)}% over target`
            }
          </span>
          <span className="text-gray-400">{(totalTarget / 1000).toFixed(1)}t target</span>
        </div>
      </div>

      {/* Scope Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {targets.map(target => {
          const config = scopeConfig[target.scope];
          const percentage = (target.current / target.target) * 100;
          const colors = getColorClass(config.color);

          return (
            <div key={target.scope} className={`bg-gray-800 rounded-lg p-3 border-l-4 ${colors.border}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white font-medium">{config.name}</p>
                  <p className="text-xs text-gray-400">{config.description}</p>
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {(target.current / 1000).toFixed(1)}t
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bg}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Target: {(target.target / 1000).toFixed(1)}t ({percentage.toFixed(0)}%)
              </p>
            </div>
          );
        })}
      </div>

      {/* Hourly Trend Chart */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">24-Hour Emissions Trend</h3>
        <div className="h-48 flex items-end gap-1">
          {hourlyData.map((data, i) => {
            const total = data.scope1 + data.scope2 + data.scope3;
            const maxTotal = Math.max(...hourlyData.map(d => d.scope1 + d.scope2 + d.scope3));
            const heightPercent = (total / maxTotal) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col justify-end" title={`${data.hour}:00 - ${total} kg CO₂e`}>
                <div
                  className="bg-gradient-to-t from-red-600 via-yellow-600 to-blue-600 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${heightPercent}%` }}
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
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-700">
          {Object.entries(scopeConfig).map(([scope, config]) => (
            <div key={scope} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${getColorClass(config.color).bg}`} />
              <span className="text-sm text-gray-400">{config.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-2">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left text-gray-400 font-medium">Product / Batch</th>
              <th className="p-3 text-center text-gray-400 font-medium">Units</th>
              <th className="p-3 text-center text-gray-400 font-medium">Total CO₂e</th>
              <th className="p-3 text-center text-gray-400 font-medium">Per Unit</th>
              <th className="p-3 text-center text-gray-400 font-medium">Trend</th>
              <th className="p-3 text-center text-gray-400 font-medium">vs Target</th>
            </tr>
          </thead>
          <tbody>
            {productEmissions.map(product => (
              <tr
                key={product.id}
                className="border-t border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <td className="p-3">
                  <p className="text-white font-medium">{product.productName}</p>
                  <p className="text-xs text-gray-400">{product.batchId}</p>
                </td>
                <td className="p-3 text-center text-white">{product.unitsProduced}</td>
                <td className="p-3 text-center">
                  <span className="text-white font-medium">{product.totalEmissions.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm"> kg</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-white">{product.emissionsPerUnit.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm"> kg</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xl ${
                    product.trend === 'down' ? 'text-green-400' :
                    product.trend === 'up' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {product.trend === 'down' ? '↓' : product.trend === 'up' ? '↑' : '→'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    product.vsTarget < 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {product.vsTarget > 0 ? '+' : ''}{product.vsTarget}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
          <div className="bg-gray-800 rounded-xl p-3 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedProduct.productName}</h3>
                <p className="text-gray-400">{selectedProduct.batchId}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-white">{selectedProduct.totalEmissions.toLocaleString()}</p>
                <p className="text-sm text-gray-400">kg CO₂e Total</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-white">{selectedProduct.emissionsPerUnit.toFixed(1)}</p>
                <p className="text-sm text-gray-400">kg CO₂e per Unit</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className={`text-3xl font-bold ${selectedProduct.vsTarget < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedProduct.vsTarget > 0 ? '+' : ''}{selectedProduct.vsTarget}%
                </p>
                <p className="text-sm text-gray-400">vs Target</p>
              </div>
            </div>

            <h4 className="text-lg font-medium text-white mb-3">Emissions Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(selectedProduct.breakdown).map(([source, value]) => {
                const config = emissionSourceConfig[source as EmissionSource];
                const percentage = (value / selectedProduct.totalEmissions) * 100;
                const colors = getColorClass(config.color);

                return (
                  <div key={source} className="flex items-center gap-3">
                    <span className="text-xl w-8">{config.icon}</span>
                    <span className="text-gray-300 w-32">{config.name}</span>
                    <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.bg}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white w-20 text-right">{value} kg</span>
                    <span className="text-gray-400 w-16 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBreakdown = () => {
    const totalBySource: Record<EmissionSource, number> = {
      electricity: 0, fuel: 0, transport: 0, materials: 0, waste: 0, water: 0,
    };
    productEmissions.forEach(p => {
      Object.entries(p.breakdown).forEach(([source, value]) => {
        totalBySource[source as EmissionSource] += value;
      });
    });
    const grandTotal = Object.values(totalBySource).reduce((a, b) => a + b, 0);

    return (
      <div className="space-y-3">
        {/* Source Breakdown */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Emissions by Source</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(emissionSourceConfig).map(([source, config]) => {
              const value = totalBySource[source as EmissionSource];
              const percentage = (value / grandTotal) * 100;
              const colors = getColorClass(config.color);

              return (
                <div key={source} className={`bg-gray-700 rounded-lg p-3 border-l-4 ${colors.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="text-white font-medium">{config.name}</span>
                    </div>
                    <span className={`text-xl font-bold ${colors.text}`}>{percentage.toFixed(1)}%</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{value.toLocaleString()} kg</p>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart Representation */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Source Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {(() => {
                  let cumulative = 0;
                  return Object.entries(emissionSourceConfig).map(([source, config]) => {
                    const value = totalBySource[source as EmissionSource];
                    const percentage = (value / grandTotal) * 100;
                    const strokeDasharray = `${percentage * 2.51} 251`;
                    const strokeDashoffset = -cumulative * 2.51;
                    cumulative += percentage;

                    const colorMap: Record<string, string> = {
                      yellow: '#ca8a04', orange: '#ea580c', blue: '#2563eb',
                      purple: '#9333ea', gray: '#4b5563', cyan: '#0891b2',
                    };

                    return (
                      <circle
                        key={source}
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
                <span className="text-2xl font-bold text-white">{(grandTotal / 1000).toFixed(1)}</span>
                <span className="text-sm text-gray-400">tonnes CO₂e</span>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(emissionSourceConfig).map(([source, config]) => {
                const value = totalBySource[source as EmissionSource];
                const percentage = (value / grandTotal) * 100;

                return (
                  <div key={source} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${getColorClass(config.color).bg}`} />
                    <span className="text-gray-300 w-28">{config.name}</span>
                    <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Carbon Footprint Tracker</h2>
            <p className="text-gray-400">Real-time CO₂ emissions monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={e => handleTimeRangeChange(e.target.value as TimeRange)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-green-500 outline-none"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* View Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'breakdown', label: 'Breakdown', icon: '🔬' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as typeof view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'overview' && renderOverview()}
      {view === 'products' && renderProducts()}
      {view === 'breakdown' && renderBreakdown()}
    </div>
  );
}

export default CarbonFootprintTracker;
