'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, Mail, Truck, CheckCircle } from 'lucide-react';

export default function PurchaseOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    // Mock PO data
    const order = {
        id: orderId,
        number: orderId,
        date: '2025-01-22',
        vendor: {
            name: 'Steel Suppliers Ltd',
            id: 'VEN-001',
            address: 'Industrial Area, Pune',
            contact: 'Rajesh Kumar',
            email: 'rajesh@steelsuppliers.com',
        },
        items: [
            { description: 'Steel Sheet 2mm', quantity: 500, rate: 250, amount: 125000 },
            { description: 'Steel Rod 10mm', quantity: 1000, rate: 150, amount: 150000 },
        ],
        subtotal: 275000,
        tax: 49500,
        total: 324500,
        status: 'Issued',
        paymentStatus: 'Pending',
        deliveryStatus: 'Expected',
        expectedDelivery: '2025-01-28',
    };

    return (
        <div className="container mx-auto p-6">
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
                        <h1 className="text-3xl font-bold">Purchase Order {order.number}</h1>
                        <Badge className="bg-blue-600">{order.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Vendor: {order.vendor.name} | Date: {order.date}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Vendor
                    </Button>
                    <Button>
                        <Truck className="mr-2 h-4 w-4" />
                        Receive Goods
                    </Button>
                </div>
            </div>

            {/* Order Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Order Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Vendor Info */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-2">Vendor Information:</h3>
                                <p className="font-medium">{order.vendor.name}</p>
                                <p className="text-sm text-gray-600">{order.vendor.address}</p>
                                <p className="text-sm text-gray-600">Contact: {order.vendor.contact}</p>
                                <p className="text-sm text-gray-600">Email: {order.vendor.email}</p>
                            </div>

                            {/* Line Items */}
                            <table className="w-full mb-6">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Qty</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Rate</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 text-sm">{item.description}</td>
                                            <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-sm">₹{item.rate.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right text-sm font-semibold">₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tax (18%):</span>
                                        <span className="font-semibold">₹{order.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-blue-600">₹{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Cards */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <Truck className="h-5 w-5 text-orange-600" />
                                <span className="font-semibold text-orange-600">{order.deliveryStatus}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Expected: <span className="font-medium text-gray-900">{order.expectedDelivery}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="h-5 w-5 text-gray-400" />
                                <span className="font-semibold text-gray-600">{order.paymentStatus}</span>
                            </div>
                            <Button variant="outline" className="w-full text-sm">Record Bill</Button>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Create GRN
                            </Button>
                            <Button className="w-full" variant="outline">
                                Cancel Order
                            </Button>
                            <Button className="w-full" variant="outline">
                                Duplicate
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
