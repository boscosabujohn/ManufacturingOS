'use client'

import React, { useState } from 'react'
import {
  X,
  Filter,
  Download,
  Copy,
  Eye,
  Users,
  Calendar,
  FileText,
  Archive,
  UserPlus,
  StickyNote,
  CheckSquare,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  Building2,
  MapPin,
  Settings,
  Upload,
  ChevronDown,
  ChevronRight,
  Trash2,
  Save
} from 'lucide-react'

// ============================================================================
// 1. ADVANCED FILTER MODAL
// ============================================================================

interface AdvancedFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export function AdvancedFilterModal({ isOpen, onClose, onApply }: AdvancedFilterModalProps) {
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [startDateFrom, setStartDateFrom] = useState('')
  const [startDateTo, setStartDateTo] = useState('')
  const [endDateFrom, setEndDateFrom] = useState('')
  const [endDateTo, setEndDateTo] = useState('')
  const [progressMin, setProgressMin] = useState('')
  const [progressMax, setProgressMax] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedManagers, setSelectedManagers] = useState<string[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const statuses = ['Planning', 'In Progress', 'On Hold', 'Delayed', 'Completed', 'Cancelled']
  const types = ['Commercial Kitchen', 'Cold Room', 'Switchgear', 'HVAC System', 'Modular Kitchen']
  const priorities = ['P1', 'P2', 'P3']
  const managers = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Reddy', 'Vikram Singh']
  const customers = ['Taj Hotels Limited', 'BigBasket Pvt Ltd', 'Larsen & Toubro Limited', 'ITC Hotels', 'Godrej Appliances']
  const locations = ['Mumbai', 'Bangalore', 'Pune', 'Delhi NCR', 'Hyderabad', 'Chennai']

  const toggleSelection = (array: string[], setArray: Function, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value))
    } else {
      setArray([...array, value])
    }
  }

  const handleApply = () => {
    const filters = {
      budget: { min: budgetMin, max: budgetMax },
      startDate: { from: startDateFrom, to: startDateTo },
      endDate: { from: endDateFrom, to: endDateTo },
      progress: { min: progressMin, max: progressMax },
      statuses: selectedStatuses,
      types: selectedTypes,
      priorities: selectedPriorities,
      managers: selectedManagers,
      customers: selectedCustomers,
      locations: selectedLocations
    }
    onApply(filters)
  }

  const handleReset = () => {
    setBudgetMin('')
    setBudgetMax('')
    setStartDateFrom('')
    setStartDateTo('')
    setEndDateFrom('')
    setEndDateTo('')
    setProgressMin('')
    setProgressMax('')
    setSelectedStatuses([])
    setSelectedTypes([])
    setSelectedPriorities([])
    setSelectedManagers([])
    setSelectedCustomers([])
    setSelectedLocations([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Advanced Filters</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Budget Range */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Budget Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (₹)</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="e.g., 5000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget (₹)</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="e.g., 20000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Date Ranges */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Date Ranges
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date From</label>
                  <input
                    type="date"
                    value={startDateFrom}
                    onChange={(e) => setStartDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date To</label>
                  <input
                    type="date"
                    value={startDateTo}
                    onChange={(e) => setStartDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date From</label>
                  <input
                    type="date"
                    value={endDateFrom}
                    onChange={(e) => setEndDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date To</label>
                  <input
                    type="date"
                    value={endDateTo}
                    onChange={(e) => setEndDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Range */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Progress Range (%)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Progress</label>
                <input
                  type="number"
                  value={progressMin}
                  onChange={(e) => setProgressMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Progress</label>
                <input
                  type="number"
                  value={progressMax}
                  onChange={(e) => setProgressMax(e.target.value)}
                  placeholder="100"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Multi-Select Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
              <div className="space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleSelection(selectedStatuses, setSelectedStatuses, status)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Type */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Project Type</h3>
              <div className="space-y-2">
                {types.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleSelection(selectedTypes, setSelectedTypes, type)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Priority</h3>
              <div className="space-y-2">
                {priorities.map(priority => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriorities.includes(priority)}
                      onChange={() => toggleSelection(selectedPriorities, setSelectedPriorities, priority)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Manager */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Project Manager</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {managers.map(manager => (
                  <label key={manager} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedManagers.includes(manager)}
                      onChange={() => toggleSelection(selectedManagers, setSelectedManagers, manager)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{manager}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {customers.map(customer => (
                  <label key={customer} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer)}
                      onChange={() => toggleSelection(selectedCustomers, setSelectedCustomers, customer)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{customer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleSelection(selectedLocations, setSelectedLocations, location)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Reset All
          </button>
          <div className="flex items-center gap-3">
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
    </div>
  )
}

// ============================================================================
// 2. BULK UPDATE MODAL
// ============================================================================

interface BulkUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProjects: any[]
  onUpdate: (updates: any) => void
}

export function BulkUpdateModal({ isOpen, onClose, selectedProjects, onUpdate }: BulkUpdateModalProps) {
  const [updateField, setUpdateField] = useState('status')
  const [newStatus, setNewStatus] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [newManager, setNewManager] = useState('')
  const [notes, setNotes] = useState('')

  const handleUpdate = () => {
    const updates: any = { notes }

    if (updateField === 'status') updates.status = newStatus
    if (updateField === 'priority') updates.priority = newPriority
    if (updateField === 'manager') updates.manager = newManager

    onUpdate(updates)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Bulk Update Projects</h2>
              <p className="text-purple-100 text-sm mt-1">{selectedProjects.length} projects selected</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selected Projects Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Projects</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedProjects.map((project, index) => (
                <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{project.projectNumber}</span>
                  <span>-</span>
                  <span>{project.projectName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Update Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to update?
            </label>
            <select
              value={updateField}
              onChange={(e) => setUpdateField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="status">Project Status</option>
              <option value="priority">Priority Level</option>
              <option value="manager">Project Manager</option>
            </select>
          </div>

          {/* Update Value */}
          {updateField === 'status' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {updateField === 'priority' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Priority</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>
          )}

          {updateField === 'manager' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Project Manager</label>
              <select
                value={newManager}
                onChange={(e) => setNewManager(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Manager</option>
                <option value="Rajesh Kumar">Rajesh Kumar</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Amit Patel">Amit Patel</option>
                <option value="Sunita Reddy">Sunita Reddy</option>
                <option value="Vikram Singh">Vikram Singh</option>
                <option value="Anjali Verma">Anjali Verma</option>
                <option value="Manoj Kumar">Manoj Kumar</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this bulk update..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Important</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This action will update {selectedProjects.length} projects. This cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
            Update {selectedProjects.length} Projects
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CLONE PROJECT MODAL
// ============================================================================

interface CloneProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onClone: (options: any) => void
}

export function CloneProjectModal({ isOpen, onClose, project, onClone }: CloneProjectModalProps) {
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectNumber, setNewProjectNumber] = useState('')
  const [includeTasks, setIncludeTasks] = useState(true)
  const [includeResources, setIncludeResources] = useState(true)
  const [includeBudget, setIncludeBudget] = useState(true)
  const [includeDocuments, setIncludeDocuments] = useState(false)
  const [includeDeliverables, setIncludeDeliverables] = useState(true)
  const [includeSchedule, setIncludeSchedule] = useState(true)
  const [adjustDates, setAdjustDates] = useState(true)
  const [newStartDate, setNewStartDate] = useState('')

  const handleClone = () => {
    const options = {
      newProjectName,
      newProjectNumber,
      includeTasks,
      includeResources,
      includeBudget,
      includeDocuments,
      includeDeliverables,
      includeSchedule,
      adjustDates,
      newStartDate
    }
    onClone(options)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Copy className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Clone Project</h2>
              <p className="text-green-100 text-sm mt-1">Create a copy of {project?.projectNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Source Project Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Source Project</h3>
            <div className="space-y-1 text-sm">
              <p className="text-blue-800"><span className="font-medium">Number:</span> {project?.projectNumber}</p>
              <p className="text-blue-800"><span className="font-medium">Name:</span> {project?.projectName}</p>
              <p className="text-blue-800"><span className="font-medium">Type:</span> {project?.projectType}</p>
              <p className="text-blue-800"><span className="font-medium">Customer:</span> {project?.customer}</p>
            </div>
          </div>

          {/* New Project Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900">New Project Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Number *
              </label>
              <input
                type="text"
                value={newProjectNumber}
                onChange={(e) => setNewProjectNumber(e.target.value)}
                placeholder="e.g., PRJ-2024-010"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., New Commercial Kitchen Project"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Clone Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">What to Clone</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTasks}
                  onChange={(e) => setIncludeTasks(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Tasks & WBS</span>
                  <p className="text-xs text-gray-600">Copy all tasks and work breakdown structure</p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeResources}
                  onChange={(e) => setIncludeResources(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Resources</span>
                  <p className="text-xs text-gray-600">Copy resource assignments and allocations</p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBudget}
                  onChange={(e) => setIncludeBudget(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Budget</span>
                  <p className="text-xs text-gray-600">Copy budget allocations and cost estimates</p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDeliverables}
                  onChange={(e) => setIncludeDeliverables(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Deliverables</span>
                  <p className="text-xs text-gray-600">Copy deliverables and milestones</p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSchedule}
                  onChange={(e) => setIncludeSchedule(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Schedule</span>
                  <p className="text-xs text-gray-600">Copy project timeline and dependencies</p>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDocuments}
                  onChange={(e) => setIncludeDocuments(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Documents</span>
                  <p className="text-xs text-gray-600">Copy all project documents and templates</p>
                </div>
              </label>
            </div>
          </div>

          {/* Date Adjustment */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={adjustDates}
                onChange={(e) => setAdjustDates(e.target.checked)}
                className="rounded border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Adjust Dates</span>
                <p className="text-xs text-gray-600">Shift all dates based on new start date</p>
              </div>
            </label>

            {adjustDates && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleClone}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Clone Project
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. QUICK VIEW MODAL
// ============================================================================

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
}

export function QuickViewModal({ isOpen, onClose, project }: QuickViewModalProps) {
  if (!isOpen || !project) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Project Quick View</h2>
              <p className="text-indigo-100 text-sm mt-1">{project.projectNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Header */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{project.projectName}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{project.projectType}</span>
              <span className={`px-2 py-1 text-xs rounded ${
                project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                project.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {project.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${
                project.priority === 'P1' ? 'bg-red-100 text-red-700' :
                project.priority === 'P2' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {project.priority}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Progress</p>
              <p className="text-2xl font-bold text-blue-900">{project.progress}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Budget</p>
              <p className="text-xl font-bold text-green-900">{formatCurrency(project.budget)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Actual Cost</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(project.actualCost)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Team Size</p>
              <p className="text-2xl font-bold text-orange-900">{project.team}</p>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium text-gray-900">{project.customer}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{project.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Project Manager</p>
                  <p className="font-medium text-gray-900">{project.projectManager}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">{formatDate(project.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">{formatDate(project.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Current Phase</p>
                  <p className="font-medium text-gray-900">{project.phase}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Deliverables</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {project.completedDeliverables} of {project.deliverables} completed
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((project.completedDeliverables / project.deliverables) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(project.completedDeliverables / project.deliverables) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Budget Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Budget Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent:</span>
                <span className="font-medium text-gray-900">{formatCurrency(project.actualCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className={`font-medium ${
                  project.budget - project.actualCost >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(project.budget - project.actualCost)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    (project.actualCost / project.budget) * 100 > 100 ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min((project.actualCost / project.budget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <a
            href={`/project-management/view/${project.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Full Details
          </a>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. ASSIGN MANAGER MODAL
// ============================================================================

interface AssignManagerModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onAssign: (manager: string, notes: string) => void
}

export function AssignManagerModal({ isOpen, onClose, project, onAssign }: AssignManagerModalProps) {
  const [selectedManager, setSelectedManager] = useState('')
  const [notes, setNotes] = useState('')
  const [notifyManager, setNotifyManager] = useState(true)
  const [notifyTeam, setNotifyTeam] = useState(false)

  const managers = [
    { name: 'Rajesh Kumar', projects: 3, availability: '75%' },
    { name: 'Priya Sharma', projects: 4, availability: '65%' },
    { name: 'Amit Patel', projects: 2, availability: '85%' },
    { name: 'Sunita Reddy', projects: 3, availability: '70%' },
    { name: 'Vikram Singh', projects: 5, availability: '55%' },
    { name: 'Anjali Verma', projects: 2, availability: '90%' },
    { name: 'Manoj Kumar', projects: 4, availability: '60%' },
  ]

  const handleAssign = () => {
    onAssign(selectedManager, notes)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Assign Project Manager</h2>
              <p className="text-orange-100 text-sm mt-1">{project?.projectNumber} - {project?.projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Manager */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1">Current Project Manager</p>
            <p className="font-semibold text-blue-900">{project?.projectManager || 'Not Assigned'}</p>
          </div>

          {/* Select New Manager */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Project Manager *
            </label>
            <div className="space-y-2">
              {managers.map((manager) => (
                <label
                  key={manager.name}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedManager === manager.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="manager"
                      value={manager.name}
                      checked={selectedManager === manager.name}
                      onChange={(e) => setSelectedManager(e.target.value)}
                      className="text-orange-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{manager.name}</p>
                      <p className="text-sm text-gray-600">
                        {manager.projects} active projects · {manager.availability} available
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    parseInt(manager.availability) >= 80 ? 'bg-green-100 text-green-700' :
                    parseInt(manager.availability) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {manager.availability} Available
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this assignment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Notification Options */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-gray-900">Notifications</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyManager}
                onChange={(e) => setNotifyManager(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Notify new project manager via email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTeam}
                onChange={(e) => setNotifyTeam(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Notify project team members</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedManager}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Assign Manager
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. EXPORT PROJECTS MODAL
// ============================================================================

interface ExportProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProjects: any[]
  onExport: (options: any) => void
}

export function ExportProjectsModal({ isOpen, onClose, selectedProjects, onExport }: ExportProjectsModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [includeFields, setIncludeFields] = useState<string[]>([
    'basic',
    'budget',
    'schedule',
    'team',
    'status'
  ])
  const [dateRange, setDateRange] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const fieldOptions = [
    { id: 'basic', label: 'Basic Info', description: 'Project number, name, type, customer' },
    { id: 'budget', label: 'Budget & Costs', description: 'Budget, actual cost, variance' },
    { id: 'schedule', label: 'Schedule', description: 'Start date, end date, duration' },
    { id: 'team', label: 'Team Info', description: 'Manager, team size, resources' },
    { id: 'status', label: 'Status & Progress', description: 'Status, priority, progress %' },
    { id: 'deliverables', label: 'Deliverables', description: 'Deliverables and milestones' },
    { id: 'location', label: 'Location', description: 'Project location and site details' },
  ]

  const toggleField = (fieldId: string) => {
    if (includeFields.includes(fieldId)) {
      setIncludeFields(includeFields.filter(f => f !== fieldId))
    } else {
      setIncludeFields([...includeFields, fieldId])
    }
  }

  const handleExport = () => {
    const options = {
      format: exportFormat,
      fields: includeFields,
      dateRange,
      customStartDate,
      customEndDate,
      projectCount: selectedProjects.length
    }
    onExport(options)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Export Projects</h2>
              <p className="text-teal-100 text-sm mt-1">
                {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-teal-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                exportFormat === 'excel' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
              }`}>
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
                <span className="text-xs text-gray-600">.xlsx</span>
              </label>

              <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                exportFormat === 'pdf' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
              }`}>
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
                <span className="text-xs text-gray-600">.pdf</span>
              </label>

              <label className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                exportFormat === 'csv' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
              }`}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-gray-900">CSV</span>
                <span className="text-xs text-gray-600">.csv</span>
              </label>
            </div>
          </div>

          {/* Include Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
            <div className="space-y-2">
              {fieldOptions.map((field) => (
                <label
                  key={field.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={includeFields.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{field.label}</p>
                    <p className="text-xs text-gray-600">{field.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range Filter</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={dateRange === 'all'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-teal-600"
                />
                <span className="text-sm text-gray-700">All Projects</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="active"
                  checked={dateRange === 'active'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-teal-600"
                />
                <span className="text-sm text-gray-700">Active Projects Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  checked={dateRange === 'custom'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-teal-600"
                />
                <span className="text-sm text-gray-700">Custom Date Range</span>
              </label>

              {dateRange === 'custom' && (
                <div className="ml-6 grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Export Summary</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>Format: <span className="font-medium uppercase">{exportFormat}</span></p>
              <p>Projects: <span className="font-medium">{selectedProjects.length}</span></p>
              <p>Fields: <span className="font-medium">{includeFields.length} selected</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={includeFields.length === 0}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export Projects
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. ARCHIVE PROJECT MODAL
// ============================================================================

interface ArchiveProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onArchive: (reason: string, preserveData: boolean) => void
}

export function ArchiveProjectModal({ isOpen, onClose, project, onArchive }: ArchiveProjectModalProps) {
  const [reason, setReason] = useState('')
  const [archiveReason, setArchiveReason] = useState('')
  const [preserveDocuments, setPreserveDocuments] = useState(true)
  const [preserveFinancials, setPreserveFinancials] = useState(true)
  const [notifyTeam, setNotifyTeam] = useState(true)
  const [confirmArchive, setConfirmArchive] = useState(false)

  const reasonOptions = [
    'Project Completed Successfully',
    'Project Cancelled',
    'Project On Hold - Indefinite',
    'Duplicate Project',
    'Other (specify below)'
  ]

  const handleArchive = () => {
    const finalReason = reason === 'Other (specify below)' ? archiveReason : reason
    onArchive(finalReason, preserveDocuments || preserveFinancials)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Archive Project</h2>
              <p className="text-gray-200 text-sm mt-1">{project?.projectNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-gray-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700"><span className="font-medium">Name:</span> {project?.projectName}</p>
              <p className="text-gray-700"><span className="font-medium">Customer:</span> {project?.customer}</p>
              <p className="text-gray-700"><span className="font-medium">Status:</span> {project?.status}</p>
              <p className="text-gray-700"><span className="font-medium">Progress:</span> {project?.progress}%</p>
            </div>
          </div>

          {/* Archive Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Archiving *
            </label>
            <div className="space-y-2">
              {reasonOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-gray-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {reason === 'Other (specify below)' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please Specify Reason *
              </label>
              <textarea
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="Enter the reason for archiving this project..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
          )}

          {/* Data Preservation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3">Data Preservation</h4>
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveDocuments}
                  onChange={(e) => setPreserveDocuments(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-yellow-900">Preserve Documents</span>
                  <p className="text-xs text-yellow-700">Keep all project documents accessible in archive</p>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveFinancials}
                  onChange={(e) => setPreserveFinancials(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-yellow-900">Preserve Financial Data</span>
                  <p className="text-xs text-yellow-700">Maintain budget and cost records for reporting</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTeam}
                onChange={(e) => setNotifyTeam(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Notify project team members about archiving</span>
            </label>
          </div>

          {/* Impact Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Archive Impact</p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Project will be removed from active project list</li>
                  <li>Team members will no longer have active access</li>
                  <li>Reporting will move to archived projects section</li>
                  <li>Project can be restored from archive if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmArchive}
                onChange={(e) => setConfirmArchive(e.target.checked)}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                I understand that archiving this project will remove it from the active project list. I can restore it later if needed.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleArchive}
            disabled={!reason || (reason === 'Other (specify below)' && !archiveReason) || !confirmArchive}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Archive className="w-4 h-4" />
            Archive Project
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. PROJECT TIMELINE MODAL
// ============================================================================

interface ProjectTimelineModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
}

export function ProjectTimelineModal({ isOpen, onClose, project }: ProjectTimelineModalProps) {
  const [viewType, setViewType] = useState('gantt')
  const [zoomLevel, setZoomLevel] = useState('months')

  // Mock timeline data
  const phases = [
    {
      name: 'Design & Planning',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      progress: 100,
      color: 'blue',
      tasks: 12,
      completedTasks: 12
    },
    {
      name: 'Procurement',
      startDate: '2024-02-10',
      endDate: '2024-03-20',
      progress: 85,
      color: 'purple',
      tasks: 8,
      completedTasks: 7
    },
    {
      name: 'Installation',
      startDate: '2024-03-15',
      endDate: '2024-05-30',
      progress: 45,
      color: 'orange',
      tasks: 15,
      completedTasks: 7
    },
    {
      name: 'Testing & QA',
      startDate: '2024-05-25',
      endDate: '2024-06-20',
      progress: 0,
      color: 'green',
      tasks: 6,
      completedTasks: 0
    },
    {
      name: 'Handover',
      startDate: '2024-06-15',
      endDate: '2024-06-30',
      progress: 0,
      color: 'teal',
      tasks: 4,
      completedTasks: 0
    }
  ]

  const milestones = [
    { name: 'Design Approval', date: '2024-02-15', status: 'completed' },
    { name: 'Equipment Arrival', date: '2024-03-20', status: 'completed' },
    { name: 'Installation Complete', date: '2024-05-30', status: 'upcoming' },
    { name: 'Final Inspection', date: '2024-06-20', status: 'upcoming' },
    { name: 'Project Handover', date: '2024-06-30', status: 'upcoming' }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Project Timeline</h2>
              <p className="text-blue-100 text-sm mt-1">{project?.projectNumber} - {project?.projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gantt">Gantt Chart</option>
                <option value="list">List View</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Zoom:</span>
              <select
                value={zoomLevel}
                onChange={(e) => setZoomLevel(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Duration: {project?.startDate} - {project?.endDate}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Duration</p>
              <p className="text-2xl font-bold text-blue-900">180 Days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Days Elapsed</p>
              <p className="text-2xl font-bold text-green-900">95 Days</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Days Remaining</p>
              <p className="text-2xl font-bold text-orange-900">85 Days</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-purple-900">{project?.progress}%</p>
            </div>
          </div>

          {/* Phases Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5" />
              Project Phases
            </h3>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${phase.color}-500`}></div>
                      <span className="font-medium text-gray-900">{phase.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${phase.color}-500 h-2 rounded-full transition-all`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{phase.completedTasks}/{phase.tasks} tasks completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Key Milestones
            </h3>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{milestone.name}</p>
                    <p className="text-sm text-gray-600">{formatDate(milestone.date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {milestone.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Critical Path Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  The critical path includes Design, Procurement, and Installation phases. Any delay in these phases will impact the overall project timeline.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Timeline
            </button>
            <a
              href={`/project-management/gantt/${project?.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Full Gantt View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. TEAM MEMBERS MODAL
// ============================================================================

interface TeamMembersModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onUpdateTeam?: (members: any[]) => void
}

export function TeamMembersModal({ isOpen, onClose, project, onUpdateTeam }: TeamMembersModalProps) {
  const [showAddMember, setShowAddMember] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Project Manager',
      email: 'rajesh.kumar@company.com',
      allocation: 100,
      startDate: '2024-01-01',
      status: 'active',
      tasksAssigned: 12,
      tasksCompleted: 8
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Lead Engineer',
      email: 'priya.sharma@company.com',
      allocation: 80,
      startDate: '2024-01-05',
      status: 'active',
      tasksAssigned: 15,
      tasksCompleted: 10
    },
    {
      id: 3,
      name: 'Amit Patel',
      role: 'Site Supervisor',
      email: 'amit.patel@company.com',
      allocation: 100,
      startDate: '2024-03-01',
      status: 'active',
      tasksAssigned: 8,
      tasksCompleted: 3
    },
    {
      id: 4,
      name: 'Sunita Reddy',
      role: 'QA Specialist',
      email: 'sunita.reddy@company.com',
      allocation: 50,
      startDate: '2024-01-15',
      status: 'active',
      tasksAssigned: 6,
      tasksCompleted: 4
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Procurement Officer',
      email: 'vikram.singh@company.com',
      allocation: 60,
      startDate: '2024-01-10',
      status: 'inactive',
      tasksAssigned: 10,
      tasksCompleted: 10
    }
  ]

  const availableMembers = [
    { name: 'Anjali Verma', role: 'Engineer', availability: '90%' },
    { name: 'Manoj Kumar', role: 'Technician', availability: '75%' },
    { name: 'Deepak Joshi', role: 'Designer', availability: '60%' },
  ]

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'Project Manager': 'bg-purple-100 text-purple-700',
      'Lead Engineer': 'bg-blue-100 text-blue-700',
      'Site Supervisor': 'bg-orange-100 text-orange-700',
      'QA Specialist': 'bg-green-100 text-green-700',
      'Procurement Officer': 'bg-teal-100 text-teal-700',
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Team Members</h2>
              <p className="text-purple-100 text-sm mt-1">
                {project?.projectNumber} - {teamMembers.filter(m => m.status === 'active').length} active members
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team members..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Member Form */}
          {showAddMember && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">Add Team Member</h3>
              <div className="space-y-3">
                {availableMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role} - {member.availability} available</p>
                    </div>
                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                      Add to Team
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-blue-900">{teamMembers.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Avg Allocation</p>
              <p className="text-2xl font-bold text-orange-900">
                {Math.round(teamMembers.reduce((acc, m) => acc + m.allocation, 0) / teamMembers.length)}%
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-purple-900">
                {teamMembers.reduce((acc, m) => acc + m.tasksAssigned, 0)}
              </p>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-3">
            {teamMembers
              .filter(member =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.role.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((member) => (
                <div
                  key={member.id}
                  className={`bg-white border-2 rounded-lg p-4 ${
                    member.status === 'active' ? 'border-gray-200' : 'border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                        {member.status === 'inactive' && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm text-gray-900">{member.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Allocation</p>
                          <p className="text-sm font-medium text-gray-900">{member.allocation}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Start Date</p>
                          <p className="text-sm text-gray-900">
                            {new Date(member.startDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Tasks</p>
                          <p className="text-sm text-gray-900">
                            {member.tasksCompleted}/{member.tasksAssigned} completed
                          </p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Task Completion</span>
                          <span className="font-medium text-gray-900">
                            {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${(member.tasksCompleted / member.tasksAssigned) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Team List
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. QUICK NOTES MODAL
// ============================================================================

interface QuickNotesModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onSaveNote: (note: any) => void
}

export function QuickNotesModal({ isOpen, onClose, project, onSaveNote }: QuickNotesModalProps) {
  const [noteText, setNoteText] = useState('')
  const [noteCategory, setNoteCategory] = useState('general')
  const [notePriority, setNotePriority] = useState('normal')
  const [isPrivate, setIsPrivate] = useState(false)
  const [attachFile, setAttachFile] = useState(false)

  // Mock existing notes
  const existingNotes = [
    {
      id: 1,
      text: 'Client requested additional modifications to kitchen layout. Need to revise drawings.',
      category: 'client',
      priority: 'high',
      author: 'Rajesh Kumar',
      date: '2024-03-15T10:30:00',
      isPrivate: false
    },
    {
      id: 2,
      text: 'Equipment delivery scheduled for next week. Ensure site is ready.',
      category: 'logistics',
      priority: 'normal',
      author: 'Priya Sharma',
      date: '2024-03-14T14:20:00',
      isPrivate: false
    },
    {
      id: 3,
      text: 'Budget review meeting scheduled with finance team on Friday.',
      category: 'financial',
      priority: 'normal',
      author: 'Rajesh Kumar',
      date: '2024-03-13T09:15:00',
      isPrivate: true
    },
    {
      id: 4,
      text: 'QA inspection identified minor issues in electrical work. Contractor notified.',
      category: 'technical',
      priority: 'high',
      author: 'Sunita Reddy',
      date: '2024-03-12T16:45:00',
      isPrivate: false
    }
  ]

  const categories = [
    { value: 'general', label: 'General', icon: '📝', color: 'gray' },
    { value: 'client', label: 'Client Communication', icon: '👥', color: 'blue' },
    { value: 'technical', label: 'Technical', icon: '⚙️', color: 'purple' },
    { value: 'financial', label: 'Financial', icon: '💰', color: 'green' },
    { value: 'logistics', label: 'Logistics', icon: '🚚', color: 'orange' },
    { value: 'risk', label: 'Risk/Issue', icon: '⚠️', color: 'red' }
  ]

  const handleSaveNote = () => {
    const note = {
      text: noteText,
      category: noteCategory,
      priority: notePriority,
      isPrivate,
      timestamp: new Date().toISOString()
    }
    onSaveNote(note)
    setNoteText('')
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.color || 'gray'
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StickyNote className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Project Notes</h2>
              <p className="text-yellow-100 text-sm mt-1">{project?.projectNumber} - Quick Notes & Updates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-yellow-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add New Note */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-3">Add New Note</h3>

            <div className="space-y-4">
              {/* Note Text */}
              <div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your note here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      noteCategory === cat.value
                        ? `border-${cat.color}-500 bg-${cat.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={noteCategory === cat.value}
                      onChange={(e) => setNoteCategory(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-xs text-center text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Priority:</label>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Private (only visible to me)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachFile}
                    onChange={(e) => setAttachFile(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Attach file</span>
                </label>
              </div>

              {/* File Upload */}
              {attachFile && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Existing Notes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recent Notes ({existingNotes.length})</h3>
            <div className="space-y-3">
              {existingNotes.map((note) => (
                <div
                  key={note.id}
                  className={`bg-white border-l-4 border-${getCategoryColor(note.category)}-500 rounded-lg p-4 shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${getCategoryColor(note.category)}-100 text-${getCategoryColor(note.category)}-700`}>
                        {categories.find(c => c.value === note.category)?.icon}{' '}
                        {categories.find(c => c.value === note.category)?.label}
                      </span>
                      {note.priority === 'high' && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                          High Priority
                        </span>
                      )}
                      {note.isPrivate && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          🔒 Private
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-900 mb-3">{note.text}</p>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {note.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(note.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            All notes are automatically saved and synced
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Notes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
