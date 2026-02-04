'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export default function StockTransferDetailPage() {
    const params = useParams();
    const router = useRouter();
    const transferId = params.id as string;

    // Mock transfer data
    const transfer = {
        id: transferId,
        number: transferId,
        date: '2025-01-22',
        fromLocation: 'Warehouse A - Main',
        toLocation: 'Warehouse B - Distribution',
        requestedBy: 'John Doe',
        approvedBy: 'Jane Smith',
        status: 'Completed',
        items: [
            { code: 'PLY-18MM-BWP', name: 'BWP Plywood 18mm', quantity: 50, uom: 'Sheets' },
            { code: 'HNG-BLM-165', name: 'Blum Soft-close Hinges', quantity: 200, uom: 'Pcs' },
        ],
        notes: 'Urgent transfer for Project X',
    };

    return (
        <div className="w-full p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
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
                        <h1 className="text-3xl font-bold">Transfer {transfer.number}</h1>
                        <Badge className="bg-green-600">{transfer.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Date: {transfer.date} | Ref: ST-2025-001
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Slip
                    </Button>
                    <Button>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Receipt
                    </Button>
                </div>
            </div>

            {/* Transfer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Main Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Route Info */}
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-3">
                                <div>
                                    <p className="text-sm text-gray-500">From Location</p>
                                    <p className="font-semibold text-lg">{transfer.fromLocation}</p>
                                </div>
                                <ArrowRight className="text-gray-400 w-6 h-6" />
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">To Location</p>
                                    <p className="font-semibold text-lg">{transfer.toLocation}</p>
                                </div>
                            </div>

                            {/* Line Items */}
                            <table className="w-full mb-3">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Item Code</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 pl-2">UOM</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {transfer.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.code}</td>
                                            <td className="px-4 py-3 text-sm">{item.name}</td>
                                            <td className="px-4 py-3 text-right text-sm font-bold">{item.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 pl-2">{item.uom}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {transfer.notes}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workflow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Requested</p>
                                        <p className="text-xs text-gray-500">by {transfer.requestedBy}</p>
                                    </div>
                                </div>
                                <div className="w-0.5 h-4 bg-gray-200 ml-4"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Approved</p>
                                        <p className="text-xs text-gray-500">by {transfer.approvedBy}</p>
                                    </div>
                                </div>
                                <div className="w-0.5 h-4 bg-gray-200 ml-4"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Dispatched</p>
                                        <p className="text-xs text-gray-500">In Transit</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
