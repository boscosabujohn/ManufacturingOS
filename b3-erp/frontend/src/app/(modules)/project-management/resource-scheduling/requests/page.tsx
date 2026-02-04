'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  User,
  Calendar,
  Briefcase,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock Data
const requests = [
  {
    id: 1,
    requester: 'Sarah Jenkins',
    role: 'Senior PM',
    project: 'Project A - Kitchen Reno',
    resourceType: 'Installation Lead',
    quantity: 1,
    startDate: '2024-06-20',
    duration: '2 weeks',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 2,
    requester: 'Mike Ross',
    role: 'Production Manager',
    project: 'Project C - Office Fitout',
    resourceType: 'Assembly Crew',
    quantity: 3,
    startDate: '2024-07-01',
    duration: '1 month',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 3,
    requester: 'David Lee',
    role: 'Engineering Lead',
    project: 'Custom Fab #102',
    resourceType: 'CAD Designer',
    quantity: 1,
    startDate: '2024-06-15',
    duration: '3 days',
    status: 'Approved',
    priority: 'Low',
  },
];

export default function ResourceRequestsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className=" px-3 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Resource Requests</h1>
                <p className="text-sm text-gray-500">Manage incoming requests for resource allocation</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
        <div className=" space-y-3">
          {/* Requests List */}
          <div className="space-y-2">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {request.requester.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.resourceType}</h3>
                          <Badge variant={
                            request.priority === 'High' ? 'destructive' :
                              request.priority === 'Medium' ? 'default' :
                                'secondary'
                          }>
                            {request.priority} Priority
                          </Badge>
                          {request.status === 'Approved' && (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              Approved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Requested by {request.requester} • {request.role}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            {request.project}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            Starts {request.startDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            Duration: {request.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-400" />
                            Qty: {request.quantity}
                          </div>
                        </div>
                      </div>
                    </div>

                    {request.status === 'Pending' && (
                      <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        <Button variant="outline" className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
