'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, BookOpen, FileText, Video, Download, ThumbsUp, MessageCircle, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Tag, User, Calendar, Star } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  articleId: string;
  title: string;
  summary: string;
  content: string;
  category: 'how_to' | 'troubleshooting' | 'faq' | 'best_practices' | 'documentation' | 'video_tutorial';
  subcategory: string;
  author: string;
  status: 'draft' | 'published' | 'archived' | 'under_review';
  views: number;
  likes: number;
  comments: number;
  helpful: number;
  notHelpful: number;
  tags: string[];
  createdDate: string;
  updatedDate: string;
  publishedDate?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  attachments: number;
  relatedArticles: number;
}

const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    articleId: 'KB-2025-001',
    title: 'How to Create a Sales Quotation in ERP System',
    summary: 'Step-by-step guide for creating and managing sales quotations',
    content: 'Complete guide with screenshots and best practices...',
    category: 'how_to',
    subcategory: 'Sales',
    author: 'Priya Patel',
    status: 'published',
    views: 1250,
    likes: 85,
    comments: 12,
    helpful: 92,
    notHelpful: 8,
    tags: ['sales', 'quotation', 'crm', 'getting-started'],
    createdDate: '2025-09-15',
    updatedDate: '2025-10-10',
    publishedDate: '2025-09-20',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    attachments: 5,
    relatedArticles: 3,
  },
  {
    id: '2',
    articleId: 'KB-2025-002',
    title: 'Troubleshooting Slow Report Generation',
    summary: 'Common causes and solutions for slow custom report generation',
    content: 'Detailed troubleshooting steps and performance optimization tips...',
    category: 'troubleshooting',
    subcategory: 'Reporting',
    author: 'Rahul Kumar',
    status: 'published',
    views: 890,
    likes: 67,
    comments: 8,
    helpful: 75,
    notHelpful: 15,
    tags: ['performance', 'reports', 'optimization', 'troubleshooting'],
    createdDate: '2025-09-20',
    updatedDate: '2025-10-12',
    publishedDate: '2025-09-25',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    attachments: 3,
    relatedArticles: 5,
  },
  {
    id: '3',
    articleId: 'KB-2025-003',
    title: 'Production Planning - Best Practices',
    summary: 'Industry best practices for effective production planning and scheduling',
    content: 'Comprehensive guide covering planning strategies and tips...',
    category: 'best_practices',
    subcategory: 'Production',
    author: 'Amit Singh',
    status: 'published',
    views: 2100,
    likes: 145,
    comments: 24,
    helpful: 156,
    notHelpful: 12,
    tags: ['production', 'planning', 'best-practices', 'manufacturing'],
    createdDate: '2025-08-10',
    updatedDate: '2025-10-05',
    publishedDate: '2025-08-15',
    difficulty: 'advanced',
    estimatedReadTime: 20,
    attachments: 8,
    relatedArticles: 7,
  },
  {
    id: '4',
    articleId: 'KB-2025-004',
    title: 'Frequently Asked Questions - Inventory Management',
    summary: 'Common questions and answers about inventory tracking and management',
    content: 'Q&A format covering most common inventory scenarios...',
    category: 'faq',
    subcategory: 'Inventory',
    author: 'Sanjay Gupta',
    status: 'published',
    views: 1680,
    likes: 98,
    comments: 15,
    helpful: 132,
    notHelpful: 18,
    tags: ['faq', 'inventory', 'warehouse', 'stock'],
    createdDate: '2025-09-01',
    updatedDate: '2025-10-14',
    publishedDate: '2025-09-05',
    difficulty: 'beginner',
    estimatedReadTime: 15,
    attachments: 2,
    relatedArticles: 6,
  },
  {
    id: '5',
    articleId: 'KB-2025-005',
    title: 'Video Tutorial: Bill of Quantities (BOQ) Creation',
    summary: 'Video walkthrough demonstrating BOQ creation for estimation projects',
    content: 'Complete video guide with practical examples and templates...',
    category: 'video_tutorial',
    subcategory: 'Estimation',
    author: 'Neha Sharma',
    status: 'published',
    views: 3450,
    likes: 234,
    comments: 45,
    helpful: 298,
    notHelpful: 22,
    tags: ['video', 'boq', 'estimation', 'tutorial'],
    createdDate: '2025-09-10',
    updatedDate: '2025-09-28',
    publishedDate: '2025-09-15',
    difficulty: 'intermediate',
    estimatedReadTime: 25,
    attachments: 1,
    relatedArticles: 4,
  },
  {
    id: '6',
    articleId: 'KB-2025-006',
    title: 'API Integration Documentation',
    summary: 'Technical documentation for integrating third-party systems with ERP',
    content: 'Complete API reference with code samples and authentication guide...',
    category: 'documentation',
    subcategory: 'Technical',
    author: 'Vikram Reddy',
    status: 'published',
    views: 567,
    likes: 42,
    comments: 18,
    helpful: 48,
    notHelpful: 6,
    tags: ['api', 'integration', 'technical', 'development'],
    createdDate: '2025-10-01',
    updatedDate: '2025-10-15',
    publishedDate: '2025-10-05',
    difficulty: 'advanced',
    estimatedReadTime: 30,
    attachments: 10,
    relatedArticles: 8,
  },
  {
    id: '7',
    articleId: 'KB-2025-007',
    title: 'How to Configure Email Notifications',
    summary: 'Guide for setting up and customizing email notifications in the system',
    content: 'Step-by-step instructions for configuring various notification types...',
    category: 'how_to',
    subcategory: 'System Configuration',
    author: 'Priya Patel',
    status: 'under_review',
    views: 234,
    likes: 18,
    comments: 3,
    helpful: 22,
    notHelpful: 2,
    tags: ['email', 'notifications', 'configuration', 'setup'],
    createdDate: '2025-10-12',
    updatedDate: '2025-10-16',
    difficulty: 'beginner',
    estimatedReadTime: 10,
    attachments: 4,
    relatedArticles: 2,
  },
  {
    id: '8',
    articleId: 'KB-2025-008',
    title: 'Troubleshooting Payment Gateway Issues',
    summary: 'Common payment processing errors and their resolutions',
    content: 'Troubleshooting guide for payment integration problems...',
    category: 'troubleshooting',
    subcategory: 'Finance',
    author: 'Rahul Kumar',
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
    helpful: 0,
    notHelpful: 0,
    tags: ['payment', 'gateway', 'troubleshooting', 'finance'],
    createdDate: '2025-10-16',
    updatedDate: '2025-10-17',
    difficulty: 'intermediate',
    estimatedReadTime: 15,
    attachments: 2,
    relatedArticles: 3,
  },
];

