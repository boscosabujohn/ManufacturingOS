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
    Crosshair,
    CheckCircle2,
    AlertTriangle,
    Maximize
} from 'lucide-react';

interface FinalCheck {
    id: string;
    description: string;
    status: 'Pending' | 'Perfect' | 'Adjusted';
}

export default function FinalAlignPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [checks, setChecks] = useState<FinalCheck[]>([
        { id: '1', description: 'Door Gaps (3mm uniform)', status: 'Pending' },
        { id: '2', description: 'Drawer Front Alignment', status: 'Pending' },
        { id: '3', description: 'Shutter Leveling', status: 'Pending' },
        { id: '4', description: 'Handle Alignment', status: 'Pending' },
        { id: '5', description: 'Skirting Alignment', status: 'Pending' },
    ]);

    const handleStatusChange = (id: string, status: FinalCheck['status']) => {
        setChecks(checks.map(c =>
            c.id === id ? { ...c, status } : c
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Final Alignment Complete',
            description: 'All alignment checks passed successfully',
        });
        setTimeout(() => router.push('/installation/photo-doc'), 1000);
    };

    const getStatusBadge = (status: FinalCheck['status']) => {
        const styles = {
            'Perfect': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            'Adjusted': 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Crosshair className="h-8 w-8 text-orange-600" />
                        8.7 Final Alignment
                    </h1>
                    <p className="text-muted-foreground">
                        Precision alignment of shutters, drawers, and gaps for perfect finish.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/accessory-fix')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={checks.some(c => c.status === 'Pending')}
                    >
                        Next: Photo Doc <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Alignment Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {checks.map((check) => (
                                <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                    <span className="font-medium">{check.description}</span>
                                    <div className="flex items-center gap-2">
                                        {check.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600"
                                                    onClick={() => handleStatusChange(check.id, 'Perfect')}
                                                >
                                                    Perfect
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-600"
                                                    onClick={() => handleStatusChange(check.id, 'Adjusted')}
                                                >
                                                    Adjusted
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
                        <CardTitle>Alignment Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                                <Maximize className="h-4 w-4" />
                                Critical Checkpoints
                            </h4>
                            <ul className="text-sm text-orange-700 space-y-2 list-disc list-inside">
                                <li>Ensure 3mm uniform gap between all shutters</li>
                                <li>Check horizontal alignment of drawer lines</li>
                                <li>Verify handles are perfectly level</li>
                                <li>Confirm skirting is flush with floor</li>
                                <li>Test all soft-close mechanisms after alignment</li>
                            </ul>
                        </div>
                        <div className="border-2 border-dashed rounded-lg p-3 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Use laser level for long horizontal lines
                            </p>
                            <Button variant="outline" size="sm">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Report Alignment Issue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
