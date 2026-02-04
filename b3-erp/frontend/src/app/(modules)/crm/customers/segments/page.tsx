'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, TrendingUp, DollarSign, Target, Search, Filter, Download, Plus, Edit, Trash2, Eye, PieChart, BarChart3 } from 'lucide-react';
import { useToast, ConfirmDialog } from '@/components/ui';

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  customerCount: number;
  totalRevenue: number;
  avgLifetimeValue: number;
  growthRate: number;
  color: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastUpdated: string;
}

const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'Enterprise Premium',
    description: 'Large enterprises with high-value contracts and premium support',
    criteria: ['Revenue > $1M', 'Employees > 500', 'Contract Type: Premium'],
    customerCount: 45,
    totalRevenue: 12500000,
    avgLifetimeValue: 278000,
    growthRate: 23.5,
    color: 'purple',
    status: 'active',
    createdDate: '2024-01-15',
    lastUpdated: '2024-10-15',
  },
  {
    id: '2',
    name: 'Mid-Market Growth',
    description: 'Growing mid-market companies with expansion potential',
    criteria: ['Revenue $250K-$1M', 'Employees 100-500', 'Growth Rate > 15%'],
    customerCount: 128,
    totalRevenue: 8750000,
    avgLifetimeValue: 68400,
    growthRate: 31.2,
    color: 'blue',
    status: 'active',
    createdDate: '2024-02-10',
    lastUpdated: '2024-10-18',
  },
  {
    id: '3',
    name: 'Small Business Starter',
    description: 'Small businesses and startups in early growth stage',
    criteria: ['Revenue < $250K', 'Employees < 100', 'Account Age < 1 year'],
    customerCount: 342,
    totalRevenue: 3420000,
    avgLifetimeValue: 10000,
    growthRate: 45.8,
    color: 'green',
    status: 'active',
    createdDate: '2024-03-05',
    lastUpdated: '2024-10-19',
  },
  {
    id: '4',
    name: 'At-Risk High Value',
    description: 'High-value customers showing signs of churn risk',
    criteria: ['LTV > $100K', 'NPS < 6', 'Support Tickets > 10/month'],
    customerCount: 23,
    totalRevenue: 4150000,
    avgLifetimeValue: 180400,
    growthRate: -12.3,
    color: 'red',
    status: 'active',
    createdDate: '2024-04-20',
    lastUpdated: '2024-10-20',
  },
  {
    id: '5',
    name: 'Loyal Advocates',
    description: 'Long-term customers with high satisfaction and referrals',
    criteria: ['Account Age > 3 years', 'NPS > 9', 'Referrals > 2'],
    customerCount: 87,
    totalRevenue: 6960000,
    avgLifetimeValue: 80000,
    growthRate: 8.7,
    color: 'yellow',
    status: 'active',
    createdDate: '2024-01-10',
    lastUpdated: '2024-10-17',
  },
  {
    id: '6',
    name: 'Seasonal Buyers',
    description: 'Customers with predictable seasonal purchasing patterns',
    criteria: ['Purchase Frequency: Seasonal', 'Order Concentration > 60%'],
    customerCount: 156,
    totalRevenue: 2340000,
    avgLifetimeValue: 15000,
    growthRate: 5.2,
    color: 'orange',
    status: 'active',
    createdDate: '2024-05-15',
    lastUpdated: '2024-10-16',
  },
  {
    id: '7',
    name: 'Cross-Sell Opportunity',
    description: 'Customers using single product with high cross-sell potential',
    criteria: ['Products: 1', 'Usage > 80%', 'Support Satisfaction > 8'],
    customerCount: 201,
    totalRevenue: 4020000,
    avgLifetimeValue: 20000,
    growthRate: 19.4,
    color: 'teal',
    status: 'active',
    createdDate: '2024-06-01',
    lastUpdated: '2024-10-19',
  },
  {
    id: '8',
    name: 'Dormant Accounts',
    description: 'Previously active customers with no recent activity',
    criteria: ['Last Purchase > 6 months', 'Previous LTV > $50K'],
    customerCount: 64,
    totalRevenue: 0,
    avgLifetimeValue: 78000,
    growthRate: -100,
    color: 'gray',
    status: 'inactive',
    createdDate: '2024-07-10',
    lastUpdated: '2024-10-15',
  },
];

