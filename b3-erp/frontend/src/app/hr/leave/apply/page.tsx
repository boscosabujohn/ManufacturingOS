'use client';

import { Send, Calendar, Plus } from 'lucide-react';

export default function ApplyLeavePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Send className="h-8 w-8 text-green-600" />
          Apply for Leave
        </h1>
        <p className="text-gray-600 mt-2">Submit a new leave request</p>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Casual Leave</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">8 / 12</p>
          <p className="text-xs text-blue-600 mt-1">Available / Total</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Sick Leave</p>
          <p className="text-2xl font-bold text-green-900 mt-1">6 / 10</p>
          <p className="text-xs text-green-600 mt-1">Available / Total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Earned Leave</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">14 / 15</p>
          <p className="text-xs text-purple-600 mt-1">Available / Total</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Comp Off</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">2.5</p>
          <p className="text-xs text-yellow-600 mt-1">Available days</p>
        </div>
      </div>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Leave Application</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
                <option>Comp Off</option>
                <option>Work From Home</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>Full Day</option>
                <option>Half Day - First Half</option>
                <option>Half Day - Second Half</option>
                <option>Multiple Days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter reason for leave..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Document (if applicable)</label>
            <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Send className="h-4 w-4" />
              Submit Application
            </button>
            <button type="button" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
