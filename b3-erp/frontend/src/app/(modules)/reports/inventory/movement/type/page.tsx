'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MovementTypeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const title = type ? `Movement History: ${type}` : 'All Movement History';

    const movements = [
        { id: 'MVT-001', date: '2025-01-20', item: 'Steel Sheet 2mm', type: 'Receipt', quantity: 500, from: 'Vendor', to: 'Warehouse A' },
        { id: 'MVT-002', date: '2025-01-21', item: 'Bolts M6', type: 'Issue', quantity: 200, from: 'Warehouse B', to: 'Assembly Line 1' },
        { id: 'MVT-003', date: '2025-01-22', item: 'Aluminum Rod 10mm', type: 'Transfer', quantity: 100, from: 'Warehouse A', to: 'Warehouse B' },
        { id: 'MVT-004', date: '2025-01-23', item: 'Paint - Blue', type: 'Issue', quantity: 50, from: 'Warehouse B', to: 'Paint Shop' },
        { id: 'MVT-005', date: '2025-01-24', item: 'Gearbox Assembly', type: 'Receipt', quantity: 10, from: 'Production', to: 'Warehouse A' },
    ];

    const filteredMovements = type
        ? movements.filter(m => m.type === type)
        : movements;

    return (
        <ReportDetailPage
            title={title}
            description="Detailed log of inventory movements"
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'Inventory', href: '/reports' },
                { label: 'Stock Movement', href: '/reports/inventory/movement' },
                { label: 'History' }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Movement Log</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From / To</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMovements.map((m) => (
                                <ClickableTableRow
                                    key={m.id}
                                    onClick={() => router.push(`/inventory/movements/view/${m.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{m.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.item}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${m.type === 'Receipt' ? 'bg-green-100 text-green-800' :
                                                m.type === 'Issue' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {m.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                        {m.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {m.from} → {m.to}
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

export default function MovementTypePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MovementTypeContent />
        </Suspense>
    );
}
