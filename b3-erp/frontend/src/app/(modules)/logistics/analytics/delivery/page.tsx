'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  TrendingDown
} from 'lucide-react';

interface DeliveryMetrics {
  period: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  failedDeliveries: number;
  onTimePercentage: number;
  avgDeliveryTime: number; // hours
  totalDistance: number; // km
  avgDistance: number; // km
  totalCost: number; // ₹
  costPerDelivery: number; // ₹
  customerSatisfaction: number; // out of 5
}

interface RoutePerformance {
  id: number;
  routeName: string;
  origin: string;
  destination: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  avgDeliveryTime: number; // hours
  avgDistance: number; // km
  onTimePercentage: number;
  fuelEfficiency: number; // km/L
  avgCostPerTrip: number; // ₹
  rating: number; // out of 5
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface DeliveryTrend {
  month: string;
  total: number;
  onTime: number;
  late: number;
  failed: number;
  onTimePercentage: number;
}

export default function DeliveryAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  const currentMetrics: DeliveryMetrics = {
    period: 'Last 30 Days',
    totalDeliveries: 1842,
    onTimeDeliveries: 1703,
    lateDeliveries: 115,
    failedDeliveries: 24,
    onTimePercentage: 92.5,
    avgDeliveryTime: 18.5,
    totalDistance: 458900,
    avgDistance: 249,
    totalCost: 27534000,
    costPerDelivery: 14950,
    customerSatisfaction: 4.3
  };

  const previousMetrics: DeliveryMetrics = {
    period: 'Previous 30 Days',
    totalDeliveries: 1756,
    onTimeDeliveries: 1568,
    lateDeliveries: 142,
    failedDeliveries: 46,
    onTimePercentage: 89.3,
    avgDeliveryTime: 20.2,
    totalDistance: 442800,
    avgDistance: 252,
    totalCost: 26553600,
    costPerDelivery: 15120,
    customerSatisfaction: 4.1
  };

  const [trends, setTrends] = useState<DeliveryTrend[]>([
    {
      month: 'Apr 2024',
      total: 1654,
      onTime: 1428,
      late: 178,
      failed: 48,
      onTimePercentage: 86.3
    },
    {
      month: 'May 2024',
      total: 1702,
      onTime: 1487,
      late: 165,
      failed: 50,
      onTimePercentage: 87.4
    },
    {
      month: 'Jun 2024',
      total: 1756,
      onTime: 1568,
      late: 142,
      failed: 46,
      onTimePercentage: 89.3
    },
    {
      month: 'Jul 2024',
      total: 1798,
      onTime: 1612,
      late: 138,
      failed: 48,
      onTimePercentage: 89.6
    },
    {
      month: 'Aug 2024',
      total: 1820,
      onTime: 1656,
      late: 125,
      failed: 39,
      onTimePercentage: 91.0
    },
    {
      month: 'Sep 2024',
      total: 1842,
      onTime: 1703,
      late: 115,
      failed: 24,
      onTimePercentage: 92.5
    }
  ]);

