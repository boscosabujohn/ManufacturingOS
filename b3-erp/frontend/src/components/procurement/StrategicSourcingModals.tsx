'use client'

import React, { useState } from 'react'
import {
  X,
  Plus,
  Target,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Package,
  FileText,
  CheckCircle,
  AlertTriangle,
  Save,
  Eye,
  Edit,
  Trash2,
  Clock,
  Filter,
  Award,
  Shield,
  Zap,
  Activity,
  Search,
  Download,
  Upload,
  Star,
  Settings
} from 'lucide-react'

// ========================
// Type Definitions
// ========================

export interface SourcingProjectData {
  id?: string
  title: string
  category: string
  objective: string
  targetSavings?: number
  timeline: string
  status?: 'planning' | 'active' | 'completed'
}

// ========================
// 1. Create Sourcing Project Modal
// ========================

interface CreateSourcingProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function CreateSourcingProjectModal({ isOpen, onClose, onSubmit }: CreateSourcingProjectModalProps) {
  const [projectTitle, setProjectTitle] = useState('')
  const [category, setCategory] = useState('')
  const [objective, setObjective] = useState('')
  const [scope, setScope] = useState('')
  const [targetSavings, setTargetSavings] = useState('')
  const [timeline, setTimeline] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [teamMembers, setTeamMembers] = useState<string[]>([''])
  const [stakeholders, setStakeholders] = useState<string[]>([''])
  const [approvalRequired, setApprovalRequired] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: projectTitle,
      category,
      objective,
      scope,
      targetSavings: parseFloat(targetSavings),
      timeline,
      startDate,
      endDate,
      teamMembers: teamMembers.filter(m => m.trim()),
      stakeholders: stakeholders.filter(s => s.trim()),
      approvalRequired
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Create Sourcing Project</h2>
                <p className="text-blue-100 text-sm mt-1">Define strategic sourcing initiative</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Project Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Electronics Category Optimization"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="raw-materials">Raw Materials</option>
                  <option value="components">Components & Parts</option>
                  <option value="services">Services</option>
                  <option value="it">IT & Software</option>
                  <option value="facilities">Facilities & MRO</option>
                  <option value="logistics">Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Savings</label>
                <input
                  type="number"
                  value={targetSavings}
                  onChange={(e) => setTargetSavings(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$50,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objective *</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the strategic sourcing objective..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="12-months">12 Months</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

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
              <Save className="w-4 h-4" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 2. Analyze Spend Modal
// ========================

interface AnalyzeSpendModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function AnalyzeSpendModal({ isOpen, onClose, onSubmit }: AnalyzeSpendModalProps) {
  const [analysisType, setAnalysisType] = useState('category')
  const [timeRange, setTimeRange] = useState('ytd')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [includeComparison, setIncludeComparison] = useState(true)
  const [includeSupplierAnalysis, setIncludeSupplierAnalysis] = useState(true)
  const [includeSavingsOpportunities, setIncludeSavingsOpportunities] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      analysisType,
      timeRange,
      categories: selectedCategories,
      includeComparison,
      includeSupplierAnalysis,
      includeSavingsOpportunities
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Analyze Spend</h2>
                <p className="text-purple-100 text-sm mt-1">Comprehensive spend analysis and insights</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Analysis Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Type</label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="category">Category Analysis</option>
                  <option value="supplier">Supplier Analysis</option>
                  <option value="trend">Trend Analysis</option>
                  <option value="variance">Variance Analysis</option>
                  <option value="concentration">Spend Concentration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ytd">Year to Date</option>
                  <option value="quarter">This Quarter</option>
                  <option value="last-12">Last 12 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeComparison}
                  onChange={(e) => setIncludeComparison(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include period-over-period comparison</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSupplierAnalysis}
                  onChange={(e) => setIncludeSupplierAnalysis(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Include supplier performance metrics</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSavingsOpportunities}
                  onChange={(e) => setIncludeSavingsOpportunities(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Identify savings opportunities</span>
              </label>
            </div>
          </div>

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
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Run Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 3. Develop Strategy Modal
// ========================

interface DevelopStrategyModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
  onSubmit: (data: any) => void
}

export function DevelopStrategyModal({ isOpen, onClose, category, onSubmit }: DevelopStrategyModalProps) {
  const [strategyName, setStrategyName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(category || '')
  const [strategyType, setStrategyType] = useState('consolidation')
  const [objectives, setObjectives] = useState('')
  const [currentState, setCurrentState] = useState('')
  const [targetState, setTargetState] = useState('')
  const [implementationPlan, setImplementationPlan] = useState('')
  const [risks, setRisks] = useState('')
  const [successMetrics, setSuccessMetrics] = useState<string[]>([''])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: strategyName,
      category: selectedCategory,
      type: strategyType,
      objectives,
      currentState,
      targetState,
      implementationPlan,
      risks,
      successMetrics: successMetrics.filter(m => m.trim())
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Develop Sourcing Strategy</h2>
                <p className="text-green-100 text-sm mt-1">Create comprehensive category strategy</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Strategy Overview</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Name *</label>
              <input
                type="text"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="raw-materials">Raw Materials</option>
                  <option value="components">Components</option>
                  <option value="services">Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Type</label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="consolidation">Supplier Consolidation</option>
                  <option value="competitive-bidding">Competitive Bidding</option>
                  <option value="partnership">Strategic Partnership</option>
                  <option value="make-vs-buy">Make vs Buy</option>
                  <option value="innovation">Innovation Focus</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strategic Objectives *</label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                required
              />
            </div>
          </div>

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
              <Save className="w-4 h-4" />
              Save Strategy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ========================
// 4. Track Implementation Modal
// ========================

interface TrackImplementationModalProps {
  isOpen: boolean
  onClose: () => void
  project?: any
  onSubmit: (data: any) => void
}

export function TrackImplementationModal({ isOpen, onClose, project, onSubmit }: TrackImplementationModalProps) {
  const [milestones, setMilestones] = useState([
    { name: '', targetDate: '', status: 'pending', progress: 0 }
  ])
  const [kpis, setKpis] = useState([
    { metric: '', target: '', actual: '', unit: '' }
  ])
  const [status, setStatus] = useState('on-track')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      projectId: project?.id,
      milestones,
      kpis,
      status,
      notes
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Track Implementation</h2>
                <p className="text-indigo-100 text-sm mt-1">Monitor progress and performance</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">Implementation Status</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />
            </div>
          </div>

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
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
