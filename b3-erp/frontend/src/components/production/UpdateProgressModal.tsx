'use client'

import { useState } from 'react'
import { X, TrendingUp, Package, AlertTriangle, CheckCircle, Clock, User, FileText } from 'lucide-react'

interface InProgressWorkOrder {
  id: string
  workOrderNumber: string
  productName: string
  quantity: number
  unit: string
  produced: number
  rejected: number
  completionPercentage: number
  currentStation: string
}

interface UpdateProgressModalProps {
  isOpen: boolean
  onClose: () => void
  workOrder: InProgressWorkOrder | null
  onUpdate: (updateData: any) => void
}

export function UpdateProgressModal({ isOpen, onClose, workOrder, onUpdate }: UpdateProgressModalProps) {
  const [formData, setFormData] = useState({
    produced: workOrder?.produced.toString() || '0',
    rejected: workOrder?.rejected.toString() || '0',
    currentStation: workOrder?.currentStation || '',
    notes: '',
    issues: '',
    qualityCheckPassed: true,
    nextStation: '',
  })

  const handleSubmit = () => {
    const totalProduced = parseInt(formData.produced) || 0
    const totalRejected = parseInt(formData.rejected) || 0
    const completedQty = totalProduced + totalRejected
    const newCompletionPercentage = workOrder ? Math.round((completedQty / workOrder.quantity) * 100) : 0

    const updateData = {
      ...formData,
      produced: totalProduced,
      rejected: totalRejected,
      completionPercentage: newCompletionPercentage,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updateData)
    onClose()
  }

  if (!isOpen || !workOrder) return null

  const remaining = workOrder.quantity - (parseInt(formData.produced) + parseInt(formData.rejected))
  const successRate = parseInt(formData.produced) > 0
    ? ((parseInt(formData.produced) / (parseInt(formData.produced) + parseInt(formData.rejected))) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Update Production Progress</h2>
              <p className="text-sm text-green-100">{workOrder.workOrderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Work Order Info */}
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{workOrder.productName}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Target Quantity: <span className="font-medium">{workOrder.quantity} {workOrder.unit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Progress Summary */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-xs text-green-700 mb-1">Current Produced</div>
              <div className="text-xl font-bold text-green-900">{workOrder.produced}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="text-xs text-red-700 mb-1">Current Rejected</div>
              <div className="text-xl font-bold text-red-900">{workOrder.rejected}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-700 mb-1">Remaining</div>
              <div className="text-xl font-bold text-blue-900">{workOrder.quantity - (workOrder.produced + workOrder.rejected)}</div>
            </div>
          </div>

          {/* Update Form */}
          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Produced <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.produced}
                  onChange={(e) => setFormData({ ...formData, produced: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max={workOrder.quantity}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Previously: {workOrder.produced}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Rejected <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.rejected}
                  onChange={(e) => setFormData({ ...formData, rejected: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Previously: {workOrder.rejected}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Station</label>
              <select
                value={formData.currentStation}
                onChange={(e) => setFormData({ ...formData, currentStation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Cutting & Sizing">Cutting & Sizing</option>
                <option value="Welding">Welding</option>
                <option value="Assembly">Assembly</option>
                <option value="Polishing & Finishing">Polishing & Finishing</option>
                <option value="Painting">Painting</option>
                <option value="Quality Inspection">Quality Inspection</option>
                <option value="Packaging">Packaging</option>
                <option value="Final QC">Final QC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Station</label>
              <input
                type="text"
                value={formData.nextStation}
                onChange={(e) => setFormData({ ...formData, nextStation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Quality Inspection"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter progress notes, achievements, or observations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issues or Blockers (if any)</label>
              <textarea
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Report any issues, quality problems, or blockers..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="qualityCheck"
                checked={formData.qualityCheckPassed}
                onChange={(e) => setFormData({ ...formData, qualityCheckPassed: e.target.checked })}
                className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
              />
              <label htmlFor="qualityCheck" className="text-sm text-gray-700">
                Quality check passed for current batch
              </label>
            </div>
          </div>

          {/* Updated Metrics */}
          <div className="mb-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Updated Metrics</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-gray-600">Remaining</div>
                <div className="font-semibold text-gray-900">{remaining} {workOrder.unit}</div>
              </div>
              <div>
                <div className="text-gray-600">Success Rate</div>
                <div className="font-semibold text-green-900">{successRate}%</div>
              </div>
              <div>
                <div className="text-gray-600">Completion</div>
                <div className="font-semibold text-blue-900">
                  {Math.round(((parseInt(formData.produced) + parseInt(formData.rejected)) / workOrder.quantity) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {parseInt(formData.rejected) > workOrder.rejected && (
            <div className="mb-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Increased Rejection Rate</p>
                  <p className="text-xs text-orange-700 mt-1">
                    Rejection count has increased. Please document the quality issues above.
                  </p>
                </div>
              </div>
            </div>
          )}

          {remaining <= 0 && (
            <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Work Order Complete!</p>
                  <p className="text-xs text-green-700 mt-1">
                    Target quantity reached. Work order will be moved to completed status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
