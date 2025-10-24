'use client'
import { Calendar, Download, Mail, Clock } from 'lucide-react'
export default function ExportScheduling() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-green-600" />
          Export Scheduling
        </h2>
        <p className="text-gray-600 mt-1">Automated report distribution via email and file exports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Calendar className="h-8 w-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">67</div>
          <div className="text-sm text-gray-600">Scheduled Reports</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Download className="h-8 w-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-1">2,345</div>
          <div className="text-sm text-gray-600">Exports Today</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Mail className="h-8 w-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-1">456</div>
          <div className="text-sm text-gray-600">Email Recipients</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <Clock className="h-8 w-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-1">Daily</div>
          <div className="text-sm text-gray-600">Most Common</div>
        </div>
      </div>
    </div>
  );
}
