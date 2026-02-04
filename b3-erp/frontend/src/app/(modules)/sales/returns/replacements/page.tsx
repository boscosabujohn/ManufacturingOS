'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Filter, RefreshCw, Package, Truck, CheckCircle, Clock, ArrowRight, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Replacement {
  id: string
  replacementNumber: string
  returnNumber: string
  orderNumber: string
  customerName: string
  originalProduct: {
    code: string
    name: string
    category: string
    quantity: number
  }
  replacementProduct: {
    code: string
    name: string
    category: string
    quantity: number
  }
  reason: string
  status: 'initiated' | 'picking' | 'packed' | 'shipped' | 'delivered' | 'on_hold'
  initiatedDate: string
  shippedDate?: string
  expectedDelivery?: string
  deliveredDate?: string
  trackingNumber?: string
  carrier?: string
  shippingAddress: string
  priority: 'normal' | 'high' | 'urgent'
  notes?: string
}

export default function ReplacementsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [replacements] = useState<Replacement[]>([
    {
      id: 'REP-001',
      replacementNumber: 'REP-2025-001',
      returnNumber: 'RET-2025-002',
      orderNumber: 'ORD-2025-1189',
      customerName: 'Modern Kitchen Solutions',
      originalProduct: {
        code: 'KIT-FC-002',
        name: 'Brass Kitchen Faucet with Pull-Out Spray (Defective)',
        category: 'Kitchen Faucets',
        quantity: 3
      },
      replacementProduct: {
        code: 'KIT-FC-002',
        name: 'Brass Kitchen Faucet with Pull-Out Spray (New)',
        category: 'Kitchen Faucets',
        quantity: 3
      },
      reason: 'Pull-out spray mechanism defect',
      status: 'shipped',
      initiatedDate: '2025-10-17',
      shippedDate: '2025-10-18',
      expectedDelivery: '2025-10-21',
      trackingNumber: 'DTDC789456123',
      carrier: 'DTDC',
      shippingAddress: 'Shop 12, MG Road, Bangalore - 560001',
      priority: 'high',
      notes: 'Priority replacement - customer is a premium dealer'
    },
    {
      id: 'REP-002',
      replacementNumber: 'REP-2025-002',
      returnNumber: 'RET-2025-003',
      orderNumber: 'ORD-2025-1456',
      customerName: 'VIP Homes & Interiors',
      originalProduct: {
        code: 'KIT-CW-001',
        name: 'Granite Coated Non-Stick Cookware Set (Defective)',
        category: 'Cookware',
        quantity: 2
      },
      replacementProduct: {
        code: 'KIT-CW-001',
        name: 'Granite Coated Non-Stick Cookware Set (New)',
        category: 'Cookware',
        quantity: 2
      },
      reason: 'Coating peeling defect',
      status: 'delivered',
      initiatedDate: '2025-10-14',
      shippedDate: '2025-10-15',
      expectedDelivery: '2025-10-18',
      deliveredDate: '2025-10-18',
      trackingNumber: 'BLUE456789012',
      carrier: 'Blue Dart',
      shippingAddress: '45, Palm Avenue, Mumbai - 400050',
      priority: 'urgent',
      notes: 'VIP customer - expedited shipping used'
    },
    {
      id: 'REP-003',
      replacementNumber: 'REP-2025-003',
      returnNumber: 'RET-2025-004',
      orderNumber: 'ORD-2025-1378',
      customerName: 'Elite Contractors Pvt Ltd',
      originalProduct: {
        code: 'KIT-CB-001',
        name: 'Modular Kitchen Base Cabinet 24" (Wrong Size)',
        category: 'Kitchen Storage',
        quantity: 4
      },
      replacementProduct: {
        code: 'KIT-CB-003',
        name: 'Modular Kitchen Base Cabinet 30" (Correct Size)',
        category: 'Kitchen Storage',
        quantity: 4
      },
      reason: 'Wrong dimensions shipped',
      status: 'picking',
      initiatedDate: '2025-10-18',
      expectedDelivery: '2025-10-23',
      shippingAddress: 'Construction Site, Plot 45, Sector 21, Noida - 201301',
      priority: 'high',
      notes: 'Site delivery required - coordinate with project manager'
    },
    {
      id: 'REP-004',
      replacementNumber: 'REP-2025-004',
      returnNumber: 'RET-2025-005',
      orderNumber: 'ORD-2025-1523',
      customerName: 'Home Decor Plus (Dealer)',
      originalProduct: {
        code: 'KIT-AP-001',
        name: '750W Mixer Grinder (Defective Motor)',
        category: 'Kitchen Appliances',
        quantity: 6
      },
      replacementProduct: {
        code: 'KIT-AP-001',
        name: '750W Mixer Grinder (New)',
        category: 'Kitchen Appliances',
        quantity: 6
      },
      reason: 'Motor defect and overheating',
      status: 'delivered',
      initiatedDate: '2025-10-07',
      shippedDate: '2025-10-08',
      expectedDelivery: '2025-10-11',
      deliveredDate: '2025-10-10',
      trackingNumber: 'VRL234567890',
      carrier: 'VRL Logistics',
      shippingAddress: '23, Market Complex, Pune - 411001',
      priority: 'normal',
      notes: 'Replacement completed successfully'
    },
    {
      id: 'REP-005',
      replacementNumber: 'REP-2025-005',
      returnNumber: 'RET-2025-009',
      orderNumber: 'ORD-2025-1434',
      customerName: 'City Hospital Kitchen Department',
      originalProduct: {
        code: 'KIT-CW-002',
        name: 'Stainless Steel Pressure Cooker 5L (Safety Valve Defect)',
        category: 'Cookware',
        quantity: 8
      },
      replacementProduct: {
        code: 'KIT-CW-002',
        name: 'Stainless Steel Pressure Cooker 5L (New)',
        category: 'Cookware',
        quantity: 8
      },
      reason: 'Safety valve defect - critical',
      status: 'shipped',
      initiatedDate: '2025-10-13',
      shippedDate: '2025-10-14',
      expectedDelivery: '2025-10-20',
      trackingNumber: 'DTDC345678901',
      carrier: 'DTDC',
      shippingAddress: 'City Hospital, Central Store, Medical Road, Delhi - 110001',
      priority: 'urgent',
      notes: 'Safety critical - expedited processing'
    },
    {
      id: 'REP-006',
      replacementNumber: 'REP-2025-006',
      returnNumber: 'RET-2025-010',
      orderNumber: 'ORD-2025-1556',
      customerName: 'Smart Contractors Ltd',
      originalProduct: {
        code: 'KIT-SS-002',
        name: 'Stainless Steel Kitchen Sink Double Bowl (Incomplete)',
        category: 'Kitchen Sinks',
        quantity: 3
      },
      replacementProduct: {
        code: 'KIT-DRAIN-001',
        name: 'Complete Drain Assembly Kit',
        category: 'Kitchen Accessories',
        quantity: 3
      },
      reason: 'Missing drain assembly parts',
      status: 'delivered',
      initiatedDate: '2025-10-08',
      shippedDate: '2025-10-09',
      expectedDelivery: '2025-10-12',
      deliveredDate: '2025-10-11',
      trackingNumber: 'BLUE567890123',
      carrier: 'Blue Dart',
      shippingAddress: 'Office 301, Tower B, Cyber City, Hyderabad - 500081',
      priority: 'normal',
      notes: 'Partial replacement - missing parts only'
    },
    {
      id: 'REP-007',
      replacementNumber: 'REP-2025-007',
      returnNumber: 'RET-2025-001',
      orderNumber: 'ORD-2025-1245',
      customerName: 'Sharma Builders Pvt Ltd',
      originalProduct: {
        code: 'KIT-SS-001',
        name: 'Stainless Steel Kitchen Sink Single Bowl (Damaged)',
        category: 'Kitchen Sinks',
        quantity: 5
      },
      replacementProduct: {
        code: 'KIT-SS-001',
        name: 'Stainless Steel Kitchen Sink Single Bowl (New)',
        category: 'Kitchen Sinks',
        quantity: 5
      },
      reason: 'Transit damage - scratches and dents',
      status: 'packed',
      initiatedDate: '2025-10-19',
      expectedDelivery: '2025-10-24',
      shippingAddress: 'Sharma Complex, Building Site 7, Gurgaon - 122001',
      priority: 'normal',
      notes: 'Extra protective packaging added'
    },
    {
      id: 'REP-008',
      replacementNumber: 'REP-2025-008',
      returnNumber: 'RET-2025-006',
      orderNumber: 'ORD-2025-1298',
      customerName: 'Premium Builders Group',
      originalProduct: {
        code: 'KIT-CH-001',
        name: 'Chimney Hood 60cm (Auto-clean Not Working)',
        category: 'Kitchen Ventilation',
        quantity: 2
      },
      replacementProduct: {
        code: 'KIT-CH-001',
        name: 'Chimney Hood 60cm (New)',
        category: 'Kitchen Ventilation',
        quantity: 2
      },
      reason: 'Auto-clean feature malfunction',
      status: 'on_hold',
      initiatedDate: '2025-10-16',
      shippingAddress: 'Premium Towers, Site Office, Chennai - 600001',
      priority: 'normal',
      notes: 'On hold - awaiting stock arrival. ETA: 2 days'
    },
    {
      id: 'REP-009',
      replacementNumber: 'REP-2025-009',
      returnNumber: 'RET-2025-011',
      orderNumber: 'ORD-2025-1823',
      customerName: 'Builders Association India',
      originalProduct: {
        code: 'KIT-AP-002',
        name: '2000W Induction Cooktop (Display Issue)',
        category: 'Kitchen Appliances',
        quantity: 10
      },
      replacementProduct: {
        code: 'KIT-AP-002',
        name: '2000W Induction Cooktop (New)',
        category: 'Kitchen Appliances',
        quantity: 10
      },
      reason: 'Display panel not responding',
      status: 'initiated',
      initiatedDate: '2025-10-19',
      expectedDelivery: '2025-10-25',
      shippingAddress: 'Association Office, Trade Center, Kolkata - 700001',
      priority: 'high',
      notes: 'Bulk replacement - quality check all units before dispatch'
    }
  ])

  const statuses = ['all', 'initiated', 'picking', 'packed', 'shipped', 'delivered', 'on_hold']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'picking':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'packed':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'on_hold':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated':
        return <Clock className="h-4 w-4" />
      case 'picking':
        return <Package className="h-4 w-4" />
      case 'packed':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'on_hold':
        return <Clock className="h-4 w-4" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'normal':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredReplacements = replacements.filter(rep => {
    const matchesSearch = rep.replacementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.returnNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || rep.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalReplacements: replacements.length,
    inTransit: replacements.filter(r => r.status === 'shipped').length,
    delivered: replacements.filter(r => r.status === 'delivered').length,
    onHold: replacements.filter(r => r.status === 'on_hold').length
  }

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Inline Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Replacement Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Track replacement order fulfillment</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Replacements</p>
              <p className="text-3xl font-bold mt-1">{stats.totalReplacements}</p>
              <p className="text-xs text-blue-100 mt-1">This month</p>
            </div>
            <RefreshCw className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">In Transit</p>
              <p className="text-3xl font-bold mt-1">{stats.inTransit}</p>
              <p className="text-xs text-indigo-100 mt-1">Currently shipping</p>
            </div>
            <Truck className="h-10 w-10 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Delivered</p>
              <p className="text-3xl font-bold mt-1">{stats.delivered}</p>
              <p className="text-xs text-green-100 mt-1">Successfully completed</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100">On Hold</p>
              <p className="text-3xl font-bold mt-1">{stats.onHold}</p>
              <p className="text-xs text-red-100 mt-1">Requires attention</p>
            </div>
            <Clock className="h-10 w-10 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by replacement, return, order number, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Replacements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredReplacements.map((replacement) => (
          <div key={replacement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{replacement.replacementNumber}</h3>
                      <p className="text-sm text-gray-600">Return: {replacement.returnNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(replacement.status)}`}>
                    {getStatusIcon(replacement.status)}
                    {replacement.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(replacement.priority)}`}>
                    {replacement.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer */}
              <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">{replacement.customerName}</p>
              </div>

              {/* Product Flow */}
              <div className="mb-2">
                <div className="bg-red-50 rounded-lg p-3 mb-2 border border-red-200">
                  <p className="text-xs text-red-700 mb-2 font-medium">Original Product (Returned)</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">{replacement.originalProduct.name}</p>
                      <p className="text-xs text-red-700">{replacement.originalProduct.code} • Qty: {replacement.originalProduct.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center my-2">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-700 mb-2 font-medium">Replacement Product (New)</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">{replacement.replacementProduct.name}</p>
                      <p className="text-xs text-green-700">{replacement.replacementProduct.code} • Qty: {replacement.replacementProduct.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-700 mb-1">Replacement Reason</p>
                <p className="text-sm text-yellow-900">{replacement.reason}</p>
              </div>

              {/* Shipping Info */}
              {replacement.trackingNumber && (
                <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-blue-700 font-medium">Shipping Information</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-700">Carrier: <span className="font-semibold text-gray-900">{replacement.carrier}</span></p>
                    <p className="text-gray-700">Tracking: <span className="font-semibold text-gray-900">{replacement.trackingNumber}</span></p>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <p className="text-xs text-gray-600 font-medium">Delivery Address</p>
                </div>
                <p className="text-sm text-gray-900">{replacement.shippingAddress}</p>
              </div>

              {/* Dates */}
              <div className="mb-2 text-sm">
                <p className="text-gray-600">Initiated: <span className="font-medium text-gray-900">{new Date(replacement.initiatedDate).toLocaleDateString('en-IN')}</span></p>
                {replacement.shippedDate && (
                  <p className="text-gray-600 mt-1">Shipped: <span className="font-medium text-gray-900">{new Date(replacement.shippedDate).toLocaleDateString('en-IN')}</span></p>
                )}
                {replacement.expectedDelivery && !replacement.deliveredDate && (
                  <p className="text-gray-600 mt-1">Expected: <span className="font-medium text-blue-900">{new Date(replacement.expectedDelivery).toLocaleDateString('en-IN')}</span></p>
                )}
                {replacement.deliveredDate && (
                  <p className="text-green-600 mt-1">Delivered: <span className="font-semibold text-green-900">{new Date(replacement.deliveredDate).toLocaleDateString('en-IN')}</span></p>
                )}
              </div>

              {/* Notes */}
              {replacement.notes && (
                <div className="mb-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs text-indigo-700 mb-1">Notes</p>
                  <p className="text-sm text-indigo-900">{replacement.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Track Shipment
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReplacements.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">No replacements found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
