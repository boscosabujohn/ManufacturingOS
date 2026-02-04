'use client'

import { useState } from 'react'
import { X, Users, TrendingUp, TrendingDown, Calendar, Clock, Award, Check, AlertCircle } from 'lucide-react'

export interface LaborRate {
  id: string
  skillCode: string
  skillName: string
  department: string
  skillLevel: 'trainee' | 'skilled' | 'expert' | 'supervisor'
  standardRate: number
  overtimeRate: number
  holidayRate: number
  effectiveFrom: string
  effectiveTo?: string
  certificationsRequired: string
  availability: number
  lastUpdated: string
  updatedBy: string
  status: 'active' | 'inactive'
}

// Add Labor Rate Modal
interface AddLaborRateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rate: Partial<LaborRate>) => void
}

export function AddLaborRateModal({ isOpen, onClose, onSave }: AddLaborRateModalProps) {
  const [formData, setFormData] = useState({
    skillCode: '',
    skillName: '',
    department: '',
    skillLevel: 'skilled' as 'trainee' | 'skilled' | 'expert' | 'supervisor',
    standardRate: '',
    overtimeRate: '',
    holidayRate: '',
    effectiveFrom: '',
    certificationsRequired: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.skillCode) newErrors.skillCode = 'Skill code is required'
    if (!formData.skillName) newErrors.skillName = 'Skill name is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.standardRate || parseFloat(formData.standardRate) <= 0) {
      newErrors.standardRate = 'Valid standard rate is required'
    }
    if (!formData.overtimeRate || parseFloat(formData.overtimeRate) <= 0) {
      newErrors.overtimeRate = 'Valid overtime rate is required'
    }
    if (!formData.holidayRate || parseFloat(formData.holidayRate) <= 0) {
      newErrors.holidayRate = 'Valid holiday rate is required'
    }
    if (!formData.effectiveFrom) newErrors.effectiveFrom = 'Effective date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        skillCode: formData.skillCode,
        skillName: formData.skillName,
        department: formData.department,
        skillLevel: formData.skillLevel,
        standardRate: parseFloat(formData.standardRate),
        overtimeRate: parseFloat(formData.overtimeRate),
        holidayRate: parseFloat(formData.holidayRate),
        effectiveFrom: formData.effectiveFrom,
        certificationsRequired: formData.certificationsRequired,
        status: 'active'
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Labor Rate</h2>
              <p className="text-sm text-purple-100">Add new labor skill with rate information</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-3">
            {/* Skill Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.skillCode}
                onChange={(e) => setFormData({ ...formData, skillCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., WELD-001"
              />
              {errors.skillCode && (
                <p className="text-red-500 text-sm mt-1">{errors.skillCode}</p>
              )}
            </div>

            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.skillName}
                onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., TIG Welding"
              />
              {errors.skillName && (
                <p className="text-red-500 text-sm mt-1">{errors.skillName}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                <option value="Fabrication">Fabrication</option>
                <option value="Welding">Welding</option>
                <option value="Assembly">Assembly</option>
                <option value="Finishing">Finishing</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Installation">Installation</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="trainee">Trainee</option>
                <option value="skilled">Skilled</option>
                <option value="expert">Expert</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            {/* Standard Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.standardRate}
                onChange={(e) => setFormData({ ...formData, standardRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
              {errors.standardRate && (
                <p className="text-red-500 text-sm mt-1">{errors.standardRate}</p>
              )}
            </div>

            {/* Overtime Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overtime Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
              {errors.overtimeRate && (
                <p className="text-red-500 text-sm mt-1">{errors.overtimeRate}</p>
              )}
            </div>

            {/* Holiday Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holiday Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.holidayRate}
                onChange={(e) => setFormData({ ...formData, holidayRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
              {errors.holidayRate && (
                <p className="text-red-500 text-sm mt-1">{errors.holidayRate}</p>
              )}
            </div>

            {/* Effective From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.effectiveFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>
              )}
            </div>

            {/* Certifications Required */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications Required</label>
              <input
                type="text"
                value={formData.certificationsRequired}
                onChange={(e) => setFormData({ ...formData, certificationsRequired: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., AWS D1.1, ASME Section IX"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes about this labor skill..."
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Save Labor Rate
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Labor Rate Modal
interface EditLaborRateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rate: LaborRate) => void
  rate: LaborRate | null
}

export function EditLaborRateModal({ isOpen, onClose, onSave, rate }: EditLaborRateModalProps) {
  const [formData, setFormData] = useState({
    standardRate: rate?.standardRate.toString() || '',
    overtimeRate: rate?.overtimeRate.toString() || '',
    holidayRate: rate?.holidayRate.toString() || '',
    effectiveFrom: rate?.effectiveFrom || '',
    certificationsRequired: rate?.certificationsRequired || '',
    status: rate?.status || 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.standardRate || parseFloat(formData.standardRate) <= 0) {
      newErrors.standardRate = 'Valid standard rate is required'
    }
    if (!formData.overtimeRate || parseFloat(formData.overtimeRate) <= 0) {
      newErrors.overtimeRate = 'Valid overtime rate is required'
    }
    if (!formData.holidayRate || parseFloat(formData.holidayRate) <= 0) {
      newErrors.holidayRate = 'Valid holiday rate is required'
    }
    if (!formData.effectiveFrom) newErrors.effectiveFrom = 'Effective date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate() && rate) {
      onSave({
        ...rate,
        standardRate: parseFloat(formData.standardRate),
        overtimeRate: parseFloat(formData.overtimeRate),
        holidayRate: parseFloat(formData.holidayRate),
        effectiveFrom: formData.effectiveFrom,
        certificationsRequired: formData.certificationsRequired,
        status: formData.status as 'active' | 'inactive'
      })
      onClose()
    }
  }

  if (!isOpen || !rate) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Labor Rate</h2>
              <p className="text-sm text-purple-100">{rate.skillName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Labor Info */}
          <div className="bg-purple-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Skill Code</p>
                <p className="font-semibold text-gray-900">{rate.skillCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{rate.department}</p>
              </div>
              <div>
                <p className="text-gray-600">Skill Level</p>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {rate.skillLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Standard Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.standardRate}
                onChange={(e) => setFormData({ ...formData, standardRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.standardRate && (
                <p className="text-red-500 text-sm mt-1">{errors.standardRate}</p>
              )}
            </div>

            {/* Overtime Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overtime Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.overtimeRate && (
                <p className="text-red-500 text-sm mt-1">{errors.overtimeRate}</p>
              )}
            </div>

            {/* Holiday Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holiday Rate (₹/hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.holidayRate}
                onChange={(e) => setFormData({ ...formData, holidayRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.holidayRate && (
                <p className="text-red-500 text-sm mt-1">{errors.holidayRate}</p>
              )}
            </div>

            {/* Effective From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.effectiveFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Certifications Required */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications Required</label>
              <input
                type="text"
                value={formData.certificationsRequired}
                onChange={(e) => setFormData({ ...formData, certificationsRequired: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., AWS D1.1, ASME Section IX"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Update Rate
          </button>
        </div>
      </div>
    </div>
  )
}

// View Labor Details Modal
interface ViewLaborDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  labor: LaborRate | null
}

export function ViewLaborDetailsModal({ isOpen, onClose, labor }: ViewLaborDetailsModalProps) {
  if (!isOpen || !labor) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Labor Details</h2>
              <p className="text-sm text-indigo-100">{labor.skillName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Basic Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
              <div>
                <p className="text-sm text-gray-600">Skill Code</p>
                <p className="font-semibold text-gray-900">{labor.skillCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Skill Name</p>
                <p className="font-semibold text-gray-900">{labor.skillName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{labor.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Skill Level</p>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {labor.skillLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Rate Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Information</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Standard Rate</p>
                </div>
                <p className="text-2xl font-bold text-green-900">₹{labor.standardRate.toLocaleString()}</p>
                <p className="text-xs text-green-700 mt-1">per hour</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-medium text-orange-600">Overtime Rate</p>
                </div>
                <p className="text-2xl font-bold text-orange-900">₹{labor.overtimeRate.toLocaleString()}</p>
                <p className="text-xs text-orange-700 mt-1">per hour</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-purple-600">Holiday Rate</p>
                </div>
                <p className="text-2xl font-bold text-purple-900">₹{labor.holidayRate.toLocaleString()}</p>
                <p className="text-xs text-purple-700 mt-1">per hour</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Certifications Required</p>
                <p className="text-sm text-gray-900">{labor.certificationsRequired || 'None specified'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Effective From</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">{labor.effectiveFrom}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    labor.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {labor.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-900">{labor.lastUpdated}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Updated By</p>
                  <p className="font-semibold text-gray-900">{labor.updatedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Compare Labor Rates Modal
interface CompareLaborRatesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CompareLaborRatesModal({ isOpen, onClose }: CompareLaborRatesModalProps) {
  const [laborRates] = useState([
    {
      id: '1',
      skillName: 'TIG Welding',
      skillLevel: 'Skilled',
      department: 'Welding',
      standardRate: 385,
      overtimeRate: 578,
      holidayRate: 770,
      availability: 85
    },
    {
      id: '2',
      skillName: 'MIG Welding',
      skillLevel: 'Skilled',
      department: 'Welding',
      standardRate: 340,
      overtimeRate: 510,
      holidayRate: 680,
      availability: 92
    },
    {
      id: '3',
      skillName: 'Arc Welding',
      skillLevel: 'Skilled',
      department: 'Welding',
      standardRate: 320,
      overtimeRate: 480,
      holidayRate: 640,
      availability: 88
    }
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compare Labor Rates</h2>
              <p className="text-sm text-blue-100">Compare rates across similar skills</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skill Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Standard Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Overtime Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Holiday Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {laborRates.map((labor) => (
                  <tr key={labor.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900">{labor.skillName}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {labor.skillLevel}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{labor.department}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-bold text-gray-900">₹{labor.standardRate}/hr</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-bold text-orange-600">₹{labor.overtimeRate}/hr</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-bold text-purple-600">₹{labor.holidayRate}/hr</p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${labor.availability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{labor.availability}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
