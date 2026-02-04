'use client'

import React, { useState } from 'react'
import {
  X,
  Plus,
  Calendar,
  Users,
  Link2,
  TrendingUp,
  Download,
  Filter,
  Target,
  Clock,
  Edit,
  GitBranch,
  AlertCircle,
  CheckCircle,
  Copy,
  Save,
  Printer,
  Settings,
  RefreshCw,
  FileText,
  Layers,
  ChevronDown,
  ChevronRight,
  Flag,
} from 'lucide-react'

// ============================================================================
// 1. ADD MILESTONE MODAL
// ============================================================================

interface AddMilestoneModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (milestone: any) => void
}

export function AddMilestoneModal({ isOpen, onClose, onAdd }: AddMilestoneModalProps) {
  const [milestoneName, setMilestoneName] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('major')
  const [linkedTasks, setLinkedTasks] = useState<string[]>([])
  const [notifyTeam, setNotifyTeam] = useState(true)
  const [criticalPath, setCriticalPath] = useState(false)

  const categories = [
    { value: 'major', label: 'Major Milestone', color: 'red' },
    { value: 'phase', label: 'Phase Completion', color: 'blue' },
    { value: 'delivery', label: 'Delivery', color: 'green' },
    { value: 'review', label: 'Review/Approval', color: 'purple' },
    { value: 'payment', label: 'Payment', color: 'orange' },
  ]

  const availableTasks = [
    'Site Survey & Planning',
    'Equipment Procurement',
    'Material Procurement',
    'Quality Inspection',
    'Cooking Equipment Installation',
  ]

  const toggleTask = (task: string) => {
    if (linkedTasks.includes(task)) {
      setLinkedTasks(linkedTasks.filter(t => t !== task))
    } else {
      setLinkedTasks([...linkedTasks, task])
    }
  }

  const handleAdd = () => {
    const milestone = {
      name: milestoneName,
      date: milestoneDate,
      description,
      category,
      linkedTasks,
      notifyTeam,
      criticalPath,
    }
    onAdd(milestone)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Add Milestone</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Basic Info */}
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestone Name *
              </label>
              <input
                type="text"
                value={milestoneName}
                onChange={(e) => setMilestoneName(e.target.value)}
                placeholder="e.g., Phase 1 Completion"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add milestone description and success criteria..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Linked Tasks */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Link to Tasks</h3>
            <div className="space-y-2">
              {availableTasks.map((task) => (
                <label key={task} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkedTasks.includes(task)}
                    onChange={() => toggleTask(task)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{task}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={criticalPath}
                onChange={(e) => setCriticalPath(e.target.checked)}
                className="rounded border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Critical Path Milestone</span>
                <p className="text-xs text-gray-600">Mark as critical to project timeline</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTeam}
                onChange={(e) => setNotifyTeam(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Notify team members when milestone is reached</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!milestoneName || !milestoneDate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. EDIT TASK DEPENDENCIES MODAL
// ============================================================================

interface EditDependenciesModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onUpdate: (dependencies: any) => void
}

export function EditDependenciesModal({ isOpen, onClose, task, onUpdate }: EditDependenciesModalProps) {
  const [dependencyType, setDependencyType] = useState('finish-to-start')
  const [lag, setLag] = useState('0')
  const [selectedTasks, setSelectedTasks] = useState<string[]>(task?.dependencies || [])

  const dependencyTypes = [
    { value: 'finish-to-start', label: 'Finish-to-Start (FS)', description: 'Task B starts when Task A finishes' },
    { value: 'start-to-start', label: 'Start-to-Start (SS)', description: 'Task B starts when Task A starts' },
    { value: 'finish-to-finish', label: 'Finish-to-Finish (FF)', description: 'Task B finishes when Task A finishes' },
    { value: 'start-to-finish', label: 'Start-to-Finish (SF)', description: 'Task B finishes when Task A starts' },
  ]

  const availableTasks = [
    { id: '1', name: 'Site Survey & Planning' },
    { id: '2', name: 'Equipment Procurement' },
    { id: '3', name: 'Material Procurement' },
    { id: '4', name: 'Quality Inspection' },
    { id: '5', name: 'Floor Preparation' },
    { id: '6', name: 'Drainage & Plumbing' },
    { id: '7', name: 'Electrical Infrastructure' },
  ]

  const toggleTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(t => t !== taskId))
    } else {
      setSelectedTasks([...selectedTasks, taskId])
    }
  }

  const handleUpdate = () => {
    const dependencies = {
      tasks: selectedTasks,
      type: dependencyType,
      lag: parseInt(lag),
    }
    onUpdate(dependencies)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Dependencies</h2>
              <p className="text-purple-100 text-sm mt-1">{task?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Dependency Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dependency Type
            </label>
            <div className="space-y-2">
              {dependencyTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="dependencyType"
                    value={type.value}
                    checked={dependencyType === type.value}
                    onChange={(e) => setDependencyType(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Lag Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lag Time (days)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lag}
                onChange={(e) => setLag(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-600">
                {lag} day{lag !== '1' ? 's' : ''} delay between tasks
              </p>
            </div>
          </div>

          {/* Predecessor Tasks */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Predecessor Tasks</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select tasks that must be completed before this task can start
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableTasks.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(t.id)}
                    onChange={() => toggleTask(t.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{t.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visual Diagram */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-2">Dependency Chain Preview</h4>
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <div className="px-3 py-2 bg-white rounded border border-blue-300">
                {selectedTasks.length} Predecessors
              </div>
              <ChevronRight className="w-4 h-4" />
              <div className="px-3 py-2 bg-blue-100 rounded border border-blue-300 font-medium">
                {task?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Update Dependencies
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. RESOURCE LOADING MODAL
// ============================================================================

interface ResourceLoadingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResourceLoadingModal({ isOpen, onClose }: ResourceLoadingModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedResource, setSelectedResource] = useState('all')

  const resources = [
    { name: 'Rajesh Kumar', role: 'Project Manager', allocation: 85, capacity: 40, overloaded: true },
    { name: 'Priya Sharma', role: 'Lead Engineer', allocation: 120, capacity: 40, overloaded: true },
    { name: 'Amit Patel', role: 'Site Supervisor', allocation: 95, capacity: 40, overloaded: true },
    { name: 'Installation Team A', role: 'Team', allocation: 75, capacity: 160, overloaded: false },
    { name: 'Installation Team B', role: 'Team', allocation: 60, capacity: 160, overloaded: false },
    { name: 'Electrical Team', role: 'Team', allocation: 55, capacity: 120, overloaded: false },
  ]

  const getLoadingColor = (allocation: number, capacity: number) => {
    const percentage = (allocation / capacity) * 100
    if (percentage > 100) return 'bg-red-500'
    if (percentage > 80) return 'bg-orange-500'
    if (percentage > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getLoadingPercentage = (allocation: number, capacity: number) => {
    return Math.round((allocation / capacity) * 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Resource Loading Analysis</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Resource</label>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Resources</option>
                {resources.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Overloaded</p>
              <p className="text-2xl font-bold text-red-900">
                {resources.filter(r => r.overloaded).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-900">
                {resources.filter(r => !r.overloaded).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-blue-900">
                {resources.reduce((sum, r) => sum + r.capacity, 0)}h
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Total Allocated</p>
              <p className="text-2xl font-bold text-purple-900">
                {resources.reduce((sum, r) => sum + r.allocation, 0)}h
              </p>
            </div>
          </div>

          {/* Resource List */}
          <div className="space-y-2">
            {resources.map((resource) => (
              <div key={resource.name} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                    <p className="text-sm text-gray-600">{resource.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {resource.allocation}h / {resource.capacity}h
                    </p>
                    <span
                      className={`text-sm font-medium ${
                        resource.overloaded ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {getLoadingPercentage(resource.allocation, resource.capacity)}% loaded
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getLoadingColor(
                      resource.allocation,
                      resource.capacity
                    )}`}
                    style={{
                      width: `${Math.min(getLoadingPercentage(resource.allocation, resource.capacity), 100)}%`,
                    }}
                  ></div>
                </div>

                {resource.overloaded && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Overloaded by {resource.allocation - resource.capacity} hours
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Resource Balancing Recommendations</p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Consider reassigning tasks from Priya Sharma (120% loaded)</li>
                  <li>Installation Team B has 40% available capacity</li>
                  <li>Rajesh Kumar is approaching overload (85% loaded)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Balance Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TIMELINE ZOOM/FILTER MODAL
// ============================================================================

interface TimelineFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export function TimelineFilterModal({ isOpen, onClose, onApply }: TimelineFilterModalProps) {
  const [zoomLevel, setZoomLevel] = useState('week')
  const [dateRange, setDateRange] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterPhase, setFilterPhase] = useState<string[]>([])
  const [showCriticalPath, setShowCriticalPath] = useState(false)
  const [showMilestones, setShowMilestones] = useState(true)
  const [showDependencies, setShowDependencies] = useState(true)

  const statuses = ['Completed', 'In Progress', 'Delayed', 'Not Started']
  const phases = ['Initiation', 'Procurement', 'Civil Work', 'Installation', 'Testing', 'Commissioning', 'Handover']

  const toggleStatus = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter(s => s !== status))
    } else {
      setFilterStatus([...filterStatus, status])
    }
  }

  const togglePhase = (phase: string) => {
    if (filterPhase.includes(phase)) {
      setFilterPhase(filterPhase.filter(p => p !== phase))
    } else {
      setFilterPhase([...filterPhase, phase])
    }
  }

  const handleApply = () => {
    const filters = {
      zoomLevel,
      dateRange,
      customStartDate,
      customEndDate,
      filterStatus,
      filterPhase,
      showCriticalPath,
      showMilestones,
      showDependencies,
    }
    onApply(filters)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Timeline Zoom & Filters</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Zoom Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Zoom Level</label>
            <div className="grid grid-cols-4 gap-3">
              {['day', 'week', 'month', 'quarter'].map((level) => (
                <label
                  key={level}
                  className={`p-3 border-2 rounded-lg cursor-pointer text-center transition ${
                    zoomLevel === level
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="zoomLevel"
                    value={level}
                    checked={zoomLevel === level}
                    onChange={(e) => setZoomLevel(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-900 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={dateRange === 'all'}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <span className="text-sm text-gray-700">All Timeline</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="current"
                  checked={dateRange === 'current'}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <span className="text-sm text-gray-700">Current Period</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  checked={dateRange === 'custom'}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <span className="text-sm text-gray-700">Custom Range</span>
              </label>

              {dateRange === 'custom' && (
                <div className="ml-6 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter by Status */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Filter by Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterStatus.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Phase */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Filter by Phase</h3>
            <div className="grid grid-cols-2 gap-2">
              {phases.map((phase) => (
                <label key={phase} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterPhase.includes(phase)}
                    onChange={() => togglePhase(phase)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{phase}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCriticalPath}
                onChange={(e) => setShowCriticalPath(e.target.checked)}
                className="rounded border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Highlight Critical Path</span>
                <p className="text-xs text-gray-600">Show tasks that affect project completion date</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMilestones}
                onChange={(e) => setShowMilestones(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Milestones</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDependencies}
                onChange={(e) => setShowDependencies(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Task Dependencies</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. EXPORT GANTT MODAL
// ============================================================================

interface ExportGanttModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: any) => void
}

export function ExportGanttModal({ isOpen, onClose, onExport }: ExportGanttModalProps) {
  const [exportFormat, setExportFormat] = useState('pdf')
  const [includeOptions, setIncludeOptions] = useState({
    timeline: true,
    taskList: true,
    dependencies: true,
    milestones: true,
    resourceInfo: false,
    notes: false,
  })
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('landscape')
  const [dateRange, setDateRange] = useState('all')

  const toggleOption = (option: keyof typeof includeOptions) => {
    setIncludeOptions({
      ...includeOptions,
      [option]: !includeOptions[option],
    })
  }

  const handleExport = () => {
    const options = {
      format: exportFormat,
      include: includeOptions,
      pageSize,
      orientation,
      dateRange,
    }
    onExport(options)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Export Gantt Chart</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <label
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition ${
                  exportFormat === 'pdf'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText className="w-8 h-8 text-red-600 mb-2" />
                <span className="font-medium text-gray-900">PDF</span>
              </label>

              <label
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition ${
                  exportFormat === 'png'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={exportFormat === 'png'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-gray-900">PNG</span>
              </label>

              <label
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition ${
                  exportFormat === 'excel'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText className="w-8 h-8 text-green-600 mb-2" />
                <span className="font-medium text-gray-900">Excel</span>
              </label>
            </div>
          </div>

          {/* Include Options */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Include in Export</h3>
            <div className="space-y-2">
              {Object.entries(includeOptions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleOption(key as keyof typeof includeOptions)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Page Settings (for PDF) */}
          {exportFormat === 'pdf' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Entire Project Timeline</option>
              <option value="current">Current Month</option>
              <option value="remaining">Remaining Tasks Only</option>
              <option value="completed">Completed Tasks Only</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. BASELINE COMPARISON MODAL
// ============================================================================

interface BaselineComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BaselineComparisonModal({ isOpen, onClose }: BaselineComparisonModalProps) {
  const [selectedBaseline, setSelectedBaseline] = useState('initial')

  const baselines = [
    { id: 'initial', name: 'Initial Baseline', date: '2024-01-15', createdBy: 'Rajesh Kumar' },
    { id: 'revised-1', name: 'Revised Baseline v1', date: '2024-02-20', createdBy: 'Priya Sharma' },
    { id: 'current', name: 'Current Plan', date: '2024-03-15', createdBy: 'System' },
  ]

  const variances = [
    { task: 'Equipment Procurement', plannedDays: 20, actualDays: 20, variance: 0, status: 'On Track' },
    { task: 'Material Procurement', plannedDays: 19, actualDays: 19, variance: 0, status: 'On Track' },
    { task: 'Floor Preparation', plannedDays: 7, actualDays: 7, variance: 0, status: 'On Track' },
    { task: 'Cooking Equipment Installation', plannedDays: 9, actualDays: 12, variance: 3, status: 'Delayed' },
    { task: 'Refrigeration Units Setup', plannedDays: 10, actualDays: 8, variance: -2, status: 'Ahead' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Baseline Comparison</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Baseline Selector */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Compare Against</label>
          <select
            value={selectedBaseline}
            onChange={(e) => setSelectedBaseline(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {baselines.map((baseline) => (
              <option key={baseline.id} value={baseline.id}>
                {baseline.name} - {baseline.date}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600 mb-1">On Track</p>
              <p className="text-2xl font-bold text-green-900">2</p>
              <p className="text-xs text-green-700 mt-1">0 days variance</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Delayed</p>
              <p className="text-2xl font-bold text-red-900">1</p>
              <p className="text-xs text-red-700 mt-1">+3 days variance</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Ahead</p>
              <p className="text-2xl font-bold text-blue-900">1</p>
              <p className="text-xs text-blue-700 mt-1">-2 days variance</p>
            </div>
          </div>

          {/* Variance Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Baseline</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {variances.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.task}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.plannedDays} days</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.actualDays} days</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`font-medium ${
                          item.variance > 0
                            ? 'text-red-600'
                            : item.variance < 0
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      >
                        {item.variance > 0 ? '+' : ''}
                        {item.variance} days
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'On Track'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'Delayed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analysis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Schedule Analysis</p>
                <p className="text-sm text-blue-700 mt-1">
                  Overall project is tracking close to baseline. One task (Cooking Equipment Installation) is
                  3 days behind schedule. Consider allocating additional resources to this task.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save as New Baseline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7-12. REMAINING MODALS (Simplified versions for file size)
// ============================================================================

// 7. Critical Path View Modal
export function CriticalPathModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Critical Path Analysis</h2>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-gray-600">Critical path visualization and analysis will be displayed here.</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// 8. Add Task Link Modal
export function AddTaskLinkModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (link: any) => void }) {
  const [fromTask, setFromTask] = useState('')
  const [toTask, setToTask] = useState('')
  const [linkType, setLinkType] = useState('finish-to-start')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add Task Link</h2>
          <button onClick={onClose} className="text-white hover:bg-teal-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Task</label>
            <select value={fromTask} onChange={(e) => setFromTask(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select task...</option>
              <option value="1">Site Survey & Planning</option>
              <option value="2">Equipment Procurement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Task</label>
            <select value={toTask} onChange={(e) => setToTask(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select task...</option>
              <option value="3">Material Procurement</option>
              <option value="4">Quality Inspection</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <select value={linkType} onChange={(e) => setLinkType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="finish-to-start">Finish-to-Start</option>
              <option value="start-to-start">Start-to-Start</option>
              <option value="finish-to-finish">Finish-to-Finish</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onAdd({ fromTask, toTask, linkType })} className="px-4 py-2 bg-teal-600 text-white rounded-lg">
            Add Link
          </button>
        </div>
      </div>
    </div>
  )
}

// 9. Edit Task Duration Modal
export function EditDurationModal({ isOpen, onClose, task, onUpdate }: { isOpen: boolean; onClose: () => void; task: any; onUpdate: (duration: any) => void }) {
  const [duration, setDuration] = useState(task?.duration || '10')
  const [startDate, setStartDate] = useState(task?.startDate || '')
  const [endDate, setEndDate] = useState(task?.endDate || '')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Task Duration</h2>
          <button onClick={onClose} className="text-white hover:bg-yellow-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ duration, startDate, endDate })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">
            Update Duration
          </button>
        </div>
      </div>
    </div>
  )
}

// 10. Reschedule Tasks Modal
export function RescheduleModal({ isOpen, onClose, onReschedule }: { isOpen: boolean; onClose: () => void; onReschedule: (options: any) => void }) {
  const [rescheduleFrom, setRescheduleFrom] = useState('')
  const [shiftDays, setShiftDays] = useState('0')
  const [updateDependents, setUpdateDependents] = useState(true)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Reschedule Tasks</h2>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reschedule From Date</label>
            <input type="date" value={rescheduleFrom} onChange={(e) => setRescheduleFrom(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shift By (days)</label>
            <input type="number" value={shiftDays} onChange={(e) => setShiftDays(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={updateDependents} onChange={(e) => setUpdateDependents(e.target.checked)} className="rounded" />
            <span className="text-sm text-gray-700">Update dependent tasks automatically</span>
          </label>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onReschedule({ rescheduleFrom, shiftDays, updateDependents })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  )
}

// 11. Print Setup Modal
export function PrintSetupModal({ isOpen, onClose, onPrint }: { isOpen: boolean; onClose: () => void; onPrint: (options: any) => void }) {
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('landscape')
  const [includeHeader, setIncludeHeader] = useState(true)
  const [includeFooter, setIncludeFooter] = useState(true)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Print Setup</h2>
          <button onClick={onClose} className="text-white hover:bg-gray-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeHeader} onChange={(e) => setIncludeHeader(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Include header</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeFooter} onChange={(e) => setIncludeFooter(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Include footer</span>
            </label>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onPrint({ pageSize, orientation, includeHeader, includeFooter })} className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

// 12. Timeline Templates Modal
export function TimelineTemplatesModal({ isOpen, onClose, onApply }: { isOpen: boolean; onClose: () => void; onApply: (template: any) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const templates = [
    { id: 'commercial-kitchen', name: 'Commercial Kitchen Standard', duration: '90 days', tasks: 25 },
    { id: 'cold-room', name: 'Cold Room Installation', duration: '60 days', tasks: 18 },
    { id: 'switchgear', name: 'Switchgear Manufacturing', duration: '45 days', tasks: 15 },
  ]

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Timeline Templates</h2>
          <button onClick={onClose} className="text-white hover:bg-pink-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          {templates.map((template) => (
            <label key={template.id} className={`block p-3 border-2 rounded-lg cursor-pointer ${selectedTemplate === template.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
              <input type="radio" name="template" value={template.id} checked={selectedTemplate === template.id} onChange={(e) => setSelectedTemplate(e.target.value)} className="sr-only" />
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.duration} • {template.tasks} tasks</p>
                </div>
                {selectedTemplate === template.id && <CheckCircle className="w-6 h-6 text-pink-600" />}
              </div>
            </label>
          ))}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onApply(selectedTemplate)} disabled={!selectedTemplate} className="px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50">
            Apply Template
          </button>
        </div>
      </div>
    </div>
  )
}
