'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, DollarSign, Users, BarChart3, Plus } from 'lucide-react';

const CategoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Category Management System</h2>
        <p className="text-gray-600">Strategic management of procurement categories</p>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'categories', 'strategies', 'performance'].map((tab) => (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <Package className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm text-gray-600">Active Categories</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <DollarSign className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-2xl font-bold">$2.4M</p>
          <p className="text-sm text-gray-600">Total Category Spend</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <TrendingUp className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-2xl font-bold">15%</p>
          <p className="text-sm text-gray-600">Savings Opportunity</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;