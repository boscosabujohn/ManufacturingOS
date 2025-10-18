'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Send,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Upload,
  FileText,
  Calendar,
  User,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  Plus,
  Minus,
  Edit2,
  MessageSquare,
  Shield,
  Truck,
  Hash,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface InspectionItem {
  id: string
  itemCode: string
  itemName: string
  description: string
  orderedQty: number
  receivedQty: number
  acceptedQty: number
  rejectedQty: number
  unit: string
  batchNumber?: string
  serialNumbers?: string[]
  inspectionStatus: 'pending' | 'passed' | 'failed' | 'partial'
  qualityChecks: {
    visual: 'pass' | 'fail' | 'na' | null
    dimensional: 'pass' | 'fail' | 'na' | null
    functional: 'pass' | 'fail' | 'na' | null
    packaging: 'pass' | 'fail' | 'na' | null
    documentation: 'pass' | 'fail' | 'na' | null
  }
  defects?: string[]
  remarks?: string
  images?: string[]
}

interface GRNDetails {
  grnNumber: string
  poNumber: string
  vendorName: string
  vendorCode: string
  deliveryDate: string
  invoiceNumber?: string
  invoiceDate?: string
  deliveryNote?: string
  vehicleNumber?: string
  driverName?: string
  warehouseLocation: string
  receivedBy: string
}

export default function GRNInspectionPage() {
  const params = useParams()
  const router = useRouter()
  const grnId = params.id as string

  // Mock GRN details
  const [grnDetails] = useState<GRNDetails>({
    grnNumber: 'GRN-2024-001',
    poNumber: 'PO-2024-001',
    vendorName: 'Tech Supplies Co.',
    vendorCode: 'VEND-001',
    deliveryDate: '2024-01-23',
    invoiceNumber: 'INV-2024-0156',
    invoiceDate: '2024-01-22',
    deliveryNote: 'DN-2024-089',
    vehicleNumber: 'KA-01-AB-1234',
    driverName: 'Ramesh Kumar',
    warehouseLocation: 'Main Warehouse - A',
    receivedBy: 'John Smith'
  })

  // Mock inspection items
  const [items, setItems] = useState<InspectionItem[]>([
    {
      id: '1',
      itemCode: 'ITEM-001',
      itemName: 'Laptop Dell XPS 15',
      description: 'Intel i7, 16GB RAM, 512GB SSD',
      orderedQty: 10,
      receivedQty: 10,
      acceptedQty: 0,
      rejectedQty: 0,
      unit: 'Unit',
      batchNumber: 'BATCH-2024-001',
      inspectionStatus: 'pending',
      qualityChecks: {
        visual: null,
        dimensional: null,
        functional: null,
        packaging: null,
        documentation: null
      }
    },
    {
      id: '2',
      itemCode: 'ITEM-002',
      itemName: 'Wireless Mouse',
      description: 'Bluetooth 5.0, Rechargeable',
      orderedQty: 25,
      receivedQty: 25,
      acceptedQty: 0,
      rejectedQty: 0,
      unit: 'Unit',
      batchNumber: 'BATCH-2024-002',
      inspectionStatus: 'pending',
      qualityChecks: {
        visual: null,
        dimensional: null,
        functional: null,
        packaging: null,
        documentation: null
      }
    },
    {
      id: '3',
      itemCode: 'ITEM-003',
      itemName: 'USB-C Hub',
      description: '7-in-1, HDMI, USB 3.0, SD Card',
      orderedQty: 15,
      receivedQty: 14,
      acceptedQty: 0,
      rejectedQty: 0,
      unit: 'Unit',
      inspectionStatus: 'pending',
      qualityChecks: {
        visual: null,
        dimensional: null,
        functional: null,
        packaging: null,
        documentation: null
      },
      remarks: '1 unit short delivered'
    }
  ])

  const [expandedItems, setExpandedItems] = useState<string[]>(['1'])
  const [inspectionNotes, setInspectionNotes] = useState('')
  const [overallStatus, setOverallStatus] = useState<'pending' | 'approved' | 'rejected' | 'partial'>('pending')
  const [attachments, setAttachments] = useState<File[]>([])

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const updateItemQuantity = (itemId: string, field: 'receivedQty' | 'acceptedQty' | 'rejectedQty', delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item }
        const newValue = Math.max(0, item[field] + delta)

        if (field === 'acceptedQty') {
          updated.acceptedQty = Math.min(newValue, item.receivedQty)
          updated.rejectedQty = item.receivedQty - updated.acceptedQty
        } else if (field === 'rejectedQty') {
          updated.rejectedQty = Math.min(newValue, item.receivedQty)
          updated.acceptedQty = item.receivedQty - updated.rejectedQty
        } else if (field === 'receivedQty') {
          updated.receivedQty = Math.min(newValue, item.orderedQty)
          // Reset accepted/rejected if received quantity changes
          if (updated.receivedQty < updated.acceptedQty + updated.rejectedQty) {
            updated.acceptedQty = 0
            updated.rejectedQty = 0
          }
        }

        // Update inspection status based on quantities
        if (updated.acceptedQty === updated.receivedQty && updated.receivedQty > 0) {
          updated.inspectionStatus = 'passed'
        } else if (updated.rejectedQty === updated.receivedQty && updated.receivedQty > 0) {
          updated.inspectionStatus = 'failed'
        } else if (updated.acceptedQty > 0 || updated.rejectedQty > 0) {
          updated.inspectionStatus = 'partial'
        } else {
          updated.inspectionStatus = 'pending'
        }

        return updated
      }
      return item
    }))
  }

  const updateQualityCheck = (itemId: string, checkType: keyof InspectionItem['qualityChecks'], value: 'pass' | 'fail' | 'na') => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          qualityChecks: {
            ...item.qualityChecks,
            [checkType]: value
          }
        }
      }
      return item
    }))
  }

  const addDefect = (itemId: string, defect: string) => {
    if (!defect.trim()) return
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          defects: [...(item.defects || []), defect]
        }
      }
      return item
    }))
  }

  const removeDefect = (itemId: string, index: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          defects: item.defects?.filter((_, i) => i !== index)
        }
      }
      return item
    }))
  }

  const updateRemarks = (itemId: string, remarks: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, remarks }
      }
      return item
    }))
  }

  const calculateTotals = () => {
    const totals = items.reduce((acc, item) => ({
      ordered: acc.ordered + item.orderedQty,
      received: acc.received + item.receivedQty,
      accepted: acc.accepted + item.acceptedQty,
      rejected: acc.rejected + item.rejectedQty
    }), { ordered: 0, received: 0, accepted: 0, rejected: 0 })

    return totals
  }

  const getCheckIcon = (status: 'pass' | 'fail' | 'na' | null) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'na':
        return <span className="h-4 w-4 text-gray-400 text-xs">N/A</span>
      default:
        return <span className="h-4 w-4 text-gray-300">-</span>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'partial':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSaveDraft = () => {
    console.log('Saving inspection draft...')
  }

  const handleSubmitInspection = () => {
    const totals = calculateTotals()
    let status: 'approved' | 'rejected' | 'partial' = 'approved'

    if (totals.rejected === totals.received) {
      status = 'rejected'
    } else if (totals.rejected > 0 || totals.received < totals.ordered) {
      status = 'partial'
    }

    setOverallStatus(status)
    console.log('Submitting inspection with status:', status)
    // router.push('/procurement/grn')
  }

  const totals = calculateTotals()
  const acceptanceRate = totals.received > 0 ? Math.round((totals.accepted / totals.received) * 100) : 0

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/procurement/grn"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Quality Inspection</h1>
          </div>
          <p className="text-gray-600 ml-11">GRN: {grnDetails.grnNumber} | PO: {grnDetails.poNumber}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={handleSubmitInspection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Complete Inspection
          </button>
        </div>
      </div>

      {/* GRN Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          Delivery Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Vendor</p>
            <p className="font-medium text-gray-900">{grnDetails.vendorName}</p>
            <p className="text-xs text-gray-500">{grnDetails.vendorCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery Date</p>
            <p className="font-medium text-gray-900">{grnDetails.deliveryDate}</p>
            <p className="text-xs text-gray-500">Vehicle: {grnDetails.vehicleNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Invoice</p>
            <p className="font-medium text-gray-900">{grnDetails.invoiceNumber}</p>
            <p className="text-xs text-gray-500">{grnDetails.invoiceDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Warehouse</p>
            <p className="font-medium text-gray-900">{grnDetails.warehouseLocation}</p>
            <p className="text-xs text-gray-500">Received by: {grnDetails.receivedBy}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ordered</p>
              <p className="text-2xl font-bold text-gray-900">{totals.ordered}</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="text-2xl font-bold text-blue-600">{totals.received}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{totals.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{totals.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Acceptance</p>
              <p className="text-2xl font-bold text-indigo-600">{acceptanceRate}%</p>
            </div>
            <Shield className="h-8 w-8 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Inspection Items */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Item Header */}
            <div
              className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleItemExpansion(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <p className="text-sm text-gray-500">{item.itemCode} • {item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.inspectionStatus)}`}>
                      {item.inspectionStatus}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Accepted/Received</p>
                    <p className="font-medium text-gray-900">{item.acceptedQty}/{item.receivedQty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems.includes(item.id) && (
              <div className="p-4 border-t">
                {/* Quantity Inspection */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Quantity Verification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ordered Qty</label>
                      <div className="text-lg font-medium text-gray-900">{item.orderedQty} {item.unit}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Received Qty</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, 'receivedQty', -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={item.receivedQty}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0
                            updateItemQuantity(item.id, 'receivedQty', newValue - item.receivedQty)
                          }}
                          className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                        />
                        <button
                          onClick={() => updateItemQuantity(item.id, 'receivedQty', 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Accepted Qty</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, 'acceptedQty', -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={item.acceptedQty}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0
                            updateItemQuantity(item.id, 'acceptedQty', newValue - item.acceptedQty)
                          }}
                          className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-green-600 font-medium"
                        />
                        <button
                          onClick={() => updateItemQuantity(item.id, 'acceptedQty', 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Rejected Qty</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, 'rejectedQty', -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={item.rejectedQty}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0
                            updateItemQuantity(item.id, 'rejectedQty', newValue - item.rejectedQty)
                          }}
                          className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-red-600 font-medium"
                        />
                        <button
                          onClick={() => updateItemQuantity(item.id, 'rejectedQty', 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Checks */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Quality Checks</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(item.qualityChecks).map(([check, status]) => (
                      <div key={check} className="border rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-2 capitalize">{check}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateQualityCheck(item.id, check as keyof InspectionItem['qualityChecks'], 'pass')}
                            className={`flex-1 p-1.5 rounded text-xs font-medium transition-colors ${
                              status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            Pass
                          </button>
                          <button
                            onClick={() => updateQualityCheck(item.id, check as keyof InspectionItem['qualityChecks'], 'fail')}
                            className={`flex-1 p-1.5 rounded text-xs font-medium transition-colors ${
                              status === 'fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            Fail
                          </button>
                          <button
                            onClick={() => updateQualityCheck(item.id, check as keyof InspectionItem['qualityChecks'], 'na')}
                            className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                              status === 'na' ? 'bg-gray-300 text-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            N/A
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch/Serial Numbers */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Batch/Serial Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={item.batchNumber || ''}
                        placeholder="Enter batch number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Serial Numbers</label>
                      <input
                        type="text"
                        placeholder="Enter serial numbers (comma separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Defects */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Defects Found</h5>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add defect description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addDefect(item.id, (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                    <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      Add Defect
                    </button>
                  </div>
                  {item.defects && item.defects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.defects.map((defect, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {defect}
                          <button
                            onClick={() => removeDefect(item.id, idx)}
                            className="ml-1 hover:text-red-900"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remarks */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Inspection Remarks</h5>
                  <textarea
                    value={item.remarks || ''}
                    onChange={(e) => updateRemarks(item.id, e.target.value)}
                    placeholder="Add inspection notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Attach Images</h5>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center gap-2 text-sm text-gray-600">
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </button>
                    <button className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center gap-2 text-sm text-gray-600">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Inspection Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          Overall Inspection Notes
        </h3>
        <textarea
          value={inspectionNotes}
          onChange={(e) => setInspectionNotes(e.target.value)}
          placeholder="Add overall inspection comments, observations, or recommendations..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          Supporting Documents
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-gray-500 mb-4">
              Quality certificates, test reports, photos (Max 10MB)
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments([...attachments, ...Array.from(e.target.files)])
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose Files
            </label>
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}