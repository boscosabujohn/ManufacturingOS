'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  Copy,
  Play,
  Award,
  BarChart3
} from 'lucide-react';
import {
  PlaybookModal,
  ViewPlaybookModal,
  UsePlaybookModal,
  StageBuilderModal,
  Playbook as PlaybookType
} from '@/components/cpq/PlaybookModals';

interface Playbook {
  id: string;
  playbookCode: string;
  playbookName: string;
  category: string;
  targetSegment: string;
  productFocus: string;
  stages: number;
  avgDealSize: number;
  winRate: number;
  avgCycleTime: number;
  usageCount: number;
  successfulDeals: number;
  status: 'active' | 'draft' | 'archived';
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
}

export default function GuidedSellingPlaybooksPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUseOpen, setIsUseOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);

  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: '1',
      playbookCode: 'PB-PREM-001',
      playbookName: 'Premium Modular Kitchen - Luxury Segment',
      category: 'Modular Kitchen',
      targetSegment: 'Luxury Residential',
      productFocus: 'High-end modular kitchens with premium appliances',
      stages: 6,
      avgDealSize: 2850000,
      winRate: 68.5,
      avgCycleTime: 21,
      usageCount: 145,
      successfulDeals: 98,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-03-15',
      lastUpdated: '2025-10-10',
      description: 'Consultative selling approach for luxury kitchen projects with design consultation, premium material selection, and high-end appliance integration.'
    },
    {
      id: '2',
      playbookCode: 'PB-STAN-002',
      playbookName: 'Standard Modular Kitchen - Mid-Range',
      category: 'Modular Kitchen',
      targetSegment: 'Middle Income Residential',
      productFocus: 'Value-focused modular kitchen solutions',
      stages: 5,
      avgDealSize: 850000,
      winRate: 72.3,
      avgCycleTime: 14,
      usageCount: 287,
      successfulDeals: 205,
      status: 'active',
      createdBy: 'Priya Sharma',
      createdDate: '2024-04-20',
      lastUpdated: '2025-10-08',
      description: 'Efficient selling process for mid-range kitchens focusing on value proposition, space optimization, and practical functionality.'
    },
    {
      id: '3',
      playbookCode: 'PB-COMM-003',
      playbookName: 'Commercial Kitchen - Restaurant & Hotel',
      category: 'Commercial Kitchen',
      targetSegment: 'B2B - Hospitality',
      productFocus: 'Industrial-grade kitchen equipment and systems',
      stages: 7,
      avgDealSize: 4500000,
      winRate: 58.2,
      avgCycleTime: 35,
      usageCount: 78,
      successfulDeals: 45,
      status: 'active',
      createdBy: 'Amit Patel',
      createdDate: '2024-05-10',
      lastUpdated: '2025-09-28',
      description: 'Complex B2B selling for commercial kitchens with compliance requirements, capacity planning, and ROI justification.'
    },
    {
      id: '4',
      playbookCode: 'PB-SINK-004',
      playbookName: 'Premium Sink Solutions - Standalone',
      category: 'Kitchen Sinks',
      targetSegment: 'Retail - All Segments',
      productFocus: 'High-quality sinks and faucet systems',
      stages: 4,
      avgDealSize: 125000,
      winRate: 81.5,
      avgCycleTime: 7,
      usageCount: 456,
      successfulDeals: 372,
      status: 'active',
      createdBy: 'Suresh Reddy',
      createdDate: '2024-06-15',
      lastUpdated: '2025-10-15',
      description: 'Quick sales cycle for sink and faucet products with feature-benefit selling and material education.'
    },
    {
      id: '5',
      playbookCode: 'PB-APPL-005',
      playbookName: 'Kitchen Appliances Bundle - Complete Package',
      category: 'Kitchen Appliances',
      targetSegment: 'New Home Buyers',
      productFocus: 'Chimney, hob, microwave, dishwasher bundle',
      stages: 5,
      avgDealSize: 580000,
      winRate: 75.8,
      avgCycleTime: 12,
      usageCount: 198,
      successfulDeals: 148,
      status: 'active',
      createdBy: 'Vikram Singh',
      createdDate: '2024-07-22',
      lastUpdated: '2025-10-12',
      description: 'Bundle selling strategy for new homeowners with package discounts, installation services, and extended warranty options.'
    },
    {
      id: '6',
      playbookCode: 'PB-RENO-006',
      playbookName: 'Kitchen Renovation - Existing Home',
      category: 'Renovation',
      targetSegment: 'Home Renovation',
      productFocus: 'Complete kitchen makeover solutions',
      stages: 6,
      avgDealSize: 1250000,
      winRate: 64.2,
      avgCycleTime: 18,
      usageCount: 167,
      successfulDeals: 106,
      status: 'active',
      createdBy: 'Neha Gupta',
      createdDate: '2024-08-10',
      lastUpdated: '2025-10-05',
      description: 'Renovation-focused approach addressing pain points, before-after visualization, and phased implementation options.'
    },
    {
      id: '7',
      playbookCode: 'PB-BUILD-007',
      playbookName: 'Builder Package - Volume Sales',
      category: 'Builder Projects',
      targetSegment: 'B2B - Real Estate Developers',
      productFocus: 'Bulk modular kitchen installations',
      stages: 8,
      avgDealSize: 12500000,
      winRate: 52.8,
      avgCycleTime: 45,
      usageCount: 42,
      successfulDeals: 22,
      status: 'active',
      createdBy: 'Arun Kumar',
      createdDate: '2024-09-05',
      lastUpdated: '2025-09-20',
      description: 'Enterprise selling for builder partnerships with volume pricing, standardization benefits, and project timeline alignment.'
    },
    {
      id: '8',
      playbookCode: 'PB-SMART-008',
      playbookName: 'Smart Kitchen - IoT Integration',
      category: 'Smart Kitchen',
      targetSegment: 'Tech-Savvy Urban Professionals',
      productFocus: 'Smart appliances and automation',
      stages: 6,
      avgDealSize: 1850000,
      winRate: 61.3,
      avgCycleTime: 16,
      usageCount: 89,
      successfulDeals: 54,
      status: 'active',
      createdBy: 'Meera Iyer',
      createdDate: '2024-10-12',
      lastUpdated: '2025-10-18',
      description: 'Technology-focused selling emphasizing automation, energy efficiency, and connected appliance ecosystem.'
    },
    {
      id: '9',
      playbookCode: 'PB-COMP-009',
      playbookName: 'Compact Kitchen - Space-Saving Solutions',
      category: 'Compact Kitchen',
      targetSegment: 'Studio Apartments & Small Homes',
      productFocus: 'Space-optimized kitchen designs',
      stages: 4,
      avgDealSize: 450000,
      winRate: 78.9,
      avgCycleTime: 10,
      usageCount: 234,
      successfulDeals: 184,
      status: 'active',
      createdBy: 'Kavita Desai',
      createdDate: '2025-01-18',
      lastUpdated: '2025-10-14',
      description: 'Solution selling for small spaces with creative storage solutions, multi-functional designs, and efficient layouts.'
    },
    {
      id: '10',
      playbookCode: 'PB-SUST-010',
      playbookName: 'Sustainable Kitchen - Eco-Friendly',
      category: 'Sustainable Kitchen',
      targetSegment: 'Environmentally Conscious Buyers',
      productFocus: 'Eco-friendly materials and energy-efficient appliances',
      stages: 5,
      avgDealSize: 1350000,
      winRate: 69.7,
      avgCycleTime: 15,
      usageCount: 112,
      successfulDeals: 78,
      status: 'active',
      createdBy: 'Pooja Nair',
      createdDate: '2025-02-25',
      lastUpdated: '2025-10-16',
      description: 'Values-based selling highlighting sustainability, recycled materials, energy star appliances, and carbon footprint reduction.'
    },
    {
      id: '11',
      playbookCode: 'PB-LUXV-011',
      playbookName: 'Luxury Villa Kitchen - Ultra Premium',
      category: 'Luxury Kitchen',
      targetSegment: 'Ultra High Net Worth',
      productFocus: 'Bespoke luxury kitchen installations',
      stages: 8,
      avgDealSize: 5800000,
      winRate: 45.2,
      avgCycleTime: 42,
      usageCount: 35,
      successfulDeals: 15,
      status: 'active',
      createdBy: 'Arjun Menon',
      createdDate: '2025-03-30',
      lastUpdated: '2025-10-02',
      description: 'White-glove selling for ultra-luxury projects with Italian marble, custom cabinetry, imported appliances, and concierge service.'
    },
    {
      id: '12',
      playbookCode: 'PB-ACCE-012',
      playbookName: 'Kitchen Accessories - Add-on Sales',
      category: 'Accessories',
      targetSegment: 'Existing Customers',
      productFocus: 'Organizers, cookware, and accessories',
      stages: 3,
      avgDealSize: 85000,
      winRate: 84.5,
      avgCycleTime: 5,
      usageCount: 523,
      successfulDeals: 442,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2025-05-10',
      lastUpdated: '2025-10-19',
      description: 'Upselling strategy for existing customers focusing on organization solutions, premium cookware, and kitchen enhancement products.'
    }
  ]);

  const categories = ['all', ...Array.from(new Set(playbooks.map(p => p.category)))];

  // Handlers
  const handleAddNew = () => {
    setSelectedPlaybook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setIsModalOpen(true);
  };

  const handleView = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setIsViewOpen(true);
  };

  const handleUse = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setIsUseOpen(true);
  };

  const handleCopy = (playbook: Playbook) => {
    const copy: Playbook = {
      ...playbook,
      id: `PB${Date.now()}`,
      playbookCode: `${playbook.playbookCode}-COPY`,
      playbookName: `${playbook.playbookName} (Copy)`,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPlaybooks([copy, ...playbooks]);
  };

  const handleSave = (playbook: Playbook) => {
    if (selectedPlaybook) {
      setPlaybooks(playbooks.map(p => p.id === playbook.id ? playbook : p));
    } else {
      setPlaybooks([playbook, ...playbooks]);
    }
    setIsModalOpen(false);
    setSelectedPlaybook(null);
  };

  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch =
      playbook.playbookCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playbook.playbookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playbook.targetSegment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || playbook.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || playbook.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      archived: { color: 'bg-gray-100 text-gray-800', icon: BookOpen }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  // Summary stats
  const totalPlaybooks = playbooks.length;
  const activePlaybooks = playbooks.filter(p => p.status === 'active').length;
  const avgWinRate = playbooks.reduce((sum, p) => sum + p.winRate, 0) / totalPlaybooks;
  const totalDeals = playbooks.reduce((sum, p) => sum + p.successfulDeals, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Sales Playbooks</h1>
            <p className="text-sm text-gray-600">Guided selling strategies for kitchen products</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Playbook
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Playbooks</span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalPlaybooks}</div>
          <div className="text-xs text-blue-700 mt-1">{activePlaybooks} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Avg Win Rate</span>
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{avgWinRate.toFixed(1)}%</div>
          <div className="text-xs text-green-700 mt-1">Across all playbooks</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Successful Deals</span>
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{totalDeals}</div>
          <div className="text-xs text-purple-700 mt-1">Total wins</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Total Usage</span>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {playbooks.reduce((sum, p) => sum + p.usageCount, 0)}
          </div>
          <div className="text-xs text-orange-700 mt-1">Times used</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search playbooks..."
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

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaybooks.map((playbook) => {
          const statusInfo = getStatusBadge(playbook.status);
          const StatusIcon = statusInfo.icon;
          return (
            <div key={playbook.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{playbook.playbookName}</h3>
                    <p className="text-xs text-gray-500">{playbook.playbookCode}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {playbook.status}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {playbook.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{playbook.targetSegment}</span>
                  </div>
                  <p className="text-sm text-gray-600">{playbook.description}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-700 mb-1">Win Rate</div>
                    <div className="text-lg font-bold text-green-900">{playbook.winRate.toFixed(1)}%</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-700 mb-1">Avg Deal</div>
                    <div className="text-lg font-bold text-blue-900">₹{(playbook.avgDealSize / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-700 mb-1">Stages</div>
                    <div className="text-lg font-bold text-purple-900">{playbook.stages}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-xs text-orange-700 mb-1">Cycle Time</div>
                    <div className="text-lg font-bold text-orange-900">{playbook.avgCycleTime}d</div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Success Rate</span>
                    <span>{playbook.successfulDeals} of {playbook.usageCount} deals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(playbook.successfulDeals / playbook.usageCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUse(playbook)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Play className="h-4 w-4" />
                    Use Playbook
                  </button>
                  <button
                    onClick={() => handleView(playbook)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                    aria-label="View"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(playbook)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                    aria-label="Edit"
                    title="Edit Playbook"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(playbook)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                    aria-label="Copy"
                    title="Copy Playbook"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Created by {playbook.createdBy}</span>
                  <span>Updated {playbook.lastUpdated}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredPlaybooks.length} of {totalPlaybooks} playbooks
      </div>

      {/* Modals */}
      <PlaybookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlaybook(null);
        }}
        onSave={handleSave}
        playbook={selectedPlaybook}
      />

      {selectedPlaybook && (
        <>
          <ViewPlaybookModal
            isOpen={isViewOpen}
            onClose={() => {
              setIsViewOpen(false);
              setSelectedPlaybook(null);
            }}
            playbook={selectedPlaybook}
          />

          <UsePlaybookModal
            isOpen={isUseOpen}
            onClose={() => {
              setIsUseOpen(false);
              setSelectedPlaybook(null);
            }}
            playbook={selectedPlaybook}
          />

          <StageBuilderModal
            isOpen={isBuilderOpen}
            onClose={() => {
              setIsBuilderOpen(false);
              setSelectedPlaybook(null);
            }}
            playbook={selectedPlaybook}
          />
        </>
      )}
    </div>
  );
}
