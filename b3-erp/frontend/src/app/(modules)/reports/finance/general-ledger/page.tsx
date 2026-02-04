'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function GeneralLedgerReport() {
    const router = useRouter();
    const journalEntries = [
        { id: 'JRN-2025-001', date: '2025-01-01', description: 'Opening Balance', amount: 2000000, type: 'Opening' },
        { id: 'JRN-2025-015', date: '2025-01-05', description: 'Invoice #INV-2025-001', amount: 500000, type: 'Sales' },
        { id: 'JRN-2025-023', date: '2025-01-10', description: 'Payment Received', amount: 500000, type: 'Receipt' },
        { id: 'JRN-2025-045', date: '2025-01-15', description: 'Purchase of Goods', amount: 200000, type: 'Purchase' },
        { id: 'JRN-2025-067', date: '2025-01-20', description: 'Utility Bill Payment', amount: 50000, type: 'Expense' },
    ];

    return (
        <div className="w-full p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold mb-2">General Ledger</h1>
                    <p className="text-gray-600">Detailed transactions for all accounts</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Recent Journal Entries</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Journal ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {journalEntries.map((entry) => (
                                <ClickableTableRow
                                    key={entry.id}
                                    onClick={() => router.push(`/reports/finance/general-ledger/journal?id=${entry.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{entry.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{entry.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{entry.description}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{entry.type}</td>
                                    <td className="px-4 py-3 text-sm text-right font-medium">₹{entry.amount.toLocaleString()}</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
