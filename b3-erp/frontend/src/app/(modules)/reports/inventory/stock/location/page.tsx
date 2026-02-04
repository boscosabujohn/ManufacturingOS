'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StockLocationContent() {
    const router = useRouter();

    const items = [
        { id: 'ITEM-001', name: 'Steel Sheet 2mm', location: 'Warehouse A - Zone 1', stock: 1000, unit: 'kg' },
        { id: 'ITEM-001', name: 'Steel Sheet 2mm', location: 'Production Floor', stock: 500, unit: 'kg' },
        { id: 'ITEM-003', name: 'Bolts M6', location: 'Warehouse B - Shelf 4', stock: 5000, unit: 'pcs' },
        { id: 'ITEM-005', name: 'Gearbox Assembly', location: 'Warehouse A - Zone 2', stock: 12, unit: 'pcs' },
    ];

    return (
        <ReportDetailPage
            title="Stock by Location"
            description="Detailed stock breakdown by warehouse location"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Inventory', href: '/reports' },
                { label: 'Stock Summary', href: '/reports/inventory/stock' },
                { label: 'Location' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Location Stock List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, idx) => (
                                <ClickableTableRow
                                    key={idx}
                                    onClick={() => router.push(`/inventory/items/${item.id}`)}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                                        {item.stock} {item.unit}
                                    </td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ReportDetailPage>
    );
}

export default function StockLocationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StockLocationContent />
        </Suspense>
    );
}