  const [routePerformance, setRoutePerformance] = useState<RoutePerformance[]>([
    {
      id: 1,
      routeName: 'Mumbai-Pune Express',
      origin: 'Mumbai DC',
      destination: 'Pune Hub',
      totalDeliveries: 245,
      onTimeDeliveries: 238,
      avgDeliveryTime: 4.5,
      avgDistance: 148,
      onTimePercentage: 97.1,
      fuelEfficiency: 5.8,
      avgCostPerTrip: 8880,
      rating: 4.8,
      performance: 'excellent'
    },
    {
      id: 2,
      routeName: 'Delhi-Jaipur Highway',
      origin: 'Delhi Hub',
      destination: 'Jaipur Center',
      totalDeliveries: 198,
      onTimeDeliveries: 186,
      avgDeliveryTime: 5.8,
      avgDistance: 268,
      onTimePercentage: 93.9,
      fuelEfficiency: 5.2,
      avgCostPerTrip: 16080,
      rating: 4.5,
      performance: 'excellent'
    },
    {
      id: 3,
      routeName: 'Bangalore-Chennai Corridor',
      origin: 'Bangalore Plant',
      destination: 'Chennai Port',
      totalDeliveries: 312,
      onTimeDeliveries: 288,
      avgDeliveryTime: 7.2,
      avgDistance: 346,
      onTimePercentage: 92.3,
      fuelEfficiency: 5.0,
      avgCostPerTrip: 20760,
      rating: 4.6,
      performance: 'excellent'
    },
    {
      id: 4,
      routeName: 'Kolkata-Bhubaneswar Route',
      origin: 'Kolkata Depot',
      destination: 'Bhubaneswar Hub',
      totalDeliveries: 156,
      onTimeDeliveries: 140,
      avgDeliveryTime: 9.5,
      avgDistance: 442,
      onTimePercentage: 89.7,
      fuelEfficiency: 4.8,
      avgCostPerTrip: 26520,
      rating: 4.2,
      performance: 'good'
    },
    {
      id: 5,
      routeName: 'Ahmedabad-Mumbai Industrial',
      origin: 'Ahmedabad Hub',
      destination: 'Mumbai Industrial',
      totalDeliveries: 228,
      onTimeDeliveries: 205,
      avgDeliveryTime: 9.8,
      avgDistance: 524,
      onTimePercentage: 89.9,
      fuelEfficiency: 4.5,
      avgCostPerTrip: 31440,
      rating: 4.3,
      performance: 'good'
    },
    {
      id: 6,
      routeName: 'Hyderabad-Vijayawada',
      origin: 'Hyderabad Workshop',
      destination: 'Vijayawada Center',
      totalDeliveries: 124,
      onTimeDeliveries: 106,
      avgDeliveryTime: 6.2,
      avgDistance: 274,
      onTimePercentage: 85.5,
      fuelEfficiency: 5.1,
      avgCostPerTrip: 16440,
      rating: 3.9,
      performance: 'average'
    },
    {
      id: 7,
      routeName: 'Pune-Goa Coastal',
      origin: 'Pune Hub',
      destination: 'Goa Port',
      totalDeliveries: 89,
      onTimeDeliveries: 78,
      avgDeliveryTime: 11.5,
      avgDistance: 448,
      onTimePercentage: 87.6,
      fuelEfficiency: 4.6,
      avgCostPerTrip: 26880,
      rating: 4.1,
      performance: 'good'
    },
    {
      id: 8,
      routeName: 'Chennai-Coimbatore Inland',
      origin: 'Chennai Port',
      destination: 'Coimbatore Plant',
      totalDeliveries: 178,
      onTimeDeliveries: 145,
      avgDeliveryTime: 8.8,
      avgDistance: 498,
      onTimePercentage: 81.5,
      fuelEfficiency: 4.4,
      avgCostPerTrip: 29880,
      rating: 3.7,
      performance: 'average'
    }
  ]);

