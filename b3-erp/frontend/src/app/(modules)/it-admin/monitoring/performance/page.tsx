'use client';

import { useState } from 'react';
import { Gauge, TrendingUp, TrendingDown, Activity, Zap, Clock, Database, Cpu, HardDrive, Globe, Filter, Download, Calendar, BarChart3 } from 'lucide-react';

interface PerformanceMetric {
  id: string;
  metric: string;
  category: string;
  current: number;
  average: number;
  peak: number;
  unit: string;
  trend: string;
  status: string;
  threshold: number;
}

interface PerformanceHistory {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  throughput: number;
}

interface PerformanceStats {
  avgCpu: number;
  avgMemory: number;
  avgResponseTime: number;
  avgThroughput: number;
  peakCpu: number;
  peakMemory: number;
}

const PerformanceMonitoringPage = () => {
  const [timeRange, setTimeRange] = useState('1hour');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [metrics] = useState<PerformanceMetric[]>([
    {
      id: '1',
      metric: 'CPU Usage',
      category: 'System',
      current: 45,
      average: 42,
      peak: 78,
      unit: '%',
      trend: 'stable',
      status: 'normal',
      threshold: 80,
    },
    {
      id: '2',
      metric: 'Memory Usage',
      category: 'System',
      current: 68,
      average: 65,
      peak: 85,
      unit: '%',
      trend: 'increasing',
      status: 'normal',
      threshold: 85,
    },
    {
      id: '3',
      metric: 'Disk I/O',
      category: 'System',
      current: 234,
      average: 210,
      peak: 450,
      unit: 'MB/s',
      trend: 'stable',
      status: 'normal',
      threshold: 500,
    },
    {
      id: '4',
      metric: 'Network Bandwidth',
      category: 'Network',
      current: 156,
      average: 142,
      peak: 320,
      unit: 'Mbps',
      trend: 'stable',
      status: 'normal',
      threshold: 500,
    },
    {
      id: '5',
      metric: 'Response Time',
      category: 'Application',
      current: 145,
      average: 132,
      peak: 480,
      unit: 'ms',
      trend: 'stable',
      status: 'normal',
      threshold: 500,
    },
    {
      id: '6',
      metric: 'Throughput',
      category: 'Application',
      current: 1250,
      average: 1180,
      peak: 2340,
      unit: 'req/s',
      trend: 'increasing',
      status: 'normal',
      threshold: 3000,
    },
    {
      id: '7',
      metric: 'Database Connections',
      category: 'Database',
      current: 45,
      average: 42,
      peak: 95,
      unit: 'connections',
      trend: 'stable',
      status: 'normal',
      threshold: 100,
    },
    {
      id: '8',
      metric: 'Query Response Time',
      category: 'Database',
      current: 23,
      average: 20,
      peak: 156,
      unit: 'ms',
      trend: 'stable',
      status: 'normal',
      threshold: 200,
    },
    {
      id: '9',
      metric: 'Cache Hit Rate',
      category: 'Cache',
      current: 94,
      average: 92,
      peak: 98,
      unit: '%',
      trend: 'stable',
      status: 'optimal',
      threshold: 80,
    },
    {
      id: '10',
      metric: 'Queue Length',
      category: 'Application',
      current: 234,
      average: 210,
      peak: 890,
      unit: 'messages',
      trend: 'increasing',
      status: 'warning',
      threshold: 1000,
    },
    {
      id: '11',
      metric: 'Error Rate',
      category: 'Application',
      current: 0.8,
      average: 0.6,
      peak: 2.3,
      unit: '%',
      trend: 'increasing',
      status: 'warning',
      threshold: 1.0,
    },
    {
      id: '12',
      metric: 'SSL Connections',
      category: 'Network',
      current: 456,
      average: 420,
      peak: 780,
      unit: 'connections',
      trend: 'stable',
      status: 'normal',
      threshold: 1000,
    },
  ]);

  const [history] = useState<PerformanceHistory[]>([
    { timestamp: '18:00', cpu: 42, memory: 65, disk: 210, network: 142, responseTime: 132, throughput: 1180 },
    { timestamp: '18:15', cpu: 45, memory: 66, disk: 215, network: 145, responseTime: 135, throughput: 1200 },
    { timestamp: '18:30', cpu: 48, memory: 68, disk: 220, network: 150, responseTime: 140, throughput: 1220 },
    { timestamp: '18:45', cpu: 46, memory: 67, disk: 218, network: 148, responseTime: 138, throughput: 1210 },
    { timestamp: '19:00', cpu: 45, memory: 68, disk: 234, network: 156, responseTime: 145, throughput: 1250 },
  ]);

  const stats: PerformanceStats = {
    avgCpu: Math.round(metrics.find(m => m.metric === 'CPU Usage')?.average || 0),
    avgMemory: Math.round(metrics.find(m => m.metric === 'Memory Usage')?.average || 0),
    avgResponseTime: Math.round(metrics.find(m => m.metric === 'Response Time')?.average || 0),
    avgThroughput: Math.round(metrics.find(m => m.metric === 'Throughput')?.average || 0),
    peakCpu: Math.round(metrics.find(m => m.metric === 'CPU Usage')?.peak || 0),
    peakMemory: Math.round(metrics.find(m => m.metric === 'Memory Usage')?.peak || 0),
  };

  const filteredMetrics = metrics.filter(metric => {
    const matchesCategory = filterCategory === 'all' || metric.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || metric.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'optimal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUsageColor = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100;
    if (percentage < 70) return 'bg-green-600';
    if (percentage < 85) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const handleExport = () => {
    alert('Exporting performance report...');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Gauge className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
              <p className="text-gray-600">Real-time system performance metrics and analytics</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg CPU</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgCpu}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Memory</span>
            <Database className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgMemory}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Peak CPU</span>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.peakCpu}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Peak Memory</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.peakMemory}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Response</span>
            <Zap className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}ms</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Throughput</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{stats.avgThroughput}</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1hour">Last Hour</option>
            <option value="6hours">Last 6 Hours</option>
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>
        <div className="space-y-4">
          {history.map((point, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-600">{point.timestamp}</div>
              <div className="flex-1 grid grid-cols-6 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">CPU</span>
                    <span className="text-xs font-medium text-gray-900">{point.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${point.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Memory</span>
                    <span className="text-xs font-medium text-gray-900">{point.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${point.memory}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Disk</span>
                    <span className="text-xs font-medium text-gray-900">{point.disk}MB/s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(point.disk / 500) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Network</span>
                    <span className="text-xs font-medium text-gray-900">{point.network}Mbps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${(point.network / 500) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Response</span>
                    <span className="text-xs font-medium text-gray-900">{point.responseTime}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(point.responseTime / 500) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Throughput</span>
                    <span className="text-xs font-medium text-gray-900">{point.throughput}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(point.throughput / 3000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="System">System</option>
            <option value="Application">Application</option>
            <option value="Database">Database</option>
            <option value="Network">Network</option>
            <option value="Cache">Cache</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="optimal">Optimal</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{metric.metric}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {metric.current}
                  <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
                </span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm text-gray-600 capitalize">{metric.trend}</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getUsageColor(metric.current, metric.threshold)}`}
                  style={{ width: `${(metric.current / metric.threshold) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Average</div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.average}
                  <span className="text-xs text-gray-500 ml-0.5">{metric.unit}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Peak</div>
                <div className="text-sm font-medium text-red-600">
                  {metric.peak}
                  <span className="text-xs text-red-400 ml-0.5">{metric.unit}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Threshold</div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.threshold}
                  <span className="text-xs text-gray-500 ml-0.5">{metric.unit}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                  {metric.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Real-time
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <Gauge className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No metrics found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitoringPage;
