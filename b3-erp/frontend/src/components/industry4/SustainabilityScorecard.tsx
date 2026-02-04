'use client';

import React, { useState, useMemo } from 'react';

// Types
export type KPICategory = 'carbon' | 'energy' | 'water' | 'waste' | 'social' | 'governance';
export type KPIStatus = 'on_track' | 'at_risk' | 'behind' | 'exceeded';
export type Period = 'monthly' | 'quarterly' | 'yearly';

export interface SustainabilityKPI {
  id: string;
  name: string;
  category: KPICategory;
  current: number;
  target: number;
  unit: string;
  status: KPIStatus;
  trend: number; // percentage change
  description: string;
}

export interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

export interface PeriodData {
  period: string;
  score: number;
  target: number;
}

export interface SustainabilityScorecardProps {
  kpis?: SustainabilityKPI[];
  esgScore?: ESGScore;
  historicalData?: PeriodData[];
  selectedPeriod?: Period;
  onPeriodChange?: (period: Period) => void;
  onKPIClick?: (kpi: SustainabilityKPI) => void;
  className?: string;
}

// Configuration
const categoryConfig: Record<KPICategory, { name: string; icon: string; color: string }> = {
  carbon: { name: 'Carbon Emissions', icon: '🌍', color: 'green' },
  energy: { name: 'Energy', icon: '⚡', color: 'yellow' },
  water: { name: 'Water', icon: '💧', color: 'cyan' },
  waste: { name: 'Waste', icon: '♻️', color: 'purple' },
  social: { name: 'Social', icon: '👥', color: 'blue' },
  governance: { name: 'Governance', icon: '⚖️', color: 'indigo' },
};

const statusConfig: Record<KPIStatus, { name: string; color: string; bgColor: string }> = {
  exceeded: { name: 'Exceeded', color: 'text-green-400', bgColor: 'bg-green-600' },
  on_track: { name: 'On Track', color: 'text-blue-400', bgColor: 'bg-blue-600' },
  at_risk: { name: 'At Risk', color: 'text-yellow-400', bgColor: 'bg-yellow-600' },
  behind: { name: 'Behind', color: 'text-red-400', bgColor: 'bg-red-600' },
};

// Mock data generators
const generateMockKPIs = (): SustainabilityKPI[] => [
  { id: 'k1', name: 'CO₂ Emissions Intensity', category: 'carbon', current: 42.5, target: 45, unit: 'kg CO₂/unit', status: 'on_track', trend: -8.2, description: 'Carbon emissions per unit produced' },
  { id: 'k2', name: 'Scope 1+2 Emissions', category: 'carbon', current: 1250, target: 1400, unit: 'tonnes', status: 'exceeded', trend: -12.5, description: 'Direct and indirect emissions' },
  { id: 'k3', name: 'Renewable Energy Share', category: 'energy', current: 28, target: 30, unit: '%', status: 'at_risk', trend: 5.2, description: 'Percentage from renewable sources' },
  { id: 'k4', name: 'Energy Intensity', category: 'energy', current: 0.85, target: 0.90, unit: 'kWh/unit', status: 'on_track', trend: -4.5, description: 'Energy consumption per unit' },
  { id: 'k5', name: 'Water Recycling Rate', category: 'water', current: 32, target: 35, unit: '%', status: 'at_risk', trend: 3.8, description: 'Percentage of water recycled' },
  { id: 'k6', name: 'Water Intensity', category: 'water', current: 12.5, target: 15, unit: 'L/unit', status: 'exceeded', trend: -10.2, description: 'Water usage per unit' },
  { id: 'k7', name: 'Waste Diversion Rate', category: 'waste', current: 78, target: 80, unit: '%', status: 'on_track', trend: 4.2, description: 'Waste diverted from landfill' },
  { id: 'k8', name: 'Hazardous Waste', category: 'waste', current: 2.1, target: 2.5, unit: 'tonnes', status: 'on_track', trend: -15.0, description: 'Hazardous waste generated' },
  { id: 'k9', name: 'Safety Incident Rate', category: 'social', current: 0.8, target: 1.0, unit: 'per 100', status: 'on_track', trend: -20.0, description: 'Recordable incidents per 100 employees' },
  { id: 'k10', name: 'Training Hours', category: 'social', current: 42, target: 40, unit: 'hrs/emp', status: 'exceeded', trend: 8.5, description: 'Average training hours per employee' },
  { id: 'k11', name: 'Supplier Audits', category: 'governance', current: 85, target: 90, unit: '%', status: 'at_risk', trend: 2.0, description: 'Suppliers meeting ESG criteria' },
  { id: 'k12', name: 'Compliance Score', category: 'governance', current: 98, target: 95, unit: '%', status: 'exceeded', trend: 1.5, description: 'Regulatory compliance rate' },
];