  const getPerformanceColor = (performance: string) => {
    const colors: { [key: string]: string } = {
      'excellent': 'text-green-600 bg-green-50 border-green-200',
      'good': 'text-blue-600 bg-blue-50 border-blue-200',
      'average': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'poor': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[performance] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getTrendIcon = (current: number, previous: number, reverse: boolean = false) => {
    const change = current - previous;
    if (reverse) {
      return change < 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return change > 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span>Delivery Analytics</span>
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive delivery performance metrics and KPIs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            <option value="north">North India</option>
            <option value="south">South India</option>
            <option value="east">East India</option>
            <option value="west">West India</option>
          </select>

          <select
            value={selectedVehicleType}
            onChange={(e) => setSelectedVehicleType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Vehicle Types</option>
            <option value="truck">Trucks</option>
            <option value="container">Containers</option>
            <option value="trailer">Trailers</option>
          </select>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="flex items-center space-x-1">
              {getTrendIcon(currentMetrics.onTimePercentage, previousMetrics.onTimePercentage)}
              <span className="text-sm text-green-600">
                {calculateChange(currentMetrics.onTimePercentage, previousMetrics.onTimePercentage)}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900">{currentMetrics.onTimePercentage}%</div>
          <div className="text-sm font-medium text-green-700">On-Time Delivery Rate</div>
          <div className="text-xs text-green-600 mt-1">{currentMetrics.onTimeDeliveries} of {currentMetrics.totalDeliveries} deliveries</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="flex items-center space-x-1">
              {getTrendIcon(previousMetrics.avgDeliveryTime, currentMetrics.avgDeliveryTime, true)}
              <span className="text-sm text-blue-600">
                {Math.abs(parseFloat(calculateChange(currentMetrics.avgDeliveryTime, previousMetrics.avgDeliveryTime)))}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{currentMetrics.avgDeliveryTime}h</div>
          <div className="text-sm font-medium text-blue-700">Avg Delivery Time</div>
          <div className="text-xs text-blue-600 mt-1">Target: ≤20 hours</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-600" />
            <div className="flex items-center space-x-1">
              {getTrendIcon(currentMetrics.totalDeliveries, previousMetrics.totalDeliveries)}
              <span className="text-sm text-purple-600">
                {calculateChange(currentMetrics.totalDeliveries, previousMetrics.totalDeliveries)}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900">{currentMetrics.totalDeliveries.toLocaleString()}</div>
          <div className="text-sm font-medium text-purple-700">Total Deliveries</div>
          <div className="text-xs text-purple-600 mt-1">{currentMetrics.totalDistance.toLocaleString()} km covered</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="flex items-center space-x-1">
              {getTrendIcon(previousMetrics.failedDeliveries, currentMetrics.failedDeliveries, true)}
              <span className="text-sm text-orange-600">
                {Math.abs(parseFloat(calculateChange(currentMetrics.failedDeliveries, previousMetrics.failedDeliveries)))}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-900">{currentMetrics.failedDeliveries}</div>
          <div className="text-sm font-medium text-orange-700">Failed Deliveries</div>
          <div className="text-xs text-orange-600 mt-1">{((currentMetrics.failedDeliveries/currentMetrics.totalDeliveries)*100).toFixed(1)}% failure rate</div>
        </div>
      </div>

      {/* Delivery Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Performance Trends</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">On-Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600">Failed</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 w-24">{trend.month}</span>
                <span className="text-gray-600">{trend.total} deliveries</span>
                <span className="font-semibold text-green-600">{trend.onTimePercentage}% on-time</span>
              </div>
              <div className="flex items-center space-x-1 h-8">
                <div 
                  className="bg-green-500 h-full rounded-l flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(trend.onTime / trend.total) * 100}%` }}
                >
                  {trend.onTime > 0 && trend.onTime}
                </div>
                <div 
                  className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(trend.late / trend.total) * 100}%` }}
                >
                  {trend.late > 0 && trend.late}
                </div>
                <div 
                  className="bg-red-500 h-full rounded-r flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(trend.failed / trend.total) * 100}%` }}
                >
                  {trend.failed > 0 && trend.failed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Route Performance Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Performance metrics by route</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routePerformance.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{route.routeName}</div>
                    <div className="text-sm text-gray-600">{route.origin} → {route.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.totalDeliveries}</div>
                    <div className="text-xs text-green-600">{route.onTimeDeliveries} on-time</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">{route.onTimePercentage}%</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${route.onTimePercentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.avgDeliveryTime}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.avgDistance} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.fuelEfficiency} km/L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{route.avgCostPerTrip.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-gray-900">{route.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(route.performance)}`}>
                      {route.performance.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">On-Time Performance</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Track on-time delivery rates with trend analysis and route-wise performance metrics.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Real-time on-time percentage tracking</div>
            <div>• Historical trend analysis</div>
            <div>• Route performance comparison</div>
            <div>• Driver performance impact</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Delivery Time Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Monitor average delivery times, delays, and identify bottlenecks in the delivery process.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Average delivery time by route</div>
            <div>• Delay pattern identification</div>
            <div>• Time zone impact analysis</div>
            <div>• Seasonal variations tracking</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Failure Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Analyze failed deliveries, identify root causes, and implement corrective actions.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Failed delivery tracking</div>
            <div>• Root cause analysis</div>
            <div>• Customer feedback integration</div>
            <div>• Corrective action monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
