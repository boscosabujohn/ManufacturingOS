'use client'

import React, { useState } from 'react'
import {
  X,
  Share2,
  MessageCircle,
  FileText,
  Users,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Mail,
  Bell,
  Clock,
  TrendingUp,
  Package,
  DollarSign,
  Target,
  Search,
  Send,
  Paperclip,
  Image,
  Save,
  Eye,
  Download,
  Edit3,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Globe,
  Phone,
  Video,
  Settings,
  Star,
  Shield
} from 'lucide-react'

// ========================
// Type Definitions
// ========================

export interface SupplierData {
  id: string
  name: string
  contact: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  tier?: 'strategic' | 'preferred' | 'approved'
  rating?: number
}

export interface ForecastData {
  product: string
  quantity: number
  period: string
  notes?: string
}

export interface QuoteRequest {
  items: Array<{
    description: string
    quantity: number
    targetPrice?: number
  }>
  deadline: string
  requirements?: string
}

// ========================
// 1. Share Forecast Modal
// ========================

interface ShareForecastModalProps {
  isOpen: boolean
  onClose: () => void
  supplier?: SupplierData
  onSubmit: (data: any) => void
}

export function ShareForecastModal({ isOpen, onClose, supplier, onSubmit }: ShareForecastModalProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(supplier ? [supplier.id] : [])
  const [forecastPeriod, setForecastPeriod] = useState('Q1-2025')
  const [forecastType, setForecastType] = useState('demand')
  const [includeHistorical, setIncludeHistorical] = useState(true)
  const [shareConfidential, setShareConfidential] = useState(false)
  const [forecastItems, setForecastItems] = useState([
    { product: '', quantity: '', unit: 'units', period: 'monthly' }
  ])
  const [message, setMessage] = useState('')
  const [notifySuppliers, setNotifySuppliers] = useState(true)

  if (!isOpen) return null

  const handleAddItem = () => {
    setForecastItems([...forecastItems, { product: '', quantity: '', unit: 'units', period: 'monthly' }])
  }

  const handleRemoveItem = (index: number) => {
    setForecastItems(forecastItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      suppliers: selectedSuppliers,
      period: forecastPeriod,
      type: forecastType,
      items: forecastItems,
      includeHistorical,
      shareConfidential,
      message,
      notifySuppliers
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Share Forecast with Suppliers</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {supplier ? `Sharing with ${supplier.name}` : 'Share demand forecast for better planning'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Forecast Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Forecast Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forecast Period *
                </label>
                <select
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Q1-2025">Q1 2025</option>
                  <option value="Q2-2025">Q2 2025</option>
                  <option value="H1-2025">H1 2025</option>
                  <option value="2025">Full Year 2025</option>
                  <option value="custom">Custom Period</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forecast Type
                </label>
                <select
                  value={forecastType}
                  onChange={(e) => setForecastType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="demand">Demand Forecast</option>
                  <option value="capacity">Capacity Planning</option>
                  <option value="procurement">Procurement Schedule</option>
                  <option value="inventory">Inventory Planning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forecast Items */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Forecast Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {forecastItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                <input
                  type="text"
                  value={item.product}
                  onChange={(e) => {
                    const newItems = [...forecastItems]
                    newItems[index].product = e.target.value
                    setForecastItems(newItems)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product/Part Number"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...forecastItems]
                    newItems[index].quantity = e.target.value
                    setForecastItems(newItems)
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Quantity"
                  required
                />
                <select
                  value={item.period}
                  onChange={(e) => {
                    const newItems = [...forecastItems]
                    newItems[index].period = e.target.value
                    setForecastItems(newItems)
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                {forecastItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Additional Options */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Sharing Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeHistorical}
                  onChange={(e) => setIncludeHistorical(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Include historical data for context</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shareConfidential}
                  onChange={(e) => setShareConfidential(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Mark as confidential (requires NDA)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifySuppliers}
                  onChange={(e) => setNotifySuppliers(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Send notification to suppliers</span>
              </label>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Message to Suppliers
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Add a message to explain the forecast context, assumptions, or requests..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Forecast
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 2. Request Quotes Modal
// ========================

interface RequestQuotesModalProps {
  isOpen: boolean
  onClose: () => void
  supplier?: SupplierData
  onSubmit: (data: any) => void
}

export function RequestQuotesModal({ isOpen, onClose, supplier, onSubmit }: RequestQuotesModalProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(supplier ? [supplier.id] : [])
  const [rfqTitle, setRfqTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [quoteItems, setQuoteItems] = useState([
    { description: '', quantity: '', unit: 'each', targetPrice: '' }
  ])
  const [requirements, setRequirements] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [paymentTerms, setPaymentTerms] = useState('net30')
  const [deliveryRequired, setDeliveryRequired] = useState('')
  const [allowCounterOffers, setAllowCounterOffers] = useState(true)

  if (!isOpen) return null

  const handleAddItem = () => {
    setQuoteItems([...quoteItems, { description: '', quantity: '', unit: 'each', targetPrice: '' }])
  }

  const handleRemoveItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      suppliers: selectedSuppliers,
      title: rfqTitle,
      deadline,
      items: quoteItems,
      requirements,
      attachments,
      paymentTerms,
      deliveryRequired,
      allowCounterOffers
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Request Quotes (RFQ)</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {supplier ? `Request quote from ${supplier.name}` : 'Send RFQ to multiple suppliers'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* RFQ Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              RFQ Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RFQ Title *
              </label>
              <input
                type="text"
                value={rfqTitle}
                onChange={(e) => setRfqTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Electronic Components Q1 2025"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Deadline *
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="net30">Net 30</option>
                  <option value="net60">Net 60</option>
                  <option value="net90">Net 90</option>
                  <option value="immediate">Immediate</option>
                  <option value="custom">Custom Terms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Required By
                </label>
                <input
                  type="date"
                  value={deliveryRequired}
                  onChange={(e) => setDeliveryRequired(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Quote Items */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Items to Quote
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {quoteItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...quoteItems]
                      newItems[index].description = e.target.value
                      setQuoteItems(newItems)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Item description / Part number"
                    required
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...quoteItems]
                      newItems[index].quantity = e.target.value
                      setQuoteItems(newItems)
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Qty"
                    required
                  />
                  <select
                    value={item.unit}
                    onChange={(e) => {
                      const newItems = [...quoteItems]
                      newItems[index].unit = e.target.value
                      setQuoteItems(newItems)
                    }}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="each">Each</option>
                    <option value="kg">Kg</option>
                    <option value="lbs">Lbs</option>
                    <option value="m">Meters</option>
                    <option value="ft">Feet</option>
                    <option value="box">Box</option>
                  </select>
                  <input
                    type="number"
                    value={item.targetPrice}
                    onChange={(e) => {
                      const newItems = [...quoteItems]
                      newItems[index].targetPrice = e.target.value
                      setQuoteItems(newItems)
                    }}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Target $"
                  />
                  {quoteItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements & Specifications */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Requirements & Specifications
            </h3>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Specify quality standards, certifications, packaging requirements, delivery conditions, etc."
            />
          </div>

          {/* Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowCounterOffers}
                onChange={(e) => setAllowCounterOffers(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Allow suppliers to submit counter-offers</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send RFQ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 3. Collaborate on Design Modal
// ========================

interface CollaborateDesignModalProps {
  isOpen: boolean
  onClose: () => void
  supplier?: SupplierData
  onSubmit: (data: any) => void
}

export function CollaborateDesignModal({ isOpen, onClose, supplier, onSubmit }: CollaborateDesignModalProps) {
  const [projectTitle, setProjectTitle] = useState('')
  const [projectType, setProjectType] = useState('cost-reduction')
  const [description, setDescription] = useState('')
  const [objectives, setObjectives] = useState('')
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [teamMembers, setTeamMembers] = useState<string[]>([''])
  const [requiredExpertise, setRequiredExpertise] = useState<string[]>([])
  const [setupMeeting, setSetupMeeting] = useState(true)
  const [meetingDate, setMeetingDate] = useState('')

  if (!isOpen) return null

  const expertiseOptions = [
    'Product Design',
    'Manufacturing Engineering',
    'Quality Assurance',
    'Supply Chain',
    'Materials Science',
    'Cost Engineering',
    'Sustainability'
  ]

  const toggleExpertise = (expertise: string) => {
    if (requiredExpertise.includes(expertise)) {
      setRequiredExpertise(requiredExpertise.filter(e => e !== expertise))
    } else {
      setRequiredExpertise([...requiredExpertise, expertise])
    }
  }

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, ''])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: projectTitle,
      type: projectType,
      supplier: supplier?.id,
      description,
      objectives,
      timeline,
      budget,
      teamMembers: teamMembers.filter(m => m.trim()),
      requiredExpertise,
      setupMeeting,
      meetingDate
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Start Design Collaboration</h2>
                <p className="text-green-100 text-sm mt-1">
                  {supplier ? `Collaborate with ${supplier.name}` : 'Initiate joint design project'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Project Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Product Cost Reduction Initiative"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cost-reduction">Cost Reduction</option>
                  <option value="innovation">Innovation/R&D</option>
                  <option value="quality-improvement">Quality Improvement</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="process-optimization">Process Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 3-6 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="$50,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Describe the collaboration project..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Objectives
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="List the key objectives and success metrics..."
              />
            </div>
          </div>

          {/* Required Expertise */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              Required Expertise
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {expertiseOptions.map((expertise) => (
                <button
                  key={expertise}
                  type="button"
                  onClick={() => toggleExpertise(expertise)}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    requiredExpertise.includes(expertise)
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">{expertise}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kickoff Meeting */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="setupMeeting"
                checked={setupMeeting}
                onChange={(e) => setSetupMeeting(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="setupMeeting" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                Schedule kickoff meeting
              </label>
            </div>

            {setupMeeting && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Meeting Date/Time
                </label>
                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Start Collaboration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 4. Message Suppliers Modal
// ========================

interface MessageSuppliersModalProps {
  isOpen: boolean
  onClose: () => void
  supplier?: SupplierData
  onSubmit: (data: any) => void
}

export function MessageSuppliersModal({ isOpen, onClose, supplier, onSubmit }: MessageSuppliersModalProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(supplier ? [supplier.id] : [])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal')
  const [category, setCategory] = useState('general')
  const [attachments, setAttachments] = useState<File[]>([])
  const [requestResponse, setRequestResponse] = useState(false)
  const [responseDeadline, setResponseDeadline] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      suppliers: selectedSuppliers,
      subject,
      message,
      priority,
      category,
      attachments,
      requestResponse,
      responseDeadline
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Message Suppliers</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {supplier ? `Send message to ${supplier.name}` : 'Send message to selected suppliers'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Message Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter message subject"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Related</option>
                  <option value="quality">Quality Issue</option>
                  <option value="delivery">Delivery/Logistics</option>
                  <option value="pricing">Pricing Discussion</option>
                  <option value="technical">Technical Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={8}
                placeholder="Type your message here..."
                required
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-gray-600" />
              Attachments
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4" />
                Choose Files
              </label>
            </div>
          </div>

          {/* Response Options */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requestResponse"
                checked={requestResponse}
                onChange={(e) => setRequestResponse(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="requestResponse" className="text-sm font-medium text-gray-700">
                Request response from suppliers
              </label>
            </div>

            {requestResponse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Deadline
                </label>
                <input
                  type="datetime-local"
                  value={responseDeadline}
                  onChange={(e) => setResponseDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
