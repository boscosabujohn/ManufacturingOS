'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowRightLeft, Truck, History } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function StockMovementReport() {
    const router = useRouter();

    const data = {
        totalMovements: 145,
        transfers: 45,
        receipts: 62,
        issues: 38,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Stock Movement</h1>
                    <p className="text-gray-600">Track transfers, receipts, and issues</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Movements"
                    value={data.totalMovements.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/inventory/movement/type')}
                />
                <ClickableKPICard
                    title="Transfers"
                    value={data.transfers.toString()}
                    color="purple"
                    onClick={() => router.push('/reports/inventory/movement/type?type=Transfer')}
                />
                <ClickableKPICard
                    title="Receipts"
                    value={data.receipts.toString()}
                    color="green"
                    onClick={() => router.push('/reports/inventory/movement/type?type=Receipt')}
                />
                <ClickableKPICard
                    title="Issues"
                    value={data.issues.toString()}
                    color="orange"
                    onClick={() => router.push('/reports/inventory/movement/type?type=Issue')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/inventory/movement/type')}>
                    <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <History className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-700 font-medium">View Movement History</p>
                                <p className="text-sm text-blue-600">Click to see full log</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/inventory/movement/type?type=Transfer')}>
                    <CardHeader><CardTitle>Transfer Analysis</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-purple-50 rounded-lg border border-dashed border-purple-200">
                            <div className="text-center">
                                <ArrowRightLeft className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <p className="text-purple-700 font-medium">Analyze Transfers</p>
                                <p className="text-sm text-purple-600">Click to view inter-warehouse moves</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
