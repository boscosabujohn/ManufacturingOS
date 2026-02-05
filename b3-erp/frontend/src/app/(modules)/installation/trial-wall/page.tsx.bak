'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    LayoutGrid,
    CheckCircle2,
    Camera,
    Ruler
} from 'lucide-react';

interface TrialCheck {
    id: string;
    item: string;
    status: 'Pending' | 'Verified' | 'Adjustment Needed';
}

export default function TrialWallPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [checks, setChecks] = useState<TrialCheck[]>([
        { id: '1', item: 'Wall Panel Fitment', status: 'Pending' },
        { id: '2', item: 'Gap Consistency (3mm)', status: 'Pending' },
        { id: '3', item: 'Corner Joints', status: 'Pending' },
        { id: '4', item: 'Vertical Plumb', status: 'Pending' },
    ]);

    const handleStatusChange = (id: string, status: TrialCheck['status']) => {
        setChecks(checks.map(c =>
            c.id === id ? { ...c, status } : c
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Trial Wall Verified',
            description: 'Trial assembly checks completed',
        });
        setTimeout(() => router.push('/installation/accessory-fix'), 1000);
    };

    const getStatusBadge = (status: TrialCheck['status']) => {
        const styles = {
            'Verified': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            'Adjustment Needed': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <LayoutGrid className="h-8 w-8 text-orange-600" />
                        8.5 Trial Wall
                    </h1>
                    <p className="text-muted-foreground">
                        Dry run assembly to verify fit and finish before final fixing.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/cabinet-align')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={checks.some(c => c.status === 'Pending')}
                    >
                        Next: Accessory Fix <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Trial Assembly Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {checks.map((check) => (
                                <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${check.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium">{check.item}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {check.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(check.id, 'Verified')}
                                                >
                                                    Pass
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(check.id, 'Adjustment Needed')}
                                                >
                                                    Fail
                                                </Button>
                                            </div>
                                        ) : (
                                            getStatusBadge(check.status)
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Visual Documentation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Upload photos of trial assembly</p>
                            <Button variant="outline" size="sm">
                                Capture / Upload
                            </Button>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                Tolerance Guidelines
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>Panel gaps should be uniform (3mm ± 0.5mm)</li>
                                <li>Vertical alignment deviation max 1mm per meter</li>
                                <li>Surface flushness deviation max 0.5mm</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
