'use client'

import { useState } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, Clock, DollarSign, TrendingUp, Settings, Mail, MessageSquare } from 'lucide-react'

interface Alert {
  id: string
  title: string
  message: string
  type: 'critical' | 'warning' | 'info' | 'success'
  category: 'payment' | 'approval' | 'budget' | 'compliance' | 'reconciliation' | 'threshold'
  timestamp: string
  read: boolean
  actionRequired: boolean
  relatedTo: string
  priority: 'high' | 'medium' | 'low'
}

interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: string
  condition: string
  recipients: string[]
  channels: ('email' | 'sms' | 'in_app')[]
  status: 'active' | 'paused'
  frequency: string
}

export default function AlertsNotificationsPage() {
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Payment Overdue',
      message: 'Invoice INV-2025-456 is overdue by 15 days. Amount: ₹2,50,000',
      type: 'critical',
      category: 'payment',
      timestamp: '2025-10-18 14:30:00',
      read: false,
      actionRequired: true,
      relatedTo: 'INV-2025-456',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Approval Pending',
      message: 'Journal Entry JE-2025-789 requires your approval. Amount: ₹5,00,000',
      type: 'warning',
      category: 'approval',
      timestamp: '2025-10-18 13:45:00',
      read: false,
      actionRequired: true,
      relatedTo: 'JE-2025-789',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Budget Threshold Exceeded',
      message: 'Marketing department has exceeded 90% of monthly budget',
      type: 'warning',
      category: 'budget',
      timestamp: '2025-10-18 12:15:00',
      read: false,
      actionRequired: false,
      relatedTo: 'DEPT-MKT',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Bank Reconciliation Complete',
      message: 'HDFC Bank account reconciliation for October 2025 completed successfully',
      type: 'success',
      category: 'reconciliation',
      timestamp: '2025-10-18 10:00:00',
      read: true,
      actionRequired: false,
      relatedTo: 'RECON-2025-10',
      priority: 'low'
    },
    {
      id: '5',
      title: 'GST Filing Reminder',
      message: 'GSTR-3B filing due in 5 days for September 2025',
      type: 'warning',
      category: 'compliance',
      timestamp: '2025-10-18 09:00:00',
      read: false,
      actionRequired: true,
      relatedTo: 'GST-SEP-2025',
      priority: 'high'
    },
    {
      id: '6',
      title: 'Large Transaction Detected',
      message: 'Payment of ₹15,00,000 posted to vendor ABC Suppliers Ltd',
      type: 'info',
      category: 'threshold',
      timestamp: '2025-10-18 08:30:00',
      read: true,
      actionRequired: false,
      relatedTo: 'PAY-2025-123',
      priority: 'medium'
    }
  ])

  const [notificationRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Invoice Overdue Alert',
      description: 'Notify when invoices are overdue by more than 7 days',
      trigger: 'Daily at 9:00 AM',
      condition: 'Due date > 7 days past',
      recipients: ['accounts@company.com', 'manager@company.com'],
      channels: ['email', 'in_app'],
      status: 'active',
      frequency: 'Daily'
    },
    {
      id: '2',
      name: 'Approval Queue Alert',
      description: 'Notify approvers when items are pending approval',
      trigger: 'Real-time on submission',
      condition: 'Status = Pending Approval',
      recipients: ['cfo@company.com', 'controller@company.com'],
      channels: ['email', 'sms', 'in_app'],
      status: 'active',
      frequency: 'Real-time'
    },
    {
      id: '3',
      name: 'Budget Variance Alert',
      description: 'Alert when department budget variance exceeds threshold',
      trigger: 'Weekly on Monday 8:00 AM',
      condition: 'Variance > 10%',
      recipients: ['budget@company.com', 'dept-heads@company.com'],
      channels: ['email', 'in_app'],
      status: 'active',
      frequency: 'Weekly'
    },
    {
      id: '4',
      name: 'Large Transaction Alert',
      description: 'Notify on transactions exceeding ₹10,00,000',
      trigger: 'Real-time on posting',
      condition: 'Amount > ₹10,00,000',
      recipients: ['cfo@company.com', 'audit@company.com'],
      channels: ['email', 'sms', 'in_app'],
      status: 'active',
      frequency: 'Real-time'
    },
    {
      id: '5',
      name: 'Compliance Deadline Reminder',
      description: 'Remind about upcoming tax and regulatory filings',
      trigger: '5 days before deadline',
      condition: 'Due date within 5 days',
      recipients: ['tax@company.com', 'compliance@company.com'],
      channels: ['email', 'in_app'],
      status: 'active',
      frequency: 'As scheduled'
    }
  ])

  const [stats] = useState({
    totalAlerts: 24,
    unreadAlerts: 8,
    criticalAlerts: 3,
    actionRequired: 5,
    activeRules: 12,
    alertsToday: 6
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'warning': return <Bell className="h-5 w-5 text-yellow-600" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'success': return 'bg-green-50 border-green-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'bg-red-100 text-red-700'
      case 'approval': return 'bg-purple-100 text-purple-700'
      case 'budget': return 'bg-orange-100 text-orange-700'
      case 'compliance': return 'bg-blue-100 text-blue-700'
      case 'reconciliation': return 'bg-green-100 text-green-700'
      case 'threshold': return 'bg-cyan-100 text-cyan-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600 mt-1">Smart notification system for financial events</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700">
            <Settings className="h-5 w-5" />
            Configure Rules
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-6 w-6 text-rose-600" />
              <span className="text-sm text-gray-600">Total Alerts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Unread</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.unreadAlerts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="text-sm text-gray-600">Critical</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-orange-600" />
              <span className="text-sm text-gray-600">Action Required</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.actionRequired}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Active Rules</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeRules}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.alertsToday}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
            {alerts.map((alert) => (
              <div key={alert.id} className={`rounded-xl shadow-sm border-2 p-5 ${getAlertColor(alert.type)} ${!alert.read ? 'ring-2 ring-offset-2 ring-rose-500' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-xs text-gray-600">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(alert.category)}`}>
                      {alert.category.toUpperCase()}
                    </span>
                    {alert.actionRequired && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        ACTION
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Related to: <span className="font-mono font-semibold">{alert.relatedTo}</span></span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white">
                      Dismiss
                    </button>
                    {alert.actionRequired && (
                      <button className="px-3 py-1 text-xs bg-rose-600 text-white rounded hover:bg-rose-700">
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Notification Rules</h2>
            {notificationRules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {rule.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Trigger:</span>
                      <span className="text-gray-900 ml-1">{rule.trigger}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className="text-gray-900 ml-1">{rule.condition}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Channels:</p>
                    <div className="flex gap-2">
                      {rule.channels.map((channel) => (
                        <span key={channel} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {channel === 'email' && <Mail className="h-3 w-3" />}
                          {channel === 'sms' && <MessageSquare className="h-3 w-3" />}
                          {channel === 'in_app' && <Bell className="h-3 w-3" />}
                          {channel.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Recipients: {rule.recipients.length}</p>
                    <div className="flex flex-wrap gap-1">
                      {rule.recipients.map((recipient, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    Edit Rule
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Notification Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Event-Based Triggers</h4>
              <ul className="space-y-1 text-sm">
                <li>• Payment due date reminders</li>
                <li>• Budget threshold violations</li>
                <li>• Approval workflow alerts</li>
                <li>• Compliance deadline reminders</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Multi-Channel Delivery</h4>
              <ul className="space-y-1 text-sm">
                <li>• In-app notifications</li>
                <li>• Email alerts with attachments</li>
                <li>• SMS for critical alerts</li>
                <li>• Mobile push notifications</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Smart Features</h4>
              <ul className="space-y-1 text-sm">
                <li>• Role-based notification routing</li>
                <li>• Escalation workflows</li>
                <li>• Digest mode for batch alerts</li>
                <li>• Custom notification templates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
