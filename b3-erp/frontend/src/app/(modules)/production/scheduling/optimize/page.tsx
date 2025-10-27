'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  IndianRupee,
  Calendar,
  Target,
  Play,
  BarChart3,
  Settings,
  CheckCircle2
} from 'lucide-react';

interface OptimizationScenario {
  id: string;
  scenarioName: string;
  objective: string;
  algorithm: string;
  status: 'ready' | 'running' | 'completed';
  currentMetrics: Metrics;
  optimizedMetrics: Metrics;
  improvements: Improvements;
  parameters: OptimizationParameter[];
}

interface Metrics {
  totalDuration: number;
  totalSetupTime: number;
  totalCost: number;
  resourceUtilization: number;
  onTimeDelivery: number;
}

interface Improvements {
  durationReduction: number;
  setupTimeReduction: number;
  costSavings: number;
  utilizationIncrease: number;
  deliveryImprovement: number;
}

interface OptimizationParameter {
  name: string;
  value: number;
  unit: string;
}

export default function ScheduleOptimizationPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string>('1');

  const scenarios: OptimizationScenario[] = [
    {
      id: '1',
      scenarioName: 'Minimize Total Duration',
      objective: 'Reduce overall production time',
      algorithm: 'Critical Path Method (CPM)',
      status: 'completed',
      currentMetrics: {
        totalDuration: 45,
        totalSetupTime: 28,
        totalCost: 2850000,
        resourceUtilization: 78.5,
        onTimeDelivery: 82.0
      },
      optimizedMetrics: {
        totalDuration: 38,
        totalSetupTime: 22,
        totalCost: 2920000,
        resourceUtilization: 89.2,
        onTimeDelivery: 94.0
      },
      improvements: {
        durationReduction: 15.6,
        setupTimeReduction: 21.4,
        costSavings: -70000,
        utilizationIncrease: 10.7,
        deliveryImprovement: 12.0
      },
      parameters: [
        { name: 'Parallel Processing', value: 85, unit: '%' },
        { name: 'Buffer Time', value: 2, unit: 'days' }
      ]
    },
    {
      id: '2',
      scenarioName: 'Minimize Setup Costs',
      objective: 'Reduce machine setup and changeover costs',
      algorithm: 'Genetic Algorithm',
      status: 'completed',
      currentMetrics: {
        totalDuration: 45,
        totalSetupTime: 28,
        totalCost: 2850000,
        resourceUtilization: 78.5,
        onTimeDelivery: 82.0
      },
      optimizedMetrics: {
        totalDuration: 42,
        totalSetupTime: 18,
        totalCost: 2650000,
        resourceUtilization: 82.8,
        onTimeDelivery: 88.0
      },
      improvements: {
        durationReduction: 6.7,
        setupTimeReduction: 35.7,
        costSavings: 200000,
        utilizationIncrease: 4.3,
        deliveryImprovement: 6.0
      },
      parameters: [
        { name: 'Similar Product Batching', value: 90, unit: '%' },
        { name: 'Setup Sequence Optimization', value: 95, unit: '%' }
      ]
    },
    {
      id: '3',
      scenarioName: 'Maximize Resource Utilization',
      objective: 'Optimize labor and equipment usage',
      algorithm: 'Linear Programming',
      status: 'completed',
      currentMetrics: {
        totalDuration: 45,
        totalSetupTime: 28,
        totalCost: 2850000,
        resourceUtilization: 78.5,
        onTimeDelivery: 82.0
      },
      optimizedMetrics: {
        totalDuration: 43,
        totalSetupTime: 26,
        totalCost: 2750000,
        resourceUtilization: 94.5,
        onTimeDelivery: 85.0
      },
      improvements: {
        durationReduction: 4.4,
        setupTimeReduction: 7.1,
        costSavings: 100000,
        utilizationIncrease: 16.0,
        deliveryImprovement: 3.0
      },
      parameters: [
        { name: 'Load Balancing', value: 92, unit: '%' },
        { name: 'Shift Optimization', value: 88, unit: '%' }
      ]
    },
    {
      id: '4',
      scenarioName: 'Maximize On-Time Delivery',
      objective: 'Prioritize meeting customer deadlines',
      algorithm: 'Earliest Due Date (EDD)',
      status: 'ready',
      currentMetrics: {
        totalDuration: 45,
        totalSetupTime: 28,
        totalCost: 2850000,
        resourceUtilization: 78.5,
        onTimeDelivery: 82.0
      },
      optimizedMetrics: {
        totalDuration: 46,
        totalSetupTime: 30,
        totalCost: 2900000,
        resourceUtilization: 76.2,
        onTimeDelivery: 98.0
      },
      improvements: {
        durationReduction: -2.2,
        setupTimeReduction: -7.1,
        costSavings: -50000,
        utilizationIncrease: -2.3,
        deliveryImprovement: 16.0
      },
      parameters: [
        { name: 'Priority Weighting', value: 100, unit: '%' },
        { name: 'Safety Buffer', value: 3, unit: 'days' }
      ]
    },
    {
      id: '5',
      scenarioName: 'Balanced Multi-Objective',
      objective: 'Optimize across all metrics',
      algorithm: 'Multi-Objective Optimization',
      status: 'running',
      currentMetrics: {
        totalDuration: 45,
        totalSetupTime: 28,
        totalCost: 2850000,
        resourceUtilization: 78.5,
        onTimeDelivery: 82.0
      },
      optimizedMetrics: {
        totalDuration: 40,
        totalSetupTime: 23,
        totalCost: 2750000,
        resourceUtilization: 86.8,
        onTimeDelivery: 91.0
      },
      improvements: {
        durationReduction: 11.1,
        setupTimeReduction: 17.9,
        costSavings: 100000,
        utilizationIncrease: 8.3,
        deliveryImprovement: 9.0
      },
      parameters: [
        { name: 'Time Weight', value: 35, unit: '%' },
        { name: 'Cost Weight', value: 30, unit: '%' },
        { name: 'Quality Weight', value: 35, unit: '%' }
      ]
    }
  ];

  const selected = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  const getImprovementColor = (value: number) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getImprovementIcon = (value: number) => {
    return value > 0 ? TrendingUp : value < 0 ? TrendingDown : Clock;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Optimization</h1>
            <p className="text-sm text-gray-600">AI-powered production schedule optimization</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          <Play className="h-4 w-4" />
          Run Optimization
        </button>
      </div>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedScenario === scenario.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {scenario.status === 'completed' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : scenario.status === 'running' ? (
                <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-700">{scenario.status}</span>
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{scenario.scenarioName}</h3>
            <p className="text-xs text-gray-600">{scenario.algorithm}</p>
          </button>
        ))}
      </div>

      {/* Selected Scenario Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-6 w-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.scenarioName}</h2>
            <p className="text-sm text-gray-600">{selected.objective}</p>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Current State */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">Total Duration</span>
                <span className="font-semibold text-gray-900">{selected.currentMetrics.totalDuration} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">Setup Time</span>
                <span className="font-semibold text-gray-900">{selected.currentMetrics.setupTime}h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">Total Cost</span>
                <span className="font-semibold text-gray-900">₹{(selected.currentMetrics.totalCost / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">Utilization</span>
                <span className="font-semibold text-gray-900">{selected.currentMetrics.resourceUtilization.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">On-Time Delivery</span>
                <span className="font-semibold text-gray-900">{selected.currentMetrics.onTimeDelivery.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Optimized State */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Optimized Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Total Duration</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">{selected.optimizedMetrics.totalDuration} days</span>
                  {React.createElement(getImprovementIcon(selected.improvements.durationReduction), {
                    className: `h-4 w-4 ${getImprovementColor(selected.improvements.durationReduction)}`
                  })}
                  <span className={`text-xs font-medium ${getImprovementColor(selected.improvements.durationReduction)}`}>
                    {selected.improvements.durationReduction > 0 ? '-' : '+'}{Math.abs(selected.improvements.durationReduction).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Setup Time</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">{selected.optimizedMetrics.setupTime}h</span>
                  {React.createElement(getImprovementIcon(selected.improvements.setupTimeReduction), {
                    className: `h-4 w-4 ${getImprovementColor(selected.improvements.setupTimeReduction)}`
                  })}
                  <span className={`text-xs font-medium ${getImprovementColor(selected.improvements.setupTimeReduction)}`}>
                    {selected.improvements.setupTimeReduction > 0 ? '-' : '+'}{Math.abs(selected.improvements.setupTimeReduction).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Total Cost</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">₹{(selected.optimizedMetrics.totalCost / 100000).toFixed(1)}L</span>
                  <IndianRupee className={`h-4 w-4 ${getImprovementColor(selected.improvements.costSavings)}`} />
                  <span className={`text-xs font-medium ${getImprovementColor(selected.improvements.costSavings)}`}>
                    {selected.improvements.costSavings > 0 ? '-' : ''}₹{Math.abs(selected.improvements.costSavings / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Utilization</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">{selected.optimizedMetrics.resourceUtilization.toFixed(1)}%</span>
                  {React.createElement(getImprovementIcon(selected.improvements.utilizationIncrease), {
                    className: `h-4 w-4 ${getImprovementColor(selected.improvements.utilizationIncrease)}`
                  })}
                  <span className={`text-xs font-medium ${getImprovementColor(selected.improvements.utilizationIncrease)}`}>
                    {selected.improvements.utilizationIncrease > 0 ? '+' : ''}{selected.improvements.utilizationIncrease.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">On-Time Delivery</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">{selected.optimizedMetrics.onTimeDelivery.toFixed(1)}%</span>
                  {React.createElement(getImprovementIcon(selected.improvements.deliveryImprovement), {
                    className: `h-4 w-4 ${getImprovementColor(selected.improvements.deliveryImprovement)}`
                  })}
                  <span className={`text-xs font-medium ${getImprovementColor(selected.improvements.deliveryImprovement)}`}>
                    {selected.improvements.deliveryImprovement > 0 ? '+' : ''}{selected.improvements.deliveryImprovement.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Optimization Parameters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selected.parameters.map((param, idx) => (
              <div key={idx} className="p-3 bg-purple-50 rounded">
                <div className="text-xs text-purple-700 mb-1">{param.name}</div>
                <div className="text-lg font-bold text-purple-900">{param.value}{param.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          <BarChart3 className="h-4 w-4" />
          View Details
        </button>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <CheckCircle2 className="h-4 w-4" />
          Apply Optimization
        </button>
      </div>
    </div>
  );
}
