'use client';

import React, { useState, useMemo } from 'react';

// Types
export type CertificationType = 'iso14001' | 'iso50001' | 'fsc' | 'fairtrade' | 'bcorp' | 'carbonneutral' | 'recycled' | 'organic';
export type SupplierTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';

export interface GreenCertification {
  type: CertificationType;
  name: string;
  issuer: string;
  validUntil: Date;
  verified: boolean;
}

export interface GreenSupplier {
  id: string;
  name: string;
  category: string;
  tier: SupplierTier;
  sustainabilityScore: number;
  certifications: GreenCertification[];
  carbonFootprint: number; // kg CO2e per unit
  renewableEnergy: number; // percentage
  wasteRecycling: number; // percentage
  localSourcing: number; // percentage
  lastAudit?: Date;
  nextAudit?: Date;
}

export interface GreenSupplierBadgesProps {
  suppliers?: GreenSupplier[];
  onSupplierClick?: (supplier: GreenSupplier) => void;
  onCertificationClick?: (cert: GreenCertification) => void;
  className?: string;
}

// Configuration
const certificationConfig: Record<CertificationType, { name: string; icon: string; color: string; description: string }> = {
  iso14001: { name: 'ISO 14001', icon: '🌍', color: 'green', description: 'Environmental Management' },
  iso50001: { name: 'ISO 50001', icon: '⚡', color: 'yellow', description: 'Energy Management' },
  fsc: { name: 'FSC', icon: '🌲', color: 'emerald', description: 'Forest Stewardship Council' },
  fairtrade: { name: 'Fair Trade', icon: '🤝', color: 'blue', description: 'Fair Trade Certified' },
  bcorp: { name: 'B Corp', icon: '🅱️', color: 'purple', description: 'Certified B Corporation' },
  carbonneutral: { name: 'Carbon Neutral', icon: '🌱', color: 'teal', description: 'Carbon Neutral Certified' },
  recycled: { name: 'Recycled', icon: '♻️', color: 'cyan', description: 'Recycled Content Certified' },
  organic: { name: 'Organic', icon: '🌿', color: 'lime', description: 'Organic Certified' },
};

const tierConfig: Record<SupplierTier, { name: string; icon: string; color: string; minScore: number }> = {
  platinum: { name: 'Platinum', icon: '💎', color: 'cyan', minScore: 90 },
  gold: { name: 'Gold', icon: '🥇', color: 'yellow', minScore: 80 },
  silver: { name: 'Silver', icon: '🥈', color: 'gray', minScore: 70 },
  bronze: { name: 'Bronze', icon: '🥉', color: 'orange', minScore: 60 },
  none: { name: 'Standard', icon: '📋', color: 'slate', minScore: 0 },
};

