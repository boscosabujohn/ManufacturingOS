'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Shield } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';
import { ClickableTableRow } from '@/components/reports/ClickableTableRow';

export default function WarrantyClaimsReport() {
    const router = useRouter();
    const data = {
        totalClaims: 124,
        approved: 98,
        rejected: 12,
        pending: 14,
        claimValue: 285000,
        byProduct: [
            { id: 'PROD-001', product: 'Commercial Ovens', claims: 42, approved: 35, value: 125000 },
            { id: 'PROD-002', product: 'Refrigeration Units', claims: 38, approved: 30, value: 98000 },
            { id: 'PROD-003', product: 'Industrial Mixers', claims: 28, approved: 22, value: 45000 },
            { id: 'PROD-004', product: 'Steel Frames', claims: 16, approved: 11, value: 17000 },
        ],
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Warranty Claims Report</h1>
                    <p className="text-gray-600">Product warranty tracking</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Claims"
                    value={data.totalClaims.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/after-sales/warranty/product')}
                />
                <ClickableKPICard
                    title="Approved"
                    value={data.approved.toString()}
                    color="green"
                    onClick={() => router.push('/reports/after-sales/warranty/product?status=Approved')}
                />
                <ClickableKPICard
                    title="Rejected"
                    value={data.rejected.toString()}
                    color="red"
                    onClick={() => router.push('/reports/after-sales/warranty/product?status=Rejected')}
                />
                <ClickableKPICard
                    title="Pending"
                    value={data.pending.toString()}
                    color="orange"
                    onClick={() => router.push('/reports/after-sales/warranty/product?status=Pending')}
                />
                <ClickableKPICard
                    title="Claim Value"
                    value={`$${(data.claimValue / 1000).toFixed(0)}K`}
                    color="purple"
                />
            </div>

            <Card>
                <CardHeader><CardTitle>Claims by Product</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Total Claims</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Approved</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Claim Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data.byProduct.map((prod) => (
                                <ClickableTableRow
                                    key={prod.id}
                                    onClick={() => router.push(`/after-sales/warranty-claims/${prod.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{prod.product}</td>
                                    <td className="px-4 py-3 text-center"><Badge variant="outline">{prod.claims}</Badge></td>
                                    <td className="px-4 py-3 text-center text-green-600 font-semibold">{prod.approved}</td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold">${(prod.value / 1000).toFixed(0)}K</td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
