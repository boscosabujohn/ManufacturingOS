'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Percent,
  Sliders,
  Play,
  RefreshCw,
} from 'lucide-react';

export interface SimulationVariable {
  id: string;
  name: string;
  category: string;
  baseValue: number;
  currentValue: number;
  min: number;
  max: number;
  unit: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  variables: { variableId: string; value: number }[];
  totalCost: number;
  margin: number;
  suggestedPrice: number;
  variance: number;
  variancePercent: number;
}

export interface WhatIfSimulationProps {
  baseEstimate: {
    id: string;
    name: string;
    totalCost: number;
    margin: number;
    suggestedPrice: number;
  };
  variables: SimulationVariable[];
  scenarios: SimulationScenario[];
  onRunSimulation?: (variables: SimulationVariable[]) => void;
  onSaveScenario?: (name: string, description: string) => void;
  onResetVariables?: () => void;
  className?: string;
}

export const WhatIfSimulation: React.FC<WhatIfSimulationProps> = ({
  baseEstimate,
  variables: initialVariables,
  scenarios,
  onRunSimulation,
  onSaveScenario,
  onResetVariables,
  className = '',
}) => {
  const [variables, setVariables] = useState(initialVariables);
  const [activeTab, setActiveTab] = useState<'variables' | 'scenarios'>('variables');

  const updateVariable = (id: string, value: number) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, currentValue: value } : v)));
  };

  const calculateImpact = () => {
    const changed = variables.filter((v) => v.currentValue !== v.baseValue);
    const totalImpact = changed.reduce((sum, v) => {
      const change = ((v.currentValue - v.baseValue) / v.baseValue) * 100;
      return sum + change;
    }, 0);
    return totalImpact;
  };

  const impact = calculateImpact();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Base Estimate */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Base Estimate</h3>
        <p className="text-2xl font-bold mb-1">{baseEstimate.name}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm opacity-90">Total Cost</p>
            <p className="text-xl font-bold">${baseEstimate.totalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Margin</p>
            <p className="text-xl font-bold">{baseEstimate.margin}%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Suggested Price</p>
            <p className="text-xl font-bold">${baseEstimate.suggestedPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      {impact !== 0 && (
        <div className={`rounded-lg p-4 ${impact > 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
          <div className="flex items-center space-x-3">
            {impact > 0 ? (
              <TrendingUp className="h-8 w-8 text-red-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-green-600" />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-700">Projected Impact</p>
              <p className={`text-2xl font-bold ${impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('variables')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'variables' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            Variables & Sliders
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'scenarios' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            Saved Scenarios ({scenarios.length})
          </button>
        </div>

        {/* Variables Tab */}
        {activeTab === 'variables' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Adjust Variables</h3>
              <div className="flex items-center space-x-2">
                {onResetVariables && (
                  <button
                    onClick={onResetVariables}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                )}
                {onRunSimulation && (
                  <button
                    onClick={() => onRunSimulation(variables)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Run Simulation</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {variables.map((variable) => {
                const isChanged = variable.currentValue !== variable.baseValue;
                const changePercent = ((variable.currentValue - variable.baseValue) / variable.baseValue) * 100;

                return (
                  <div key={variable.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{variable.name}</h4>
                        <p className="text-sm text-gray-600">{variable.category}</p>
                      </div>
                      {isChanged && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          changePercent > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Base: {variable.baseValue} {variable.unit}</span>
                        <span className={`font-bold ${isChanged ? 'text-blue-600' : 'text-gray-900'}`}>
                          Current: {variable.currentValue} {variable.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={variable.min}
                        max={variable.max}
                        value={variable.currentValue}
                        onChange={(e) => updateVariable(variable.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{variable.min}</span>
                        <span>{variable.max}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Scenarios</h3>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{scenario.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Cost</p>
                      <p className="text-sm font-bold">${scenario.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Margin</p>
                      <p className="text-sm font-bold text-green-600">{scenario.margin}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm font-bold">${scenario.suggestedPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">vs Base</p>
                      <p className={`text-sm font-bold ${scenario.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {scenario.variancePercent > 0 ? '+' : ''}{scenario.variancePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
