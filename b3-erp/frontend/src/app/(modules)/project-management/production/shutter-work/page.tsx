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
  DoorOpen,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';

interface ShutterJob {
  id: string;
  shutterName: string;
  type: 'Glass' | 'Wood' | 'Acrylic';
  dimensions: string;
  quantity: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  fitmentCheck: boolean;
}

export default function ShutterWorkPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<ShutterJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for shutter jobs
    const mockJobs: ShutterJob[] = [
      { id: 'SJ-001', shutterName: 'Kitchen Cabinet Door', type: 'Wood', dimensions: '600x720mm', quantity: 12, status: 'Pending', fitmentCheck: false },
      { id: 'SJ-002', shutterName: 'Display Unit Glass', type: 'Glass', dimensions: '450x900mm', quantity: 4, status: 'In Progress', fitmentCheck: true },
      { id: 'SJ-003', shutterName: 'Wardrobe Slider', type: 'Acrylic', dimensions: '900x2100mm', quantity: 2, status: 'Completed', fitmentCheck: true },
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: ShutterJob['status']) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    toast({
      title: 'Status Updated',
      description: `Job ${id} status changed to ${newStatus}`,
    });
  };

  const handleFitmentCheckToggle = (id: string) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        const newValue = !job.fitmentCheck;
        if (newValue) {
          toast({
            title: 'Fitment Verified',
            description: `Fitment checked for ${job.shutterName}. Ready for trial wall.`,
            variant: 'default',
          });
        }
        return { ...job, fitmentCheck: newValue };
      }
      return job;
    }));
  };

  return (
    <div className="w-full py-2 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DoorOpen className="h-8 w-8 text-orange-600" />
            5.6 Shutter Work
          </h1>
          <p className="text-muted-foreground">
            Manage shutter manufacturing and fitment checks.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/project-management/production/buffing')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push('/project-management/production/trial-wall')}>
            Next: Trial Wall <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="pt-6 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-700">HANDLING INSTRUCTION</h3>
            <p className="text-blue-600">
              Handle glass and acrylic shutters with care. Ensure protective film is intact.
              Verify dimensions against technical drawings before assembly.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Shutter Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Job ID</th>
                    <th className="p-4 font-medium">Shutter Name</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Dimensions</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Fitment Check</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t hover:bg-muted/50">
                      <td className="p-4 font-medium">{job.id}</td>
                      <td className="p-4">{job.shutterName}</td>
                      <td className="p-4">
                        <Badge variant="outline">{job.type}</Badge>
                      </td>
                      <td className="p-4">{job.dimensions}</td>
                      <td className="p-4">{job.quantity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={job.fitmentCheck}
                            onChange={() => handleFitmentCheckToggle(job.id)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            id={`qc-${job.id}`}
                          />
                          <label htmlFor={`qc-${job.id}`} className={`text-xs ${job.fitmentCheck ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {job.fitmentCheck ? 'Verified' : 'Pending'}
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
