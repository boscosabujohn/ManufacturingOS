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
    Users,
    UserPlus,
    CheckCircle2
} from 'lucide-react';

interface Installer {
    id: string;
    name: string;
    role: string;
    skills: string[];
    status: 'Available' | 'Assigned';
}

export default function TeamAssignmentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [installers, setInstallers] = useState<Installer[]>([
        { id: '1', name: 'Rajesh Kumar', role: 'Lead', skills: ['Carpentry', 'Plumbing'], status: 'Available' },
        { id: '2', name: 'Suresh Babu', role: 'Technician', skills: ['Electrical', 'Assembly'], status: 'Available' },
        { id: '3', name: 'Mohan S', role: 'Helper', skills: ['Material Handling'], status: 'Available' },
    ]);

    const [assignedTeam, setAssignedTeam] = useState<string[]>([]);

    const handleToggleAssign = (id: string) => {
        setAssignedTeam(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleConfirmAssignment = () => {
        toast({
            title: 'Team Assigned',
            description: `${assignedTeam.length} members assigned to the project`,
        });
        setTimeout(() => router.push('/installation/cabinet-align'), 1000);
    };

    return (
        <div className="container mx-auto py-6 max-w-7xl space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8 text-orange-600" />
                        8.3 Team Assignment
                    </h1>
                    <p className="text-muted-foreground">
                        Assign installation crew to the project.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/installation/tool-dispatch')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleConfirmAssignment}
                        disabled={assignedTeam.length === 0}
                    >
                        Next: Cabinet Align <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Installers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {installers.map((installer) => (
                            <div
                                key={installer.id}
                                className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 ${assignedTeam.includes(installer.id) ? 'border-orange-600 bg-orange-50' : ''}`}
                                onClick={() => handleToggleAssign(installer.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${assignedTeam.includes(installer.id) ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                            <UserPlus className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{installer.name}</div>
                                            <div className="text-sm text-muted-foreground">{installer.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {installer.skills.map(skill => (
                                            <Badge key={skill} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
