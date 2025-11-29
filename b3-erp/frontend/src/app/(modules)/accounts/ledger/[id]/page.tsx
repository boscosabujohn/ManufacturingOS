'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function AccountLedgerPage() {
    const params = useParams();
    const router = useRouter();
    const accountId = params.id as string;

    // Mock ledger data
    const account = {
        id: accountId,
        code: '1000',
        name: 'Cash and Bank',
        type: 'Asset',
        balance: 2500000,
    };

    const transactions = [
        { id: 'JE-2025-045', date: '2025-01-22', description: 'Customer Payment - ABC Ltd', debit: 150000, credit: 0, balance: 2500000 },
        { id: 'JE-2025-042', date: '2025-01-20', description: 'Vendor Payment - Steel Suppliers', debit: 0, credit: 280000, balance: 2350000 },
        { id: 'JE-2025-038', date: '2025-01-18', description: 'Utility Bill Payment', debit: 0, credit: 12000, balance: 2630000 },
    ];

    return (
        <div className="container mx-auto p-6">
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
                    <h1 className="text-3xl font-bold">{account.code} - {account.name}</h1>
                    <p className="text-gray-600">Account Ledger View</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="text-2xl font-bold text-blue-600">₹{account.balance.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Total Debits (This Month)</p>
                        <p className="text-2xl font-bold text-green-600">₹150,000</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">Total Credits (This Month)</p>
                        <p className="text-2xl font-bold text-red-600">₹292,000</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ref #</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Debit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Credit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {transactions.map((tx) => (
                                <ClickableTableRow
                                    key={tx.id}
                                    onClick={() => router.push(`/accounts/journal/${tx.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm">{tx.date}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{tx.id}</td>
                                    <td className="px-4 py-3 text-sm">{tx.description}</td>
                                    <td className="px-4 py-3 text-sm text-right text-green-600">
                                        {tx.debit > 0 ? `₹${tx.debit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-red-600">
                                        {tx.credit > 0 ? `₹${tx.credit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold">
                                        ₹{tx.balance.toLocaleString()}
                                    </td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