const generateMockESGScore = (): ESGScore => ({
  environmental: 78,
  social: 82,
  governance: 85,
  overall: 81,
});

const generateMockHistoricalData = (): PeriodData[] => [
  { period: 'Q1 2023', score: 72, target: 75 },
  { period: 'Q2 2023', score: 75, target: 76 },
  { period: 'Q3 2023', score: 78, target: 78 },
  { period: 'Q4 2023', score: 79, target: 80 },
  { period: 'Q1 2024', score: 81, target: 80 },
  { period: 'Q2 2024', score: 81, target: 82 },
];

export function SustainabilityScorecard({
  kpis: initialKPIs,
  esgScore: initialESGScore,
  historicalData: initialHistoricalData,
  selectedPeriod = 'quarterly',
  onPeriodChange,
  onKPIClick,
  className = '',
}: SustainabilityScorecardProps) {
  const [view, setView] = useState<'overview' | 'kpis' | 'trends' | 'report'>('overview');
  const [period, setPeriod] = useState<Period>(selectedPeriod);
  const [selectedCategory, setSelectedCategory] = useState<KPICategory | 'all'>('all');

  const kpis = useMemo(() => initialKPIs || generateMockKPIs(), [initialKPIs]);
  const esgScore = useMemo(() => initialESGScore || generateMockESGScore(), [initialESGScore]);
  const historicalData = useMemo(() => initialHistoricalData || generateMockHistoricalData(), [initialHistoricalData]);

  const filteredKPIs = useMemo(() => {
    if (selectedCategory === 'all') return kpis;
    return kpis.filter(k => k.category === selectedCategory);
  }, [kpis, selectedCategory]);

  const kpisByStatus = useMemo(() => ({
    exceeded: kpis.filter(k => k.status === 'exceeded').length,
    on_track: kpis.filter(k => k.status === 'on_track').length,
    at_risk: kpis.filter(k => k.status === 'at_risk').length,
    behind: kpis.filter(k => k.status === 'behind').length,
  }), [kpis]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-600' },
    };
    return colors[color] || colors.green;
  };

  const renderOverview = () => (
    <div className="space-y-3">
      {/* ESG Score Overview */}
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-600 rounded-xl p-3 text-center">
          <div className="relative w-32 h-32 mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="10"
                strokeDasharray={`${esgScore.overall * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{esgScore.overall}</span>
              <span className="text-sm text-gray-400">/100</span>
            </div>
          </div>
          <p className="text-xl font-bold text-white">Overall ESG Score</p>
          <p className="text-green-400 text-sm">+5 points vs last quarter</p>
        </div>

        <div className="col-span-3 bg-gray-800 rounded-xl p-3">
          <h3 className="text-lg font-semibold text-white mb-2">ESG Pillar Scores</h3>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <span className="text-white font-medium">Environmental</span>
                </div>
                <span className="text-green-400 font-bold">{esgScore.environmental}/100</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                  style={{ width: `${esgScore.environmental}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  <span className="text-white font-medium">Social</span>
                </div>
                <span className="text-blue-400 font-bold">{esgScore.social}/100</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: `${esgScore.social}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <span className="text-white font-medium">Governance</span>
                </div>
                <span className="text-indigo-400 font-bold">{esgScore.governance}/100</span>
              </div>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  style={{ width: `${esgScore.governance}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Status Summary */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className={`bg-gray-800 rounded-lg p-3 border-l-4 ${config.bgColor.replace('bg-', 'border-')}`}>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${config.color}`}>
                {kpisByStatus[status as KPIStatus]}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${config.bgColor} text-white`}>
                {config.name}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">KPIs {config.name.toLowerCase()}</p>
          </div>
        ))}
      </div>

      {/* Score Trend Chart */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">ESG Score Trend</h3>
        <div className="h-48 flex items-end gap-2 px-4">
          {historicalData.map((data, i) => {
            const scoreHeight = (data.score / 100) * 100;
            const targetHeight = (data.target / 100) * 100;
            const isAboveTarget = data.score >= data.target;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-40 relative">
                  <div
                    className={`w-8 rounded-t ${isAboveTarget ? 'bg-green-600' : 'bg-yellow-600'}`}
                    style={{ height: `${scoreHeight}%` }}
                  />
                  <div
                    className="absolute w-full h-0.5 bg-white/30"
                    style={{ bottom: `${targetHeight}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{data.period}</span>
                <span className="text-sm text-white font-medium">{data.score}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-400">Above Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded" />
            <span className="text-sm text-gray-400">Below Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-white/30" />
            <span className="text-sm text-gray-400">Target Line</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKPIs = () => (
    <div className="space-y-2">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        {Object.entries(categoryConfig).map(([cat, config]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as KPICategory)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span>{config.icon}</span>
            {config.name}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2">
        {filteredKPIs.map(kpi => {
          const catConfig = categoryConfig[kpi.category];
          const statConfig = statusConfig[kpi.status];
          const colors = getColorClass(catConfig.color);
          const progress = (kpi.current / kpi.target) * 100;

          return (
            <div
              key={kpi.id}
              className={`bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${colors.border}`}
              onClick={() => onKPIClick?.(kpi)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{catConfig.icon}</span>
                  <div>
                    <p className="text-white font-medium">{kpi.name}</p>
                    <p className="text-xs text-gray-400">{kpi.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statConfig.bgColor} text-white`}>
                  {statConfig.name}
                </span>
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{kpi.current}</p>
                  <p className="text-sm text-gray-400">{kpi.unit}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-medium ${kpi.trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                  </p>
                  <p className="text-xs text-gray-400">vs last period</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Progress to target</span>
                  <span className="text-white">{kpi.target} {kpi.unit}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      progress >= 100 ? 'bg-green-600' : progress >= 80 ? 'bg-blue-600' : progress >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-3">
      {/* Category Comparison */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Performance by Category</h3>
        <div className="space-y-2">
          {Object.entries(categoryConfig).map(([cat, config]) => {
            const categoryKPIs = kpis.filter(k => k.category === cat);
            const onTrack = categoryKPIs.filter(k => k.status === 'on_track' || k.status === 'exceeded').length;
            const percentage = (onTrack / categoryKPIs.length) * 100;
            const colors = getColorClass(config.color);

            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="text-white font-medium">{config.name}</span>
                  </div>
                  <span className={`font-medium ${colors.text}`}>{onTrack}/{categoryKPIs.length} on track</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Opportunities */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Improvement Opportunities</h3>
        <div className="space-y-3">
          {kpis.filter(k => k.status === 'at_risk' || k.status === 'behind').map(kpi => {
            const catConfig = categoryConfig[kpi.category];
            const gap = kpi.target - kpi.current;

            return (
              <div key={kpi.id} className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{catConfig.icon}</span>
                    <div>
                      <p className="text-white font-medium">{kpi.name}</p>
                      <p className="text-sm text-yellow-400">
                        Gap: {Math.abs(gap).toFixed(1)} {kpi.unit} to target
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm">
                    View Actions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-3">
      {/* Report Summary */}
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Sustainability Report</h3>
            <p className="text-gray-400">Q2 2024 Summary</p>
          </div>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
            <span>📥</span> Export PDF
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-green-400">{esgScore.overall}</p>
            <p className="text-gray-400">ESG Score</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-white">{kpis.length}</p>
            <p className="text-gray-400">KPIs Tracked</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-blue-400">
              {Math.round((kpisByStatus.exceeded + kpisByStatus.on_track) / kpis.length * 100)}%
            </p>
            <p className="text-gray-400">Target Achievement</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-white font-medium mb-2">Key Highlights</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">CO₂ emissions reduced by 12.5% YoY, exceeding annual target</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">Water recycling rate improved to 32%, on track for 35% goal</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">⚠</span>
              <p className="text-gray-300">Renewable energy share at 28%, slightly behind 30% target</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">Zero lost-time safety incidents for 6 consecutive months</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gray-800 rounded-lg p-3">
        <h3 className="text-lg font-semibold text-white mb-2">Certifications & Standards</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'ISO 14001', status: 'certified', expiry: '2025-06' },
            { name: 'ISO 50001', status: 'certified', expiry: '2024-12' },
            { name: 'B Corp', status: 'in_progress', expiry: null },
            { name: 'Science Based Targets', status: 'certified', expiry: '2025-03' },
          ].map(cert => (
            <div key={cert.name} className="bg-gray-700 rounded-lg p-3 text-center">
              <span className="text-3xl mb-2 block">
                {cert.status === 'certified' ? '🏆' : '⏳'}
              </span>
              <p className="text-white font-medium">{cert.name}</p>
              <p className={`text-sm ${cert.status === 'certified' ? 'text-green-400' : 'text-yellow-400'}`}>
                {cert.status === 'certified' ? 'Certified' : 'In Progress'}
              </p>
              {cert.expiry && (
                <p className="text-xs text-gray-400 mt-1">Expires: {cert.expiry}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sustainability Scorecard</h2>
            <p className="text-gray-400">ESG performance and KPI tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <select
            value={period}
            onChange={e => handlePeriodChange(e.target.value as Period)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-green-500 outline-none"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* View Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'kpis', label: 'KPIs', icon: '🎯' },
              { id: 'trends', label: 'Trends', icon: '📈' },
              { id: 'report', label: 'Report', icon: '📋' },
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
      {view === 'kpis' && renderKPIs()}
      {view === 'trends' && renderTrends()}
      {view === 'report' && renderReport()}
    </div>
  );
}

export default SustainabilityScorecard;
