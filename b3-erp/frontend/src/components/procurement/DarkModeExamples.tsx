'use client'

import React, { useState } from 'react'
import {
  ThemeProvider,
  ThemeToggle,
  ThemeSettingsPanel,
  ThemeAware,
  ColorSchemeStyles,
  useTheme
} from './DarkModeTheme'
import { Card, Button, Badge, Modal } from './ui'
import {
  ShoppingCart, Users, TrendingUp, DollarSign, Calendar, Package,
  Settings, Bell, Search, Filter, Download, Plus, Edit, Trash2,
  Eye, Mail, Phone, MapPin, Star, Clock, CheckCircle, AlertTriangle,
  FileText, BarChart3, PieChart, Activity, Zap, Award, Target
} from 'lucide-react'

// ============= Dark Mode Dashboard Example =============
export const DarkModeDashboard: React.FC = () => {
  const { isDark } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  const kpiData = [
    {
      title: 'Total Spend',
      value: '$2.4M',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Active Vendors',
      value: '147',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Open Orders',
      value: '89',
      change: '-8%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'orange'
    },
    {
      title: 'Cost Savings',
      value: '28%',
      change: '+3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const recentActivities = [
    { id: 1, type: 'order', description: 'PO-2024-001 approved by Finance', time: '5 minutes ago', icon: CheckCircle, color: 'green' },
    { id: 2, type: 'vendor', description: 'New vendor ABC Corp added', time: '1 hour ago', icon: Users, color: 'blue' },
    { id: 3, type: 'alert', description: 'Delivery delayed for PO-2024-002', time: '2 hours ago', icon: AlertTriangle, color: 'yellow' },
    { id: 4, type: 'invoice', description: 'Invoice INV-001 processed', time: '3 hours ago', icon: FileText, color: 'purple' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ColorSchemeStyles />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Procurement Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening with your procurement.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="secondary"
                onClick={() => setShowSettings(true)}
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Theme Settings
              </Button>
              <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-3">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <ThemeAware
                key={index}
                lightClass="bg-white border-gray-200"
                darkClass="bg-gray-800 border-gray-700"
                className="border rounded-lg p-3 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </p>
                    <p className={`text-sm ${
                      kpi.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {kpi.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    kpi.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                    kpi.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                    kpi.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900' :
                    'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      kpi.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      kpi.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      kpi.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                </div>
              </ThemeAware>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <ThemeAware
              lightClass="bg-white border-gray-200"
              darkClass="bg-gray-800 border-gray-700"
              className="border rounded-lg"
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          activity.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                          activity.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                          activity.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            activity.color === 'green' ? 'text-green-600 dark:text-green-400' :
                            activity.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                            activity.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-purple-600 dark:text-purple-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </ThemeAware>
          </div>

          {/* Quick Actions */}
          <div>
            <ThemeAware
              lightClass="bg-white border-gray-200"
              darkClass="bg-gray-800 border-gray-700"
              className="border rounded-lg"
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: 'Create PO', icon: Plus, color: 'blue' },
                  { label: 'Add Vendor', icon: Users, color: 'green' },
                  { label: 'View Reports', icon: BarChart3, color: 'purple' },
                  { label: 'Settings', icon: Settings, color: 'gray' }
                ].map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        action.color === 'blue'
                          ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : action.color === 'green'
                          ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300'
                          : action.color === 'purple'
                          ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{action.label}</span>
                    </button>
                  )
                })}
              </div>
            </ThemeAware>
          </div>
        </div>
      </div>

      {/* Theme Settings Modal */}
      <ThemeSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}

// ============= Dark Mode Data Table Example =============
export const DarkModeDataTable: React.FC = () => {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')

  const vendors = [
    { id: 1, name: 'ABC Corporation', category: 'IT Services', status: 'Active', performance: 95, orders: 47, lastOrder: '2 days ago' },
    { id: 2, name: 'XYZ Industries', category: 'Manufacturing', status: 'Active', performance: 87, orders: 23, lastOrder: '1 week ago' },
    { id: 3, name: 'Tech Solutions Ltd', category: 'IT Services', status: 'Pending', performance: 92, orders: 15, lastOrder: '3 days ago' },
    { id: 4, name: 'Office Supplies Co', category: 'Office Materials', status: 'Active', performance: 78, orders: 89, lastOrder: '1 day ago' },
  ]

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ColorSchemeStyles />

      <ThemeAware
        lightClass="bg-white border-gray-200"
        darkClass="bg-gray-800 border-gray-700"
        className="border rounded-lg overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Management
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                {['Name', 'Category', 'Status', 'Performance', 'Orders', 'Last Order', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {vendor.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {vendor.category}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Badge
                      variant={vendor.status === 'Active' ? 'success' : 'warning'}
                    >
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                        {vendor.performance}%
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            vendor.performance >= 90
                              ? 'bg-green-500 dark:bg-green-400'
                              : vendor.performance >= 75
                              ? 'bg-yellow-500 dark:bg-yellow-400'
                              : 'bg-red-500 dark:bg-red-400'
                          }`}
                          style={{ width: `${vendor.performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {vendor.orders}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {vendor.lastOrder}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">Edit</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm">
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ThemeAware>
    </div>
  )
}

// ============= Dark Mode Form Example =============
export const DarkModeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vendor: '',
    priority: 'normal',
    department: '',
    deliveryDate: '',
    description: ''
  })

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ColorSchemeStyles />

      <div className="max-w-2xl">
        <ThemeAware
          lightClass="bg-white border-gray-200"
          darkClass="bg-gray-800 border-gray-700"
          className="border rounded-lg"
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Purchase Order
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fill in the details below to create a new purchase order
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor
                </label>
                <select
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="">Select a vendor</option>
                  <option value="abc">ABC Corporation</option>
                  <option value="xyz">XYZ Industries</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="">Select department</option>
                  <option value="it">IT Department</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter order description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Save as Draft
              </Button>
              <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
                Submit for Approval
              </Button>
            </div>
          </div>
        </ThemeAware>
      </div>
    </div>
  )
}

// ============= Complete Dark Mode Integration Example =============
export const CompleteDarkModeIntegration: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="space-y-8">
        <DarkModeDashboard />
        <DarkModeDataTable />
        <DarkModeForm />
      </div>
    </ThemeProvider>
  )
}