// Mock data generators
const generateMockSuppliers = (): GreenSupplier[] => [
  {
    id: 's1',
    name: 'EcoSteel Industries',
    category: 'Raw Materials',
    tier: 'platinum',
    sustainabilityScore: 94,
    certifications: [
      { type: 'iso14001', name: 'ISO 14001:2015', issuer: 'BSI', validUntil: new Date('2025-08-15'), verified: true },
      { type: 'carbonneutral', name: 'Carbon Neutral', issuer: 'Carbon Trust', validUntil: new Date('2024-12-31'), verified: true },
      { type: 'recycled', name: '95% Recycled Steel', issuer: 'SCS Global', validUntil: new Date('2025-03-20'), verified: true },
    ],
    carbonFootprint: 1.2,
    renewableEnergy: 85,
    wasteRecycling: 98,
    localSourcing: 45,
    lastAudit: new Date('2024-01-15'),
    nextAudit: new Date('2025-01-15'),
  },
  {
    id: 's2',
    name: 'GreenPack Solutions',
    category: 'Packaging',
    tier: 'gold',
    sustainabilityScore: 86,
    certifications: [
      { type: 'fsc', name: 'FSC Certified', issuer: 'FSC', validUntil: new Date('2025-06-30'), verified: true },
      { type: 'iso14001', name: 'ISO 14001:2015', issuer: 'DNV', validUntil: new Date('2024-11-20'), verified: true },
    ],
    carbonFootprint: 0.8,
    renewableEnergy: 72,
    wasteRecycling: 95,
    localSourcing: 80,
    lastAudit: new Date('2023-11-20'),
    nextAudit: new Date('2024-11-20'),
  },
  {
    id: 's3',
    name: 'CleanTech Components',
    category: 'Electronics',
    tier: 'gold',
    sustainabilityScore: 82,
    certifications: [
      { type: 'iso50001', name: 'ISO 50001:2018', issuer: 'TUV', validUntil: new Date('2025-04-10'), verified: true },
      { type: 'bcorp', name: 'B Corp Certified', issuer: 'B Lab', validUntil: new Date('2026-01-01'), verified: true },
    ],
    carbonFootprint: 2.5,
    renewableEnergy: 65,
    wasteRecycling: 78,
    localSourcing: 35,
    lastAudit: new Date('2024-02-01'),
    nextAudit: new Date('2025-02-01'),
  },
  {
    id: 's4',
    name: 'NaturalChem Labs',
    category: 'Chemicals',
    tier: 'silver',
    sustainabilityScore: 74,
    certifications: [
      { type: 'iso14001', name: 'ISO 14001:2015', issuer: 'SGS', validUntil: new Date('2024-09-30'), verified: true },
    ],
    carbonFootprint: 3.8,
    renewableEnergy: 45,
    wasteRecycling: 65,
    localSourcing: 60,
    lastAudit: new Date('2023-09-30'),
    nextAudit: new Date('2024-09-30'),
  },
  {
    id: 's5',
    name: 'FairSource Textiles',
    category: 'Textiles',
    tier: 'silver',
    sustainabilityScore: 71,
    certifications: [
      { type: 'fairtrade', name: 'Fair Trade Certified', issuer: 'Fair Trade USA', validUntil: new Date('2025-02-28'), verified: true },
      { type: 'organic', name: 'GOTS Organic', issuer: 'GOTS', validUntil: new Date('2024-08-15'), verified: true },
    ],
    carbonFootprint: 2.1,
    renewableEnergy: 55,
    wasteRecycling: 70,
    localSourcing: 25,
    lastAudit: new Date('2024-02-28'),
    nextAudit: new Date('2025-02-28'),
  },
  {
    id: 's6',
    name: 'QuickParts Inc',
    category: 'Components',
    tier: 'bronze',
    sustainabilityScore: 62,
    certifications: [],
    carbonFootprint: 4.2,
    renewableEnergy: 30,
    wasteRecycling: 55,
    localSourcing: 90,
    lastAudit: new Date('2023-06-15'),
    nextAudit: new Date('2024-06-15'),
  },
];

