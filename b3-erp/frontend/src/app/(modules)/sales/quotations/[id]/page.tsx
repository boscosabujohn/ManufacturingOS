'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Mail, FileText, Check, X } from 'lucide-react';

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;

    // Mock quotation data
    const quote = {
        id: quoteId,
        number: quoteId,
        date: '2025-01-18',
        validUntil: '2025-02-18',
        customer: {
            name: 'Global Manufacturing Ltd',
            id: 'LEAD-045',
            contact: 'Sarah Smith',
            email: 'sarah@globalmfg.com',
        },
        items: [
            { description: 'CNC Machine Model X5', quantity: 1, rate: 1200000, amount: 1200000 },
            { description: 'Annual Maintenance Contract', quantity: 1, rate: 50000, amount: 50000 },
        ],
        subtotal: 1250000,
        tax: 225000,
        total: 1475000,
        status: 'Sent',
        probability: 'High (80%)',
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
                        <h1 className="text-3xl font-bold">Quotation {quote.number}</h1>
                        <Badge className="bg-blue-600">{quote.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        For: {quote.customer.name} | Valid Until: {quote.validUntil}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" />
                        Mark Accepted
                    </Button>
                    <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Quote Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quotation Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Customer Info */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-2">Prepared For:</h3>
                                <p className="font-medium">{quote.customer.name}</p>
                                <p className="text-sm text-gray-600">Contact: {quote.customer.contact}</p>
                                <p className="text-sm text-gray-600">Email: {quote.customer.email}</p>
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
                                    {quote.items.map((item, idx) => (
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
                                        <span className="font-semibold">₹{quote.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tax (18%):</span>
                                        <span className="font-semibold">₹{quote.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-blue-600">₹{quote.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Probability</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                    <p className="text-sm font-medium text-green-600">{quote.probability}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                                    <p className="font-medium">{quote.validUntil}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Convert to Sales Order
                            </Button>
                            <Button className="w-full" variant="outline">
                                Revise Quotation
                            </Button>
                            <Button className="w-full hover:bg-red-50 text-red-600 border-red-200" variant="outline">
                                Mark as Lost
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
