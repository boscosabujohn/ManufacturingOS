'use client';

import React from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function PortalOrdersPage() {
    const orders = [
        {
            id: 'ORD-2025-001',
            date: 'Oct 24, 2025',
            status: 'In Production',
            total: '$12,500',
            items: 'Modular Kitchen Units (x2)',
            progress: 60,
            steps: [
                { label: 'Order Placed', date: 'Oct 24', completed: true },
                { label: 'Confirmed', date: 'Oct 25', completed: true },
                { label: 'In Production', date: 'Oct 26', completed: true, current: true },
                { label: 'Shipped', date: 'Est. Nov 02', completed: false },
                { label: 'Delivered', date: 'Est. Nov 05', completed: false },
            ]
        },
        {
            id: 'ORD-2025-002',
            date: 'Oct 15, 2025',
            status: 'Shipped',
            total: '$4,200',
            items: 'Wardrobe Fittings Set',
            progress: 80,
            steps: [
                { label: 'Order Placed', date: 'Oct 15', completed: true },
                { label: 'Confirmed', date: 'Oct 16', completed: true },
                { label: 'In Production', date: 'Oct 18', completed: true },
                { label: 'Shipped', date: 'Oct 24', completed: true, current: true },
                { label: 'Delivered', date: 'Est. Oct 28', completed: false },
            ]
        },
        {
            id: 'ORD-2025-003',
            date: 'Oct 01, 2025',
            status: 'Delivered',
            total: '$8,900',
            items: 'Office Furniture Bulk',
            progress: 100,
            steps: [
                { label: 'Order Placed', date: 'Oct 01', completed: true },
                { label: 'Confirmed', date: 'Oct 02', completed: true },
                { label: 'In Production', date: 'Oct 05', completed: true },
                { label: 'Shipped', date: 'Oct 10', completed: true },
                { label: 'Delivered', date: 'Oct 12', completed: true, current: true },
            ]
        }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/portal" className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">Track and manage your purchases</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by order ID or item name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Filter className="w-4 h-4" />
                    Filter Status
                </button>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-start">
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg h-fit">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">{order.items}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{order.total}</p>
                                <button className="text-sm text-blue-600 hover:underline mt-1 flex items-center justify-end gap-1">
                                    View Invoice <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 py-8 bg-gray-50">
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                    style={{ width: `${order.progress}%` }}
                                ></div>

                                <div className="relative flex justify-between">
                                    {order.steps.map((step, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${step.completed ? 'border-green-500 text-green-500' :
                                                    step.current ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-300'
                                                }`}>
                                                {step.completed ? <CheckCircle className="w-5 h-5" /> :
                                                    step.current ? <Clock className="w-5 h-5" /> :
                                                        <div className="w-3 h-3 rounded-full bg-gray-300" />}
                                            </div>
                                            <p className={`text-xs font-medium mt-2 ${step.current ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{step.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {order.status === 'Shipped' && (
                            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 flex items-center gap-2 text-sm text-blue-700">
                                <Truck className="w-4 h-4" />
                                <span>Out for delivery - Arriving by 5:00 PM today</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