export default function CustomerSegmentsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [segments] = useState<Segment[]>(mockSegments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'customers' | 'revenue' | 'growth'>('customers');

  const filteredSegments = segments
    .filter(segment => {
      const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          segment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || segment.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'customers':
          return b.customerCount - a.customerCount;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'growth':
          return b.growthRate - a.growthRate;
        default:
          return 0;
      }
    });

  const totalStats = {
    totalSegments: segments.filter(s => s.status === 'active').length,
    totalCustomers: segments.reduce((sum, s) => sum + s.customerCount, 0),
    totalRevenue: segments.reduce((sum, s) => sum + s.totalRevenue, 0),
    avgGrowthRate: segments.filter(s => s.status === 'active').reduce((sum, s) => sum + s.growthRate, 0) / segments.filter(s => s.status === 'active').length,
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[color] || colors.blue;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 20) return 'text-green-600';
    if (rate > 0) return 'text-blue-600';
    if (rate > -10) return 'text-orange-600';
    return 'text-red-600';
  };

  // Handler functions
  const handleViewDetails = (segment: Segment) => {
    router.push(`/crm/customers/segments/${segment.id}`);
  };

  const handleEditSegment = (segment: Segment) => {
    router.push(`/crm/customers/segments/edit/${segment.id}`);
  };

  const handleDeleteClick = (segment: Segment) => {
    setSegmentToDelete(segment);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (segmentToDelete) {
      addToast({
        title: 'Segment Deleted',
        message: `"${segmentToDelete.name}" segment has been deleted successfully`,
        variant: 'success'
      });
      setDeleteConfirmOpen(false);
      setSegmentToDelete(null);
      // In a real application, update the segments state here
    }
  };

  return (
    <div className="w-full h-full px-3 py-2 ">
      <div className="mb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalSegments}</div>
            <div className="text-purple-100">Active Segments</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalStats.totalCustomers.toLocaleString()}</div>
            <div className="text-blue-100">Total Customers</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              ${(totalStats.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-green-100">Total Revenue</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {totalStats.avgGrowthRate.toFixed(1)}%
            </div>
            <div className="text-orange-100">Avg Growth Rate</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search segments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="customers">Sort by Customers</option>
                <option value="name">Sort by Name</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="growth">Sort by Growth</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredSegments.map((segment) => (
          <div key={segment.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-2 ${getColorClasses(segment.color).split(' ')[0]}`}></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{segment.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(segment.color)}`}>
                      {segment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{segment.description}</p>
                </div>
              </div>

              {/* Segment Criteria */}
              <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Segmentation Criteria:</h4>
                <div className="flex flex-wrap gap-2">
                  {segment.criteria.map((criterion, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {criterion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Customers
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {segment.customerCount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Total Revenue
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${(segment.totalRevenue / 1000000).toFixed(2)}M
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Target className="w-4 h-4" />
                    Avg LTV
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${(segment.avgLifetimeValue / 1000).toFixed(0)}K
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Growth Rate
                  </div>
                  <div className={`text-2xl font-bold ${getGrowthColor(segment.growthRate)}`}>
                    {segment.growthRate > 0 ? '+' : ''}{segment.growthRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(segment)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleEditSegment(segment)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(segment)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Created: {new Date(segment.createdDate).toLocaleDateString()}</span>
                  <span>Updated: {new Date(segment.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSegments.length === 0 && (
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No segments found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Segment"
        message={`Are you sure you want to delete the "${segmentToDelete?.name}" segment? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
