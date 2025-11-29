'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function ExpenseAnalysisReport() {
    const router = useRouter();
    const expenses = [
        { id: 'EXP-CAT-001', category: 'Raw Materials', amount: 2500000, budget: 2400000, variance: 100000 },
        { id: 'EXP-CAT-002', category: 'Salaries & Wages', amount: 1800000, budget: 1800000, variance: 0 },
        { id: 'EXP-CAT-003', category: 'Utilities', amount: 450000, budget: 400000, variance: 50000 },
        { id: 'EXP-CAT-004', category: 'Rent', amount: 300000, budget: 300000, variance: 0 },
        { id: 'EXP-CAT-005', category: 'Marketing', amount: 250000, budget: 300000, variance: -50000 },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Expense Analysis</h1>
                    <p className="text-gray-600">Categorized expense tracking and trends</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actual Spend</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Budget</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Variance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {expenses.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/reports/finance/expense-analysis/details?category=${encodeURIComponent(item.category)}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.category}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{item.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-500">₹{item.budget.toLocaleString()}</td>
                                    <td className={`px-4 py-3 text-sm text-right font-medium ${item.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.variance > 0 ? '+' : ''}₹{item.variance.toLocaleString()}
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
