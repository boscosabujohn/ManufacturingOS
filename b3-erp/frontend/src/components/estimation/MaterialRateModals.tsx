'use client'

import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Calendar, Package, User, Clock, AlertCircle, Check } from 'lucide-react'

export interface MaterialRate {
  id: string
  materialCode: string
  materialName: string
  category: string
  unit: string
  currentRate: number
  previousRate: number
  rateChange: number
  rateChangePercent: number
  effectiveFrom: string
  effectiveTo?: string
  supplier: string
  leadTime: number
  minimumOrderQty: number
  lastUpdated: string
  updatedBy: string
  status: 'active' | 'inactive' | 'discontinued'
}

export interface RateHistory {
  id: string
  date: string
  rate: number
  change: number
  changePercent: number
  supplier: string
  updatedBy: string
  reason: string
}

// Add Material Rate Modal
interface AddRateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rate: Partial<MaterialRate>) => void
}

export function AddMaterialRateModal({ isOpen, onClose, onSave }: AddRateModalProps) {
  const [formData, setFormData] = useState({
    materialCode: '',
    materialName: '',
    category: '',
    unit: 'KG',
    currentRate: '',
    effectiveFrom: '',
    supplier: '',
    leadTime: '',
    minimumOrderQty: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.materialCode) newErrors.materialCode = 'Material code is required'
    if (!formData.materialName) newErrors.materialName = 'Material name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.currentRate || parseFloat(formData.currentRate) <= 0) {
      newErrors.currentRate = 'Valid rate is required'
    }
    if (!formData.effectiveFrom) newErrors.effectiveFrom = 'Effective date is required'
    if (!formData.supplier) newErrors.supplier = 'Supplier is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        materialCode: formData.materialCode,
        materialName: formData.materialName,
        category: formData.category,
        unit: formData.unit,
        currentRate: parseFloat(formData.currentRate),
        effectiveFrom: formData.effectiveFrom,
        supplier: formData.supplier,
        leadTime: parseInt(formData.leadTime) || 0,
        minimumOrderQty: parseInt(formData.minimumOrderQty) || 0,
        status: 'active'
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Material Rate</h2>
              <p className="text-sm text-blue-100">Add new material with rate information</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-3">
            {/* Material Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.materialCode}
                onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SS304-18G"
              />
              {errors.materialCode && (
                <p className="text-red-500 text-sm mt-1">{errors.materialCode}</p>
              )}
            </div>

            {/* Material Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Stainless Steel 304"
              />
              {errors.materialName && (
                <p className="text-red-500 text-sm mt-1">{errors.materialName}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Raw Material - Sinks">Raw Material - Sinks</option>
                <option value="Raw Material - Faucets">Raw Material - Faucets</option>
                <option value="Raw Material - Countertops">Raw Material - Countertops</option>
                <option value="Raw Material - Cookware">Raw Material - Cookware</option>
                <option value="Raw Material - Cabinets">Raw Material - Cabinets</option>
                <option value="Components - Appliances">Components - Appliances</option>
                <option value="Components - Sinks">Components - Sinks</option>
                <option value="Components - Faucets">Components - Faucets</option>
                <option value="Finishing - Faucets">Finishing - Faucets</option>
                <option value="Finishing - Cookware">Finishing - Cookware</option>
                <option value="Finishing - Appliances">Finishing - Appliances</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="KG">KG (Kilogram)</option>
                <option value="SQ.FT">SQ.FT (Square Feet)</option>
                <option value="PCS">PCS (Pieces)</option>
                <option value="LITER">LITER (Liter)</option>
                <option value="SHEET">SHEET (Sheet)</option>
                <option value="TUBE">TUBE (Tube)</option>
                <option value="METER">METER (Meter)</option>
                <option value="BOX">BOX (Box)</option>
              </select>
            </div>

            {/* Current Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentRate}
                onChange={(e) => setFormData({ ...formData, currentRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.currentRate && (
                <p className="text-red-500 text-sm mt-1">{errors.currentRate}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.effectiveFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                <option value="Steel India Ltd">Steel India Ltd</option>
                <option value="Metals Trading Co">Metals Trading Co</option>
                <option value="Stone Masters Pvt Ltd">Stone Masters Pvt Ltd</option>
                <option value="Chemical Solutions Ltd">Chemical Solutions Ltd</option>
                <option value="Aluminum Corp India">Aluminum Corp India</option>
                <option value="Coating Tech Pvt Ltd">Coating Tech Pvt Ltd</option>
                <option value="Motors & Drives Ltd">Motors & Drives Ltd</option>
                <option value="Wood Industries Ltd">Wood Industries Ltd</option>
                <option value="Sealants & Adhesives Co">Sealants & Adhesives Co</option>
                <option value="Rubber Products Ltd">Rubber Products Ltd</option>
                <option value="Industrial Paints Ltd">Industrial Paints Ltd</option>
              </select>
              {errors.supplier && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>
              )}
            </div>

            {/* Lead Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Time (Days)</label>
              <input
                type="number"
                value={formData.leadTime}
                onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Minimum Order Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
              <input
                type="number"
                value={formData.minimumOrderQty}
                onChange={(e) => setFormData({ ...formData, minimumOrderQty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about this material rate..."
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Save Material Rate
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Material Rate Modal
interface EditRateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rate: MaterialRate) => void
  rate: MaterialRate | null
}

export function EditMaterialRateModal({ isOpen, onClose, onSave, rate }: EditRateModalProps) {
  const [formData, setFormData] = useState({
    currentRate: rate?.currentRate.toString() || '',
    effectiveFrom: rate?.effectiveFrom || '',
    supplier: rate?.supplier || '',
    leadTime: rate?.leadTime.toString() || '',
    minimumOrderQty: rate?.minimumOrderQty.toString() || '',
    status: rate?.status || 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentRate || parseFloat(formData.currentRate) <= 0) {
      newErrors.currentRate = 'Valid rate is required'
    }
    if (!formData.effectiveFrom) newErrors.effectiveFrom = 'Effective date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate() && rate) {
      onSave({
        ...rate,
        currentRate: parseFloat(formData.currentRate),
        effectiveFrom: formData.effectiveFrom,
        supplier: formData.supplier,
        leadTime: parseInt(formData.leadTime) || 0,
        minimumOrderQty: parseInt(formData.minimumOrderQty) || 0,
        status: formData.status as 'active' | 'inactive' | 'discontinued'
      })
      onClose()
    }
  }

  if (!isOpen || !rate) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Material Rate</h2>
              <p className="text-sm text-blue-100">{rate.materialName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Material Info */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Material Code</p>
                <p className="font-semibold text-gray-900">{rate.materialCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{rate.category}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Current Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Rate (₹) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentRate}
                  onChange={(e) => setFormData({ ...formData, currentRate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">per {rate.unit}</span>
              </div>
              {errors.currentRate && (
                <p className="text-red-500 text-sm mt-1">{errors.currentRate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Previous: ₹{rate.previousRate.toLocaleString()}
              </p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.effectiveFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Steel India Ltd">Steel India Ltd</option>
                <option value="Metals Trading Co">Metals Trading Co</option>
                <option value="Stone Masters Pvt Ltd">Stone Masters Pvt Ltd</option>
                <option value="Chemical Solutions Ltd">Chemical Solutions Ltd</option>
                <option value="Aluminum Corp India">Aluminum Corp India</option>
                <option value="Coating Tech Pvt Ltd">Coating Tech Pvt Ltd</option>
                <option value="Motors & Drives Ltd">Motors & Drives Ltd</option>
                <option value="Wood Industries Ltd">Wood Industries Ltd</option>
                <option value="Sealants & Adhesives Co">Sealants & Adhesives Co</option>
                <option value="Rubber Products Ltd">Rubber Products Ltd</option>
                <option value="Industrial Paints Ltd">Industrial Paints Ltd</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'discontinued' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            {/* Lead Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Time (Days)</label>
              <input
                type="number"
                value={formData.leadTime}
                onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Minimum Order Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
              <input
                type="number"
                value={formData.minimumOrderQty}
                onChange={(e) => setFormData({ ...formData, minimumOrderQty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Update Rate
          </button>
        </div>
      </div>
    </div>
  )
}

// View Rate History Modal
interface ViewHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  material: MaterialRate | null
}

export function ViewRateHistoryModal({ isOpen, onClose, material }: ViewHistoryModalProps) {
  const [rateHistory] = useState<RateHistory[]>([
    {
      id: '1',
      date: '2025-10-15',
      rate: 195,
      change: 10,
      changePercent: 5.4,
      supplier: 'Steel India Ltd',
      updatedBy: 'Procurement Manager',
      reason: 'Market price increase'
    },
    {
      id: '2',
      date: '2025-09-01',
      rate: 185,
      change: -5,
      changePercent: -2.6,
      supplier: 'Steel India Ltd',
      updatedBy: 'Procurement Manager',
      reason: 'Supplier discount'
    },
    {
      id: '3',
      date: '2025-08-01',
      rate: 190,
      change: 8,
      changePercent: 4.4,
      supplier: 'Steel India Ltd',
      updatedBy: 'Procurement Manager',
      reason: 'Raw material cost increase'
    },
    {
      id: '4',
      date: '2025-07-01',
      rate: 182,
      change: 0,
      changePercent: 0,
      supplier: 'Steel India Ltd',
      updatedBy: 'Procurement Manager',
      reason: 'Initial rate'
    }
  ])

  if (!isOpen || !material) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Rate History</h2>
              <p className="text-sm text-purple-100">{material.materialName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Material Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <p className="text-xs text-purple-600 mb-1">Material Code</p>
                <p className="font-semibold text-gray-900">{material.materialCode}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 mb-1">Current Rate</p>
                <p className="font-semibold text-gray-900">₹{material.currentRate.toLocaleString()} / {material.unit}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 mb-1">Category</p>
                <p className="font-semibold text-gray-900">{material.category}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 mb-1">Supplier</p>
                <p className="font-semibold text-gray-900">{material.supplier}</p>
              </div>
            </div>
          </div>

          {/* Rate History Timeline */}
          <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
            <div className="space-y-2">
              {rateHistory.map((history, index) => (
                <div key={history.id} className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-600 border-4 border-white"></div>

                  <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{history.date}</span>
                        </div>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{history.rate.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">per {material.unit}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Updated By</p>
                          <p className="text-sm font-medium text-gray-900">{history.updatedBy}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Supplier</p>
                        <p className="text-sm font-medium text-gray-900">{history.supplier}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Rate Change</p>
                        <div className="flex items-center gap-1">
                          {history.change > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-semibold text-red-600">
                                +₹{history.change} ({history.changePercent.toFixed(1)}%)
                              </span>
                            </>
                          ) : history.change < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">
                                ₹{history.change} ({history.changePercent.toFixed(1)}%)
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-600">No change</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {history.reason && (
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Reason for Change</p>
                            <p className="text-sm text-gray-600">{history.reason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

// Compare Suppliers Modal
interface CompareSuppliersModalProps {
  isOpen: boolean
  onClose: () => void
  material: MaterialRate | null
}

export function CompareSuppliersModal({ isOpen, onClose, material }: CompareSuppliersModalProps) {
  const [supplierRates] = useState([
    {
      id: '1',
      supplier: 'Steel India Ltd',
      rate: 195,
      leadTime: 7,
      minimumOrder: 100,
      paymentTerms: 'Net 30',
      rating: 4.5,
      lastOrder: '2025-10-01'
    },
    {
      id: '2',
      supplier: 'Premium Steel Corp',
      rate: 198,
      leadTime: 5,
      minimumOrder: 50,
      paymentTerms: 'Net 45',
      rating: 4.8,
      lastOrder: '2025-09-15'
    },
    {
      id: '3',
      supplier: 'Metal Works Ltd',
      rate: 192,
      leadTime: 10,
      minimumOrder: 150,
      paymentTerms: 'Net 30',
      rating: 4.2,
      lastOrder: '2025-08-20'
    }
  ])

  if (!isOpen || !material) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compare Suppliers</h2>
              <p className="text-sm text-green-100">{material.materialName}</p>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Terms</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supplierRates.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900">{supplier.supplier}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-bold text-gray-900">₹{supplier.rate.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">per {material.unit}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{supplier.leadTime} days</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{supplier.minimumOrder} {material.unit}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{supplier.paymentTerms}</p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{supplier.lastOrder}</p>
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
