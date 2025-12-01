'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckSquare, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BOQCheckPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">BOQ Cross-Check</h1>
                    <p className="text-sm text-gray-500">Step 2.2: Verify BOQ quantities match drawing specifications</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>BOQ Items Review</CardTitle>
                        <CardDescription>Compare listed items with drawing callouts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-gray-700">Item Description</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">BOQ Qty</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Drawing Qty</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {[
                                        { name: 'Base Cabinet 600mm', boq: 12, dwg: 12, status: 'Match' },
                                        { name: 'Wall Cabinet 900mm', boq: 8, dwg: 8, status: 'Match' },
                                        { name: 'Tall Unit 2100mm', boq: 2, dwg: 3, status: 'Mismatch' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-900">{row.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{row.boq}</td>
                                            <td className="px-4 py-3 text-gray-600">{row.dwg}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Match' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                        <CardDescription>Verification results</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-red-900">Discrepancy Detected</h4>
                                <p className="text-xs text-red-700 mt-1">1 item quantity mismatch found. Please resolve before approval.</p>
                            </div>
                        </div>
                        <Button className="w-full" variant="outline">Generate Report</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
