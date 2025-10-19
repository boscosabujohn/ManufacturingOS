'use client';

import { TrendingUp, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function TransfersPromotionsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-green-600" />
          Transfers & Promotions
        </h1>
        <p className="text-gray-600 mt-2">Manage employee movements and career progression</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Promotions This Year</p>
          <p className="text-2xl font-bold text-green-900 mt-1">48</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Transfers</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">62</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">8</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Approved</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">102</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
              Promotions
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
              Transfers
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { name: 'John Doe', type: 'Promotion', from: 'Senior Engineer', to: 'Lead Engineer', status: 'approved', date: '2024-01-15' },
            { name: 'Sarah Smith', type: 'Transfer', from: 'Sales - NYC', to: 'Sales - LA', status: 'pending', date: '2024-01-14' },
            { name: 'Mike Johnson', type: 'Promotion', from: 'Manager', to: 'Senior Manager', status: 'approved', date: '2024-01-12' },
          ].map((activity, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{activity.type}: {activity.from} → {activity.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {activity.date}
                  </div>
                  {activity.status === 'approved' ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      <CheckCircle className="h-3 w-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
