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
  Flame,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';

interface WeldingJob {
  id: string;
  partName: string;
  material: string;
  weldType: 'TIG' | 'MIG' | 'Spot';
  quantity: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  qualityCheck: boolean;
}

export default function WeldingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<WeldingJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for welding jobs
    const mockJobs: WeldingJob[] = [
      { id: 'WJ-001', partName: 'Main Frame Assembly', material: 'SS 304', weldType: 'TIG', quantity: 5, status: 'Pending', qualityCheck: false },
      { id: 'WJ-002', partName: 'Support Brackets', material: 'MS CRCA', weldType: 'MIG', quantity: 20, status: 'In Progress', qualityCheck: true },
      { id: 'WJ-003', partName: 'Corner Joints', material: 'Aluminium', weldType: 'TIG', quantity: 15, status: 'Completed', qualityCheck: true },
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: WeldingJob['status']) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    toast({
      title: 'Status Updated',
      description: `Job ${id} status changed to ${newStatus}`,
    });
  };

  const handleQualityCheckToggle = (id: string) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        const newValue = !job.qualityCheck;
        if (newValue) {
          toast({
            title: 'Quality Check Passed',
            description: `Weld quality verified for ${job.partName}. Ready for buffing.`,
            variant: 'default',
          });
        }
        return { ...job, qualityCheck: newValue };
      }
      return job;
    }));
  };

  return (
    <div className="w-full py-2 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-600" />
            5.4 Welding
          </h1>
          <p className="text-muted-foreground">
            Manage welding operations and verify joint quality.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/project-management/production/fabrication')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push('/project-management/production/buffing')}>
            Next: Buffing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
        <CardContent className="pt-6 flex items-start gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-700">SAFETY REMINDER</h3>
            <p className="text-yellow-600">
              Ensure proper ventilation and PPE (helmet, gloves) are used at all times.
              Verify weld penetration and clean slag before passing to buffing.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Welding Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Job ID</th>
                    <th className="p-4 font-medium">Part Name</th>
                    <th className="p-4 font-medium">Material</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">QC Check</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t hover:bg-muted/50">
                      <td className="p-4 font-medium">{job.id}</td>
                      <td className="p-4">{job.partName}</td>
                      <td className="p-4">{job.material}</td>
                      <td className="p-4">
                        <Badge variant="outline">{job.weldType}</Badge>
                      </td>
                      <td className="p-4">{job.quantity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={job.qualityCheck}
                            onChange={() => handleQualityCheckToggle(job.id)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            id={`qc-${job.id}`}
                          />
                          <label htmlFor={`qc-${job.id}`} className={`text-xs ${job.qualityCheck ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {job.qualityCheck ? 'Passed' : 'Pending'}
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
