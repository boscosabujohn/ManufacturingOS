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
    ClipboardCheck,
    CheckCircle2,
    AlertOctagon,
    ThumbsUp
} from 'lucide-react';

interface InspectionPoint {
    id: string;
    category: 'Functionality' | 'Aesthetics' | 'Cleanliness' | 'Safety';
    item: string;
    status: 'Pass' | 'Fail' | 'Pending';
}

export default function FinalInspectionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [points, setPoints] = useState<InspectionPoint[]>([
        { id: '1', category: 'Functionality', item: 'All drawers open/close smoothly', status: 'Pending' },
        { id: '2', category: 'Functionality', item: 'Hinges adjusted and soft-close working', status: 'Pending' },
        { id: '3', category: 'Aesthetics', item: 'No scratches or dents on surfaces', status: 'Pending' },
        { id: '4', category: 'Aesthetics', item: 'Gaps are uniform (3mm)', status: 'Pending' },
        { id: '5', category: 'Safety', item: 'Wall units securely mounted', status: 'Pending' },
        { id: '6', category: 'Cleanliness', item: 'Inside cabinets free of dust', status: 'Pending' },
    ]);

    const handleStatusChange = (id: string, status: InspectionPoint['status']) => {
        setPoints(points.map(p =>
            p.id === id ? { ...p, status } : p
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Inspection Completed',
            description: 'Site is ready for cleaning and handover',
        });
        setTimeout(() => router.push('/installation/kitchen-cleaning'), 1000);
    };

    const getStatusBadge = (status: InspectionPoint['status']) => {
        const styles = {
            'Pass': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Fail': 'bg-red-100 text-red-800 hover:bg-red-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="container mx-auto py-6 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ClipboardCheck className="h-8 w-8 text-orange-600" />
                        8.9 Final Inspection
                    </h1>
                    <p className="text-muted-foreground">
                        Comprehensive quality check before client handover.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/photo-doc')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={points.some(p => p.status !== 'Pass')}
                    >
                        Next: Kitchen Cleaning <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Inspection Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {points.map((point) => (
                                <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                    <div>
                                        <div className="font-medium">{point.item}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{point.category}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {point.status === 'Pending' || point.status === 'Fail' ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleStatusChange(point.id, 'Pass')}
                                                >
                                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                                    Pass
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleStatusChange(point.id, 'Fail')}
                                                >
                                                    <AlertOctagon className="h-4 w-4 mr-1" />
                                                    Fail
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(point.status)}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleStatusChange(point.id, 'Pending')}
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {Math.round((points.filter(p => p.status === 'Pass').length / points.length) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Passed</span>
                                <span className="font-medium text-green-600">{points.filter(p => p.status === 'Pass').length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Failed</span>
                                <span className="font-medium text-red-600">{points.filter(p => p.status === 'Fail').length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Pending</span>
                                <span className="font-medium text-gray-600">{points.filter(p => p.status === 'Pending').length}</span>
                            </div>
                        </div>
                        {points.some(p => p.status === 'Fail') && (
                            <div className="bg-red-50 p-3 rounded text-sm text-red-800 flex items-start gap-2">
                                <AlertOctagon className="h-4 w-4 mt-0.5" />
                                <div>
                                    Fix failed items before proceeding to cleaning.
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
