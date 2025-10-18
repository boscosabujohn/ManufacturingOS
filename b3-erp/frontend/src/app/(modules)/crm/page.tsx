'use client'

import { useState } from 'react'
import {
  Users,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Star,
  UserPlus
} from 'lucide-react'

interface CRMStats {
  totalLeads: number
  activeLeads: number
  convertedLeads: number
  totalCustomers: number
  activeOpportunities: number
  opportunityValue: number
  conversionRate: number
  avgDealSize: number
  interactionsThisMonth: number
  meetingsScheduled: number
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  source: string
  value: number
  lastContact: string
  assignedTo: string
}

interface Opportunity {
  id: string
  title: string
  customer: string
  value: number
  probability: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing'
  expectedCloseDate: string
  owner: string
  daysOpen: number
}

export default function CRMDashboard() {
  const [stats] = useState<CRMStats>({
    totalLeads: 234,
    activeLeads: 145,
    convertedLeads: 67,
    totalCustomers: 423,
    activeOpportunities: 56,
    opportunityValue: 235000000,
    conversionRate: 28.6,
    avgDealSize: 4196428,
    interactionsThisMonth: 567,
    meetingsScheduled: 34
  })

  const [recentLeads] = useState<Lead[]>([
    {
      id: 'LEAD-001',
      name: 'Rajesh Sharma',
      company: 'Tech Innovations Pvt Ltd',
      email: 'rajesh@techinnovations.com',
      phone: '+91 98765 43210',
      status: 'qualified',
      source: 'Website',
      value: 5000000,
      lastContact: '2025-10-17',
      assignedTo: 'Sales Team A'
    },
    {
      id: 'LEAD-002',
      name: 'Priya Menon',
      company: 'Manufacturing Solutions Inc',
      email: 'priya.menon@mansol.com',
      phone: '+91 98123 45678',
      status: 'proposal',
      source: 'Referral',
      value: 8500000,
      lastContact: '2025-10-16',
      assignedTo: 'Sales Team B'
    },
    {
      id: 'LEAD-003',
      name: 'Amit Kumar',
      company: 'Industrial Automation Ltd',
      email: 'amit@indauto.com',
      phone: '+91 97654 32109',
      status: 'new',
      source: 'Trade Show',
      value: 3200000,
      lastContact: '2025-10-18',
      assignedTo: 'Sales Team A'
    },
    {
      id: 'LEAD-004',
      name: 'Sneha Patel',
      company: 'Global Machinery Corp',
      email: 'sneha.p@globalmach.com',
      phone: '+91 98234 56789',
      status: 'negotiation',
      source: 'Cold Call',
      value: 12000000,
      lastContact: '2025-10-15',
      assignedTo: 'Sales Team C'
    }
  ])

  const [topOpportunities] = useState<Opportunity[]>([
    {
      id: 'OPP-001',
      title: 'Hydraulic Press System - ABC Corp',
      customer: 'ABC Manufacturing Ltd',
      value: 45000000,
      probability: 75,
      stage: 'negotiation',
      expectedCloseDate: '2025-11-15',
      owner: 'Sales Manager A',
      daysOpen: 45
    },
    {
      id: 'OPP-002',
      title: 'CNC Machine Upgrade - XYZ Inc',
      customer: 'XYZ Industries Inc',
      value: 32000000,
      probability: 60,
      stage: 'proposal',
      expectedCloseDate: '2025-11-25',
      owner: 'Sales Manager B',
      daysOpen: 32
    },
    {
      id: 'OPP-003',
      title: 'Automation Solution - Tech Solutions',
      customer: 'Tech Solutions Pvt Ltd',
      value: 28000000,
      probability: 85,
      stage: 'closing',
      expectedCloseDate: '2025-10-28',
      owner: 'Sales Manager A',
      daysOpen: 28
    },
    {
      id: 'OPP-004',
      title: 'Production Line Setup - Global Exports',
      customer: 'Global Exports Corp',
      value: 56000000,
      probability: 45,
      stage: 'qualification',
      expectedCloseDate: '2025-12-10',
      owner: 'Sales Manager C',
      daysOpen: 15
    }
  ])

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'contacted':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'qualified':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'proposal':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'won':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'lost':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'qualification':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'proposal':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'closing':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
            <p className="text-gray-600 mt-1">Leads, opportunities, and customer interactions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md">
            <UserPlus className="h-5 w-5" />
            Add New Lead
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Leads</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.activeLeads}</p>
                <p className="text-xs text-blue-700 mt-1">{stats.totalLeads} total leads</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Opportunities Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{(stats.opportunityValue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-green-700 mt-1">{stats.activeOpportunities} active</p>
              </div>
              <Target className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.conversionRate}%</p>
                <p className="text-xs text-purple-700 mt-1">{stats.convertedLeads} converted</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Customers</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.totalCustomers}</p>
                <p className="text-xs text-orange-700 mt-1">{stats.interactionsThisMonth} interactions</p>
              </div>
              <CheckCircle className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{lead.company}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLeadStatusColor(lead.status)}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">{lead.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Est. Value</p>
                        <p className="font-semibold text-gray-900">₹{(lead.value / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-xs">Last Contact</p>
                        <p className="text-gray-900">{lead.lastContact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Opportunities</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topOpportunities.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{opp.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{opp.customer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(opp.stage)}`}>
                        {opp.stage.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Value</span>
                        <span className="font-semibold text-gray-900">₹{(opp.value / 10000000).toFixed(2)}Cr</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Probability</span>
                        <span className="font-semibold text-gray-900">{opp.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            opp.probability >= 75
                              ? 'bg-green-500'
                              : opp.probability >= 50
                              ? 'bg-blue-500'
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                        <span>Close: {opp.expectedCloseDate}</span>
                        <span>{opp.daysOpen} days open</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.avgDealSize / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600 mt-1">+8% from last quarter</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meetings Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.meetingsScheduled}</p>
                <p className="text-xs text-gray-600 mt-1">This week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month Interactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.interactionsThisMonth}</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
