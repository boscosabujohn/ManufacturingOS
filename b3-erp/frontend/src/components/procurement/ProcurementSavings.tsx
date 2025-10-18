'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Target, Zap, BarChart3, Award } from 'lucide-react';

const ProcurementSavings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Procurement Savings Tracker</h2>
        <p className="text-gray-600">Track and optimize procurement cost savings initiatives</p>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'initiatives', 'tracking', 'reports'].map((tab) => (
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
          <DollarSign className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-2xl font-bold">$125K</p>
          <p className="text-sm text-gray-600">YTD Savings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Target className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-2xl font-bold">$150K</p>
          <p className="text-sm text-gray-600">Annual Target</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <TrendingUp className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-2xl font-bold">83%</p>
          <p className="text-sm text-gray-600">Target Achievement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Zap className="h-8 w-8 text-orange-500 mb-4" />
          <p className="text-2xl font-bold">15</p>
          <p className="text-sm text-gray-600">Active Initiatives</p>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSavings;