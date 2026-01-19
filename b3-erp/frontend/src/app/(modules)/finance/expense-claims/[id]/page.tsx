'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ExpenseClaimDetailPage() {
    const params = useParams();
    const router = useRouter();
    const claimId = params.id as string;

    // Mock expense claim data
    const claim = {
        id: claimId,
        number: claimId,
        date: '2025-01-22',
        employee: {
            name: 'Rajesh Kumar',
            id: 'EMP-1045',
            department: 'Sales',
        },
        items: [
            { description: 'Client Meeting - Lunch', category: 'Meals & Entertainment', date: '2025-01-20', amount: 2500 },
            { description: 'Travel - Chennai to Mumbai', category: 'Transportation', date: '2025-01-19', amount: 8500 },
            { description: 'Hotel Stay - 2 nights', category: 'Accommodation', date: '2025-01-19', amount: 12000 },
            { description: 'Local Transport - Taxi', category: 'Transportation', date: '2025-01-20', amount: 1200 },
        ],
        subtotal: 24200,
        status: 'Approved',
        approvedBy: 'Priya Singh (Manager)',
        approvedDate: '2025-01-23',
        reimbursedDate: '2025-01-25',
    };

    const getStatusBadge = () => {
        switch (claim.status) {
            case 'Approved':
                return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'Rejected':
                return <Badge className="bg-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            case 'Pending':
                return <Badge className="bg-orange-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            default:
                return <Badge variant="outline">{claim.status}</Badge>;
        }
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
                        <h1 className="text-3xl font-bold">Expense Claim {claim.number}</h1>
                        {getStatusBadge()}
                    </div>
                    <p className="text-gray-600 mt-1">
                        Submitted: {claim.date} | Employee: {claim.employee.name}
                    </p>
                </div>

                <div className="flex gap-2">
                    {claim.status === 'Pending' && (
                        <>
                            <Button className="bg-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button variant="destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                        </>
                    )}
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Claim Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Claim Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Employee Info */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-2">Employee Information:</h3>
                                <p className="font-medium">{claim.employee.name}</p>
                                <p className="text-sm text-gray-600">ID: {claim.employee.id}</p>
                                <p className="text-sm text-gray-600">Department: {claim.employee.department}</p>
                            </div>

                            {/* Expense Items */}
                            <table className="w-full mb-6">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {claim.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 text-sm">{item.date}</td>
                                            <td className="px-4 py-3 text-sm">{item.description}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge variant="outline">{item.category}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-semibold">₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Total */}
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold">Total Amount:</span>
                                        <span className="text-lg font-bold text-green-600">₹{claim.subtotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Approval Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Approval Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {claim.status === 'Approved' && (
                                <>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="font-semibold text-green-600">Approved</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approved By:</span>
                                            <span className="font-medium">{claim.approvedBy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approved Date:</span>
                                            <span className="font-medium">{claim.approvedDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Reimbursed:</span>
                                            <span className="font-medium text-green-600">{claim.reimbursedDate}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Claim Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Claim Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Items:</span>
                                <span className="font-medium">{claim.items.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Submitted On:</span>
                                <span className="font-medium">{claim.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium text-green-600">₹{claim.subtotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    {claim.status === 'Approved' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" variant="outline">
                                    View Receipt Attachments
                                </Button>
                                <Button className="w-full" variant="outline">
                                    Download Report
                                </Button>
                                <Button className="w-full" variant="outline">
                                    Email to Employee
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
