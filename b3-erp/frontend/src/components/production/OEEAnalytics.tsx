'use client';

import React from 'react';
import { BarChart3, TrendingUp, Clock, Zap, AlertCircle } from 'lucide-react';

export interface OEEData {
  machineId: string;
  machineName: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  plannedProductionTime: number;
  actualRuntime: number;
  downtime: number;
  idealCycleTime: number;
  actualCycleTime: number;
  totalParts: number;
  goodParts: number;
  defectParts: number;
}

const OEEAnalytics: React.FC = () => {
  const oeeData: OEEData[] = [
    {
      machineId: 'M001',
      machineName: 'CNC Mill #1',
      oee: 75.8,
      availability: 88.5,
      performance: 92.1,
      quality: 93.0,
      plannedProductionTime: 480,
      actualRuntime: 425,
      downtime: 55,
      idealCycleTime: 145,
      actualCycleTime: 158,
      totalParts: 1247,
      goodParts: 1160,
      defectParts: 87,
    },
    {
      machineId: 'M002',
      machineName: 'CNC Lathe #2',
      oee: 82.4,
      availability: 92.0,
      performance: 95.8,
      quality: 93.6,
      plannedProductionTime: 480,
      actualRuntime: 442,
      downtime: 38,
      idealCycleTime: 98,
      actualCycleTime: 102,
      totalParts: 892,
      goodParts: 835,
      defectParts: 57,
    },
    {
      machineId: 'M003',
      machineName: 'Press #1',
      oee: 65.2,
      availability: 78.3,
      performance: 88.2,
      quality: 94.5,
      plannedProductionTime: 480,
      actualRuntime: 376,
      downtime: 104,
      idealCycleTime: 35,
      actualCycleTime: 40,
      totalParts: 645,
      goodParts: 610,
      defectParts: 35,
    },
  ];

  const avgOEE = oeeData.reduce((sum, d) => sum + d.oee, 0) / oeeData.length;

  const getOEEColor = (oee: number): string => {
    if (oee >= 85) return 'text-green-600';
    if (oee >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOEEBgColor = (oee: number): string => {
    if (oee >= 85) return 'bg-green-500';
    if (oee >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">OEE Analytics & Drill-Down</h2>
            <p className="text-orange-100">Overall Equipment Effectiveness monitoring</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average OEE</p>
              <p className={`text-2xl font-bold ${getOEEColor(avgOEE)}`}>{avgOEE.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Availability</p>
              <p className="text-2xl font-bold text-green-600">
                {(oeeData.reduce((sum, d) => sum + d.availability, 0) / oeeData.length).toFixed(1)}%
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-purple-600">
                {(oeeData.reduce((sum, d) => sum + d.performance, 0) / oeeData.length).toFixed(1)}%
              </p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Quality</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(oeeData.reduce((sum, d) => sum + d.quality, 0) / oeeData.length).toFixed(1)}%
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">OEE Breakdown by Machine</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {oeeData.map((machine) => (
            <div key={machine.machineId} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{machine.machineName}</h4>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Overall OEE</div>
                  <div className={`text-3xl font-bold ${getOEEColor(machine.oee)}`}>{machine.oee.toFixed(1)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Availability</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-700">{machine.availability.toFixed(1)}%</span>
                    <div className="text-xs text-gray-600">
                      <div>Runtime: {machine.actualRuntime}m</div>
                      <div>Downtime: {machine.downtime}m</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${machine.availability}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Performance</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-700">{machine.performance.toFixed(1)}%</span>
                    <div className="text-xs text-gray-600">
                      <div>Ideal: {machine.idealCycleTime}s</div>
                      <div>Actual: {machine.actualCycleTime}s</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${machine.performance}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Quality</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-700">{machine.quality.toFixed(1)}%</span>
                    <div className="text-xs text-gray-600">
                      <div>Good: {machine.goodParts}</div>
                      <div>Defects: {machine.defectParts}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${machine.quality}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Planned Time</div>
                  <div className="font-semibold">{machine.plannedProductionTime} min</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Total Parts</div>
                  <div className="font-semibold">{machine.totalParts}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Good Parts</div>
                  <div className="font-semibold text-green-600">{machine.goodParts}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">Defect Rate</div>
                  <div className="font-semibold text-red-600">{((machine.defectParts / machine.totalParts) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OEE Formula & Calculation</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded">
            <strong>OEE = Availability × Performance × Quality</strong>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-semibold mb-1">Availability</div>
              <div className="text-xs">= (Runtime / Planned Production Time) × 100</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-semibold mb-1">Performance</div>
              <div className="text-xs">= (Ideal Cycle Time / Actual Cycle Time) × 100</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <div className="font-semibold mb-1">Quality</div>
              <div className="text-xs">= (Good Parts / Total Parts) × 100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OEEAnalytics;
