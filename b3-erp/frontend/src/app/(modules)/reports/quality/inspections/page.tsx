'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';
import ClickableKPICard from '@/components/reports/ClickableKPICard';
import ClickableTableRow from '@/components/reports/ClickableTableRow';

export default function InspectionResultsReport() {
    const router = useRouter();
    const data = {
        totalInspections: 186,
        passed: 176,
        failed: 10,
        passRate: 94.6,
        byType: [
            { type: 'Incoming', total: 54, passed: 51, failed: 3, rate: 94.4 },
            { type: 'In-Process', total: 76, passed: 73, failed: 3, rate: 96.1 },
            { type: 'Final', total: 42, passed: 39, failed: 3, rate: 92.9 },
            { type: 'Audit', total: 14, passed: 13, failed: 1, rate: 92.9 },
        ],
    };

    return (
        <div className="w-full p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Inspection Results Report</h1>
                    <p className="text-gray-600">Quality inspection outcomes</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <ClickableKPICard
                    title="Total Inspections"
                    value={data.totalInspections.toString()}
                    icon={ClipboardCheck}
                    color="blue"
                    onClick={() => console.log('All inspections')}
                />
                <ClickableKPICard
                    title="Passed"
                    value={data.passed.toString()}
                    icon={CheckCircle}
                    color="green"
                    onClick={() => console.log('Passed inspections')}
                />
                <ClickableKPICard
                    title="Failed"
                    value={data.failed.toString()}
                    icon={XCircle}
                    color="red"
                    onClick={() => console.log('Failed inspections')}
                />
                <ClickableKPICard
                    title="Pass Rate"
                    value={`${data.passRate}%`}
                    icon={CheckCircle}
                    color="green"
                    trend="+0.5%"
                    trendUp={true}
                    onClick={() => console.log('Pass rate trend')}
                />
            </div>

            <Card>
                <CardHeader><CardTitle>Results by Inspection Type</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Total</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Passed</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Failed</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Pass Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data.byType.map((type, idx) => (
                                <ClickableTableRow
                                    key={idx}
                                    basePath="/reports/quality/inspections/type"
                                    queryParam="type"
                                    id={type.type}
                                >
                                    <td className="px-4 py-3 text-sm font-medium">{type.type}</td>
                                    <td className="px-4 py-3 text-center"><Badge variant="outline">{type.total}</Badge></td>
                                    <td className="px-4 py-3 text-center text-green-600 font-semibold">{type.passed}</td>
                                    <td className="px-4 py-3 text-center text-red-600 font-semibold">{type.failed}</td>
                                    <td className="px-4 py-3 text-center"><span className="font-semibold text-green-600">{type.rate}%</span></td>
                                </ClickableTableRow>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
