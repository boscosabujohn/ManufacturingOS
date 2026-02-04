'use client'

import { useState } from 'react'
import { Map, Users, TrendingUp, Target, DollarSign, Award, MapPin, Download, RefreshCw, Settings, Eye, Edit, Plus, BarChart3 } from 'lucide-react'

export type TerritoryType = 'geographic' | 'industry' | 'account-based';

export interface Territory {
  id: string;
  name: string;
  type: TerritoryType;
  salesRep: string;
  region: string;
  customers: number;
  activeOpportunities: number;
  revenue: number;
  quota: number;
  achievement: number;
  topAccounts: string[];
}

export default function TerritoryManagement() {
  const [territories] = useState<Territory[]>([
    {
      id: 'T-001',
      name: 'North Zone - Automotive',
      type: 'industry',
      salesRep: 'Rajesh Kumar',
      region: 'North India',
      customers: 45,
      activeOpportunities: 12,
      revenue: 125000000,
      quota: 150000000,
      achievement: 83.3,
      topAccounts: ['ABC Manufacturing', 'XYZ Industries', 'Tech Solutions']
    },
    {
      id: 'T-002',
      name: 'South Zone - Heavy Engineering',
      type: 'geographic',
      salesRep: 'Priya Sharma',
      region: 'South India',
      customers: 38,
      activeOpportunities: 8,
      revenue: 98000000,
      quota: 120000000,
      achievement: 81.7,
      topAccounts: ['Global Exports', 'Southern Industries']
    },
    {
      id: 'T-003',
      name: 'West Zone - Electronics',
      type: 'industry',
      salesRep: 'Amit Patel',
      region: 'West India',
      customers: 52,
      activeOpportunities: 15,
      revenue: 142000000,
      quota: 140000000,
      achievement: 101.4,
      topAccounts: ['Tech Corp', 'Electronics Ltd', 'Silicon Valley India']
    }
  ]);

  const getAchievementColor = (achievement: number) => {
    if (achievement >= 100) return 'text-green-600';
    if (achievement >= 80) return 'text-blue-600';
    if (achievement >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  // Handler functions
  const handleRefresh = () => {
    console.log('Refreshing territory data...');
    alert('Refreshing territory performance data...\n\nRevenue, quota achievement, and opportunities will be updated.');
  };

  const handleSettings = () => {
    console.log('Opening territory settings...');
    alert('Territory Management Settings\n\nConfigure:\n- Territory boundaries\n- Assignment rules\n- Quota allocation\n- Performance metrics');
  };

  const handleExport = () => {
    console.log('Exporting territory report...');
    alert('Exporting Territory Performance Report to Excel...\n\nIncludes:\n- Territory assignments\n- Revenue and quota data\n- Top accounts\n- Achievement metrics');
  };

  const handleNewTerritory = () => {
    alert('Create New Territory\n\nDefine:\n- Territory name and type\n- Geographic boundaries or industry focus\n- Assign sales representative\n- Set quota targets');
  };

  const handleViewDetails = (territory: Territory) => {
    const topAccountsList = territory.topAccounts.join(', ');
    alert(`Territory Details: ${territory.name}\n\nSales Rep: ${territory.salesRep}\nRegion: ${territory.region}\nType: ${territory.type}\n\nCUSTOMERS: ${territory.customers}\nOPPORTUNITIES: ${territory.activeOpportunities}\n\nREVENUE: ${formatCurrency(territory.revenue)}\nQUOTA: ${formatCurrency(territory.quota)}\nACHIEVEMENT: ${territory.achievement}%\n\nTop Accounts:\n${topAccountsList}`);
  };

  const handleEditTerritory = (territory: Territory) => {
    alert(`Edit Territory: ${territory.name}\n\nUpdate:\n- Territory boundaries\n- Sales rep assignment\n- Quota targets\n- Account assignments`);
  };

  const handleViewAnalytics = (territory: Territory) => {
    alert(`Territory Analytics: ${territory.name}\n\nPerformance Trends:\n- Revenue growth: 18.5% YoY\n- Win rate: 42%\n- Average deal size: ₹1.2Cr\n- Sales cycle: 45 days\n\nTop Products:\n1. Hydraulic Press - 35%\n2. CNC Machine - 28%\n3. Control Panel - 22%\n\nOpportunity Pipeline:\n- Qualified: ${Math.floor(territory.activeOpportunities * 0.6)}\n- Proposal: ${Math.floor(territory.activeOpportunities * 0.3)}\n- Negotiation: ${Math.floor(territory.activeOpportunities * 0.1)}`);
  };

  const handleReassignTerritory = (territory: Territory) => {
    if (confirm(`Reassign Territory: ${territory.name}\n\nCurrent Rep: ${territory.salesRep}\n\nSelect new sales representative to take over this territory.`)) {
      alert(`Territory reassignment initiated!\n\nAll customers, opportunities, and accounts will be transferred to the new representative.`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Map className="h-8 w-8 text-green-600" />
              Territory Management
            </h2>
            <p className="text-gray-600 mt-1">Organize sales territories and track performance</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleNewTerritory} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>New Territory</span>
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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-lg font-semibold text-gray-900">Sales Territories ({territories.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {territories.map((territory) => (
              <div key={territory.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{territory.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{territory.region} • {territory.type}</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{territory.salesRep}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Customers</p>
                    <p className="text-2xl font-bold text-blue-900">{territory.customers}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Opportunities</p>
                    <p className="text-2xl font-bold text-purple-900">{territory.activeOpportunities}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Revenue</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(territory.revenue)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Quota</p>
                    <p className="text-lg font-bold text-yellow-900">{formatCurrency(territory.quota)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Achievement</p>
                    <p className={`text-2xl font-bold ${getAchievementColor(territory.achievement)}`}>
                      {territory.achievement}%
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Quota Achievement</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        territory.achievement >= 100 ? 'bg-green-500' :
                        territory.achievement >= 80 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(territory.achievement, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Top Accounts:</p>
                  <div className="flex flex-wrap gap-2">
                    {territory.topAccounts.map((account, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {account}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                  <button onClick={() => handleViewDetails(territory)} className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button onClick={() => handleEditTerritory(territory)} className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleViewAnalytics(territory)} className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                  <button onClick={() => handleReassignTerritory(territory)} className="flex items-center space-x-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                    <Users className="h-4 w-4" />
                    <span>Reassign</span>
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
