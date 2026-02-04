'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Edit, FileText, Phone, RefreshCw, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, Users, Calendar, Shield, Bell, Download, Filter, MoreVertical, Wrench, MapPin, Star, AlertTriangle, Send, MessageSquare } from 'lucide-react';

interface ContractRenewal {
  id: string;
  contractNumber: string;
  contractType: 'AMC' | 'CMC' | 'Pay Per Visit' | 'Parts & Labor' | 'Extended Warranty';
  customerId: string;
  customerName: string;
  currentStartDate: string;
  currentEndDate: string;
  proposedStartDate: string;
  proposedEndDate: string;
  currentValue: number;
  proposedValue: number;
  increasePercentage: number;
  renewalCount: number;
  accountManager: string;
  location: string;
  healthScore: number;
  customerSatisfaction: number;
  renewalStatus: 'draft' | 'pending_approval' | 'sent_to_customer' | 'under_negotiation' | 'customer_approved' | 'contract_signed' | 'renewed' | 'rejected' | 'expired';
  renewalProbability: number;
  competitorThreat: 'none' | 'low' | 'medium' | 'high';
  lastContactDate: string;
  nextFollowUpDate: string;
  proposalSentDate: string;
  decisionDeadline: string;
  keyChanges: string[];
  customerFeedback: string;
  internalNotes: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy: string;
  approvalDate: string;
  riskFactors: string[];
  opportunityScore: number;
  technicianAssigned: string;
  serviceVisits: number;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

const mockRenewals: ContractRenewal[] = [
  {
    id: '1',
    contractNumber: 'AMC-2024-0045-R1',
    contractType: 'AMC',
    customerId: 'CUST001',
    customerName: 'Royal Kitchen Designs',
    currentStartDate: '2024-11-01',
    currentEndDate: '2025-10-31',
    proposedStartDate: '2025-11-01',
    proposedEndDate: '2026-10-31',
    currentValue: 580000,
    proposedValue: 620000,
    increasePercentage: 6.9,
    renewalCount: 3,
    accountManager: 'Rajesh Kumar',
    location: 'Mumbai, Maharashtra',
    healthScore: 94,
    customerSatisfaction: 4.9,
    renewalStatus: 'under_negotiation',
    renewalProbability: 85,
    competitorThreat: 'low',
    lastContactDate: '2025-10-20',
    nextFollowUpDate: '2025-10-25',
    proposalSentDate: '2025-10-15',
    decisionDeadline: '2025-10-30',
    keyChanges: ['Enhanced response time (2 hours)', 'Additional preventive maintenance', 'Extended warranty coverage'],
    customerFeedback: 'Satisfied with current service quality. Considering proposal.',
    internalNotes: 'Strong relationship. Customer values service quality over price.',
    approvalStatus: 'approved',
    approvedBy: 'Manager',
    approvalDate: '2025-10-14',
    riskFactors: [],
    opportunityScore: 92,
    technicianAssigned: 'Suresh Patel',
    serviceVisits: 12,
    priorityLevel: 'high'
  },
  {
    id: '2',
    contractNumber: 'CMC-2024-0078-R1',
    contractType: 'CMC',
    customerId: 'CUST002',
    customerName: 'Metro Kitchen Solutions',
    currentStartDate: '2024-12-01',
    currentEndDate: '2025-11-30',
    proposedStartDate: '2025-12-01',
    proposedEndDate: '2026-11-30',
    currentValue: 890000,
    proposedValue: 850000,
    increasePercentage: -4.5,
    renewalCount: 1,
    accountManager: 'Priya Sharma',
    location: 'Delhi, NCR',
    healthScore: 76,
    customerSatisfaction: 3.8,
    renewalStatus: 'sent_to_customer',
    renewalProbability: 45,
    competitorThreat: 'high',
    lastContactDate: '2025-10-18',
    nextFollowUpDate: '2025-10-24',
    proposalSentDate: '2025-10-18',
    decisionDeadline: '2025-11-15',
    keyChanges: ['Reduced pricing for retention', 'Improved SLA terms', 'Additional technician training'],
    customerFeedback: 'Comparing with competitor proposals. Price sensitive.',
    internalNotes: 'High risk renewal. Customer has outstanding payment issues. Competitor threat confirmed.',
    approvalStatus: 'approved',
    approvedBy: 'Senior Manager',
    approvalDate: '2025-10-17',
    riskFactors: ['Outstanding payments', 'Competitor proposal received', 'Service quality concerns'],
    opportunityScore: 48,
    technicianAssigned: 'Amit Singh',
    serviceVisits: 18,
    priorityLevel: 'critical'
  },
  {
    id: '3',
    contractNumber: 'AMC-2024-0089-R1',
    contractType: 'Parts & Labor',
    customerId: 'CUST003',
    customerName: 'Designer Kitchen Hub',
    currentStartDate: '2025-01-01',
    currentEndDate: '2025-12-31',
    proposedStartDate: '2026-01-01',
    proposedEndDate: '2026-12-31',
    currentValue: 420000,
    proposedValue: 450000,
    increasePercentage: 7.1,
    renewalCount: 2,
    accountManager: 'Neha Gupta',
    location: 'Bangalore, Karnataka',
    healthScore: 89,
    customerSatisfaction: 4.5,
    renewalStatus: 'customer_approved',
    renewalProbability: 95,
    competitorThreat: 'none',
    lastContactDate: '2025-10-18',
    nextFollowUpDate: '2025-11-01',
    proposalSentDate: '2025-10-10',
    decisionDeadline: '2025-11-30',
    keyChanges: ['Auto-renewal clause activation', 'Loyalty discount applied', 'Enhanced parts warranty'],
    customerFeedback: 'Very satisfied with service. Ready to renew with proposed terms.',
    internalNotes: 'Excellent relationship. Auto-renewal discussion successful.',
    approvalStatus: 'approved',
    approvedBy: 'Manager',
    approvalDate: '2025-10-09',
    riskFactors: [],
    opportunityScore: 96,
    technicianAssigned: 'Ravi Kumar',
    serviceVisits: 7,
    priorityLevel: 'medium'
  },
  {
    id: '4',
    contractNumber: 'AMC-2024-0102-R1',
    contractType: 'Extended Warranty',
    customerId: 'CUST004',
    customerName: 'Elite Modular Systems',
    currentStartDate: '2025-02-01',
    currentEndDate: '2026-01-31',
    proposedStartDate: '2026-02-01',
    proposedEndDate: '2027-01-31',
    currentValue: 750000,
    proposedValue: 0,
    increasePercentage: 0,
    renewalCount: 0,
    accountManager: 'Vikram Rao',
    location: 'Chennai, Tamil Nadu',
    healthScore: 82,
    customerSatisfaction: 4.3,
    renewalStatus: 'draft',
    renewalProbability: 70,
    competitorThreat: 'medium',
    lastContactDate: '2025-09-15',
    nextFollowUpDate: '2025-10-25',
    proposalSentDate: '',
    decisionDeadline: '2026-01-15',
    keyChanges: [],
    customerFeedback: '',
    internalNotes: 'Renewal discussion pending. Customer evaluation in progress.',
    approvalStatus: 'pending',
    approvedBy: '',
    approvalDate: '',
    riskFactors: ['Market competition increasing', 'Price sensitivity'],
    opportunityScore: 75,
    technicianAssigned: 'Deepak Sharma',
    serviceVisits: 9,
    priorityLevel: 'high'
  },
  {
    id: '5',
    contractNumber: 'CMC-2024-0067-R1',
    contractType: 'Pay Per Visit',
    customerId: 'CUST005',
    customerName: 'Premium Kitchen Works',
    currentStartDate: '2024-11-15',
    currentEndDate: '2025-11-14',
    proposedStartDate: '2025-11-15',
    proposedEndDate: '2026-11-14',
    currentValue: 280000,
    proposedValue: 300000,
    increasePercentage: 7.1,
    renewalCount: 1,
    accountManager: 'Anita Joshi',
    location: 'Pune, Maharashtra',
    healthScore: 71,
    customerSatisfaction: 3.9,
    renewalStatus: 'rejected',
    renewalProbability: 25,
    competitorThreat: 'high',
    lastContactDate: '2025-10-19',
    nextFollowUpDate: '2025-10-26',
    proposalSentDate: '2025-10-12',
    decisionDeadline: '2025-11-10',
    keyChanges: ['Competitive pricing adjustment', 'Improved response time', 'Additional service visits'],
    customerFeedback: 'Decided to go with competitor due to better pricing.',
    internalNotes: 'Lost to competitor. Customer cited price as primary factor.',
    approvalStatus: 'approved',
    approvedBy: 'Manager',
    approvalDate: '2025-10-11',
    riskFactors: ['Lost to competitor', 'Price sensitivity', 'Service quality issues'],
    opportunityScore: 30,
    technicianAssigned: 'Manoj Kumar',
    serviceVisits: 6,
    priorityLevel: 'low'
  }
];

export default function ServiceContractRenewalsPage() {
  const router = useRouter();
  const [renewals, setRenewals] = useState<ContractRenewal[]>(mockRenewals);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priorityLevel');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<ContractRenewal | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Filter and search renewals
  const filteredRenewals = renewals.filter(renewal => {
    const matchesSearch =
      renewal.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.accountManager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || renewal.renewalStatus === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || renewal.priorityLevel === selectedPriority;
    const matchesThreat = selectedThreat === 'all' || renewal.competitorThreat === selectedThreat;

    return matchesSearch && matchesStatus && matchesPriority && matchesThreat;
  });

  // Sort renewals
  const sortedRenewals = [...filteredRenewals].sort((a, b) => {
    let aValue: any = a[sortBy as keyof ContractRenewal];
    let bValue: any = b[sortBy as keyof ContractRenewal];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'sent_to_customer': return 'bg-blue-100 text-blue-800';
      case 'under_negotiation': return 'bg-purple-100 text-purple-800';
      case 'customer_approved': return 'bg-green-100 text-green-800';
      case 'contract_signed': return 'bg-emerald-100 text-emerald-800';
      case 'renewed': return 'bg-teal-100 text-teal-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'none': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'AMC': return 'bg-blue-100 text-blue-800';
      case 'CMC': return 'bg-green-100 text-green-800';
      case 'Pay Per Visit': return 'bg-yellow-100 text-yellow-800';
      case 'Parts & Labor': return 'bg-purple-100 text-purple-800';
      case 'Extended Warranty': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRenewalDetails = (renewal: ContractRenewal) => {
    setSelectedRenewal(renewal);
    setShowRenewalModal(true);
  };

  const calculateStats = () => {
    const totalCurrentValue = renewals.reduce((sum, renewal) => sum + renewal.currentValue, 0);
    const totalProposedValue = renewals.reduce((sum, renewal) => sum + (renewal.proposedValue || renewal.currentValue), 0);
    const avgProbability = renewals.reduce((sum, renewal) => sum + renewal.renewalProbability, 0) / renewals.length;
    const highPriorityCount = renewals.filter(r => r.priorityLevel === 'critical' || r.priorityLevel === 'high').length;
    const approvedCount = renewals.filter(r => r.renewalStatus === 'customer_approved' || r.renewalStatus === 'contract_signed' || r.renewalStatus === 'renewed').length;
    const rejectedCount = renewals.filter(r => r.renewalStatus === 'rejected').length;

    return {
      totalCurrentValue,
      totalProposedValue,
      avgProbability,
      highPriorityCount,
      approvedCount,
      rejectedCount
    };
  };

  const stats = calculateStats();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Contract Renewals</h1>
          <p className="text-gray-600">Manage contract renewal pipeline and negotiations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => router.push('/after-sales-service/service-contracts/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            New Renewal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Renewals</p>
              <p className="text-2xl font-bold text-gray-900">{renewals.length}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalCurrentValue / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Proposed Value</p>
              <p className="text-2xl font-bold text-green-600">₹{(stats.totalProposedValue / 100000).toFixed(1)}L</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Probability</p>
              <p className={`text-2xl font-bold ${getProbabilityColor(stats.avgProbability)}`}>
                {stats.avgProbability.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highPriorityCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won/Lost</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approvedCount}/{stats.rejectedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search renewals..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priorityLevel">Sort by Priority</option>
            <option value="renewalProbability">Sort by Probability</option>
            <option value="currentValue">Sort by Value</option>
            <option value="decisionDeadline">Sort by Deadline</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="sent_to_customer">Sent to Customer</option>
              <option value="under_negotiation">Under Negotiation</option>
              <option value="customer_approved">Customer Approved</option>
              <option value="contract_signed">Contract Signed</option>
              <option value="renewed">Renewed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedThreat}
              onChange={(e) => setSelectedThreat(e.target.value)}
            >
              <option value="all">All Threats</option>
              <option value="high">High Threat</option>
              <option value="medium">Medium Threat</option>
              <option value="low">Low Threat</option>
              <option value="none">No Threat</option>
            </select>
          </div>
        )}
      </div>

      {/* Renewals Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renewal Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline & Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRenewals.map((renewal) => (
                <tr
                  key={renewal.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRenewalDetails(renewal)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{renewal.contractNumber}</div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContractTypeColor(renewal.contractType)}`}>
                        {renewal.contractType}
                      </div>
                      <div className="text-xs text-gray-500">Renewal #{renewal.renewalCount + 1}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{renewal.customerName}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {renewal.location}
                      </div>
                      <div className="text-xs text-gray-500">AM: {renewal.accountManager}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(renewal.renewalStatus)}`}>
                        {renewal.renewalStatus.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className={`text-sm font-medium ${getProbabilityColor(renewal.renewalProbability)}`}>
                        {renewal.renewalProbability}% probability
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(renewal.priorityLevel)}`}>
                        {renewal.priorityLevel.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Current: ₹{(renewal.currentValue / 100000).toFixed(1)}L
                      </div>
                      {renewal.proposedValue > 0 && (
                        <div className={`text-sm font-medium ${renewal.increasePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Proposed: ₹{(renewal.proposedValue / 100000).toFixed(1)}L
                        </div>
                      )}
                      {renewal.increasePercentage !== 0 && (
                        <div className={`text-xs ${renewal.increasePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {renewal.increasePercentage >= 0 ? '+' : ''}{renewal.increasePercentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Deadline: {new Date(renewal.decisionDeadline).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next: {new Date(renewal.nextFollowUpDate).toLocaleDateString()}
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThreatColor(renewal.competitorThreat)}`}>
                        {renewal.competitorThreat.toUpperCase()} THREAT
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Health: {renewal.healthScore}%
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {renewal.customerSatisfaction.toFixed(1)} Rating
                      </div>
                      <div className="text-xs text-gray-500">
                        Score: {renewal.opportunityScore}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/after-sales-service/service-contracts/view/${renewal.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"

                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/after-sales-service/service-contracts/edit/${renewal.id}`);
                        }}
                        className="text-gray-600 hover:text-gray-900"

                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle send proposal
                        }}
                        className="text-green-600 hover:text-green-900"

                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle contact customer
                        }}
                        className="text-purple-600 hover:text-purple-900"

                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Details Modal */}
      {showRenewalModal && selectedRenewal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full  max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Renewal Details</h2>
              <button
                onClick={() => setShowRenewalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contract Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contract Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract:</span>
                    <span className="font-medium">{selectedRenewal.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getContractTypeColor(selectedRenewal.contractType)}`}>
                      {selectedRenewal.contractType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Period:</span>
                    <span className="font-medium">
                      {new Date(selectedRenewal.currentStartDate).toLocaleDateString()} - {new Date(selectedRenewal.currentEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proposed Period:</span>
                    <span className="font-medium">
                      {new Date(selectedRenewal.proposedStartDate).toLocaleDateString()} - {new Date(selectedRenewal.proposedEndDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium">₹{(selectedRenewal.currentValue / 100000).toFixed(1)}L</span>
                  </div>
                  {selectedRenewal.proposedValue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proposed Value:</span>
                      <span className={`font-medium ${selectedRenewal.increasePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{(selectedRenewal.proposedValue / 100000).toFixed(1)}L
                      </span>
                    </div>
                  )}
                  {selectedRenewal.increasePercentage !== 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change:</span>
                      <span className={`font-medium ${selectedRenewal.increasePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRenewal.increasePercentage >= 0 ? '+' : ''}{selectedRenewal.increasePercentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renewal Count:</span>
                    <span className="font-medium">{selectedRenewal.renewalCount}</span>
                  </div>
                </div>
              </div>

              {/* Status & Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Status & Timeline</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRenewal.renewalStatus)}`}>
                      {selectedRenewal.renewalStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Probability:</span>
                    <span className={`font-medium ${getProbabilityColor(selectedRenewal.renewalProbability)}`}>
                      {selectedRenewal.renewalProbability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Decision Deadline:</span>
                    <span className="font-medium">{new Date(selectedRenewal.decisionDeadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Follow-up:</span>
                    <span className="font-medium">{new Date(selectedRenewal.nextFollowUpDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Key Changes */}
              {selectedRenewal.keyChanges.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Key Changes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {selectedRenewal.keyChanges.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Customer Feedback */}
              {selectedRenewal.customerFeedback && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Feedback</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRenewal.customerFeedback}</p>
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              {selectedRenewal.internalNotes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRenewal.internalNotes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRenewalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/service-contracts/edit/${selectedRenewal.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Renewal
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/service-contracts/view/${selectedRenewal.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}