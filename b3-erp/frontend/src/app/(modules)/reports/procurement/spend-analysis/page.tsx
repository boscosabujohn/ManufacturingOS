'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, PieChart, DollarSign } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function SpendAnalysisReport() {
    const router = useRouter();

    const data = {
        totalSpend: 3200000,
        budgetUtilization: 85,
        topCategory: 'Raw Materials',
        savings: 150000,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Spend Analysis</h1>
                    <p className="text-gray-600">Analyze procurement costs and budget</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Spend"
                    value={`₹${(data.totalSpend / 100000).toFixed(1)}L`}
                    color="blue"
                    onClick={() => router.push('/reports/procurement/spend-analysis/category')}
                />
                <ClickableKPICard
                    title="Budget Used"
                    value={`${data.budgetUtilization}%`}
                    color={data.budgetUtilization > 90 ? 'red' : 'green'}
                />
                <ClickableKPICard
                    title="Top Category"
                    value="Raw Materials"
                    color="purple"
                    onClick={() => router.push('/reports/procurement/spend-analysis/category')}
                />
                <ClickableKPICard
                    title="Savings"
                    value={`₹${(data.savings / 1000).toFixed(0)}K`}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/procurement/spend-analysis/category')}>
                    <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <PieChart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-700 font-medium">View Spend by Category</p>
                                <p className="text-sm text-blue-600">Click to analyze distribution</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/procurement/po/status?status=All')}>
                    <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="text-center">
                                <DollarSign className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-gray-700 font-medium">View All Transactions</p>
                                <p className="text-sm text-gray-600">Click to see PO list</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
