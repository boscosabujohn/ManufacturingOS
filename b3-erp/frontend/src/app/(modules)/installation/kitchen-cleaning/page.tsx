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
    Sparkles,
    CheckCircle2,
    Trash2,
    Brush
} from 'lucide-react';

interface CleaningTask {
    id: string;
    area: string;
    status: 'Pending' | 'Cleaned';
}

export default function KitchenCleaningPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [tasks, setTasks] = useState<CleaningTask[]>([
        { id: '1', area: 'Countertops & Surfaces', status: 'Pending' },
        { id: '2', area: 'Inside Cabinets & Drawers', status: 'Pending' },
        { id: '3', area: 'Floor Area', status: 'Pending' },
        { id: '4', area: 'Remove Debris & Packaging', status: 'Pending' },
        { id: '5', area: 'Wipe Down Appliances', status: 'Pending' },
    ]);

    const handleToggleStatus = (id: string) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'Pending' ? 'Cleaned' : 'Pending' } : t
        ));
    };

    const handleComplete = () => {
        toast({
            title: 'Cleaning Completed',
            description: 'Site is ready for client handover',
        });
        setTimeout(() => router.push('/installation/handover'), 1000);
    };

    const getStatusBadge = (status: CleaningTask['status']) => {
        const styles = {
            'Cleaned': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Pending': 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
        return <Badge className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="w-full py-2 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-orange-600" />
                        8.10 Kitchen Cleaning
                    </h1>
                    <p className="text-muted-foreground">
                        Deep cleaning of the installed kitchen before handover.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/final-inspection')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={tasks.some(t => t.status === 'Pending')}
                    >
                        Next: Client Handover <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Cleaning Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${task.status === 'Cleaned' ? 'bg-green-50 border-green-200' : ''}`}
                                    onClick={() => handleToggleStatus(task.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${task.status === 'Cleaned' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {task.status === 'Cleaned' ? <CheckCircle2 className="h-5 w-5" /> : <Brush className="h-4 w-4" />}
                                        </div>
                                        <span className={`font-medium ${task.status === 'Cleaned' ? 'text-green-800' : ''}`}>{task.area}</span>
                                    </div>
                                    {getStatusBadge(task.status)}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Waste Disposal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Disposal Guidelines
                            </h4>
                            <ul className="text-sm text-orange-700 space-y-2 list-disc list-inside">
                                <li>Separate recyclable packaging (cardboard, plastic)</li>
                                <li>Dispose of wood scraps and sawdust safely</li>
                                <li>Ensure no hazardous materials are left behind</li>
                                <li>Leave the site broom-clean and vacuumed</li>
                            </ul>
                        </div>
                        <div className="text-center p-3 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold mb-2">Ready for Handover?</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Ensure the kitchen is sparkling clean. First impressions matter!
                            </p>
                            <div className="flex justify-center gap-2 text-sm">
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-2xl">{tasks.filter(t => t.status === 'Cleaned').length}</span>
                                    <span className="text-muted-foreground">Cleaned</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-2xl">{tasks.length}</span>
                                    <span className="text-muted-foreground">Total</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
