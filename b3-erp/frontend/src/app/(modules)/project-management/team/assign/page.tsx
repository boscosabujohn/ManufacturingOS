'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Search, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';

export default function AssignSupervisorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleAssign = (name: string) => {
    toast({
      title: "Supervisor Assigned",
      description: `${name} has been assigned to this project.`,
    });
  };

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 hover:bg-transparent">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Supervisor</h1>
          <p className="text-sm text-gray-500">Step 2.11: Project supervisor allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Supervisors</CardTitle>
            <CardDescription>Select a supervisor for this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search by name or skill..." className="pl-9" />
            </div>

            {[
              { name: 'Anil Kumar', role: 'Senior Supervisor', exp: '8 years', projects: 2, status: 'Available' },
              { name: 'Rajesh Singh', role: 'Site Engineer', exp: '5 years', projects: 1, status: 'Available' },
              { name: 'Vikram Malhotra', role: 'Project Manager', exp: '12 years', projects: 4, status: 'Busy' },
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{person.name}</h4>
                    <p className="text-xs text-gray-500">{person.role} • {person.exp} exp</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Active Projects</p>
                    <p className="font-medium text-gray-900">{person.projects}</p>
                  </div>
                  <Button size="sm" disabled={person.status === 'Busy'} variant={person.status === 'Busy' ? 'outline' : 'default'} onClick={() => handleAssign(person.name)}>
                    {person.status === 'Busy' ? 'Unavailable' : 'Assign'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Assignment</CardTitle>
            <CardDescription>Project leadership</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">No Supervisor Assigned</h3>
              <p className="text-sm text-gray-500 mt-1">Please select a supervisor to oversee site operations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
