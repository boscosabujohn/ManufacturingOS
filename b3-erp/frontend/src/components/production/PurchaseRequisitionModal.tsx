'use client'

import { useState } from 'react'
import { X, ShoppingCart, AlertTriangle, CheckCircle, Calendar, User, FileText, Send } from 'lucide-react'

interface Material {
  itemCode: string
  description: string
  requiredQty: string
  uom: string
  stockAvailable: number
  stockStatus: 'available' | 'shortage' | 'critical'
}

interface PurchaseRequisitionModalProps {
  isOpen: boolean
  onClose: () => void
  materials: Material[]
  woNumber: string
  onSubmit: (prData: any) => void
}

export function PurchaseRequisitionModal({ isOpen, onClose, materials, woNumber, onSubmit }: PurchaseRequisitionModalProps) {
  const shortageItems = materials.filter(m => m.stockStatus === 'shortage' || m.stockStatus === 'critical')

  const [prFormData, setPrFormData] = useState({
    prNumber: `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    requestedBy: '',
    department: 'Production',
    requiredDate: '',
    priority: 'high',
    justification: `Material shortage for Work Order ${woNumber}`,
    items: shortageItems.map(item => ({
      itemCode: item.itemCode,
      description: item.description,
      requiredQty: (parseFloat(item.requiredQty) - item.stockAvailable).toString(),
      uom: item.uom,
      estimatedCost: '0',
      preferredSupplier: '',
      notes: '',
    })),
  })

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...prFormData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setPrFormData({ ...prFormData, items: updatedItems })
  }

  const calculateTotalEstimatedCost = () => {
    return prFormData.items.reduce((sum, item) => sum + (parseFloat(item.estimatedCost) || 0), 0)
  }

  const handleSubmit = () => {
    onSubmit(prFormData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Create Purchase Requisition</h2>
              <p className="text-sm text-orange-100">For Work Order: {woNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-700 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Alert */}
          <div className="mb-3 bg-orange-50 border-l-4 border-orange-500 p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-800">Material Shortage Detected</p>
                <p className="text-xs text-orange-700 mt-1">
                  {shortageItems.length} items require procurement to fulfill this work order.
                </p>
              </div>
            </div>
          </div>

          {/* PR Details */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Purchase Requisition Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">PR Number</label>
                <input
                  type="text"
                  value={prFormData.prNumber}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Requested By <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={prFormData.requestedBy}
                    onChange={(e) => setPrFormData({ ...prFormData, requestedBy: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={prFormData.department}
                  onChange={(e) => setPrFormData({ ...prFormData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Required Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={prFormData.requiredDate}
                    onChange={(e) => setPrFormData({ ...prFormData, requiredDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={prFormData.priority}
                  onChange={(e) => setPrFormData({ ...prFormData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Justification</label>
                <input
                  type="text"
                  value={prFormData.justification}
                  onChange={(e) => setPrFormData({ ...prFormData, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-orange-600" />
              Items to Procure ({prFormData.items.length})
            </h3>

            <div className="space-y-3">
              {prFormData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Item Code</label>
                      <input
                        type="text"
                        value={item.itemCode}
                        disabled
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        disabled
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.requiredQty}
                        onChange={(e) => updateItem(index, 'requiredQty', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">UOM</label>
                      <input
                        type="text"
                        value={item.uom}
                        disabled
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Cost (₹)</label>
                      <input
                        type="number"
                        value={item.estimatedCost}
                        onChange={(e) => updateItem(index, 'estimatedCost', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Supplier</label>
                      <input
                        type="text"
                        value={item.preferredSupplier}
                        onChange={(e) => updateItem(index, 'preferredSupplier', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Supplier name or code"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Any special requirements"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Estimated Procurement Cost:</span>
              <span className="text-xl font-bold text-blue-900">
                ₹{calculateTotalEstimatedCost().toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="ml-3">
                <p className="text-xs font-medium text-green-800">Automatic Material Reservation</p>
                <p className="text-xs text-green-700 mt-1">
                  Upon PR approval and PO fulfillment, materials will be automatically reserved for Work Order {woNumber}.
                </p>
              </div>
            </div>
          </div>

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
              disabled={!prFormData.requestedBy || !prFormData.requiredDate}
              className="px-6 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Submit PR for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
