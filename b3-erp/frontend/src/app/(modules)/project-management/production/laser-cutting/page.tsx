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
  Scissors,
  CheckCircle,
  AlertTriangle,
  FileText,
  Printer
} from 'lucide-react';
// ProjectManagementService import removed - unused

interface LaserJob {
  id: string;
  partName: string;
  material: string;
  thickness: string;
  quantity: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  logoEtchVerified: boolean;
}

export default function LaserCuttingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<LaserJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for laser cutting jobs
    const mockJobs: LaserJob[] = [
      { id: 'LJ-001', partName: 'Main Frame - Top', material: 'SS 304', thickness: '2mm', quantity: 10, status: 'Pending', logoEtchVerified: false },
      { id: 'LJ-002', partName: 'Side Panel - Left', material: 'MS CRCA', thickness: '1.5mm', quantity: 25, status: 'In Progress', logoEtchVerified: true },
      { id: 'LJ-003', partName: 'Mounting Bracket', material: 'Aluminium 5052', thickness: '3mm', quantity: 50, status: 'Completed', logoEtchVerified: true },
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: LaserJob['status']) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    toast({
      title: 'Status Updated',
      description: `Job ${id} status changed to ${newStatus}`,
    });
  };

  const handleLogoEtchToggle = (id: string) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        const newValue = !job.logoEtchVerified;
        if (newValue) {
          toast({
            title: 'Logo Etch Verified',
            description: `Logo etching confirmed for ${job.partName}. Ready for bending.`,
            variant: 'default', // Success style if available, else default
          });
        }
        return { ...job, logoEtchVerified: newValue };
      }
      return job;
    }));
  };

  return (
    <div className="w-full py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scissors className="h-8 w-8 text-orange-600" />
            5.1 Laser Cutting
          </h1>
          <p className="text-muted-foreground">
            Manage laser cutting jobs and verify logo etching before bending.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push('/project-management/production/bending')}>
            Next: Bending <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-l-4 border-l-red-500 bg-red-50">
        <CardContent className="pt-6 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
          <div>
            <h3 className="font-bold text-red-700">CRITICAL PROCESS RULE</h3>
            <p className="text-red-600">
              Company logo MUST be etched BEFORE bending process - this is irreversible!
              Ensure "Logo Etch Verified" is checked for all branded parts.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cutting Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Job ID</th>
                    <th className="p-4 font-medium">Part Name</th>
                    <th className="p-4 font-medium">Material</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Logo Etch</th>
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
                        <div className="flex flex-col">
                          <span>{job.material}</span>
                          <span className="text-xs text-muted-foreground">{job.thickness}</span>
                        </div>
                      </td>
                      <td className="p-4">{job.quantity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={job.logoEtchVerified}
                            onChange={() => handleLogoEtchToggle(job.id)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            id={`etch-${job.id}`}
                          />
                          <label htmlFor={`etch-${job.id}`} className={`text-xs ${job.logoEtchVerified ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {job.logoEtchVerified ? 'Verified' : 'Pending'}
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
