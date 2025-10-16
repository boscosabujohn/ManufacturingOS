'use client';

import { useState, useEffect } from 'react';
import { usePageVisitLogger } from '@/hooks/usePageVisitLogger';
import { RFPService } from '@/services/rfp.service';
import { RFP, RFPStatus, RFPPriority, RFPType } from '@/types/rfp';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  DollarSign,
  BarChart3,
} from 'lucide-react';

export default function RFPPage() {
  usePageVisitLogger('/sales/rfp', true);

  const [rfps, setRFPs] = useState<RFP[]>([]);
  const [filteredRFPs, setFilteredRFPs] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    inProgress: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
    avgWinProb: 0,
  });

  useEffect(() => {
    loadRFPs();
  }, []);

  useEffect(() => {
    filterRFPs();
  }, [rfps, searchTerm, statusFilter, priorityFilter]);

  const loadRFPs = async () => {
    try {
      setLoading(true);
      console.log('[RFP Page] Loading RFPs...');
      console.log('[RFP Page] API URL:', process.env.NEXT_PUBLIC_API_URL);
      const data = await RFPService.getAllRFPs();
      console.log('[RFP Page] Loaded RFPs:', data?.length, 'records');
      setRFPs(data);
      calculateStats(data);
    } catch (error) {
      console.error('[RFP Page] Error loading RFPs:', error);
      // Set empty array on error to avoid showing "No RFPs" when it's actually a connection issue
      alert('Failed to load RFPs. Please check if the backend is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: RFP[]) => {
    const totalValue = data.reduce(
      (sum, rfp) => sum + (rfp.estimatedBudget || 0),
      0
    );
    const avgWinProb =
      data.filter((r) => r.winProbability).length > 0
        ? data.reduce((sum, rfp) => sum + (rfp.winProbability || 0), 0) /
          data.filter((r) => r.winProbability).length
        : 0;

    setStats({
      total: data.length,
      draft: data.filter((r) => r.status === RFPStatus.DRAFT).length,
      submitted: data.filter((r) => r.status === RFPStatus.SUBMITTED).length,
      inProgress: data.filter((r) => r.status === RFPStatus.IN_PROGRESS).length,
      approved: data.filter((r) => r.status === RFPStatus.APPROVED).length,
      rejected: data.filter((r) => r.status === RFPStatus.REJECTED).length,
      totalValue,
      avgWinProb,
    });
  };

  const filterRFPs = () => {
    let filtered = [...rfps];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (rfp) =>
          rfp.title.toLowerCase().includes(term) ||
          rfp.rfpNumber.toLowerCase().includes(term) ||
          rfp.customerName.toLowerCase().includes(term) ||
          rfp.description.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((rfp) => rfp.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((rfp) => rfp.priority === priorityFilter);
    }

    setFilteredRFPs(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this RFP?')) {
      try {
        await RFPService.deleteRFP(id);
        loadRFPs();
      } catch (error) {
        console.error('Error deleting RFP:', error);
      }
    }
  };

  const getStatusColor = (status: RFPStatus) => {
    const colors = {
      [RFPStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [RFPStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
      [RFPStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [RFPStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [RFPStatus.AWAITING_APPROVAL]: 'bg-orange-100 text-orange-800',
      [RFPStatus.APPROVED]: 'bg-green-100 text-green-800',
      [RFPStatus.REJECTED]: 'bg-red-100 text-red-800',
      [RFPStatus.EXPIRED]: 'bg-gray-100 text-gray-600',
      [RFPStatus.WITHDRAWN]: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: RFPPriority) => {
    const colors = {
      [RFPPriority.LOW]: 'text-green-600',
      [RFPPriority.MEDIUM]: 'text-yellow-600',
      [RFPPriority.HIGH]: 'text-orange-600',
      [RFPPriority.URGENT]: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Request for Proposals (RFP)
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track RFPs, proposals, and submissions
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New RFP
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total RFPs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-blue-900">{stats.submitted}</p>
              </div>
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.inProgress}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Win %</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgWinProb.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search RFPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={RFPStatus.DRAFT}>Draft</option>
              <option value={RFPStatus.SUBMITTED}>Submitted</option>
              <option value={RFPStatus.UNDER_REVIEW}>Under Review</option>
              <option value={RFPStatus.IN_PROGRESS}>In Progress</option>
              <option value={RFPStatus.AWAITING_APPROVAL}>Awaiting Approval</option>
              <option value={RFPStatus.APPROVED}>Approved</option>
              <option value={RFPStatus.REJECTED}>Rejected</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value={RFPPriority.LOW}>Low</option>
              <option value={RFPPriority.MEDIUM}>Medium</option>
              <option value={RFPPriority.HIGH}>High</option>
              <option value={RFPPriority.URGENT}>Urgent</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RFP Grid/List */}
      {filteredRFPs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No RFPs Found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first RFP'}
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create First RFP
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRFPs.map((rfp) => {
            const daysUntilDeadline = getDaysUntilDeadline(rfp.submissionDeadline);
            const isOverdue = daysUntilDeadline < 0;
            const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline >= 0;

            return (
              <div
                key={rfp.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {rfp.title}
                      </h3>
                      <p className="text-sm text-gray-600">{rfp.rfpNumber}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        rfp.status
                      )}`}
                    >
                      {rfp.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{rfp.customerName}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Priority:</span>
                      <span
                        className={`font-medium ${getPriorityColor(rfp.priority)}`}
                      >
                        {rfp.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">
                        {rfp.type.replace('_', ' ')}
                      </span>
                    </div>
                    {rfp.estimatedBudget && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium text-gray-900">
                          ${rfp.estimatedBudget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Deadline */}
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                      isOverdue
                        ? 'bg-red-50 text-red-700'
                        : isUrgent
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-xs font-medium">Deadline</p>
                      <p className="text-sm">
                        {new Date(rfp.submissionDeadline).toLocaleDateString()}
                      </p>
                    </div>
                    {isOverdue ? (
                      <span className="text-xs font-bold">OVERDUE</span>
                    ) : (
                      <span className="text-xs font-medium">
                        {daysUntilDeadline}d left
                      </span>
                    )}
                  </div>

                  {/* Win Probability */}
                  {rfp.winProbability !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Win Probability</span>
                        <span className="font-medium text-gray-900">
                          {rfp.winProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${rfp.winProbability}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedRFP(rfp);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRFP(rfp);
                        setShowForm(true);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rfp.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RFP Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRFPs.map((rfp) => {
                  const daysUntilDeadline = getDaysUntilDeadline(
                    rfp.submissionDeadline
                  );
                  const isOverdue = daysUntilDeadline < 0;

                  return (
                    <tr
                      key={rfp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rfp.rfpNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rfp.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rfp.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            rfp.status
                          )}`}
                        >
                          {rfp.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${getPriorityColor(
                            rfp.priority
                          )}`}
                        >
                          {rfp.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div
                          className={
                            isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'
                          }
                        >
                          {new Date(rfp.submissionDeadline).toLocaleDateString()}
                          {isOverdue && (
                            <span className="ml-2 text-xs">(OVERDUE)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rfp.estimatedBudget
                          ? `$${rfp.estimatedBudget.toLocaleString()}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRFP(rfp);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRFP(rfp);
                              setShowForm(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rfp.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Detail Modal */}
      {showModal && selectedRFP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedRFP.title}
                  </h2>
                  <p className="text-gray-600">{selectedRFP.rfpNumber}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Customer Information
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-600">Customer:</dt>
                      <dd className="font-medium">{selectedRFP.customerName}</dd>
                    </div>
                    {selectedRFP.contactPerson && (
                      <div>
                        <dt className="text-gray-600">Contact:</dt>
                        <dd className="font-medium">
                          {selectedRFP.contactPerson}
                        </dd>
                      </div>
                    )}
                    {selectedRFP.contactEmail && (
                      <div>
                        <dt className="text-gray-600">Email:</dt>
                        <dd className="font-medium">{selectedRFP.contactEmail}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">RFP Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-600">Status:</dt>
                      <dd>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            selectedRFP.status
                          )}`}
                        >
                          {selectedRFP.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Priority:</dt>
                      <dd
                        className={`font-medium ${getPriorityColor(
                          selectedRFP.priority
                        )}`}
                      >
                        {selectedRFP.priority.toUpperCase()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Type:</dt>
                      <dd className="font-medium">
                        {selectedRFP.type.replace('_', ' ')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selectedRFP.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Project Scope</h3>
                <p className="text-sm text-gray-700">{selectedRFP.projectScope}</p>
              </div>

              {selectedRFP.items && selectedRFP.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedRFP.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="font-medium text-gray-900">
                          {item.itemName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.description}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          Quantity: {item.quantity} {item.unit}
                          {item.estimatedCost && (
                            <span className="ml-4">
                              Est. Cost: ${item.estimatedCost.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit RFP
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal - Placeholder */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRFP ? 'Edit RFP' : 'Create New RFP'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedRFP(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  RFP Form Component - To be implemented
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This will include all fields for creating/editing RFPs
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
