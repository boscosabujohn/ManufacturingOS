'use client'
import { MapPin, Route, Users, Navigation } from 'lucide-react'
export default function TechnicianRouting() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Route className="h-8 w-8 text-green-600" />
          Technician Routing
        </h2>
        <p className="text-gray-600 mt-1">AI-optimized routing and dispatch</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Users className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
          <div className="text-sm text-gray-600">Active Technicians</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Route className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">128</div>
          <div className="text-sm text-gray-600">Optimized Routes</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Navigation className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">25%</div>
          <div className="text-sm text-gray-600">Time Saved</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <MapPin className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">Real-time</div>
          <div className="text-sm text-gray-600">GPS Tracking</div>
        </div>
      </div>
    </div>
  );
}
