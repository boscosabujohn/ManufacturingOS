'use client';

import { useState } from 'react';
import { Car, MapPin, Calendar, Clock, Users, IndianRupee, Navigation, Shield, Star, Search } from 'lucide-react';

interface CabOption {
  id: string;
  provider: string;
  cabType: 'sedan' | 'suv' | 'hatchback' | 'luxury';
  model: string;
  capacity: number;
  fareType: 'per_km' | 'fixed' | 'hourly';
  baseFare: number;
  perKmRate?: number;
  estimatedFare: number;
  estimatedTime: string;
  distance: string;
  rating: number;
  trips: number;
  features: string[];
  availability: 'immediate' | 'scheduled';
  waitingTime?: string;
}

export default function Page() {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'hourly'>('oneway');
  const [pickupLocation, setPickupLocation] = useState('Andheri Office');
  const [dropLocation, setDropLocation] = useState('BKC Corporate Park');
  const [pickupDate, setPickupDate] = useState('2025-11-15');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [cabType, setCabType] = useState('sedan');

  const mockCabs: CabOption[] = [
    {
      id: '1',
      provider: 'Ola',
      cabType: 'sedan',
      model: 'Honda City, Maruti Ciaz',
      capacity: 4,
      fareType: 'per_km',
      baseFare: 50,
      perKmRate: 12,
      estimatedFare: 245,
      estimatedTime: '25 mins',
      distance: '15 km',
      rating: 4.5,
      trips: 1250,
      features: ['AC', 'GPS Tracking', 'Clean & Sanitized'],
      availability: 'immediate',
      waitingTime: '5 mins'
    },
    {
      id: '2',
      provider: 'Uber',
      cabType: 'sedan',
      model: 'Toyota Etios, Hyundai Xcent',
      capacity: 4,
      fareType: 'per_km',
      baseFare: 55,
      perKmRate: 11,
      estimatedFare: 230,
      estimatedTime: '22 mins',
      distance: '15 km',
      rating: 4.6,
      trips: 2100,
      features: ['AC', 'GPS Tracking', 'Verified Driver'],
      availability: 'immediate',
      waitingTime: '3 mins'
    },
    {
      id: '3',
      provider: 'Ola',
      cabType: 'suv',
      model: 'Toyota Innova, Mahindra XUV',
      capacity: 6,
      fareType: 'per_km',
      baseFare: 80,
      perKmRate: 18,
      estimatedFare: 380,
      estimatedTime: '25 mins',
      distance: '15 km',
      rating: 4.7,
      trips: 850,
      features: ['AC', 'GPS Tracking', 'Spacious', 'Luggage Space'],
      availability: 'immediate',
      waitingTime: '8 mins'
    },
    {
      id: '4',
      provider: 'Meru',
      cabType: 'sedan',
      model: 'Dzire, Etios',
      capacity: 4,
      fareType: 'per_km',
      baseFare: 60,
      perKmRate: 13,
      estimatedFare: 270,
      estimatedTime: '28 mins',
      distance: '15 km',
      rating: 4.4,
      trips: 1800,
      features: ['AC', 'Professional Driver', 'Clean & Sanitized'],
      availability: 'immediate',
      waitingTime: '6 mins'
    },
    {
      id: '5',
      provider: 'Uber',
      cabType: 'luxury',
      model: 'Honda Accord, Toyota Camry',
      capacity: 4,
      fareType: 'per_km',
      baseFare: 120,
      perKmRate: 25,
      estimatedFare: 570,
      estimatedTime: '20 mins',
      distance: '15 km',
      rating: 4.9,
      trips: 450,
      features: ['AC', 'Premium Interior', 'Professional Chauffeur', 'Water Bottles'],
      availability: 'scheduled'
    },
    {
      id: '6',
      provider: 'Ola',
      cabType: 'hatchback',
      model: 'Swift, Wagon R',
      capacity: 4,
      fareType: 'per_km',
      baseFare: 40,
      perKmRate: 9,
      estimatedFare: 175,
      estimatedTime: '30 mins',
      distance: '15 km',
      rating: 4.3,
      trips: 1600,
      features: ['AC', 'GPS Tracking', 'Budget Friendly'],
      availability: 'immediate',
      waitingTime: '4 mins'
    }
  ];

  const stats = {
    cheapest: Math.min(...mockCabs.map(c => c.estimatedFare)),
    fastest: mockCabs.sort((a, b) => parseInt(a.estimatedTime) - parseInt(b.estimatedTime))[0].estimatedTime,
    available: mockCabs.filter(c => c.availability === 'immediate').length
  };

  const getCabTypeColor = (type: string) => {
    switch (type) {
      case 'hatchback': return 'bg-gray-100 text-gray-700';
      case 'sedan': return 'bg-blue-100 text-blue-700';
      case 'suv': return 'bg-green-100 text-green-700';
      case 'luxury': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cab Booking</h1>
        <p className="text-sm text-gray-600 mt-1">Book cab services for business travel</p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTripType('oneway')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              tripType === 'oneway' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType('roundtrip')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              tripType === 'roundtrip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('hourly')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              tripType === 'hourly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Hourly Rental
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop Location</label>
            <input
              type="text"
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cab Type</label>
            <select
              value={cabType}
              onChange={(e) => setCabType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Search className="h-4 w-4" />
          Search Cabs
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Cheapest Fare</p>
          <p className="text-2xl font-bold text-green-900 mt-1">₹{stats.cheapest}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Fastest ETA</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.fastest}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Available Now</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.available}</p>
        </div>
      </div>

      {/* Cab Results */}
      <div className="space-y-4">
        {mockCabs.map(cab => (
          <div key={cab.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{cab.provider}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getCabTypeColor(cab.cabType)}`}>
                      {cab.cabType.charAt(0).toUpperCase() + cab.cabType.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{cab.model}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cab.capacity} seats
                    </span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{cab.rating}</span>
                      <span className="text-gray-500">({cab.trips} trips)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">₹{cab.estimatedFare}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {cab.fareType === 'per_km' && `Base: ₹${cab.baseFare} + ₹${cab.perKmRate}/km`}
                  {cab.fareType === 'fixed' && 'Fixed Fare'}
                  {cab.fareType === 'hourly' && 'Hourly Rate'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Distance</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Navigation className="h-4 w-4" />
                  {cab.distance}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Estimated Time</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {cab.estimatedTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Availability</p>
                {cab.availability === 'immediate' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    <Shield className="h-3 w-3" />
                    Ready in {cab.waitingTime}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                    Schedule Only
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {cab.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded border border-gray-200">
                    {feature}
                  </span>
                ))}
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