export function GreenSupplierBadges({
  suppliers: initialSuppliers,
  onSupplierClick,
  onCertificationClick,
  className = '',
}: GreenSupplierBadgesProps) {
  const [view, setView] = useState<'overview' | 'suppliers' | 'certifications' | 'compare'>('overview');
  const [selectedTier, setSelectedTier] = useState<SupplierTier | 'all'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<GreenSupplier | null>(null);

  const suppliers = useMemo(() => initialSuppliers || generateMockSuppliers(), [initialSuppliers]);

  const filteredSuppliers = useMemo(() => {
    if (selectedTier === 'all') return suppliers;
    return suppliers.filter(s => s.tier === selectedTier);
  }, [suppliers, selectedTier]);

  const suppliersByTier = useMemo(() => ({
    platinum: suppliers.filter(s => s.tier === 'platinum').length,
    gold: suppliers.filter(s => s.tier === 'gold').length,
    silver: suppliers.filter(s => s.tier === 'silver').length,
    bronze: suppliers.filter(s => s.tier === 'bronze').length,
    none: suppliers.filter(s => s.tier === 'none').length,
  }), [suppliers]);

  const avgScore = useMemo(() =>
    Math.round(suppliers.reduce((sum, s) => sum + s.sustainabilityScore, 0) / suppliers.length),
    [suppliers]
  );

  const handleSupplierClick = (supplier: GreenSupplier) => {
    setSelectedSupplier(supplier);
    onSupplierClick?.(supplier);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', border: 'border-cyan-600' },
      yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-600' },
      gray: { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-600' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-600' },
      slate: { bg: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-600' },
      green: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-600' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600' },
      teal: { bg: 'bg-teal-600', text: 'text-teal-400', border: 'border-teal-600' },
      lime: { bg: 'bg-lime-600', text: 'text-lime-400', border: 'border-lime-600' },
    };
    return colors[color] || colors.gray;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🏢</span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-white">{suppliers.length}</p>
          <p className="text-sm text-gray-400">Suppliers Tracked</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-xs text-green-400">+3 vs last quarter</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{avgScore}</p>
          <p className="text-sm text-gray-400">Avg Sustainability Score</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{suppliersByTier.platinum + suppliersByTier.gold}</p>
          <p className="text-sm text-gray-400">Top Tier Suppliers</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {suppliers.reduce((sum, s) => sum + s.certifications.length, 0)}
          </p>
          <p className="text-sm text-gray-400">Active Certifications</p>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Supplier Tier Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(tierConfig).map(([tier, config]) => {
            const count = suppliersByTier[tier as SupplierTier];
            const percentage = (count / suppliers.length) * 100;
            const colors = getColorClass(config.color);

            return (
              <div key={tier} className={`bg-gray-700 rounded-lg p-4 text-center border-t-4 ${colors.border}`}>
                <span className="text-3xl mb-2 block">{config.icon}</span>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className={`text-sm ${colors.text}`}>{config.name}</p>
                <p className="text-xs text-gray-400">{percentage.toFixed(0)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Green Suppliers</h3>
        <div className="space-y-3">
          {suppliers
            .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
            .slice(0, 3)
            .map((supplier, i) => {
              const tierConf = tierConfig[supplier.tier];
              const colors = getColorClass(tierConf.color);

              return (
                <div
                  key={supplier.id}
                  className={`flex items-center justify-between p-4 bg-gray-700 rounded-lg border-l-4 ${colors.border} cursor-pointer hover:bg-gray-650`}
                  onClick={() => handleSupplierClick(supplier)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-400">#{i + 1}</span>
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {supplier.name}
                        <span>{tierConf.icon}</span>
                      </p>
                      <p className="text-sm text-gray-400">{supplier.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {supplier.certifications.slice(0, 3).map((cert, j) => (
                        <span key={j} className="text-lg" title={certificationConfig[cert.type].name}>
                          {certificationConfig[cert.type].icon}
                        </span>
                      ))}
                      {supplier.certifications.length > 3 && (
                        <span className="text-xs text-gray-400">+{supplier.certifications.length - 3}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{supplier.sustainabilityScore}</p>
                      <p className="text-xs text-gray-400">Score</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-4">
      {/* Tier Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTier === 'all' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All Tiers
        </button>
        {Object.entries(tierConfig).map(([tier, config]) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier as SupplierTier)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedTier === tier ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span>{config.icon}</span>
            {config.name}
          </button>
        ))}
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filteredSuppliers.map(supplier => {
          const tierConf = tierConfig[supplier.tier];
          const colors = getColorClass(tierConf.color);

          return (
            <div
              key={supplier.id}
              className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${colors.border}`}
              onClick={() => handleSupplierClick(supplier)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    {supplier.name}
                    <span className="text-lg">{tierConf.icon}</span>
                  </p>
                  <p className="text-sm text-gray-400">{supplier.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{supplier.sustainabilityScore}</p>
                  <p className="text-xs text-gray-400">Score</p>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mb-3">
                {supplier.certifications.map((cert, i) => {
                  const certConf = certificationConfig[cert.type];
                  return (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getColorClass(certConf.color).bg} text-white`}
                      title={certConf.description}
                    >
                      {certConf.icon} {certConf.name}
                    </span>
                  );
                })}
                {supplier.certifications.length === 0 && (
                  <span className="text-gray-400 text-xs">No certifications</span>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Renewable Energy</span>
                  <span className="text-white">{supplier.renewableEnergy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Waste Recycling</span>
                  <span className="text-white">{supplier.wasteRecycling}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Carbon/Unit</span>
                  <span className="text-white">{supplier.carbonFootprint} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Local Sourcing</span>
                  <span className="text-white">{supplier.localSourcing}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tierConfig[selectedSupplier.tier].icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedSupplier.name}</h3>
                  <p className="text-gray-400">{selectedSupplier.category} • {tierConfig[selectedSupplier.tier].name} Tier</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Score Gauge */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={`${selectedSupplier.sustainabilityScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{selectedSupplier.sustainabilityScore}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Renewable Energy</span>
                    <span className="text-white">{selectedSupplier.renewableEnergy}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${selectedSupplier.renewableEnergy}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Waste Recycling</span>
                    <span className="text-white">{selectedSupplier.wasteRecycling}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${selectedSupplier.wasteRecycling}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Local Sourcing</span>
                    <span className="text-white">{selectedSupplier.localSourcing}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedSupplier.localSourcing}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-white mb-3">Certifications</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedSupplier.certifications.map((cert, i) => {
                  const certConf = certificationConfig[cert.type];
                  const isExpiring = cert.validUntil < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

                  return (
                    <div key={i} className={`p-3 bg-gray-700 rounded-lg border-l-4 ${getColorClass(certConf.color).border}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{certConf.icon}</span>
                        <span className="text-white font-medium">{certConf.name}</span>
                        {cert.verified && <span className="text-green-400">✓</span>}
                      </div>
                      <p className="text-xs text-gray-400">{certConf.description}</p>
                      <p className={`text-xs mt-1 ${isExpiring ? 'text-yellow-400' : 'text-gray-400'}`}>
                        Valid until: {cert.validUntil.toLocaleDateString()}
                        {isExpiring && ' ⚠️ Expiring soon'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm">Last Audit</p>
                <p className="text-white font-medium">
                  {selectedSupplier.lastAudit?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm">Next Audit</p>
                <p className="text-white font-medium">
                  {selectedSupplier.nextAudit?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => {
    const allCerts = suppliers.flatMap(s => s.certifications.map(c => ({ ...c, supplier: s.name })));
    const certsByType = Object.keys(certificationConfig).map(type => ({
      type: type as CertificationType,
      count: allCerts.filter(c => c.type === type).length,
    }));

    return (
      <div className="space-y-6">
        {/* Certification Overview */}
        <div className="grid grid-cols-4 gap-4">
          {certsByType.filter(c => c.count > 0).map(({ type, count }) => {
            const config = certificationConfig[type];
            const colors = getColorClass(config.color);

            return (
              <div key={type} className={`bg-gray-800 rounded-lg p-4 border-l-4 ${colors.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  <span className="text-white font-medium">{config.name}</span>
                </div>
                <p className="text-3xl font-bold text-white">{count}</p>
                <p className="text-sm text-gray-400">suppliers certified</p>
              </div>
            );
          })}
        </div>

        {/* All Certifications List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">All Active Certifications</h3>
          <div className="space-y-3">
            {allCerts.map((cert, i) => {
              const config = certificationConfig[cert.type];
              const colors = getColorClass(config.color);
              const isExpiring = cert.validUntil < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

              return (
                <div key={i} className={`flex items-center justify-between p-3 bg-gray-700 rounded-lg border-l-4 ${colors.border}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="text-white font-medium">{config.name}</p>
                      <p className="text-sm text-gray-400">{cert.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isExpiring ? 'text-yellow-400' : 'text-gray-400'}`}>
                      Valid until: {cert.validUntil.toLocaleDateString()}
                    </p>
                    {cert.verified && <span className="text-green-400 text-sm">✓ Verified</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCompare = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Supplier Comparison</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-left text-gray-400 font-medium">Supplier</th>
              <th className="p-3 text-center text-gray-400 font-medium">Tier</th>
              <th className="p-3 text-center text-gray-400 font-medium">Score</th>
              <th className="p-3 text-center text-gray-400 font-medium">Renewable %</th>
              <th className="p-3 text-center text-gray-400 font-medium">Recycling %</th>
              <th className="p-3 text-center text-gray-400 font-medium">Carbon/Unit</th>
              <th className="p-3 text-center text-gray-400 font-medium">Certifications</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore).map(supplier => {
              const tierConf = tierConfig[supplier.tier];

              return (
                <tr key={supplier.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="p-3">
                    <p className="text-white font-medium">{supplier.name}</p>
                    <p className="text-xs text-gray-400">{supplier.category}</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-xl">{tierConf.icon}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-xl font-bold text-green-400">{supplier.sustainabilityScore}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={supplier.renewableEnergy >= 70 ? 'text-green-400' : supplier.renewableEnergy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {supplier.renewableEnergy}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={supplier.wasteRecycling >= 80 ? 'text-green-400' : supplier.wasteRecycling >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                      {supplier.wasteRecycling}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={supplier.carbonFootprint <= 2 ? 'text-green-400' : supplier.carbonFootprint <= 3 ? 'text-yellow-400' : 'text-red-400'}>
                      {supplier.carbonFootprint} kg
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      {supplier.certifications.slice(0, 3).map((cert, i) => (
                        <span key={i} title={certificationConfig[cert.type].name}>
                          {certificationConfig[cert.type].icon}
                        </span>
                      ))}
                      {supplier.certifications.length > 3 && (
                        <span className="text-xs text-gray-400">+{supplier.certifications.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Green Supplier Badges</h2>
            <p className="text-gray-400">Eco-certified vendor indicators</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
            { id: 'certifications', label: 'Certifications', icon: '🏆' },
            { id: 'compare', label: 'Compare', icon: '⚖️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as typeof view)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === tab.id
                  ? 'bg-emerald-600 text-white'
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
      {view === 'suppliers' && renderSuppliers()}
      {view === 'certifications' && renderCertifications()}
      {view === 'compare' && renderCompare()}
    </div>
  );
}

export default GreenSupplierBadges;
