'use client'

import React, { useState } from 'react'
import {
  X,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  Package,
  Building2,
  User,
  Tag,
  AlertCircle,
  Send,
  ShoppingCart,
  Clock,
  Activity,
  TrendingUp,
  FileCheck,
  Upload,
  Paperclip,
  Eye,
  Download
} from 'lucide-react'

// ============================================================================
// SUBMIT REQUISITION MODAL
// ============================================================================

interface SubmitRequisitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

export function SubmitRequisitionModal({ isOpen, onClose, onSubmit, editData }: SubmitRequisitionModalProps) {
  const [requisitionTitle, setRequisitionTitle] = useState(editData?.title || '')
  const [department, setDepartment] = useState(editData?.department || '')
  const [category, setCategory] = useState(editData?.category || '')
  const [priority, setPriority] = useState(editData?.priority || 'medium')
  const [dueDate, setDueDate] = useState(editData?.dueDate || '')
  const [justification, setJustification] = useState(editData?.justification || '')
  const [budgetCode, setBudgetCode] = useState(editData?.budgetCode || '')
  const [deliveryLocation, setDeliveryLocation] = useState(editData?.deliveryLocation || '')
  const [attachments, setAttachments] = useState<string[]>(editData?.attachments || [])
  const [items, setItems] = useState(editData?.items || [
    { description: '', category: '', quantity: '', unit: 'units', unitPrice: '', supplier: '', notes: '' }
  ])

  const addItem = () => {
    setItems([...items, { description: '', category: '', quantity: '', unit: 'units', unitPrice: '', supplier: '', notes: '' }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum: number, item: any) => {
      const quantity = parseFloat(item.quantity) || 0
      const unitPrice = parseFloat(item.unitPrice) || 0
      return sum + (quantity * unitPrice)
    }, 0)
  }

  const handleSubmit = () => {
    const data = {
      title: requisitionTitle,
      department,
      category,
      priority,
      dueDate,
      justification,
      budgetCode,
      deliveryLocation,
      items,
      attachments,
      totalAmount: calculateTotal(),
      status: 'pending'
    }
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              {editData ? 'Edit Requisition' : 'Submit New Requisition'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisition Title *
                </label>
                <input
                  type="text"
                  value={requisitionTitle}
                  onChange={(e) => setRequisitionTitle(e.target.value)}
                  placeholder="e.g., IT Equipment for New Office"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="Production">Production</option>
                  <option value="Admin">Admin</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Marketing Materials">Marketing Materials</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required by Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Code
                </label>
                <input
                  type="text"
                  value={budgetCode}
                  onChange={(e) => setBudgetCode(e.target.value)}
                  placeholder="e.g., BUDGET-2024-IT-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Location *
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g., Main Office - Building A, Floor 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Justification *
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain why this purchase is necessary and how it supports business objectives..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Requisition Items */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Requisition Items
              </h3>
              <button
                onClick={addItem}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="e.g., Laptop - Dell Latitude 5520, 16GB RAM, 512GB SSD"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        placeholder="e.g., Computers & Laptops"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Supplier</label>
                      <input
                        type="text"
                        value={item.supplier}
                        onChange={(e) => updateItem(index, 'supplier', e.target.value)}
                        placeholder="e.g., Dell Direct"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="units">Units</option>
                        <option value="boxes">Boxes</option>
                        <option value="cases">Cases</option>
                        <option value="kg">Kilograms</option>
                        <option value="lbs">Pounds</option>
                        <option value="meters">Meters</option>
                        <option value="liters">Liters</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                      <input
                        type="text"
                        value={`$${((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                        placeholder="Any special requirements or notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Requisition Amount</span>
              <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-blue-600" />
              Attachments
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">Quotes, specifications, or supporting documents</p>
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const data = { ...handleSubmit, status: 'draft' }
                onSubmit(data)
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// APPROVE/REJECT REQUISITION MODAL
// ============================================================================

interface ApproveRejectModalProps {
  isOpen: boolean
  onClose: () => void
  requisition: any
  action: 'approve' | 'reject' | 'request_info'
  onSubmit: (data: any) => void
}

export function ApproveRejectModal({ isOpen, onClose, requisition, action, onSubmit }: ApproveRejectModalProps) {
  const [comments, setComments] = useState('')
  const [conditions, setConditions] = useState('')
  const [budgetImpact, setBudgetImpact] = useState('')
  const [alternativeSuggestion, setAlternativeSuggestion] = useState('')
  const [requestedInfo, setRequestedInfo] = useState<string[]>([])
  const [additionalApprovers, setAdditionalApprovers] = useState<string[]>([])
  const [approvalExpiry, setApprovalExpiry] = useState('')
  const [notifyRequestor, setNotifyRequestor] = useState(true)

  const handleSubmit = () => {
    const data = {
      requisitionId: requisition?.id,
      action,
      comments,
      conditions: action === 'approve' ? conditions : undefined,
      budgetImpact: action === 'approve' ? budgetImpact : undefined,
      alternativeSuggestion: action === 'reject' ? alternativeSuggestion : undefined,
      requestedInfo: action === 'request_info' ? requestedInfo : undefined,
      additionalApprovers: action === 'approve' ? additionalApprovers : undefined,
      approvalExpiry: action === 'approve' ? approvalExpiry : undefined,
      notifyRequestor,
      timestamp: new Date().toISOString()
    }
    onSubmit(data)
  }

  if (!isOpen) return null

  const getHeaderConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Approve Requisition',
          icon: CheckCircle,
          gradient: 'from-green-600 to-green-700',
          color: 'text-green-600'
        }
      case 'reject':
        return {
          title: 'Reject Requisition',
          icon: XCircle,
          gradient: 'from-red-600 to-red-700',
          color: 'text-red-600'
        }
      case 'request_info':
        return {
          title: 'Request Additional Information',
          icon: MessageSquare,
          gradient: 'from-yellow-600 to-yellow-700',
          color: 'text-yellow-600'
        }
    }
  }

  const config = getHeaderConfig()
  const HeaderIcon = config.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center gap-3">
            <HeaderIcon className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Requisition Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Requisition Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-medium">{requisition?.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Title:</span>
                <span className="ml-2 font-medium">{requisition?.title}</span>
              </div>
              <div>
                <span className="text-gray-600">Requestor:</span>
                <span className="ml-2 font-medium">{requisition?.requestor}</span>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{requisition?.department}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="ml-2 font-medium text-blue-600">${requisition?.totalAmount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Priority:</span>
                <span className="ml-2 font-medium capitalize">{requisition?.priority}</span>
              </div>
            </div>
          </div>

          {/* Action-Specific Fields */}
          {action === 'approve' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments or notes about this approval..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Conditions (Optional)
                </label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Any conditions or requirements for this approval..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., "Must use approved supplier list", "Requires quarterly budget review"</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Impact Notes
                </label>
                <input
                  type="text"
                  value={budgetImpact}
                  onChange={(e) => setBudgetImpact(e.target.value)}
                  placeholder="e.g., Within Q2 budget allocation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Valid Until
                </label>
                <input
                  type="date"
                  value={approvalExpiry}
                  onChange={(e) => setApprovalExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Set an expiry date for this approval if applicable</p>
              </div>
            </>
          )}

          {action === 'reject' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Clearly explain why this requisition is being rejected..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternative Suggestions
                </label>
                <textarea
                  value={alternativeSuggestion}
                  onChange={(e) => setAlternativeSuggestion(e.target.value)}
                  placeholder="Suggest alternatives or modifications that would make this requisition approvable..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Important</p>
                    <p className="text-sm text-red-700 mt-1">
                      The requestor will be notified of this rejection and your feedback. Please ensure your comments are constructive and actionable.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {action === 'request_info' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Information Required *
                </label>
                <div className="space-y-2">
                  {[
                    'Detailed specifications',
                    'Budget justification',
                    'Alternative quotes',
                    'Business case documentation',
                    'Manager approval',
                    'Supplier information'
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requestedInfo.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRequestedInfo([...requestedInfo, item])
                          } else {
                            setRequestedInfo(requestedInfo.filter(i => i !== item))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments *
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Explain what information is needed and why..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </>
          )}

          {/* Notification Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifyRequestor}
                onChange={(e) => setNotifyRequestor(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Send email notification to requestor
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
            onClick={handleSubmit}
            className={`px-6 py-2 text-white rounded-lg transition flex items-center gap-2 ${
              action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
              action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
              'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            <HeaderIcon className="w-4 h-4" />
            {action === 'approve' ? 'Approve Requisition' :
             action === 'reject' ? 'Reject Requisition' :
             'Request Information'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CONVERT TO PO MODAL
// ============================================================================

interface ConvertToPOModalProps {
  isOpen: boolean
  onClose: () => void
  requisition: any
  onSubmit: (data: any) => void
}

export function ConvertToPOModal({ isOpen, onClose, requisition, onSubmit }: ConvertToPOModalProps) {
  const [poNumber, setPoNumber] = useState('')
  const [supplier, setSupplier] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Net 30')
  const [shippingMethod, setShippingMethod] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [incoterms, setIncoterms] = useState('FOB')
  const [currency, setCurrency] = useState('USD')
  const [taxRate, setTaxRate] = useState('10')
  const [discountPercent, setDiscountPercent] = useState('0')
  const [includeTax, setIncludeTax] = useState(true)
  const [autoGeneratePO, setAutoGeneratePO] = useState(true)

  const calculateTotals = () => {
    const subtotal = requisition?.totalAmount || 0
    const discount = subtotal * (parseFloat(discountPercent) / 100)
    const afterDiscount = subtotal - discount
    const tax = includeTax ? afterDiscount * (parseFloat(taxRate) / 100) : 0
    const total = afterDiscount + tax

    return { subtotal, discount, afterDiscount, tax, total }
  }

  const handleSubmit = () => {
    const totals = calculateTotals()
    const data = {
      requisitionId: requisition?.id,
      poNumber: autoGeneratePO ? `PO-${Date.now()}` : poNumber,
      supplier,
      deliveryDate,
      paymentTerms,
      shippingMethod,
      shippingAddress,
      billingAddress,
      specialInstructions,
      incoterms,
      currency,
      taxRate: parseFloat(taxRate),
      discountPercent: parseFloat(discountPercent),
      includeTax,
      ...totals,
      items: requisition?.items,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    onSubmit(data)
  }

  if (!isOpen) return null

  const totals = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Convert to Purchase Order</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Requisition Reference */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Converting Requisition</p>
                <p className="text-lg font-bold text-gray-900">{requisition?.id} - {requisition?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Requisition Total</p>
                <p className="text-2xl font-bold text-purple-600">${requisition?.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* PO Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              Purchase Order Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={autoGeneratePO}
                    onChange={(e) => setAutoGeneratePO(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-generate PO Number</span>
                </label>
                {!autoGeneratePO && (
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="e.g., PO-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier *
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  <option value="Dell Direct">Dell Direct</option>
                  <option value="Global Suppliers Inc">Global Suppliers Inc</option>
                  <option value="Office Depot">Office Depot</option>
                  <option value="Tech Supplies Co">Tech Supplies Co</option>
                  <option value="Industrial Parts Ltd">Industrial Parts Ltd</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms *
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Net 90">Net 90</option>
                  <option value="Immediate">Immediate</option>
                  <option value="50% Advance">50% Advance, 50% on Delivery</option>
                  <option value="Letter of Credit">Letter of Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Method
                </label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Method</option>
                  <option value="Standard Ground">Standard Ground</option>
                  <option value="Express">Express</option>
                  <option value="Overnight">Overnight</option>
                  <option value="Freight">Freight</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incoterms
                </label>
                <select
                  value={incoterms}
                  onChange={(e) => setIncoterms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="FOB">FOB (Free On Board)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                  <option value="FCA">FCA (Free Carrier)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Complete delivery address..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address *
                </label>
                <textarea
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Complete billing address..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special handling or delivery instructions..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Tax Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900">Tax & Totals</h3>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Include Tax</span>
              </label>

              {includeTax && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              {parseFloat(discountPercent) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount ({discountPercent}%)</span>
                  <span className="font-medium text-green-600">-${totals.discount.toFixed(2)}</span>
                </div>
              )}
              {includeTax && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax ({taxRate}%)</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-purple-600">${totals.total.toFixed(2)}</span>
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
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TRACK STATUS MODAL
// ============================================================================

interface TrackStatusModalProps {
  isOpen: boolean
  onClose: () => void
  requisition: any
}

export function TrackStatusModal({ isOpen, onClose, requisition }: TrackStatusModalProps) {
  const [showExport, setShowExport] = useState(false)

  // Mock timeline data
  const timeline = [
    {
      date: '2024-02-15 09:30',
      status: 'submitted',
      user: 'John Smith',
      action: 'Submitted requisition',
      description: 'Initial submission for IT Equipment',
      icon: Send,
      color: 'blue'
    },
    {
      date: '2024-02-15 14:20',
      status: 'level1_approved',
      user: 'Tom Wilson',
      action: 'Level 1 Approval',
      description: 'Approved by Department Manager',
      comments: 'Budget allocation confirmed',
      icon: CheckCircle,
      color: 'green'
    },
    {
      date: '2024-02-16 10:15',
      status: 'pending',
      user: 'Sarah Johnson',
      action: 'Pending Review',
      description: 'Currently with Finance Manager',
      icon: Clock,
      color: 'yellow'
    },
    {
      date: '2024-02-17 11:00',
      status: 'info_requested',
      user: 'Sarah Johnson',
      action: 'Information Requested',
      description: 'Additional quotes required',
      comments: 'Please provide 2 alternative supplier quotes',
      icon: MessageSquare,
      color: 'orange'
    }
  ]

  const metrics = [
    { label: 'Current Stage', value: 'Finance Review', icon: Activity, color: 'blue' },
    { label: 'Days in Process', value: '3', icon: Clock, color: 'purple' },
    { label: 'Approval Level', value: '2 of 3', icon: TrendingUp, color: 'green' },
    { label: 'Next Approver', value: 'Sarah Johnson', icon: User, color: 'orange' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Track Requisition Status</h2>
              <p className="text-indigo-100 text-sm mt-1">{requisition?.id} - {requisition?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-5 h-5 text-${metric.color}-600`} />
                    <span className="text-sm text-gray-600">{metric.label}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                </div>
              )
            })}
          </div>

          {/* Requisition Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Requisition Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Requestor:</span>
                <span className="ml-2 font-medium">{requisition?.requestor}</span>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{requisition?.department}</span>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 font-medium">{requisition?.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="ml-2 font-medium text-blue-600">${requisition?.totalAmount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Priority:</span>
                <span className="ml-2 font-medium capitalize">{requisition?.priority}</span>
              </div>
              <div>
                <span className="text-gray-600">Due Date:</span>
                <span className="ml-2 font-medium">{requisition?.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Status Timeline</h3>
              <button
                onClick={() => setShowExport(true)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export Timeline
              </button>
            </div>

            <div className="space-y-4">
              {timeline.map((event, index) => {
                const IconComponent = event.icon
                const isLast = index === timeline.length - 1

                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.color === 'blue' ? 'bg-blue-100' :
                        event.color === 'green' ? 'bg-green-100' :
                        event.color === 'yellow' ? 'bg-yellow-100' :
                        event.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          event.color === 'blue' ? 'text-blue-600' :
                          event.color === 'green' ? 'text-green-600' :
                          event.color === 'yellow' ? 'text-yellow-600' :
                          event.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" style={{ minHeight: '40px' }}></div>
                      )}
                    </div>

                    {/* Event details */}
                    <div className="flex-1 pb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{event.action}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <User className="w-4 h-4" />
                          <span>{event.user}</span>
                        </div>
                        {event.comments && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-700 flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
                              {event.comments}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Status Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Action Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This requisition is awaiting additional information. Please provide the requested quotes to proceed with approval.
                </p>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Related Documents</h3>
            <div className="space-y-2">
              {[
                { name: 'Original Requisition Form', type: 'PDF', size: '245 KB' },
                { name: 'Budget Approval Document', type: 'PDF', size: '189 KB' },
                { name: 'Supplier Quote - Option 1', type: 'PDF', size: '312 KB' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
