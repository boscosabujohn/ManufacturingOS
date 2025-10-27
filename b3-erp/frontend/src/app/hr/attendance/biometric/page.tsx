'use client';

import { useState, useMemo } from 'react';
import { Fingerprint, Plus, Edit, Activity, MapPin, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

interface BiometricDevice {
  id: string;
  deviceId: string;
  name: string;
  model: string;
  location: string;
  ipAddress: string;
  port: number;
  status: 'online' | 'offline' | 'error';
  lastSyncTime: string;
  totalPunchesToday: number;
  enrolledUsers: number;
  storageUsed: number;
  batteryBackup: boolean;
  installedDate: string;
}

export default function BiometricDevicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockDevices: BiometricDevice[] = [
    {
      id: 'DEV001', deviceId: 'BIO-1001', name: 'Main Gate Entry', model: 'ZKTeco K40',
      location: 'Main Entrance', ipAddress: '192.168.1.100', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:30:00', totalPunchesToday: 452, enrolledUsers: 125,
      storageUsed: 65, batteryBackup: true, installedDate: '2024-01-15'
    },
    {
      id: 'DEV002', deviceId: 'BIO-1002', name: 'Main Gate Exit', model: 'ZKTeco K40',
      location: 'Main Entrance', ipAddress: '192.168.1.101', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:29:00', totalPunchesToday: 448, enrolledUsers: 125,
      storageUsed: 63, batteryBackup: true, installedDate: '2024-01-15'
    },
    {
      id: 'DEV003', deviceId: 'BIO-1003', name: 'Production Floor A', model: 'Anviz M5',
      location: 'Plant A - Production', ipAddress: '192.168.1.102', port: 5005, status: 'online',
      lastSyncTime: '2024-11-20T15:28:00', totalPunchesToday: 312, enrolledUsers: 78,
      storageUsed: 45, batteryBackup: false, installedDate: '2024-02-01'
    },
    {
      id: 'DEV004', deviceId: 'BIO-1004', name: 'Production Floor B', model: 'Anviz M5',
      location: 'Plant B - Production', ipAddress: '192.168.1.103', port: 5005, status: 'online',
      lastSyncTime: '2024-11-20T15:27:00', totalPunchesToday: 298, enrolledUsers: 72,
      storageUsed: 42, batteryBackup: false, installedDate: '2024-02-01'
    },
    {
      id: 'DEV005', deviceId: 'BIO-1005', name: 'Quality Lab', model: 'Realtime T502',
      location: 'Quality Department', ipAddress: '192.168.1.104', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:31:00', totalPunchesToday: 48, enrolledUsers: 15,
      storageUsed: 12, batteryBackup: true, installedDate: '2024-01-20'
    },
    {
      id: 'DEV006', deviceId: 'BIO-1006', name: 'Office Block - Floor 1', model: 'ZKTeco F18',
      location: 'Office Building - Floor 1', ipAddress: '192.168.1.105', port: 4370, status: 'offline',
      lastSyncTime: '2024-11-20T12:15:00', totalPunchesToday: 0, enrolledUsers: 45,
      storageUsed: 28, batteryBackup: false, installedDate: '2024-03-10'
    },
    {
      id: 'DEV007', deviceId: 'BIO-1007', name: 'Office Block - Floor 2', model: 'ZKTeco F18',
      location: 'Office Building - Floor 2', ipAddress: '192.168.1.106', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:30:00', totalPunchesToday: 84, enrolledUsers: 42,
      storageUsed: 25, batteryBackup: false, installedDate: '2024-03-10'
    },
    {
      id: 'DEV008', deviceId: 'BIO-1008', name: 'Warehouse Entry', model: 'Anviz M3',
      location: 'Warehouse', ipAddress: '192.168.1.107', port: 5005, status: 'online',
      lastSyncTime: '2024-11-20T15:26:00', totalPunchesToday: 125, enrolledUsers: 32,
      storageUsed: 18, batteryBackup: true, installedDate: '2024-04-05'
    },
    {
      id: 'DEV009', deviceId: 'BIO-1009', name: 'Canteen Entry', model: 'Realtime T501',
      location: 'Canteen', ipAddress: '192.168.1.108', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:32:00', totalPunchesToday: 287, enrolledUsers: 125,
      storageUsed: 8, batteryBackup: false, installedDate: '2024-01-25'
    },
    {
      id: 'DEV010', deviceId: 'BIO-1010', name: 'Security Gate 1', model: 'ZKTeco K40',
      location: 'Security Post 1', ipAddress: '192.168.1.109', port: 4370, status: 'online',
      lastSyncTime: '2024-11-20T15:29:00', totalPunchesToday: 156, enrolledUsers: 125,
      storageUsed: 55, batteryBackup: true, installedDate: '2024-01-15'
    },
    {
      id: 'DEV011', deviceId: 'BIO-1011', name: 'Security Gate 2', model: 'ZKTeco K40',
      location: 'Security Post 2', ipAddress: '192.168.1.110', port: 4370, status: 'error',
      lastSyncTime: '2024-11-20T14:45:00', totalPunchesToday: 45, enrolledUsers: 125,
      storageUsed: 92, batteryBackup: true, installedDate: '2024-01-15'
    },
    {
      id: 'DEV012', deviceId: 'BIO-1012', name: 'IT Department', model: 'Anviz M5',
      location: 'IT Office', ipAddress: '192.168.1.111', port: 5005, status: 'online',
      lastSyncTime: '2024-11-20T15:31:00', totalPunchesToday: 36, enrolledUsers: 12,
      storageUsed: 15, batteryBackup: false, installedDate: '2024-02-15'
    }
  ];

  const filteredData = useMemo(() => {
    return mockDevices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const stats = {
    total: mockDevices.length,
    online: mockDevices.filter(d => d.status === 'online').length,
    offline: mockDevices.filter(d => d.status === 'offline').length,
    error: mockDevices.filter(d => d.status === 'error').length,
    totalPunches: mockDevices.reduce((sum, d) => sum + d.totalPunchesToday, 0)
  };

  const getStatusIcon = (status: string) => {
    if (status === 'online') return <Wifi className="w-4 h-4 text-green-500" />;
    if (status === 'offline') return <WifiOff className="w-4 h-4 text-red-500" />;
    return <AlertTriangle className="w-4 h-4 text-orange-500" />;
  };

  const getTimeSince = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const columns = [
    { key: 'name', label: 'Device Details', sortable: true,
      render: (v: string, row: BiometricDevice) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            row.status === 'online' ? 'bg-green-100' :
            row.status === 'offline' ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            <Fingerprint className={`w-5 h-5 ${
              row.status === 'online' ? 'text-green-600' :
              row.status === 'offline' ? 'text-red-600' : 'text-orange-600'
            }`} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{v}</div>
            <div className="text-xs text-gray-500">{row.deviceId} • {row.model}</div>
          </div>
        </div>
      )
    },
    { key: 'location', label: 'Location', sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{v}</span>
        </div>
      )
    },
    { key: 'ipAddress', label: 'Network', sortable: true,
      render: (v: string, row: BiometricDevice) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{v}:{row.port}</div>
          <div className="flex items-center gap-1 mt-1">
            {getStatusIcon(row.status)}
            <span className={`text-xs ${
              row.status === 'online' ? 'text-green-600' :
              row.status === 'offline' ? 'text-red-600' : 'text-orange-600'
            }`}>
              {row.status.toUpperCase()}
            </span>
          </div>
        </div>
      )
    },
    { key: 'totalPunchesToday', label: 'Today\'s Activity', sortable: true,
      render: (v: number, row: BiometricDevice) => (
        <div className="text-sm">
          <div className="font-semibold text-blue-600">{v} punches</div>
          <div className="text-xs text-gray-500">{row.enrolledUsers} users enrolled</div>
        </div>
      )
    },
    { key: 'storageUsed', label: 'Storage', sortable: true,
      render: (v: number) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{v}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className={`h-1.5 rounded-full ${
                v >= 90 ? 'bg-red-500' : v >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${v}%` }}
            ></div>
          </div>
        </div>
      )
    },
    { key: 'lastSyncTime', label: 'Last Sync', sortable: true,
      render: (v: string, row: BiometricDevice) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{getTimeSince(v)}</div>
          <div className="flex items-center gap-1 mt-1">
            {row.batteryBackup ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-gray-400" />
            )}
            <span className="text-xs text-gray-500">
              {row.batteryBackup ? 'Backup' : 'No backup'}
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Fingerprint className="h-8 w-8 text-blue-600" />
          Biometric Devices
        </h1>
        <p className="text-gray-600 mt-2">Manage and monitor biometric attendance devices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Devices</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
            </div>
            <Fingerprint className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">{stats.online}</p>
            </div>
            <Wifi className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
            </div>
            <WifiOff className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Issues</p>
              <p className="text-2xl font-bold text-orange-600">{stats.error}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Punches</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPunches.toLocaleString()}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.offline > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <WifiOff className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Device Connectivity Issue</h3>
              <p className="text-sm text-red-700">{stats.offline} device{stats.offline > 1 ? 's are' : ' is'} offline. Check network connectivity immediately.</p>
            </div>
          </div>
        </div>
      )}
      {stats.error > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">Device Error Detected</h3>
              <p className="text-sm text-orange-700">{stats.error} device{stats.error > 1 ? 's require' : ' requires'} attention. Storage may be full or device needs maintenance.</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by device name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Device
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Devices Table */}
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}
