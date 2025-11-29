'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, PieChart, Users } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function LeadAnalysisReport() {
    const router = useRouter();

    const data = {
        totalLeads: 450,
        newLeads: 45,
        qualified: 120,
        conversionRate: 15,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Lead Analysis</h1>
                    <p className="text-gray-600">Track lead generation and conversion</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Leads"
                    value={data.totalLeads.toString()}
                    color="blue"
                    onClick={() => router.push('/reports/crm/leads/status?status=All')}
                />
                <ClickableKPICard
                    title="New Leads"
                    value={data.newLeads.toString()}
                    color="green"
                    description="This month"
                    onClick={() => router.push('/reports/crm/leads/status?status=New')}
                />
                <ClickableKPICard
                    title="Qualified"
                    value={data.qualified.toString()}
                    color="purple"
                    onClick={() => router.push('/reports/crm/leads/status?status=Qualified')}
                />
                <ClickableKPICard
                    title="Conversion Rate"
                    value={`${data.conversionRate}%`}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/leads/source')}>
                    <CardHeader><CardTitle>Leads by Source</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg border border-dashed border-blue-200">
                            <div className="text-center">
                                <PieChart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-700 font-medium">View Source Analysis</p>
                                <p className="text-sm text-blue-600">Click to analyze channels</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/reports/crm/leads/status?status=All')}>
                    <CardHeader><CardTitle>Lead Status Distribution</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 bg-purple-50 rounded-lg border border-dashed border-purple-200">
                            <div className="text-center">
                                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <p className="text-purple-700 font-medium">View Status Breakdown</p>
                                <p className="text-sm text-purple-600">Click to see all leads</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
