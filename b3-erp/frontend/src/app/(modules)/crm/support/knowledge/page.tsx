'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, ThumbsUp, ThumbsDown, BookOpen, FileText, Video, Code, AlertCircle, TrendingUp, Star, Clock, User } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  articleNumber: string;
  title: string;
  excerpt: string;
  category: 'getting_started' | 'how_to' | 'troubleshooting' | 'api_docs' | 'best_practices' | 'faq' | 'release_notes';
  type: 'article' | 'video' | 'code_snippet' | 'tutorial';
  content: string;
  author: string;
  createdDate: string;
  lastUpdated: string;
  views: number;
  helpful: number;
  notHelpful: number;
  averageRating: number;
  totalRatings: number;
  isPinned: boolean;
  isPublished: boolean;
  tags: string[];
  relatedArticles: string[];
  estimatedReadTime: number; // in minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  attachments: number;
}

const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    articleNumber: 'KB-001',
    title: 'Getting Started with Your First Project',
    excerpt: 'Learn how to create and configure your first project in 5 simple steps.',
    category: 'getting_started',
    type: 'tutorial',
    content: 'Full tutorial content here...',
    author: 'Sarah Johnson',
    createdDate: '2024-01-15',
    lastUpdated: '2024-09-20',
    views: 12450,
    helpful: 1850,
    notHelpful: 125,
    averageRating: 4.7,
    totalRatings: 430,
    isPinned: true,
    isPublished: true,
    tags: ['Setup', 'Beginner', 'Quick Start'],
    relatedArticles: ['KB-002', 'KB-005'],
    estimatedReadTime: 8,
    difficultyLevel: 'beginner',
    attachments: 3,
  },
  {
    id: '2',
    articleNumber: 'KB-002',
    title: 'How to Configure SSO Authentication',
    excerpt: 'Step-by-step guide to setting up Single Sign-On with SAML 2.0 or OAuth 2.0.',
    category: 'how_to',
    type: 'article',
    content: 'Full article content here...',
    author: 'Michael Chen',
    createdDate: '2024-02-10',
    lastUpdated: '2024-10-05',
    views: 8920,
    helpful: 1420,
    notHelpful: 89,
    averageRating: 4.5,
    totalRatings: 312,
    isPinned: true,
    isPublished: true,
    tags: ['Authentication', 'SSO', 'Security', 'Advanced'],
    relatedArticles: ['KB-012', 'KB-018'],
    estimatedReadTime: 15,
    difficultyLevel: 'advanced',
    attachments: 5,
  },
  {
    id: '3',
    articleNumber: 'KB-003',
    title: 'Troubleshooting Dashboard Loading Issues',
    excerpt: 'Common solutions for dashboard performance problems and loading errors.',
    category: 'troubleshooting',
    type: 'article',
    content: 'Full troubleshooting guide...',
    author: 'David Park',
    createdDate: '2024-03-05',
    lastUpdated: '2024-10-18',
    views: 15680,
    helpful: 2340,
    notHelpful: 156,
    averageRating: 4.6,
    totalRatings: 578,
    isPinned: false,
    isPublished: true,
    tags: ['Dashboard', 'Performance', 'Troubleshooting'],
    relatedArticles: ['KB-007', 'KB-015'],
    estimatedReadTime: 10,
    difficultyLevel: 'intermediate',
    attachments: 4,
  },
  {
    id: '4',
    articleNumber: 'KB-004',
    title: 'REST API Quick Start Guide',
    excerpt: 'Get started with our REST API in minutes with examples in multiple languages.',
    category: 'api_docs',
    type: 'code_snippet',
    content: 'API documentation and code examples...',
    author: 'Sarah Johnson',
    createdDate: '2024-01-20',
    lastUpdated: '2024-10-10',
    views: 22340,
    helpful: 3120,
    notHelpful: 201,
    averageRating: 4.8,
    totalRatings: 892,
    isPinned: true,
    isPublished: true,
    tags: ['API', 'REST', 'Integration', 'Developer'],
    relatedArticles: ['KB-009', 'KB-014'],
    estimatedReadTime: 20,
    difficultyLevel: 'intermediate',
    attachments: 8,
  },
  {
    id: '5',
    articleNumber: 'KB-005',
    title: 'Best Practices for Data Security',
    excerpt: 'Essential security practices to protect your data and maintain compliance.',
    category: 'best_practices',
    type: 'article',
    content: 'Security best practices content...',
    author: 'Michael Chen',
    createdDate: '2024-02-28',
    lastUpdated: '2024-09-15',
    views: 9870,
    helpful: 1680,
    notHelpful: 78,
    averageRating: 4.9,
    totalRatings: 425,
    isPinned: false,
    isPublished: true,
    tags: ['Security', 'Best Practices', 'Compliance'],
    relatedArticles: ['KB-002', 'KB-011'],
    estimatedReadTime: 12,
    difficultyLevel: 'intermediate',
    attachments: 2,
  },
  {
    id: '6',
    articleNumber: 'KB-006',
    title: 'Frequently Asked Questions',
    excerpt: 'Answers to the most common questions about billing, features, and support.',
    category: 'faq',
    type: 'article',
    content: 'FAQ content...',
    author: 'David Park',
    createdDate: '2024-01-10',
    lastUpdated: '2024-10-19',
    views: 18920,
    helpful: 2580,
    notHelpful: 142,
    averageRating: 4.7,
    totalRatings: 634,
    isPinned: true,
    isPublished: true,
    tags: ['FAQ', 'General', 'Support'],
    relatedArticles: ['KB-001', 'KB-013'],
    estimatedReadTime: 5,
    difficultyLevel: 'beginner',
    attachments: 0,
  },
  {
    id: '7',
    articleNumber: 'KB-007',
    title: 'Video Tutorial: Advanced Reporting',
    excerpt: 'Learn how to create custom reports and dashboards with this 15-minute video tutorial.',
    category: 'how_to',
    type: 'video',
    content: 'Video tutorial...',
    author: 'Sarah Johnson',
    createdDate: '2024-04-12',
    lastUpdated: '2024-04-12',
    views: 6780,
    helpful: 890,
    notHelpful: 45,
    averageRating: 4.8,
    totalRatings: 234,
    isPinned: false,
    isPublished: true,
    tags: ['Reporting', 'Video', 'Advanced', 'Tutorial'],
    relatedArticles: ['KB-003', 'KB-010'],
    estimatedReadTime: 15,
    difficultyLevel: 'advanced',
    attachments: 1,
  },
  {
    id: '8',
    articleNumber: 'KB-008',
    title: 'Release Notes - Q3 2024',
    excerpt: 'New features, improvements, and bug fixes released in Q3 2024.',
    category: 'release_notes',
    type: 'article',
    content: 'Release notes content...',
    author: 'Michael Chen',
    createdDate: '2024-10-01',
    lastUpdated: '2024-10-01',
    views: 4520,
    helpful: 520,
    notHelpful: 28,
    averageRating: 4.6,
    totalRatings: 156,
    isPinned: false,
    isPublished: true,
    tags: ['Release Notes', 'Updates', 'Features'],
    relatedArticles: ['KB-016', 'KB-017'],
    estimatedReadTime: 7,
    difficultyLevel: 'beginner',
    attachments: 6,
  },
];

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [articles] = useState<KnowledgeArticle[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'getting_started' | 'how_to' | 'troubleshooting' | 'api_docs' | 'best_practices' | 'faq' | 'release_notes'>('all');
  const [filterType, setFilterType] = useState<'all' | 'article' | 'video' | 'code_snippet' | 'tutorial'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const handleCreateArticle = () => {
    router.push('/crm/support/knowledge/create');
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesType = filterType === 'all' || article.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || article.difficultyLevel === filterDifficulty;
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  // Separate pinned and unpinned articles
  const pinnedArticles = filteredArticles.filter(a => a.isPinned);
  const unpinnedArticles = filteredArticles.filter(a => !a.isPinned);

  const stats = {
    totalArticles: articles.filter(a => a.isPublished).length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    avgRating: (articles.reduce((sum, a) => sum + a.averageRating, 0) / articles.length).toFixed(1),
    helpfulRate: Math.round(
      (articles.reduce((sum, a) => sum + a.helpful, 0) /
       (articles.reduce((sum, a) => sum + a.helpful + a.notHelpful, 0))) * 100
    ),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting_started': return 'bg-green-100 text-green-700';
      case 'how_to': return 'bg-blue-100 text-blue-700';
      case 'troubleshooting': return 'bg-orange-100 text-orange-700';
      case 'api_docs': return 'bg-purple-100 text-purple-700';
      case 'best_practices': return 'bg-teal-100 text-teal-700';
      case 'faq': return 'bg-yellow-100 text-yellow-700';
      case 'release_notes': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'code_snippet': return <Code className="w-4 h-4" />;
      case 'tutorial': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-50 text-green-700';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700';
      case 'advanced': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="w-full h-full px-3 py-2 ">
      <div className="mb-8">
        <div className="flex justify-end mb-3">
          <button
            onClick={handleCreateArticle}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Article
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <BookOpen className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalArticles}</div>
            <div className="text-blue-100">Published Articles</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{(stats.totalViews / 1000).toFixed(1)}K</div>
            <div className="text-purple-100">Total Views</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 text-white">
            <Star className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.avgRating}/5</div>
            <div className="text-yellow-100">Avg Rating</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
            <ThumbsUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.helpfulRate}%</div>
            <div className="text-green-100">Helpful Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="getting_started">Getting Started</option>
              <option value="how_to">How To</option>
              <option value="troubleshooting">Troubleshooting</option>
              <option value="api_docs">API Docs</option>
              <option value="best_practices">Best Practices</option>
              <option value="faq">FAQ</option>
              <option value="release_notes">Release Notes</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="code_snippet">Code Snippet</option>
              <option value="tutorial">Tutorial</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pinned Articles */}
      {pinnedArticles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Pinned Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinnedArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg border-2 border-yellow-300 p-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(article.type)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category.replace('_', ' ')}
                    </span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-xs text-blue-600 mb-1">Views</div>
                    <div className="text-lg font-bold text-blue-900">{(article.views / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-2">
                    <div className="text-xs text-yellow-600 mb-1">Rating</div>
                    <div className="text-lg font-bold text-yellow-900">{article.averageRating}/5</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.estimatedReadTime} min
                  </div>
                  <span className={`px-2 py-0.5 rounded ${getDifficultyColor(article.difficultyLevel)}`}>
                    {article.difficultyLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                      {article.helpful}
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <ThumbsDown className="w-4 h-4" />
                      {article.notHelpful}
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">All Articles</h2>
        <div className="space-y-2">
          {unpinnedArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(article.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(article.difficultyLevel)}`}>
                      {article.difficultyLevel}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>

                  <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-blue-700 mb-1">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs font-medium">Views</span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">{(article.views / 1000).toFixed(1)}K</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-yellow-700 mb-1">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-medium">Rating</span>
                      </div>
                      <div className="text-xl font-bold text-yellow-900">{article.averageRating}/5</div>
                      <div className="text-xs text-yellow-700">({article.totalRatings})</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-green-700 mb-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs font-medium">Helpful</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">{article.helpful}</div>
                      <div className="text-xs text-green-700">
                        {Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)}%
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-orange-700 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">Read Time</span>
                      </div>
                      <div className="text-xl font-bold text-orange-900">{article.estimatedReadTime}</div>
                      <div className="text-xs text-orange-700">minutes</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-purple-700 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium">Author</span>
                      </div>
                      <div className="text-sm font-medium text-purple-900 truncate">{article.author}</div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-teal-700 mb-1">
                        <FileText className="w-3 h-3" />
                        <span className="text-xs font-medium">Article ID</span>
                      </div>
                      <div className="text-sm font-bold text-teal-900">{article.articleNumber}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>
                      Created: {new Date(article.createdDate).toLocaleDateString()} •
                      Last updated: {new Date(article.lastUpdated).toLocaleDateString()}
                    </div>
                    {article.attachments > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {article.attachments} attachments
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
