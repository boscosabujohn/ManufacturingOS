'use client';

import React, { useState, useMemo } from 'react';

// Types
export type WasteType = 'scrap_metal' | 'plastic' | 'cardboard' | 'hazardous' | 'general' | 'oil_coolant';
export type DisposalMethod = 'recycled' | 'landfill' | 'incinerated' | 'reused' | 'treated';

export interface WasteStream {
  id: string;
  type: WasteType;
  quantity: number; // kg
  disposalMethod: DisposalMethod;
  recyclingRate: number;
  cost: number;
  revenue: number; // from recycling
}

export interface MaterialEfficiency {
  id: string;
  materialName: string;
  inputQuantity: number;
  outputQuantity: number;
  wasteQuantity: number;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ScrapData {
  id: string;
  workCenter: string;
  scrapRate: number;
  targetRate: number;
  quantity: number;
  primaryCause: string;
  trend: 'improving' | 'worsening' | 'stable';
}

export interface WasteReductionMetricsProps {
  wasteStreams?: WasteStream[];
  materialEfficiency?: MaterialEfficiency[];
  scrapData?: ScrapData[];
  onWasteStreamClick?: (stream: WasteStream) => void;
  className?: string;
}

// Configuration
const wasteTypeConfig: Record<WasteType, { name: string; icon: string; color: string }> = {
  scrap_metal: { name: 'Scrap Metal', icon: '🔩', color: 'gray' },
  plastic: { name: 'Plastic', icon: '♻️', color: 'blue' },
  cardboard: { name: 'Cardboard', icon: '📦', color: 'amber' },
  hazardous: { name: 'Hazardous', icon: '☢️', color: 'red' },
  general: { name: 'General Waste', icon: '🗑️', color: 'slate' },
  oil_coolant: { name: 'Oil & Coolant', icon: '🛢️', color: 'yellow' },
};

const disposalConfig: Record<DisposalMethod, { name: string; color: string; sustainable: boolean }> = {
  recycled: { name: 'Recycled', color: 'green', sustainable: true },
  reused: { name: 'Reused', color: 'blue', sustainable: true },
  treated: { name: 'Treated', color: 'purple', sustainable: true },
  incinerated: { name: 'Incinerated', color: 'orange', sustainable: false },
  landfill: { name: 'Landfill', color: 'red', sustainable: false },
};

// Mock data generators
const generateMockWasteStreams = (): WasteStream[] => [
  { id: 'w1', type: 'scrap_metal', quantity: 2450, disposalMethod: 'recycled', recyclingRate: 98, cost: 0, revenue: 1850 },
  { id: 'w2', type: 'plastic', quantity: 890, disposalMethod: 'recycled', recyclingRate: 75, cost: 120, revenue: 280 },
  { id: 'w3', type: 'cardboard', quantity: 1250, disposalMethod: 'recycled', recyclingRate: 100, cost: 0, revenue: 450 },
  { id: 'w4', type: 'hazardous', quantity: 180, disposalMethod: 'treated', recyclingRate: 0, cost: 850, revenue: 0 },
  { id: 'w5', type: 'general', quantity: 560, disposalMethod: 'landfill', recyclingRate: 0, cost: 280, revenue: 0 },
  { id: 'w6', type: 'oil_coolant', quantity: 320, disposalMethod: 'recycled', recyclingRate: 85, cost: 150, revenue: 120 },
];

const generateMockMaterialEfficiency = (): MaterialEfficiency[] => [
  { id: 'm1', materialName: 'Steel Sheet', inputQuantity: 10000, outputQuantity: 9250, wasteQuantity: 750, efficiency: 92.5, trend: 'up' },
  { id: 'm2', materialName: 'Aluminum Bar', inputQuantity: 5000, outputQuantity: 4700, wasteQuantity: 300, efficiency: 94.0, trend: 'up' },
  { id: 'm3', materialName: 'Plastic Pellets', inputQuantity: 3000, outputQuantity: 2700, wasteQuantity: 300, efficiency: 90.0, trend: 'stable' },
  { id: 'm4', materialName: 'Copper Wire', inputQuantity: 1500, outputQuantity: 1425, wasteQuantity: 75, efficiency: 95.0, trend: 'up' },
  { id: 'm5', materialName: 'Stainless Steel', inputQuantity: 4000, outputQuantity: 3560, wasteQuantity: 440, efficiency: 89.0, trend: 'down' },
];

const generateMockScrapData = (): ScrapData[] => [
  { id: 's1', workCenter: 'CNC Machining', scrapRate: 2.8, targetRate: 2.5, quantity: 145, primaryCause: 'Tool wear', trend: 'improving' },
  { id: 's2', workCenter: 'Assembly Line 1', scrapRate: 1.5, targetRate: 2.0, quantity: 78, primaryCause: 'Operator error', trend: 'improving' },
  { id: 's3', workCenter: 'Stamping Press', scrapRate: 3.2, targetRate: 2.0, quantity: 210, primaryCause: 'Material defects', trend: 'worsening' },
  { id: 's4', workCenter: 'Welding Station', scrapRate: 1.8, targetRate: 2.5, quantity: 52, primaryCause: 'Parameter drift', trend: 'stable' },
  { id: 's5', workCenter: 'Paint Shop', scrapRate: 2.1, targetRate: 1.5, quantity: 95, primaryCause: 'Surface prep', trend: 'stable' },
];

export function WasteReductionMetrics({
  wasteStreams: initialWasteStreams,
  materialEfficiency: initialMaterialEfficiency,
  scrapData: initialScrapData,
  onWasteStreamClick,
  className = '',
}: WasteReductionMetricsProps) {
  const [view, setView] = useState<'overview' | 'waste' | 'materials' | 'scrap'>('overview');
  const [selectedStream, setSelectedStream] = useState<WasteStream | null>(null);

  const wasteStreams = useMemo(() => initialWasteStreams || generateMockWasteStreams(), [initialWasteStreams]);
  const materialEfficiency = useMemo(() => initialMaterialEfficiency || generateMockMaterialEfficiency(), [initialMaterialEfficiency]);
  const scrapData = useMemo(() => initialScrapData || generateMockScrapData(), [initialScrapData]);

  const totalWaste = useMemo(() => wasteStreams.reduce((sum, w) => sum + w.quantity, 0), [wasteStreams]);
  const recycledWaste = useMemo(() =>
    wasteStreams.filter(w => w.disposalMethod === 'recycled' || w.disposalMethod === 'reused')
      .reduce((sum, w) => sum + w.quantity, 0),
    [wasteStreams]
  );
  const recyclingRate = useMemo(() => (recycledWaste / totalWaste) * 100, [recycledWaste, totalWaste]);
  const avgEfficiency = useMemo(() =>
    materialEfficiency.reduce((sum, m) => sum + m.efficiency, 0) / materialEfficiency.length,
    [materialEfficiency]
  );
  const avgScrapRate = useMemo(() =>
    scrapData.reduce((sum, s) => sum + s.scrapRate, 0) / scrapData.length,
    [scrapData]
  );

  const handleStreamClick = (stream: WasteStream) => {
    setSelectedStream(stream);
    onWasteStreamClick?.(stream);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      gray: { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      amber: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-600' },
      red: { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-600' },
      slate: { bg: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-600' },
      yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' },
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-600' },
    };
    return colors[color] || colors.gray;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">♻️</span>
            <span className="text-xs text-green-400">+3.2% vs last month</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{recyclingRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Recycling Rate</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-xs text-green-400">+1.5%</span>
          </div>
          <p className="text-3xl font-bold text-white">{avgEfficiency.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Material Efficiency</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📉</span>
            <span className="text-xs text-green-400">-0.3%</span>
          </div>
          <p className="text-3xl font-bold text-white">{avgScrapRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Avg Scrap Rate</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🗑️</span>
            <span className="text-xs text-yellow-400">This month</span>
          </div>
          <p className="text-3xl font-bold text-white">{(totalWaste / 1000).toFixed(1)}t</p>
          <p className="text-sm text-gray-400">Total Waste</p>
        </div>
      </div>

      {/* Waste by Disposal Method */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Waste by Disposal Method</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {(() => {
                const methods = ['recycled', 'reused', 'treated', 'landfill', 'incinerated'] as DisposalMethod[];
                let cumulative = 0;
                return methods.map(method => {
                  const quantity = wasteStreams
                    .filter(w => w.disposalMethod === method)
                    .reduce((sum, w) => sum + w.quantity, 0);
                  const percentage = (quantity / totalWaste) * 100;
                  if (percentage === 0) return null;

                  const strokeDasharray = `${percentage * 2.51} 251`;
                  const strokeDashoffset = -cumulative * 2.51;
                  cumulative += percentage;

                  const colorMap: Record<string, string> = {
                    green: '#22c55e', blue: '#3b82f6', purple: '#9333ea',
                    orange: '#f97316', red: '#ef4444',
                  };

                  return (
                    <circle
                      key={method}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colorMap[disposalConfig[method].color]}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{recyclingRate.toFixed(0)}%</span>
              <span className="text-xs text-gray-400">Diverted</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {Object.entries(disposalConfig).map(([method, config]) => {
              const quantity = wasteStreams
                .filter(w => w.disposalMethod === method)
                .reduce((sum, w) => sum + w.quantity, 0);
              const percentage = (quantity / totalWaste) * 100;
              if (percentage === 0) return null;

              return (
                <div key={method} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${getColorClass(config.color).bg}`} />
                  <span className="text-gray-300 flex-1">{config.name}</span>
                  <span className="text-white font-medium">{quantity.toLocaleString()} kg</span>
                  <span className="text-gray-400 w-16 text-right">{percentage.toFixed(1)}%</span>
                  {config.sustainable && <span className="text-green-400">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Impact */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Disposal Costs</h4>
          <p className="text-2xl font-bold text-red-400">
            ${wasteStreams.reduce((sum, w) => sum + w.cost, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Recycling Revenue</h4>
          <p className="text-2xl font-bold text-green-400">
            ${wasteStreams.reduce((sum, w) => sum + w.revenue, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">From material sales</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Net Waste Cost</h4>
          <p className="text-2xl font-bold text-white">
            ${(wasteStreams.reduce((sum, w) => sum + w.cost - w.revenue, 0)).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total impact</p>
        </div>
      </div>
    </div>
  );

  const renderWaste = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {wasteStreams.map(stream => {
          const config = wasteTypeConfig[stream.type];
          const disposal = disposalConfig[stream.disposalMethod];
          const colors = getColorClass(config.color);
          const disposalColors = getColorClass(disposal.color);

          return (
            <div
              key={stream.id}
              className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${colors.border}`}
              onClick={() => handleStreamClick(stream)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="text-white font-medium">{config.name}</p>
                    <p className={`text-xs ${disposalColors.text}`}>{disposal.name}</p>
                  </div>
                </div>
                {disposal.sustainable && (
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                    ♻️ Sustainable
                  </span>
                )}
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-white">{stream.quantity.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">kg this month</p>
                </div>
                {stream.recyclingRate > 0 && (
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{stream.recyclingRate}%</p>
                    <p className="text-xs text-gray-400">Recycled</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-3 pt-3 border-t border-gray-700 text-sm">
                {stream.cost > 0 && (
                  <span className="text-red-400">Cost: ${stream.cost}</span>
                )}
                {stream.revenue > 0 && (
                  <span className="text-green-400">Revenue: ${stream.revenue}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedStream && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{wasteTypeConfig[selectedStream.type].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{wasteTypeConfig[selectedStream.type].name}</h3>
                  <p className="text-gray-400">{disposalConfig[selectedStream.disposalMethod].name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStream(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{selectedStream.quantity.toLocaleString()}</p>
                <p className="text-sm text-gray-400">kg Total</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{selectedStream.recyclingRate}%</p>
                <p className="text-sm text-gray-400">Recycling Rate</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-400">Disposal Cost</span>
                <span className="text-red-400 font-medium">${selectedStream.cost}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-400">Recycling Revenue</span>
                <span className="text-green-400 font-medium">${selectedStream.revenue}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-400">Net Impact</span>
                <span className={`font-medium ${selectedStream.revenue > selectedStream.cost ? 'text-green-400' : 'text-red-400'}`}>
                  ${selectedStream.revenue - selectedStream.cost}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left text-gray-400 font-medium">Material</th>
              <th className="p-3 text-center text-gray-400 font-medium">Input (kg)</th>
              <th className="p-3 text-center text-gray-400 font-medium">Output (kg)</th>
              <th className="p-3 text-center text-gray-400 font-medium">Waste (kg)</th>
              <th className="p-3 text-center text-gray-400 font-medium">Efficiency</th>
              <th className="p-3 text-center text-gray-400 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {materialEfficiency.map(material => (
              <tr key={material.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-3 text-white font-medium">{material.materialName}</td>
                <td className="p-3 text-center text-white">{material.inputQuantity.toLocaleString()}</td>
                <td className="p-3 text-center text-white">{material.outputQuantity.toLocaleString()}</td>
                <td className="p-3 text-center text-red-400">{material.wasteQuantity.toLocaleString()}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${material.efficiency >= 95 ? 'bg-green-600' : material.efficiency >= 90 ? 'bg-yellow-600' : 'bg-red-600'}`}
                        style={{ width: `${material.efficiency}%` }}
                      />
                    </div>
                    <span className={`font-medium ${material.efficiency >= 95 ? 'text-green-400' : material.efficiency >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {material.efficiency}%
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xl ${
                    material.trend === 'up' ? 'text-green-400' :
                    material.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {material.trend === 'up' ? '↑' : material.trend === 'down' ? '↓' : '→'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Efficiency Visualization */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Material Utilization</h3>
        <div className="space-y-4">
          {materialEfficiency.map(material => (
            <div key={material.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300">{material.materialName}</span>
                <span className="text-white font-medium">{material.efficiency}%</span>
              </div>
              <div className="h-6 bg-gray-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-600 transition-all"
                  style={{ width: `${material.efficiency}%` }}
                  title={`Output: ${material.outputQuantity}kg`}
                />
                <div
                  className="bg-red-600 transition-all"
                  style={{ width: `${100 - material.efficiency}%` }}
                  title={`Waste: ${material.wasteQuantity}kg`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-400">Utilized Output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-sm text-gray-400">Waste</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScrap = () => (
    <div className="space-y-6">
      {/* Scrap Rate Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Best Performer</h4>
          <p className="text-xl font-bold text-green-400">
            {scrapData.reduce((best, s) => s.scrapRate < best.scrapRate ? s : best).workCenter}
          </p>
          <p className="text-sm text-green-400">
            {scrapData.reduce((best, s) => s.scrapRate < best.scrapRate ? s : best).scrapRate}% scrap rate
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Needs Attention</h4>
          <p className="text-xl font-bold text-red-400">
            {scrapData.reduce((worst, s) => s.scrapRate > worst.scrapRate ? s : worst).workCenter}
          </p>
          <p className="text-sm text-red-400">
            {scrapData.reduce((worst, s) => s.scrapRate > worst.scrapRate ? s : worst).scrapRate}% scrap rate
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-400 text-sm mb-2">Total Scrap This Month</h4>
          <p className="text-xl font-bold text-white">
            {scrapData.reduce((sum, s) => sum + s.quantity, 0).toLocaleString()} units
          </p>
          <p className="text-sm text-gray-400">Across all work centers</p>
        </div>
      </div>

      {/* Scrap by Work Center */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Scrap Rate by Work Center</h3>
        <div className="space-y-4">
          {scrapData.map(data => {
            const overTarget = data.scrapRate > data.targetRate;
            return (
              <div key={data.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏭</span>
                    <div>
                      <p className="text-white font-medium">{data.workCenter}</p>
                      <p className="text-xs text-gray-400">Primary cause: {data.primaryCause}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xl ${
                      data.trend === 'improving' ? 'text-green-400' :
                      data.trend === 'worsening' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {data.trend === 'improving' ? '📉' : data.trend === 'worsening' ? '📈' : '➡️'}
                    </span>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${overTarget ? 'text-red-400' : 'text-green-400'}`}>
                        {data.scrapRate}%
                      </p>
                      <p className="text-xs text-gray-400">Target: {data.targetRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="relative h-4 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${overTarget ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min((data.scrapRate / 5) * 100, 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-white"
                    style={{ left: `${(data.targetRate / 5) * 100}%` }}
                    title={`Target: ${data.targetRate}%`}
                  />
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-400">{data.quantity} units scrapped</span>
                  <span className={overTarget ? 'text-red-400' : 'text-green-400'}>
                    {overTarget ? `+${(data.scrapRate - data.targetRate).toFixed(1)}% over target` : `${(data.targetRate - data.scrapRate).toFixed(1)}% under target`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">♻️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Waste Reduction Metrics</h2>
            <p className="text-gray-400">Scrap rates, recycling, and material efficiency</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'waste', label: 'Waste Streams', icon: '🗑️' },
            { id: 'materials', label: 'Materials', icon: '⚙️' },
            { id: 'scrap', label: 'Scrap', icon: '📉' },
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

      {/* Content */}
      {view === 'overview' && renderOverview()}
      {view === 'waste' && renderWaste()}
      {view === 'materials' && renderMaterials()}
      {view === 'scrap' && renderScrap()}
    </div>
  );
}

export default WasteReductionMetrics;
