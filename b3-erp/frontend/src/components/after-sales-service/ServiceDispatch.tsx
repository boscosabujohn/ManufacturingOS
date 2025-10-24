'use client'
import { Radio, MapPin, Clock, Users } from 'lucide-react'
export default function ServiceDispatch() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Radio className="h-8 w-8 text-blue-600" />
          Service Dispatch System
        </h2>
        <p className="text-gray-600 mt-1">Intelligent field service dispatch and coordination</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Radio className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">67</div>
          <div className="text-sm text-gray-600">Dispatched Today</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <MapPin className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">Real-time</div>
          <div className="text-sm text-gray-600">Tracking</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Clock className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">3.2h</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Users className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">45</div>
          <div className="text-sm text-gray-600">Field Techs</div>
        </div>
      </div>
    </div>
  );
}
