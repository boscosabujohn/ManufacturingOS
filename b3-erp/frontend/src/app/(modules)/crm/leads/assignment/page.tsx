'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Target,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Edit,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  Phone,
} from 'lucide-react';

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  team: string;
  assignedLeads: number;
  activeLeads: number;
  closedDeals: number;
  conversionRate: number;
  avgResponseTime: string;
  capacity: number;
  maxCapacity: number;
  performance: number;
  status: 'active' | 'away' | 'busy';
}

interface AssignmentRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  criteria: string;
  assignTo: string;
  description: string;
}

const mockSalesReps: SalesRep[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 234-567-8900',
    avatar: 'SJ',
    team: 'Enterprise Sales',
    assignedLeads: 45,
    activeLeads: 32,
    closedDeals: 13,
    conversionRate: 28.9,
    avgResponseTime: '2.5 hrs',
    capacity: 32,
    maxCapacity: 50,
    performance: 92,
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 234-567-8901',
    avatar: 'MC',
    team: 'SMB Sales',
    assignedLeads: 62,
    activeLeads: 48,
    closedDeals: 14,
    conversionRate: 22.6,
    avgResponseTime: '1.8 hrs',
    capacity: 48,
    maxCapacity: 60,
    performance: 85,
    status: 'active',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 234-567-8902',
    avatar: 'ED',
    team: 'Enterprise Sales',
    assignedLeads: 38,
    activeLeads: 28,
    closedDeals: 10,
    conversionRate: 26.3,
    avgResponseTime: '3.2 hrs',
    capacity: 28,
    maxCapacity: 50,
    performance: 88,
    status: 'active',
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@company.com',
    phone: '+1 234-567-8903',
    avatar: 'DP',
    team: 'Channel Partners',
    assignedLeads: 25,
    activeLeads: 18,
    closedDeals: 7,
    conversionRate: 28.0,
    avgResponseTime: '4.1 hrs',
    capacity: 18,
    maxCapacity: 40,
    performance: 78,
    status: 'away',
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    phone: '+1 234-567-8904',
    avatar: 'LR',
    team: 'Inside Sales',
    assignedLeads: 78,
    activeLeads: 65,
    closedDeals: 13,
    conversionRate: 16.7,
    avgResponseTime: '1.2 hrs',
    capacity: 65,
    maxCapacity: 80,
    performance: 82,
    status: 'active',
  },
];

const mockAssignmentRules: AssignmentRule[] = [
  {
    id: '1',
    name: 'Enterprise Leads to Enterprise Team',
    enabled: true,
    priority: 1,
    criteria: 'Deal Value > $50,000',
    assignTo: 'Enterprise Sales Team',
    description: 'Auto-assign high-value leads to enterprise sales specialists',
  },
  {
    id: '2',
    name: 'Referral Leads to Top Performers',
    enabled: true,
    priority: 2,
    criteria: 'Lead Source = Referral',
    assignTo: 'Top 3 Performers',
    description: 'Route referral leads to highest converting sales reps',
  },
  {
    id: '3',
    name: 'Geographic Assignment',
    enabled: true,
    priority: 3,
    criteria: 'Region-based',
    assignTo: 'Regional Teams',
    description: 'Assign leads based on geographic location',
  },
  {
    id: '4',
    name: 'Round Robin - SMB',
    enabled: true,
    priority: 4,
    criteria: 'Deal Value < $10,000',
    assignTo: 'SMB Team (Round Robin)',
    description: 'Distribute small deals evenly across SMB team',
  },
  {
    id: '5',
    name: 'Partner Channel Leads',
    enabled: false,
    priority: 5,
    criteria: 'Lead Source = Partner',
    assignTo: 'Channel Team',
    description: 'Route partner-sourced leads to channel specialists',
  },
];

export default function LeadAssignmentPage() {
  const router = useRouter();
  const [salesReps, setSalesReps] = useState<SalesRep[]>(mockSalesReps);
  const [assignmentRules, setAssignmentRules] = useState<AssignmentRule[]>(mockAssignmentRules);
  const [showSettings, setShowSettings] = useState(false);

  const stats = {
    totalReps: salesReps.length,
    activeReps: salesReps.filter((r) => r.status === 'active').length,
    totalAssigned: salesReps.reduce((sum, r) => sum + r.assignedLeads, 0),
    avgConversion: (salesReps.reduce((sum, r) => sum + r.conversionRate, 0) / salesReps.length).toFixed(1),
  };

  const getCapacityColor = (capacity: number, maxCapacity: number) => {
    const percentage = (capacity / maxCapacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'away':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'busy':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleRule = (ruleId: string) => {
    setAssignmentRules(
      assignmentRules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 ">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Sales Reps</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalReps}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Now</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeReps}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Assigned</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalAssigned}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.avgConversion}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Assignment Rules Section */}
      {showSettings && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Assignment Rules</h2>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Play className="h-4 w-4" />
              <span>Add New Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {assignmentRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border-2 ${
                  rule.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-semibold text-gray-500">Priority {rule.priority}</span>
                      <h3 className="text-sm font-bold text-gray-900">{rule.name}</h3>
                      {rule.enabled ? (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-gray-500">
                        <span className="font-semibold">Criteria:</span> {rule.criteria}
                      </span>
                      <span className="text-gray-500">
                        <span className="font-semibold">Assign To:</span> {rule.assignTo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.enabled
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Reps Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sales Team Overview</h2>

        <div className="space-y-4">
          {salesReps.map((rep) => (
            <div
              key={rep.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                {/* Rep Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{rep.avatar}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{rep.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                        {rep.team}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {rep.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {rep.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Avg Response: {rep.avgResponseTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{rep.assignedLeads}</p>
                    <p className="text-xs text-gray-500">Total Assigned</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{rep.activeLeads}</p>
                    <p className="text-xs text-gray-500">Active Now</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{rep.closedDeals}</p>
                    <p className="text-xs text-gray-500">Closed Deals</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{rep.conversionRate}%</p>
                    <p className="text-xs text-gray-500">Conversion</p>
                  </div>

                  {/* Capacity */}
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Capacity</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {rep.capacity}/{rep.maxCapacity}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${getCapacityColor(rep.capacity, rep.maxCapacity)}`}
                        style={{ width: `${(rep.capacity / rep.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Performance Score */}
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                        rep.performance >= 85
                          ? 'border-green-500 bg-green-50'
                          : rep.performance >= 70
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <span className="text-xl font-bold text-gray-900">{rep.performance}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Performance</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => router.push(`/crm/leads?assignedTo=${rep.id}`)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                     
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
