'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Search, Plus, ThumbsUp, ThumbsDown, Eye, ChevronDown, ChevronUp, Filter, TrendingUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  unhelpful: number;
  views: number;
  dateCreated: string;
  featured: boolean;
  status: 'active' | 'inactive';
}

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I know if my appliance is still under warranty?',
    answer: 'You can check your warranty status by logging into your account and navigating to My Products. If you have the purchase receipt, you can also contact our support team with the model number. Generally, standard warranty covers 1-2 years from the date of purchase, depending on the product.',
    category: 'Warranty',
    helpful: 156,
    unhelpful: 8,
    views: 421,
    dateCreated: '2025-08-10',
    featured: true,
    status: 'active'
  },
  {
    id: '2',
    question: 'What should I do if my refrigerator is not cooling properly?',
    answer: 'First, check if the thermostat is set to the correct temperature (usually 3-4°C). Ensure the air vents inside are not blocked by food items. Clean the condenser coils at the back of the unit. If the problem persists, it could be a refrigerant leak or compressor issue. Please contact our service team for professional assistance.',
    category: 'Troubleshooting',
    helpful: 243,
    unhelpful: 12,
    views: 567,
    dateCreated: '2025-08-05',
    featured: true,
    status: 'active'
  },
  {
    id: '3',
    question: 'How often should I replace my water filter?',
    answer: 'Water filters should typically be replaced every 6 months for optimal performance and water quality. However, this depends on water usage and water quality in your area. Some filters may last up to 12 months if used lightly. Always refer to your specific appliance manual for recommended replacement intervals.',
    category: 'Maintenance',
    helpful: 189,
    unhelpful: 5,
    views: 334,
    dateCreated: '2025-08-01',
    featured: true,
    status: 'active'
  },
  {
    id: '4',
    question: 'Can I use my microwave if it has a slight dent?',
    answer: 'Minor cosmetic dents that do not affect the door seal are generally safe. However, if the dent is on the interior or affects the door closure, it should be inspected by a technician. A damaged microwave could potentially allow radiation leakage. Contact our service team for a professional assessment.',
    category: 'Safety',
    helpful: 127,
    unhelpful: 15,
    views: 298,
    dateCreated: '2025-07-28',
    featured: false,
    status: 'active'
  },
  {
    id: '5',
    question: 'What payment methods do you accept for service calls?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital payment methods including UPI, Google Pay, and bank transfers. You can also pay using our website after receiving an invoice. For large service contracts, we offer flexible payment plans.',
    category: 'Billing',
    helpful: 98,
    unhelpful: 3,
    views: 156,
    dateCreated: '2025-07-25',
    featured: false,
    status: 'active'
  },
  {
    id: '6',
    question: 'How can I extend my warranty coverage?',
    answer: 'Extended warranty plans can be purchased within 30 days of the original purchase date. You can add coverage for additional years (typically up to 5 years total). Extended plans often include accidental damage coverage. Visit our website or contact our sales team for available plans and pricing for your specific model.',
    category: 'Warranty',
    helpful: 134,
    unhelpful: 7,
    views: 245,
    dateCreated: '2025-07-22',
    featured: false,
    status: 'active'
  },
  {
    id: '7',
    question: 'What does the error code E4 mean on my washing machine?',
    answer: 'Error code E4 typically indicates a water inlet issue. This could mean the water supply valve is closed, the inlet hose is kinked, or there is low water pressure. First, check your water supply and ensure the valve is fully open. If the error persists, the inlet valve may need replacement. Contact our technicians for assistance.',
    category: 'Troubleshooting',
    helpful: 201,
    unhelpful: 9,
    views: 389,
    dateCreated: '2025-07-20',
    featured: true,
    status: 'active'
  },
  {
    id: '8',
    question: 'Is installation included with my purchase?',
    answer: 'Installation is included with most major appliances purchased from us. Our professional installation team will deliver, unpack, and properly install your appliance according to manufacturer specifications. Additional charges may apply for complex installations or if you need removal of old appliances.',
    category: 'Installation',
    helpful: 167,
    unhelpful: 4,
    views: 312,
    dateCreated: '2025-07-18',
    featured: false,
    status: 'active'
  },
  {
    id: '9',
    question: 'How can I reduce energy consumption of my appliances?',
    answer: 'Use appliances during off-peak hours if available. Keep your refrigerator coils clean. Use the eco or energy-saving mode. Ensure proper ventilation around appliances. Avoid opening the appliance repeatedly. Fill dishwashers and washing machines to capacity before running. Regular maintenance like cleaning filters also improves efficiency.',
    category: 'Optimization',
    helpful: 215,
    unhelpful: 11,
    views: 423,
    dateCreated: '2025-07-15',
    featured: true,
    status: 'active'
  },
  {
    id: '10',
    question: 'What is covered under the standard warranty?',
    answer: 'Standard warranty typically covers manufacturing defects in materials and workmanship for 1-2 years from the purchase date. This includes parts failures and labor costs for repairs. It does not cover damage from misuse, accidents, normal wear and tear, or lack of maintenance. Extended warranties offer additional coverage options.',
    category: 'Warranty',
    helpful: 123,
    unhelpful: 6,
    views: 267,
    dateCreated: '2025-07-12',
    featured: false,
    status: 'active'
  }
];

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'helpful' | 'views' | 'recent'>('helpful');

  const categories = ['Warranty', 'Troubleshooting', 'Maintenance', 'Safety', 'Billing', 'Installation', 'Optimization'];

  const filteredFAQs = useMemo(() => {
    let filtered = mockFAQs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesStatus = faq.status === 'active';
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else {
      filtered.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const stats = {
    total: mockFAQs.length,
    active: mockFAQs.filter(f => f.status === 'active').length,
    featured: mockFAQs.filter(f => f.featured).length,
    totalViews: mockFAQs.reduce((sum, f) => sum + f.views, 0)
  };

  const handleHelpful = (id: string) => {
    // In a real app, this would update the database
    console.log('Marked as helpful:', id);
  };

  const handleUnhelpful = (id: string) => {
    // In a real app, this would update the database
    console.log('Marked as unhelpful:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-emerald-600" />
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mt-1">Browse common questions and answers</p>
        </div>
        <button className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          Add FAQ
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total FAQs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
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
              <Eye className="h-6 w-6 text-green-600" />
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

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                <option value="helpful">Most Helpful</option>
                <option value="views">Most Viewed</option>
                <option value="recent">Recently Added</option>
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

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full px-3 py-2 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {faq.featured && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">Featured</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{faq.category}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {faq.views} views
                  </div>
                </div>
              </div>

              <div className="ml-6">
                {expandedId === faq.id ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </button>

            {expandedId === faq.id && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-3 leading-relaxed">{faq.answer}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Was this helpful?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleHelpful(faq.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors text-sm font-medium"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes ({faq.helpful})
                    </button>
                    <button
                      onClick={() => handleUnhelpful(faq.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors text-sm font-medium"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No ({faq.unhelpful})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <HelpCircle className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No FAQs found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
