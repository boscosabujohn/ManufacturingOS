'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Package, Clock, ArrowRight, Bell, CreditCard, ShoppingCart } from 'lucide-react';

export default function CustomerPortalPage() {
    const recentOrders = [
        { id: 'ORD-2025-001', date: 'Oct 24, 2025', status: 'In Production', amount: '$12,500' },
        { id: 'ORD-2025-002', date: 'Oct 15, 2025', status: 'Shipped', amount: '$4,200' },
        { id: 'ORD-2025-003', date: 'Oct 01, 2025', status: 'Delivered', amount: '$8,900' },
    ];

    const recentDocs = [
        { name: 'Invoice #INV-2025-001', type: 'PDF', date: 'Oct 24, 2025' },
        { name: 'Project Proposal v2', type: 'PDF', date: 'Oct 20, 2025' },
        { name: 'CAD Drawings - Kitchen', type: 'DWG', date: 'Oct 18, 2025' },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 p-3">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, Acme Corp</h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your projects</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            AC
                        </div>
                        <span className="text-sm font-medium text-gray-900">Acme Corp</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'Track Orders', icon: Package, href: '/portal/orders', color: 'bg-blue-500' },
                    { label: 'View Documents', icon: FileText, href: '/portal/documents', color: 'bg-purple-500' },
                    { label: 'Make Payment', icon: CreditCard, href: '#', color: 'bg-green-500' },
                    { label: 'New Order', icon: ShoppingCart, href: '#', color: 'bg-orange-500' },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
                    >
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.label}
                        </h3>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/portal/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-white rounded border border-gray-200">
                                        <Package className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.id}</p>
                                        <p className="text-xs text-gray-500">{order.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-900">{order.amount}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Recent Documents</h2>
                        <Link href="/portal/documents" className="text-sm text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="space-y-2">
                        {recentDocs.map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                <div className="p-2 bg-red-50 text-red-600 rounded border border-red-100">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.date} • {doc.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors">
                        Upload Document
                    </button>
                </div>
            </div>
        </div>
    );
}
