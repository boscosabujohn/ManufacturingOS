'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function AgingBucketContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bucket = searchParams.get('bucket') || 'All';

    const items = [
        { id: 'ITEM-006', name: 'Brake Pads Model X', stock: 450, value: 22500, age: 245, unit: 'pcs' },
        { id: 'ITEM-007', name: 'Filter Cartridges', stock: 350, value: 17500, age: 198, unit: 'pcs' },
        { id: 'ITEM-008', name: 'Bearing Sets Obsolete', stock: 125, value: 12500, age: 420, unit: 'pcs' },
        { id: 'ITEM-009', name: 'Legacy Components', stock: 85, value: 8500, age: 385, unit: 'pcs' },
    ];

    return (
        <ReportDetailPage
            title={`Aging Bucket: ${bucket}`}
            description={`Inventory items in the ${bucket} aging category`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Inventory', href: '/reports' },
                { label: 'Stock Aging', href: '/reports/inventory/aging' },
                { label: bucket }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Items in {bucket}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Age (Days)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/inventory/items/${item.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                        {item.stock} {item.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                        ${item.value.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        {item.age}
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

export default function AgingBucketPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AgingBucketContent />
        </Suspense>
    );
}
