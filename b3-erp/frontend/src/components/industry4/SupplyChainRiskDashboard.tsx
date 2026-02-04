'use client';

import React, { useState, useEffect } from 'react';

// Types
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type SourceType = 'sole' | 'single' | 'dual' | 'multi';
export type StockStatus = 'critical' | 'low' | 'adequate' | 'excess';

export interface SupplierRisk {
  id: string;
  supplierName: string;
  category: string;
  sourceType: SourceType;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  leadTime: number; // days
  onTimeDelivery: number; // percentage
  qualityScore: number; // percentage
  financialHealth: 'stable' | 'watch' | 'concern' | 'critical';
  geopoliticalRisk: RiskLevel;
  alternativeSuppliers: number;
  lastAssessment: Date;
  issues: string[];
}

export interface BufferStock {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  currentStock: number;
  bufferLevel: number;
  safetyStock: number;
  maxStock: number;
  unit: string;
  status: StockStatus;
  daysOfSupply: number;
  averageDailyUsage: number;
  lastReplenishment: Date;
  nextDelivery: Date | null;
  supplierName: string;
  sourceType: SourceType;
}

export interface RiskAlert {
  id: string;
  type: 'sole_source' | 'single_source' | 'low_stock' | 'critical_stock' | 'delivery_delay' | 'quality_issue' | 'supplier_financial';
  severity: RiskLevel;
  title: string;
  description: string;
  affectedItems: string[];
  recommendedAction: string;
  createdAt: Date;
  acknowledged: boolean;
}

interface SupplyChainRiskDashboardProps {
  className?: string;
}

// Mock data generators
const generateSupplierRisks = (): SupplierRisk[] => [
  {
    id: 'sr1',
    supplierName: 'TechCore Electronics',
    category: 'Electronic Components',
    sourceType: 'sole',
    riskLevel: 'critical',
    riskScore: 85,
    leadTime: 45,
    onTimeDelivery: 78,
    qualityScore: 94,
    financialHealth: 'stable',
    geopoliticalRisk: 'high',
    alternativeSuppliers: 0,
    lastAssessment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    issues: ['Sole source dependency', 'Long lead time', 'Geopolitical exposure']
  },
  {
    id: 'sr2',
    supplierName: 'PrecisionCast Ltd',
    category: 'Metal Castings',
    sourceType: 'single',
    riskLevel: 'high',
    riskScore: 68,
    leadTime: 21,
    onTimeDelivery: 85,
    qualityScore: 91,
    financialHealth: 'watch',
    geopoliticalRisk: 'low',
    alternativeSuppliers: 2,
    lastAssessment: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    issues: ['Single source for critical parts', 'Financial monitoring required']
  },
  {
    id: 'sr3',
    supplierName: 'GlobalPlastics Inc',
    category: 'Plastic Components',
    sourceType: 'dual',
    riskLevel: 'medium',
    riskScore: 42,
    leadTime: 14,
    onTimeDelivery: 92,
    qualityScore: 88,
    financialHealth: 'stable',
    geopoliticalRisk: 'medium',
    alternativeSuppliers: 3,
    lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    issues: ['Quality variations between batches']
  },
  {
    id: 'sr4',
    supplierName: 'SteelWorks Pro',
    category: 'Raw Materials',
    sourceType: 'multi',
    riskLevel: 'low',
    riskScore: 22,
    leadTime: 7,
    onTimeDelivery: 96,
    qualityScore: 97,
    financialHealth: 'stable',
    geopoliticalRisk: 'low',
    alternativeSuppliers: 5,
    lastAssessment: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    issues: []
  },
  {
    id: 'sr5',
    supplierName: 'ChipMaster Semiconductors',
    category: 'Semiconductors',
    sourceType: 'sole',
    riskLevel: 'critical',
    riskScore: 92,
    leadTime: 60,
    onTimeDelivery: 72,
    qualityScore: 99,
    financialHealth: 'stable',
    geopoliticalRisk: 'critical',
    alternativeSuppliers: 0,
    lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    issues: ['Critical sole source', 'Extended lead times', 'Regional concentration risk']
  },
  {
    id: 'sr6',
    supplierName: 'FastenPro Hardware',
    category: 'Fasteners',
    sourceType: 'multi',
    riskLevel: 'low',
    riskScore: 15,
    leadTime: 5,
    onTimeDelivery: 98,
    qualityScore: 95,
    financialHealth: 'stable',
    geopoliticalRisk: 'low',
    alternativeSuppliers: 8,
    lastAssessment: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    issues: []
  }
];

