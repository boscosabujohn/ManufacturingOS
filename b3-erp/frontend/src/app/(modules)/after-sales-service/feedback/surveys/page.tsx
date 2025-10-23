'use client';

import { useState, useMemo } from 'react';
import { ClipboardList, Search, Plus, Send, Eye, Download, Filter, Calendar, User, TrendingUp, MessageSquare, BarChart3, CheckCircle, Clock } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'customer' | 'technician' | 'installation';
  category: string;
  status: 'active' | 'draft' | 'closed';
  startDate: string;
  endDate: string;
  responses: number;
  responseRate: number;
  questions: number;
  createdBy: string;
  averageCompletionTime: number; // in minutes
  featured: boolean;
}

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Service Quality & Satisfaction Survey',
    description: 'Comprehensive survey measuring customer satisfaction with recent service call',
    type: 'customer',
    category: 'Service Quality',
    status: 'active',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    responses: 156,
    responseRate: 72,
    questions: 15,
    createdBy: 'Rajesh Kumar',
    averageCompletionTime: 8,
    featured: true
  },
  {
    id: '2',
    title: 'Technician Performance Feedback',
    description: 'Rate the professionalism and technical knowledge of your service technician',
    type: 'customer',
    category: 'Technician',
    status: 'active',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    responses: 189,
    responseRate: 68,
    questions: 12,
    createdBy: 'Priya Sharma',
    averageCompletionTime: 6,
    featured: true
  },
  {
    id: '3',
    title: 'Installation Experience Survey',
    description: 'Share your feedback about the installation process and experience',
    type: 'installation',
    category: 'Installation',
    status: 'active',
    startDate: '2025-09-15',
    endDate: '2025-10-30',
    responses: 234,
    responseRate: 75,
    questions: 18,
    createdBy: 'Amit Singh',
    averageCompletionTime: 10,
    featured: true
  },
  {
    id: '4',
    title: 'Product Reliability Feedback',
    description: 'How reliable has your appliance been since installation?',
    type: 'customer',
    category: 'Product Quality',
    status: 'active',
    startDate: '2025-10-05',
    endDate: '2025-11-05',
    responses: 92,
    responseRate: 65,
    questions: 8,
    createdBy: 'Vikram Patel',
    averageCompletionTime: 5,
    featured: false
  },
  {
    id: '5',
    title: 'Technician Internal Assessment',
    description: 'Self-assessment survey for field technicians on job satisfaction',
    type: 'technician',
    category: 'Internal',
    status: 'active',
    startDate: '2025-10-15',
    endDate: '2025-10-31',
    responses: 42,
    responseRate: 85,
    questions: 20,
    createdBy: 'Neha Desai',
    averageCompletionTime: 12,
    featured: false
  },
  {
    id: '6',
    title: 'Warranty Claim Process Feedback',
    description: 'How satisfied are you with our warranty claim process?',
    type: 'customer',
    category: 'Warranty',
    status: 'active',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    responses: 78,
    responseRate: 70,
    questions: 10,
    createdBy: 'Sanjay Verma',
    averageCompletionTime: 7,
    featured: false
  },
  {
    id: '7',
    title: 'Support Team Communication',
    description: 'Rate the communication and responsiveness of our support team',
    type: 'customer',
    category: 'Support',
    status: 'closed',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    responses: 213,
    responseRate: 78,
    questions: 14,
    createdBy: 'Isha Nair',
    averageCompletionTime: 9,
    featured: true
  },
  {
    id: '8',
    title: 'Parts Availability & Delivery',
    description: 'Feedback on parts ordering, availability, and delivery times',
    type: 'customer',
    category: 'Parts',
    status: 'draft',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    responses: 0,
    responseRate: 0,
    questions: 11,
    createdBy: 'Rohan Gupta',
    averageCompletionTime: 0,
    featured: false
  }
];

export default function SurveysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [sortBy, setSortBy] = useState<'responses' | 'recent' | 'responseRate'>('responses');

  const categories = ['Service Quality', 'Technician', 'Installation', 'Product Quality', 'Internal', 'Warranty', 'Support', 'Parts'];
  const types = ['customer', 'technician', 'installation'];

  const filteredSurveys = useMemo(() => {
    let filtered = mockSurveys.filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || survey.category === selectedCategory;
      const matchesType = selectedType === 'all' || survey.type === selectedType;
      const matchesStatus = survey.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });

    // Sort
    if (sortBy === 'responses') {
      filtered.sort((a, b) => b.responses - a.responses);
    } else if (sortBy === 'responseRate') {
      filtered.sort((a, b) => b.responseRate - a.responseRate);
    } else {
      filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedType, selectedStatus, sortBy]);

  const stats = {
    total: mockSurveys.length,
    active: mockSurveys.filter(s => s.status === 'active').length,
    totalResponses: mockSurveys.reduce((sum, s) => sum + s.responses, 0),
    avgResponseRate: (mockSurveys.filter(s => s.responses > 0).reduce((sum, s) => sum + s.responseRate, 0) / mockSurveys.filter(s => s.responses > 0).length).toFixed(0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'bg-blue-100 text-blue-700';
      case 'technician': return 'bg-purple-100 text-purple-700';
      case 'installation': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-emerald-600" />
            Customer Surveys
          </h1>
          <p className="text-gray-600 mt-1">Create and manage feedback surveys</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          Create Survey
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Surveys</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalResponses.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.avgResponseRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
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
              placeholder="Search surveys..."
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Types</option>
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="installation">Installation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="responses">Most Responses</option>
                <option value="responseRate">Highest Response Rate</option>
                <option value="recent">Recently Created</option>
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

      {/* Surveys List */}
      <div className="space-y-4">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{survey.title}</h3>
                  {survey.featured && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">Featured</span>
                  )}
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(survey.status)}`}>
                    {survey.status.toUpperCase()}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(survey.type)}`}>
                    {survey.type.charAt(0).toUpperCase() + survey.type.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{survey.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Questions</p>
                    <p className="text-lg font-semibold text-gray-900">{survey.questions}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Responses</p>
                    <p className="text-lg font-semibold text-blue-600">{survey.responses}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Response Rate</p>
                    <p className="text-lg font-semibold text-green-600">{survey.responseRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{survey.averageCompletionTime} min</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{survey.category}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Created By</p>
                    <p className="text-sm font-semibold text-gray-900">{survey.createdBy.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(survey.startDate).toLocaleDateString('en-IN')} - {new Date(survey.endDate).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-6">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                  aria-label="View"
                  title="View"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-emerald-600 hover:text-emerald-700"
                  aria-label="View Analytics"
                  title="View Analytics"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-orange-600 hover:text-orange-700"
                  aria-label="Download"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSurveys.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No surveys found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
