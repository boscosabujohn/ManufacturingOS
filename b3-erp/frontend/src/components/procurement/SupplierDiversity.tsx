'use client';

import React, { useState } from 'react';
import { Users, Globe, Award, TrendingUp, BarChart3, Target } from 'lucide-react';

const SupplierDiversity: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Supplier Diversity Management</h2>
        <p className="text-gray-600">Promote diversity and inclusion in supplier partnerships</p>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {['overview', 'diversity', 'programs', 'reporting'].map((tab) => (
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
          <Users className="h-8 w-8 text-blue-500 mb-4" />
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-gray-600">Diverse Suppliers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Target className="h-8 w-8 text-green-500 mb-4" />
          <p className="text-2xl font-bold">28%</p>
          <p className="text-sm text-gray-600">Diversity Spend %</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Award className="h-8 w-8 text-purple-500 mb-4" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-600">Certified Partners</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Globe className="h-8 w-8 text-orange-500 mb-4" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-gray-600">Geographic Regions</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierDiversity;