'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Filter, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DiscrepanciesPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Log Discrepancies</h1>
                        <p className="text-sm text-gray-500">Step 2.3: Record mismatches for client clarification</p>
                    </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Log New Issue
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Active Issues</CardTitle>
                            <CardDescription>Track resolution of identified discrepancies</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { id: 'DIS-001', title: 'Tall Unit Quantity Mismatch', priority: 'High', status: 'Open', date: '2025-01-20' },
                                { id: 'DIS-002', title: 'Sink Position Conflict', priority: 'Medium', status: 'In Review', date: '2025-01-19' },
                                { id: 'DIS-003', title: 'Material Finish Unavailable', priority: 'Low', status: 'Resolved', date: '2025-01-18' },
                            ].map((issue, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full ${issue.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            <AlertOctagon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{issue.title}</h4>
                                            <p className="text-xs text-gray-500">ID: {issue.id} • Reported: {issue.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === 'Open' ? 'bg-red-100 text-red-700' :
                                                issue.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {issue.status}
                                        </span>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
