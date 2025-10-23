'use client';

import { useState, useMemo } from 'react';
import { FileText, Search, Eye, Edit, Trash2, Plus, Calendar, User, Tag, ThumbsUp, MessageSquare, TrendingUp, Filter, ChevronRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  dateCreated: string;
  dateUpdated: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  status: 'published' | 'draft';
  tags: string[];
  readTime: number;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'How to Perform Regular Maintenance on Kitchen Equipment',
    description: 'Comprehensive guide on maintaining kitchen appliances to ensure optimal performance and longevity',
    category: 'Maintenance',
    author: 'Rajesh Kumar',
    dateCreated: '2025-09-15',
    dateUpdated: '2025-10-18',
    views: 342,
    likes: 45,
    comments: 12,
    featured: true,
    status: 'published',
    tags: ['Kitchen', 'Maintenance', 'Equipment'],
    readTime: 8
  },
  {
    id: '2',
    title: 'Troubleshooting Common Microwave Issues',
    description: 'Step-by-step guide to diagnose and fix the most common microwave problems',
    category: 'Troubleshooting',
    author: 'Priya Sharma',
    dateCreated: '2025-09-10',
    dateUpdated: '2025-10-17',
    views: 287,
    likes: 38,
    comments: 8,
    featured: true,
    status: 'published',
    tags: ['Microwave', 'Troubleshooting', 'DIY'],
    readTime: 6
  },
  {
    id: '3',
    title: 'Understanding Warranty Coverage and Limitations',
    description: 'Complete overview of what is and is not covered under our standard warranty',
    category: 'Warranty',
    author: 'Amit Singh',
    dateCreated: '2025-08-25',
    dateUpdated: '2025-10-16',
    views: 215,
    likes: 28,
    comments: 5,
    featured: false,
    status: 'published',
    tags: ['Warranty', 'Coverage', 'Policy'],
    readTime: 5
  },
  {
    id: '4',
    title: 'Best Practices for Installation Safety',
    description: 'Important safety guidelines to follow during equipment installation',
    category: 'Installation',
    author: 'Vikram Patel',
    dateCreated: '2025-08-20',
    dateUpdated: '2025-10-15',
    views: 198,
    likes: 31,
    comments: 7,
    featured: false,
    status: 'published',
    tags: ['Safety', 'Installation', 'Guidelines'],
    readTime: 7
  },
  {
    id: '5',
    title: 'Water Filter Replacement Guide',
    description: 'How to safely replace water filters in your appliances',
    category: 'Maintenance',
    author: 'Neha Desai',
    dateCreated: '2025-08-15',
    dateUpdated: '2025-10-14',
    views: 156,
    likes: 22,
    comments: 4,
    featured: false,
    status: 'published',
    tags: ['Filters', 'Maintenance', 'Care'],
    readTime: 4
  },
  {
    id: '6',
    title: 'Energy Efficiency Tips for Your Refrigerator',
    description: 'Learn how to optimize your refrigerator settings for maximum energy efficiency',
    category: 'Optimization',
    author: 'Sanjay Verma',
    dateCreated: '2025-08-10',
    dateUpdated: '2025-10-13',
    views: 289,
    likes: 52,
    comments: 11,
    featured: true,
    status: 'published',
    tags: ['Energy', 'Efficiency', 'Refrigerator'],
    readTime: 6
  },
  {
    id: '7',
    title: 'Understanding Error Codes on Your Display Panel',
    description: 'A complete guide to interpreting and resolving error codes displayed on modern appliances',
    category: 'Troubleshooting',
    author: 'Isha Nair',
    dateCreated: '2025-07-30',
    dateUpdated: '2025-10-12',
    views: 421,
    likes: 67,
    comments: 18,
    featured: true,
    status: 'published',
    tags: ['Error Codes', 'Troubleshooting', 'Support'],
    readTime: 9
  },
  {
    id: '8',
    title: 'Extended Service Plan Benefits',
    description: 'Overview of benefits included in our extended service plans',
    category: 'Service Plans',
    author: 'Rohan Gupta',
    dateCreated: '2025-07-25',
    dateUpdated: '2025-10-11',
    views: 134,
    likes: 19,
    comments: 3,
    featured: false,
    status: 'published',
    tags: ['Service Plans', 'Coverage', 'Benefits'],
    readTime: 5
  }
];

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('published');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'likes'>('recent');

  const categories = ['Maintenance', 'Troubleshooting', 'Warranty', 'Installation', 'Optimization', 'Service Plans'];

  const filteredArticles = useMemo(() => {
    let filtered = mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesStatus = article.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'likes') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else {
      filtered.sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedStatus, sortBy]);

  const stats = {
    total: mockArticles.length,
    published: mockArticles.filter(a => a.status === 'published').length,
    draft: mockArticles.filter(a => a.status === 'draft').length,
    featured: mockArticles.filter(a => a.featured).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-emerald-600" />
            Knowledge Base Articles
          </h1>
          <p className="text-gray-600 mt-1">Browse and manage service knowledge articles</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          New Article
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.published}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.draft}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Edit className="h-6 w-6 text-yellow-600" />
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
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
              placeholder="Search articles by title or content..."
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
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
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                  {article.featured && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">Featured</span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{article.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.dateUpdated).toLocaleDateString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {article.category}
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {article.readTime} min read
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {article.likes} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {article.comments} comments
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-amber-600 hover:text-amber-700"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No articles found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
