'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DrawingVerificationPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drawing Verification</h1>
                    <p className="text-sm text-gray-500">Step 2.1: Verify layout drawings against BOQ and 3D models</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Verification Checklist</CardTitle>
                        <CardDescription>Ensure all criteria are met before proceeding</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {['Dimensions match site survey', 'Structural elements aligned', 'MEP points coordinated', 'Material specifications correct'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="h-5 w-5 rounded border-2 border-gray-300"></div>
                                <span className="text-sm text-gray-700">{item}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status Overview</CardTitle>
                        <CardDescription>Current verification status</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="p-4 bg-yellow-100 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Pending Verification</h3>
                            <p className="text-sm text-gray-500 mt-1">3 drawings require review</p>
                        </div>
                        <Button className="w-full max-w-xs">Start Verification</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
