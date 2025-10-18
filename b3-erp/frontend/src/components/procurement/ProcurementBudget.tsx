'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Target, BarChart3 } from 'lucide-react';

const ProcurementBudget: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Procurement Budget Tracking</h2>
        <p className="text-gray-600">Monitor and control procurement spend against budget</p>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'budget', 'variance', 'forecasting'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <DollarSign className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-2xl font-bold">$2.45M</p>
          <p className="text-sm text-gray-600">Total Budget</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-2xl font-bold">$1.98M</p>
          <p className="text-sm text-gray-600">Spent to Date</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Target className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-2xl font-bold">81%</p>
          <p className="text-sm text-gray-600">Budget Utilization</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <AlertCircle className="h-8 w-8 text-orange-500 mb-4" />
          <p className="text-2xl font-bold">$470K</p>
          <p className="text-sm text-gray-600">Remaining Budget</p>
        </div>
      </div>
    </div>
  );
};

export default ProcurementBudget;