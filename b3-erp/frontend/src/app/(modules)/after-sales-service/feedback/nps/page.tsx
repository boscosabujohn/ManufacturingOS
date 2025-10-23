'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Search, Filter, BarChart3, PieChart, LineChart, Download, Calendar, User, MessageSquare, Award, Target, AlertCircle } from 'lucide-react';

interface NPSResponse {
  id: string;
  respondentName: string;
  email: string;
  score: number; // 0-10
  category: 'promoter' | 'passive' | 'detractor';
  feedback: string;
  date: string;
  serviceType: string;
  region: string;
}

const mockNPSResponses: NPSResponse[] = [
  {
    id: '1',
    respondentName: 'Anjali Patel',
    email: 'anjali.patel@example.com',
    score: 10,
    category: 'promoter',
    feedback: 'Excellent service! Would definitely recommend to friends and family.',
    date: '2025-10-18',
    serviceType: 'Service Call',
    region: 'Mumbai'
  },
  {
    id: '2',
    respondentName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    score: 9,
    category: 'promoter',
    feedback: 'Great experience overall. Very professional team.',
    date: '2025-10-17',
    serviceType: 'Installation',
    region: 'Bangalore'
  },
  {
    id: '3',
    respondentName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    score: 8,
    category: 'promoter',
    feedback: 'Good service with minor delays. Overall satisfied.',
    date: '2025-10-16',
    serviceType: 'Parts Delivery',
    region: 'Delhi'
  },
  {
    id: '4',
    respondentName: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    score: 7,
    category: 'passive',
    feedback: 'Service was okay. Expected faster response time.',
    date: '2025-10-15',
    serviceType: 'Service Call',
    region: 'Pune'
  },
  {
    id: '5',
    respondentName: 'Neha Desai',
    email: 'neha.desai@example.com',
    score: 8,
    category: 'promoter',
    feedback: 'Satisfied with the technician\'s expertise and professionalism.',
    date: '2025-10-14',
    serviceType: 'Maintenance',
    region: 'Ahmedabad'
  },
  {
    id: '6',
    respondentName: 'Sanjay Verma',
    email: 'sanjay.verma@example.com',
    score: 6,
    category: 'passive',
    feedback: 'Average experience. Some communication gaps occurred.',
    date: '2025-10-13',
    serviceType: 'Installation',
    region: 'Hyderabad'
  },
  {
    id: '7',
    respondentName: 'Isha Nair',
    email: 'isha.nair@example.com',
    score: 10,
    category: 'promoter',
    feedback: 'Outstanding! Best service I\'ve had. Will definitely refer others.',
    date: '2025-10-12',
    serviceType: 'Service Call',
    region: 'Chennai'
  },
  {
    id: '8',
    respondentName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    score: 5,
    category: 'detractor',
    feedback: 'Not satisfied with the service quality. Technician was unprofessional.',
    date: '2025-10-11',
    serviceType: 'Warranty',
    region: 'Kolkata'
  },
  {
    id: '9',
    respondentName: 'Meera Nair',
    email: 'meera.nair@example.com',
    score: 9,
    category: 'promoter',
    feedback: 'Excellent service and very supportive team. Highly recommend!',
    date: '2025-10-10',
    serviceType: 'Installation',
    region: 'Pune'
  },
  {
    id: '10',
    respondentName: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    score: 3,
    category: 'detractor',
    feedback: 'Poor experience. Issue not resolved and poor customer service.',
    date: '2025-10-09',
    serviceType: 'Service Call',
    region: 'Mumbai'
  }
];

