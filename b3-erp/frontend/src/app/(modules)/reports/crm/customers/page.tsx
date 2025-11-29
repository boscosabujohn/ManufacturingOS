'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, UserPlus, Users } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function CustomerGrowthReport() {
    const router = useRouter();

    const data = {
        totalCustomers: 1250,
        newCustomers: 45,
        churnRate: 2.5,
        ltv: 15000,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Customer Growth</h1>
                    <p className="text-gray-600">Track acquisition and retention</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Customers"
                    value={data.totalCustomers.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/crm/customers/acquisition')}
                />
                <ClickableKPICard
                    title="New Customers"
                    value={data.newCustomers.toString()}
                    color="green"
                    description="This month"
                    onClick={() => router.push('/reports/crm/customers/acquisition')}
                />
                <ClickableKPICard
                    title="Churn Rate"
                    value={`${data.churnRate}%`}
                    color={data.churnRate > 5 ? 'red' : 'green'}
                />
                <ClickableKPICard
                    title="Avg LTV"
                    value={`$${(data.ltv / 1000).toFixed(1)}K`}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/customers/acquisition')}>
                    <CardHeader><CardTitle>Acquisition Trends</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <UserPlus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-700 font-medium">View Acquisition History</p>
                                <p className="text-sm text-blue-600">Click to see new customers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/customers/acquisition')}>
                    <CardHeader><CardTitle>Customer Segments</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-purple-50 rounded-lg border border-dashed border-purple-200">
                            <div className="text-center">
                                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <p className="text-purple-700 font-medium">View Segments</p>
                                <p className="text-sm text-purple-600">Click to analyze base</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
