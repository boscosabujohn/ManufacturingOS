'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  ClipboardList,
  CheckCircle2,
  Target,
  Users,
  Edit2,
  Eye,
  Copy,
  Play,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Questionnaire {
  id: string;
  questionnaireCode: string;
  questionnaireName: string;
  category: string;
  targetSegment: string;
  questions: number;
  avgCompletionTime: number;
  completionRate: number;
  usageCount: number;
  qualifiedLeads: number;
  qualificationRate: number;
  avgDealSize: number;
  status: 'active' | 'draft' | 'archived';
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  const questionnaires: Questionnaire[] = [
    {
      id: '1',
      questionnaireCode: 'Q-LUX-001',
      questionnaireName: 'Luxury Kitchen Requirements Assessment',
      category: 'Luxury Kitchen',
      targetSegment: 'High Net Worth Individuals',
      questions: 24,
      avgCompletionTime: 18,
      completionRate: 87.5,
      usageCount: 142,
      qualifiedLeads: 118,
      qualificationRate: 83.1,
      avgDealSize: 2850000,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-04-15',
      lastUpdated: '2025-10-12',
      description: 'Comprehensive needs assessment for luxury modular kitchen projects covering design preferences, space requirements, appliance selections, and budget expectations.'
    },
    {
      id: '2',
      questionnaireCode: 'Q-STD-002',
      questionnaireName: 'Standard Modular Kitchen Discovery',
      category: 'Standard Kitchen',
      targetSegment: 'Middle Income Residential',
      questions: 16,
      avgCompletionTime: 12,
      completionRate: 92.3,
      usageCount: 387,
      qualifiedLeads: 342,
      qualificationRate: 88.4,
      avgDealSize: 850000,
      status: 'active',
      createdBy: 'Priya Sharma',
      createdDate: '2024-05-20',
      lastUpdated: '2025-10-15',
      description: 'Efficient discovery process for mid-range modular kitchens focusing on space constraints, storage needs, budget range, and timeline expectations.'
    },
    {
      id: '3',
      questionnaireCode: 'Q-COMM-003',
      questionnaireName: 'Commercial Kitchen Needs Analysis',
      category: 'Commercial Kitchen',
      targetSegment: 'B2B - Restaurants & Hotels',
      questions: 32,
      avgCompletionTime: 28,
      completionRate: 78.9,
      usageCount: 78,
      qualifiedLeads: 58,
      qualificationRate: 74.4,
      avgDealSize: 4500000,
      status: 'active',
      createdBy: 'Amit Patel',
      createdDate: '2024-06-10',
      lastUpdated: '2025-10-08',
      description: 'Detailed commercial kitchen assessment including capacity planning, equipment specifications, compliance requirements, workflow analysis, and ROI projections.'
    },
    {
      id: '4',
      questionnaireCode: 'Q-RENO-004',
      questionnaireName: 'Kitchen Renovation Pain Points',
      category: 'Renovation',
      targetSegment: 'Home Renovation Projects',
      questions: 18,
      avgCompletionTime: 14,
      completionRate: 85.7,
      usageCount: 234,
      qualifiedLeads: 189,
      qualificationRate: 80.8,
      avgDealSize: 1250000,
      status: 'active',
      createdBy: 'Suresh Reddy',
      createdDate: '2024-07-18',
      lastUpdated: '2025-10-14',
      description: 'Targeted questionnaire identifying current kitchen issues, desired improvements, budget constraints, and renovation timeline for existing homes.'
    },
    {
      id: '5',
      questionnaireCode: 'Q-SINK-005',
      questionnaireName: 'Sink & Faucet Selection Guide',
      category: 'Sinks & Faucets',
      targetSegment: 'Retail Customers',
      questions: 10,
      avgCompletionTime: 7,
      completionRate: 94.2,
      usageCount: 567,
      qualifiedLeads: 512,
      qualificationRate: 90.3,
      avgDealSize: 125000,
      status: 'active',
      createdBy: 'Vikram Singh',
      createdDate: '2024-08-05',
      lastUpdated: '2025-10-18',
      description: 'Quick selection guide for kitchen sinks and faucets covering material preferences, size requirements, installation type, and style choices.'
    },
    {
      id: '6',
      questionnaireCode: 'Q-APPL-006',
      questionnaireName: 'Kitchen Appliances Bundle Builder',
      category: 'Appliances',
      targetSegment: 'New Home Buyers',
      questions: 14,
      avgCompletionTime: 10,
      completionRate: 89.5,
      usageCount: 298,
      qualifiedLeads: 251,
      qualificationRate: 84.2,
      avgDealSize: 580000,
      status: 'active',
      createdBy: 'Neha Gupta',
      createdDate: '2024-09-12',
      lastUpdated: '2025-10-16',
      description: 'Interactive bundle builder for kitchen appliances helping customers select chimney, hob, microwave, and dishwasher based on cooking habits and budget.'
    },
    {
      id: '7',
      questionnaireCode: 'Q-BUILD-007',
      questionnaireName: 'Builder Project Requirements',
      category: 'Builder Projects',
      targetSegment: 'Real Estate Developers',
      questions: 28,
      avgCompletionTime: 25,
      completionRate: 72.4,
      usageCount: 52,
      qualifiedLeads: 35,
      qualificationRate: 67.3,
      avgDealSize: 12500000,
      status: 'active',
      createdBy: 'Arun Kumar',
      createdDate: '2024-10-08',
      lastUpdated: '2025-10-10',
      description: 'Comprehensive builder project assessment covering unit counts, standardization requirements, budget per unit, delivery timeline, and volume pricing expectations.'
    },
    {
      id: '8',
      questionnaireCode: 'Q-SMART-008',
      questionnaireName: 'Smart Kitchen Technology Assessment',
      category: 'Smart Kitchen',
      targetSegment: 'Tech-Savvy Professionals',
      questions: 20,
      avgCompletionTime: 15,
      completionRate: 81.3,
      usageCount: 145,
      qualifiedLeads: 112,
      qualificationRate: 77.2,
      avgDealSize: 1850000,
      status: 'active',
      createdBy: 'Meera Iyer',
      createdDate: '2024-11-20',
      lastUpdated: '2025-10-17',
      description: 'Technology-focused assessment for smart kitchen solutions covering automation preferences, IoT integration, voice control, and energy efficiency priorities.'
    },
    {
      id: '9',
      questionnaireCode: 'Q-COMP-009',
      questionnaireName: 'Compact Kitchen Space Planning',
      category: 'Compact Kitchen',
      targetSegment: 'Studio Apartments',
      questions: 12,
      avgCompletionTime: 9,
      completionRate: 90.8,
      usageCount: 412,
      qualifiedLeads: 358,
      qualificationRate: 86.9,
      avgDealSize: 450000,
      status: 'active',
      createdBy: 'Kavita Desai',
      createdDate: '2025-01-15',
      lastUpdated: '2025-10-19',
      description: 'Space-efficient kitchen planning questionnaire for small spaces covering dimensions, multi-functional needs, storage priorities, and budget optimization.'
    },
    {
      id: '10',
      questionnaireCode: 'Q-SUST-010',
      questionnaireName: 'Sustainable Kitchen Values Assessment',
      category: 'Sustainable Kitchen',
      targetSegment: 'Eco-Conscious Buyers',
      questions: 16,
      avgCompletionTime: 13,
      completionRate: 86.5,
      usageCount: 178,
      qualifiedLeads: 145,
      qualificationRate: 81.5,
      avgDealSize: 1350000,
      status: 'active',
      createdBy: 'Pooja Nair',
      createdDate: '2025-02-28',
      lastUpdated: '2025-10-13',
      description: 'Sustainability-focused assessment covering eco-friendly material preferences, energy-efficient appliances, recycled content, and carbon footprint priorities.'
    },
    {
      id: '11',
      questionnaireCode: 'Q-COOK-011',
      questionnaireName: 'Cookware & Accessories Needs',
      category: 'Cookware',
      targetSegment: 'Cooking Enthusiasts',
      questions: 8,
      avgCompletionTime: 6,
      completionRate: 96.2,
      usageCount: 623,
      qualifiedLeads: 571,
      qualificationRate: 91.7,
      avgDealSize: 85000,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2025-04-10',
      lastUpdated: '2025-10-20',
      description: 'Quick discovery for cookware and accessories based on cooking frequency, cuisine types, material preferences, and budget range.'
    },
    {
      id: '12',
      questionnaireCode: 'Q-LEAD-012',
      questionnaireName: 'Initial Kitchen Project Lead Qualifier',
      category: 'General',
      targetSegment: 'All Segments',
      questions: 6,
      avgCompletionTime: 4,
      completionRate: 98.5,
      usageCount: 1245,
      qualifiedLeads: 987,
      qualificationRate: 79.3,
      avgDealSize: 950000,
      status: 'active',
      createdBy: 'Priya Sharma',
      createdDate: '2025-05-25',
      lastUpdated: '2025-10-18',
      description: 'Ultra-short lead qualification questionnaire to quickly identify budget range, timeline, and seriousness of kitchen project inquiries.'
    }
  ];

  const categories = ['all', ...Array.from(new Set(questionnaires.map(q => q.category)))];

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch =
      q.questionnaireCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionnaireName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.targetSegment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      archived: { color: 'bg-gray-100 text-gray-800', icon: ClipboardList }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  // Summary stats
  const totalQuestionnaires = questionnaires.length;
  const activeQuestionnaires = questionnaires.filter(q => q.status === 'active').length;
  const avgQualificationRate = questionnaires.reduce((sum, q) => sum + q.qualificationRate, 0) / totalQuestionnaires;
  const totalUsage = questionnaires.reduce((sum, q) => sum + q.usageCount, 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Questionnaires</h1>
            <p className="text-sm text-gray-600">Interactive discovery tools for lead qualification</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Questionnaire
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Questionnaires</span>
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalQuestionnaires}</div>
          <div className="text-xs text-blue-700 mt-1">{activeQuestionnaires} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Qualification Rate</span>
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{avgQualificationRate.toFixed(1)}%</div>
          <div className="text-xs text-green-700 mt-1">Average across all</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Total Usage</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{totalUsage.toLocaleString()}</div>
          <div className="text-xs text-purple-700 mt-1">Times used</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Qualified Leads</span>
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {questionnaires.reduce((sum, q) => sum + q.qualifiedLeads, 0).toLocaleString()}
          </div>
          <div className="text-xs text-orange-700 mt-1">Total converted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questionnaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Questionnaires Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questionnaire
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Segment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Deal Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestionnaires.map((q) => {
                const statusInfo = getStatusBadge(q.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{q.questionnaireName}</div>
                        <div className="text-xs text-gray-500">{q.questionnaireCode} • {q.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{q.targetSegment}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{q.questions}</div>
                        <div className="text-xs text-gray-500">{q.avgCompletionTime} min</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ minWidth: '60px' }}>
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${q.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{q.completionRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ minWidth: '60px' }}>
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${q.qualificationRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{q.qualificationRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{q.usageCount}</div>
                        <div className="text-xs text-gray-500">{q.qualifiedLeads} qualified</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-blue-900">₹{(q.avgDealSize / 100000).toFixed(1)}L</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Start Questionnaire"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredQuestionnaires.length} of {totalQuestionnaires} questionnaires
      </div>
    </div>
  );
}
