'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Trash2, TrendingUp, DollarSign, Target, Calendar, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Opportunity {
  id: string;
  name: string;
  account: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  createdAt: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Premium Kitchen Installation - Luxury Apartments',
    account: 'Skyline Properties Inc',
    stage: 'proposal',
    amount: 350000,
    probability: 70,
    expectedCloseDate: '2025-11-15',
    owner: 'Sarah Johnson',
    createdAt: '2025-09-15',
  },
  {
    id: '2',
    name: 'Commercial Kitchen Equipment - Restaurant Chain',
    account: 'Golden Fork Restaurants',
    stage: 'negotiation',
    amount: 580000,
    probability: 85,
    expectedCloseDate: '2025-10-30',
    owner: 'Michael Chen',
    createdAt: '2025-08-20',
  },
  {
    id: '3',
    name: 'Modular Kitchen Solutions - Office Complex',
    account: 'Tech Solutions Inc',
    stage: 'qualification',
    amount: 125000,
    probability: 50,
    expectedCloseDate: '2025-12-20',
    owner: 'Sarah Johnson',
    createdAt: '2025-10-01',
  },
  {
    id: '4',
    name: 'Custom Cabinetry - Residential Development',
    account: 'Urban Living Developers',
    stage: 'closed_won',
    amount: 425000,
    probability: 100,
    expectedCloseDate: '2025-10-05',
    owner: 'David Park',
    createdAt: '2025-07-10',
  },
  {
    id: '5',
    name: 'Kitchen Renovation - Hotel Chain',
    account: 'Grand Stay Hotels',
    stage: 'prospecting',
    amount: 750000,
    probability: 30,
    expectedCloseDate: '2026-01-15',
    owner: 'Emily Davis',
    createdAt: '2025-10-05',
  },
];

const stageColors = {
  prospecting: 'bg-blue-100 text-blue-700',
  qualification: 'bg-purple-100 text-purple-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-red-100 text-red-700',
};

const stageLabels = {
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: opportunities.length,
    open: opportunities.filter((o) => !['closed_won', 'closed_lost'].includes(o.stage)).length,
    wonThisMonth: opportunities.filter((o) => {
      if (o.stage !== 'closed_won') return false;
      const closeDate = new Date(o.expectedCloseDate);
      const now = new Date();
      return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
    }).length,
    totalPipeline: opportunities
      .filter((o) => !['closed_won', 'closed_lost'].includes(o.stage))
      .reduce((sum, o) => sum + o.amount, 0),
  };

  const handleDeleteOpportunity = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(opportunities.filter((o) => o.id !== id));
    }
  };

  const handleViewOpportunity = (opp: Opportunity) => {
    router.push(`/crm/opportunities/view/${opp.id}`);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats with Add Button */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Open Opportunities</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.open}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Won This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.wonThisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-indigo-900 mt-1">${(stats.totalPipeline / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/crm/opportunities/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Stages</option>
          <option value="prospecting">Prospecting</option>
          <option value="qualification">Qualification</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed_won">Closed Won</option>
          <option value="closed_lost">Closed Lost</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account/Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Close</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOpportunities.map((opp) => (
              <tr key={opp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{opp.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{opp.account}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stageColors[opp.stage]}`}>
                    {stageLabels[opp.stage]}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">${opp.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${opp.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{opp.probability}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{opp.expectedCloseDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{opp.owner}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleViewOpportunity(opp)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => router.push(`/crm/opportunities/edit/${opp.id}`)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                      title="Edit Opportunity"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOpportunity(opp.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                      title="Delete Opportunity"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOpportunities.length)} of {filteredOpportunities.length} items
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
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page
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
