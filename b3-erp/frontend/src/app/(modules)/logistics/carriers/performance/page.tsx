'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, Package, Truck, Star, AlertTriangle, Filter } from 'lucide-react';

interface CarrierPerformance {
  id: string;
  carrier: string;
  serviceType: string;
  totalShipments: number;
  delivered: number;
  delayed: number;
  failed: number;
  onTimeDelivery: number;
  avgTransitTime: number;
  expectedTransitTime: number;
  damageRate: number;
  customerRating: number;
  totalCost: number;
  costPerShipment: number;
  monthlyTrend: number;
  lastUpdated: string;
}

export default function CarrierPerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const performanceData: CarrierPerformance[] = [
    {
      id: '1',
      carrier: 'Blue Dart Express',
      serviceType: 'Express',
      totalShipments: 1245,
      delivered: 1198,
      delayed: 35,
      failed: 12,
      onTimeDelivery: 96.2,
      avgTransitTime: 1.8,
      expectedTransitTime: 2.0,
      damageRate: 0.8,
      customerRating: 4.6,
      totalCost: 2845000,
      costPerShipment: 2285,
      monthlyTrend: 5.2,
      lastUpdated: '2025-10-21'
    },
    {
      id: '2',
      carrier: 'DHL Express',
      serviceType: 'Express',
      totalShipments: 980,
      delivered: 945,
      delayed: 28,
      failed: 7,
      onTimeDelivery: 96.4,
      avgTransitTime: 1.7,
      expectedTransitTime: 2.0,
      damageRate: 0.5,
      customerRating: 4.7,
      totalCost: 2548000,
      costPerShipment: 2600,
      monthlyTrend: 3.8,
      lastUpdated: '2025-10-21'
    },
    {
      id: '3',
      carrier: 'FedEx',
      serviceType: 'Express',
      totalShipments: 875,
      delivered: 842,
      delayed: 25,
      failed: 8,
      onTimeDelivery: 96.2,
      avgTransitTime: 1.9,
      expectedTransitTime: 2.0,
      damageRate: 0.7,
      customerRating: 4.5,
      totalCost: 2275000,
      costPerShipment: 2600,
      monthlyTrend: 2.1,
      lastUpdated: '2025-10-21'
    },
    {
      id: '4',
      carrier: 'DTDC Courier',
      serviceType: 'Standard',
      totalShipments: 1568,
      delivered: 1485,
      delayed: 65,
      failed: 18,
      onTimeDelivery: 94.7,
      avgTransitTime: 2.5,
      expectedTransitTime: 3.0,
      damageRate: 1.2,
      customerRating: 4.3,
      totalCost: 1880000,
      costPerShipment: 1199,
      monthlyTrend: 4.5,
      lastUpdated: '2025-10-21'
    },
    {
      id: '5',
      carrier: 'Indian Post',
      serviceType: 'Economy',
      totalShipments: 2145,
      delivered: 2012,
      delayed: 98,
      failed: 35,
      onTimeDelivery: 93.8,
      avgTransitTime: 5.2,
      expectedTransitTime: 6.0,
      damageRate: 1.8,
      customerRating: 4.1,
      totalCost: 1288000,
      costPerShipment: 600,
      monthlyTrend: 1.2,
      lastUpdated: '2025-10-21'
    },
    {
      id: '6',
      carrier: 'Blue Dart Express',
      serviceType: 'Standard',
      totalShipments: 1320,
      delivered: 1268,
      delayed: 42,
      failed: 10,
      onTimeDelivery: 96.1,
      avgTransitTime: 2.3,
      expectedTransitTime: 2.5,
      damageRate: 0.9,
      customerRating: 4.5,
      totalCost: 1980000,
      costPerShipment: 1500,
      monthlyTrend: 3.5,
      lastUpdated: '2025-10-21'
    },
    {
      id: '7',
      carrier: 'DHL Express',
      serviceType: 'Freight',
      totalShipments: 485,
      delivered: 470,
      delayed: 12,
      failed: 3,
      onTimeDelivery: 96.9,
      avgTransitTime: 3.2,
      expectedTransitTime: 4.0,
      damageRate: 0.4,
      customerRating: 4.8,
      totalCost: 1456000,
      costPerShipment: 3002,
      monthlyTrend: -1.2,
      lastUpdated: '2025-10-21'
    },
    {
      id: '8',
      carrier: 'FedEx',
      serviceType: 'Standard',
      totalShipments: 1125,
      delivered: 1065,
      delayed: 48,
      failed: 12,
      onTimeDelivery: 94.7,
      avgTransitTime: 2.6,
      expectedTransitTime: 3.0,
      damageRate: 1.1,
      customerRating: 4.4,
      totalCost: 1687500,
      costPerShipment: 1500,
      monthlyTrend: 2.8,
      lastUpdated: '2025-10-21'
    }
  ];

  const overallStats = {
    totalShipments: performanceData.reduce((sum, p) => sum + p.totalShipments, 0),
    totalDelivered: performanceData.reduce((sum, p) => sum + p.delivered, 0),
    totalDelayed: performanceData.reduce((sum, p) => sum + p.delayed, 0),
    totalFailed: performanceData.reduce((sum, p) => sum + p.failed, 0),
    avgOnTimeDelivery: (performanceData.reduce((sum, p) => sum + p.onTimeDelivery, 0) / performanceData.length).toFixed(1),
    avgDamageRate: (performanceData.reduce((sum, p) => sum + p.damageRate, 0) / performanceData.length).toFixed(1),
    avgRating: (performanceData.reduce((sum, p) => sum + p.customerRating, 0) / performanceData.length).toFixed(1),
    totalCost: performanceData.reduce((sum, p) => sum + p.totalCost, 0)
  };

  const filteredPerformance = performanceData.filter(perf => {
    const matchesSearch =
      perf.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perf.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCarrier = carrierFilter === 'all' || perf.carrier === carrierFilter;
    const matchesService = serviceFilter === 'all' || perf.serviceType === serviceFilter;

    return matchesSearch && matchesCarrier && matchesService;
  });

  const getPerformanceColor = (value: number, threshold: number = 95) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold - 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrier Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and analyze carrier performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.totalShipments.toLocaleString()}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Shipments</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.totalDelivered.toLocaleString()}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Delivered</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.totalDelayed}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Delayed</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.totalFailed}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Failed</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.avgOnTimeDelivery}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">On-Time Delivery</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.avgDamageRate}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">Damage Rate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{overallStats.avgRating}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Rating</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(overallStats.totalCost / 1000000).toFixed(1)}M</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Cost</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by carrier or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Carriers</option>
              <option value="Blue Dart Express">Blue Dart Express</option>
              <option value="DHL Express">DHL Express</option>
              <option value="FedEx">FedEx</option>
              <option value="DTDC Courier">DTDC Courier</option>
              <option value="Indian Post">Indian Post</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="Express">Express</option>
              <option value="Standard">Standard</option>
              <option value="Economy">Economy</option>
              <option value="Freight">Freight</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Showing {filteredPerformance.length} of {performanceData.length} carriers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPerformance.map((perf) => (
          <div key={perf.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{perf.carrier}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{perf.serviceType} Service</p>
              </div>
              <div className="flex items-center gap-2">
                {perf.monthlyTrend >= 0 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">+{perf.monthlyTrend}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-semibold">{perf.monthlyTrend}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">Total Shipments</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">{perf.totalShipments.toLocaleString()}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">On-Time Delivery</p>
                </div>
                <p className={`text-2xl font-bold ${getPerformanceColor(perf.onTimeDelivery)}`}>{perf.onTimeDelivery}%</p>
                <p className="text-xs text-green-700 mt-0.5">{perf.delivered} delivered</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-purple-600 font-medium">Customer Rating</p>
                </div>
                <p className={`text-2xl font-bold ${getRatingColor(perf.customerRating)}`}>{perf.customerRating}/5.0</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(perf.customerRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-orange-600 font-medium">Avg Transit Time</p>
                </div>
                <p className="text-2xl font-bold text-orange-900">{perf.avgTransitTime} days</p>
                <p className="text-xs text-orange-700 mt-0.5">Expected: {perf.expectedTransitTime} days</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 mb-0.5">Delayed</p>
                <p className="text-lg font-bold text-yellow-600">{perf.delayed}</p>
                <p className="text-xs text-gray-500">{((perf.delayed / perf.totalShipments) * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 mb-0.5">Failed</p>
                <p className="text-lg font-bold text-red-600">{perf.failed}</p>
                <p className="text-xs text-gray-500">{((perf.failed / perf.totalShipments) * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 mb-0.5">Damage Rate</p>
                <p className="text-lg font-bold text-orange-600">{perf.damageRate}%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 mb-0.5">Total Cost</p>
                <p className="text-lg font-bold text-indigo-600">¹{(perf.totalCost / 1000).toFixed(0)}K</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 mb-0.5">Cost/Shipment</p>
                <p className="text-lg font-bold text-purple-600">¹{perf.costPerShipment}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Last updated: {perf.lastUpdated}</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                View Detailed Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPerformance.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No carrier performance data found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Performance Metrics Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="font-medium">On-Time Delivery:</span>
            <span>Percentage of shipments delivered within expected timeframe</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Avg Transit Time:</span>
            <span>Average days taken from pickup to delivery</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Damage Rate:</span>
            <span>Percentage of shipments with reported damage</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Customer Rating:</span>
            <span>Average customer satisfaction score (1-5 scale)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Monthly Trend:</span>
            <span>Performance improvement or decline compared to previous month</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Cost Per Shipment:</span>
            <span>Average shipping cost calculated per shipment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
