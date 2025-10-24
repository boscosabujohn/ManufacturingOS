'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Target, Filter, DollarSign } from 'lucide-react'

export interface PipelineStage {
  stage: string;
  opportunities: number;
  value: number;
  winRate: number;
  avgDealSize: number;
}

export default function PipelineAnalytics() {
  const [stages] = useState<PipelineStage[]>([
    { stage: 'Prospecting', opportunities: 45, value: 225000000, winRate: 15, avgDealSize: 5000000 },
    { stage: 'Qualification', opportunities: 34, value: 187000000, winRate: 30, avgDealSize: 5500000 },
    { stage: 'Proposal', opportunities: 22, value: 143000000, winRate: 50, avgDealSize: 6500000 },
    { stage: 'Negotiation', opportunities: 12, value: 84000000, winRate: 70, avgDealSize: 7000000 },
    { stage: 'Closed Won', opportunities: 8, value: 64000000, winRate: 100, avgDealSize: 8000000 }
  ]);

  const totalPipelineValue = stages.reduce((sum, s) => sum + s.value, 0);
  const weightedValue = stages.reduce((sum, s) => sum + (s.value * s.winRate / 100), 0);

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(1)}Cr`;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-indigo-600" />
          Pipeline Analytics
        </h2>
        <p className="text-gray-600 mt-1">Visualize sales pipeline and conversion funnel</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Pipeline Value</p>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{formatCurrency(totalPipelineValue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Weighted Pipeline</p>
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">{formatCurrency(weightedValue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Opportunities</p>
            <Filter className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900">{stages.reduce((sum, s) => sum + s.opportunities, 0)}</p>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Breakdown by Stage</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {stages.map((stage, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{stage.stage}</h4>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {stage.winRate}% Win Rate
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Opportunities</p>
                    <p className="text-2xl font-bold text-blue-900">{stage.opportunities}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Total Value</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(stage.value)}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Avg Deal Size</p>
                    <p className="text-lg font-bold text-purple-900">{formatCurrency(stage.avgDealSize)}</p>
                  </div>
                </div>

                {/* Visual Funnel */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(stage.opportunities / stages[0].opportunities) * 100}%` }}
                    >
                      <span className="text-xs text-white font-bold">{stage.opportunities}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
