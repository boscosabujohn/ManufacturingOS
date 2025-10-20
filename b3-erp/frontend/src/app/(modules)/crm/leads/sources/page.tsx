'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Filter,
  Download,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  category: string;
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgScore: number;
  totalValue: number;
  avgDealSize: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  color: string;
}

const mockLeadSources: LeadSource[] = [
  {
    id: '1',
    name: 'Referral',
    category: 'Referral',
    totalLeads: 45,
    qualifiedLeads: 38,
    conversionRate: 84.4,
    avgScore: 78,
    totalValue: 1250000,
    avgDealSize: 32895,
    lastMonth: 38,
    trend: 'up',
    trendPercentage: 18.4,
    color: 'bg-green-500',
  },
  {
    id: '2',
    name: 'Trade Show',
    category: 'Events',
    totalLeads: 62,
    qualifiedLeads: 45,
    conversionRate: 72.6,
    avgScore: 72,
    totalValue: 1680000,
    avgDealSize: 37333,
    lastMonth: 58,
    trend: 'up',
    trendPercentage: 6.9,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Website - Organic',
    category: 'Website',
    totalLeads: 120,
    qualifiedLeads: 72,
    conversionRate: 60.0,
    avgScore: 65,
    totalValue: 1890000,
    avgDealSize: 26250,
    lastMonth: 115,
    trend: 'up',
    trendPercentage: 4.3,
    color: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'LinkedIn Ads',
    category: 'Advertising',
    totalLeads: 95,
    qualifiedLeads: 48,
    conversionRate: 50.5,
    avgScore: 58,
    totalValue: 1140000,
    avgDealSize: 23750,
    lastMonth: 88,
    trend: 'up',
    trendPercentage: 8.0,
    color: 'bg-indigo-500',
  },
  {
    id: '5',
    name: 'Customer Referral',
    category: 'Referral',
    totalLeads: 28,
    qualifiedLeads: 24,
    conversionRate: 85.7,
    avgScore: 82,
    totalValue: 980000,
    avgDealSize: 40833,
    lastMonth: 22,
    trend: 'up',
    trendPercentage: 27.3,
    color: 'bg-emerald-500',
  },
  {
    id: '6',
    name: 'Cold Call',
    category: 'Sales',
    totalLeads: 150,
    qualifiedLeads: 45,
    conversionRate: 30.0,
    avgScore: 42,
    totalValue: 675000,
    avgDealSize: 15000,
    lastMonth: 165,
    trend: 'down',
    trendPercentage: -9.1,
    color: 'bg-orange-500',
  },
  {
    id: '7',
    name: 'Google Ads',
    category: 'Advertising',
    totalLeads: 85,
    qualifiedLeads: 38,
    conversionRate: 44.7,
    avgScore: 52,
    totalValue: 760000,
    avgDealSize: 20000,
    lastMonth: 92,
    trend: 'down',
    trendPercentage: -7.6,
    color: 'bg-yellow-500',
  },
  {
    id: '8',
    name: 'Email Campaign',
    category: 'Marketing',
    totalLeads: 78,
    qualifiedLeads: 35,
    conversionRate: 44.9,
    avgScore: 55,
    totalValue: 630000,
    avgDealSize: 18000,
    lastMonth: 75,
    trend: 'up',
    trendPercentage: 4.0,
    color: 'bg-pink-500',
  },
];

export default function LeadSourcesPage() {
  const router = useRouter();
  const [sources, setSources] = useState<LeadSource[]>(mockLeadSources);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('totalLeads');

  const categories = Array.from(new Set(sources.map((s) => s.category)));

  const filteredSources = sources
    .filter((source) => {
      const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalLeads':
          return b.totalLeads - a.totalLeads;
        case 'conversionRate':
          return b.conversionRate - a.conversionRate;
        case 'avgScore':
          return b.avgScore - a.avgScore;
        case 'totalValue':
          return b.totalValue - a.totalValue;
        default:
          return 0;
      }
    });

  const stats = {
    totalLeads: sources.reduce((sum, s) => sum + s.totalLeads, 0),
    qualifiedLeads: sources.reduce((sum, s) => sum + s.qualifiedLeads, 0),
    avgConversion: (sources.reduce((sum, s) => sum + s.conversionRate, 0) / sources.length).toFixed(1),
    totalValue: sources.reduce((sum, s) => sum + s.totalValue, 0),
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Globe className="h-7 w-7 text-blue-600 mr-3" />
              Lead Sources Analytics
            </h1>
            <p className="text-sm text-gray-600 mt-1">Track performance by lead source</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>View Charts</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Leads</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalLeads}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Qualified Leads</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.qualifiedLeads}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgConversion}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Value</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                ${(stats.totalValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lead sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="totalLeads">Sort by: Total Leads</option>
            <option value="conversionRate">Sort by: Conversion Rate</option>
            <option value="avgScore">Sort by: Avg Score</option>
            <option value="totalValue">Sort by: Total Value</option>
          </select>
        </div>
      </div>

      {/* Lead Sources Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Leads</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSources.map((source) => (
              <tr key={source.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className="font-medium text-gray-900">{source.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {source.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{source.totalLeads}</td>
                <td className="px-6 py-4">
                  <span className="text-green-600 font-semibold">{source.qualifiedLeads}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    ({((source.qualifiedLeads / source.totalLeads) * 100).toFixed(0)}%)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className={`h-2 rounded-full ${
                          source.conversionRate >= 70
                            ? 'bg-green-500'
                            : source.conversionRate >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${source.conversionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{source.conversionRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      source.avgScore >= 70
                        ? 'bg-green-100 text-green-700'
                        : source.avgScore >= 50
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {source.avgScore}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${(source.totalValue / 1000).toFixed(0)}K
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    {source.trend === 'up' ? (
                      <>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          {source.trendPercentage.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">
                          {Math.abs(source.trendPercentage).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/crm/leads?source=${source.name}`)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Leads</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-6">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No lead sources found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
