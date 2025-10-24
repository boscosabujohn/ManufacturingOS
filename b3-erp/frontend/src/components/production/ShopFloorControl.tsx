'use client';

import React from 'react';
import { Monitor, Play, Pause, CheckCircle, XCircle } from 'lucide-react';

export interface Workstation {
  id: string;
  name: string;
  operator: string;
  currentJob: string;
  productName: string;
  status: 'running' | 'paused' | 'idle' | 'complete';
  quantity: { target: number; completed: number };
  timeRemaining: number;
  efficiency: number;
}

const ShopFloorControl: React.FC = () => {
  const workstations: Workstation[] = [
    { id: 'WS001', name: 'CNC-01', operator: 'Mike Chen', currentJob: 'WO-2025-1234', productName: 'Gear Assembly', status: 'running', quantity: { target: 500, completed: 285 }, timeRemaining: 125, efficiency: 92 },
    { id: 'WS002', name: 'LATHE-01', operator: 'Tom Wilson', currentJob: 'WO-2025-1235', productName: 'Shaft Turning', status: 'running', quantity: { target: 300, completed: 187 }, timeRemaining: 98, efficiency: 88 },
    { id: 'WS003', name: 'MILL-01', operator: 'Sarah Lee', currentJob: 'WO-2025-1236', productName: 'Housing Machining', status: 'paused', quantity: { target: 200, completed: 95 }, timeRemaining: 180, efficiency: 75 },
    { id: 'WS004', name: 'GRIND-01', operator: 'Unassigned', currentJob: '-', productName: '-', status: 'idle', quantity: { target: 0, completed: 0 }, timeRemaining: 0, efficiency: 0 },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <Monitor className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Shop Floor Control</h2>
            <p className="text-teal-100">Real-time workstation monitoring and control</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workstations.map((ws) => (
          <div key={ws.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`px-6 py-4 ${ws.status === 'running' ? 'bg-green-600' : ws.status === 'paused' ? 'bg-yellow-600' : ws.status === 'idle' ? 'bg-gray-600' : 'bg-blue-600'} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{ws.name}</h3>
                  <p className="text-sm opacity-90">Operator: {ws.operator}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ws.status)} bg-white bg-opacity-90`}>
                  {ws.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-gray-600">Current Job</div>
                <div className="font-semibold text-gray-900">{ws.currentJob}</div>
                <div className="text-sm text-gray-600">{ws.productName}</div>
              </div>

              {ws.status !== 'idle' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold">{ws.quantity.completed} / {ws.quantity.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(ws.quantity.completed / ws.quantity.target) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">Time Remaining</div>
                      <div className="text-lg font-bold text-blue-700">{ws.timeRemaining} min</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-sm text-gray-600">Efficiency</div>
                      <div className={`text-lg font-bold ${ws.efficiency >= 85 ? 'text-green-700' : ws.efficiency >= 70 ? 'text-yellow-700' : 'text-red-700'}`}>{ws.efficiency}%</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {ws.status === 'running' ? (
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <Play className="h-4 w-4" />
                        <span>Start</span>
                      </button>
                    )}
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopFloorControl;
