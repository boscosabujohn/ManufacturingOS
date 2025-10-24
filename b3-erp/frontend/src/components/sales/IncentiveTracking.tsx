'use client'

import { useState } from 'react'
import { Award, DollarSign, TrendingUp, Target, Calendar } from 'lucide-react'

export interface SalesRep {
  id: string;
  name: string;
  territory: string;
  salesAmount: number;
  quota: number;
  achievement: number;
  baseCommission: number;
  bonuses: number;
  totalIncentive: number;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export default function IncentiveTracking() {
  const [salesReps] = useState<SalesRep[]>([
    { id: 'SR-001', name: 'Rajesh Kumar', territory: 'North Zone', salesAmount: 125000000, quota: 150000000, achievement: 83.3, baseCommission: 1250000, bonuses: 500000, totalIncentive: 1750000, tier: 'gold' },
    { id: 'SR-002', name: 'Priya Sharma', territory: 'South Zone', salesAmount: 98000000, quota: 120000000, achievement: 81.7, baseCommission: 980000, bonuses: 300000, totalIncentive: 1280000, tier: 'silver' },
    { id: 'SR-003', name: 'Amit Patel', territory: 'West Zone', salesAmount: 142000000, quota: 140000000, achievement: 101.4, baseCommission: 1420000, bonuses: 850000, totalIncentive: 2270000, tier: 'platinum' }
  ]);

  const getTierColor = (tier: string) => {
    const colors = { platinum: 'bg-purple-100 text-purple-700', gold: 'bg-yellow-100 text-yellow-700', silver: 'bg-gray-100 text-gray-700', bronze: 'bg-orange-100 text-orange-700' };
    return colors[tier as keyof typeof colors];
  };

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(2)}L`;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="h-8 w-8 text-yellow-600" />
          Incentive & Commission Tracking
        </h2>
        <p className="text-gray-600 mt-1">Track sales performance and commission payouts</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-lg font-semibold text-gray-900">Sales Representatives ({salesReps.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {salesReps.map((rep) => (
              <div key={rep.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{rep.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rep.territory}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(rep.tier)}`}>
                    {rep.tier.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Sales Amount</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(rep.salesAmount)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Base Commission</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(rep.baseCommission)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Bonuses</p>
                    <p className="text-lg font-bold text-yellow-900">{formatCurrency(rep.bonuses)}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Total Incentive</p>
                    <p className="text-lg font-bold text-purple-900">{formatCurrency(rep.totalIncentive)}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Quota Achievement: {rep.achievement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${rep.achievement >= 100 ? 'bg-green-500' : rep.achievement >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(rep.achievement, 100)}%` }}
                    />
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
