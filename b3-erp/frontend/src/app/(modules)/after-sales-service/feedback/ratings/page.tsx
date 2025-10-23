'use client';

import { useState, useMemo } from 'react';
import { Star, Search, Filter, TrendingUp, BarChart3, Calendar, User, MessageSquare, ThumbsUp, Eye, Download, Award } from 'lucide-react';

interface Rating {
  id: string;
  serviceName: string;
  serviceType: 'technician' | 'installation' | 'service-call' | 'parts-delivery';
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  category: string;
  verified: boolean;
  helpful: number;
  unhelpful: number;
}

const mockRatings: Rating[] = [
  {
    id: '1',
    serviceName: 'Microwave Repair Service',
    serviceType: 'service-call',
    customerName: 'Anjali Patel',
    rating: 5,
    comment: 'Excellent service! The technician was very professional and fixed the issue quickly. Highly satisfied with the experience.',
    date: '2025-10-18',
    category: 'Repair',
    verified: true,
    helpful: 45,
    unhelpful: 2
  },
  {
    id: '2',
    serviceName: 'Installation of Kitchen Appliances',
    serviceType: 'installation',
    customerName: 'Rajesh Kumar',
    rating: 5,
    comment: 'Perfect installation! The team was punctual, careful with the setup, and provided clear instructions on usage.',
    date: '2025-10-17',
    category: 'Installation',
    verified: true,
    helpful: 38,
    unhelpful: 1
  },
  {
    id: '3',
    serviceName: 'Refrigerator Maintenance',
    serviceType: 'service-call',
    customerName: 'Priya Sharma',
    rating: 4,
    comment: 'Good service overall. Technician was knowledgeable but could have been a bit faster. Still very satisfied.',
    date: '2025-10-16',
    category: 'Maintenance',
    verified: true,
    helpful: 28,
    unhelpful: 3
  },
  {
    id: '4',
    serviceName: 'Washing Machine Repair',
    serviceType: 'service-call',
    customerName: 'Vikram Singh',
    rating: 4,
    comment: 'The technician diagnosed the issue correctly and fixed it efficiently. Parts were replaced properly.',
    date: '2025-10-15',
    category: 'Repair',
    verified: true,
    helpful: 32,
    unhelpful: 2
  },
  {
    id: '5',
    serviceName: 'Dishwasher Parts Delivery',
    serviceType: 'parts-delivery',
    customerName: 'Neha Desai',
    rating: 5,
    comment: 'Fast and reliable delivery! Parts arrived on time and were exactly as ordered. Perfect!',
    date: '2025-10-14',
    category: 'Parts',
    verified: true,
    helpful: 52,
    unhelpful: 0
  },
  {
    id: '6',
    serviceName: 'AC Installation Service',
    serviceType: 'installation',
    customerName: 'Sanjay Verma',
    rating: 3,
    comment: 'Service was average. Installation was done but the team could have been more careful with the house. Some minor damage to walls.',
    date: '2025-10-13',
    category: 'Installation',
    verified: true,
    helpful: 15,
    unhelpful: 8
  },
  {
    id: '7',
    serviceName: 'Oven Maintenance Call',
    serviceType: 'service-call',
    customerName: 'Isha Nair',
    rating: 5,
    comment: 'Outstanding service! Very professional, courteous, and the oven works perfectly now. Will definitely call again.',
    date: '2025-10-12',
    category: 'Maintenance',
    verified: true,
    helpful: 56,
    unhelpful: 1
  },
  {
    id: '8',
    serviceName: 'Refrigerator Parts Replacement',
    serviceType: 'parts-delivery',
    customerName: 'Rohan Gupta',
    rating: 4,
    comment: 'Good service. Parts delivered quickly but packaging could have been better. No damage though.',
    date: '2025-10-11',
    category: 'Parts',
    verified: true,
    helpful: 22,
    unhelpful: 4
  },
  {
    id: '9',
    serviceName: 'Kitchen Appliance Installation',
    serviceType: 'installation',
    customerName: 'Meera Nair',
    rating: 5,
    comment: 'Amazing experience! The installation team was very professional, clean, and thorough. Everything works perfectly!',
    date: '2025-10-10',
    category: 'Installation',
    verified: true,
    helpful: 48,
    unhelpful: 0
  },
  {
    id: '10',
    serviceName: 'Microwave Warranty Repair',
    serviceType: 'service-call',
    customerName: 'Arjun Patel',
    rating: 2,
    comment: 'Not satisfied. The technician took too long and the microwave stopped working again after a few days.',
    date: '2025-10-09',
    category: 'Warranty',
    verified: true,
    helpful: 12,
    unhelpful: 34
  }
];

