'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertTriangle,
    Factory,
    ClipboardCheck,
    Calendar,
    DollarSign,
    User,
    MapPin,
    FileText
} from 'lucide-react'

// Mock data (same as dashboard for consistency)
const mockOrderDetails = {
    id: '1',
    orderId: 'ord-001',
    orderNumber: 'SO-2024-001',
    customerName: 'ABC Manufacturing Ltd',
    status: 'in_production',
    totalAmount: 125000,
    itemCount: 5,
    expectedDeliveryDate: '2024-12-15',
    progress: 45,
    priority: 'High',
    shippingAddress: '123 Industrial Area, Sector 4, Pune, MH 411028',
    billingAddress: 'ABC Corp HQ, Business Bay, Mumbai, MH 400051',
    contactPerson: 'Rajesh Kumar',
    contactPhone: '+91 98765 43210',
    events: [
        { status: 'order_placed', timestamp: '2024-11-15T10:00:00', description: 'Order placed' },
        { status: 'order_confirmed', timestamp: '2024-11-15T14:30:00', description: 'Order confirmed' },
        { status: 'production_planning', timestamp: '2024-11-16T09:00:00', description: 'Production planning started' },
        { status: 'in_production', timestamp: '2024-11-18T08:00:00', description: 'Production started' },
    ],
    workOrders: [
        { workOrderNumber: 'WO-001', itemName: 'Kitchen Cabinet A', quantity: 10, status: 'in_progress', progress: 60 },
        { workOrderNumber: 'WO-002', itemName: 'Kitchen Cabinet B', quantity: 5, status: 'pending', progress: 0 },
    ],
    items: [
        { id: '1', name: 'Kitchen Cabinet A', quantity: 10, unitPrice: 8500, total: 85000 },
        { id: '2', name: 'Kitchen Cabinet B', quantity: 5, unitPrice: 8000, total: 40000 },
    ]
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    order_placed: { label: 'Order Placed', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Clock },
    order_confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
    production_planning: { label: 'Planning', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: ClipboardCheck },
    material_procurement: { label: 'Procurement', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Package },
    in_production: { label: 'In Production', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Factory },
    quality_check: { label: 'Quality Check', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: ClipboardCheck },
    ready_for_dispatch: { label: 'Ready to Ship', color: 'text-teal-600', bgColor: 'bg-teal-100', icon: Package },
    dispatched: { label: 'Dispatched', color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: Truck },
    in_transit: { label: 'In Transit', color: 'text-sky-600', bgColor: 'bg-sky-100', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
    completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle },
    on_hold: { label: 'On Hold', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
}

export default function WorkflowOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [order] = useState(mockOrderDetails)

    const config = statusConfig[order.status] || statusConfig.order_placed
    const StatusIcon = config.icon

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} flex items-center gap-1`}>
                                    <StatusIcon className="h-4 w-4" />
                                    {config.label}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Created on {formatDate(order.events[0].timestamp)} • Customer: {order.customerName}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Invoice
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Track Shipment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h2>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{order.progress}% Completed</span>
                                <span className="text-gray-500">Est. Delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${order.progress}%` }}
                                />
                            </div>
                            <div className="mt-6 flex justify-between items-center relative">
                                {/* Simplified milestones for visual */}
                                {['Placed', 'Confirmed', 'Production', 'QC', 'Dispatch', 'Delivered'].map((step, idx) => {
                                    const isCompleted = idx * 20 <= order.progress
                                    return (
                                        <div key={step} className="flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-300'
                                                }`}>
                                                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                                            </div>
                                            <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    )
                                })}
                                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0" />
                            </div>
                        </div>

                        {/* Work Orders */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Orders</h2>
                            <div className="space-y-4">
                                {order.workOrders.map((wo) => (
                                    <div key={wo.workOrderNumber} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Factory className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{wo.workOrderNumber}</p>
                                                    <p className="text-sm text-gray-500">{wo.itemName}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${wo.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    wo.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {wo.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span>{wo.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full"
                                                    style={{ width: `${wo.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total Amount</td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.contactPerson}</p>
                                        <p className="text-sm text-gray-500">{order.customerName}</p>
                                        <p className="text-sm text-blue-600 mt-1">{order.contactPhone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Address</p>
                                        <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
                            <div className="space-y-6">
                                {order.events.map((event, index) => (
                                    <div key={index} className="relative flex gap-4">
                                        <div className={`
                      absolute left-0 top-0 bottom-0 w-px bg-gray-200
                      ${index === order.events.length - 1 ? 'h-2' : ''}
                    `} style={{ left: '9px' }} />
                                        <div className="relative z-10 w-5 h-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-sm font-medium text-gray-900">{event.description}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
