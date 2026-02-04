'use client'

import { useState } from 'react'
import { Award, DollarSign, TrendingUp, Target, Calendar, Download, RefreshCw, Settings, Eye, FileText, Plus, Calculator } from 'lucide-react'

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

  // Handler functions
  const handleRefresh = () => alert('Refreshing commission data...\n\nAll sales amounts, achievements, and incentive calculations will be updated.');
  const handleSettings = () => alert('Commission Settings\n\nConfigure:\n- Commission rates and tiers\n- Bonus structures\n- Achievement thresholds\n- Payout schedules');
  const handleExport = () => alert('Exporting Commission Report...\n\nIncludes all sales rep performance, commissions, bonuses, and tier assignments.');
  const handleNewIncentivePlan = () => alert('Create New Incentive Plan\n\nDefine commission structure, bonuses, and achievement tiers.');

  const handleViewDetails = (rep: SalesRep) => alert(`Incentive Details: ${rep.name}\n\nTerritory: ${rep.territory}\nTier: ${rep.tier.toUpperCase()}\n\nSALES: ${formatCurrency(rep.salesAmount)}\nQUOTA: ${formatCurrency(rep.quota)}\nACHIEVEMENT: ${rep.achievement}%\n\nBASE COMMISSION: ${formatCurrency(rep.baseCommission)}\nBONUSES: ${formatCurrency(rep.bonuses)}\nTOTAL INCENTIVE: ${formatCurrency(rep.totalIncentive)}`);
  const handleCalculateCommission = (rep: SalesRep) => alert(`Commission Calculation: ${rep.name}\n\nBase Rate: 1%\nSales: ${formatCurrency(rep.salesAmount)}\nBase Commission: ${formatCurrency(rep.baseCommission)}\n\nBonus Breakdown:\n- Quota Achievement Bonus: ${formatCurrency(rep.bonuses * 0.6)}\n- New Customer Bonus: ${formatCurrency(rep.bonuses * 0.3)}\n- Special Promo Bonus: ${formatCurrency(rep.bonuses * 0.1)}\n\nTotal: ${formatCurrency(rep.totalIncentive)}`);
  const handleGenerateStatement = (rep: SalesRep) => alert(`Generating Commission Statement for ${rep.name}...\n\nDetailed breakdown of all sales, commissions, and bonuses for the period will be exported to PDF.`);

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="h-8 w-8 text-yellow-600" />
              Incentive & Commission Tracking
            </h2>
            <p className="text-gray-600 mt-1">Track sales performance and commission payouts</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleNewIncentivePlan} className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>New Plan</span>
            </button>
            <button onClick={handleRefresh} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button onClick={handleSettings} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-lg font-semibold text-gray-900">Sales Representatives ({salesReps.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {salesReps.map((rep) => (
              <div key={rep.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{rep.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rep.territory}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(rep.tier)}`}>
                    {rep.tier.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
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

                <div className="mb-2">
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

                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                  <button onClick={() => handleViewDetails(rep)} className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button onClick={() => handleCalculateCommission(rep)} className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                    <Calculator className="h-4 w-4" />
                    <span>Calculate</span>
                  </button>
                  <button onClick={() => handleGenerateStatement(rep)} className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Statement</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