export default function RatingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  const serviceTypes = ['technician', 'installation', 'service-call', 'parts-delivery'];
  const categories = ['Repair', 'Installation', 'Maintenance', 'Parts', 'Warranty'];

  const filteredRatings = useMemo(() => {
    let filtered = mockRatings.filter(rating => {
      const matchesSearch = rating.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesServiceType = selectedServiceType === 'all' || rating.serviceType === selectedServiceType;
      const matchesRating = selectedRating === 'all' || rating.rating === parseInt(selectedRating);
      const matchesCategory = selectedCategory === 'all' || rating.category === selectedCategory;
      return matchesSearch && matchesServiceType && matchesRating && matchesCategory;
    });

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [searchTerm, selectedServiceType, selectedRating, selectedCategory, sortBy]);

  const stats = {
    total: mockRatings.length,
    avgRating: (mockRatings.reduce((sum, r) => sum + r.rating, 0) / mockRatings.length).toFixed(1),
    fiveStars: mockRatings.filter(r => r.rating === 5).length,
    verified: mockRatings.filter(r => r.verified).length
  };

  const getRatingColor = (rating: number) => {
    if (rating === 5) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (rating === 4) return 'bg-green-100 text-green-700 border-green-200';
    if (rating === 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (rating === 2) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'technician': return 'Technician';
      case 'installation': return 'Installation';
      case 'service-call': return 'Service Call';
      case 'parts-delivery': return 'Parts Delivery';
      default: return type;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Star className="h-8 w-8 text-emerald-600" />
          Service Ratings
        </h1>
        <p className="text-gray-600 mt-1">View and manage customer service ratings</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.avgRating} ⭐</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5-Star Ratings</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.fiveStars}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.verified}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service, customer, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Types</option>
                <option value="service-call">Service Call</option>
                <option value="installation">Installation</option>
                <option value="parts-delivery">Parts Delivery</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {filteredRatings.map((rating) => (
          <div key={rating.id} className={`bg-white rounded-lg border ${getRatingColor(rating.rating)} p-6 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    {renderStars(rating.rating)}
                    <p className="text-xs text-gray-600 mt-1">{rating.rating} out of 5 stars</p>
                  </div>
                  {rating.verified && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">✓ Verified</span>
                  )}
                  <span className="bg-white/60 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                    {rating.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{rating.serviceName}</h3>
                <p className="text-sm text-gray-700 mb-3">{rating.comment}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {rating.customerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(rating.date).toLocaleDateString('en-IN')}
                  </div>
                  <div className="bg-white/60 px-2 py-1 rounded text-xs font-medium">
                    {getServiceTypeLabel(rating.serviceType)}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/60 transition-colors text-gray-700 font-medium">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({rating.helpful})
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/60 transition-colors text-gray-700 font-medium">
                    <MessageSquare className="h-4 w-4" />
                    Report ({rating.unhelpful})
                  </button>
                </div>
              </div>

              <button
                className="ml-6 p-2 hover:bg-white/60 rounded-lg transition-colors text-gray-600 hover:text-gray-700 flex-shrink-0"
                aria-label="Download"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {filteredRatings.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No ratings found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
