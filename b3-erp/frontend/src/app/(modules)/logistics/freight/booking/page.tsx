'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, FileText, Package, Truck, MapPin, Calendar, CheckCircle, Clock, XCircle, AlertTriangle, Filter, Plus } from 'lucide-react';

interface FreightBooking {
  id: string;
  bookingNo: string;
  customerName: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  volume: number;
  transportMode: 'air' | 'sea' | 'road' | 'rail';
  carrier: string;
  bookingDate: string;
  pickupDate: string;
  expectedDelivery: string;
  status: 'confirmed' | 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  bookingAmount: number;
  containerNo: string;
  vesselFlight: string;
  billOfLading: string;
  customsStatus: 'pending' | 'cleared' | 'in-process' | 'not-required';
  trackingUrl: string;
  contactPerson: string;
  contactPhone: string;
}

export default function FreightBookingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const bookings: FreightBooking[] = [
    {
      id: '1',
      bookingNo: 'FB-2025-2001',
      customerName: 'ABC Manufacturing Ltd',
      origin: 'Chennai Port',
      destination: 'Singapore Port',
      cargoType: 'Industrial Machinery',
      weight: 15000,
      volume: 45,
      transportMode: 'sea',
      carrier: 'Maersk Line',
      bookingDate: '2025-10-18',
      pickupDate: '2025-10-25',
      expectedDelivery: '2025-11-02',
      status: 'confirmed',
      bookingAmount: 485000,
      containerNo: 'MAEU7654321',
      vesselFlight: 'MSC EMMA - V.234',
      billOfLading: 'BL-2025-8765',
      customsStatus: 'in-process',
      trackingUrl: 'https://track.maersk.com/12345',
      contactPerson: 'Rajesh Kumar',
      contactPhone: '+91-98765-43210'
    },
    {
      id: '2',
      bookingNo: 'FB-2025-2002',
      customerName: 'Global Traders Inc',
      origin: 'Mumbai Airport',
      destination: 'Dubai Airport',
      cargoType: 'Electronics',
      weight: 8500,
      volume: 28,
      transportMode: 'air',
      carrier: 'Emirates SkyCargo',
      bookingDate: '2025-10-15',
      pickupDate: '2025-10-20',
      expectedDelivery: '2025-10-22',
      status: 'delivered',
      bookingAmount: 890000,
      containerNo: 'N/A',
      vesselFlight: 'EK-407',
      billOfLading: 'AWB-2025-4532',
      customsStatus: 'cleared',
      trackingUrl: 'https://track.emirates.com/67890',
      contactPerson: 'Priya Sharma',
      contactPhone: '+91-99876-54321'
    },
    {
      id: '3',
      bookingNo: 'FB-2025-2003',
      customerName: 'TechCorp Solutions',
      origin: 'Bangalore',
      destination: 'Delhi',
      cargoType: 'IT Equipment',
      weight: 12000,
      volume: 38,
      transportMode: 'road',
      carrier: 'VRL Logistics',
      bookingDate: '2025-10-19',
      pickupDate: '2025-10-22',
      expectedDelivery: '2025-10-24',
      status: 'in-transit',
      bookingAmount: 185000,
      containerNo: 'TRUCK-KA-01-AB-1234',
      vesselFlight: 'N/A',
      billOfLading: 'LR-2025-9876',
      customsStatus: 'not-required',
      trackingUrl: 'https://track.vrl.in/abc123',
      contactPerson: 'Amit Patel',
      contactPhone: '+91-98234-56789'
    },
    {
      id: '4',
      bookingNo: 'FB-2025-2004',
      customerName: 'Precision Parts Ltd',
      origin: 'Chennai',
      destination: 'Kolkata',
      cargoType: 'Auto Components',
      weight: 18500,
      volume: 52,
      transportMode: 'rail',
      carrier: 'Indian Railways',
      bookingDate: '2025-10-20',
      pickupDate: '2025-10-26',
      expectedDelivery: '2025-11-01',
      status: 'confirmed',
      bookingAmount: 125000,
      containerNo: 'RAIL-CON-45678',
      vesselFlight: 'N/A',
      billOfLading: 'RR-2025-3456',
      customsStatus: 'not-required',
      trackingUrl: 'https://ntes.indianrail.gov.in',
      contactPerson: 'Suresh Menon',
      contactPhone: '+91-97123-45678'
    },
    {
      id: '5',
      bookingNo: 'FB-2025-2005',
      customerName: 'Eastern Electronics',
      origin: 'Visakhapatnam Port',
      destination: 'Hong Kong Port',
      cargoType: 'Consumer Electronics',
      weight: 22000,
      volume: 68,
      transportMode: 'sea',
      carrier: 'COSCO Shipping',
      bookingDate: '2025-10-21',
      pickupDate: '2025-10-28',
      expectedDelivery: '2025-11-05',
      status: 'pending',
      bookingAmount: 625000,
      containerNo: 'COSU8765432',
      vesselFlight: 'COSCO PRIDE - V.567',
      billOfLading: 'BL-2025-5432',
      customsStatus: 'pending',
      trackingUrl: '',
      contactPerson: 'Deepak Singh',
      contactPhone: '+91-96543-21098'
    },
    {
      id: '6',
      bookingNo: 'FB-2025-2006',
      customerName: 'Metro Wholesale',
      origin: 'Hyderabad',
      destination: 'Mumbai',
      cargoType: 'FMCG Products',
      weight: 9500,
      volume: 32,
      transportMode: 'road',
      carrier: 'Gati Ltd',
      bookingDate: '2025-10-16',
      pickupDate: '2025-10-18',
      expectedDelivery: '2025-10-21',
      status: 'delivered',
      bookingAmount: 95000,
      containerNo: 'TRUCK-TN-01-XY-5678',
      vesselFlight: 'N/A',
      billOfLading: 'LR-2025-7654',
      customsStatus: 'not-required',
      trackingUrl: 'https://track.gati.com/xyz789',
      contactPerson: 'Vikas Reddy',
      contactPhone: '+91-95432-10987'
    },
    {
      id: '7',
      bookingNo: 'FB-2025-2007',
      customerName: 'Northern Distributors',
      origin: 'Delhi Airport',
      destination: 'Frankfurt Airport',
      cargoType: 'Pharmaceuticals',
      weight: 5500,
      volume: 18,
      transportMode: 'air',
      carrier: 'Lufthansa Cargo',
      bookingDate: '2025-10-19',
      pickupDate: '2025-10-24',
      expectedDelivery: '2025-10-26',
      status: 'in-transit',
      bookingAmount: 1250000,
      containerNo: 'N/A',
      vesselFlight: 'LH-8234',
      billOfLading: 'AWB-2025-8901',
      customsStatus: 'cleared',
      trackingUrl: 'https://lufthansa-cargo.com/track',
      contactPerson: 'Rahul Verma',
      contactPhone: '+91-94321-87654'
    },
    {
      id: '8',
      bookingNo: 'FB-2025-2008',
      customerName: 'Coastal Enterprises',
      origin: 'Kochi',
      destination: 'Colombo',
      cargoType: 'Textiles',
      weight: 13500,
      volume: 42,
      transportMode: 'sea',
      carrier: 'Sri Lanka Shipping',
      bookingDate: '2025-10-10',
      pickupDate: '2025-10-15',
      expectedDelivery: '2025-10-18',
      status: 'cancelled',
      bookingAmount: 215000,
      containerNo: 'SLSL5432109',
      vesselFlight: 'SL PEARL - V.890',
      billOfLading: 'BL-2025-2109',
      customsStatus: 'pending',
      trackingUrl: '',
      contactPerson: 'Lakshmi Iyer',
      contactPhone: '+91-93210-98765'
    }
  ];

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    inTransit: bookings.filter(b => b.status === 'in-transit').length,
    delivered: bookings.filter(b => b.status === 'delivered').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalValue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.bookingAmount, 0),
    customsPending: bookings.filter(b => b.customsStatus === 'pending' || b.customsStatus === 'in-process').length
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.billOfLading.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesMode = modeFilter === 'all' || booking.transportMode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCustomsColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-process': return 'bg-blue-100 text-blue-700';
      case 'not-required': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Freight Booking</h1>
            <p className="text-sm text-gray-500 mt-1">Manage freight bookings and shipments</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Bookings</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.confirmed}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Confirmed</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.pending}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Pending</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.inTransit}</span>
          </div>
          <p className="text-xs font-medium opacity-90">In Transit</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.delivered}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Delivered</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.cancelled}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Cancelled</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(bookingStats.totalValue / 1000000).toFixed(1)}M</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Value</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{bookingStats.customsPending}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Customs Pending</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking no, customer, or B/L number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modes</option>
              <option value="air">Air</option>
              <option value="sea">Sea</option>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredBookings.length} of {bookingStats.total} bookings</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{booking.bookingNo}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">{booking.customerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">B/L: {booking.billOfLading}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Booking Amount</p>
                <p className="text-2xl font-bold text-indigo-600">¹{booking.bookingAmount.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getCustomsColor(booking.customsStatus)}`}>
                  Customs: {booking.customsStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">Route</p>
                <p className="text-sm font-semibold text-blue-900">{booking.origin}</p>
                <p className="text-xs text-blue-700 my-0.5">’</p>
                <p className="text-sm font-semibold text-blue-900">{booking.destination}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium mb-1">Cargo</p>
                <p className="text-sm font-semibold text-green-900">{booking.cargoType}</p>
                <p className="text-xs text-green-700">{booking.weight.toLocaleString()} kg</p>
                <p className="text-xs text-green-700">{booking.volume} CBM</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium mb-1">Transport</p>
                <p className="text-sm font-semibold text-purple-900">{booking.carrier}</p>
                <p className="text-xs text-purple-700">{booking.transportMode.toUpperCase()}</p>
                <p className="text-xs text-purple-700">{booking.vesselFlight}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600 font-medium mb-1">Schedule</p>
                <p className="text-xs text-orange-700">Pickup: {booking.pickupDate}</p>
                <p className="text-xs text-orange-700 mt-1">Delivery: {booking.expectedDelivery}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-medium mb-1">Contact</p>
                <p className="text-xs font-semibold text-gray-900">{booking.contactPerson}</p>
                <p className="text-xs text-gray-700">{booking.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Booked on {booking.bookingDate} " Container: {booking.containerNo}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  View Details
                </button>
                {booking.trackingUrl && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    Track Shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No bookings found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Booking Status Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div><span className="font-medium">Confirmed:</span> Booking confirmed by carrier</div>
          <div><span className="font-medium">Pending:</span> Awaiting carrier confirmation</div>
          <div><span className="font-medium">In Transit:</span> Shipment en route to destination</div>
          <div><span className="font-medium">Delivered:</span> Successfully delivered to consignee</div>
        </div>
      </div>
    </div>
  );
}
