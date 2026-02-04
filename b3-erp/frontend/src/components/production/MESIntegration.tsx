'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Wifi, WifiOff, TrendingUp, Download, RefreshCw, Settings, Play, Pause, AlertTriangle } from 'lucide-react';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error';
export type DataStreamType = 'plc' | 'scada' | 'sensor' | 'machine';

export interface MachineData {
  machineId: string;
  machineName: string;
  status: 'running' | 'idle' | 'down' | 'setup';
  connectionStatus: ConnectionStatus;
  currentSpeed: number;
  targetSpeed: number;
  temperature: number;
  vibration: number;
  powerConsumption: number;
  cycleTime: number;
  partCount: number;
  lastUpdate: string;
}

export interface DataStream {
  id: string;
  source: string;
  type: DataStreamType;
  status: ConnectionStatus;
  dataPoints: number;
  updateFrequency: number;
  lastSync: string;
}

const MESIntegration: React.FC = () => {
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const machines: MachineData[] = [
    {
      machineId: 'M001',
      machineName: 'CNC Mill #1',
      status: 'running',
      connectionStatus: 'connected',
      currentSpeed: 4500 + (realTimeUpdate % 100),
      targetSpeed: 4800,
      temperature: 65 + (realTimeUpdate % 5),
      vibration: 0.8,
      powerConsumption: 12.5,
      cycleTime: 145,
      partCount: 1247 + realTimeUpdate,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      machineId: 'M002',
      machineName: 'CNC Lathe #2',
      status: 'running',
      connectionStatus: 'connected',
      currentSpeed: 3200,
      targetSpeed: 3200,
      temperature: 58,
      vibration: 0.6,
      powerConsumption: 10.2,
      cycleTime: 98,
      partCount: 892 + realTimeUpdate,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      machineId: 'M003',
      machineName: 'Press #1',
      status: 'idle',
      connectionStatus: 'connected',
      currentSpeed: 0,
      targetSpeed: 0,
      temperature: 42,
      vibration: 0.1,
      powerConsumption: 2.1,
      cycleTime: 0,
      partCount: 645,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      machineId: 'M004',
      machineName: 'Grinder #1',
      status: 'down',
      connectionStatus: 'error',
      currentSpeed: 0,
      targetSpeed: 2400,
      temperature: 38,
      vibration: 0,
      powerConsumption: 0,
      cycleTime: 0,
      partCount: 234,
      lastUpdate: '10 min ago',
    },
  ];

  const dataStreams: DataStream[] = [
    { id: 'DS001', source: 'Siemens S7-1500 PLC', type: 'plc', status: 'connected', dataPoints: 1247, updateFrequency: 1, lastSync: '2 sec ago' },
    { id: 'DS002', source: 'Rockwell ControlLogix PLC', type: 'plc', status: 'connected', dataPoints: 892, updateFrequency: 1, lastSync: '1 sec ago' },
    { id: 'DS003', source: 'SCADA System - Main', type: 'scada', status: 'connected', dataPoints: 3456, updateFrequency: 5, lastSync: '3 sec ago' },
    { id: 'DS004', source: 'IoT Sensor Network', type: 'sensor', status: 'connected', dataPoints: 8923, updateFrequency: 10, lastSync: '8 sec ago' },
    { id: 'DS005', source: 'Grinder Control System', type: 'machine', status: 'error', dataPoints: 0, updateFrequency: 1, lastSync: '10 min ago' },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': case 'connected': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'down': case 'disconnected': case 'error': return 'bg-red-100 text-red-800';
      case 'setup': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleRefreshData = () => {
    console.log('Refreshing MES data...');
    alert('Refreshing real-time data from all connected machines and data streams...\n\nAll PLCs, SCADA systems, and sensors will be re-queried.');
  };

  const handleExportData = () => {
    console.log('Exporting MES data...');
    alert('Exporting MES Integration Report to Excel...\n\nIncludes:\n- Machine status and performance data\n- Connection logs\n- Real-time metrics\n- Data stream statistics');
  };

  const handleMESSettings = () => {
    console.log('Opening MES settings...');
    alert('MES Integration Settings\n\nConfigure:\n- Data collection intervals\n- Connection protocols\n- Alert thresholds\n- Data retention policies');
  };

  const handleViewMachine = (machine: MachineData) => {
    alert(`Machine Details: ${machine.machineName}\n\nMachine ID: ${machine.machineId}\nStatus: ${machine.status}\nConnection: ${machine.connectionStatus}\n\nCurrent Speed: ${machine.currentSpeed} RPM\nTarget Speed: ${machine.targetSpeed} RPM\nTemperature: ${machine.temperature}°C\nVibration: ${machine.vibration} mm/s\nPower: ${machine.powerConsumption} kW\nCycle Time: ${machine.cycleTime}s\nPart Count: ${machine.partCount}\n\nLast Update: ${machine.lastUpdate}`);
  };

  const handleStartMachine = (machine: MachineData) => {
    if (machine.status === 'running') {
      alert(`Machine ${machine.machineName} is already running.`);
      return;
    }
    if (machine.connectionStatus === 'error') {
      alert(`Cannot start ${machine.machineName}.\n\nConnection error detected. Please resolve connection issues first.`);
      return;
    }
    if (confirm(`Start machine ${machine.machineName}?\n\nThis will send a start command to the PLC.`)) {
      console.log('Starting machine:', machine);
      alert(`Start command sent to ${machine.machineName}!\n\nMachine is initializing...\nMonitoring real-time data stream.`);
    }
  };

  const handleStopMachine = (machine: MachineData) => {
    if (machine.status !== 'running') {
      alert(`Machine ${machine.machineName} is not currently running.`);
      return;
    }
    if (confirm(`Stop machine ${machine.machineName}?\n\nCurrent part count: ${machine.partCount}\n\nThis will send a stop command to the PLC.`)) {
      console.log('Stopping machine:', machine);
      alert(`Stop command sent to ${machine.machineName}!\n\nMachine is shutting down safely.\nCurrent work will be completed.`);
    }
  };

  const handleReportIssue = (machine: MachineData) => {
    alert(`Report Issue for ${machine.machineName}\n\nCurrent Status: ${machine.status}\nConnection: ${machine.connectionStatus}\n\nPlease describe the issue and it will be logged in the maintenance system.`);
  };

  const handleReconnectStream = (stream: DataStream) => {
    if (stream.status === 'connected') {
      alert(`Data stream ${stream.source} is already connected.\n\nStatus: Active\nData Points: ${stream.dataPoints.toLocaleString()}\nUpdate Frequency: ${stream.updateFrequency}s`);
      return;
    }
    if (confirm(`Attempt to reconnect data stream?\n\nSource: ${stream.source}\nType: ${stream.type}\n\nThis will attempt to re-establish the connection.`)) {
      console.log('Reconnecting stream:', stream);
      alert(`Reconnection initiated for ${stream.source}!\n\nAttempting to establish connection...\nPlease wait for connection verification.`);
    }
  };

  const handleStreamDetails = (stream: DataStream) => {
    alert(`Data Stream Details: ${stream.source}\n\nStream ID: ${stream.id}\nType: ${stream.type}\nStatus: ${stream.status}\n\nData Points Collected: ${stream.dataPoints.toLocaleString()}\nUpdate Frequency: ${stream.updateFrequency}s\nLast Sync: ${stream.lastSync}\n\nProtocol: OPC UA\nPort: 4840\nEncryption: TLS 1.3`);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">MES Integration & Shop Floor Data</h2>
              <p className="text-green-100">Real-time machine monitoring and data streaming</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleMESSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Machines</p>
              <p className="text-2xl font-bold text-green-600">
                {machines.filter(m => m.connectionStatus === 'connected').length}/{machines.length}
              </p>
            </div>
            <Wifi className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Running</p>
              <p className="text-2xl font-bold text-blue-600">
                {machines.filter(m => m.status === 'running').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Down/Error</p>
              <p className="text-2xl font-bold text-red-600">
                {machines.filter(m => m.status === 'down' || m.connectionStatus === 'error').length}
              </p>
            </div>
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parts Today</p>
              <p className="text-2xl font-bold text-purple-600">
                {machines.reduce((sum, m) => sum + m.partCount, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Machine Data</h3>
            <span className="text-sm text-gray-600">Auto-updating every 3 seconds</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Machine</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Connection</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Speed (RPM)</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Temp (°C)</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Vibration</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Power (kW)</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Cycle Time</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Part Count</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Last Update</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {machines.map((machine) => (
                <tr key={machine.machineId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{machine.machineName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(machine.connectionStatus)}`}>
                      {machine.connectionStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="text-gray-900">{machine.currentSpeed} / {machine.targetSpeed}</div>
                    <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(machine.currentSpeed / machine.targetSpeed) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm font-medium ${machine.temperature > 70 ? 'text-red-600' : machine.temperature > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {machine.temperature}°C
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{machine.vibration} mm/s</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{machine.powerConsumption} kW</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{machine.cycleTime > 0 ? `${machine.cycleTime}s` : '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{machine.partCount}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{machine.lastUpdate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewMachine(machine)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <Database className="h-4 w-4" />
                      </button>
                      {machine.status === 'running' ? (
                        <button
                          onClick={() => handleStopMachine(machine)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          title="Stop Machine"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartMachine(machine)}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Start Machine"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {(machine.status === 'down' || machine.connectionStatus === 'error') && (
                        <button
                          onClick={() => handleReportIssue(machine)}
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          title="Report Issue"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Stream Connections</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Points</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Update Freq (sec)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Sync</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataStreams.map((stream) => (
                <tr key={stream.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{stream.source}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase">
                      {stream.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(stream.status)}`}>
                      {stream.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stream.dataPoints.toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{stream.updateFrequency}s</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{stream.lastSync}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStreamDetails(stream)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="View Stream Details"
                      >
                        <Database className="h-4 w-4" />
                      </button>
                      {stream.status === 'error' && (
                        <button
                          onClick={() => handleReconnectStream(stream)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Reconnect Stream"
                        >
                          <Wifi className="h-4 w-4" />
                          <span>Reconnect</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MESIntegration;
