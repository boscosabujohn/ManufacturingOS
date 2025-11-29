'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, User } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function PipelineAnalysisReport() {
    const router = useRouter();

    const data = {
        totalPipeline: 2500000,
        openDeals: 45,
        avgDealSize: 55000,
        winRate: 32,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Pipeline Analysis</h1>
                    <p className="text-gray-600">Track sales pipeline and forecast</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Pipeline"
                    value={`$${(data.totalPipeline / 1000000).toFixed(2)}M`}
                    color="blue"
                    onClick={() => router.push('/reports/crm/pipeline/stage')}
                />
                <ClickableKPICard
                    title="Open Deals"
                    value={data.openDeals.toString()}
                    color="orange"
                    onClick={() => router.push('/reports/crm/pipeline/stage')}
                />
                <ClickableKPICard
                    title="Avg Deal Size"
                    value={`$${(data.avgDealSize / 1000).toFixed(1)}K`}
                    color="green"
                />
                <ClickableKPICard
                    title="Win Rate"
                    value={`${data.winRate}%`}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/pipeline/stage')}>
                    <CardHeader><CardTitle>Pipeline by Stage</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-700 font-medium">View Stage Analysis</p>
                                <p className="text-sm text-blue-600">Click to see funnel</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/pipeline/owner')}>
                    <CardHeader><CardTitle>Pipeline by Owner</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-green-50 rounded-lg border border-dashed border-green-200">
                            <div className="text-center">
                                <User className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-green-700 font-medium">View Team Performance</p>
                                <p className="text-sm text-green-600">Click to analyze reps</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
