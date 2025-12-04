'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    FoldVertical, // Using FoldVertical as a proxy for Bending icon
    FileText,
    CheckCircle,
    Clock
} from 'lucide-react';

interface BendingJob {
    id: string;
    partName: string;
    material: string;
    bends: number;
    status: 'Pending' | 'In Progress' | 'Completed';
    instructions: string;
}

export default function BendingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [jobs, setJobs] = useState<BendingJob[]>([]);

    useEffect(() => {
        // Mock data
        setJobs([
            { id: 'BJ-001', partName: 'Main Frame - Top', material: 'SS 304 (2mm)', bends: 4, status: 'Pending', instructions: '90° bend at 50mm, 45° bend at 150mm' },
            { id: 'BJ-002', partName: 'Side Panel - Left', material: 'MS CRCA (1.5mm)', bends: 2, status: 'In Progress', instructions: 'Standard 90° flange bends' },
            { id: 'BJ-003', partName: 'Mounting Bracket', material: 'Aluminium 5052 (3mm)', bends: 6, status: 'Completed', instructions: 'Complex multi-stage bending' },
        ]);
    }, []);

    const handleStatusChange = (id: string, newStatus: BendingJob['status']) => {
        setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
        toast({
            title: 'Status Updated',
            description: `Job ${id} marked as ${newStatus}`,
        });
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FoldVertical className="h-8 w-8 text-blue-600" />
                        5.2 Bending & Forming
                    </h1>
                    <p className="text-muted-foreground">
                        Manage bending operations and view forming instructions.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/project-management/production/fabrication')}>
                        Next: Fabrication <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {job.id}
                            </CardTitle>
                            <Badge variant={
                                job.status === 'Completed' ? 'default' :
                                    job.status === 'In Progress' ? 'secondary' : 'outline'
                            }>
                                {job.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold">{job.partName}</h3>
                                    <p className="text-sm text-muted-foreground">{job.material}</p>
                                </div>

                                <div className="bg-muted p-3 rounded-md text-sm">
                                    <div className="flex items-center gap-2 mb-1 font-medium">
                                        <FileText className="h-3 w-3" /> Instructions:
                                    </div>
                                    {job.instructions}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Bends: {job.bends}</span>
                                </div>

                                <div className="pt-2">
                                    {job.status === 'Pending' && (
                                        <Button className="w-full" onClick={() => handleStatusChange(job.id, 'In Progress')}>
                                            Start Bending
                                        </Button>
                                    )}
                                    {job.status === 'In Progress' && (
                                        <Button className="w-full" variant="secondary" onClick={() => handleStatusChange(job.id, 'Completed')}>
                                            Mark Complete
                                        </Button>
                                    )}
                                    {job.status === 'Completed' && (
                                        <Button className="w-full" variant="outline" disabled>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
