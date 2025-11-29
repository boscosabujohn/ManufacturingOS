'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function TaxSummaryReport() {
    const router = useRouter();
    const taxes = [
        { code: 'GST-IN-18', name: 'Input GST @ 18%', collected: 0, paid: 450000, net: -450000 },
        { code: 'GST-OUT-18', name: 'Output GST @ 18%', collected: 630000, paid: 0, net: 630000 },
        { code: 'GST-IN-12', name: 'Input GST @ 12%', collected: 0, paid: 120000, net: -120000 },
        { code: 'GST-OUT-12', name: 'Output GST @ 12%', collected: 180000, paid: 0, net: 180000 },
        { code: 'TDS-PAY', name: 'TDS Payable', collected: 50000, paid: 0, net: 50000 },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Tax Summary</h1>
                    <p className="text-gray-600">GST/VAT collection and payment summary</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Tax Liability Summary</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tax Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Collected (Output)</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Paid (Input)</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Net Payable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {taxes.map((tax) => (
                                <ClickableTableRow
                                    key={tax.code}
                                    onClick={() => router.push(`/reports/finance/tax-summary/details?code=${tax.code}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{tax.code}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{tax.name}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{tax.collected.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{tax.paid.toLocaleString()}</td>
                                    <td className={`px-4 py-3 text-sm text-right font-bold ${tax.net > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ₹{Math.abs(tax.net).toLocaleString()} {tax.net > 0 ? 'Payable' : 'Credit'}
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
