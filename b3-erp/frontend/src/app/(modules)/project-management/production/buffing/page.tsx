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
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';

interface BuffingJob {
  id: string;
  partName: string;
  finishType: 'Mirror' | 'Matte' | 'Satin';
  quantity: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  surfaceCheck: boolean;
}

export default function BuffingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<BuffingJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for buffing jobs
    const mockJobs: BuffingJob[] = [
      { id: 'BJ-001', partName: 'Main Frame Assembly', finishType: 'Matte', quantity: 5, status: 'Pending', surfaceCheck: false },
      { id: 'BJ-002', partName: 'Handle Bars', finishType: 'Mirror', quantity: 50, status: 'In Progress', surfaceCheck: true },
      { id: 'BJ-003', partName: 'Decorative Trim', finishType: 'Satin', quantity: 100, status: 'Completed', surfaceCheck: true },
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: BuffingJob['status']) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    toast({
      title: 'Status Updated',
      description: `Job ${id} status changed to ${newStatus}`,
    });
  };

  const handleSurfaceCheckToggle = (id: string) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        const newValue = !job.surfaceCheck;
        if (newValue) {
          toast({
            title: 'Surface Finish Verified',
            description: `Surface finish confirmed for ${job.partName}. Ready for next stage.`,
            variant: 'default',
          });
        }
        return { ...job, surfaceCheck: newValue };
      }
      return job;
    }));
  };

  return (
    <div className="w-full py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-orange-600" />
            5.5 Buffing & Finishing
          </h1>
          <p className="text-muted-foreground">
            Manage surface finishing and buffing operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/project-management/production/welding')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push('/project-management/production/shutter-work')}>
            Next: Shutter Work <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buffing Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Job ID</th>
                    <th className="p-4 font-medium">Part Name</th>
                    <th className="p-4 font-medium">Finish Type</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Surface Check</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t hover:bg-muted/50">
                      <td className="p-4 font-medium">{job.id}</td>
                      <td className="p-4">{job.partName}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{job.finishType}</Badge>
                      </td>
                      <td className="p-4">{job.quantity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={job.surfaceCheck}
                            onChange={() => handleSurfaceCheckToggle(job.id)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            id={`qc-${job.id}`}
                          />
                          <label htmlFor={`qc-${job.id}`} className={`text-xs ${job.surfaceCheck ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {job.surfaceCheck ? 'Verified' : 'Pending'}
                          </label>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={
                          job.status === 'Completed' ? 'default' :
                            job.status === 'In Progress' ? 'secondary' : 'outline'
                        } className={
                          job.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            job.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''
                        }>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {job.status !== 'Completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(job.id, job.status === 'Pending' ? 'In Progress' : 'Completed')}
                            >
                              {job.status === 'Pending' ? 'Start' : 'Complete'}
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Printer className="h-4 w-4" />
                          </Button>
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
