'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectFinancials from '@/components/project-management/ProjectFinancials';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectFinancialsPage() {
    const [selectedProject, setSelectedProject] = useState<string>('proj-001');

    // Mock projects list
    const projects = [
        { id: 'proj-001', name: 'Metro Rail Phase 1' },
        { id: 'proj-002', name: 'Solar Power Plant' },
        { id: 'proj-003', name: 'Highway Expansion' },
    ];

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Project Financials</h1>
                <div className="w-[300px]">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ProjectFinancials projectId={selectedProject} />
        </div>
    );
}
