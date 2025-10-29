'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Globe,
  Building2,
  User,
  Target,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  Copy,
  UserPlus
} from 'lucide-react';

interface Territory {
  id: string;
  name: string;
  code: string;
  type: 'geographic' | 'industry' | 'account_size' | 'product' | 'hybrid';
  status: 'active' | 'inactive' | 'pending';
  region: string;
  description: string;
  assignedTo: {
    name: string;
    avatar: string;
    role: string;
  };
  coverage: {
    countries?: string[];
    states?: string[];
    cities?: string[];
    industries?: string[];
    accountSizes?: string[];
  };
  performance: {
    accounts: number;
    activeOpportunities: number;
    revenue: number;
    quota: number;
    quotaAttainment: number;
    avgDealSize: number;
    winRate: number;
  };
  growth: {
    accountsChange: number;
    revenueChange: number;
  };
  metrics: {
    totalLeads: number;
    convertedLeads: number;
    customerSatisfaction: number;
  };
  createdAt: string;
  lastModified: string;
}

export default function TerritoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [territories, setTerritories] = useState<Territory[]>([
    {
      id: 'TER-001',
      name: 'North America East',
      code: 'NAE',
      type: 'geographic',
      status: 'active',
      region: 'Americas',
      description: 'Eastern United States and Eastern Canada coverage',
      assignedTo: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        role: 'Regional Sales Director'
      },
      coverage: {
        countries: ['United States', 'Canada'],
        states: ['New York', 'Massachusetts', 'Pennsylvania', 'New Jersey', 'Connecticut', 'Vermont'],
        cities: ['New York', 'Boston', 'Philadelphia', 'Toronto', 'Montreal']
      },
      performance: {
        accounts: 156,
        activeOpportunities: 42,
        revenue: 8450000,
        quota: 10000000,
        quotaAttainment: 84.5,
        avgDealSize: 125000,
        winRate: 68
      },
      growth: {
        accountsChange: 12,
        revenueChange: 15.3
      },
      metrics: {
        totalLeads: 324,
        convertedLeads: 156,
        customerSatisfaction: 4.6
      },
      createdAt: '2024-01-15',
      lastModified: '2025-10-15'
    },
    {
      id: 'TER-002',
      name: 'North America West',
      code: 'NAW',
      type: 'geographic',
      status: 'active',
      region: 'Americas',
      description: 'Western United States and Western Canada coverage',
      assignedTo: {
        name: 'Michael Chen',
        avatar: 'MC',
        role: 'Regional Sales Director'
      },
      coverage: {
        countries: ['United States', 'Canada'],
        states: ['California', 'Washington', 'Oregon', 'Nevada', 'Arizona', 'British Columbia'],
        cities: ['San Francisco', 'Los Angeles', 'Seattle', 'Vancouver', 'San Diego']
      },
      performance: {
        accounts: 189,
        activeOpportunities: 58,
        revenue: 12300000,
        quota: 12000000,
        quotaAttainment: 102.5,
        avgDealSize: 145000,
        winRate: 72
      },
      growth: {
        accountsChange: 18,
        revenueChange: 22.7
      },
      metrics: {
        totalLeads: 412,
        convertedLeads: 189,
        customerSatisfaction: 4.8
      },
      createdAt: '2024-01-15',
      lastModified: '2025-10-18'
    },
    {
      id: 'TER-003',
      name: 'EMEA - Western Europe',
      code: 'EMEA-WE',
      type: 'geographic',
      status: 'active',
      region: 'EMEA',
      description: 'Western European markets including UK, France, Germany',
      assignedTo: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        role: 'EMEA Sales Director'
      },
      coverage: {
        countries: ['United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium', 'Ireland'],
        cities: ['London', 'Paris', 'Berlin', 'Amsterdam', 'Dublin']
      },
      performance: {
        accounts: 134,
        activeOpportunities: 38,
        revenue: 6780000,
        quota: 8000000,
        quotaAttainment: 84.8,
        avgDealSize: 98000,
        winRate: 64
      },
      growth: {
        accountsChange: 15,
        revenueChange: 18.5
      },
      metrics: {
        totalLeads: 267,
        convertedLeads: 134,
        customerSatisfaction: 4.5
      },
      createdAt: '2024-02-10',
      lastModified: '2025-10-12'
    },
    {
      id: 'TER-004',
      name: 'Enterprise Technology',
      code: 'ENT-TECH',
      type: 'industry',
      status: 'active',
      region: 'Global',
      description: 'Enterprise technology companies across all regions',
      assignedTo: {
        name: 'David Park',
        avatar: 'DP',
        role: 'Enterprise Account Director'
      },
      coverage: {
        industries: ['Software', 'Cloud Services', 'IT Infrastructure', 'SaaS', 'Cybersecurity'],
        accountSizes: ['Enterprise (1000+ employees)']
      },
      performance: {
        accounts: 87,
        activeOpportunities: 31,
        revenue: 9850000,
        quota: 9000000,
        quotaAttainment: 109.4,
        avgDealSize: 285000,
        winRate: 75
      },
      growth: {
        accountsChange: 8,
        revenueChange: 28.4
      },
      metrics: {
        totalLeads: 145,
        convertedLeads: 87,
        customerSatisfaction: 4.7
      },
      createdAt: '2024-03-01',
      lastModified: '2025-10-20'
    },
    {
      id: 'TER-005',
      name: 'Financial Services - Americas',
      code: 'FIN-AM',
      type: 'industry',
      status: 'active',
      region: 'Americas',
      description: 'Banking, insurance, and financial institutions in Americas',
      assignedTo: {
        name: 'Jennifer Martinez',
        avatar: 'JM',
        role: 'Financial Services Lead'
      },
      coverage: {
        countries: ['United States', 'Canada', 'Mexico', 'Brazil'],
        industries: ['Banking', 'Insurance', 'Investment Management', 'FinTech'],
        accountSizes: ['Mid-Market (250-1000)', 'Enterprise (1000+)']
      },
      performance: {
        accounts: 64,
        activeOpportunities: 22,
        revenue: 7250000,
        quota: 7500000,
        quotaAttainment: 96.7,
        avgDealSize: 195000,
        winRate: 71
      },
      growth: {
        accountsChange: 6,
        revenueChange: 12.8
      },
      metrics: {
        totalLeads: 118,
        convertedLeads: 64,
        customerSatisfaction: 4.6
      },
      createdAt: '2024-03-15',
      lastModified: '2025-10-19'
    },
    {
      id: 'TER-006',
      name: 'Asia Pacific',
      code: 'APAC',
      type: 'geographic',
      status: 'active',
      region: 'Asia Pacific',
      description: 'Asia Pacific region including Australia and Southeast Asia',
      assignedTo: {
        name: 'Kevin Wong',
        avatar: 'KW',
        role: 'APAC Sales Director'
      },
      coverage: {
        countries: ['Australia', 'Singapore', 'Japan', 'South Korea', 'India', 'New Zealand'],
        cities: ['Sydney', 'Singapore', 'Tokyo', 'Seoul', 'Mumbai', 'Auckland']
      },
      performance: {
        accounts: 112,
        activeOpportunities: 35,
        revenue: 5640000,
        quota: 7000000,
        quotaAttainment: 80.6,
        avgDealSize: 87000,
        winRate: 62
      },
      growth: {
        accountsChange: 22,
        revenueChange: 31.5
      },
      metrics: {
        totalLeads: 298,
        convertedLeads: 112,
        customerSatisfaction: 4.4
      },
      createdAt: '2024-04-01',
      lastModified: '2025-10-17'
    },
    {
      id: 'TER-007',
      name: 'SMB - North America',
      code: 'SMB-NA',
      type: 'account_size',
      status: 'active',
      region: 'Americas',
      description: 'Small and medium businesses across North America',
      assignedTo: {
        name: 'Alex Thompson',
        avatar: 'AT',
        role: 'SMB Sales Manager'
      },
      coverage: {
        countries: ['United States', 'Canada'],
        accountSizes: ['Small Business (1-50)', 'Mid-Market (50-250)']
      },
      performance: {
        accounts: 342,
        activeOpportunities: 89,
        revenue: 4120000,
        quota: 5000000,
        quotaAttainment: 82.4,
        avgDealSize: 28000,
        winRate: 58
      },
      growth: {
        accountsChange: 34,
        revenueChange: 8.6
      },
      metrics: {
        totalLeads: 687,
        convertedLeads: 342,
        customerSatisfaction: 4.3
      },
      createdAt: '2024-05-10',
      lastModified: '2025-10-16'
    },
    {
      id: 'TER-008',
      name: 'Healthcare & Life Sciences',
      code: 'HLS',
      type: 'industry',
      status: 'active',
      region: 'Global',
      description: 'Healthcare providers, pharma, and medical device companies',
      assignedTo: {
        name: 'Dr. Lisa Anderson',
        avatar: 'LA',
        role: 'Healthcare Vertical Lead'
      },
      coverage: {
        industries: ['Hospitals & Healthcare', 'Pharmaceuticals', 'Medical Devices', 'Biotech', 'Health Insurance'],
        accountSizes: ['Mid-Market (250-1000)', 'Enterprise (1000+)']
      },
      performance: {
        accounts: 76,
        activeOpportunities: 28,
        revenue: 6890000,
        quota: 6500000,
        quotaAttainment: 106.0,
        avgDealSize: 165000,
        winRate: 69
      },
      growth: {
        accountsChange: 9,
        revenueChange: 16.2
      },
      metrics: {
        totalLeads: 152,
        convertedLeads: 76,
        customerSatisfaction: 4.7
      },
      createdAt: '2024-06-01',
      lastModified: '2025-10-14'
    }
  ]);

  const filteredTerritories = territories.filter(territory => {
    const matchesSearch = territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territory.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territory.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || territory.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || territory.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Territories',
      value: territories.length,
      subtitle: `${territories.filter(t => t.status === 'active').length} active`,
      icon: Globe,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Accounts',
      value: territories.reduce((sum, t) => sum + t.performance.accounts, 0),
      change: '+' + territories.reduce((sum, t) => sum + t.growth.accountsChange, 0),
      trend: 'up' as const,
      icon: Building2,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Total Revenue',
      value: '$' + (territories.reduce((sum, t) => sum + t.performance.revenue, 0) / 1000000).toFixed(1) + 'M',
      change: '+' + (territories.reduce((sum, t) => sum + (t.performance.revenue * t.growth.revenueChange / 100), 0) / 1000000).toFixed(1) + 'M',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Avg Quota Attainment',
      value: Math.round(territories.reduce((sum, t) => sum + t.performance.quotaAttainment, 0) / territories.length) + '%',
      change: territories.filter(t => t.performance.quotaAttainment >= 100).length + ' over quota',
      icon: Target,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'geographic': return MapPin;
      case 'industry': return Building2;
      case 'account_size': return Users;
      case 'product': return BarChart3;
      default: return Globe;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'geographic': return 'bg-blue-100 text-blue-700';
      case 'industry': return 'bg-purple-100 text-purple-700';
      case 'account_size': return 'bg-green-100 text-green-700';
      case 'product': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewTerritory = (territory: Territory) => {
    router.push(`/crm/settings/territories/view/${territory.id}`);
  };

  const handleEditTerritory = (territory: Territory) => {
    router.push(`/crm/settings/territories/edit/${territory.id}`);
  };

  const handleAssignUser = (territory: Territory) => {
    router.push(`/crm/settings/territories/assign/${territory.id}`);
  };

  const handleCopyTerritory = (territory: Territory) => {
    const newTerritory: Territory = {
      ...territory,
      id: `TER-${Date.now().toString().slice(-3)}`,
      name: `${territory.name} (Copy)`,
      code: `${territory.code}-COPY`,
      status: 'pending',
      performance: {
        ...territory.performance,
        accounts: 0,
        activeOpportunities: 0,
        revenue: 0,
        quotaAttainment: 0,
      },
      growth: {
        accountsChange: 0,
        revenueChange: 0,
      },
      metrics: {
        totalLeads: 0,
        convertedLeads: 0,
        customerSatisfaction: 0,
      },
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTerritories([...territories, newTerritory]);
  };

  const handleSettingsTerritory = (territory: Territory) => {
    router.push(`/crm/settings/territories/configure/${territory.id}`);
  };

  const handleCreateTerritory = () => {
    setShowAddModal(false);
    router.push('/crm/settings/territories');
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Territory
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  {'subtitle' in stat && (
                    <p className="text-white/70 text-xs mt-1">{stat.subtitle}</p>
                  )}
                  {'change' in stat && (
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  )}
                </div>
                <Icon className="w-12 h-12 text-white/30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Territories
            </label>
            <input
              type="text"
              placeholder="Search by name, code, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Territory Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="geographic">Geographic</option>
              <option value="industry">Industry</option>
              <option value="account_size">Account Size</option>
              <option value="product">Product</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Territories Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTerritories.map((territory) => {
          const TypeIcon = getTypeIcon(territory.type);
          const quotaProgress = territory.performance.quotaAttainment;

          return (
            <div key={territory.id} className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <TypeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{territory.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {territory.code}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(territory.type)}`}>
                          {territory.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(territory.status)}`}>
                          {territory.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{territory.description}</p>

                      {/* Assigned To */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {territory.assignedTo.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{territory.assignedTo.name}</p>
                          <p className="text-xs text-gray-600">{territory.assignedTo.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewTerritory(territory)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Territory"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleEditTerritory(territory)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit Territory"
                    >
                      <Edit className="w-5 h-5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => handleAssignUser(territory)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Assign User"
                    >
                      <UserPlus className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleCopyTerritory(territory)}
                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Copy Territory"
                    >
                      <Copy className="w-5 h-5 text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleSettingsTerritory(territory)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Configure Territory"
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 bg-gray-50/50">
                <div className="grid grid-cols-6 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{territory.performance.accounts}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+{territory.growth.accountsChange}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Active Deals</p>
                    <p className="text-2xl font-bold text-gray-900">{territory.performance.activeOpportunities}</p>
                    <p className="text-xs text-gray-600 mt-1">In pipeline</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(territory.performance.revenue / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+{territory.growth.revenueChange}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Avg Deal Size</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(territory.performance.avgDealSize / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Per deal</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{territory.performance.winRate}%</p>
                    {territory.performance.winRate >= 70 && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Excellent</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CSAT Score</p>
                    <p className="text-2xl font-bold text-gray-900">{territory.metrics.customerSatisfaction}</p>
                    <p className="text-xs text-gray-600 mt-1">Out of 5.0</p>
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Quota Attainment</span>
                    <span className={`text-sm font-bold ${
                      quotaProgress >= 100 ? 'text-green-600' : quotaProgress >= 80 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {quotaProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        quotaProgress >= 100
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : quotaProgress >= 80
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}
                      style={{ width: `${Math.min(quotaProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">
                      ${(territory.performance.revenue / 1000000).toFixed(2)}M
                    </span>
                    <span className="text-xs text-gray-600">
                      ${(territory.performance.quota / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>

                {/* Coverage Details */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-2">COVERAGE</p>
                  <div className="space-y-2">
                    {territory.coverage.countries && (
                      <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Countries</p>
                          <p className="text-sm text-gray-900">{territory.coverage.countries.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {territory.coverage.states && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">States/Provinces</p>
                          <p className="text-sm text-gray-900">{territory.coverage.states.slice(0, 3).join(', ')}
                            {territory.coverage.states.length > 3 && ` +${territory.coverage.states.length - 3} more`}
                          </p>
                        </div>
                      </div>
                    )}
                    {territory.coverage.industries && (
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Industries</p>
                          <p className="text-sm text-gray-900">{territory.coverage.industries.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {territory.coverage.accountSizes && (
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Account Sizes</p>
                          <p className="text-sm text-gray-900">{territory.coverage.accountSizes.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-100/50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Region: <strong className="text-gray-900">{territory.region}</strong></span>
                  <span>•</span>
                  <span>Created: {new Date(territory.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>Last Modified: {new Date(territory.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Territory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Territory</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Territory Name</label>
                  <input
                    type="text"
                    placeholder="e.g., North America East"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Territory Code</label>
                  <input
                    type="text"
                    placeholder="e.g., NAE"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Territory Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="geographic">Geographic</option>
                    <option value="industry">Industry</option>
                    <option value="account_size">Account Size</option>
                    <option value="product">Product</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="americas">Americas</option>
                    <option value="emea">EMEA</option>
                    <option value="asia_pacific">Asia Pacific</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the territory coverage and scope..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select team member...</option>
                  <option value="sarah">Sarah Johnson - Regional Sales Director</option>
                  <option value="michael">Michael Chen - Regional Sales Director</option>
                  <option value="emily">Emily Rodriguez - EMEA Sales Director</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Quota</label>
                <input
                  type="number"
                  placeholder="e.g., 10000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTerritory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Territory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
