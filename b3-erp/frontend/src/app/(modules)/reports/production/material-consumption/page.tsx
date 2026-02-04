'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Package, AlertCircle } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function MaterialConsumptionReport() {
    const router = useRouter();

    const data = {
        totalCost: 450000,
        variance: 12000,
        topMaterial: 'Steel Sheet 2mm',
        wastage: 2.5,
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Material Consumption</h1>
                    <p className="text-gray-600">Track material usage and variance</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Material Cost"
                    value={`₹${(data.totalCost / 1000).toFixed(0)}K`}
                    color="blue"
                    onClick={() => router.push('/reports/production/material-consumption/wo')}
                />
                <ClickableKPICard
                    title="Cost Variance"
                    value={`₹${(data.variance / 1000).toFixed(1)}K`}
                    color="red"
                    description="Click for breakdown"
                    onClick={() => router.push('/reports/production/material-consumption/material')}
                />
                <ClickableKPICard
                    title="Top Material"
                    value="Steel Sheet"
                    color="purple"
                    onClick={() => router.push('/inventory/items/MAT-001')}
                />
                <ClickableKPICard
                    title="Wastage %"
                    value={`${data.wastage}%`}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/production/material-consumption/material')}>
                    <CardHeader><CardTitle>Material Breakdown</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <Package className="w-8 h-8 text-blue-500 mb-2" />
                                <p className="text-blue-700 font-medium">View Consumption by Material</p>
                                <p className="text-sm text-blue-600">Click to analyze usage</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/production/material-consumption/wo')}>
                    <CardHeader><CardTitle>Work Order Analysis</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="text-center">
                                <AlertCircle className="w-8 h-8 text-gray-500 mb-2" />
                                <p className="text-gray-700 font-medium">View Cost by Work Order</p>
                                <p className="text-sm text-gray-600">Click to identify high variance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
