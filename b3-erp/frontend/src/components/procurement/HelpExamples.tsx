'use client'

import React, { useState } from 'react'
import {
  Tooltip, InfoTooltip, HelpTour, HelpPanel, QuickHelpButton,
  SmartHelpSuggestions, useContextualHelp, HelpStep
} from './TooltipsAndHelp'
import { Card, Button } from './ui'
import {
  ShoppingCart, Users, FileText, TrendingUp, Calendar,
  AlertTriangle, CheckCircle, Clock, DollarSign, Package,
  BarChart3, Settings, Eye, Download, Upload, Plus,
  Search, Filter, Edit, Trash2, Mail
} from 'lucide-react'

// ============= Purchase Order Help Integration =============
export const PurchaseOrderHelpExample: React.FC = () => {
  const [showTour, setShowTour] = useState(false)
  const { activeHelp, showHelp, hideHelp } = useContextualHelp()

  const tourSteps: HelpStep[] = [
    {
      id: 'step1',
      target: '[data-tour="po-form"]',
      title: 'Creating a Purchase Order',
      content: 'Start by filling out the basic information for your purchase order. Select a vendor from your approved vendor list.',
      position: 'bottom',
      spotlight: true
    },
    {
      id: 'step2',
      target: '[data-tour="add-items"]',
      title: 'Adding Items',
      content: 'Click here to add items to your purchase order. You can search for items from your catalog or create new ones.',
      position: 'left',
      spotlight: true
    },
    {
      id: 'step3',
      target: '[data-tour="approval-routing"]',
      title: 'Approval Routing',
      content: 'Configure who needs to approve this purchase order. The system will automatically route based on amount thresholds.',
      position: 'top',
      spotlight: true
    },
    {
      id: 'step4',
      target: '[data-tour="submit-button"]',
      title: 'Submit for Approval',
      content: 'Once all information is complete, submit your purchase order for approval. You\'ll receive notifications about its progress.',
      position: 'top',
      spotlight: true
    }
  ]

  const helpSuggestions = [
    {
      id: 'catalog-search',
      title: 'Use the item catalog',
      description: 'Search existing items before creating new ones to maintain consistency.',
      action: () => showHelp('catalog-help')
    },
    {
      id: 'vendor-approval',
      title: 'Check vendor approval status',
      description: 'Only use vendors from the approved vendor list to ensure compliance.',
      action: () => showHelp('vendor-help')
    },
    {
      id: 'budget-validation',
      title: 'Verify budget availability',
      description: 'Check if sufficient budget is available before creating large orders.',
      action: () => showHelp('budget-help')
    }
  ]

  return (
    <Card title="Purchase Order Creation" className="space-y-6">
      <SmartHelpSuggestions
        context="Purchase Order Creation"
        suggestions={helpSuggestions}
      />

      {/* Form Section with Tooltips */}
      <div data-tour="po-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <InfoTooltip content="Select from approved vendors only. Contact procurement team to add new vendors." />
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select a vendor</option>
            <option>ABC Corporation</option>
            <option>XYZ Industries</option>
          </select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <Tooltip
              content={
                <div>
                  <p className="font-medium mb-2">Priority Levels:</p>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-red-400">●</span> Urgent: 1-2 days</li>
                    <li><span className="text-yellow-400">●</span> High: 3-5 days</li>
                    <li><span className="text-green-400">●</span> Normal: 1-2 weeks</li>
                    <li><span className="text-gray-400">●</span> Low: 2-4 weeks</li>
                  </ul>
                </div>
              }
              interactive
            >
              <button className="text-blue-500 hover:text-blue-700">
                <AlertTriangle className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
            <InfoTooltip content="Expected delivery date. Factor in vendor lead times and internal processing." />
          </div>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <QuickHelpButton
              helpId="department-help"
              content="Select the department that will receive and use these items. This affects budget allocation."
            />
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>IT Department</option>
            <option>Operations</option>
            <option>Marketing</option>
          </select>
        </div>
      </div>

      {/* Items Section */}
      <div data-tour="add-items">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            <InfoTooltip content="Add items to your purchase order. Use the catalog search to find existing items." />
          </div>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center space-x-1">
                    <span>Item</span>
                    <InfoTooltip content="Item name and description. Use descriptive names for easier searching." size="sm" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    <InfoTooltip content="Order quantity. Consider minimum order quantities and bulk discounts." size="sm" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center space-x-1">
                    <span>Unit Price</span>
                    <Tooltip content="Price per unit. This should match the vendor's current pricing." trigger="hover">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Office Chairs - Ergonomic</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$299.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,499.95</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Tooltip content="Edit item details">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Remove item from order">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Section */}
      <div data-tour="approval-routing" className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <h3 className="text-lg font-medium text-gray-900">Approval Routing</h3>
          <Tooltip
            content={
              <div>
                <p className="font-medium mb-2">Automatic Approval Rules:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Under $1,000: Department Manager</li>
                  <li>• $1,000 - $5,000: Department + Finance</li>
                  <li>• $5,000 - $25,000: + Procurement Manager</li>
                  <li>• Over $25,000: + C-Level Executive</li>
                </ul>
              </div>
            }
            interactive
          >
            <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Department Manager</p>
              <p className="text-xs text-gray-600">John Smith</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div className="p-2 bg-yellow-100 rounded-full">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Finance Team</p>
              <p className="text-xs text-gray-600">Required for $1,500</p>
            </div>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border opacity-50">
            <div className="p-2 bg-gray-100 rounded-full">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Procurement Manager</p>
              <p className="text-xs text-gray-600">Not required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div data-tour="submit-button" className="flex justify-end space-x-3">
        <Button variant="secondary">Save as Draft</Button>
        <Button variant="primary" className="flex items-center space-x-2">
          <span>Submit for Approval</span>
          <InfoTooltip content="Submit your purchase order for approval. You'll receive email notifications about its progress." />
        </Button>
      </div>

      {/* Tour and Help Controls */}
      <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={() => setShowTour(true)}
          className="flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>Take a Tour</span>
        </Button>
      </div>

      {/* Help Tour Component */}
      <HelpTour
        steps={tourSteps}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Tour completed!')
          setShowTour(false)
        }}
        showProgress
        allowSkip
      />
    </Card>
  )
}

