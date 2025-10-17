'use client';

import { useRouter } from 'next/navigation';
import { FileText, Shield, AlertCircle, Wrench, Navigation, DollarSign, TrendingUp, TrendingDown, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';

export default function AfterSalesDashboard() {
  const router = useRouter();

  // Mock dashboard data
  const stats = {
    activeContracts: 6,
    contractValue: 4250000,
    expiringIn30Days: 2,
    activeWarranties: 7,
    totalClaims: 12,
    openTickets: 3,
    p1Critical: 2,
    slaCompliance: 87.5,
    scheduledInstallations: 3,
    inProgressInstallations: 2,
    activeFieldJobs: 3,
    completedJobs: 4,
    totalInvoiced: 3264347,
    totalCollected: 1612716,
    outstanding: 1651631,
    overdueInvoices: 2,
  };

  const trends = {
    contracts: '+12%',
    tickets: '+8%',
    revenue: '+15%',
    sla: '-3%',
  };

  const recentTickets = [
    { id: 'TICKET-2025-000123', customer: 'Sharma Kitchens', priority: 'P1', issue: 'Chimney motor not working', timeLeft: '1h 30m', status: 'in_progress' },
    { id: 'TICKET-2025-000118', customer: 'Prestige Developers', priority: 'P2', issue: 'Oven temperature issue', timeLeft: '8h 15m', status: 'acknowledged' },
    { id: 'TICKET-2025-000134', customer: 'Modern Living', priority: 'P2', issue: 'Chimney suction reduced', timeLeft: '12h 45m', status: 'open' },
  ];

  const upcomingInstallations = [
    { id: 'INS-2025-00118', customer: 'Prestige Developers', date: '2025-10-19', team: 'Vijay Patil', items: 5 },
    { id: 'INS-2025-00142', customer: 'Elite Contractors', date: '2025-10-20', team: 'Vijay Patil', items: 3 },
    { id: 'INS-2025-00101', customer: 'Signature Interiors', date: '2025-10-21', team: 'Arun Reddy', items: 4 },
  ];

  const revenueData = [
    { month: 'Apr', amount: 245000 },
    { month: 'May', amount: 312000 },
    { month: 'Jun', amount: 289000 },
    { month: 'Jul', amount: 356000 },
    { month: 'Aug', amount: 421000 },
    { month: 'Sep', amount: 389000 },
    { month: 'Oct', amount: 458000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const priorityColors: Record<string, string> = {
    'P1': 'bg-red-100 text-red-700 border-red-300',
    'P2': 'bg-orange-100 text-orange-700 border-orange-300',
    'P3': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Contracts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/after-sales-service/service-contracts')}>
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {trends.contracts}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Contracts</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeContracts}</p>
          <p className="text-sm text-gray-600">{formatCurrency(stats.contractValue)} value</p>
          {stats.expiringIn30Days > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-orange-600 font-medium">{stats.expiringIn30Days} expiring in 30 days</p>
            </div>
          )}
        </div>

        {/* Warranties */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/after-sales-service/warranties')}>
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <span className="text-sm text-blue-600 font-medium">Active</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Warranties</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeWarranties}</p>
          <p className="text-sm text-gray-600">{stats.totalClaims} total claims</p>
        </div>

        {/* Service Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/after-sales-service/service-requests')}>
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {trends.tickets}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Open Tickets</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.openTickets}</p>
          <p className="text-sm text-gray-600">SLA: {stats.slaCompliance}% compliant</p>
          {stats.p1Critical > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-red-600 font-medium">{stats.p1Critical} P1 Critical issues</p>
            </div>
          )}
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/after-sales-service/billing')}>
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {trends.revenue}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalInvoiced)}</p>
          <p className="text-sm text-gray-600">Collected: {formatCurrency(stats.totalCollected)}</p>
          {stats.outstanding > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-red-600 font-medium">Outstanding: {formatCurrency(stats.outstanding)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Installations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledInstallations}</p>
            </div>
            <Wrench className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgressInstallations}</p>
            </div>
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Field Jobs</p>
              <p className="text-2xl font-bold text-cyan-600">{stats.activeFieldJobs}</p>
            </div>
            <Navigation className="h-6 w-6 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 7 Months)</h2>
            <button
              onClick={() => router.push('/after-sales-service/dashboard/analytics')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t relative group">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${(data.amount / maxRevenue) * 200}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {formatCurrency(data.amount)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Compliance Gauge */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">SLA Compliance</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={stats.slaCompliance >= 90 ? '#10B981' : stats.slaCompliance >= 75 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="12"
                  strokeDasharray={`${(stats.slaCompliance / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.slaCompliance}%</p>
                  <p className="text-xs text-gray-600 mt-1">Compliant</p>
                </div>
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium text-gray-900">95%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${stats.slaCompliance >= 90 ? 'text-green-600' : stats.slaCompliance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {stats.slaCompliance >= 90 ? 'Good' : stats.slaCompliance >= 75 ? 'Fair' : 'Poor'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Recent Service Requests
            </h2>
            <button
              onClick={() => router.push('/after-sales-service/service-requests')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.customer}</p>
                  <p className="text-xs text-gray-500 mt-1">{ticket.issue}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-orange-600 font-medium">{ticket.timeLeft}</p>
                  <p className="text-xs text-gray-500 mt-1">{ticket.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Installations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              Upcoming Installations
            </h2>
            <button
              onClick={() => router.push('/after-sales-service/installations')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingInstallations.map((install) => (
              <div key={install.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{install.id}</span>
                  </div>
                  <p className="text-sm text-gray-600">{install.customer}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {install.team}
                    </span>
                    <span>{install.items} items</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-blue-600">
                    {new Date(install.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
