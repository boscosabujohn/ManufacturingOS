'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Globe,
  Building2,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  Activity,
  Clock
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
    email: string;
    phone: string;
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

export default function ViewTerritoryPage() {
  const router = useRouter();
  const params = useParams();
  const territoryId = params.id as string;

  // Mock data - in a real app, fetch this based on territoryId
  const [territory] = useState<Territory>({
    id: territoryId,
    name: 'North America East',
    code: 'NAE',
    type: 'geographic',
    status: 'active',
    region: 'Americas',
    description: 'Eastern United States and Eastern Canada coverage',
    assignedTo: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Regional Sales Director',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567'
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
  });

  const handleBack = () => {
    router.push('/crm/settings/territories');
  };

  const handleEdit = () => {
    router.push(`/crm/settings/territories/edit/${territoryId}`);
  };

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

  const TypeIcon = getTypeIcon(territory.type);
  const quotaProgress = territory.performance.quotaAttainment;

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 ">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Territories
            </button>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <TypeIcon className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{territory.name}</h1>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                    {territory.code}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getTypeColor(territory.type)}`}>
                    {territory.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(territory.status)}`}>
                    {territory.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600">{territory.description}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Territory
          </button>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Accounts</p>
                <p className="text-4xl font-bold mt-1">{territory.performance.accounts}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+{territory.growth.accountsChange} this quarter</span>
                </div>
              </div>
              <Building2 className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Opportunities</p>
                <p className="text-4xl font-bold mt-1">{territory.performance.activeOpportunities}</p>
                <p className="text-white/70 text-sm mt-2">In pipeline</p>
              </div>
              <Activity className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Revenue</p>
                <p className="text-4xl font-bold mt-1">
                  ${(territory.performance.revenue / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{territory.growth.revenueChange}% growth</span>
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Win Rate</p>
                <p className="text-4xl font-bold mt-1">{territory.performance.winRate}%</p>
                {territory.performance.winRate >= 70 && (
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                )}
              </div>
              <Award className="w-12 h-12 text-white/30" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quota Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quota Attainment</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Progress</span>
                  <span className={`text-lg font-bold ${
                    quotaProgress >= 100 ? 'text-green-600' : quotaProgress >= 80 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {quotaProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      quotaProgress >= 100
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : quotaProgress >= 80
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`}
                    style={{ width: `${Math.min(quotaProgress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(territory.performance.revenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">Quota</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(territory.performance.quota / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(territory.performance.avgDealSize / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Per opportunity</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{territory.metrics.totalLeads}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {territory.metrics.convertedLeads} converted
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">CSAT Score</p>
                  <p className="text-2xl font-bold text-gray-900">{territory.metrics.customerSatisfaction}</p>
                  <p className="text-xs text-gray-600 mt-1">Out of 5.0</p>
                </div>
              </div>
            </div>

            {/* Coverage Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Territory Coverage</h2>
              <div className="space-y-4">
                {territory.coverage.countries && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Countries</p>
                      <div className="flex flex-wrap gap-2">
                        {territory.coverage.countries.map((country) => (
                          <span
                            key={country}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {territory.coverage.states && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">States/Provinces</p>
                      <div className="flex flex-wrap gap-2">
                        {territory.coverage.states.map((state) => (
                          <span
                            key={state}
                            className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                          >
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {territory.coverage.cities && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Major Cities</p>
                      <div className="flex flex-wrap gap-2">
                        {territory.coverage.cities.map((city) => (
                          <span
                            key={city}
                            className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {territory.coverage.industries && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Industries</p>
                      <div className="flex flex-wrap gap-2">
                        {territory.coverage.industries.map((industry) => (
                          <span
                            key={industry}
                            className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {territory.coverage.accountSizes && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Account Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {territory.coverage.accountSizes.map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Assigned Owner */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Territory Owner</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {territory.assignedTo.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{territory.assignedTo.name}</h3>
                    <p className="text-sm text-gray-600">{territory.assignedTo.role}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${territory.assignedTo.email}`} className="text-blue-600 hover:text-blue-700">
                      {territory.assignedTo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${territory.assignedTo.phone}`} className="text-gray-700 hover:text-gray-900">
                      {territory.assignedTo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Territory Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Territory Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Region</p>
                  <p className="text-base font-medium text-gray-900">{territory.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Territory Type</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getTypeColor(territory.type)}`}>
                    {territory.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getStatusColor(territory.status)}`}>
                    {territory.status.toUpperCase()}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Created: {new Date(territory.createdAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last Modified: {new Date(territory.lastModified).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
