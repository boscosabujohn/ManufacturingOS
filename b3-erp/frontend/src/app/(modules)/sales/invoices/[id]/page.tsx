'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, Mail, CheckCircle } from 'lucide-react';

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.id as string;

    // Mock invoice data
    const invoice = {
        id: invoiceId,
        number: invoiceId,
        date: '2025-01-20',
        dueDate: '2025-02-19',
        customer: {
            name: 'ABC Manufacturing Ltd',
            address: '123 Industrial Estate, Mumbai 400001',
            gstin: '27ABCDE1234F1Z5',
        },
        items: [
            { description: 'Commercial Oven - Model CO-500', quantity: 2, rate: 225000, amount: 450000 },
            { description: 'Installation & Setup', quantity: 1, rate: 25000, amount: 25000 },
        ],
        subtotal: 475000,
        tax: 85500,
        total: 560500,
        status: 'Paid',
        paymentDate: '2025-01-25',
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
                        <h1 className="text-3xl font-bold">Invoice {invoice.number}</h1>
                        <Badge className={invoice.status === 'Paid' ? 'bg-green-600' : 'bg-orange-600'}>
                            {invoice.status}
                        </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Issued: {invoice.date} | Due: {invoice.dueDate}
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
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Invoice */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Customer Info */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-2">Bill To:</h3>
                                <p className="font-medium">{invoice.customer.name}</p>
                                <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                                <p className="text-sm text-gray-600">GSTIN: {invoice.customer.gstin}</p>
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
                                    {invoice.items.map((item, idx) => (
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
                                        <span className="font-semibold">₹{invoice.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tax (18%):</span>
                                        <span className="font-semibold">₹{invoice.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-green-600">₹{invoice.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-green-600">Paid in Full</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Date:</span>
                                    <span className="font-medium">{invoice.paymentDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-medium text-green-600">₹{invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Record Payment
                            </Button>
                            <Button className="w-full" variant="outline">
                                Send Reminder
                            </Button>
                            <Button className="w-full" variant="outline">
                                Create Credit Note
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Related Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Sales Order:</span>
                                    <a href="#" className="text-blue-600 hover:underline">SO-2025-101</a>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Delivery Note:</span>
                                    <a href="#" className="text-blue-600 hover:underline">DN-2025-089</a>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Quotation:</span>
                                    <a href="#" className="text-blue-600 hover:underline">QT-2025-067</a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
