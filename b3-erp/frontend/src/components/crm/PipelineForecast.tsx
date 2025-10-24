'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface ForecastPeriod {
  month: string;
  committed: number; // 75%+ probability
  bestCase: number; // 40%+ probability
  pipeline: number; // All opportunities
  closed: number;
  target: number;
  opportunities: number;
  aiPrediction?: {
    expectedRevenue: number;
    confidence: number;
    risk: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export interface ForecastScenario {
  name: string;
  probability: number;
  revenue: number;
  description: string;
}

export interface PipelineForecastProps {
  periods: ForecastPeriod[];
  scenarios?: ForecastScenario[];
  currentPeriodIndex?: number;
  showAIPredictions?: boolean;
  showScenarios?: boolean;
  onPeriodClick?: (period: ForecastPeriod, index: number) => void;
  className?: string;
}

export const PipelineForecast: React.FC<PipelineForecastProps> = ({
  periods,
  scenarios,
  currentPeriodIndex = 0,
  showAIPredictions = true,
  showScenarios = true,
  onPeriodClick,
  className = '',
}) => {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(currentPeriodIndex);
  const selectedPeriod = periods[selectedPeriodIndex];

  // Calculate summary stats
  const totalCommitted = periods.reduce((sum, p) => sum + p.committed, 0);
  const totalTarget = periods.reduce((sum, p) => sum + p.target, 0);
  const totalClosed = periods.reduce((sum, p) => sum + p.closed, 0);
  const avgAttainment =
    periods.reduce((sum, p) => sum + (p.committed + p.closed) / p.target, 0) / periods.length;

  const getAttainmentColor = (attainment: number) => {
    if (attainment >= 1) return 'text-green-600';
    if (attainment >= 0.75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttainmentBg = (attainment: number) => {
    if (attainment >= 1) return 'bg-green-500';
    if (attainment >= 0.75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handlePeriodClick = (period: ForecastPeriod, index: number) => {
    setSelectedPeriodIndex(index);
    if (onPeriodClick) {
      onPeriodClick(period, index);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-600">Total Committed</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">${(totalCommitted / 1000).toFixed(0)}K</p>
          <div className="mt-2 flex items-center">
            <div
              className={`text-sm font-semibold ${getAttainmentColor(totalCommitted / totalTarget)}`}
            >
              {((totalCommitted / totalTarget) * 100).toFixed(0)}% of target
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-600">Avg Attainment</p>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{(avgAttainment * 100).toFixed(0)}%</p>
          <div className="mt-2 flex items-center">
            {avgAttainment >= 1 ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">Across all periods</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-600">Total Target</p>
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">${(totalTarget / 1000).toFixed(0)}K</p>
          <div className="mt-2 text-sm text-purple-700">
            {periods.length} period{periods.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-emerald-600">Total Closed</p>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-900">${(totalClosed / 1000).toFixed(0)}K</p>
          <div className="mt-2 text-sm text-emerald-700">
            {((totalClosed / totalTarget) * 100).toFixed(0)}% achieved
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Forecast Timeline</h3>
          <p className="text-sm text-gray-600 mt-1">Click on a period to view detailed breakdown</p>
        </div>

        <div className="p-4 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {periods.map((period, index) => {
              const attainment = (period.committed + period.closed) / period.target;
              const isSelected = index === selectedPeriodIndex;

              return (
                <div
                  key={index}
                  onClick={() => handlePeriodClick(period, index)}
                  className={`flex-shrink-0 w-48 cursor-pointer rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 shadow-lg bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-gray-900">{period.month}</p>
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Target</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${(period.target / 1000).toFixed(0)}K
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-green-600">Committed</p>
                        <p className="text-sm font-bold text-green-700">
                          ${(period.committed / 1000).toFixed(0)}K
                        </p>
                      </div>

                      {period.closed > 0 && (
                        <div>
                          <p className="text-xs text-emerald-600">Closed</p>
                          <p className="text-sm font-bold text-emerald-700">
                            ${(period.closed / 1000).toFixed(0)}K
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Attainment Progress */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Attainment</span>
                        <span className={`text-xs font-bold ${getAttainmentColor(attainment)}`}>
                          {(attainment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${getAttainmentBg(attainment)}`}
                          style={{ width: `${Math.min(attainment * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        {period.opportunities} opportunit{period.opportunities === 1 ? 'y' : 'ies'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Period Detail */}
      {selectedPeriod && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Forecast Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{selectedPeriod.month} - Breakdown</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-600">Committed (75%+ prob)</p>
                  <p className="text-xs text-gray-600 mt-1">High confidence opportunities</p>
                </div>
                <p className="text-xl font-bold text-green-900">
                  ${(selectedPeriod.committed / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-blue-600">Best Case (40%+ prob)</p>
                  <p className="text-xs text-gray-600 mt-1">Moderate confidence opportunities</p>
                </div>
                <p className="text-xl font-bold text-blue-900">
                  ${(selectedPeriod.bestCase / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Pipeline</p>
                  <p className="text-xs text-gray-600 mt-1">All opportunities in pipeline</p>
                </div>
                <p className="text-xl font-bold text-purple-900">
                  ${(selectedPeriod.pipeline / 1000).toFixed(0)}K
                </p>
              </div>

              {selectedPeriod.closed > 0 && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Already Closed</p>
                    <p className="text-xs text-gray-600 mt-1">Won deals this period</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-900">
                    ${(selectedPeriod.closed / 1000).toFixed(0)}K
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-600">Target</p>
                  <p className="text-xs text-gray-600 mt-1">Goal for this period</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  ${(selectedPeriod.target / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          {/* AI Predictions */}
          {showAIPredictions && selectedPeriod.aiPrediction && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 overflow-hidden">
              <div className="p-4 border-b border-purple-200 bg-white bg-opacity-50">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">AI Forecast</h3>
                  <span className="ml-auto text-xs text-purple-700 font-medium">
                    {selectedPeriod.aiPrediction.confidence}% Confidence
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* Predicted Revenue */}
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-gray-600 mb-2">Predicted Revenue</p>
                  <p className="text-3xl font-bold text-purple-900">
                    ${(selectedPeriod.aiPrediction.expectedRevenue / 1000).toFixed(0)}K
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-600">vs Target</span>
                    <span
                      className={`text-sm font-bold ${getAttainmentColor(
                        selectedPeriod.aiPrediction.expectedRevenue / selectedPeriod.target
                      )}`}
                    >
                      {(
                        (selectedPeriod.aiPrediction.expectedRevenue / selectedPeriod.target) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Risk Assessment</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold border ${getRiskColor(
                        selectedPeriod.aiPrediction.risk
                      )}`}
                    >
                      {selectedPeriod.aiPrediction.risk.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                {/* Key Factors */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Factors</p>
                  <div className="space-y-2">
                    {selectedPeriod.aiPrediction.factors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 text-sm bg-white rounded p-2 border border-gray-200"
                      >
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Meter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Model Confidence</span>
                    <span className="text-xs font-bold text-purple-700">
                      {selectedPeriod.aiPrediction.confidence}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${selectedPeriod.aiPrediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenario Analysis */}
      {showScenarios && scenarios && scenarios.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Scenario Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Different forecast outcomes based on variables</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                    <BarChart3 className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    ${(scenario.revenue / 1000).toFixed(0)}K
                  </p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Probability</span>
                      <span className="text-xs font-bold text-gray-900">
                        {scenario.probability}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${scenario.probability}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{scenario.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
