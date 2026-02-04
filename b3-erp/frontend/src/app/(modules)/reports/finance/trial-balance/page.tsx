'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function TrialBalanceReport() {
    const router = useRouter();
    const accounts = [
        { code: '1000', name: 'Cash and Bank', debit: 2500000, credit: 0 },
        { code: '1100', name: 'Accounts Receivable', debit: 2100000, credit: 0 },
        { code: '1200', name: 'Inventory', debit: 4500000, credit: 0 },
        { code: '2000', name: 'Accounts Payable', debit: 0, credit: 1800000 },
        { code: '3000', name: 'Capital', debit: 0, credit: 5000000 },
        { code: '4000', name: 'Sales Revenue', debit: 0, credit: 3500000 },
        { code: '5000', name: 'Cost of Goods Sold', debit: 2000000, credit: 0 },
        { code: '6000', name: 'Operating Expenses', debit: 1200000, credit: 0 },
    ];

    const totalDebit = accounts.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = accounts.reduce((sum, acc) => sum + acc.credit, 0);

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Trial Balance</h1>
                    <p className="text-gray-600">Summary of all ledger account balances</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Trial Balance - January 2025</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Account Name</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Debit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {accounts.map((acc) => (
                                <ClickableTableRow
                                    key={acc.code}
                                    onClick={() => router.push(`/reports/finance/trial-balance/ledger?code=${acc.code}&name=${encodeURIComponent(acc.name)}`)}
                                >
                                    <td className="px-4 py-3 text-sm">{acc.code}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{acc.name}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        {acc.debit > 0 ? `₹${acc.debit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        {acc.credit > 0 ? `₹${acc.credit.toLocaleString()}` : '-'}
                                    </td>
                                </ClickableTableRow>
                            ))}
                            <tr className="bg-blue-50 font-bold">
                                <td className="px-4 py-3" colSpan={2}>Total</td>
                                <td className="px-4 py-3 text-right text-blue-600">₹{totalDebit.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-green-600">₹{totalCredit.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
