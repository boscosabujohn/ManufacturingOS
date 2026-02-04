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
  Wrench,
  CheckSquare,
  Users
} from 'lucide-react';

interface AssemblyJob {
  id: string;
  assemblyName: string;
  components: string[];
  assignedTeam: string;
  status: 'Pending' | 'In Progress' | 'QC Ready' | 'Completed';
  progress: number;
}

export default function FabricationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<AssemblyJob[]>([]);

  useEffect(() => {
    setJobs([
      {
        id: 'ASM-001',
        assemblyName: 'Main Structure Frame',
        components: ['Main Frame - Top', 'Side Panel - Left', 'Side Panel - Right'],
        assignedTeam: 'Team Alpha',
        status: 'In Progress',
        progress: 60
      },
      {
        id: 'ASM-002',
        assemblyName: 'Control Unit Housing',
        components: ['Mounting Bracket', 'Housing Body', 'Door Panel'],
        assignedTeam: 'Team Beta',
        status: 'Pending',
        progress: 0
      },
    ]);
  }, []);

  const handleStatusUpdate = (id: string) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        if (job.status === 'Pending') return { ...job, status: 'In Progress', progress: 25 };
        if (job.status === 'In Progress') return { ...job, status: 'QC Ready', progress: 100 };
        return job;
      }
      return job;
    }));
    toast({ title: 'Assembly Updated', description: 'Job status advanced.' });
  };

  return (
    <div className="w-full py-2 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-yellow-600" />
            5.3 Fabrication & Assembly
          </h1>
          <p className="text-muted-foreground">
            Track assembly progress and component integration.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push('/project-management/production/welding')}>
            Next: Welding <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {job.assemblyName}
                  <Badge variant="outline">{job.id}</Badge>
                </CardTitle>
                <Badge className={
                  job.status === 'QC Ready' ? 'bg-purple-100 text-purple-800' :
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Components</h4>
                  <ul className="list-disc list-inside text-sm">
                    {job.components.map((comp, i) => (
                      <li key={i}>{comp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Team</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" /> {job.assignedTeam}
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-2">
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full transition-all duration-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end">
                    {job.status !== 'QC Ready' && job.status !== 'Completed' && (
                      <Button onClick={() => handleStatusUpdate(job.id)}>
                        {job.status === 'Pending' ? 'Start Assembly' : 'Mark Ready for QC'}
                      </Button>
                    )}
                    {job.status === 'QC Ready' && (
                      <Button variant="outline" disabled>
                        <CheckSquare className="mr-2 h-4 w-4" /> Awaiting QC
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
