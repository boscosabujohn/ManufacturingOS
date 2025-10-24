'use client';

import React from 'react';
import { Calendar, Clock, Truck, Package, Warehouse } from 'lucide-react';

export default function DockScheduling() {
  const dockAppointments = [
    { id: 'DOCK-001', dock: 'Dock A1', carrier: 'Blue Dart', type: 'Loading', scheduled: '2025-01-24 08:00', duration: 120, status: 'completed' },
    { id: 'DOCK-002', dock: 'Dock A2', carrier: 'DTDC', type: 'Unloading', scheduled: '2025-01-24 10:00', duration: 90, status: 'in-progress' },
    { id: 'DOCK-003', dock: 'Dock B1', carrier: 'Delhivery', type: 'Loading', scheduled: '2025-01-24 14:00', duration: 60, status: 'scheduled' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-yellow-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dock Scheduling Management</h1>
          <p className="text-gray-600">Optimize dock utilization and reduce wait times</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Today's Appointments</p>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Active Docks</p>
            <p className="text-3xl font-bold text-green-600">6/8</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Avg Turnaround</p>
            <p className="text-3xl font-bold text-purple-600">85 min</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Utilization</p>
            <p className="text-3xl font-bold text-orange-600">87%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Appointments</h2>

          <div className="space-y-4">
            {dockAppointments.map((appt) => (
              <div key={appt.id} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Warehouse className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{appt.dock} - {appt.type}</h3>
                      <p className="text-sm text-gray-600">Carrier: {appt.carrier}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appt.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appt.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appt.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>{appt.scheduled}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Duration: {appt.duration} min</span>
                  </div>
                  <div>
                    <span className="font-medium">ID: {appt.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
