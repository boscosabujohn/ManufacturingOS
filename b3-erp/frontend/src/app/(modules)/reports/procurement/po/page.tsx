'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function PurchaseOrderReport() {
    const router = useRouter();

    const data = {
        totalPO: 125,
        issued: 45,
        received: 72,
        overdue: 8,
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Purchase Orders</h1>
                    <p className="text-gray-600">Track procurement status and deliveries</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total POs"
                    value={data.totalPO.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/procurement/po/status?status=All')}
                />
                <ClickableKPICard
                    title="Issued"
                    value={data.issued.toString()}
                    color="orange"
                    onClick={() => router.push('/reports/procurement/po/status?status=Issued')}
                />
                <ClickableKPICard
                    title="Received"
                    value={data.received.toString()}
                    color="green"
                    onClick={() => router.push('/reports/procurement/po/status?status=Received')}
                />
                <ClickableKPICard
                    title="Overdue"
                    value={data.overdue.toString()}
                    color="red"
                    onClick={() => router.push('/reports/procurement/po/status?status=Overdue')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/procurement/po/status?status=Issued')}>
                    <CardHeader><CardTitle>Pending Deliveries</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-orange-50 rounded-lg border border-dashed border-orange-200">
                            <div className="text-center">
                                <Clock className="w-8 h-8 text-orange-500 mb-2" />
                                <p className="text-orange-700 font-medium">45 Pending Orders</p>
                                <p className="text-sm text-orange-600">Click to track status</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/procurement/po/status?status=Received')}>
                    <CardHeader><CardTitle>Completed Orders</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-green-50 rounded-lg border border-dashed border-green-200">
                            <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                <p className="text-green-700 font-medium">72 Received Orders</p>
                                <p className="text-sm text-green-600">Click to view history</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
