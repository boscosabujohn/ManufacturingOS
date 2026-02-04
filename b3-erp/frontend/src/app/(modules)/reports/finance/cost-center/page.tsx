'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function CostCenterReport() {
    const router = useRouter();
    const costCenters = [
        { id: 'CC-001', name: 'Manufacturing Plant A', manager: 'Robert Chen', budget: 12000000, actual: 11500000, variance: 500000 },
        { id: 'CC-002', name: 'Sales & Marketing', manager: 'Sarah Williams', budget: 4500000, actual: 4800000, variance: -300000 },
        { id: 'CC-003', name: 'Research & Development', manager: 'Dr. Emily Wong', budget: 6000000, actual: 5800000, variance: 200000 },
        { id: 'CC-004', name: 'Corporate HQ', manager: 'David Miller', budget: 3000000, actual: 2900000, variance: 100000 },
        { id: 'CC-005', name: 'Logistics & Distribution', manager: 'Michael Brown', budget: 2500000, actual: 2700000, variance: -200000 },
    ];

    return (
        <div className="w-full p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Cost Center Analysis</h1>
                    <p className="text-gray-600">Department-wise cost allocation and analysis</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Cost Center Performance</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cost Center</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Manager</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Budget</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actual</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Variance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {costCenters.map((cc) => (
                                <ClickableTableRow
                                    key={cc.id}
                                    onClick={() => router.push(`/reports/finance/cost-center/details?id=${cc.id}&name=${encodeURIComponent(cc.name)}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{cc.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{cc.manager}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-500">₹{cc.budget.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{cc.actual.toLocaleString()}</td>
                                    <td className={`px-4 py-3 text-sm text-right font-medium ${cc.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {cc.variance > 0 ? '+' : ''}₹{cc.variance.toLocaleString()}
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
