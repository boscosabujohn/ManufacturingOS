'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Package,
  DollarSign,
  Clock,
  Percent,
} from 'lucide-react';

export interface HistoricalProject {
  id: string;
  name: string;
  completedDate: string;
  estimatedCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  duration: number;
  category: string;
  accuracy: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface BenchmarkMetrics {
  averageAccuracy: number;
  totalProjects: number;
  onBudgetProjects: number;
  overBudgetProjects: number;
  underBudgetProjects: number;
  avgVariancePercent: number;
  bestAccuracy: number;
  worstAccuracy: number;
}

export interface HistoricalBenchmarkingProps {
  currentEstimate: {
    id: string;
    name: string;
    estimatedCost: number;
    category: string;
  };
  similarProjects: HistoricalProject[];
  metrics: BenchmarkMetrics;
  className?: string;
}

export const HistoricalBenchmarking: React.FC<HistoricalBenchmarkingProps> = ({
  currentEstimate,
  similarProjects,
  metrics,
  className = '',
}) => {
  const getAccuracyConfig = (accuracy: string) => {
    switch (accuracy) {
      case 'excellent':
        return { color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent (±5%)' };
      case 'good':
        return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good (±10%)' };
      case 'fair':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Fair (±20%)' };
      case 'poor':
        return { color: 'text-red-600', bg: 'bg-red-50', label: 'Poor (>20%)' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown' };
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Estimate */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white">
        <h3 className="text-xl font-bold mb-2">Current Estimate</h3>
        <p className="text-3xl font-bold mb-1">{currentEstimate.name}</p>
        <p className="text-xl">${currentEstimate.estimatedCost.toLocaleString()}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-gray-600 mb-1">Average Accuracy</p>
          <p className="text-2xl font-bold text-blue-600">{metrics.averageAccuracy.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-gray-600 mb-1">On Budget</p>
          <p className="text-2xl font-bold text-green-600">{metrics.onBudgetProjects}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-gray-600 mb-1">Over Budget</p>
          <p className="text-2xl font-bold text-red-600">{metrics.overBudgetProjects}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-gray-600 mb-1">Avg Variance</p>
          <p className="text-2xl font-bold text-orange-600">{metrics.avgVariancePercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Similar Projects */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Similar Historical Projects</h3>
        <div className="space-y-3">
          {similarProjects.map((project) => {
            const accuracyConfig = getAccuracyConfig(project.accuracy);
            return (
              <div key={project.id} className="border-2 border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">Completed: {new Date(project.completedDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accuracyConfig.bg} ${accuracyConfig.color}`}>
                    {accuracyConfig.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Estimated</p>
                    <p className="text-sm font-bold">${project.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Actual</p>
                    <p className="text-sm font-bold">${project.actualCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Variance</p>
                    <p className={`text-sm font-bold ${project.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {project.variance > 0 ? '+' : ''}${project.variance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Variance %</p>
                    <p className={`text-sm font-bold ${project.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {project.variancePercent > 0 ? '+' : ''}{project.variancePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
