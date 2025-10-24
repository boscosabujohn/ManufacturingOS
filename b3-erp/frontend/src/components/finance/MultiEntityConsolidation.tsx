'use client';

import React, { useState } from 'react';
import {
  Building2,
  Globe,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calculator
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Entity {
  id: string;
  name: string;
  code: string;
  country: string;
  currency: string;
  ownershipPercentage: number;
  consolidationMethod: 'full' | 'proportional' | 'equity';
  isActive: boolean;
}

export interface FinancialStatement {
  entityId: string;
  revenue: number;
  expenses: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  cashFlow: number;
}

export interface IntercompanyTransaction {
  id: string;
  fromEntity: string;
  toEntity: string;
  type: 'sale' | 'purchase' | 'loan' | 'dividend' | 'transfer';
  amount: number;
  currency: string;
  date: string;
  description: string;
  eliminated: boolean;
}

export interface ConsolidationAdjustment {
  id: string;
  type: 'elimination' | 'currency' | 'minority_interest' | 'fair_value' | 'other';
  description: string;
  amount: number;
  affectedEntities: string[];
  status: 'draft' | 'posted' | 'reversed';
}

export interface ConsolidationResult {
  revenue: number;
  expenses: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  minorityInterest: number;
  eliminations: {
    revenue: number;
    expenses: number;
    assets: number;
    liabilities: number;
  };
}

export interface MultiEntityConsolidationData {
  entities: Entity[];
  statements: FinancialStatement[];
  intercompanyTransactions: IntercompanyTransaction[];
  adjustments: ConsolidationAdjustment[];
  consolidatedResult: ConsolidationResult;
  period: string;
  currency: string;
}

// ============================================================================
// PROPS
// ============================================================================

export interface MultiEntityConsolidationProps {
  data?: MultiEntityConsolidationData;
  onRunConsolidation?: () => void;
  onAddAdjustment?: (adjustment: Partial<ConsolidationAdjustment>) => void;
  onExport?: (format: 'excel' | 'pdf') => void;
  editable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function MultiEntityConsolidation({
  data,
  onRunConsolidation,
  onAddAdjustment,
  onExport,
  editable = false
}: MultiEntityConsolidationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'entities' | 'intercompany' | 'adjustments'>('overview');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [showEliminationDetails, setShowEliminationDetails] = useState(false);

  const formatCurrency = (amount: number, compact = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: data?.currency || 'INR',
      minimumFractionDigits: compact ? 0 : 2,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short'
    }).format(amount);
  };

  const getConsolidationMethodBadge = (method: Entity['consolidationMethod']) => {
    const styles = {
      full: 'bg-blue-100 text-blue-700 border-blue-200',
      proportional: 'bg-purple-100 text-purple-700 border-purple-200',
      equity: 'bg-green-100 text-green-700 border-green-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[method]}`}>
        {method.toUpperCase()}
      </span>
    );
  };

  const getTransactionTypeBadge = (type: IntercompanyTransaction['type']) => {
    const styles = {
      sale: 'bg-green-100 text-green-700',
      purchase: 'bg-blue-100 text-blue-700',
      loan: 'bg-purple-100 text-purple-700',
      dividend: 'bg-orange-100 text-orange-700',
      transfer: 'bg-gray-100 text-gray-700'
    };

    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>{type}</span>;
  };

  // Calculate entity contribution percentages
  const totalRevenue = data?.statements.reduce((sum, s) => sum + s.revenue, 0) || 1;
  const totalAssets = data?.statements.reduce((sum, s) => sum + s.assets, 0) || 1;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-7 h-7 text-indigo-600" />
            Multi-Entity Consolidation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Period: {data?.period || 'January 2025'} | Reporting Currency: {data?.currency || 'INR'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editable && (
            <button
              onClick={onRunConsolidation}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Run Consolidation
            </button>
          )}
          <button
            onClick={() => onExport?.('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Consolidated KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-10 h-10 text-green-600 opacity-80" />
            <div className="text-right">
              <p className="text-xs font-medium text-green-600 uppercase">Consolidated Revenue</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {formatCurrency(data?.consolidatedResult.revenue || 0, true)}
              </p>
            </div>
          </div>
          <div className="text-xs text-green-600">
            After eliminations: {formatCurrency(data?.consolidatedResult.eliminations.revenue || 0, true)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <Building2 className="w-10 h-10 text-blue-600 opacity-80" />
            <div className="text-right">
              <p className="text-xs font-medium text-blue-600 uppercase">Total Assets</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(data?.consolidatedResult.assets || 0, true)}
              </p>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            After eliminations: {formatCurrency(data?.consolidatedResult.eliminations.assets || 0, true)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-10 h-10 text-purple-600 opacity-80" />
            <div className="text-right">
              <p className="text-xs font-medium text-purple-600 uppercase">Net Income</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(data?.consolidatedResult.netIncome || 0, true)}
              </p>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            Margin: {((((data?.consolidatedResult.netIncome || 0) / (data?.consolidatedResult.revenue || 1)) * 100)).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <PieChart className="w-10 h-10 text-orange-600 opacity-80" />
            <div className="text-right">
              <p className="text-xs font-medium text-orange-600 uppercase">Total Equity</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {formatCurrency(data?.consolidatedResult.equity || 0, true)}
              </p>
            </div>
          </div>
          <div className="text-xs text-orange-600">
            Minority interest: {formatCurrency(data?.consolidatedResult.minorityInterest || 0, true)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Consolidation Overview', icon: BarChart3 },
            { id: 'entities', label: 'Entity Breakdown', icon: Building2 },
            { id: 'intercompany', label: 'Intercompany Transactions', icon: RefreshCw },
            { id: 'adjustments', label: 'Adjustments', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Consolidated Income Statement */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold text-gray-900">Consolidated Income Statement</h3>
            </div>
            <div className="p-6">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">Revenue</td>
                    <td className="py-3 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(data?.consolidatedResult.revenue || 0)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">Less: Expenses</td>
                    <td className="py-3 text-right text-sm font-bold text-red-600">
                      ({formatCurrency(data?.consolidatedResult.expenses || 0)})
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-blue-50">
                    <td className="py-3 text-sm font-semibold text-blue-900">Gross Profit</td>
                    <td className="py-3 text-right text-sm font-bold text-blue-900">
                      {formatCurrency(data?.consolidatedResult.grossProfit || 0)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-purple-50">
                    <td className="py-3 text-sm font-semibold text-purple-900">Operating Income</td>
                    <td className="py-3 text-right text-sm font-bold text-purple-900">
                      {formatCurrency(data?.consolidatedResult.operatingIncome || 0)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50 border-t-2 border-green-600">
                    <td className="py-3 text-sm font-bold text-green-900">Net Income</td>
                    <td className="py-3 text-right text-sm font-bold text-green-900">
                      {formatCurrency(data?.consolidatedResult.netIncome || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Consolidated Balance Sheet */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900">Consolidated Balance Sheet</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-4">Assets</h4>
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">Total Assets</td>
                        <td className="py-3 text-right text-sm font-bold text-blue-900">
                          {formatCurrency(data?.consolidatedResult.assets || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-4">Liabilities & Equity</h4>
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">Liabilities</td>
                        <td className="py-3 text-right text-sm font-bold text-red-600">
                          {formatCurrency(data?.consolidatedResult.liabilities || 0)}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">Equity</td>
                        <td className="py-3 text-right text-sm font-bold text-green-600">
                          {formatCurrency(data?.consolidatedResult.equity || 0)}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">Minority Interest</td>
                        <td className="py-3 text-right text-sm font-bold text-orange-600">
                          {formatCurrency(data?.consolidatedResult.minorityInterest || 0)}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 bg-blue-50 border-t-2 border-blue-600">
                        <td className="py-3 text-sm font-bold text-blue-900">Total L & E</td>
                        <td className="py-3 text-right text-sm font-bold text-blue-900">
                          {formatCurrency((data?.consolidatedResult.liabilities || 0) + (data?.consolidatedResult.equity || 0) + (data?.consolidatedResult.minorityInterest || 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Elimination Summary */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Elimination Adjustments</h3>
                <button
                  onClick={() => setShowEliminationDetails(!showEliminationDetails)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  {showEliminationDetails ? 'Hide' : 'Show'} Details
                  <ChevronRight className={`w-4 h-4 transition-transform ${showEliminationDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs font-medium text-red-600 uppercase">Revenue Eliminations</p>
                  <p className="text-lg font-bold text-red-900 mt-2">
                    {formatCurrency(data?.consolidatedResult.eliminations.revenue || 0, true)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-600 uppercase">Expense Eliminations</p>
                  <p className="text-lg font-bold text-green-900 mt-2">
                    {formatCurrency(data?.consolidatedResult.eliminations.expenses || 0, true)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 uppercase">Asset Eliminations</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">
                    {formatCurrency(data?.consolidatedResult.eliminations.assets || 0, true)}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-medium text-purple-600 uppercase">Liability Eliminations</p>
                  <p className="text-lg font-bold text-purple-900 mt-2">
                    {formatCurrency(data?.consolidatedResult.eliminations.liabilities || 0, true)}
                  </p>
                </div>
              </div>

              {showEliminationDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Eliminations remove intercompany transactions to prevent double-counting in consolidated statements.
                    These adjustments ensure accurate group-level financial reporting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entities Tab */}
      {activeTab === 'entities' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ownership %</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Method</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Assets</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Net Income</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.entities.map((entity) => {
                  const statement = data.statements.find((s) => s.entityId === entity.id);
                  const revenueContribution = ((statement?.revenue || 0) / totalRevenue) * 100;

                  return (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{entity.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{entity.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entity.country}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900">{entity.ownershipPercentage}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">{getConsolidationMethodBadge(entity.consolidationMethod)}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(statement?.revenue || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(statement?.assets || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                        {formatCurrency(statement?.netIncome || 0)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600"
                              style={{ width: `${revenueContribution}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{revenueContribution.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Intercompany Tab */}
      {activeTab === 'intercompany' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Intercompany Transactions</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {data?.intercompanyTransactions.filter((t) => t.eliminated).length} / {data?.intercompanyTransactions.length} eliminated
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">From Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">To Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.intercompanyTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(txn.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn.fromEntity}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn.toEntity}</td>
                    <td className="px-6 py-4">{getTransactionTypeBadge(txn.type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{txn.description}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {txn.eliminated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Eliminated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjustments Tab */}
      {activeTab === 'adjustments' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Consolidation Adjustments</h3>
              {editable && (
                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <Calculator className="w-4 h-4" />
                  Add Adjustment
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Affected Entities</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.adjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        {adj.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">{adj.description}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(adj.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {adj.affectedEntities.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          adj.status === 'posted'
                            ? 'bg-green-100 text-green-700'
                            : adj.status === 'draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {adj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
