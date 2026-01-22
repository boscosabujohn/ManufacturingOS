'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Split,
  RefreshCw,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

// Mock Data
const conflicts = [
  {
    id: 1,
    resource: 'Rajesh Kumar',
    role: 'Project Manager',
    type: 'Double Booking',
    severity: 'High',
    description: 'Scheduled for "Project A" and "Project B" simultaneously on 12th Jun.',
    date: '2024-06-12',
    projects: ['Project A', 'Project B'],
  },
  {
    id: 2,
    resource: 'CNC Machine 04',
    role: 'Machinery',
    type: 'Maintenance Overlap',
    severity: 'Medium',
    description: 'Scheduled maintenance overlaps with "Production Run #405".',
    date: '2024-06-14',
    projects: ['Production Run #405', 'Maintenance'],
  },
  {
    id: 3,
    resource: 'Assembly Team A',
    role: 'Labor Team',
    type: 'Overtime Limit',
    severity: 'Low',
    description: 'Weekly hours exceed 45 hours with current allocation.',
    date: 'Week 24',
    projects: ['Project C'],
  },
];

export default function ConflictResolutionPage() {
  const router = useRouter();
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const handleResolveClick = (conflict: any) => {
    setSelectedConflict(conflict);
    setShowResolveModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Conflict Resolution</h1>
              <p className="text-sm text-gray-500">Identify and resolve resource scheduling conflicts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className=" mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-900">High Severity</p>
                  <h3 className="text-2xl font-bold text-red-700">1</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-900">Medium Severity</p>
                  <h3 className="text-2xl font-bold text-orange-700">1</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900">Low Severity</p>
                  <h3 className="text-2xl font-bold text-yellow-700">1</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conflicts List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Conflicts</CardTitle>
              <CardDescription>Review and take action on the following issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflicts.map((conflict) => (
                  <div key={conflict.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className={`p-2 rounded-lg ${conflict.severity === 'High' ? 'bg-red-100 text-red-600' :
                          conflict.severity === 'Medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-yellow-100 text-yellow-600'
                        }`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{conflict.resource}</h3>
                          <span className="text-sm text-gray-500">• {conflict.role}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">{conflict.type}</p>
                        <p className="text-sm text-gray-500 mt-1">{conflict.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {conflict.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Affected: {conflict.projects.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => handleResolveClick(conflict)}
                      >
                        Resolve
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        Ignore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolution Modal */}
      <ModalWrapper
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Resolve Conflict"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Conflict Details</h4>
            <p className="text-sm text-gray-600">{selectedConflict?.description}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Suggested Actions</h4>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left group">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Reassign Task</h5>
                  <p className="text-sm text-gray-500 mt-1">Assign "Project B" task to an available resource with similar skills (e.g., Suresh Patel).</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-blue-500" />
              </button>

              <button className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-left group">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Reschedule</h5>
                  <p className="text-sm text-gray-500 mt-1">Move "Project A" task to start on 13th Jun (Next available slot).</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-green-500" />
              </button>

              <button className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-left group">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200">
                  <Split className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Split Allocation</h5>
                  <p className="text-sm text-gray-500 mt-1">Split the task between Rajesh Kumar and another resource.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-purple-500" />
              </button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}
