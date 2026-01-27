'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  Calendar,
  FileText,
  CreditCard,
  Building2,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  CircleDollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'receipt' | 'invoice' | 'bill' | 'forex' | 'approval';
  description: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  action?: string;
  link?: string;
}

export default function FinanceDashboard() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // Mock data for quick stats
  const quickStats: QuickStat[] = [
    {
      label: 'Total Receivables',
      value: '₹45.2L',
      change: '+12.5%',
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Total Payables',
      value: '₹82.5L',
      change: '-5.2%',
      trend: 'down',
      icon: <TrendingDown className="h-6 w-6" />,
      color: 'from-red-500 to-red-600'
    },
    {
      label: 'Cash Balance',
      value: '₹128.7L',
      change: '+8.3%',
      trend: 'up',
      icon: <Wallet className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Forex Exposure',
      value: '₹21.5K',
      change: '+2.1%',
      trend: 'up',
      icon: <CircleDollarSign className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Overdue Amount',
      value: '₹9.5L',
      change: '+15.3%',
      trend: 'up',
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Monthly Revenue',
      value: '₹156.8L',
      change: '+18.7%',
      trend: 'up',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  // Mock data for recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'payment',
      description: 'Payment to Steel Suppliers Pvt Ltd',
      amount: 425000,
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'receipt',
      description: 'Payment received from Acme Corp',
      amount: 850000,
      timestamp: '3 hours ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'forex',
      description: 'Forex gain on USD transaction',
      amount: 7000,
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'bill',
      description: 'New bill from Component Traders',
      amount: 350000,
      timestamp: '6 hours ago',
      status: 'pending'
    },
    {
      id: '5',
      type: 'invoice',
      description: 'Invoice issued to Global Tech Inc',
      amount: 1200000,
      timestamp: '1 day ago',
      status: 'completed'
    }
  ];

  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      message: '5 vendor bills are overdue by more than 90 days',
      action: 'View Details',
      link: '/finance/payables/aging'
    },
    {
      id: '2',
      type: 'warning',
      message: '12 customer invoices due within 7 days',
      action: 'Review',
      link: '/finance/receivables/aging'
    },
    {
      id: '3',
      type: 'warning',
      message: 'Unrealized forex loss of ₹15,000 detected',
      action: 'Revaluate',
      link: '/finance/currency/gain-loss'
    },
    {
      id: '4',
      type: 'info',
      message: 'Monthly financial statements ready for review',
      action: 'View Reports'
    }
  ];

  const financeModules = [
    {
      title: 'Accounts Receivable',
      description: 'Customer invoices, aging, and collections',
      icon: <Receipt className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      stats: '₹45.2L Outstanding',
      link: '/finance/receivables/aging',
      available: true
    },
    {
      title: 'Accounts Payable',
      description: 'Vendor bills, payments, and aging analysis',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      stats: '₹82.5L Outstanding',
      link: '/finance/payables/aging',
      available: true
    },
    {
      title: 'Forex Management',
      description: 'Foreign exchange gain/loss tracking',
      icon: <CircleDollarSign className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      stats: '15 Transactions',
      link: '/finance/currency/gain-loss',
      available: true
    },
    {
      title: 'General Ledger',
      description: 'Chart of accounts, journal entries',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-indigo-500 to-indigo-600',
      stats: '1,234 Entries',
      link: '/finance/accounting/chart-of-accounts',
      available: true
    },
    {
      title: 'Bank Reconciliation',
      description: 'Match transactions with bank statements',
      icon: <Building2 className="h-8 w-8" />,
      color: 'from-teal-500 to-teal-600',
      stats: '3 Accounts',
      link: '/finance/bank-reconciliation',
      available: true
    },
    {
      title: 'Reports & Analytics',
      description: 'Financial reports and insights',
      icon: <BarChart3 className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      stats: '12 Reports',
      link: '/finance/reports',
      available: true
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'receipt':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'invoice':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'bill':
        return <Receipt className="h-5 w-5 text-purple-600" />;
      case 'forex':
        return <CircleDollarSign className="h-5 w-5 text-indigo-600" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-red-50 border-red-200';
      case 'receipt':
        return 'bg-green-50 border-green-200';
      case 'invoice':
        return 'bg-blue-50 border-blue-200';
      case 'bill':
        return 'bg-purple-50 border-purple-200';
      case 'forex':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const handleModuleClick = (module: typeof financeModules[0]) => {
    if (module.available) {
      router.push(module.link);
    } else {
      alert(`${module.title} module is coming soon!\n\nThis feature will include:\n${module.description}`);
    }
  };

  const handleAlertAction = (alert: Alert) => {
    if (alert.link) {
      router.push(alert.link);
    } else if (alert.action) {
      window.alert(`Action: ${alert.action}\n\nThis will ${alert.action.toLowerCase()} for: ${alert.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              Finance Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive financial management and reporting • FY 2025-26
            </p>
          </div>
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="today">Today</option>
              <option value="current-week">This Week</option>
              <option value="current-month">This Month</option>
              <option value="current-quarter">This Quarter</option>
              <option value="current-year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      stat.trend === 'up'
                        ? 'text-green-600'
                        : stat.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            Alerts & Notifications
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 flex items-start justify-between ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-semibold">{alert.message}</p>
                  </div>
                </div>
                {alert.action && (
                  <button
                    onClick={() => handleAlertAction(alert)}
                    className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                      alert.type === 'critical'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : alert.type === 'warning'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {alert.action}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finance Modules Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="h-6 w-6 text-blue-600" />
          Finance Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeModules.map((module, index) => (
            <button
              key={index}
              onClick={() => handleModuleClick(module)}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 text-left hover:shadow-lg transition-all ${
                module.available
                  ? 'border-gray-200 hover:border-blue-400'
                  : 'border-gray-200 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${module.color} p-3 rounded-lg text-white`}>
                  {module.icon}
                </div>
                {!module.available && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                    Coming Soon
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{module.stats}</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600" />
            Recent Activity
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{activity.description}</p>
                  <p className="text-sm text-gray-600">{activity.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-gray-900">
                  ₹{activity.amount.toLocaleString('en-IN')}
                </p>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">New Invoice</span>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors">
            <Receipt className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Record Payment</span>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
