'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Download, Search, Plus, FileText, Calendar, User, Tag, Eye, Star, Filter, Grid, List, BarChart3 } from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  productModel: string;
  description: string;
  category: string;
  author: string;
  datePublished: string;
  fileSize: string;
  format: 'pdf' | 'doc' | 'epub';
  downloads: number;
  rating: number;
  views: number;
  language: string;
  pages: number;
  versions: number;
  featured: boolean;
}

const mockManuals: Manual[] = [
  {
    id: '1',
    title: 'Kitchen Master Pro - Complete Operation Manual',
    productModel: 'KMP-2025-X1',
    description: 'Comprehensive user manual covering all features and operations of Kitchen Master Pro',
    category: 'Operation',
    author: 'Manish Kumar',
    datePublished: '2025-09-20',
    fileSize: '45.2 MB',
    format: 'pdf',
    downloads: 342,
    rating: 4.8,
    views: 1245,
    language: 'English',
    pages: 156,
    versions: 3,
    featured: true
  },
  {
    id: '2',
    title: 'Advanced Refrigeration System Manual',
    productModel: 'REF-2025-PRO',
    description: 'Technical manual for advanced refrigeration systems with troubleshooting guide',
    category: 'Technical',
    author: 'Priya Sharma',
    datePublished: '2025-09-15',
    fileSize: '32.8 MB',
    format: 'pdf',
    downloads: 289,
    rating: 4.7,
    views: 987,
    language: 'English',
    pages: 198,
    versions: 2,
    featured: true
  },
  {
    id: '3',
    title: 'Microwave Oven Quick Start Guide',
    productModel: 'MW-QS-2025',
    description: 'Quick start guide for basic microwave operations and safety features',
    category: 'Quick Start',
    author: 'Rajesh Patel',
    datePublished: '2025-09-10',
    fileSize: '8.5 MB',
    format: 'pdf',
    downloads: 156,
    rating: 4.6,
    views: 523,
    language: 'English',
    pages: 24,
    versions: 1,
    featured: false
  },
  {
    id: '4',
    title: 'Installation & Maintenance Guide',
    productModel: 'ALL-PRODUCTS',
    description: 'Universal guide for installation and regular maintenance of all appliances',
    category: 'Installation',
    author: 'Vijay Singh',
    datePublished: '2025-09-05',
    fileSize: '28.4 MB',
    format: 'pdf',
    downloads: 423,
    rating: 4.9,
    views: 1876,
    language: 'English',
    pages: 112,
    versions: 4,
    featured: true
  },
  {
    id: '5',
    title: 'Washing Machine - Advanced Settings',
    productModel: 'WM-ADV-2025',
    description: 'Complete guide to advanced features and settings for smart washing machines',
    category: 'Features',
    author: 'Neha Desai',
    datePublished: '2025-08-30',
    fileSize: '22.6 MB',
    format: 'pdf',
    downloads: 267,
    rating: 4.5,
    views: 734,
    language: 'English',
    pages: 89,
    versions: 2,
    featured: false
  },
  {
    id: '6',
    title: 'Dishwasher Troubleshooting Manual',
    productModel: 'DW-TROUBLESHOOT',
    description: 'Step-by-step troubleshooting guide for common dishwasher issues',
    category: 'Troubleshooting',
    author: 'Sanjay Verma',
    datePublished: '2025-08-25',
    fileSize: '15.3 MB',
    format: 'pdf',
    downloads: 198,
    rating: 4.7,
    views: 621,
    language: 'English',
    pages: 67,
    versions: 3,
    featured: false
  },
  {
    id: '7',
    title: 'Smart Appliance Connectivity Guide',
    productModel: 'SMART-2025',
    description: 'Guide for connecting and managing smart appliances with mobile app',
    category: 'Technology',
    author: 'Isha Nair',
    datePublished: '2025-08-20',
    fileSize: '18.7 MB',
    format: 'pdf',
    downloads: 312,
    rating: 4.6,
    views: 892,
    language: 'English',
    pages: 78,
    versions: 2,
    featured: true
  },
  {
    id: '8',
    title: 'Energy Efficiency & Conservation Manual',
    productModel: 'ENERGY-GUIDE',
    description: 'Comprehensive guide on optimizing energy consumption across all appliances',
    category: 'Optimization',
    author: 'Rohan Gupta',
    datePublished: '2025-08-15',
    fileSize: '12.4 MB',
    format: 'pdf',
    downloads: 234,
    rating: 4.8,
    views: 756,
    language: 'English',
    pages: 54,
    versions: 1,
    featured: false
  }
];

export default function ManualsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'downloads' | 'rating'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['Operation', 'Technical', 'Quick Start', 'Installation', 'Features', 'Troubleshooting', 'Technology', 'Optimization'];
  const formats = ['pdf', 'doc', 'epub'];

  const filteredManuals = useMemo(() => {
    let filtered = mockManuals.filter(manual => {
      const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manual.productModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || manual.format === selectedFormat;
      return matchesSearch && matchesCategory && matchesFormat;
    });

    // Sort
    if (sortBy === 'downloads') {
      filtered.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedFormat, sortBy]);

  const stats = {
    total: mockManuals.length,
    featured: mockManuals.filter(m => m.featured).length,
    totalDownloads: mockManuals.reduce((sum, m) => sum + m.downloads, 0),
    avgRating: (mockManuals.reduce((sum, m) => sum + m.rating, 0) / mockManuals.length).toFixed(1)
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'doc': return 'bg-blue-100 text-blue-700';
      case 'epub': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            Product Manuals
          </h1>
          <p className="text-gray-600 mt-1">Download and manage product documentation</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          Upload Manual
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Manuals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.featured}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalDownloads.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.avgRating} ⭐</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
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
              placeholder="Search by title, model, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Formats</option>
                {formats.map(fmt => (
                  <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
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
                <option value="recent">Recently Updated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
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

      {/* Manuals Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuals.map((manual) => (
            <div key={manual.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 flex items-center justify-center h-32">
                <FileText className="h-16 w-16 text-emerald-600 opacity-50" />
              </div>

              <div className="p-6">
                {manual.featured && (
                  <div className="mb-3 inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">
                    Featured
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{manual.title}</h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{manual.description}</p>

                <div className="space-y-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Model:</span>
                    <span className="font-medium text-gray-900">{manual.productModel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pages:</span>
                    <span className="font-medium text-gray-900">{manual.pages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium text-gray-900">{manual.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format:</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getFormatColor(manual.format)}`}>
                      {manual.format.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">{manual.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                      <span className="text-gray-600">{manual.rating}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredManuals.map((manual) => (
            <div key={manual.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
              <div className="flex items-start gap-6 flex-1">
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-lg flex-shrink-0">
                  <FileText className="h-10 w-10 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{manual.title}</h3>
                    {manual.featured && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">Featured</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{manual.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{manual.productModel}</span>
                    <span>{manual.pages} pages</span>
                    <span>{manual.fileSize}</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getFormatColor(manual.format)}`}>
                      {manual.format.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-blue-600" />
                      <span>{manual.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                      <span>{manual.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="ml-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 flex-shrink-0">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredManuals.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No manuals found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