const generateBufferStock = (): BufferStock[] => [
  {
    id: 'bs1',
    materialCode: 'MCU-ARM-7200',
    materialName: 'ARM Cortex M7 Microcontroller',
    category: 'Electronic Components',
    currentStock: 450,
    bufferLevel: 1000,
    safetyStock: 500,
    maxStock: 3000,
    unit: 'pcs',
    status: 'critical',
    daysOfSupply: 9,
    averageDailyUsage: 50,
    lastReplenishment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    nextDelivery: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    supplierName: 'TechCore Electronics',
    sourceType: 'sole'
  },
  {
    id: 'bs2',
    materialCode: 'ALU-6061-T6',
    materialName: 'Aluminum Alloy 6061-T6 Sheet',
    category: 'Raw Materials',
    currentStock: 2500,
    bufferLevel: 2000,
    safetyStock: 1000,
    maxStock: 5000,
    unit: 'kg',
    status: 'adequate',
    daysOfSupply: 25,
    averageDailyUsage: 100,
    lastReplenishment: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    supplierName: 'SteelWorks Pro',
    sourceType: 'multi'
  },
  {
    id: 'bs3',
    materialCode: 'CAP-MLCC-100',
    materialName: 'MLCC Capacitor 100µF',
    category: 'Electronic Components',
    currentStock: 8500,
    bufferLevel: 5000,
    safetyStock: 2500,
    maxStock: 15000,
    unit: 'pcs',
    status: 'excess',
    daysOfSupply: 85,
    averageDailyUsage: 100,
    lastReplenishment: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextDelivery: null,
    supplierName: 'GlobalPlastics Inc',
    sourceType: 'dual'
  },
  {
    id: 'bs4',
    materialCode: 'SEMI-IC-5500',
    materialName: 'Power Management IC',
    category: 'Semiconductors',
    currentStock: 180,
    bufferLevel: 500,
    safetyStock: 250,
    maxStock: 1500,
    unit: 'pcs',
    status: 'low',
    daysOfSupply: 12,
    averageDailyUsage: 15,
    lastReplenishment: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    supplierName: 'ChipMaster Semiconductors',
    sourceType: 'sole'
  },
  {
    id: 'bs5',
    materialCode: 'CAST-HSG-200',
    materialName: 'Die Cast Housing Assembly',
    category: 'Metal Castings',
    currentStock: 320,
    bufferLevel: 400,
    safetyStock: 200,
    maxStock: 800,
    unit: 'pcs',
    status: 'low',
    daysOfSupply: 16,
    averageDailyUsage: 20,
    lastReplenishment: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    supplierName: 'PrecisionCast Ltd',
    sourceType: 'single'
  },
  {
    id: 'bs6',
    materialCode: 'FAST-M6-SS',
    materialName: 'M6 Stainless Steel Bolts',
    category: 'Fasteners',
    currentStock: 15000,
    bufferLevel: 10000,
    safetyStock: 5000,
    maxStock: 25000,
    unit: 'pcs',
    status: 'adequate',
    daysOfSupply: 30,
    averageDailyUsage: 500,
    lastReplenishment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    supplierName: 'FastenPro Hardware',
    sourceType: 'multi'
  }
];

const generateRiskAlerts = (): RiskAlert[] => [
  {
    id: 'ra1',
    type: 'sole_source',
    severity: 'critical',
    title: 'Critical Sole Source Dependency',
    description: 'ARM Cortex M7 Microcontroller has no alternative suppliers qualified',
    affectedItems: ['MCU-ARM-7200', 'Product Line A', 'Product Line C'],
    recommendedAction: 'Initiate supplier qualification for 2 alternative sources',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'ra2',
    type: 'critical_stock',
    severity: 'critical',
    title: 'Critical Stock Level Alert',
    description: 'MCU-ARM-7200 stock below safety level with 9 days supply remaining',
    affectedItems: ['MCU-ARM-7200'],
    recommendedAction: 'Expedite pending order or place emergency order',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'ra3',
    type: 'supplier_financial',
    severity: 'high',
    title: 'Supplier Financial Health Warning',
    description: 'PrecisionCast Ltd showing signs of financial stress - payment terms extended',
    affectedItems: ['CAST-HSG-200', 'CAST-BKT-150'],
    recommendedAction: 'Accelerate qualification of backup suppliers',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    acknowledged: true
  },
  {
    id: 'ra4',
    type: 'delivery_delay',
    severity: 'medium',
    title: 'Expected Delivery Delay',
    description: 'ChipMaster Semiconductors reports 2-week delay on SEMI-IC-5500 shipment',
    affectedItems: ['SEMI-IC-5500'],
    recommendedAction: 'Review production schedule and consider partial shipment',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'ra5',
    type: 'single_source',
    severity: 'high',
    title: 'Single Source Risk Identified',
    description: 'Die Cast Housing Assembly relies on single qualified supplier',
    affectedItems: ['CAST-HSG-200'],
    recommendedAction: 'Complete qualification of alternative supplier within 60 days',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    acknowledged: true
  }
];

