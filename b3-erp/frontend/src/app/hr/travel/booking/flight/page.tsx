'use client';

import { useState } from 'react';
import { Plane, MapPin, Calendar, Clock, IndianRupee, Users, CheckCircle, Search } from 'lucide-react';

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  class: 'economy' | 'business' | 'first';
  price: number;
  availability: number;
}

export default function Page() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [searchFrom, setSearchFrom] = useState('Mumbai (BOM)');
  const [searchTo, setSearchTo] = useState('Delhi (DEL)');
  const [departDate, setDepartDate] = useState('2025-11-15');
  const [selectedClass, setSelectedClass] = useState('economy');

  const mockFlights: FlightOption[] = [
    {
      id: '1',
      airline: 'Air India',
      flightNumber: 'AI 860',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      departure: '06:00',
      arrival: '08:15',
      duration: '2h 15m',
      stops: 0,
      class: 'economy',
      price: 5850,
      availability: 12
    },
    {
      id: '2',
      airline: 'IndiGo',
      flightNumber: '6E 2134',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      departure: '08:30',
      arrival: '10:45',
      duration: '2h 15m',
      stops: 0,
      class: 'economy',
      price: 4950,
      availability: 8
    },
    {
      id: '3',
      airline: 'Vistara',
      flightNumber: 'UK 995',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      departure: '14:20',
      arrival: '16:40',
      duration: '2h 20m',
      stops: 0,
      class: 'business',
      price: 12500,
      availability: 6
    },
    {
      id: '4',
      airline: 'SpiceJet',
      flightNumber: 'SG 8923',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      departure: '19:45',
      arrival: '22:05',
      duration: '2h 20m',
      stops: 0,
      class: 'economy',
      price: 4450,
      availability: 15
    }
  ];

  const stats = {
    cheapest: Math.min(...mockFlights.map(f => f.price)),
    fastest: mockFlights.sort((a, b) => a.duration.localeCompare(b.duration))[0].duration,
    airlines: new Set(mockFlights.map(f => f.airline)).size
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Flight Booking</h1>
        <p className="text-sm text-gray-600 mt-1">Search and book flights for business travel</p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTripType('one-way')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              tripType === 'one-way' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType('round-trip')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Round Trip
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Search className="h-4 w-4" />
          Search Flights
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Cheapest Flight</p>
          <p className="text-2xl font-bold text-green-900 mt-1">₹{stats.cheapest.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Fastest Duration</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.fastest}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Airlines Available</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.airlines}</p>
        </div>
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        {mockFlights.map(flight => (
          <div key={flight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{flight.airline}</h3>
                  <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">{flight.availability} seats left</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Departure</p>
                <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                <p className="text-sm text-gray-600">{flight.from}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">{flight.duration}</p>
                <div className="relative">
                  <div className="h-0.5 bg-gray-300"></div>
                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 rotate-90" />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Arrival</p>
                <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                <p className="text-sm text-gray-600">{flight.to}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded ${
                  flight.class === 'economy' ? 'bg-gray-100 text-gray-700' :
                  flight.class === 'business' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                </span>
                {flight.stops === 0 && (
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                    Direct Flight
                  </span>
                )}
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
