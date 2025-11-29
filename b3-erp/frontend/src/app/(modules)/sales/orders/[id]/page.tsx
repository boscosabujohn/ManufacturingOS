'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, Mail, Truck, CheckCircle } from 'lucide-react';

export default function SalesOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    // Mock order data
    const order = {
        id: orderId,
        number: orderId,
        date: '2025-01-20',
        customer: {
            name: 'TechSolutions Inc.',
            id: 'CUST-001',
            address: '123 Tech Park, Bangalore',
            contact: 'John Doe',
        },
        items: [
            { description: 'Industrial Server Rack', quantity: 5, rate: 45000, amount: 225000 },
            { description: 'Cooling Unit', quantity: 2, rate: 15000, amount: 30000 },
            { description: 'Installation Service', quantity: 1, rate: 10000, amount: 10000 },
        ],
        subtotal: 265000,
        tax: 47700,
        total: 312700,
        status: 'Confirmed',
        paymentStatus: 'Partially Paid',
        deliveryStatus: 'In Transit',
        expectedDelivery: '2025-01-25',
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
                        <h1 className="text-3xl font-bold">Sales Order {order.number}</h1>
                        <Badge className="bg-blue-600">{order.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Customer: {order.customer.name} | Date: {order.date}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </Button>
                    <Button>
                        <Truck className="mr-2 h-4 w-4" />
                        Track Shipment
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
                            {/* Customer Info */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-2">Customer Information:</h3>
                                <p className="font-medium">{order.customer.name}</p>
                                <p className="text-sm text-gray-600">{order.customer.address}</p>
                                <p className="text-sm text-gray-600">Contact: {order.customer.contact}</p>
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
                            <CardTitle>Fulfillment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <Truck className="h-5 w-5 text-orange-600" />
                                <span className="font-semibold text-orange-600">{order.deliveryStatus}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Expected Delivery: <span className="font-medium text-gray-900">{order.expectedDelivery}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="h-5 w-5 text-yellow-600" />
                                <span className="font-semibold text-yellow-600">{order.paymentStatus}</span>
                            </div>
                            <Button variant="outline" className="w-full text-sm">View Invoices</Button>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Create Invoice
                            </Button>
                            <Button className="w-full" variant="outline">
                                Create Delivery Note
                            </Button>
                            <Button className="w-full" variant="outline">
                                Cancel Order
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
