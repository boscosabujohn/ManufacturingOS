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
    LayoutGrid,
    CheckCircle,
    Camera,
    Upload
} from 'lucide-react';

interface TrialJob {
    id: string;
    unitName: string;
    modules: number;
    status: 'Pending' | 'Assembled' | 'Verified';
    photoUploaded: boolean;
}

export default function TrialWallPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [jobs, setJobs] = useState<TrialJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for trial wall jobs
        const mockJobs: TrialJob[] = [
            { id: 'TJ-001', unitName: 'Kitchen Wall A', modules: 6, status: 'Pending', photoUploaded: false },
            { id: 'TJ-002', unitName: 'Kitchen Island', modules: 4, status: 'Assembled', photoUploaded: true },
            { id: 'TJ-003', unitName: 'Master Wardrobe', modules: 3, status: 'Verified', photoUploaded: true },
        ];
        setJobs(mockJobs);
        setLoading(false);
    }, []);

    const handleStatusChange = (id: string, newStatus: TrialJob['status']) => {
        setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
        toast({
            title: 'Status Updated',
            description: `Job ${id} status changed to ${newStatus}`,
        });
    };

    const handlePhotoUpload = (id: string) => {
        // Mock photo upload
        setJobs(jobs.map(job => {
            if (job.id === id) {
                toast({
                    title: 'Photo Uploaded',
                    description: `Trial wall photo uploaded for ${job.unitName}.`,
                    variant: 'default',
                });
                return { ...job, photoUploaded: true };
            }
            return job;
        }));
    };

    return (
        <div className="container mx-auto py-6 max-w-7xl space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <LayoutGrid className="h-8 w-8 text-orange-600" />
                        5.7 Trial Wall
                    </h1>
                    <p className="text-muted-foreground">
                        Verify assembly fit and alignment before final QC.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/project-management/production/shutter-work')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={() => router.push('/quality/inspections')}>
                        Next: QC Inspection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Trial Assembly Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 font-medium">Job ID</th>
                                        <th className="p-4 font-medium">Unit Name</th>
                                        <th className="p-4 font-medium">Modules</th>
                                        <th className="p-4 font-medium">Photo Proof</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4 font-medium">{job.id}</td>
                                            <td className="p-4">{job.unitName}</td>
                                            <td className="p-4">{job.modules} Units</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {job.photoUploaded ? (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            <Camera className="w-3 h-3 mr-1" /> Uploaded
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-gray-500">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={
                                                    job.status === 'Verified' ? 'default' :
                                                        job.status === 'Assembled' ? 'secondary' : 'outline'
                                                } className={
                                                    job.status === 'Verified' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                        job.status === 'Assembled' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''
                                                }>
                                                    {job.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!job.photoUploaded && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handlePhotoUpload(job.id)}
                                                        >
                                                            <Upload className="h-3 w-3 mr-1" /> Photo
                                                        </Button>
                                                    )}
                                                    {job.status !== 'Verified' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleStatusChange(job.id, job.status === 'Pending' ? 'Assembled' : 'Verified')}
                                                        >
                                                            {job.status === 'Pending' ? 'Assemble' : 'Verify'}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
