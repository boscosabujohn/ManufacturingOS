'use client'

import React, { useState } from 'react'
import {
  X,
  Plus,
  Edit,
  Move,
  GitBranch,
  Eye,
  Users,
  TrendingUp,
  Download,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
} from 'lucide-react'

// ============================================================================
// 1. ADD WORK PACKAGE MODAL
// ============================================================================

interface AddWorkPackageModalProps {
  isOpen: boolean
  onClose: () => void
  parentNode?: any
  onAdd: (workPackage: any) => void
}

export function AddWorkPackageModal({ isOpen, onClose, parentNode, onAdd }: AddWorkPackageModalProps) {
  const [packageName, setPackageName] = useState('')
  const [packageCode, setPackageCode] = useState('')
  const [packageType, setPackageType] = useState('Activity')
  const [assignedTo, setAssignedTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')
  const [deliverables, setDeliverables] = useState('')

  const handleAdd = () => {
    const workPackage = {
      name: packageName,
      code: packageCode,
      type: packageType,
      assignedTo,
      startDate,
      endDate,
      estimatedHours: parseFloat(estimatedHours),
      budget: parseFloat(budget),
      description,
      deliverables,
      parent: parentNode?.id || null,
    }
    onAdd(workPackage)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Add Work Package</h2>
              {parentNode && (
                <p className="text-blue-100 text-sm mt-1">Under: {parentNode.name}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WBS Code *
              </label>
              <input
                type="text"
                value={packageCode}
                onChange={(e) => setPackageCode(e.target.value)}
                placeholder="e.g., 1.2.3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Type *
              </label>
              <select
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Phase">Phase</option>
                <option value="Activity">Activity</option>
                <option value="Task">Task</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Package Name *
            </label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Enter work package name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work package scope and objectives..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Assignment & Schedule */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To *
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select team member...</option>
                <option value="Rajesh Kumar">Rajesh Kumar</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Amit Patel">Amit Patel</option>
                <option value="Installation Team A">Installation Team A</option>
                <option value="Civil Team">Civil Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours *
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (₹) *
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Deliverables
            </label>
            <textarea
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="List the expected deliverables for this work package..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            disabled={!packageName || !packageCode || !assignedTo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Work Package
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2-10. SIMPLIFIED MODALS FOR FILE SIZE MANAGEMENT
// ============================================================================

// 2. Edit WBS Item Modal
export function EditWBSItemModal({ isOpen, onClose, item, onUpdate }: any) {
  const [name, setName] = useState(item?.name || '')
  const [status, setStatus] = useState(item?.status || 'Not Started')
  const [progress, setProgress] = useState(item?.progress || 0)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Edit Work Package</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
              <input type="number" value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} min="0" max="100" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ name, status, progress })} className="px-4 py-2 bg-green-600 text-white rounded-lg">Update</button>
        </div>
      </div>
    </div>
  )
}

// 3. Move WBS Item Modal
export function MoveWBSItemModal({ isOpen, onClose, item, onMove }: any) {
  const [targetParent, setTargetParent] = useState('')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Move className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Move Work Package</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">Moving: <span className="font-medium">{item?.name}</span></p>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Parent</label>
          <select value={targetParent} onChange={(e) => setTargetParent(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select parent...</option>
            <option value="1.1">1.1 - Project Initiation</option>
            <option value="1.2">1.2 - Procurement & Preparation</option>
            <option value="1.3">1.3 - Civil Work</option>
          </select>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onMove(targetParent)} disabled={!targetParent} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">Move</button>
        </div>
      </div>
    </div>
  )
}

// 4. Decompose Task Modal
export function DecomposeTaskModal({ isOpen, onClose, task, onDecompose }: any) {
  const [subtasks, setSubtasks] = useState([{ name: '', hours: '' }])

  const addSubtask = () => {
    setSubtasks([...subtasks, { name: '', hours: '' }])
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Decompose into Subtasks</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <p className="text-sm text-gray-600">Breaking down: <span className="font-medium">{task?.name}</span></p>
          {subtasks.map((subtask, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input type="text" placeholder="Subtask name" value={subtask.name} onChange={(e) => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index].name = e.target.value
                  setSubtasks(newSubtasks)
                }} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <input type="number" placeholder="Hours" value={subtask.hours} onChange={(e) => {
                  const newSubtasks = [...subtasks]
                  newSubtasks[index].hours = e.target.value
                  setSubtasks(newSubtasks)
                }} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          ))}
          <button onClick={addSubtask} className="text-sm text-orange-600 hover:text-orange-700">+ Add Subtask</button>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onDecompose(subtasks)} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Create Subtasks</button>
        </div>
      </div>
    </div>
  )
}