export default function NPSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'score'>('recent');

  const regions = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Ahmedabad', 'Hyderabad', 'Chennai', 'Kolkata'];

  const filteredResponses = useMemo(() => {
    let filtered = mockNPSResponses.filter(response => {
      const matchesSearch = response.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || response.category === selectedCategory;
      const matchesRegion = selectedRegion === 'all' || response.region === selectedRegion;
      return matchesSearch && matchesCategory && matchesRegion;
    });

    // Sort
    if (sortBy === 'score') {
      filtered.sort((a, b) => b.score - a.score);
    } else {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedRegion, sortBy]);

  const stats = {
    total: mockNPSResponses.length,
    promoters: mockNPSResponses.filter(r => r.category === 'promoter').length,
    passives: mockNPSResponses.filter(r => r.category === 'passive').length,
    detractors: mockNPSResponses.filter(r => r.category === 'detractor').length,
    avgScore: (mockNPSResponses.reduce((sum, r) => sum + r.score, 0) / mockNPSResponses.length).toFixed(1),
    npsScore: (((mockNPSResponses.filter(r => r.category === 'promoter').length - mockNPSResponses.filter(r => r.category === 'detractor').length) / mockNPSResponses.length) * 100).toFixed(0)
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'promoter': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'passive': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'detractor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'promoter': return <Award className="h-5 w-5" />;
      case 'passive': return <AlertCircle className="h-5 w-5" />;
      case 'detractor': return <AlertCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const renderScoreBar = (score: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              score >= 9
                ? 'bg-emerald-500 w-11/12'
                : score >= 7
                ? 'bg-yellow-500 w-3/4'
                : 'bg-red-500 w-1/2'
            }`}
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-900 w-8 text-right">{score}/10</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Target className="h-8 w-8 text-emerald-600" />
          Net Promoter Score (NPS)
        </h1>
        <p className="text-gray-600 mt-1">Track customer loyalty and satisfaction metrics</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">NPS Score</p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.npsScore}</p>
              <p className="text-xs text-emerald-600 mt-1">Excellent Range</p>
            </div>
            <div className="bg-emerald-200 p-3 rounded-lg">
              <Target className="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promoters</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.promoters}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.promoters / stats.total) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passives</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.passives}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.passives / stats.total) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Detractors</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.detractors}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.detractors / stats.total) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* NPS Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-emerald-600" />
            Response Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  Promoters (9-10)
                </span>
                <span className="text-sm font-semibold text-gray-900">{stats.promoters}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(stats.promoters / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Passives (7-8)
                </span>
                <span className="text-sm font-semibold text-gray-900">{stats.passives}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.passives / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Detractors (0-6)
                </span>
                <span className="text-sm font-semibold text-gray-900">{stats.detractors}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats.detractors / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-emerald-600" />
            Metrics Summary
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
              <p className="text-xs text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.avgScore} / 10</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-blue-700">100%</p>
              <p className="text-xs text-blue-600 mt-1">All invited customers responded</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <p className="text-xs text-gray-600 mb-1">Benchmark</p>
              <p className="text-2xl font-bold text-purple-700">70-80</p>
              <p className="text-xs text-purple-600 mt-1">Industry average range</p>
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
              placeholder="Search by name, email, or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Categories</option>
                <option value="promoter">Promoters</option>
                <option value="passive">Passives</option>
                <option value="detractor">Detractors</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
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
                <option value="recent">Recently Responded</option>
                <option value="score">Highest Score</option>
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

      {/* Responses List */}
      <div className="space-y-4">
        {filteredResponses.map((response) => (
          <div key={response.id} className={`rounded-lg border ${getCategoryColor(response.category)} p-6 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{response.respondentName}</h3>
                  <span className="inline-flex items-center gap-1 font-medium text-sm">
                    {getCategoryIcon(response.category)}
                    {response.category.charAt(0).toUpperCase() + response.category.slice(1)}
                  </span>
                </div>

                <div className="mb-4">{renderScoreBar(response.score)}</div>

                <p className="text-gray-700 mb-3 italic">"{response.feedback}"</p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {response.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(response.date).toLocaleDateString('en-IN')}
                  </div>
                  <span className="bg-white/40 px-2 py-1 rounded text-xs font-medium">
                    {response.serviceType}
                  </span>
                  <span className="bg-white/40 px-2 py-1 rounded text-xs font-medium">
                    {response.region}
                  </span>
                </div>
              </div>

              <button
                className="ml-6 p-2 hover:bg-white/40 rounded-lg transition-colors flex-shrink-0"
                aria-label="Download"
                title="Download"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}

        {filteredResponses.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No responses found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
