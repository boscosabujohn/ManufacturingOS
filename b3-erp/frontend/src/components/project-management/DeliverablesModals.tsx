'use client'

import React, { useState } from 'react'
import {
  X,
  Plus,
  Edit,
  Upload,
  History,
  CheckSquare,
  Link2,
  ClipboardCheck,
  Calendar,
  Users,
  FileText,
  Download,
  GitBranch,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react'

// ============================================================================
// 1. CREATE DELIVERABLE MODAL
// ============================================================================

interface CreateDeliverableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (deliverable: any) => void
}

export function CreateDeliverableModal({ isOpen, onClose, onCreate }: CreateDeliverableModalProps) {
  const [deliverableName, setDeliverableName] = useState('')
  const [deliverableNumber, setDeliverableNumber] = useState('')
  const [type, setType] = useState('Equipment')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('Units')
  const [linkedTasks, setLinkedTasks] = useState<string[]>([])
  const [attachments, setAttachments] = useState<File[]>([])

  const deliverableTypes = ['Equipment', 'Installation', 'Documentation', 'Training', 'Service']
  const units = ['Units', 'Phase', 'Set', 'Items', 'Panels', 'Staff', 'Project', 'Documents']

  const handleCreate = () => {
    const deliverable = {
      deliverableName,
      deliverableNumber,
      type,
      description,
      assignedTo,
      plannedDate,
      quantity: parseFloat(quantity),
      unit,
      linkedTasks,
      attachments,
    }
    onCreate(deliverable)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Create Deliverable</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deliverable Number *
              </label>
              <input
                type="text"
                value={deliverableNumber}
                onChange={(e) => setDeliverableNumber(e.target.value)}
                placeholder="e.g., DEL-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {deliverableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliverable Name *
            </label>
            <input
              type="text"
              value={deliverableName}
              onChange={(e) => setDeliverableName(e.target.value)}
              placeholder="Enter deliverable name"
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
              placeholder="Describe the deliverable..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planned Date *
              </label>
              <input
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
              <option value="Logistics Team">Logistics Team</option>
              <option value="QA Team">QA Team</option>
              <option value="Training Team">Training Team</option>
            </select>
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
            onClick={handleCreate}
            disabled={!deliverableName || !deliverableNumber || !assignedTo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Create Deliverable
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2-12. STREAMLINED MODALS FOR FILE SIZE MANAGEMENT
// ============================================================================

// 2. Edit Deliverable Modal
export function EditDeliverableModal({ isOpen, onClose, deliverable, onUpdate }: any) {
  const [status, setStatus] = useState(deliverable?.status || 'Not Started')
  const [progress, setProgress] = useState(deliverable?.progress || 0)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Edit Deliverable</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} className="w-full" />
            <div className="text-center text-2xl font-bold text-green-600">{progress}%</div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ status, progress })} className="px-4 py-2 bg-green-600 text-white rounded-lg">Update</button>
        </div>
      </div>
    </div>
  )
}

// 3. Upload Document Modal
export function UploadDocumentModal({ isOpen, onClose, deliverable, onUpload }: any) {
  const [documentType, setDocumentType] = useState('specification')
  const [version, setVersion] = useState('1.0')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Upload Document</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="specification">Specification</option>
              <option value="drawing">Drawing</option>
              <option value="certificate">Certificate</option>
              <option value="report">Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, DWG up to 50MB</p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onUpload({ documentType, version })} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. Version History Modal
export function VersionHistoryModal({ isOpen, onClose, deliverable }: any) {
  const versions = [
    { version: '3.0', date: '2024-03-15', author: 'Rajesh Kumar', changes: 'Updated specifications' },
    { version: '2.0', date: '2024-03-10', author: 'Priya Sharma', changes: 'Added drawings' },
    { version: '1.0', date: '2024-03-05', author: 'Rajesh Kumar', changes: 'Initial version' },
  ]

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Version History</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {versions.map((v, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Version {v.version}</p>
                    <p className="text-sm text-gray-600 mt-1">{v.changes}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{v.author}</p>
                    <p>{v.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
}

// 5. Review/Approval Modal
export function ReviewApprovalModal({ isOpen, onClose, deliverable, onSubmit }: any) {
  const [action, setAction] = useState('approve')
  const [comments, setComments] = useState('')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Review & Approve</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="action" value="approve" checked={action === 'approve'} onChange={(e) => setAction(e.target.value)} />
                <span className="text-sm">Approve</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="action" value="reject" checked={action === 'reject'} onChange={(e) => setAction(e.target.value)} />
                <span className="text-sm">Reject</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="action" value="request_changes" checked={action === 'request_changes'} onChange={(e) => setAction(e.target.value)} />
                <span className="text-sm">Request Changes</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} placeholder="Add your review comments..." className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onSubmit({ action, comments })} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Submit Review</button>
        </div>
      </div>
    </div>
  )
}

// 6. Link to Tasks Modal
export function LinkToTasksModal({ isOpen, onClose, deliverable, onLink }: any) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const availableTasks = [
    'Site Survey & Planning',
    'Equipment Procurement',
    'Installation',
    'Testing',
    'Commissioning'
  ]

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Link to Tasks</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-teal-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {availableTasks.map((task) => (
              <label key={task} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{task}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onLink(selectedTasks)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Link Tasks</button>
        </div>
      </div>
    </div>
  )
}

// 7. Quality Checklist Modal
export function QualityChecklistModal({ isOpen, onClose, deliverable, onSave }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Quality Checklist</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-pink-700 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Complete the quality checklist for this deliverable</p>
          <div className="space-y-3">
            {['Specifications met', 'Documentation complete', 'Testing passed', 'Approval received'].map((item, index) => (
              <label key={index} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Save Checklist</button>
        </div>
      </div>
    </div>
  )
}

// 8-12. Remaining Modals (Simplified)
export function DeliverableTimelineModal({ isOpen, onClose, deliverable }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Deliverable Timeline</h2>
          <button onClick={onClose} className="text-white hover:bg-yellow-700 p-2 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6"><p className="text-gray-600">Timeline visualization for deliverable milestones</p></div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
}

export function StakeholderSignOffModal({ isOpen, onClose, deliverable, onSubmit }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Stakeholder Sign-off</h2>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-2 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6"><p className="text-gray-600">Request and track stakeholder sign-offs</p></div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-red-600 text-white rounded-lg">Request Sign-off</button>
        </div>
      </div>
    </div>
  )
}

export function DeliverableTemplatesModal({ isOpen, onClose, onSelect }: any) {
  const templates = [
    { id: 'equipment', name: 'Equipment Delivery Template', items: 12 },
    { id: 'installation', name: 'Installation Template', items: 8 },
    { id: 'documentation', name: 'Documentation Template', items: 15 },
  ]

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Deliverable Templates</h2>
          <button onClick={onClose} className="text-white hover:bg-cyan-700 p-2 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-3">
          {templates.map((t) => (
            <div key={t.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-600">{t.items} checklist items</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
}

export function ExportDeliverablesModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('excel')

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Export Deliverables</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-gray-700 p-2 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onExport(format)} className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

export function DeliverableDependenciesModal({ isOpen, onClose, deliverable, onUpdate }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Deliverable Dependencies</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-violet-700 p-2 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6"><p className="text-gray-600">Manage dependencies between deliverables</p></div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={onUpdate} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Save Dependencies</button>
        </div>
      </div>
    </div>
  )
}
