'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function BudgetVsActualReport() {
    const router = useRouter();
    const budgetItems = [
        { id: 'BGT-001', category: 'Sales Revenue', budget: 5000000, actual: 4800000, variance: -200000, percent: -4 },
        { id: 'BGT-002', category: 'Cost of Goods Sold', budget: 3000000, actual: 2800000, variance: 200000, percent: 6.7 },
        { id: 'BGT-003', category: 'Operating Expenses', budget: 1500000, actual: 1600000, variance: -100000, percent: -6.7 },
        { id: 'BGT-004', category: 'Marketing', budget: 500000, actual: 450000, variance: 50000, percent: 10 },
        { id: 'BGT-005', category: 'R&D', budget: 800000, actual: 800000, variance: 0, percent: 0 },
    ];

    return (
        <div className="w-full p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Budget vs Actual</h1>
                    <p className="text-gray-600">Compare actual performance against budget</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Budget Variance Analysis</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Budget</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actual</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Variance</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">%</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {budgetItems.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/reports/finance/budget-vs-actual/variance?category=${encodeURIComponent(item.category)}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.category}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-500">₹{item.budget.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{item.actual.toLocaleString()}</td>
                                    <td className={`px-4 py-3 text-sm text-right font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.variance > 0 ? '+' : ''}₹{item.variance.toLocaleString()}
                                    </td>
                                    <td className={`px-4 py-3 text-sm text-right ${item.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.percent > 0 ? '+' : ''}{item.percent}%
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
