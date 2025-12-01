'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Ruler, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SiteMeasurementsPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Site Measurements</h1>
                        <p className="text-sm text-gray-500">Step 2.5: Capture actual dimensions via mobile app</p>
                    </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Measurements
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Wall Dimensions</CardTitle>
                            <CardDescription>Enter measured values (mm)</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm"><Plus className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: 'Wall A Length', placeholder: '3000' },
                            { label: 'Wall B Length', placeholder: '4500' },
                            { label: 'Ceiling Height', placeholder: '2800' },
                        ].map((field, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <label className="w-1/3 text-sm font-medium text-gray-700">{field.label}</label>
                                <Input placeholder={field.placeholder} className="flex-1" />
                                <span className="text-sm text-gray-500">mm</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Obstructions & Openings</CardTitle>
                        <CardDescription>Record doors, windows, pillars</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: 'Door Width', placeholder: '900' },
                            { label: 'Window Sill Height', placeholder: '900' },
                            { label: 'Beam Depth', placeholder: '450' },
                        ].map((field, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <label className="w-1/3 text-sm font-medium text-gray-700">{field.label}</label>
                                <Input placeholder={field.placeholder} className="flex-1" />
                                <span className="text-sm text-gray-500">mm</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
