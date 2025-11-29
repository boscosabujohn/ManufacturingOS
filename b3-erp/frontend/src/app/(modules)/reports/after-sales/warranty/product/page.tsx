'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportDetailPage } from '@/components/reports/ReportDetailPage';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function WarrantyProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'All';

    const claims = [
        { id: 'CLM-2025-001', product: 'Commercial Oven XL', serial: 'SN-8821', customer: 'Bakery Delights', issue: 'Heating Element Failure', value: 3500, status: 'Approved' },
        { id: 'CLM-2025-002', product: 'Refrigeration Unit', serial: 'SN-9912', customer: 'Fresh Foods Market', issue: 'Compressor Noise', value: 2800, status: 'Pending' },
        { id: 'CLM-2025-003', product: 'Industrial Mixer', serial: 'SN-7734', customer: 'Cake Factory', issue: 'Motor Burnout', value: 1200, status: 'Approved' },
        { id: 'CLM-2025-004', product: 'Commercial Oven XL', serial: 'SN-8825', customer: 'Pizza Palace', issue: 'Door Seal Leak', value: 450, status: 'Rejected' },
        { id: 'CLM-2025-005', product: 'Steel Frame', serial: 'SN-5521', customer: 'Construction Co', issue: 'Weld Fracture', value: 5000, status: 'Approved' },
    ];

    const filteredClaims = status === 'All'
        ? claims
        : claims.filter(c => c.status === status);

    return (
        <ReportDetailPage
            title={`Warranty Claims: ${status}`}
            description={`List of warranty claims with status: ${status}`}
            breadcrumbs={[
                { label: 'Reports', href: '/reports' },
                { label: 'After-Sales', href: '/reports' },
                { label: 'Warranty Claims', href: '/reports/after-sales/warranty' },
                { label: status }
            ]}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Claim List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClaims.map((claim) => (
                                <ClickableTableRow
                                    key={claim.id}
                                    onClick={() => router.push(`/after-sales/warranty-claims/${claim.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{claim.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>{claim.product}</div>
                                        <div className="text-xs text-gray-500">{claim.serial}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.issue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">${claim.value.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Badge variant={claim.status === 'Rejected' ? 'destructive' : claim.status === 'Approved' ? 'default' : 'secondary'}>
                                            {claim.status}
                                        </Badge>
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

export default function WarrantyProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WarrantyProductContent />
        </Suspense>
    );
}
