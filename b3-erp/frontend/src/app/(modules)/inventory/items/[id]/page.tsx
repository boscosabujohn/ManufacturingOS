'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, BarChart3, History, Layers } from 'lucide-react';

export default function ItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const itemId = params.id as string;

    // Mock item data
    const item = {
        id: itemId,
        code: 'PLY-18MM-BWP',
        name: 'BWP Plywood 18mm',
        description: 'Boiling Water Proof Plywood - 8ft x 4ft Sheet',
        category: 'Raw Material',
        uom: 'Sheets',
        currentStock: 150,
        reorderLevel: 50,
        unitCost: 2500,
        totalValue: 375000,
        location: 'Warehouse A - Rack 4',
        status: 'Active',
        specifications: [
            { label: 'Thickness', value: '18mm' },
            { label: 'Grade', value: 'BWP (IS 710)' },
            { label: 'Dimensions', value: '8ft x 4ft' },
            { label: 'Brand', value: 'Century Ply' },
        ],
    };

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-2"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{item.name}</h1>
                        <Badge className="bg-green-600">{item.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Code: {item.code} | Category: {item.category}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <History className="mr-2 h-4 w-4" />
                        Movement History
                    </Button>
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Stock Analysis
                    </Button>
                </div>
            </div>

            {/* Item Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium">{item.description}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unit of Measure</p>
                                    <p className="font-medium">{item.uom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Default Location</p>
                                    <p className="font-medium">{item.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reorder Level</p>
                                    <p className="font-medium text-orange-600">{item.reorderLevel} {item.uom}</p>
                                </div>
                            </div>

                            <h3 className="font-semibold mb-3">Specifications</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {item.specifications.map((spec, idx) => (
                                        <div key={idx}>
                                            <p className="text-sm text-gray-500">{spec.label}</p>
                                            <p className="font-medium">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-3 text-sm">2025-01-20</td>
                                        <td className="px-4 py-3 text-sm">Issue</td>
                                        <td className="px-4 py-3 text-sm text-blue-600">WO-2025-001</td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600">-25</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm">2025-01-15</td>
                                        <td className="px-4 py-3 text-sm">Receipt</td>
                                        <td className="px-4 py-3 text-sm text-blue-600">GRN-2025-089</td>
                                        <td className="px-4 py-3 text-sm text-right text-green-600">+100</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <Package className="w-12 h-12 text-blue-600 mb-2" />
                                <p className="text-3xl font-bold text-gray-900">{item.currentStock}</p>
                                <p className="text-sm text-gray-500">{item.uom} Available</p>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Unit Cost</span>
                                    <span className="font-medium">₹{item.unitCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Value</span>
                                    <span className="font-bold text-green-600">₹{item.totalValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Adjust Stock
                            </Button>
                            <Button className="w-full" variant="outline">
                                Request Purchase
                            </Button>
                            <Button className="w-full" variant="outline">
                                Print Label
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
