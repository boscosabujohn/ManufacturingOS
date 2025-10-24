'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Activity, PieChart } from 'lucide-react';

export type ABCClass = 'A' | 'B' | 'C';
export type XYZClass = 'X' | 'Y' | 'Z';

export interface ABCItem {
  id: string;
  name: string;
  sku: string;
  annualConsumption: number;
  annualValue: number;
  percentageValue: number;
  cumulativePercentage: number;
  abcClass: ABCClass;
  xyzClass: XYZClass;
  demandVariability: number;
}

export default function ABCAnalysis() {
  const [activeView, setActiveView] = useState<'abc' | 'xyz' | 'matrix'>('abc');

  const items: ABCItem[] = [
    {
      id: '1',
      name: 'Steel Sheet 304 - 2mm',
      sku: 'SS-304-2MM',
      annualConsumption: 6500,
      annualValue: 19500000,
      percentageValue: 42.7,
      cumulativePercentage: 42.7,
      abcClass: 'A',
      xyzClass: 'X',
      demandVariability: 12,
    },
    {
      id: '2',
      name: 'Hydraulic Pump HP-500',
      sku: 'HP-500',
      annualConsumption: 1080,
      annualValue: 10800000,
      percentageValue: 23.7,
      cumulativePercentage: 66.4,
      abcClass: 'A',
      xyzClass: 'X',
      demandVariability: 8,
    },
    {
      id: '3',
      name: 'Control Panel CP-1000',
      sku: 'CP-1000',
      annualConsumption: 450,
      annualValue: 4500000,
      percentageValue: 9.9,
      cumulativePercentage: 76.3,
      abcClass: 'B',
      xyzClass: 'Y',
      demandVariability: 25,
    },
    {
      id: '4',
      name: 'Bearing 6205-2RS',
      sku: 'BRG-6205',
      annualConsumption: 2400,
      annualValue: 720000,
      percentageValue: 1.6,
      cumulativePercentage: 77.9,
      abcClass: 'C',
      xyzClass: 'Z',
      demandVariability: 45,
    },
  ];

  const abcStats = {
    A: { count: items.filter(i => i.abcClass === 'A').length, value: 66.4, items: '20%', revenue: '70%' },
    B: { count: items.filter(i => i.abcClass === 'B').length, value: 20.0, items: '30%', revenue: '20%' },
    C: { count: items.filter(i => i.abcClass === 'C').length, value: 13.6, items: '50%', revenue: '10%' },
  };

  const getClassColor = (classification: ABCClass | XYZClass) => {
    switch (classification) {
      case 'A':
      case 'X':
        return 'bg-green-100 text-green-800';
      case 'B':
      case 'Y':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
      case 'Z':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ABC/XYZ Analysis & Classification</h1>
          <p className="text-gray-600">Strategic inventory classification for optimized control</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            {['abc', 'xyz', 'matrix'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view as any)}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeView === view
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {view.toUpperCase()} Analysis
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {activeView === 'abc' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">ABC Classification</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Class A Items</h3>
                    <span className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">A</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">{abcStats.A.count} items</p>
                  <div className="text-sm text-gray-600">
                    <p>{abcStats.A.items} of inventory</p>
                    <p className="font-semibold text-green-700">{abcStats.A.revenue} of value</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Class B Items</h3>
                    <span className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">B</span>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">{abcStats.B.count} items</p>
                  <div className="text-sm text-gray-600">
                    <p>{abcStats.B.items} of inventory</p>
                    <p className="font-semibold text-yellow-700">{abcStats.B.revenue} of value</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Class C Items</h3>
                    <span className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">C</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600 mb-2">{abcStats.C.count} items</p>
                  <div className="text-sm text-gray-600">
                    <p>{abcStats.C.items} of inventory</p>
                    <p className="font-semibold text-red-700">{abcStats.C.revenue} of value</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getClassColor(item.abcClass)}`}>
                            Class {item.abcClass}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">SKU</p>
                            <p className="font-semibold text-gray-900">{item.sku}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Annual Consumption</p>
                            <p className="font-semibold text-gray-900">{item.annualConsumption.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Annual Value</p>
                            <p className="font-semibold text-green-600">₹{(item.annualValue / 1000000).toFixed(2)}M</p>
                          </div>
                          <div>
                            <p className="text-gray-600">% of Total Value</p>
                            <p className="font-semibold text-blue-600">{item.percentageValue.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'xyz' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">XYZ Classification (Demand Variability)</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {['X', 'Y', 'Z'].map((classification) => {
                  const count = items.filter(i => i.xyzClass === classification).length;
                  const desc = classification === 'X' ? 'Low variability (<20%)' : classification === 'Y' ? 'Medium variability (20-50%)' : 'High variability (>50%)';
                  return (
                    <div key={classification} className={`rounded-lg p-6 border ${
                      classification === 'X' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
                      classification === 'Y' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                      'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Class {classification}</h3>
                        <span className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          classification === 'X' ? 'bg-green-600' : classification === 'Y' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>{classification}</span>
                      </div>
                      <p className={`text-3xl font-bold mb-2 ${
                        classification === 'X' ? 'text-green-600' : classification === 'Y' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{count} items</p>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getClassColor(item.xyzClass)}`}>
                            Class {item.xyzClass}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Demand Variability: <span className="font-semibold text-gray-900">{item.demandVariability}%</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">ABC-XYZ Matrix</h2>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div></div>
                  <div className="text-center font-semibold text-gray-700">X (Low Var)</div>
                  <div className="text-center font-semibold text-gray-700">Y (Med Var)</div>
                  <div className="text-center font-semibold text-gray-700">Z (High Var)</div>

                  {['A', 'B', 'C'].map((abc) => (
                    <React.Fragment key={abc}>
                      <div className="flex items-center justify-center font-semibold text-gray-700">
                        Class {abc}
                      </div>
                      {['X', 'Y', 'Z'].map((xyz) => {
                        const count = items.filter(i => i.abcClass === abc && i.xyzClass === xyz).length;
                        const strategy =
                          abc === 'A' && xyz === 'X' ? 'Tight control, frequent review' :
                          abc === 'A' && xyz === 'Y' ? 'Safety stock, periodic review' :
                          abc === 'A' && xyz === 'Z' ? 'High safety stock, close monitoring' :
                          abc === 'B' && xyz === 'X' ? 'Standard control' :
                          abc === 'B' && xyz === 'Y' ? 'Moderate safety stock' :
                          abc === 'B' && xyz === 'Z' ? 'Higher safety stock' :
                          abc === 'C' && xyz === 'X' ? 'Simple control' :
                          abc === 'C' && xyz === 'Y' ? 'Basic stock' :
                          'Minimal stock';

                        return (
                          <div key={xyz} className={`rounded-lg p-4 border ${
                            abc === 'A' && xyz === 'X' ? 'bg-green-100 border-green-300' :
                            abc === 'A' ? 'bg-yellow-100 border-yellow-300' :
                            abc === 'C' && xyz === 'Z' ? 'bg-red-100 border-red-300' :
                            'bg-gray-100 border-gray-300'
                          }`}>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{count}</p>
                            <p className="text-xs text-gray-600">{strategy}</p>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
