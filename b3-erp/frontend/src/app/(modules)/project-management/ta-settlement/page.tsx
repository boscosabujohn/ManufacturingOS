'use client';

import React, { useState } from 'react';
import TASettlement from '@/components/project-management/TASettlement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TASettlementPage() {
  const [selectedProject, setSelectedProject] = useState<string>('proj-001');

  const projects = [
    { id: 'proj-001', name: 'Metro Rail Phase 1' },
    { id: 'proj-002', name: 'Solar Power Plant' },
    { id: 'proj-003', name: 'Highway Expansion' },
  ];

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TA Settlement</h1>
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

      <TASettlement projectId={selectedProject} />
    </div>
  );
}
