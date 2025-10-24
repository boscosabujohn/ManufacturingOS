'use client'
import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Target } from 'lucide-react'

export default function LiveSLATracking() {
  const [realTime, setRealTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRealTime(prev => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="h-8 w-8 text-blue-600" />
          Live SLA Tracking
        </h2>
        <p className="text-gray-600 mt-1">Real-time SLA monitoring with automated alerts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Target className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">92.5%</div>
          <div className="text-sm text-gray-600">SLA Compliance</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-1">234</div>
          <div className="text-sm text-gray-600">Met SLA</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mb-3" />
          <div className="text-3xl font-bold text-yellow-600 mb-1">18</div>
          <div className="text-sm text-gray-600">At Risk</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">4.2h</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
      </div>
    </div>
  );
}
