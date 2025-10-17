'use client';

import React, { useState } from 'react';
import { User, MapPin, Clock, Calendar, TrendingUp } from 'lucide-react';

interface EngineerSchedule {
  id: string;
  name: string;
  status: 'Available' | 'On Job' | 'In Transit' | 'Break';
  todayJobs: number;
  completedJobs: number;
  hoursWorked: number;
  currentJob?: {
    jobNumber: string;
    customer: string;
    location: string;
    startTime: string;
    estimatedEnd: string;
  };
  upcomingJobs: Array<{
    jobNumber: string;
    customer: string;
    time: string;
    duration: number;
  }>;
}

export default function EngineerSchedulePage() {
  const [selectedDate, setSelectedDate] = useState('2025-02-18');

  // Mock engineer schedules
  const engineers: EngineerSchedule[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      status: 'On Job',
      todayJobs: 3,
      completedJobs: 1,
      hoursWorked: 4.5,
      currentJob: {
        jobNumber: 'FS-2025-0045',
        customer: 'Sharma Kitchens',
        location: 'MG Road, Koramangala',
        startTime: '09:35',
        estimatedEnd: '11:35'
      },
      upcomingJobs: [
        { jobNumber: 'FS-2025-0050', customer: 'City Cafe Express', time: '14:00', duration: 3 },
        { jobNumber: 'FS-2025-0052', customer: 'Paradise Banquet', time: '17:00', duration: 2 }
      ]
    },
    {
      id: '2',
      name: 'Amit Patel',
      status: 'In Transit',
      todayJobs: 2,
      completedJobs: 1,
      hoursWorked: 3.0,
      currentJob: {
        jobNumber: 'FS-2025-0046',
        customer: 'Prestige Developers',
        location: 'Whitefield',
        startTime: '13:30',
        estimatedEnd: '17:30'
      },
      upcomingJobs: []
    },
    {
      id: '3',
      name: 'Priya Singh',
      status: 'Available',
      todayJobs: 2,
      completedJobs: 1,
      hoursWorked: 2.5,
      upcomingJobs: [
        { jobNumber: 'FS-2025-0047', customer: 'Royal Restaurant', time: '11:00', duration: 3 },
        { jobNumber: 'FS-2025-0053', customer: 'Green Valley', time: '15:00', duration: 2 }
      ]
    },
    {
      id: '4',
      name: 'Suresh Reddy',
      status: 'Break',
      todayJobs: 3,
      completedJobs: 2,
      hoursWorked: 5.0,
      upcomingJobs: [
        { jobNumber: 'FS-2025-0054', customer: 'Hotel Plaza', time: '14:30', duration: 2 }
      ]
    },
    {
      id: '5',
      name: 'Neha Sharma',
      status: 'Available',
      todayJobs: 2,
      completedJobs: 0,
      hoursWorked: 0,
      upcomingJobs: [
        { jobNumber: 'FS-2025-0049', customer: 'Green Valley Resorts', time: '15:00', duration: 2 },
        { jobNumber: 'FS-2025-0055', customer: 'Spice Garden', time: '17:30', duration: 1.5 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'On Job': return 'bg-yellow-100 text-yellow-700';
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Break': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Statistics
  const stats = {
    totalEngineers: engineers.length,
    available: engineers.filter(e => e.status === 'Available').length,
    onJob: engineers.filter(e => e.status === 'On Job').length,
    totalJobs: engineers.reduce((sum, e) => sum + e.todayJobs, 0),
    completed: engineers.reduce((sum, e) => sum + e.completedJobs, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engineer Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Daily work schedule and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Engineers</span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalEngineers}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Available</span>
            <User className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">On Job</span>
            <MapPin className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.onJob}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Jobs</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalJobs}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
      </div>

      {/* Engineer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {engineers.map(engineer => (
          <div key={engineer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Engineer Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{engineer.name}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(engineer.status)}`}>
                      {engineer.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{engineer.todayJobs}</div>
                  <div className="text-xs text-gray-500">Jobs Today</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{engineer.completedJobs}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <div className="text-sm font-semibold text-gray-900">{engineer.todayJobs - engineer.completedJobs}</div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">{engineer.hoursWorked}h</div>
                <div className="text-xs text-gray-500">Hours Worked</div>
              </div>
            </div>

            {/* Current Job */}
            {engineer.currentJob && (
              <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
                <div className="text-xs font-medium text-yellow-900 mb-2">CURRENT JOB</div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{engineer.currentJob.jobNumber}</div>
                  <div className="text-sm text-gray-700">{engineer.currentJob.customer}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {engineer.currentJob.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    {engineer.currentJob.startTime} - {engineer.currentJob.estimatedEnd}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Jobs */}
            <div className="px-6 py-4">
              <div className="text-xs font-medium text-gray-700 mb-3">UPCOMING JOBS</div>
              {engineer.upcomingJobs.length > 0 ? (
                <div className="space-y-2">
                  {engineer.upcomingJobs.map((job, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{job.jobNumber}</div>
                        <div className="text-xs text-gray-600">{job.customer}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{job.time}</div>
                        <div className="text-xs text-gray-500">{job.duration}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No upcoming jobs</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
