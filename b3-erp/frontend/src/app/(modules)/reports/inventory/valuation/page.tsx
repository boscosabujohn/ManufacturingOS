'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, PieChart, TrendingUp } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function InventoryValuationReport() {
    const router = useRouter();

    const data = {
        totalValue: 8500000,
        rawMaterials: 2500000,
        wip: 1800000,
        finishedGoods: 3200000,
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Inventory Valuation</h1>
                    <p className="text-gray-600">Asset value analysis by category</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Inventory Value"
                    value={`₹${(data.totalValue / 100000).toFixed(1)}L`}
                    color="blue"
                    onClick={() => router.push('/reports/inventory/valuation/category')}
                />
                <ClickableKPICard
                    title="Raw Materials"
                    value={`₹${(data.rawMaterials / 100000).toFixed(1)}L`}
                    color="green"
                    onClick={() => router.push('/reports/inventory/stock/category?id=CAT-RAW')}
                />
                <ClickableKPICard
                    title="Work in Progress"
                    value={`₹${(data.wip / 100000).toFixed(1)}L`}
                    color="orange"
                    onClick={() => router.push('/reports/inventory/stock/category?id=CAT-WIP')}
                />
                <ClickableKPICard
                    title="Finished Goods"
                    value={`₹${(data.finishedGoods / 100000).toFixed(1)}L`}
                    color="purple"
                    onClick={() => router.push('/reports/inventory/stock/category?id=CAT-FG')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/inventory/valuation/category')}>
                    <CardHeader><CardTitle>Valuation Breakdown</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <PieChart className="w-8 h-8 text-blue-500 mb-2" />
                                <p className="text-blue-700 font-medium">View Valuation by Category</p>
                                <p className="text-sm text-blue-600">Click to analyze asset distribution</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/inventory/movement/history')}>
                    <CardHeader><CardTitle>Value Movement</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-green-50 rounded-lg border border-dashed border-green-200">
                            <div className="text-center">
                                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                                <p className="text-green-700 font-medium">View Movement History</p>
                                <p className="text-sm text-green-600">Click to track value changes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
