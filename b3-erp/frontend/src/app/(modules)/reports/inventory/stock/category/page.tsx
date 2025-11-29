'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StockCategoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const title = status ? `Stock by Category (${status})` : 'Stock by Category';

    const items = [
        { id: 'ITEM-001', name: 'Steel Sheet 2mm', category: 'Raw Materials', stock: 1500, unit: 'kg', status: 'In Stock' },
        { id: 'ITEM-002', name: 'Aluminum Rod 10mm', category: 'Raw Materials', stock: 45, unit: 'kg', status: 'Low Stock' },
        { id: 'ITEM-003', name: 'Bolts M6', category: 'Consumables', stock: 5000, unit: 'pcs', status: 'In Stock' },
        { id: 'ITEM-004', name: 'Paint - Blue', category: 'Consumables', stock: 0, unit: 'ltr', status: 'Out of Stock' },
        { id: 'ITEM-005', name: 'Gearbox Assembly', category: 'Components', stock: 12, unit: 'pcs', status: 'Low Stock' },
    ];

    const filteredItems = status
        ? items.filter(item => {
            if (status === 'Low') return item.status === 'Low Stock';
            if (status === 'Critical') return item.status === 'Out of Stock';
            return true;
        })
        : items;

    return (
        <ReportDetailPage
            title={title}
            description="Detailed stock breakdown by category"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Inventory', href: '/reports' },
                { label: 'Stock Summary', href: '/reports/inventory/stock' },
                { label: 'Category' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Item List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <ClickableTableRow
                                    key={item.id}
                                    onClick={() => router.push(`/inventory/items/${item.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                        {item.stock} {item.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Low Stock' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {item.status}
                                        </span>
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

export default function StockCategoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StockCategoryContent />
        </Suspense>
    );
}
