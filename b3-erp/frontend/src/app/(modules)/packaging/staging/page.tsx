'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Truck,
    CheckCircle,
    Clock,
    User,
    Calendar,
    ArrowLeft,
    FileText,
    Package,
} from 'lucide-react';

interface StagedItem {
    id: string;
    woNumber: string;
    productName: string;
    quantity: number;
    packingComplete: boolean;
    shippingBillNumber?: string;
    status: 'Staging' | 'Ready to Ship' | 'Shipped';
    stagedDate: string;
    customerName: string;
    deliveryAddress: string;
    transportMethod: 'Own Vehicle' | 'Third Party' | 'Courier';
}

const mockStagedItems: StagedItem[] = [
    {
        id: '1',
        woNumber: 'WO-2025-001',
        productName: 'SS304 Kitchen Sink Panel',
        quantity: 24,
        packingComplete: true,
        shippingBillNumber: 'SB-2025-001',
        status: 'Ready to Ship',
        stagedDate: '2025-01-24',
        customerName: 'Hotel Paradise Ltd',
        deliveryAddress: 'Mumbai, Maharashtra',
        transportMethod: 'Own Vehicle',
    },
    {
        id: '2',
        woNumber: 'WO-2025-004',
        productName: 'Drawer Slide Assembly',
        quantity: 30,
        packingComplete: true,
        shippingBillNumber: 'SB-2025-002',
        status: 'Shipped',
        stagedDate: '2025-01-24',
        customerName: 'Springfield Academy',
        deliveryAddress: 'Pune, Maharashtra',
        transportMethod: 'Third Party',
    },
    {
        id: '3',
        woNumber: 'WO-2025-005',
        productName: 'Countertop Support Bracket',
        quantity: 40,
        packingComplete: true,
        status: 'Staging',
        stagedDate: '2025-01-25',
        customerName: 'City General Hospital',
        deliveryAddress: 'Bangalore, Karnataka',
        transportMethod: 'Courier',
    },
];

export default function DispatchStagingPage() {
    const [items] = useState<StagedItem[]>(mockStagedItems);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredItems = items.filter((item) => filterStatus === 'all' || item.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Ready to Ship':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Staging':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: items.length,
        readyToShip: items.filter((i) => i.status === 'Ready to Ship').length,
        shipped: items.filter((i) => i.status === 'Shipped').length,
    };

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-4">
                        <Link href="/packaging/operations" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dispatch Staging Area</h1>
                            <p className="text-sm text-gray-600 mt-1">Create shipping bills and stage for dispatch (Steps 6.9, 6.10)</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Staged</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Ready to Ship</p>
                                <p className="text-2xl font-bold text-green-900">{stats.readyToShip}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Shipped</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.shipped}</p>
                            </div>
                            <Truck className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg border p-4">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
                        <option value="all">All Status</option>
                        <option value="Staging">Staging</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Shipped">Shipped</option>
                    </select>
                </div>

                {/* Staged Items List */}
                <div className="grid gap-4">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition">
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-lg ${item.status === 'Shipped' ? 'bg-purple-500' : item.status === 'Ready to Ship' ? 'bg-green-500' : 'bg-yellow-500'} flex items-center justify-center`}>
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">{item.woNumber} - {item.quantity} units</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-500">Customer</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {item.customerName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Delivery Address</p>
                                            <p className="font-medium">{item.deliveryAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Staged Date</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {item.stagedDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Transport</p>
                                            <p className="font-medium">{item.transportMethod}</p>
                                        </div>
                                    </div>
                                    {item.shippingBillNumber && (
                                        <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                Shipping Bill: {item.shippingBillNumber}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