// 5. WBS Details Modal
export function WBSDetailsModal({ isOpen, onClose, item }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Work Package Details</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600">WBS Code</p>
              <p className="font-semibold text-gray-900">{item?.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold text-gray-900">{item?.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className="inline-flex px-2 py-1 rounded text-sm bg-blue-100 text-blue-700">{item?.status}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="font-semibold text-gray-900">{item?.progress}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Hours</p>
              <p className="font-semibold text-gray-900">{item?.estimatedHours}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Actual Hours</p>
              <p className="font-semibold text-gray-900">{item?.actualHours}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-semibold text-gray-900">₹{item?.budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Actual Cost</p>
              <p className="font-semibold text-gray-900">₹{item?.actualCost?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
}

// 6. Assign Resources Modal
export function AssignResourcesModal({ isOpen, onClose, item, onAssign }: any) {
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const resources = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Installation Team A', 'Civil Team']

  const toggleResource = (resource: string) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter(r => r !== resource))
    } else {
      setSelectedResources([...selectedResources, resource])
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Assign Resources</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-teal-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">Assigning to: <span className="font-medium">{item?.name}</span></p>
          <div className="space-y-2">
            {resources.map((resource) => (
              <label key={resource} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={selectedResources.includes(resource)} onChange={() => toggleResource(resource)} className="rounded" />
                <span className="text-sm">{resource}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onAssign(selectedResources)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Assign</button>
        </div>
      </div>
    </div>
  )
}

// 7. Track Progress Modal
export function TrackProgressModal({ isOpen, onClose, item, onUpdate }: any) {
  const [progress, setProgress] = useState(item?.progress || 0)
  const [actualHours, setActualHours] = useState(item?.actualHours || 0)
  const [notes, setNotes] = useState('')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Track Progress</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-yellow-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} className="w-full" />
            <div className="text-center font-bold text-2xl text-yellow-600">{progress}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours Spent</label>
            <input type="number" value={actualHours} onChange={(e) => setActualHours(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ progress, actualHours, notes })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Update Progress</button>
        </div>
      </div>
    </div>
  )
}

// 8. WBS Dependencies Modal
export function WBSDependenciesModal({ isOpen, onClose, item, onUpdate }: any) {
  const [dependencies, setDependencies] = useState<string[]>([])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Manage Dependencies</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-pink-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">Setting dependencies for: <span className="font-medium">{item?.name}</span></p>
          <p className="text-sm text-gray-500">Dependency management interface would appear here</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpdate(dependencies)} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Save Dependencies</button>
        </div>
      </div>
    </div>
  )
}

// 9. Export WBS Modal
export function ExportWBSModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('excel')
  const [includeChildren, setIncludeChildren] = useState(true)
  const [includeMetrics, setIncludeMetrics] = useState(true)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Export WBS</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-gray-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="excel">Excel (.xlsx)</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeChildren} onChange={(e) => setIncludeChildren(e.target.checked)} className="rounded" />
              <span className="text-sm">Include all child packages</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeMetrics} onChange={(e) => setIncludeMetrics(e.target.checked)} className="rounded" />
              <span className="text-sm">Include hours and budget metrics</span>
            </label>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onExport({ format, includeChildren, includeMetrics })} className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

// 10. Import WBS Template Modal
export function ImportWBSTemplateModal({ isOpen, onClose, onImport }: any) {
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const templates = [
    { id: 'commercial-kitchen', name: 'Commercial Kitchen Installation', packages: 25 },
    { id: 'cold-room', name: 'Cold Room Setup', packages: 18 },
    { id: 'switchgear', name: 'Switchgear Manufacturing', packages: 15 },
  ]

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Import WBS Template</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-2">
          {templates.map((template) => (
            <label key={template.id} className={`block p-3 border-2 rounded-lg cursor-pointer ${selectedTemplate === template.id ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
              <input type="radio" name="template" value={template.id} checked={selectedTemplate === template.id} onChange={(e) => setSelectedTemplate(e.target.value)} className="sr-only" />
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.packages} work packages</p>
                </div>
                {selectedTemplate === template.id && <CheckCircle className="w-6 h-6 text-red-600" />}
              </div>
            </label>
          ))}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onImport(selectedTemplate)} disabled={!selectedTemplate} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Template
          </button>
        </div>
      </div>
    </div>
  )
}