// ============= Vendor Management Help Integration =============
export const VendorManagementHelpExample: React.FC = () => {
  const [showHelpPanel, setShowHelpPanel] = useState(false)

  const helpTopics = [
    {
      id: 'adding-vendors',
      title: 'Adding New Vendors',
      icon: <Plus className="h-4 w-4 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p>To add a new vendor to the system:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the "Add Vendor" button</li>
            <li>Fill in the vendor's basic information</li>
            <li>Upload required documents (business license, insurance, etc.)</li>
            <li>Set up contact information and payment terms</li>
            <li>Submit for approval</li>
          </ol>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> New vendors must be approved before they can be used in purchase orders.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'vendor-evaluation',
      title: 'Vendor Performance Evaluation',
      icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p>Vendor performance is evaluated based on:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>On-time delivery rate</li>
            <li>Quality of goods/services</li>
            <li>Pricing competitiveness</li>
            <li>Communication responsiveness</li>
            <li>Compliance with terms</li>
          </ul>
          <p>Performance scores are updated monthly and available in the vendor dashboard.</p>
        </div>
      )
    },
    {
      id: 'vendor-approval',
      title: 'Vendor Approval Process',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p>The vendor approval process includes:</p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">1</div>
              <div>
                <p className="font-medium">Document Review</p>
                <p className="text-sm text-gray-600">Legal and compliance team reviews all submitted documents</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">2</div>
              <div>
                <p className="font-medium">Background Check</p>
                <p className="text-sm text-gray-600">Financial stability and reputation verification</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</div>
              <div>
                <p className="font-medium">Final Approval</p>
                <p className="text-sm text-gray-600">Procurement manager gives final approval</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <Card title="Vendor Management" className="space-y-6">
      {/* Header with Help */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Active Vendors</h2>
          <Tooltip content="View all active vendors in your system. Use filters to find specific vendors quickly.">
            <button className="text-gray-400 hover:text-blue-500">
              <AlertTriangle className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowHelpPanel(true)}
            className="flex items-center space-x-2"
          >
            <span>Help</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters with Help */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <InfoTooltip content="Search by vendor name, ID, or contact information" size="sm" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Tooltip content="Filter vendors by their current approval and activity status">
              <Filter className="h-4 w-4 text-gray-400" />
            </Tooltip>
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <InfoTooltip content="Filter by vendor category or industry type" size="sm" />
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>IT Services</option>
            <option>Office Supplies</option>
            <option>Manufacturing</option>
          </select>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Performance</label>
            <Tooltip
              content={
                <div>
                  <p className="font-medium mb-2">Performance Ratings:</p>
                  <ul className="space-y-1 text-sm">
                    <li>🟢 Excellent: 90-100%</li>
                    <li>🟡 Good: 75-89%</li>
                    <li>🟠 Fair: 60-74%</li>
                    <li>🔴 Poor: Below 60%</li>
                  </ul>
                </div>
              }
              interactive
            >
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </Tooltip>
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Ratings</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards with Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((vendor) => (
          <div key={vendor} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">ABC Corporation</h3>
                <p className="text-sm text-gray-600">IT Services & Solutions</p>
              </div>
              <div className="flex items-center space-x-1">
                <Tooltip content="Excellent performance rating (95%)">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </Tooltip>
                <Tooltip content="Active vendor status">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </Tooltip>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">On-time Delivery:</span>
                <Tooltip content="Based on last 30 deliveries">
                  <span className="font-medium text-green-600">95%</span>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Orders:</span>
                <Tooltip content="Total orders placed this year">
                  <span className="font-medium">47</span>
                </Tooltip>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Order:</span>
                <span className="font-medium">2 days ago</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip content="View vendor details and performance metrics">
                <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100">
                  View Details
                </button>
              </Tooltip>
              <Tooltip content="Send message to vendor contact">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Email</span>
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        topics={helpTopics}
      />
    </Card>
  )
}

// ============= Analytics Dashboard Help Integration =============
export const AnalyticsDashboardHelpExample: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const kpiHelpContent = {
    totalSpend: (
      <div>
        <p className="font-medium mb-2">Total Procurement Spend</p>
        <p className="text-sm">Sum of all purchase orders and invoices for the selected period.</p>
        <p className="text-sm mt-2 text-blue-600">Click to view detailed spending breakdown</p>
      </div>
    ),
    savings: (
      <div>
        <p className="font-medium mb-2">Cost Savings</p>
        <p className="text-sm">Savings achieved through negotiations, bulk purchases, and contract optimization.</p>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Contract negotiations: 15%</li>
          <li>• Bulk purchasing: 8%</li>
          <li>• Vendor optimization: 5%</li>
        </ul>
      </div>
    ),
    avgDelivery: (
      <div>
        <p className="font-medium mb-2">Average Delivery Time</p>
        <p className="text-sm">Average time from PO creation to goods receipt.</p>
        <p className="text-sm mt-2">
          <span className="text-green-600">Target: ≤ 10 days</span><br />
          <span className="text-gray-600">Industry avg: 12 days</span>
        </p>
      </div>
    ),
    vendorPerformance: (
      <div>
        <p className="font-medium mb-2">Vendor Performance Score</p>
        <p className="text-sm">Composite score based on delivery, quality, and service.</p>
        <div className="text-sm mt-2 space-y-1">
          <div>🟢 Excellent: 4 vendors</div>
          <div>🟡 Good: 12 vendors</div>
          <div>🟠 Fair: 3 vendors</div>
        </div>
      </div>
    )
  }

  return (
    <Card title="Procurement Analytics" className="space-y-6">
      {/* Header with Help */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
          <InfoTooltip
            content="Real-time procurement analytics and performance metrics. Data updates every hour."
          />
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip content="Download analytics report as PDF">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Download</span>
            </button>
          </Tooltip>
          <Tooltip content="Configure dashboard widgets and metrics">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Settings</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* KPI Cards with Interactive Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tooltip content={kpiHelpContent.totalSpend} interactive maxWidth="300px">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content={kpiHelpContent.savings} interactive maxWidth="300px">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-gray-900">$180K</p>
                <p className="text-sm text-green-600">28% savings rate</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content={kpiHelpContent.avgDelivery} interactive maxWidth="300px">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
                <p className="text-2xl font-bold text-gray-900">8.5 days</p>
                <p className="text-sm text-green-600">2 days under target</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content={kpiHelpContent.vendorPerformance} interactive maxWidth="300px">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendor Score</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600">Above industry avg</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Chart Section with Help */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Spending Trends</h3>
            <Tooltip
              content={
                <div>
                  <p className="font-medium mb-2">Spending Analysis</p>
                  <p className="text-sm">Monthly spending breakdown by category.</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Blue: Direct materials</li>
                    <li>• Green: Services</li>
                    <li>• Yellow: Indirect costs</li>
                  </ul>
                </div>
              }
              interactive
            >
              <AlertTriangle className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center space-x-2">
            <InfoTooltip content="Switch between different chart views and time periods" />
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </div>

        {/* Placeholder chart area */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would appear here</p>
            <p className="text-sm text-gray-400">Hover over data points for detailed information</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============= Complete Help Integration Example =============
export const CompleteHelpIntegrationExample: React.FC = () => {
  return (
    <div className="space-y-8">
      <PurchaseOrderHelpExample />
      <VendorManagementHelpExample />
      <AnalyticsDashboardHelpExample />
    </div>
  )
}