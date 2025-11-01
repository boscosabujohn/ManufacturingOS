'use client'

import { useState } from 'react'
import { X, Send, ShoppingCart, CheckCircle2, User, Package, TrendingUp, AlertTriangle } from 'lucide-react'

export interface Recommendation {
  id: string
  customerId: string
  customerName: string
  segment: string
  productCode: string
  productName: string
  category: string
  recommendationType: 'best-match' | 'upgrade' | 'alternative' | 'frequently-bought' | 'trending'
  confidenceScore: number
  estimatedValue: number
  reason: string
  basedOn: string
  priority: 'high' | 'medium' | 'low'
  aiGenerated: boolean
  acceptanceRate: number
  createdDate: string
  expiresDate: string
}

interface SendToCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  recommendation: Recommendation
}

interface AddToQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  recommendation: Recommendation
}

interface GenerateRecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (recommendation: Recommendation) => void
}

export function SendToCustomerModal({ isOpen, onClose, recommendation }: SendToCustomerModalProps) {
  const [formData, setFormData] = useState({
    deliveryMethod: 'email',
    emailAddress: '',
    phoneNumber: '',
    includeDetails: true,
    includePricing: true,
    personalMessage: '',
    urgency: 'normal' as 'urgent' | 'normal' | 'low'
  })

  if (!isOpen) return null

  const handleSend = () => {
    alert(`Recommendation sent to ${recommendation.customerName} via ${formData.deliveryMethod}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Recommendation to Customer</h2>
            <p className="text-sm text-gray-600">{recommendation.customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Recommendation Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Package className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{recommendation.productName}</h3>
                <p className="text-sm text-gray-700 mb-2">{recommendation.reason}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-900 font-medium">₹{recommendation.estimatedValue.toLocaleString()}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-green-700">{recommendation.confidenceScore.toFixed(1)}% confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 flex-1 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="email"
                  checked={formData.deliveryMethod === 'email'}
                  onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">Email</span>
              </label>
              <label className="flex items-center gap-2 flex-1 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="sms"
                  checked={formData.deliveryMethod === 'sms'}
                  onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">SMS</span>
              </label>
              <label className="flex items-center gap-2 flex-1 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="whatsapp"
                  checked={formData.deliveryMethod === 'whatsapp'}
                  onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          {formData.deliveryMethod === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="customer@example.com"
              />
            </div>
          )}

          {(formData.deliveryMethod === 'sms' || formData.deliveryMethod === 'whatsapp') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeDetails}
                onChange={(e) => setFormData({ ...formData, includeDetails: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include product details and specifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includePricing}
                onChange={(e) => setFormData({ ...formData, includePricing: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include pricing information</span>
            </label>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low - General information</option>
              <option value="normal">Normal - Standard follow-up</option>
              <option value="urgent">Urgent - Immediate attention required</option>
            </select>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
            <textarea
              value={formData.personalMessage}
              onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a personal note to the customer..."
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-2">Preview:</div>
            <div className="text-sm text-gray-800">
              <p className="font-medium mb-2">Hi {recommendation.customerName.split(' ')[0]},</p>
              <p className="mb-2">
                Based on your interests, we recommend: <strong>{recommendation.productName}</strong>
              </p>
              {formData.personalMessage && (
                <p className="mb-2 italic">{formData.personalMessage}</p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                This recommendation expires on {recommendation.expiresDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AddToQuoteModal({ isOpen, onClose, recommendation }: AddToQuoteModalProps) {
  const [formData, setFormData] = useState({
    quoteType: 'new',
    existingQuoteId: '',
    quantity: 1,
    applyDiscount: false,
    discountPercent: 0,
    includeInstallation: true,
    includeWarranty: true,
    validityDays: 30,
    notes: ''
  })

  const [finalPrice, setFinalPrice] = useState(recommendation.estimatedValue)

  if (!isOpen) return null

  const calculatePrice = () => {
    let price = recommendation.estimatedValue * formData.quantity
    if (formData.applyDiscount) {
      price = price * (1 - formData.discountPercent / 100)
    }
    if (formData.includeInstallation) {
      price += recommendation.estimatedValue * 0.1 // 10% installation
    }
    setFinalPrice(price)
  }

  const handleAddToQuote = () => {
    alert(`Product added to ${formData.quoteType === 'new' ? 'new' : 'existing'} quote`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add to Quote</h2>
            <p className="text-sm text-gray-600">{recommendation.productName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Package className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{recommendation.productName}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span>{recommendation.productCode}</span>
                  <span>•</span>
                  <span>{recommendation.category}</span>
                  <span>•</span>
                  <span className="font-medium text-blue-900">₹{recommendation.estimatedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quote Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 flex-1 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="quoteType"
                  value="new"
                  checked={formData.quoteType === 'new'}
                  onChange={(e) => setFormData({ ...formData, quoteType: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">New Quote</div>
                  <div className="text-xs text-gray-600">Create a new quote</div>
                </div>
              </label>
              <label className="flex items-center gap-2 flex-1 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="quoteType"
                  value="existing"
                  checked={formData.quoteType === 'existing'}
                  onChange={(e) => setFormData({ ...formData, quoteType: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Existing Quote</div>
                  <div className="text-xs text-gray-600">Add to existing</div>
                </div>
              </label>
            </div>
          </div>

          {formData.quoteType === 'existing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Quote</label>
              <select
                value={formData.existingQuoteId}
                onChange={(e) => setFormData({ ...formData, existingQuoteId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a quote</option>
                <option value="Q-2025-001">Q-2025-001 - Kitchen Renovation</option>
                <option value="Q-2025-002">Q-2025-002 - Appliances Bundle</option>
                <option value="Q-2025-003">Q-2025-003 - Complete Kitchen Setup</option>
              </select>
            </div>
          )}

          {/* Quantity and Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                  calculatePrice()
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote Validity (days)</label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) || 30 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.applyDiscount}
                onChange={(e) => {
                  setFormData({ ...formData, applyDiscount: e.target.checked })
                  calculatePrice()
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Apply Discount</span>
            </label>
            {formData.applyDiscount && (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) => {
                    setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })
                    calculatePrice()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Discount %"
                />
                <button
                  onClick={calculatePrice}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Calculate
                </button>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeInstallation}
                onChange={(e) => {
                  setFormData({ ...formData, includeInstallation: e.target.checked })
                  calculatePrice()
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include installation (+10%)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeWarranty}
                onChange={(e) => setFormData({ ...formData, includeWarranty: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include extended warranty (2 years)</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any special notes or requirements..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Base Price</span>
              <span className="text-sm text-gray-900">₹{(recommendation.estimatedValue * formData.quantity).toLocaleString()}</span>
            </div>
            {formData.applyDiscount && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Discount ({formData.discountPercent}%)</span>
                <span className="text-sm text-red-600">
                  -₹{((recommendation.estimatedValue * formData.quantity * formData.discountPercent) / 100).toLocaleString()}
                </span>
              </div>
            )}
            {formData.includeInstallation && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Installation</span>
                <span className="text-sm text-gray-900">
                  +₹{(recommendation.estimatedValue * 0.1).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-green-300">
              <span className="text-base font-semibold text-gray-900">Total Quote Value</span>
              <span className="text-xl font-bold text-green-900">₹{finalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToQuote}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GenerateRecommendationModal({ isOpen, onClose, onGenerate }: GenerateRecommendationModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    segment: '',
    analysisType: 'ai-powered' as 'ai-powered' | 'rule-based' | 'hybrid',
    includeUpgrades: true,
    includeAlternatives: true,
    includeCrossSells: true,
    minConfidence: 70,
    maxRecommendations: 5
  })

  if (!isOpen) return null

  const handleGenerate = () => {
    const newRecommendation: Recommendation = {
      id: `REC${Date.now()}`,
      customerId: formData.customerId,
      customerName: formData.customerName,
      segment: formData.segment,
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      recommendationType: 'best-match',
      confidenceScore: 94.5,
      estimatedValue: 18500,
      reason: 'Perfect fit based on customer preferences and buying history',
      basedOn: 'AI analysis of customer profile and market trends',
      priority: 'high',
      aiGenerated: true,
      acceptanceRate: 87.5,
      createdDate: new Date().toISOString().split('T')[0],
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    onGenerate(newRecommendation)
    alert(`Generated ${formData.maxRecommendations} AI-powered recommendations`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate New Recommendations</h2>
            <p className="text-sm text-gray-600">AI-powered product recommendations</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID *</label>
            <input
              type="text"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="CUST-2025-1142"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rajesh & Priya Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segment</label>
            <select
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Auto-detect from profile</option>
              <option value="Luxury Residential">Luxury Residential</option>
              <option value="Middle Income Residential">Middle Income Residential</option>
              <option value="B2B - Commercial">B2B - Commercial</option>
              <option value="New Home Buyers">New Home Buyers</option>
              <option value="Tech-Savvy Urban">Tech-Savvy Urban</option>
            </select>
          </div>

          {/* Analysis Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="analysisType"
                  value="ai-powered"
                  checked={formData.analysisType === 'ai-powered'}
                  onChange={(e) => setFormData({ ...formData, analysisType: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">AI-Powered (Recommended)</div>
                  <div className="text-xs text-gray-600">
                    Uses machine learning to analyze customer behavior, preferences, and market trends
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="analysisType"
                  value="rule-based"
                  checked={formData.analysisType === 'rule-based'}
                  onChange={(e) => setFormData({ ...formData, analysisType: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Rule-Based</div>
                  <div className="text-xs text-gray-600">
                    Uses predefined business rules and product associations
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="analysisType"
                  value="hybrid"
                  checked={formData.analysisType === 'hybrid'}
                  onChange={(e) => setFormData({ ...formData, analysisType: e.target.value as any })}
                  className="h-4 w-4 text-blue-600 mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Hybrid</div>
                  <div className="text-xs text-gray-600">
                    Combines AI insights with business rules for balanced recommendations
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Recommendation Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Recommendation Types</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeUpgrades}
                  onChange={(e) => setFormData({ ...formData, includeUpgrades: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Upgrades - Premium alternatives</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeAlternatives}
                  onChange={(e) => setFormData({ ...formData, includeAlternatives: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Alternatives - Similar products</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeCrossSells}
                  onChange={(e) => setFormData({ ...formData, includeCrossSells: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Cross-sells - Complementary products</span>
              </label>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Confidence Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.minConfidence}
                onChange={(e) => setFormData({ ...formData, minConfidence: parseInt(e.target.value) || 70 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Recommendations
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxRecommendations}
                onChange={(e) => setFormData({ ...formData, maxRecommendations: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              AI will analyze customer purchase history, browsing behavior, cart abandonment, segment preferences, and current market trends to generate personalized recommendations.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Generate Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