const SupplyChainRiskDashboard: React.FC<SupplyChainRiskDashboardProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'overview' | 'suppliers' | 'inventory' | 'alerts'>('overview');
  const [supplierRisks, setSupplierRisks] = useState<SupplierRisk[]>([]);
  const [bufferStock, setBufferStock] = useState<BufferStock[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | 'all'>('all');

  useEffect(() => {
    setSupplierRisks(generateSupplierRisks());
    setBufferStock(generateBufferStock());
    setRiskAlerts(generateRiskAlerts());
  }, []);

  const getRiskColor = (level: RiskLevel): string => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
    }
  };

  const getSourceTypeLabel = (type: SourceType): string => {
    switch (type) {
      case 'sole': return 'Sole Source';
      case 'single': return 'Single Source';
      case 'dual': return 'Dual Source';
      case 'multi': return 'Multi Source';
    }
  };

  const getSourceTypeColor = (type: SourceType): string => {
    switch (type) {
      case 'sole': return '#dc2626';
      case 'single': return '#f59e0b';
      case 'dual': return '#3b82f6';
      case 'multi': return '#22c55e';
    }
  };

  const getStockStatusColor = (status: StockStatus): string => {
    switch (status) {
      case 'critical': return '#dc2626';
      case 'low': return '#f59e0b';
      case 'adequate': return '#22c55e';
      case 'excess': return '#3b82f6';
    }
  };

  const filteredSuppliers = supplierRisks.filter(s =>
    selectedRiskLevel === 'all' || s.riskLevel === selectedRiskLevel
  );

  const riskSummary = {
    critical: supplierRisks.filter(s => s.riskLevel === 'critical').length,
    high: supplierRisks.filter(s => s.riskLevel === 'high').length,
    medium: supplierRisks.filter(s => s.riskLevel === 'medium').length,
    low: supplierRisks.filter(s => s.riskLevel === 'low').length,
    soleSource: supplierRisks.filter(s => s.sourceType === 'sole').length,
    singleSource: supplierRisks.filter(s => s.sourceType === 'single').length
  };

  const stockSummary = {
    critical: bufferStock.filter(s => s.status === 'critical').length,
    low: bufferStock.filter(s => s.status === 'low').length,
    adequate: bufferStock.filter(s => s.status === 'adequate').length,
    excess: bufferStock.filter(s => s.status === 'excess').length
  };

  const unacknowledgedAlerts = riskAlerts.filter(a => !a.acknowledged).length;

  const renderOverview = () => (
    <div className="space-y-3">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical Risks</span>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="text-3xl font-bold text-red-600">{riskSummary.critical}</div>
          <div className="text-xs text-gray-500 mt-1">Immediate action required</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">High Risks</span>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          </div>
          <div className="text-3xl font-bold text-amber-600">{riskSummary.high}</div>
          <div className="text-xs text-gray-500 mt-1">Monitor closely</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sole/Single Source</span>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-red-600">{riskSummary.soleSource + riskSummary.singleSource}</div>
          <div className="text-xs text-gray-500 mt-1">{riskSummary.soleSource} sole, {riskSummary.singleSource} single</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Alerts</span>
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-amber-600">{unacknowledgedAlerts}</div>
          <div className="text-xs text-gray-500 mt-1">Unacknowledged</div>
        </div>
      </div>

      {/* Source Distribution and Stock Levels */}
      <div className="grid grid-cols-2 gap-3">
        {/* Source Type Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Supplier Source Distribution</h3>
          <div className="space-y-3">
            {(['sole', 'single', 'dual', 'multi'] as SourceType[]).map(type => {
              const count = supplierRisks.filter(s => s.sourceType === type).length;
              const percentage = (count / supplierRisks.length) * 100;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSourceTypeColor(type) }}></div>
                      {getSourceTypeLabel(type)}
                    </span>
                    <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: getSourceTypeColor(type) }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buffer Stock Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Buffer Stock Status</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stockSummary.critical}</div>
              <div className="text-xs text-red-700">Critical</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stockSummary.low}</div>
              <div className="text-xs text-amber-700">Low</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stockSummary.adequate}</div>
              <div className="text-xs text-green-700">Adequate</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stockSummary.excess}</div>
              <div className="text-xs text-blue-700">Excess</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Recent Risk Alerts</h3>
          <button
            onClick={() => setActiveView('alerts')}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {riskAlerts.slice(0, 3).map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${
                alert.acknowledged ? 'bg-gray-50' : 'bg-white'
              }`}
              style={{ borderLeftColor: getRiskColor(alert.severity) }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-sm">{alert.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{alert.description}</div>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getRiskColor(alert.severity) }}
                >
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-2">
      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
          <button
            key={level}
            onClick={() => setSelectedRiskLevel(level)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedRiskLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Supplier Risk Cards */}
      <div className="grid grid-cols-2 gap-2">
        {filteredSuppliers.map(supplier => (
          <div
            key={supplier.id}
            className="bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{supplier.supplierName}</h4>
                <p className="text-xs text-gray-500">{supplier.category}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getSourceTypeColor(supplier.sourceType) }}
                >
                  {getSourceTypeLabel(supplier.sourceType)}
                </span>
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getRiskColor(supplier.riskLevel) }}
                >
                  Risk: {supplier.riskScore}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">{supplier.leadTime}d</div>
                <div className="text-xs text-gray-500">Lead Time</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">{supplier.onTimeDelivery}%</div>
                <div className="text-xs text-gray-500">On-Time</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">{supplier.qualityScore}%</div>
                <div className="text-xs text-gray-500">Quality</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">{supplier.alternativeSuppliers}</div>
                <div className="text-xs text-gray-500">Alternatives</div>
              </div>
            </div>

            {supplier.issues.length > 0 && (
              <div className="border-t pt-3">
                <div className="text-xs font-medium text-gray-600 mb-1">Issues:</div>
                <div className="flex flex-wrap gap-1">
                  {supplier.issues.map((issue, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-2">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">Material</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Status</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Current Stock</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Buffer Level</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Days Supply</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Source Type</th>
              <th className="text-center p-3 text-xs font-semibold text-gray-600">Next Delivery</th>
            </tr>
          </thead>
          <tbody>
            {bufferStock.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium text-sm">{item.materialName}</div>
                  <div className="text-xs text-gray-500">{item.materialCode}</div>
                </td>
                <td className="p-3 text-center">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getStockStatusColor(item.status) }}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="text-sm font-medium">{item.currentStock.toLocaleString()} {item.unit}</div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%`,
                        backgroundColor: getStockStatusColor(item.status)
                      }}
                    ></div>
                  </div>
                </td>
                <td className="p-3 text-center text-sm">
                  {item.bufferLevel.toLocaleString()} {item.unit}
                </td>
                <td className="p-3 text-center">
                  <span className={`font-medium ${item.daysOfSupply < 14 ? 'text-red-600' : 'text-gray-800'}`}>
                    {item.daysOfSupply} days
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${getSourceTypeColor(item.sourceType)}20`,
                      color: getSourceTypeColor(item.sourceType)
                    }}
                  >
                    {getSourceTypeLabel(item.sourceType)}
                  </span>
                </td>
                <td className="p-3 text-center text-sm">
                  {item.nextDelivery
                    ? item.nextDelivery.toLocaleDateString()
                    : <span className="text-gray-400">Not scheduled</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-2">
      {riskAlerts.map(alert => (
        <div
          key={alert.id}
          className={`bg-white border border-gray-200 rounded-lg p-3 border-l-4 ${
            alert.acknowledged ? 'opacity-60' : ''
          }`}
          style={{ borderLeftColor: getRiskColor(alert.severity) }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                {alert.acknowledged && (
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Acknowledged</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
            </div>
            <span
              className="px-2 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: getRiskColor(alert.severity) }}
            >
              {alert.severity.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Affected Items</div>
              <div className="flex flex-wrap gap-1">
                {alert.affectedItems.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Recommended Action</div>
              <p className="text-sm text-gray-700">{alert.recommendedAction}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-xs text-gray-500">
              Created: {alert.createdAt.toLocaleDateString()} {alert.createdAt.toLocaleTimeString()}
            </span>
            {!alert.acknowledged && (
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                Acknowledge
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Supply Chain Risk Dashboard</h2>
          <p className="text-sm text-gray-600">Monitor supply chain vulnerabilities and buffer stock levels</p>
        </div>
        <div className="flex gap-2">
          {(['overview', 'suppliers', 'inventory', 'alerts'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'overview' && renderOverview()}
      {activeView === 'suppliers' && renderSuppliers()}
      {activeView === 'inventory' && renderInventory()}
      {activeView === 'alerts' && renderAlerts()}
    </div>
  );
};

export default SupplyChainRiskDashboard;
