'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react';

export default function JournalEntryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const journalId = params.id as string;

    // Mock journal entry data
    const journal = {
        id: journalId,
        number: journalId,
        date: '2025-01-22',
        reference: 'REF-2025-001',
        description: 'Monthly Depreciation Entry - January 2025',
        type: 'General Journal',
        status: 'Posted',
        postedBy: 'Finance Manager',
        postedDate: '2025-01-22',
        lines: [
            { account: '6000 - Depreciation Expense', description: 'Depreciation for Machinery', debit: 15000, credit: 0 },
            { account: '1500 - Accumulated Depreciation', description: 'Depreciation for Machinery', debit: 0, credit: 15000 },
        ],
        total: 15000,
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
                        <h1 className="text-3xl font-bold">Journal Entry {journal.number}</h1>
                        <Badge className="bg-green-600">{journal.status}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">
                        Date: {journal.date} | Ref: {journal.reference}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Journal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Main Entry Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entry Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                <p className="text-lg">{journal.description}</p>
                            </div>

                            {/* Lines Table */}
                            <table className="w-full mb-3 border rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Account</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Debit</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Credit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {journal.lines.map((line, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 text-sm font-medium">{line.account}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{line.description}</td>
                                            <td className="px-4 py-3 text-right text-sm">
                                                {line.debit > 0 ? `₹${line.debit.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm">
                                                {line.credit > 0 ? `₹${line.credit.toLocaleString()}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-bold">
                                        <td className="px-4 py-3" colSpan={2}>Total</td>
                                        <td className="px-4 py-3 text-right">₹{journal.total.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">₹{journal.total.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entry Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">{journal.type}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Posted By:</span>
                                <span className="font-medium">{journal.postedBy}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Posted Date:</span>
                                <span className="font-medium">{journal.postedDate}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Related Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                                <FileText className="w-4 h-4" />
                                No related documents attached
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
