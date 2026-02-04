'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, DollarSign, TrendingUp, TrendingDown, Package, Truck, MapPin, Calculator, Filter, Edit } from 'lucide-react';

interface CarrierRate {
  id: string;
  carrier: string;
  serviceType: 'express' | 'standard' | 'economy' | 'freight';
  zone: string;
  origin: string;
  destination: string;
  baseRate: number;
  perKgRate: number;
  fuelSurcharge: number;
  minWeight: number;
  maxWeight: number;
  volumetricDivisor: number;
  transitTime: string;
  effectiveFrom: string;
  effectiveTo: string;
  currency: string;
  isActive: boolean;
  lastUpdated: string;
  rateChange: number;
}

export default function CarrierRatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const carrierRates: CarrierRate[] = [
    {
      id: '1',
      carrier: 'Blue Dart Express',
      serviceType: 'express',
      zone: 'South Zone',
      origin: 'Chennai',
      destination: 'Bangalore',
      baseRate: 150,
      perKgRate: 45,
      fuelSurcharge: 12.5,
      minWeight: 0.5,
      maxWeight: 50,
      volumetricDivisor: 5000,
      transitTime: '1-2 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-15',
      rateChange: 5.2
    },
    {
      id: '2',
      carrier: 'DHL Express',
      serviceType: 'express',
      zone: 'National',
      origin: 'Chennai',
      destination: 'Delhi',
      baseRate: 280,
      perKgRate: 65,
      fuelSurcharge: 15.0,
      minWeight: 0.5,
      maxWeight: 100,
      volumetricDivisor: 5000,
      transitTime: '1-2 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-10',
      rateChange: -2.3
    },
    {
      id: '3',
      carrier: 'FedEx',
      serviceType: 'express',
      zone: 'West Zone',
      origin: 'Chennai',
      destination: 'Mumbai',
      baseRate: 250,
      perKgRate: 58,
      fuelSurcharge: 14.0,
      minWeight: 0.5,
      maxWeight: 70,
      volumetricDivisor: 5000,
      transitTime: '1-2 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-12',
      rateChange: 3.8
    },
    {
      id: '4',
      carrier: 'DTDC Courier',
      serviceType: 'standard',
      zone: 'South Zone',
      origin: 'Chennai',
      destination: 'Hyderabad',
      baseRate: 120,
      perKgRate: 35,
      fuelSurcharge: 10.0,
      minWeight: 0.5,
      maxWeight: 100,
      volumetricDivisor: 4500,
      transitTime: '2-3 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-18',
      rateChange: 1.5
    },
    {
      id: '5',
      carrier: 'Indian Post',
      serviceType: 'economy',
      zone: 'National',
      origin: 'Chennai',
      destination: 'Kolkata',
      baseRate: 80,
      perKgRate: 22,
      fuelSurcharge: 8.0,
      minWeight: 0.5,
      maxWeight: 35,
      volumetricDivisor: 4000,
      transitTime: '5-7 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-05',
      rateChange: 0
    },
    {
      id: '6',
      carrier: 'Blue Dart Express',
      serviceType: 'standard',
      zone: 'East Zone',
      origin: 'Chennai',
      destination: 'Pune',
      baseRate: 180,
      perKgRate: 42,
      fuelSurcharge: 11.5,
      minWeight: 0.5,
      maxWeight: 60,
      volumetricDivisor: 5000,
      transitTime: '2-3 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-20',
      rateChange: 4.2
    },
    {
      id: '7',
      carrier: 'DHL Express',
      serviceType: 'freight',
      zone: 'National',
      origin: 'Chennai',
      destination: 'All India',
      baseRate: 500,
      perKgRate: 18,
      fuelSurcharge: 16.0,
      minWeight: 100,
      maxWeight: 5000,
      volumetricDivisor: 6000,
      transitTime: '3-5 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-08',
      rateChange: -1.8
    },
    {
      id: '8',
      carrier: 'FedEx',
      serviceType: 'standard',
      zone: 'South Zone',
      origin: 'Chennai',
      destination: 'Coimbatore',
      baseRate: 100,
      perKgRate: 30,
      fuelSurcharge: 9.5,
      minWeight: 0.5,
      maxWeight: 50,
      volumetricDivisor: 5000,
      transitTime: '2-3 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-14',
      rateChange: 2.1
    },
    {
      id: '9',
      carrier: 'DTDC Courier',
      serviceType: 'economy',
      zone: 'West Zone',
      origin: 'Chennai',
      destination: 'Ahmedabad',
      baseRate: 95,
      perKgRate: 28,
      fuelSurcharge: 9.0,
      minWeight: 0.5,
      maxWeight: 40,
      volumetricDivisor: 4500,
      transitTime: '4-6 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-16',
      rateChange: 0.8
    },
    {
      id: '10',
      carrier: 'Indian Post',
      serviceType: 'standard',
      zone: 'National',
      origin: 'Chennai',
      destination: 'Jaipur',
      baseRate: 110,
      perKgRate: 32,
      fuelSurcharge: 8.5,
      minWeight: 0.5,
      maxWeight: 30,
      volumetricDivisor: 4000,
      transitTime: '4-5 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-11',
      rateChange: -0.5
    },
    {
      id: '11',
      carrier: 'Blue Dart Express',
      serviceType: 'freight',
      zone: 'South Zone',
      origin: 'Chennai',
      destination: 'Bangalore',
      baseRate: 450,
      perKgRate: 15,
      fuelSurcharge: 13.0,
      minWeight: 100,
      maxWeight: 3000,
      volumetricDivisor: 6000,
      transitTime: '2-4 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-19',
      rateChange: 6.5
    },
    {
      id: '12',
      carrier: 'FedEx',
      serviceType: 'economy',
      zone: 'East Zone',
      origin: 'Chennai',
      destination: 'Visakhapatnam',
      baseRate: 85,
      perKgRate: 25,
      fuelSurcharge: 8.0,
      minWeight: 0.5,
      maxWeight: 35,
      volumetricDivisor: 4500,
      transitTime: '4-6 days',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      currency: 'INR',
      isActive: true,
      lastUpdated: '2025-10-17',
      rateChange: 1.2
    }
  ];

  const rateStats = {
    totalRates: carrierRates.length,
    activeRates: carrierRates.filter(r => r.isActive).length,
    avgBaseRate: Math.round(carrierRates.reduce((sum, r) => sum + r.baseRate, 0) / carrierRates.length),
    avgPerKgRate: Math.round(carrierRates.reduce((sum, r) => sum + r.perKgRate, 0) / carrierRates.length),
    avgFuelSurcharge: (carrierRates.reduce((sum, r) => sum + r.fuelSurcharge, 0) / carrierRates.length).toFixed(1),
    rateIncreases: carrierRates.filter(r => r.rateChange > 0).length,
    rateDecreases: carrierRates.filter(r => r.rateChange < 0).length
  };

  const filteredRates = carrierRates.filter(rate => {
    const matchesSearch =
      rate.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCarrier = carrierFilter === 'all' || rate.carrier === carrierFilter;
    const matchesService = serviceFilter === 'all' || rate.serviceType === serviceFilter;
    const matchesZone = zoneFilter === 'all' || rate.zone === zoneFilter;

    return matchesSearch && matchesCarrier && matchesService && matchesZone;
  });

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'express': return 'bg-red-100 text-red-700 border-red-200';
      case 'standard': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'economy': return 'bg-green-100 text-green-700 border-green-200';
      case 'freight': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculateTotalCost = (baseRate: number, perKgRate: number, fuelSurcharge: number, weight: number = 10) => {
    const shippingCost = baseRate + (perKgRate * weight);
    const fuelCost = shippingCost * (fuelSurcharge / 100);
    return (shippingCost + fuelCost).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrier Rates</h1>
          <p className="text-sm text-gray-500 mt-1">Compare shipping rates across carriers and service levels</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{rateStats.totalRates}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Rates</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{rateStats.activeRates}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Active Rates</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-7 h-7 opacity-80" />
            <span className="text-xl font-bold">�{rateStats.avgBaseRate}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Base Rate</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-xl font-bold">�{rateStats.avgPerKgRate}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Per Kg</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-7 h-7 opacity-80" />
            <span className="text-xl font-bold">{rateStats.avgFuelSurcharge}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg Fuel Surcharge</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{rateStats.rateIncreases}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Rate Increases</p>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{rateStats.rateDecreases}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Rate Decreases</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by carrier, destination, or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
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
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="economy">Economy</option>
              <option value="freight">Freight</option>
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Zones</option>
              <option value="South Zone">South Zone</option>
              <option value="North Zone">North Zone</option>
              <option value="East Zone">East Zone</option>
              <option value="West Zone">West Zone</option>
              <option value="National">National</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredRates.length} of {rateStats.totalRates} rates</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Carrier & Service</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Rate</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Per Kg Rate</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fuel Surcharge</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Weight Range</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Transit Time</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Cost (10kg)</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate Change</th>
                <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{rate.carrier}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getServiceColor(rate.serviceType)}`}>
                        {rate.serviceType}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{rate.origin} � {rate.destination}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                        {rate.zone}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <p className="text-sm font-semibold text-gray-900">�{rate.baseRate}</p>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <p className="text-sm font-semibold text-gray-900">�{rate.perKgRate}</p>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <p className="text-sm font-semibold text-orange-600">{rate.fuelSurcharge}%</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-xs text-gray-600">{rate.minWeight}kg - {rate.maxWeight}kg</p>
                    <p className="text-xs text-gray-500 mt-0.5">Vol: 1:{rate.volumetricDivisor}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-xs text-gray-900 font-medium">{rate.transitTime}</p>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <p className="text-sm font-bold text-blue-600">�{calculateTotalCost(rate.baseRate, rate.perKgRate, rate.fuelSurcharge)}</p>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {rate.rateChange !== 0 && (
                      <div className="flex items-center justify-end gap-1">
                        {rate.rateChange > 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold text-red-600">+{rate.rateChange}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">{rate.rateChange}%</span>
                          </>
                        )}
                      </div>
                    )}
                    {rate.rateChange === 0 && (
                      <span className="text-xs text-gray-400">No change</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Edit className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRates.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mb-2" />
            <p className="text-gray-500 text-lg mb-2">No rates found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Rate Calculation Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="font-medium">Total Cost =</span>
            <span>(Base Rate + Per Kg Rate � Weight) � (1 + Fuel Surcharge %)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Volumetric Weight =</span>
            <span>(Length � Width � Height) / Volumetric Divisor</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Chargeable Weight =</span>
            <span>Higher of Actual Weight or Volumetric Weight</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Fuel Surcharge =</span>
            <span>Percentage applied on base shipping cost</span>
          </div>
        </div>
      </div>
    </div>
  );
}
