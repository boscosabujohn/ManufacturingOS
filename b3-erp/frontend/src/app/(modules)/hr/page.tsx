'use client';

import React, { useState } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  UserPlus,
  FileText,
  BarChart3,
  Award,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveToday: number;
  pendingApprovals: number;
  monthlyPayroll: number;
  averageSalary: number;
  newHiresThisMonth: number;
  attritionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'leave' | 'attendance' | 'payroll' | 'recruitment';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
}

export default function HRDashboardPage() {
  const router = useRouter();

  // Sample dashboard data
  const stats: DashboardStats = {
    totalEmployees: 245,
    activeEmployees: 238,
    onLeaveToday: 12,
    pendingApprovals: 8,
    monthlyPayroll: 18500000,
    averageSalary: 75000,
    newHiresThisMonth: 5,
    attritionRate: 8.5
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'leave',
      title: 'Leave Request',
      description: 'John Doe requested leave from Jan 25 to Jan 27',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'payroll',
      title: 'Payroll Processed',
      description: 'January 2025 payroll has been processed successfully',
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'recruitment',
      title: 'New Employee Onboarded',
      description: 'Sarah Wilson joined as Senior Developer',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'attendance',
      title: 'Attendance Report',
      description: 'Weekly attendance report generated',
      timestamp: '2 days ago',
      status: 'completed'
    }
  ];

  const departmentStats = [
    { name: 'Engineering', count: 85, color: 'from-blue-500 to-blue-600' },
    { name: 'Sales', count: 45, color: 'from-green-500 to-green-600' },
    { name: 'Operations', count: 52, color: 'from-purple-500 to-purple-600' },
    { name: 'HR & Admin', count: 28, color: 'from-orange-500 to-orange-600' },
    { name: 'Finance', count: 22, color: 'from-cyan-500 to-cyan-600' },
    { name: 'Others', count: 13, color: 'from-pink-500 to-pink-600' }
  ];

  const upcomingEvents = [
    { title: 'Performance Reviews', date: '2025-02-01', type: 'review' },
    { title: 'Town Hall Meeting', date: '2025-02-05', type: 'meeting' },
    { title: 'Training: Leadership', date: '2025-02-10', type: 'training' },
    { title: 'Team Building Activity', date: '2025-02-15', type: 'event' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return Calendar;
      case 'attendance':
        return Clock;
      case 'payroll':
        return DollarSign;
      case 'recruitment':
        return UserPlus;
      default:
        return FileText;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      completed: 'bg-blue-500/20 text-blue-400',
      rejected: 'bg-red-500/20 text-red-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Human Resources Dashboard</h1>
            <p className="text-gray-400">Manage workforce, payroll, and employee lifecycle</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/hr/employees/add')}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => router.push('/hr/employees')}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.totalEmployees}</div>
            <div className="text-blue-100 text-sm">Total Employees</div>
            <div className="mt-2 text-xs text-blue-100">{stats.activeEmployees} active</div>
          </div>

          <div
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => router.push('/hr/attendance')}
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.onLeaveToday}</div>
            <div className="text-green-100 text-sm">On Leave Today</div>
            <div className="mt-2 text-xs text-green-100">
              {((stats.onLeaveToday / stats.totalEmployees) * 100).toFixed(1)}% of workforce
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => router.push('/hr/payroll')}
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(stats.monthlyPayroll)}</div>
            <div className="text-purple-100 text-sm">Monthly Payroll</div>
            <div className="mt-2 text-xs text-purple-100">
              Avg: {formatCurrency(stats.averageSalary)}
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => router.push('/hr/leave')}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.pendingApprovals}</div>
            <div className="text-orange-100 text-sm">Pending Approvals</div>
            <div className="mt-2 text-xs text-orange-100">Requires action</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.newHiresThisMonth}</div>
                  <div className="text-sm text-gray-400">New Hires</div>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-xs text-gray-500">This month</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.attritionRate}%</div>
                  <div className="text-sm text-gray-400">Attrition Rate</div>
                </div>
              </div>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-xs text-gray-500">Last 12 months</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Active Rate</div>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-xs text-gray-500">Currently active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Department Distribution
            </h3>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{dept.name}</span>
                    <span className="text-gray-400 text-sm">{dept.count} employees</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${dept.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {((dept.count / stats.totalEmployees) * 100).toFixed(1)}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
                  >
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white text-sm font-medium">{activity.title}</h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{activity.description}</p>
                      <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/hr/employees')}
              className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-white text-sm font-medium">Manage Employees</span>
            </button>
            <button
              onClick={() => router.push('/hr/attendance')}
              className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
            >
              <Clock className="w-8 h-8 text-green-400" />
              <span className="text-white text-sm font-medium">Attendance</span>
            </button>
            <button
              onClick={() => router.push('/hr/leave')}
              className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
            >
              <Calendar className="w-8 h-8 text-purple-400" />
              <span className="text-white text-sm font-medium">Leave Management</span>
            </button>
            <button
              onClick={() => router.push('/hr/payroll')}
              className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
            >
              <DollarSign className="w-8 h-8 text-orange-400" />
              <span className="text-white text-sm font-medium">Payroll</span>
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-colors"
              >
                <div className="text-indigo-400 text-xs font-medium mb-2">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <h4 className="text-white font-medium mb-1">{event.title}</h4>
                <div className="text-gray-400 text-xs capitalize">{event.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
