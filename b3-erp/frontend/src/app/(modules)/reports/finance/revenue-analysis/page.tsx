'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function RevenueAnalysisReport() {
    const router = useRouter();
    const revenueStreams = [
        { id: 'REV-001', product: 'Industrial Pumps', category: 'Machinery', revenue: 1200000, growth: 15 },
        { id: 'REV-002', product: 'Conveyor Belts', category: 'Components', revenue: 850000, growth: 8 },
        { id: 'REV-003', product: 'Maintenance Services', category: 'Services', revenue: 450000, growth: 22 },
        { id: 'REV-004', product: 'Spare Parts', category: 'Components', revenue: 320000, growth: 5 },
        { id: 'REV-005', product: 'Consulting', category: 'Services', revenue: 180000, growth: 12 },
    ];

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Revenue Analysis</h1>
                    <p className="text-gray-600">Detailed breakdown of revenue by product/service</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Revenue by Product Line</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product/Service</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">YoY Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {revenueStreams.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/reports/finance/revenue-analysis/details?product=${encodeURIComponent(item.product)}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.product}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">₹{item.revenue.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm text-right text-green-600">+{item.growth}%</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
