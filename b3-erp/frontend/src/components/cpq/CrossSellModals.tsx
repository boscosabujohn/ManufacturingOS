'use client'

import { useState } from 'react'
import { X, Plus, Target, TrendingUp, BarChart3, Calendar, Users, Package, DollarSign, Send } from 'lucide-react'

export interface CrossSellOpportunity {
  id: string
  primaryProduct: {
    code: string
    name: string
    category: string
    value: number
  }
  suggestedProduct: {
    code: string
    name: string
    category: string
    value: number
  }
  relationship: 'complement' | 'essential' | 'upgrade' | 'bundle'
  coOccurrenceRate: number
  avgAdditionalRevenue: number
  conversionRate: number
  customersCount: number
  totalOpportunityValue: number
  recommendationStrength: 'strong' | 'medium' | 'weak'
  activeCampaigns: number
  lastUpdated: string
}

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: CrossSellOpportunity
}

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (campaign: any) => void
  opportunity?: CrossSellOpportunity
}

export function AnalyticsModal({ isOpen, onClose, opportunity }: AnalyticsModalProps) {
  if (!isOpen) return null

  const performanceData = [
    { month: 'Jan', conversions: 12, revenue: 145000 },
    { month: 'Feb', conversions: 18, revenue: 198000 },
    { month: 'Mar', conversions: 15, revenue: 167000 },
    { month: 'Apr', conversions: 22, revenue: 242000 },
    { month: 'May', conversions: 19, revenue: 208000 },
    { month: 'Jun', conversions: 25, revenue: 287000 },
  ]

  const topCustomers = [
    { name: 'Rajesh & Priya Sharma', purchases: 3, value: 45000 },
    { name: 'Amit Patel', purchases: 2, value: 38000 },
    { name: 'Neha Gupta', purchases: 2, value: 32000 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cross-Sell Analytics</h2>
            <p className="text-sm text-gray-600">
              {opportunity.primaryProduct.name} → {opportunity.suggestedProduct.name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Co-Occurrence</span>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{opportunity.coOccurrenceRate.toFixed(1)}%</div>
              <div className="text-xs text-blue-700 mt-1">Purchase together rate</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Conversion Rate</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">{opportunity.conversionRate.toFixed(1)}%</div>
              <div className="text-xs text-green-700 mt-1">Recommendation success</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900">Customers</span>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{opportunity.customersCount}</div>
              <div className="text-xs text-purple-700 mt-1">Potential targets</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-900">Total Value</span>
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900">₹{(opportunity.totalOpportunityValue / 100000).toFixed(1)}L</div>
              <div className="text-xs text-orange-700 mt-1">Revenue potential</div>
            </div>
          </div>

          {/* Product Pairing Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Pairing Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-blue-700 mb-2">Primary Product</div>
                <h4 className="font-semibold text-gray-900 mb-1">{opportunity.primaryProduct.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{opportunity.primaryProduct.code}</span>
                  <span>•</span>
                  <span className="font-medium text-blue-900">₹{opportunity.primaryProduct.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-2">Suggested Product</div>
                <h4 className="font-semibold text-gray-900 mb-1">{opportunity.suggestedProduct.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{opportunity.suggestedProduct.code}</span>
                  <span>•</span>
                  <span className="font-medium text-green-900">₹{opportunity.suggestedProduct.value.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Relationship</div>
                <div className="text-sm font-semibold text-gray-900 capitalize">{opportunity.relationship}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Strength</div>
                <div className="text-sm font-semibold text-gray-900 capitalize">{opportunity.recommendationStrength}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Avg Additional Revenue</div>
                <div className="text-sm font-semibold text-gray-900">₹{(opportunity.avgAdditionalRevenue / 1000).toFixed(1)}K</div>
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Performance Trend</h3>
            <div className="space-y-4">
              {performanceData.map((data) => (
                <div key={data.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Conversions: {data.conversions}</span>
                      <span>Revenue: ₹{(data.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full"
                        style={{ width: `${(data.conversions / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers for This Pairing</h3>
            <div className="space-y-3">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-600">{customer.purchases} purchases</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-900">₹{customer.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Total value</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• This pairing shows <strong>strong correlation</strong> with {opportunity.coOccurrenceRate.toFixed(0)}% co-occurrence rate</li>
                  <li>• Conversion rate is <strong>{opportunity.conversionRate > 70 ? 'above' : 'at'} industry average</strong> of 65%</li>
                  <li>• Peak performance in <strong>April-June</strong> quarter - consider seasonal campaigns</li>
                  <li>• Target customers who purchased primary product in <strong>last 30 days</strong> for best results</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateCampaignModal({ isOpen, onClose, onSave, opportunity }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    targetAudience: 'all' as 'all' | 'recent-buyers' | 'high-value' | 'custom',
    customSegment: '',
    offerType: 'discount' as 'discount' | 'bundle' | 'free-shipping' | 'buy-one-get-one',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryChannels: {
      email: true,
      sms: false,
      whatsapp: false,
      inApp: true
    },
    budget: 50000,
    autoSend: false,
    trackingEnabled: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.campaignName.trim()) newErrors.campaignName = 'Campaign name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const campaign = {
      id: `CAMP${Date.now()}`,
      ...formData,
      primaryProduct: opportunity?.primaryProduct,
      suggestedProduct: opportunity?.suggestedProduct,
      status: 'scheduled',
      createdDate: new Date().toISOString().split('T')[0]
    }

    onSave(campaign)
    alert(`Campaign "${formData.campaignName}" created successfully!`)
    onClose()
  }

  const estimatedReach = opportunity
    ? Math.floor(opportunity.customersCount * (formData.targetAudience === 'all' ? 1 : 0.6))
    : 0

  const estimatedConversions = opportunity
    ? Math.floor(estimatedReach * (opportunity.conversionRate / 100))
    : 0

  const estimatedRevenue = opportunity
    ? estimatedConversions * opportunity.avgAdditionalRevenue
    : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Cross-Sell Campaign</h2>
            <p className="text-sm text-gray-600">
              {opportunity
                ? `${opportunity.primaryProduct.name} → ${opportunity.suggestedProduct.name}`
                : 'New campaign'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Basics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Campaign Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.campaignName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Sink & Faucet Bundle Offer"
              />
              {errors.campaignName && (
                <p className="text-red-500 text-sm mt-1">{errors.campaignName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the campaign and its goals"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Target Audience</h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="all"
                  checked={formData.targetAudience === 'all'}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">All Customers</div>
                  <div className="text-xs text-gray-600">Everyone who bought primary product</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="recent-buyers"
                  checked={formData.targetAudience === 'recent-buyers'}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Recent Buyers</div>
                  <div className="text-xs text-gray-600">Purchased in last 30 days</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="high-value"
                  checked={formData.targetAudience === 'high-value'}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">High Value</div>
                  <div className="text-xs text-gray-600">Customers with high LTV</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="targetAudience"
                  value="custom"
                  checked={formData.targetAudience === 'custom'}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Custom Segment</div>
                  <div className="text-xs text-gray-600">Define custom criteria</div>
                </div>
              </label>
            </div>

            {formData.targetAudience === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Segment</label>
                <input
                  type="text"
                  value={formData.customSegment}
                  onChange={(e) => setFormData({ ...formData, customSegment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Luxury Residential, Budget >5L"
                />
              </div>
            )}
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Offer Configuration</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="discount">Percentage Discount</option>
                  <option value="bundle">Bundle Pricing</option>
                  <option value="free-shipping">Free Shipping</option>
                  <option value="buy-one-get-one">Buy One Get One</option>
                </select>
              </div>

              {formData.offerType === 'discount' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Campaign Duration</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Delivery Channels</h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.deliveryChannels.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryChannels: { ...formData.deliveryChannels, email: e.target.checked }
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.deliveryChannels.sms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryChannels: { ...formData.deliveryChannels, sms: e.target.checked }
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">SMS</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.deliveryChannels.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryChannels: { ...formData.deliveryChannels, whatsapp: e.target.checked }
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.deliveryChannels.inApp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryChannels: { ...formData.deliveryChannels, inApp: e.target.checked }
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In-App Notification</span>
              </label>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Budget (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.autoSend}
                onChange={(e) => setFormData({ ...formData, autoSend: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-send on start date</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.trackingEnabled}
                onChange={(e) => setFormData({ ...formData, trackingEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable campaign tracking & analytics</span>
            </label>
          </div>

          {/* Estimated Performance */}
          {opportunity && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Estimated Campaign Performance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Est. Reach</div>
                  <div className="text-2xl font-bold text-gray-900">{estimatedReach}</div>
                  <div className="text-xs text-gray-600 mt-1">customers</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Est. Conversions</div>
                  <div className="text-2xl font-bold text-green-900">{estimatedConversions}</div>
                  <div className="text-xs text-gray-600 mt-1">sales</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Est. Revenue</div>
                  <div className="text-2xl font-bold text-emerald-900">₹{(estimatedRevenue / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-gray-600 mt-1">additional revenue</div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
