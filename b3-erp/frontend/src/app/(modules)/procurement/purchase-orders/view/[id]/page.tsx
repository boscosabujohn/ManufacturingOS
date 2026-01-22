'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Printer, Mail, Truck, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { approvalService, ApprovalHistory } from '@/services/ApprovalService';

export default function PurchaseOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Mock PO data - in real app this would come from an API
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
        status: 'Draft', // Changed to Draft to show Submit button
        paymentStatus: 'Pending',
        deliveryStatus: 'Expected',
        expectedDelivery: '2025-01-28',
    };

    useEffect(() => {
        fetchApprovalHistory();
    }, [orderId]);

    const fetchApprovalHistory = async () => {
        try {
            setLoadingHistory(true);
            // In a real app, we would use the actual order ID
            // const history = await approvalService.getHistory(orderId, 'purchase_order');
            // setApprovalHistory(history);

            // Mock history for demonstration
            setApprovalHistory([
                {
                    approver: 'John Manager',
                    action: 'approved',
                    date: '2025-01-23',
                    comments: 'Budget approved',
                    level: 1
                },
                {
                    approver: 'Sarah Director',
                    action: 'returned',
                    date: '2025-01-24',
                    comments: 'Please attach competitive quotes',
                    level: 2
                }
            ]);
        } catch (error) {
            console.error('Failed to fetch approval history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSubmitForApproval = async () => {
        try {
            // await approvalService.createApproval({ ... });
            alert('Submitted for approval!');
        } catch (error) {
            console.error('Failed to submit:', error);
        }
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
                        <h1 className="text-3xl font-bold">Purchase Order {order.number}</h1>
                        <Badge className="bg-blue-600">{order.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Vendor: {order.vendor.name} | Date: {order.date}
                    </p>
                </div>

                <div className="flex gap-2">
                    {order.status === 'Draft' && (
                        <Button onClick={handleSubmitForApproval} className="bg-green-600 hover:bg-green-700">
                            Submit for Approval
                        </Button>
                    )}
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
                    <Tabs defaultValue="details">
                        <TabsList className="mb-4">
                            <TabsTrigger value="details">Order Details</TabsTrigger>
                            <TabsTrigger value="approvals">Approvals</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">
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
                        </TabsContent>

                        <TabsContent value="approvals">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approval History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loadingHistory ? (
                                        <div className="text-center py-4">Loading history...</div>
                                    ) : (
                                        <div className="space-y-6">
                                            {approvalHistory.map((item, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`p-2 rounded-full ${item.action === 'approved' ? 'bg-green-100 text-green-600' :
                                                            item.action === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {item.action === 'approved' ? <CheckCircle className="h-4 w-4" /> :
                                                                item.action === 'rejected' ? <XCircle className="h-4 w-4" /> :
                                                                    <RotateCcw className="h-4 w-4" />}
                                                        </div>
                                                        {index < approvalHistory.length - 1 && (
                                                            <div className="w-0.5 h-full bg-gray-200 my-2" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.approver}</p>
                                                                <p className="text-sm text-gray-500">Level {item.level}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-500">{item.date}</span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                            <span className="font-medium capitalize">{item.action}</span>
                                                            {item.comments && (
                                                                <p className="mt-1 text-gray-600">"{item.comments}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {approvalHistory.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    No approval history found.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
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
