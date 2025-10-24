'use client';

import React from 'react';
import { TrendingDown, DollarSign, Target, Award, TrendingUp } from 'lucide-react';

export type SavingsType = 'cost-reduction' | 'cost-avoidance' | 'process-improvement' | 'demand-management';
export type SavingsStatus = 'realized' | 'projected' | 'at-risk';

export interface SavingsInitiative {
  id: string;
  initiative: string;
  type: SavingsType;
  category: string;
  owner: string;
  status: SavingsStatus;
  targetSavings: number;
  realizedSavings: number;
  achievementPercent: number;
  startDate: string;
  endDate: string;
  supplier?: string;
}

const SavingsTracking: React.FC = () => {
  // Mock data - Savings initiatives
  const initiatives: SavingsInitiative[] = [
    {
      id: 'SAV001',
      initiative: 'Steel Raw Materials - Competitive Bidding',
      type: 'cost-reduction',
      category: 'Raw Materials',
      owner: 'Sarah Johnson',
      status: 'realized',
      targetSavings: 220000,
      realizedSavings: 245000,
      achievementPercent: 111,
      startDate: '2025-01-15',
      endDate: '2025-10-15',
      supplier: 'Quality Steel Industries',
    },
    {
      id: 'SAV002',
      initiative: 'IT Services Contract Renegotiation',
      type: 'cost-reduction',
      category: 'IT Services',
      owner: 'Michael Chen',
      status: 'realized',
      targetSavings: 150000,
      realizedSavings: 165000,
      achievementPercent: 110,
      startDate: '2025-03-01',
      endDate: '2025-09-01',
      supplier: 'Tech Solutions Inc.',
    },
    {
      id: 'SAV003',
      initiative: 'Logistics Route Optimization',
      type: 'process-improvement',
      category: 'Transportation',
      owner: 'Emily Davis',
      status: 'projected',
      targetSavings: 180000,
      realizedSavings: 125000,
      achievementPercent: 69,
      startDate: '2025-06-01',
      endDate: '2025-12-31',
    },
    {
      id: 'SAV004',
      initiative: 'Supplier Consolidation - Electronic Components',
      type: 'cost-avoidance',
      category: 'Electronic Components',
      owner: 'Robert Wilson',
      status: 'realized',
      targetSavings: 125000,
      realizedSavings: 132000,
      achievementPercent: 106,
      startDate: '2025-02-01',
      endDate: '2025-08-01',
      supplier: 'Global Components Ltd.',
    },
    {
      id: 'SAV005',
      initiative: 'Packaging Materials - Demand Management',
      type: 'demand-management',
      category: 'Packaging',
      owner: 'Lisa Anderson',
      status: 'projected',
      targetSavings: 95000,
      realizedSavings: 42000,
      achievementPercent: 44,
      startDate: '2025-07-01',
      endDate: '2025-12-31',
    },
    {
      id: 'SAV006',
      initiative: 'Payment Terms Optimization',
      type: 'cost-avoidance',
      category: 'Financial',
      owner: 'David Lee',
      status: 'at-risk',
      targetSavings: 200000,
      realizedSavings: 85000,
      achievementPercent: 43,
      startDate: '2025-04-01',
      endDate: '2025-10-31',
    },
    {
      id: 'SAV007',
      initiative: 'Blanket PO Implementation - Machined Parts',
      type: 'process-improvement',
      category: 'Machined Parts',
      owner: 'Sarah Johnson',
      status: 'realized',
      targetSavings: 75000,
      realizedSavings: 82000,
      achievementPercent: 109,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      supplier: 'Precision Parts Manufacturing',
    },
  ];

  const totalTargetSavings = initiatives.reduce((sum, i) => sum + i.targetSavings, 0);
  const totalRealizedSavings = initiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
  const overallAchievement = (totalRealizedSavings / totalTargetSavings) * 100;

  const getSavingsStatusColor = (status: SavingsStatus): string => {
    switch (status) {
      case 'realized': return 'bg-green-100 text-green-800';
      case 'projected': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSavingsTypeColor = (type: SavingsType): string => {
    switch (type) {
      case 'cost-reduction': return 'bg-purple-100 text-purple-800';
      case 'cost-avoidance': return 'bg-blue-100 text-blue-800';
      case 'process-improvement': return 'bg-green-100 text-green-800';
      case 'demand-management': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (percent: number): string => {
    if (percent >= 100) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <TrendingDown className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Savings Tracking Dashboard</h2>
            <p className="text-blue-100">Monitor cost savings, avoidance, and process improvements</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Target Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalTargetSavings / 1000).toFixed(0)}K
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Realized Savings</p>
              <p className="text-2xl font-bold text-green-600">
                ${(totalRealizedSavings / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievement</p>
              <p className="text-2xl font-bold text-purple-600">
                {overallAchievement.toFixed(0)}%
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Initiatives</p>
              <p className="text-2xl font-bold text-gray-900">
                {initiatives.length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {initiatives.filter(i => i.status === 'at-risk').length}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Savings by Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings by Type</h3>
        <div className="space-y-3">
          {[
            { type: 'cost-reduction' as SavingsType, label: 'Cost Reduction' },
            { type: 'cost-avoidance' as SavingsType, label: 'Cost Avoidance' },
            { type: 'process-improvement' as SavingsType, label: 'Process Improvement' },
            { type: 'demand-management' as SavingsType, label: 'Demand Management' },
          ].map((category) => {
            const categoryInitiatives = initiatives.filter(i => i.type === category.type);
            const categoryTotal = categoryInitiatives.reduce((sum, i) => sum + i.realizedSavings, 0);
            return (
              <div key={category.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{category.label}</span>
                  <span className="text-sm font-semibold text-gray-900">${(categoryTotal / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${category.type === 'cost-reduction' ? 'bg-purple-500' : category.type === 'cost-avoidance' ? 'bg-blue-500' : category.type === 'process-improvement' ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(categoryTotal / totalRealizedSavings) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Savings Initiatives</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Initiative</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Realized</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Achievement</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Period</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initiatives.map((initiative) => (
                <tr key={initiative.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{initiative.initiative}</div>
                    {initiative.supplier && (
                      <div className="text-xs text-gray-500">Supplier: {initiative.supplier}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsTypeColor(initiative.type)}`}>
                      {initiative.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{initiative.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{initiative.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSavingsStatusColor(initiative.status)}`}>
                      {initiative.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(initiative.targetSavings / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${(initiative.realizedSavings / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            initiative.achievementPercent >= 100 ? 'bg-green-500' :
                            initiative.achievementPercent >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(initiative.achievementPercent, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${getAchievementColor(initiative.achievementPercent)}`}>
                        {initiative.achievementPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{initiative.startDate}</div>
                    <div className="text-xs">to {initiative.endDate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsTracking;
