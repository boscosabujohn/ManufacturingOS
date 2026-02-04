'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3, AlertTriangle, CheckCircle, Activity, Download } from 'lucide-react';

export interface ForecastPeriod {
  date: string;
  expectedInflows: number;
  expectedOutflows: number;
  netCashFlow: number;
  projectedBalance: number;
  confidence: number; // 0-100
}

export interface CashDriver {
  id: string;
  name: string;
  category: 'inflow' | 'outflow';
  historicalAverage: number;
  projected: number;
  variance: number;
  impact: 'high' | 'medium' | 'low';
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'best' | 'base' | 'worst';
  endingBalance: number;
  probability: number;
}

export interface PredictiveCashForecastingData {
  forecast: ForecastPeriod[];
  drivers: CashDriver[];
  scenarios: Scenario[];
  currentBalance: number;
  horizon: 'weekly' | 'monthly' | 'quarterly';
}

export interface PredictiveCashForecastingProps {
  data?: PredictiveCashForecastingData;
  onRefresh?: () => void;
  onExport?: (format: 'excel' | 'pdf') => void;
}

export default function PredictiveCashForecasting({ data, onRefresh, onExport }: PredictiveCashForecastingProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'drivers' | 'scenarios'>('forecast');

  const formatCurrency = (amount: number, compact = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: compact ? 0 : 2,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short'
    }).format(amount);
  };

  const getImpactBadge = (impact: CashDriver['impact']) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[impact]}`}>{impact.toUpperCase()}</span>;
  };

  const getScenarioIcon = (type: Scenario['type']) => {
    return type === 'best' ? <TrendingUp className="w-5 h-5" /> : type === 'worst' ? <TrendingDown className="w-5 h-5" /> : <Activity className="w-5 h-5" />;
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Predictive Cash Forecasting
          </h2>
          <p className="text-sm text-gray-600 mt-1">AI-powered cash flow predictions and scenario analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-md">
            <Activity className="w-4 h-4" />
            Refresh Forecast
          </button>
          <button onClick={() => onExport?.('excel')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
          <p className="text-xs font-medium text-blue-600 uppercase">Current Balance</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(data?.currentBalance || 0, true)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
          <p className="text-xs font-medium text-green-600 uppercase">30-Day Projection</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(data?.forecast[29]?.projectedBalance || 0, true)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
          <p className="text-xs font-medium text-purple-600 uppercase">Avg Confidence</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{((data?.forecast.reduce((sum, f) => sum + f.confidence, 0) || 0) / (data?.forecast.length || 1)).toFixed(1)}%</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
          <p className="text-xs font-medium text-orange-600 uppercase">Net Change</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {formatCurrency((data?.forecast[data.forecast.length - 1]?.projectedBalance || 0) - (data?.currentBalance || 0), true)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {[
            { id: 'forecast', label: 'Cash Forecast', icon: TrendingUp },
            { id: 'drivers', label: 'Key Drivers', icon: Activity },
            { id: 'scenarios', label: 'Scenarios', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Period</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Expected Inflows</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Expected Outflows</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Net Cash Flow</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Projected Balance</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.forecast.slice(0, 12).map((period, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">{new Date(period.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-green-600">{formatCurrency(period.expectedInflows)}</td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-red-600">{formatCurrency(period.expectedOutflows)}</td>
                    <td className="px-3 py-2 text-right text-sm font-bold">
                      <span className={period.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>{period.netCashFlow >= 0 ? '+' : ''}{formatCurrency(period.netCashFlow)}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-gray-900">{formatCurrency(period.projectedBalance)}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${period.confidence >= 80 ? 'bg-green-500' : period.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${period.confidence}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{period.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Historical Avg</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Projected</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Variance</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">{driver.name}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${driver.category === 'inflow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{driver.category.toUpperCase()}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-gray-900">{formatCurrency(driver.historicalAverage)}</td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-gray-900">{formatCurrency(driver.projected)}</td>
                    <td className="px-3 py-2 text-right text-sm font-semibold">
                      <span className={driver.variance >= 0 ? 'text-green-600' : 'text-red-600'}>{driver.variance >= 0 ? '+' : ''}{driver.variance.toFixed(1)}%</span>
                    </td>
                    <td className="px-3 py-2 text-center">{getImpactBadge(driver.impact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data?.scenarios.map((scenario) => (
            <div key={scenario.id} className={`border-2 rounded-lg p-3 ${scenario.type === 'best' ? 'border-green-300 bg-green-50' : scenario.type === 'worst' ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-full ${scenario.type === 'best' ? 'bg-green-200' : scenario.type === 'worst' ? 'bg-red-200' : 'bg-blue-200'}`}>
                  {getScenarioIcon(scenario.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
                  <p className="text-xs text-gray-600">{scenario.probability}% probability</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{scenario.description}</p>
              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600 uppercase font-medium">Ending Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(scenario.endingBalance, true)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
