'use client';

import { useState } from 'react';
import { Copy, Plus, Search, Eye, Edit, Trash2, Star, Download, Send, Image, FileText, Layout, Mail } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  category: 'promotional' | 'newsletter' | 'transactional' | 'event' | 'announcement' | 'nurture';
  description: string;
  subject: string;
  previewText: string;
  thumbnail: string;
  usageCount: number;
  lastUsed?: string;
  createdDate: string;
  isFavorite: boolean;
  tags: string[];
  contentPreview: string;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Product Launch Announcement',
    category: 'announcement',
    description: 'Bold and engaging template for new product launches with hero image and CTA',
    subject: 'Introducing [Product Name] - Revolutionary Innovation',
    previewText: 'Be the first to experience our groundbreaking new solution...',
    thumbnail: '🚀',
    usageCount: 24,
    lastUsed: '2024-10-15',
    createdDate: '2024-01-10',
    isFavorite: true,
    tags: ['Product', 'Launch', 'Hero Image'],
    contentPreview: 'Feature highlight sections with 3-column layout, testimonials, and early access CTA',
  },
  {
    id: '2',
    name: 'Monthly Newsletter',
    category: 'newsletter',
    description: 'Clean, organized template for regular company updates and news',
    subject: '[Month] Newsletter - Updates, Tips & Resources',
    previewText: 'This month\'s top stories, tips, and exclusive content...',
    thumbnail: '📰',
    usageCount: 48,
    lastUsed: '2024-10-18',
    createdDate: '2024-01-05',
    isFavorite: true,
    tags: ['Newsletter', 'Updates', 'Multi-section'],
    contentPreview: 'Header with logo, featured article, 3 news items, resources section, social links',
  },
  {
    id: '3',
    name: 'Holiday Promotion',
    category: 'promotional',
    description: 'Festive template with countdown timer and special offer highlights',
    subject: '🎄 Exclusive Holiday Offer - [Discount]% Off',
    previewText: 'Limited time holiday savings on all premium plans...',
    thumbnail: '🎁',
    usageCount: 12,
    lastUsed: '2024-10-10',
    createdDate: '2024-09-15',
    isFavorite: false,
    tags: ['Promotion', 'Holiday', 'Countdown', 'Discount'],
    contentPreview: 'Festive header, countdown timer, product grid, urgency messaging, coupon code',
  },
  {
    id: '4',
    name: 'Webinar Invitation',
    category: 'event',
    description: 'Professional event invitation with speaker profiles and registration CTA',
    subject: 'Join Us: [Webinar Title] - [Date]',
    previewText: 'Reserve your spot for this exclusive webinar with industry experts...',
    thumbnail: '🎓',
    usageCount: 36,
    lastUsed: '2024-10-05',
    createdDate: '2024-02-20',
    isFavorite: true,
    tags: ['Webinar', 'Event', 'Registration', 'Speakers'],
    contentPreview: 'Event details, speaker bios with photos, agenda, registration button, calendar add',
  },
  {
    id: '5',
    name: 'Customer Success Story',
    category: 'nurture',
    description: 'Testimonial-focused template highlighting customer achievements',
    subject: 'How [Company] Achieved [Result] with Our Solution',
    previewText: 'Read the inspiring success story of our customer...',
    thumbnail: '⭐',
    usageCount: 18,
    lastUsed: '2024-10-12',
    createdDate: '2024-03-10',
    isFavorite: false,
    tags: ['Case Study', 'Testimonial', 'Success'],
    contentPreview: 'Customer quote header, challenge/solution/results sections, metrics, CTA to similar stories',
  },
  {
    id: '6',
    name: 'Welcome Series - Day 1',
    category: 'transactional',
    description: 'Onboarding email with getting started guide and resources',
    subject: 'Welcome to [Company] - Let\'s Get Started!',
    previewText: 'We\'re excited to have you on board. Here\'s everything you need...',
    thumbnail: '👋',
    usageCount: 156,
    lastUsed: '2024-10-19',
    createdDate: '2024-01-15',
    isFavorite: true,
    tags: ['Onboarding', 'Welcome', 'Getting Started'],
    contentPreview: 'Welcome message, quick start guide, video tutorial links, support contact, next steps',
  },
  {
    id: '7',
    name: 'Re-engagement Campaign',
    category: 'nurture',
    description: 'Win-back template for inactive users with incentive offer',
    subject: 'We Miss You! Here\'s [Incentive] to Come Back',
    previewText: 'It\'s been a while. Let us remind you what you\'re missing...',
    thumbnail: '💝',
    usageCount: 28,
    lastUsed: '2024-10-08',
    createdDate: '2024-04-20',
    isFavorite: false,
    tags: ['Re-engagement', 'Win-back', 'Incentive'],
    contentPreview: 'Personal message, what\'s new highlights, special offer, easy return CTA',
  },
  {
    id: '8',
    name: 'Feature Update Announcement',
    category: 'announcement',
    description: 'Product update template with feature highlights and screenshots',
    subject: 'New Feature Alert: [Feature Name] is Here!',
    previewText: 'Check out our latest update designed to make your life easier...',
    thumbnail: '✨',
    usageCount: 32,
    lastUsed: '2024-10-14',
    createdDate: '2024-02-15',
    isFavorite: false,
    tags: ['Product Update', 'Features', 'Screenshots'],
    contentPreview: 'Feature showcase with screenshots, benefits list, how-to video, feedback CTA',
  },
];

export default function CampaignTemplatesPage() {
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'promotional' | 'newsletter' | 'transactional' | 'event' | 'announcement' | 'nurture'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesFavorites = !showFavoritesOnly || template.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const stats = {
    totalTemplates: templates.length,
    favorites: templates.filter(t => t.isFavorite).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgUsage: Math.round(templates.reduce((sum, t) => sum + t.usageCount, 0) / templates.length),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'promotional': return 'bg-orange-100 text-orange-700';
      case 'newsletter': return 'bg-blue-100 text-blue-700';
      case 'transactional': return 'bg-green-100 text-green-700';
      case 'event': return 'bg-purple-100 text-purple-700';
      case 'announcement': return 'bg-pink-100 text-pink-700';
      case 'nurture': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <Layout className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalTemplates}</div>
            <div className="text-blue-100">Total Templates</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <Star className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.favorites}</div>
            <div className="text-yellow-100">Favorites</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Send className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalUsage}</div>
            <div className="text-purple-100">Total Uses</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <Mail className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.avgUsage}</div>
            <div className="text-green-100">Avg Uses</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
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
              <option value="promotional">Promotional</option>
              <option value="newsletter">Newsletter</option>
              <option value="transactional">Transactional</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
              <option value="nurture">Nurture</option>
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                showFavoritesOnly ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'border-gray-300 text-gray-700'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
              Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Template Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center h-48 border-b border-gray-200">
              <div className="text-7xl">{template.thumbnail}</div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {template.isFavorite && (
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{template.description}</p>

              <div className="space-y-2 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Subject Line:</div>
                  <div className="text-sm font-medium text-gray-900">{template.subject}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Preview Text:</div>
                  <div className="text-sm text-gray-600 italic">{template.previewText}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Content:</div>
                  <div className="text-xs text-gray-600">{template.contentPreview}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Times Used</div>
                  <div className="text-lg font-bold text-gray-900">{template.usageCount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Last Used</div>
                  <div className="text-sm text-gray-900">
                    {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Send className="w-4 h-4" />
                  Use
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Delete</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Created: {new Date(template.createdDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