const categoryColors = {
  how_to: 'bg-blue-100 text-blue-700',
  troubleshooting: 'bg-orange-100 text-orange-700',
  faq: 'bg-green-100 text-green-700',
  best_practices: 'bg-purple-100 text-purple-700',
  documentation: 'bg-gray-100 text-gray-700',
  video_tutorial: 'bg-pink-100 text-pink-700',
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
  under_review: 'bg-yellow-100 text-yellow-700',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-orange-100 text-orange-700',
};

export default function KnowledgePage() {
  const router = useRouter();
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof KnowledgeArticle | null>('views');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const handleSort = (field: keyof KnowledgeArticle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.articleId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
  });

  if (sortField) {
    filteredArticles = [...filteredArticles].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue !== undefined && bValue !== undefined && aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue !== undefined && bValue !== undefined && aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    avgHelpful: Math.round(articles.reduce((sum, a) => sum + (a.helpful / (a.helpful + a.notHelpful || 1) * 100), 0) / articles.length),
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  const handleExport = () => {
    alert('Exporting knowledge base to PDF...');
    console.log('Exporting articles:', filteredArticles);
  };

  const getHelpfulPercentage = (helpful: number, notHelpful: number) => {
    const total = helpful + notHelpful;
    if (total === 0) return 0;
    return Math.round((helpful / total) * 100);
  };

  return (
    <div className="w-full min-h-screen px-3 py-2 w-full max-w-full">
      <div className="mb-3 flex items-start gap-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Articles</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Published</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.published}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Avg Helpful</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.avgHelpful}%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/support/knowledge/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>New Article</span>
        </button>
      </div>

      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, summary, tags, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="how_to">How To</option>
                <option value="troubleshooting">Troubleshooting</option>
                <option value="faq">FAQ</option>
                <option value="best_practices">Best Practices</option>
                <option value="documentation">Documentation</option>
                <option value="video_tutorial">Video Tutorial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="under_review">Under Review</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setDifficultyFilter('all');
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('articleId')}>
                  <div className="flex items-center space-x-1">
                    <span>Article #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('views')}>
                  <div className="flex items-center space-x-1">
                    <span>Views</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('updatedDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Updated</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{article.articleId}</div>
                    <div className="text-xs text-gray-500">{article.author}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 max-w-xs">{article.title}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{article.summary}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[article.category]}`}>
                      {article.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{article.subcategory}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[article.status]}`}>
                      {article.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColors[article.difficulty]}`}>
                      {article.difficulty.charAt(0).toUpperCase() + article.difficulty.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{article.estimatedReadTime} min read</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{article.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {getHelpfulPercentage(article.helpful, article.notHelpful)}% helpful
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700">{article.updatedDate}</div>
                    {article.publishedDate && (
                      <div className="text-xs text-gray-500 mt-1">Pub: {article.publishedDate}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/support/knowledge/view/${article.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"

                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/support/knowledge/edit/${article.id}`)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"

                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"

                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredArticles.length)} of {filteredArticles.length} articles
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
