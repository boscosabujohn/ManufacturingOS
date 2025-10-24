'use client'

import { useState } from 'react'
import { Map, Users, TrendingUp, Target, DollarSign, Award, MapPin } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Map className="h-8 w-8 text-green-600" />
          Territory Management
        </h2>
        <p className="text-gray-600 mt-1">Organize sales territories and track performance</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-lg font-semibold text-gray-900">Sales Territories ({territories.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {territories.map((territory) => (
              <div key={territory.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{territory.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{territory.region} • {territory.type}</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{territory.salesRep}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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

                <div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
