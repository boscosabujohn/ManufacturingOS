'use client';

import { useState } from 'react';
import { Building, MapPin, Calendar, Users, Star, Wifi, Coffee, Car, Dumbbell, IndianRupee, Search } from 'lucide-react';

interface HotelOption {
  id: string;
  name: string;
  chain: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  roomType: string;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  amenities: string[];
  images: number;
  availability: number;
  distance: string;
  checkIn: string;
  checkOut: string;
}

export default function Page() {
  const [searchLocation, setSearchLocation] = useState('Mumbai');
  const [checkInDate, setCheckInDate] = useState('2025-11-15');
  const [checkOutDate, setCheckOutDate] = useState('2025-11-17');
  const [guests, setGuests] = useState('1');
  const [roomType, setRoomType] = useState('deluxe');

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(checkInDate, checkOutDate);

  const mockHotels: HotelOption[] = [
    {
      id: '1',
      name: 'Taj Hotel',
      chain: 'Taj Hotels',
      location: 'Colaba, Mumbai',
      address: 'Apollo Bunder, Mumbai 400001',
      rating: 4.8,
      reviews: 1250,
      roomType: 'Deluxe Room',
      pricePerNight: 8500,
      totalPrice: 8500 * nights,
      nights: nights,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'],
      images: 24,
      availability: 5,
      distance: '2.5 km from BOM Airport',
      checkIn: checkInDate,
      checkOut: checkOutDate
    },
    {
      id: '2',
      name: 'ITC Grand Central',
      chain: 'ITC Hotels',
      location: 'Parel, Mumbai',
      address: 'Dr. Babasaheb Ambedkar Road, Mumbai 400012',
      rating: 4.6,
      reviews: 890,
      roomType: 'Executive Room',
      pricePerNight: 7200,
      totalPrice: 7200 * nights,
      nights: nights,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Business Center'],
      images: 18,
      availability: 8,
      distance: '8 km from BOM Airport',
      checkIn: checkInDate,
      checkOut: checkOutDate
    },
    {
      id: '3',
      name: 'The Oberoi',
      chain: 'Oberoi Hotels',
      location: 'Nariman Point, Mumbai',
      address: 'Nariman Point, Mumbai 400021',
      rating: 4.9,
      reviews: 1450,
      roomType: 'Premier Room',
      pricePerNight: 12000,
      totalPrice: 12000 * nights,
      nights: nights,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Fine Dining', 'Butler Service'],
      images: 32,
      availability: 3,
      distance: '18 km from BOM Airport',
      checkIn: checkInDate,
      checkOut: checkOutDate
    },
    {
      id: '4',
      name: 'Lemon Tree Premier',
      chain: 'Lemon Tree Hotels',
      location: 'Andheri, Mumbai',
      address: 'Andheri Kurla Road, Mumbai 400059',
      rating: 4.2,
      reviews: 650,
      roomType: 'Superior Room',
      pricePerNight: 4500,
      totalPrice: 4500 * nights,
      nights: nights,
      amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Parking', 'Room Service'],
      images: 15,
      availability: 12,
      distance: '3 km from BOM Airport',
      checkIn: checkInDate,
      checkOut: checkOutDate
    },
    {
      id: '5',
      name: 'Novotel Mumbai',
      chain: 'Accor Hotels',
      location: 'Juhu Beach, Mumbai',
      address: 'Balraj Sahani Marg, Mumbai 400049',
      rating: 4.4,
      reviews: 780,
      roomType: 'Standard Room',
      pricePerNight: 6000,
      totalPrice: 6000 * nights,
      nights: nights,
      amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Beach Access'],
      images: 20,
      availability: 10,
      distance: '6 km from BOM Airport',
      checkIn: checkInDate,
      checkOut: checkOutDate
    }
  ];

  const stats = {
    cheapest: Math.min(...mockHotels.map(h => h.pricePerNight)),
    highest: Math.max(...mockHotels.map(h => h.rating)),
    total: mockHotels.length
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('gym')) return <Dumbbell className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('parking')) return <Car className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining')) return <Coffee className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotel Booking</h1>
        <p className="text-sm text-gray-600 mt-1">Search and book hotel accommodation for business travel</p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="executive">Executive</option>
              <option value="suite">Suite</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{nights}</span> night{nights > 1 ? 's' : ''} • {guests} guest{guests !== '1' ? 's' : ''}
          </p>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Search className="h-4 w-4" />
            Search Hotels
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600">Cheapest Hotel</p>
          <p className="text-2xl font-bold text-green-900 mt-1">₹{stats.cheapest.toLocaleString('en-IN')}/night</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Highest Rated</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-yellow-900">{stats.highest}</p>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Hotels Available</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Hotel Results */}
      <div className="space-y-4">
        {mockHotels.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.chain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{hotel.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                    <span className="font-semibold text-blue-900">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({hotel.reviews} reviews)</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{hotel.images} photos</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase mb-1">Total for {nights} night{nights > 1 ? 's' : ''}</p>
                <p className="text-3xl font-bold text-blue-600">₹{hotel.totalPrice.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 mt-1">₹{hotel.pricePerNight.toLocaleString('en-IN')}/night</p>
                <p className="text-xs text-green-600 font-medium mt-1">{hotel.availability} rooms left</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">{hotel.roomType}</p>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Check-in: {new Date(hotel.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <span>→</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Check-out: {new Date(hotel.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  View Details
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
