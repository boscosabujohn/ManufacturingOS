'use client'

import { useState } from 'react'
import { BookOpen, Search, TrendingUp, Eye, ThumbsUp, Star, ExternalLink, Tag, FileText } from 'lucide-react'

export type ArticleCategory = 'getting-started' | 'troubleshooting' | 'how-to' | 'faq' | 'best-practices' | 'api';
export type ArticleStatus = 'published' | 'draft' | 'archived';

export interface KBArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  status: ArticleStatus;
  views: number;
  helpful: number;
  rating: number;
  lastUpdated: string;
  author: string;
  tags: string[];
  attachedToTickets: number;
}

export default function KnowledgeBaseIntegration() {
  const [searchQuery, setSearchQuery] = useState('');

  const [articles] = useState<KBArticle[]>([
    {
      id: 'KB-001',
      title: 'How to Reset Your Password',
      category: 'getting-started',
      status: 'published',
      views: 15234,
      helpful: 1420,
      rating: 4.8,
      lastUpdated: '2025-01-15',
      author: 'Sarah Wilson',
      tags: ['password', 'security', 'account'],
      attachedToTickets: 145
    },
    {
      id: 'KB-002',
      title: 'Troubleshooting Login Issues',
      category: 'troubleshooting',
      status: 'published',
      views: 12890,
      helpful: 1156,
      rating: 4.6,
      lastUpdated: '2025-01-18',
      author: 'John Doe',
      tags: ['login', 'authentication', 'troubleshooting'],
      attachedToTickets: 234
    },
    {
      id: 'KB-003',
      title: 'Integration with Third-Party Apps',
      category: 'how-to',
      status: 'published',
      views: 8765,
      helpful: 823,
      rating: 4.9,
      lastUpdated: '2025-01-20',
      author: 'Mike Johnson',
      tags: ['integration', 'api', 'apps'],
      attachedToTickets: 67
    },
    {
      id: 'KB-004',
      title: 'Understanding API Rate Limits',
      category: 'api',
      status: 'published',
      views: 5432,
      helpful: 512,
      rating: 4.7,
      lastUpdated: '2025-01-22',
      author: 'Emily Chen',
      tags: ['api', 'rate-limit', 'best-practices'],
      attachedToTickets: 89
    },
    {
      id: 'KB-005',
      title: 'Best Practices for Data Security',
      category: 'best-practices',
      status: 'published',
      views: 9876,
      helpful: 945,
      rating: 4.9,
      lastUpdated: '2025-01-10',
      author: 'David Lee',
      tags: ['security', 'data', 'compliance'],
      attachedToTickets: 123
    },
    {
      id: 'KB-006',
      title: 'Frequently Asked Questions',
      category: 'faq',
      status: 'published',
      views: 18543,
      helpful: 1678,
      rating: 4.5,
      lastUpdated: '2025-01-24',
      author: 'Support Team',
      tags: ['faq', 'general', 'common-questions'],
      attachedToTickets: 456
    }
  ]);

  const getCategoryColor = (category: ArticleCategory) => {
    const colors = {
      'getting-started': 'bg-green-100 text-green-700',
      'troubleshooting': 'bg-red-100 text-red-700',
      'how-to': 'bg-blue-100 text-blue-700',
      'faq': 'bg-purple-100 text-purple-700',
      'best-practices': 'bg-yellow-100 text-yellow-700',
      'api': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category];
  };

  const totalViews = articles.reduce((sum, art) => sum + art.views, 0);
  const totalHelpful = articles.reduce((sum, art) => sum + art.helpful, 0);
  const avgRating = articles.reduce((sum, art) => sum + art.rating, 0) / articles.length;
  const totalAttached = articles.reduce((sum, art) => sum + art.attachedToTickets, 0);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Knowledge Base Integration
            </h2>
            <p className="text-gray-600 mt-1">Self-service articles with AI-powered suggestions</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Article
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{totalHelpful.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Helpful Votes</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">{avgRating.toFixed(1)} ★</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{totalAttached}</div>
          <div className="text-sm text-gray-600">Ticket Attachments</div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Articles</h3>
          <p className="text-sm text-gray-600 mt-1">{filteredArticles.length} articles available</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{article.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>Updated {article.lastUpdated}</span>
                    <span>•</span>
                    <span>{article.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">
                  <ExternalLink className="h-4 w-4" />
                  View
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Eye className="h-4 w-4" />
                    Views
                  </div>
                  <div className="text-lg font-bold text-gray-900">{article.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </div>
                  <div className="text-lg font-bold text-green-600">{article.helpful.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Star className="h-4 w-4" />
                    Rating
                  </div>
                  <div className="text-lg font-bold text-yellow-600">{article.rating} ★</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <FileText className="h-4 w-4" />
                    Attachments
                  </div>
                  <div className="text-lg font-bold text-purple-600">{article.attachedToTickets}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Article Suggestions</h4>
            <p className="text-sm text-gray-700 mb-3">
              When agents view a ticket, our AI automatically suggests relevant KB articles based on ticket content, historical resolution patterns, and semantic analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-purple-200">
                <div className="text-xs text-purple-600 font-medium mb-1">AUTO-ATTACH</div>
                <div className="text-sm text-gray-700">Articles automatically linked to similar tickets</div>
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <div className="text-xs text-purple-600 font-medium mb-1">DEFLECTION</div>
                <div className="text-sm text-gray-700">Show articles before ticket submission</div>
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <div className="text-xs text-purple-600 font-medium mb-1">LEARNING</div>
                <div className="text-sm text-gray-700">AI learns from agent article selection</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
