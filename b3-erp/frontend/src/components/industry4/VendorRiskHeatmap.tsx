'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  DollarSign,
  Shield,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  AlertCircle,
  FileCheck,
  Truck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory = 'delivery' | 'quality' | 'financial' | 'compliance' | 'capacity';
export type VendorTier = 'strategic' | 'preferred' | 'approved' | 'conditional';

export interface RiskScore {
  category: RiskCategory;
  score: number;
  trend: 'improving' | 'declining' | 'stable';
  factors: string[];
}

export interface Vendor {
  id: string;
  name: string;
  country: string;
  tier: VendorTier;
  overallRisk: RiskLevel;
  riskScore: number;
  riskScores: RiskScore[];
  deliveryPerformance: number;
  qualityScore: number;
  financialHealth: number;
  complianceScore: number;
  capacityUtilization: number;
  activeOrders: number;
  totalSpend: number;
  lastAudit: string;
  certifications: string[];
  alerts: string[];
}

export interface VendorRiskHeatmapProps {
  onVendorClick?: (vendor: Vendor) => void;
  onAlertClick?: (vendor: Vendor, alert: string) => void;
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockVendors = (): Vendor[] => [
  {
    id: 'vendor-1',
    name: 'Precision Components Ltd',
    country: 'Germany',
    tier: 'strategic',
    overallRisk: 'low',
    riskScore: 15,
    riskScores: [
      { category: 'delivery', score: 12, trend: 'stable', factors: ['On-time delivery 98%'] },
      { category: 'quality', score: 8, trend: 'improving', factors: ['PPM < 50', 'Zero recalls'] },
      { category: 'financial', score: 20, trend: 'stable', factors: ['Strong credit rating'] },
      { category: 'compliance', score: 10, trend: 'stable', factors: ['ISO 9001', 'IATF 16949'] },
      { category: 'capacity', score: 25, trend: 'declining', factors: ['85% utilization'] },
    ],
    deliveryPerformance: 98,
    qualityScore: 99,
    financialHealth: 95,
    complianceScore: 100,
    capacityUtilization: 85,
    activeOrders: 12,
    totalSpend: 2450000,
    lastAudit: '2024-09-15',
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001'],
    alerts: [],
  },
  {
    id: 'vendor-2',
    name: 'Eastern Electronics Co',
    country: 'China',
    tier: 'preferred',
    overallRisk: 'medium',
    riskScore: 45,
    riskScores: [
      { category: 'delivery', score: 40, trend: 'declining', factors: ['Port congestion delays'] },
      { category: 'quality', score: 35, trend: 'stable', factors: ['PPM 150', 'Minor issues'] },
      { category: 'financial', score: 30, trend: 'stable', factors: ['Moderate credit rating'] },
      { category: 'compliance', score: 55, trend: 'improving', factors: ['Pending certification renewal'] },
      { category: 'capacity', score: 65, trend: 'declining', factors: ['92% utilization', 'Backlog'] },
    ],
    deliveryPerformance: 87,
    qualityScore: 94,
    financialHealth: 85,
    complianceScore: 88,
    capacityUtilization: 92,
    activeOrders: 25,
    totalSpend: 5600000,
    lastAudit: '2024-06-20',
    certifications: ['ISO 9001', 'ISO 14001'],
    alerts: ['Delivery delays on 3 orders', 'Capacity constraints'],
  },
  {
    id: 'vendor-3',
    name: 'Global Steel Works',
    country: 'India',
    tier: 'approved',
    overallRisk: 'high',
    riskScore: 72,
    riskScores: [
      { category: 'delivery', score: 75, trend: 'declining', factors: ['Consistent late deliveries', 'Lead time issues'] },
      { category: 'quality', score: 60, trend: 'stable', factors: ['PPM 300', 'Recent quality escapes'] },
      { category: 'financial', score: 80, trend: 'declining', factors: ['Payment delays observed'] },
      { category: 'compliance', score: 70, trend: 'stable', factors: ['Missing updated certifications'] },
      { category: 'capacity', score: 75, trend: 'stable', factors: ['Limited expansion capability'] },
    ],
    deliveryPerformance: 72,
    qualityScore: 85,
    financialHealth: 70,
    complianceScore: 75,
    capacityUtilization: 95,
    activeOrders: 8,
    totalSpend: 890000,
    lastAudit: '2024-03-10',
    certifications: ['ISO 9001'],
    alerts: ['Quality issue on batch #4521', 'Late payment risk', 'Overdue audit'],
  },
  {
    id: 'vendor-4',
    name: 'Nordic Plastics AB',
    country: 'Sweden',
    tier: 'strategic',
    overallRisk: 'low',
    riskScore: 18,
    riskScores: [
      { category: 'delivery', score: 10, trend: 'stable', factors: ['99% on-time'] },
      { category: 'quality', score: 15, trend: 'improving', factors: ['PPM < 25', 'Zero defects 6 months'] },
      { category: 'financial', score: 20, trend: 'stable', factors: ['Excellent credit'] },
      { category: 'compliance', score: 25, trend: 'stable', factors: ['All certs current'] },
      { category: 'capacity', score: 20, trend: 'stable', factors: ['70% utilization', 'Room for growth'] },
    ],
    deliveryPerformance: 99,
    qualityScore: 99,
    financialHealth: 98,
    complianceScore: 100,
    capacityUtilization: 70,
    activeOrders: 15,
    totalSpend: 1850000,
    lastAudit: '2024-10-01',
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001', 'ISO 45001'],
    alerts: [],
  },
  {
    id: 'vendor-5',
    name: 'Pacific Motors',
    country: 'Japan',
    tier: 'preferred',
    overallRisk: 'low',
    riskScore: 22,
    riskScores: [
      { category: 'delivery', score: 18, trend: 'stable', factors: ['97% on-time'] },
      { category: 'quality', score: 10, trend: 'improving', factors: ['PPM < 10', 'Six Sigma certified'] },
      { category: 'financial', score: 25, trend: 'stable', factors: ['Strong financials'] },
      { category: 'compliance', score: 30, trend: 'stable', factors: ['All certs current'] },
      { category: 'capacity', score: 28, trend: 'declining', factors: ['82% utilization'] },
    ],
    deliveryPerformance: 97,
    qualityScore: 99,
    financialHealth: 96,
    complianceScore: 98,
    capacityUtilization: 82,
    activeOrders: 20,
    totalSpend: 3200000,
    lastAudit: '2024-08-25',
    certifications: ['ISO 9001', 'IATF 16949', 'AS9100'],
    alerts: [],
  },
  {
    id: 'vendor-6',
    name: 'Southern Metals LLC',
    country: 'Brazil',
    tier: 'conditional',
    overallRisk: 'critical',
    riskScore: 88,
    riskScores: [
      { category: 'delivery', score: 90, trend: 'declining', factors: ['50% on-time only', 'Chronic delays'] },
      { category: 'quality', score: 85, trend: 'declining', factors: ['PPM 500+', 'Multiple customer complaints'] },
      { category: 'financial', score: 92, trend: 'declining', factors: ['Credit downgrade', 'Cash flow issues'] },
      { category: 'compliance', score: 85, trend: 'stable', factors: ['Expired certifications'] },
      { category: 'capacity', score: 88, trend: 'declining', factors: ['Equipment issues', 'Staff shortage'] },
    ],
    deliveryPerformance: 52,
    qualityScore: 68,
    financialHealth: 45,
    complianceScore: 55,
    capacityUtilization: 98,
    activeOrders: 3,
    totalSpend: 340000,
    lastAudit: '2023-11-15',
    certifications: [],
    alerts: ['Critical: Multiple quality failures', 'Financial risk - payment hold recommended', 'Consider alternative supplier'],
  },
  {
    id: 'vendor-7',
    name: 'MidWest Manufacturing',
    country: 'USA',
    tier: 'approved',
    overallRisk: 'medium',
    riskScore: 48,
    riskScores: [
      { category: 'delivery', score: 45, trend: 'improving', factors: ['Recently improved to 90%'] },
      { category: 'quality', score: 40, trend: 'stable', factors: ['PPM 120'] },
      { category: 'financial', score: 55, trend: 'stable', factors: ['Average credit rating'] },
      { category: 'compliance', score: 50, trend: 'improving', factors: ['Working on IATF'] },
      { category: 'capacity', score: 50, trend: 'stable', factors: ['75% utilization'] },
    ],
    deliveryPerformance: 90,
    qualityScore: 92,
    financialHealth: 82,
    complianceScore: 85,
    capacityUtilization: 75,
    activeOrders: 10,
    totalSpend: 1200000,
    lastAudit: '2024-07-12',
    certifications: ['ISO 9001', 'ISO 14001'],
    alerts: ['Certification upgrade in progress'],
  },
  {
    id: 'vendor-8',
    name: 'UK Precision Tools',
    country: 'UK',
    tier: 'preferred',
    overallRisk: 'low',
    riskScore: 25,
    riskScores: [
      { category: 'delivery', score: 20, trend: 'stable', factors: ['96% on-time'] },
      { category: 'quality', score: 25, trend: 'stable', factors: ['PPM 45'] },
      { category: 'financial', score: 30, trend: 'stable', factors: ['Good credit'] },
      { category: 'compliance', score: 25, trend: 'stable', factors: ['All current'] },
      { category: 'capacity', score: 25, trend: 'stable', factors: ['78% utilization'] },
    ],
    deliveryPerformance: 96,
    qualityScore: 97,
    financialHealth: 90,
    complianceScore: 95,
    capacityUtilization: 78,
    activeOrders: 14,
    totalSpend: 1680000,
    lastAudit: '2024-08-05',
    certifications: ['ISO 9001', 'AS9100', 'Nadcap'],
    alerts: [],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-orange-500';
    case 'critical':
      return 'bg-red-500';
  }
};

const getRiskBgColor = (level: RiskLevel) => {
  switch (level) {
    case 'low':
      return 'bg-green-50 dark:bg-green-900/20';
    case 'medium':
      return 'bg-yellow-50 dark:bg-yellow-900/20';
    case 'high':
      return 'bg-orange-50 dark:bg-orange-900/20';
    case 'critical':
      return 'bg-red-50 dark:bg-red-900/20';
  }
};

const getRiskTextColor = (level: RiskLevel) => {
  switch (level) {
    case 'low':
      return 'text-green-700 dark:text-green-400';
    case 'medium':
      return 'text-yellow-700 dark:text-yellow-400';
    case 'high':
      return 'text-orange-700 dark:text-orange-400';
    case 'critical':
      return 'text-red-700 dark:text-red-400';
  }
};

const getTierBadge = (tier: VendorTier) => {
  const styles = {
    strategic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    preferred: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    approved: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    conditional: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return styles[tier];
};

const getCategoryIcon = (category: RiskCategory) => {
  switch (category) {
    case 'delivery':
      return Truck;
    case 'quality':
      return CheckCircle;
    case 'financial':
      return DollarSign;
    case 'compliance':
      return FileCheck;
    case 'capacity':
      return Package;
  }
};

// ============================================================================
// Heatmap Cell Component
// ============================================================================

function HeatmapCell({
  score,
  onClick,
}: {
  score: RiskScore;
  onClick?: () => void;
}) {
  const getHeatColor = (value: number) => {
    if (value <= 25) return 'bg-green-500';
    if (value <= 50) return 'bg-yellow-500';
    if (value <= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const TrendIcon = score.trend === 'improving' ? TrendingDown : score.trend === 'declining' ? TrendingUp : null;

  return (
    <div
      className={`relative w-16 h-16 ${getHeatColor(score.score)} rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity group`}
      onClick={onClick}
    >
      <span className="text-white font-bold text-lg">{score.score}</span>
      {TrendIcon && (
        <TrendIcon className={`absolute top-1 right-1 w-3 h-3 ${
          score.trend === 'improving' ? 'text-green-200' : 'text-red-200'
        }`} />
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
        <p className="font-medium capitalize mb-1">{score.category} Risk: {score.score}</p>
        {score.factors.map((f, i) => (
          <p key={i} className="text-gray-300">• {f}</p>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Vendor Row Component
// ============================================================================

function VendorRow({
  vendor,
  onVendorClick,
  onAlertClick,
}: {
  vendor: Vendor;
  onVendorClick?: (vendor: Vendor) => void;
  onAlertClick?: (vendor: Vendor, alert: string) => void;
}) {
  return (
    <div className={`p-4 rounded-lg border ${getRiskBgColor(vendor.overallRisk)} border-gray-200 dark:border-gray-700`}>
      <div className="flex items-start gap-2">
        {/* Vendor Info */}
        <div className="flex-shrink-0 w-48">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onVendorClick?.(vendor)}
            >
              {vendor.name}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.country}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTierBadge(vendor.tier)}`}>
              {vendor.tier.charAt(0).toUpperCase() + vendor.tier.slice(1)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskBgColor(vendor.overallRisk)} ${getRiskTextColor(vendor.overallRisk)}`}>
              {vendor.overallRisk.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Overall Risk Score */}
        <div className="flex-shrink-0 w-20 text-center">
          <div className={`w-14 h-14 rounded-full ${getRiskColor(vendor.overallRisk)} flex items-center justify-center`}>
            <span className="text-white font-bold text-xl">{vendor.riskScore}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Overall</p>
        </div>

        {/* Heatmap Cells */}
        <div className="flex gap-2">
          {vendor.riskScores.map((score) => (
            <div key={score.category} className="text-center">
              <HeatmapCell score={score} />
              <p className="text-xs text-gray-500 mt-1 capitalize">{score.category}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="flex-1 grid grid-cols-4 gap-3 text-sm">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Orders</p>
            <p className="font-semibold">{vendor.activeOrders}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Spend</p>
            <p className="font-semibold">${(vendor.totalSpend / 1000000).toFixed(1)}M</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">On-Time</p>
            <p className={`font-semibold ${vendor.deliveryPerformance >= 95 ? 'text-green-600' : vendor.deliveryPerformance >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
              {vendor.deliveryPerformance}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Quality</p>
            <p className={`font-semibold ${vendor.qualityScore >= 95 ? 'text-green-600' : vendor.qualityScore >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
              {vendor.qualityScore}%
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVendorClick?.(vendor)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {vendor.alerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {vendor.alerts.map((alert, index) => (
              <button
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs hover:bg-red-200 transition-colors"
                onClick={() => onAlertClick?.(vendor, alert)}
              >
                <AlertTriangle className="w-3 h-3" />
                {alert}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Risk Summary Component
// ============================================================================

function RiskSummary({ vendors }: { vendors: Vendor[] }) {
  const summary = useMemo(() => {
    const byRisk = {
      low: vendors.filter(v => v.overallRisk === 'low').length,
      medium: vendors.filter(v => v.overallRisk === 'medium').length,
      high: vendors.filter(v => v.overallRisk === 'high').length,
      critical: vendors.filter(v => v.overallRisk === 'critical').length,
    };
    const totalAlerts = vendors.reduce((sum, v) => sum + v.alerts.length, 0);
    const avgRiskScore = Math.round(vendors.reduce((sum, v) => sum + v.riskScore, 0) / vendors.length);

    return { byRisk, totalAlerts, avgRiskScore };
  }, [vendors]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-3">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.byRisk.low}</p>
              <p className="text-xs text-gray-500">Low Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{summary.byRisk.medium}</p>
              <p className="text-xs text-gray-500">Medium Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{summary.byRisk.high}</p>
              <p className="text-xs text-gray-500">High Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{summary.byRisk.critical}</p>
              <p className="text-xs text-gray-500">Critical Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{summary.avgRiskScore}</p>
              <p className="text-xs text-gray-500">Avg Risk Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{summary.totalAlerts}</p>
              <p className="text-xs text-gray-500">Active Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function VendorRiskHeatmap({
  onVendorClick,
  onAlertClick,
}: VendorRiskHeatmapProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterTier, setFilterTier] = useState<VendorTier | 'all'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'spend'>('risk');

  useEffect(() => {
    setVendors(generateMockVendors());
    setIsLoading(false);
  }, []);

  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (filterRisk !== 'all') {
      result = result.filter(v => v.overallRisk === filterRisk);
    }

    if (filterTier !== 'all') {
      result = result.filter(v => v.tier === filterTier);
    }

    switch (sortBy) {
      case 'risk':
        result.sort((a, b) => b.riskScore - a.riskScore);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'spend':
        result.sort((a, b) => b.totalSpend - a.totalSpend);
        break;
    }

    return result;
  }, [vendors, filterRisk, filterTier, sortBy]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Vendor Risk Heatmap
            </CardTitle>

            <div className="flex items-center gap-3">
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value as RiskLevel | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterTier}
                onChange={e => setFilterTier(e.target.value as VendorTier | 'all')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Tiers</option>
                <option value="strategic">Strategic</option>
                <option value="preferred">Preferred</option>
                <option value="approved">Approved</option>
                <option value="conditional">Conditional</option>
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'risk' | 'name' | 'spend')}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="risk">Sort by Risk</option>
                <option value="name">Sort by Name</option>
                <option value="spend">Sort by Spend</option>
              </select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Risk Summary */}
          <RiskSummary vendors={vendors} />

          {/* Legend */}
          <div className="flex items-center gap-3 mb-3 text-sm">
            <span className="text-gray-500 font-medium">Risk Score:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>0-25 Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span>26-50 Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span>51-75 High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>76-100 Critical</span>
            </div>
          </div>

          {/* Category Labels */}
          <div className="flex items-center gap-3 mb-2 ml-[270px]">
            {['Overall', 'Delivery', 'Quality', 'Financial', 'Compliance', 'Capacity'].map((cat, i) => {
              const Icon = i === 0 ? Shield : getCategoryIcon(['delivery', 'quality', 'financial', 'compliance', 'capacity'][i - 1] as RiskCategory);
              return (
                <div key={cat} className={`text-center ${i === 0 ? 'w-20' : 'w-16'}`}>
                  <Icon className="w-4 h-4 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-medium">{cat}</span>
                </div>
              );
            })}
          </div>

          {/* Vendor Rows */}
          <div className="space-y-3">
            {filteredVendors.map(vendor => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                onVendorClick={onVendorClick}
                onAlertClick={onAlertClick}
              />
            ))}
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No vendors match the selected filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
