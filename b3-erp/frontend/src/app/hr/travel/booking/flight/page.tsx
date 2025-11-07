'use client';

import { useState, useMemo } from 'react';
import { Plane, Plus, Calendar, IndianRupee, User, MapPin, Edit2, Trash2, X, Save, AlertCircle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FlightBooking {
  id: string;
  bookingReference: string;
  travelRequestId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  airline: string;
  flightNumber: string;
  pnr: string;
  bookingClass: 'economy' | 'premium-economy' | 'business' | 'first';
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  fare: number;
  taxes: number;
  totalAmount: number;
  bookingDate: string;
  bookingSource: 'corporate-agent' | 'airline-direct' | 'online-portal' | 'other';
  agencyName?: string;
  ticketStatus: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  seatNumber?: string;
  mealPreference?: string;
  baggageAllowance: string;
  cancellationPolicy: string;
  remarks?: string;
}

export default function FlightBookingPage() {
  const [bookings, setBookings] = useState<FlightBooking[]>([
    {
      id: '1',
      bookingReference: 'FLT-2025-001',
      travelRequestId: 'TR-2025-002',
      employeeCode: 'EMP456',
      employeeName: 'Priya Sharma',
      department: 'Engineering',
      airline: 'Air India',
      flightNumber: 'AI 804',
      pnr: 'ABC123',
      bookingClass: 'economy',
      from: 'Pune (PNQ)',
      to: 'Bangalore (BLR)',
      departureDate: '2025-11-10',
      departureTime: '06:30',
      arrivalDate: '2025-11-10',
      arrivalTime: '07:55',
      fare: 4200,
      taxes: 850,
      totalAmount: 5050,
      bookingDate: '2025-10-20',
      bookingSource: 'corporate-agent',
      agencyName: 'MakeMyTrip Corporate',
      ticketStatus: 'confirmed',
      seatNumber: '12A',
      mealPreference: 'Vegetarian',
      baggageAllowance: '15kg Check-in + 7kg Cabin',
      cancellationPolicy: 'Free cancellation up to 24 hours before departure',
      remarks: 'Window seat requested and confirmed'
    },
    {
      id: '2',
      bookingReference: 'FLT-2025-002',
      travelRequestId: 'TR-2025-003',
      employeeCode: 'EMP789',
      employeeName: 'Amit Patel',
      department: 'Quality',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ 422',
      pnr: 'XYZ789',
      bookingClass: 'business',
      from: 'Mumbai (BOM)',
      to: 'Singapore (SIN)',
      departureDate: '2025-12-01',
      departureTime: '02:05',
      arrivalDate: '2025-12-01',
      arrivalTime: '09:45',
      fare: 75000,
      taxes: 12500,
      totalAmount: 87500,
      bookingDate: '2025-10-25',
      bookingSource: 'airline-direct',
      ticketStatus: 'confirmed',
      seatNumber: '7K',
      mealPreference: 'Non-Vegetarian',
      baggageAllowance: '30kg Check-in + 14kg Cabin',
      cancellationPolicy: 'Flexible - Changes allowed with fee',
      remarks: 'Business class upgrade approved for international travel'
    },
    {
      id: '3',
      bookingReference: 'FLT-2025-003',
      travelRequestId: 'TR-2025-001',
      employeeCode: 'EMP234',
      employeeName: 'Rajesh Kumar',
      department: 'Sales',
      airline: 'IndiGo',
      flightNumber: '6E 6544',
      pnr: 'PQR456',
      bookingClass: 'economy',
      from: 'Mumbai (BOM)',
      to: 'Pune (PNQ)',
      departureDate: '2025-11-05',
      departureTime: '10:15',
      arrivalDate: '2025-11-05',
      arrivalTime: '11:10',
      fare: 2800,
      taxes: 420,
      totalAmount: 3220,
      bookingDate: '2025-10-22',
      bookingSource: 'online-portal',
      agencyName: 'Yatra Corporate',
      ticketStatus: 'confirmed',
      seatNumber: '18C',
      baggageAllowance: '15kg Check-in + 7kg Cabin',
      cancellationPolicy: 'Non-refundable. Date change allowed with ₹3000 fee',
      remarks: 'Short domestic flight for client meeting'
    },
    {
      id: '4',
      bookingReference: 'FLT-2025-004',
      travelRequestId: 'TR-2025-005',
      employeeCode: 'EMP567',
      employeeName: 'Sneha Reddy',
      department: 'Production',
      airline: 'Vistara',
      flightNumber: 'UK 863',
      pnr: 'DEF321',
      bookingClass: 'premium-economy',
      from: 'Pune (PNQ)',
      to: 'Chennai (MAA)',
      departureDate: '2025-11-08',
      departureTime: '14:45',
      arrivalDate: '2025-11-08',
      arrivalTime: '16:20',
      fare: 6500,
      taxes: 980,
      totalAmount: 7480,
      bookingDate: '2025-10-28',
      bookingSource: 'corporate-agent',
      agencyName: 'TravelBuddy Corporate',
      ticketStatus: 'pending',
      baggageAllowance: '20kg Check-in + 7kg Cabin',
      cancellationPolicy: 'Free cancellation up to 48 hours before departure',
      remarks: 'Pending ticket confirmation from airline'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<FlightBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.ticketStatus === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));
  }, [bookings, filterStatus, searchQuery]);

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter(b => b.ticketStatus === 'confirmed').length,
    pending: bookings.filter(b => b.ticketStatus === 'pending').length,
    cancelled: bookings.filter(b => b.ticketStatus === 'cancelled').length,
    totalSpent: bookings.filter(b => b.ticketStatus === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0)
  }), [bookings]);

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getClassColor = (bookingClass: string) => {
    const colors = {
      'economy': 'bg-gray-100 text-gray-800',
      'premium-economy': 'bg-blue-100 text-blue-800',
      'business': 'bg-purple-100 text-purple-800',
      'first': 'bg-amber-100 text-amber-800'
    };
    return colors[bookingClass as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = (booking: FlightBooking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBooking) return;
    setBookings(bookings.filter(b => b.id !== selectedBooking.id));
    setShowDeleteModal(false);
    toast({
      title: "Booking Deleted",
      description: `${selectedBooking.bookingReference} has been removed`
    });
    setSelectedBooking(null);
  };

  const handleDownloadTicket = (booking: FlightBooking) => {
    toast({
      title: "Downloading Ticket",
      description: `E-ticket for ${booking.bookingReference} is being downloaded`
    });
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-7 w-7 text-blue-600" />
          Flight Bookings
        </h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track flight bookings for employee travel</p>
      </div>

      {/* Info Alert */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Booking Management</h3>
            <p className="text-sm text-blue-800">
              Record flight bookings made through corporate travel agents, airlines, or online portals.
              Keep track of PNRs, ticket status, and booking details for reporting and reconciliation.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Confirmed</div>
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Cancelled</div>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-blue-600">₹{(stats.totalSpent / 100000).toFixed(1)}L</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search by employee, PNR, booking ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Booking
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.bookingReference}</h3>
                  <p className="text-sm text-gray-600">{booking.airline} {booking.flightNumber} • PNR: {booking.pnr}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.ticketStatus)}`}>
                  {booking.ticketStatus.charAt(0).toUpperCase() + booking.ticketStatus.slice(1)}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded ${getClassColor(booking.bookingClass)}`}>
                  {booking.bookingClass.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-600">Fare: ₹{booking.fare.toLocaleString('en-IN')} + Tax: ₹{booking.taxes.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                {/* Employee Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Passenger</span>
                  </div>
                  <p className="font-semibold text-gray-900">{booking.employeeName}</p>
                  <p className="text-sm text-gray-600">{booking.employeeCode}</p>
                  <p className="text-xs text-gray-500">{booking.department}</p>
                </div>

                {/* Flight Route */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Route & Schedule</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{booking.departureTime}</p>
                      <p className="text-sm text-gray-600">{booking.from}</p>
                      <p className="text-xs text-gray-500">{booking.departureDate}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-full">
                        <div className="h-0.5 bg-gray-300 w-full"></div>
                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 rotate-90" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{booking.arrivalTime}</p>
                      <p className="text-sm text-gray-600">{booking.to}</p>
                      <p className="text-xs text-gray-500">{booking.arrivalDate}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 uppercase font-medium">Booking Details</span>
                  </div>
                  <p className="text-sm text-gray-900">Booked: {booking.bookingDate}</p>
                  <p className="text-xs text-gray-600 capitalize">{booking.bookingSource.replace('-', ' ')}</p>
                  {booking.agencyName && <p className="text-xs text-gray-500">{booking.agencyName}</p>}
                  {booking.seatNumber && <p className="text-xs text-blue-600 font-medium mt-1">Seat: {booking.seatNumber}</p>}
                </div>
              </div>

              {/* Additional Info */}
              {(booking.mealPreference || booking.baggageAllowance || booking.remarks) && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {booking.mealPreference && (
                      <div>
                        <span className="text-gray-500">Meal: </span>
                        <span className="text-gray-900 font-medium">{booking.mealPreference}</span>
                      </div>
                    )}
                    {booking.baggageAllowance && (
                      <div>
                        <span className="text-gray-500">Baggage: </span>
                        <span className="text-gray-900 font-medium">{booking.baggageAllowance}</span>
                      </div>
                    )}
                    {booking.remarks && (
                      <div className="md:col-span-3">
                        <span className="text-gray-500">Remarks: </span>
                        <span className="text-gray-900">{booking.remarks}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Travel Request: <span className="text-blue-600 font-medium">{booking.travelRequestId}</span>
                </div>
                <div className="flex gap-2">
                  {booking.ticketStatus === 'confirmed' && (
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      E-Ticket
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(booking)}
                    className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">No flight bookings match your search criteria</p>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Add Flight Booking</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                {/* Employee & Travel Request */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Request ID</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="TR-2025-XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Code</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="EMPXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Airline</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Air India" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Flight Number</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="AI 804" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PNR</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="ABC123" />
                  </div>
                </div>

                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">From (Airport)</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Mumbai (BOM)" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">To (Airport)</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Delhi (DEL)" />
                  </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Time</label>
                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival Time</label>
                    <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Fare (₹)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Taxes (₹)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount (₹)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Class</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="economy">Economy</option>
                      <option value="premium-economy">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Source</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="corporate-agent">Corporate Agent</option>
                      <option value="airline-direct">Airline Direct</option>
                      <option value="online-portal">Online Portal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Status</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seat Number</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="12A" />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Agency Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Baggage Allowance</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="15kg Check-in + 7kg Cabin" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                  <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Any additional notes..."></textarea>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
              <button
                onClick={() => {
                  toast({ title: "Booking Added", description: "Flight booking has been recorded successfully" });
                  setShowAddModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Booking?</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete booking <strong>{selectedBooking.bookingReference}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All booking details will be permanently removed.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
