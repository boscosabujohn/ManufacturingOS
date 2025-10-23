'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Edit, FileText, Phone, AlertTriangle, Clock, RefreshCw, DollarSign, TrendingUp, Users, Calendar, Shield, Bell, Download, Filter, MoreVertical, Wrench, MapPin, Star, CheckCircle } from 'lucide-react';

interface ExpiringServiceContract {
  id: string;
  contractNumber: string;
  contractType: 'AMC' | 'CMC' | 'Pay Per Visit' | 'Parts & Labor' | 'Extended Warranty';
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  duration: number;
  pricingTier: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  contractValue: number;
  responseTimeSLA: number;
  resolutionTimeSLA: number;
  renewalCount: number;
  totalBilled: number;
  totalPaid: number;
  outstandingAmount: number;
  equipmentCount: number;
  accountManager: string;
  billingFrequency: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  autoRenewal: boolean;
  healthScore: number;
  serviceVisits: number;
  lastServiceDate: string;
  customerSatisfaction: number;
  technicianAssigned: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  utilizationRate: number;
  complianceScore: number;
  remainingDays: number;
  renewalStatus: 'not_initiated' | 'discussion' | 'proposal_sent' | 'negotiation' | 'agreement' | 'renewal_confirmed';
  renewalProbability: number;
  renewalValueProposed: number;
  lastContactDate: string;
  nextFollowUpDate: string;
  renewalNotes: string;
  competitorThreat: 'none' | 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const mockExpiringContracts: ExpiringServiceContract[] = [
  {
    id: '1',
    contractNumber: 'AMC-2024-0045',
    contractType: 'AMC',
    customerId: 'CUST001',
    customerName: 'Royal Kitchen Designs',
    startDate: '2024-11-01',
    endDate: '2025-10-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 580000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 3,
    totalBilled: 580000,
    totalPaid: 580000,
    outstandingAmount: 0,
    equipmentCount: 58,
    accountManager: 'Rajesh Kumar',
    billingFrequency: 'quarterly',
    autoRenewal: false,
    healthScore: 94,
    serviceVisits: 12,
    lastServiceDate: '2025-10-15',
    customerSatisfaction: 4.9,
    technicianAssigned: 'Suresh Patel',
    location: 'Mumbai, Maharashtra',
    priority: 'high',
    utilizationRate: 88,
    complianceScore: 97,
    remainingDays: 8,
    renewalStatus: 'proposal_sent',
    renewalProbability: 85,
    renewalValueProposed: 620000,
    lastContactDate: '2025-10-20',
    nextFollowUpDate: '2025-10-25',
    renewalNotes: 'Customer satisfied with service quality. Proposed 7% increase with enhanced coverage.',
    competitorThreat: 'low',
    riskLevel: 'low'
  },
  {
    id: '2',
    contractNumber: 'CMC-2024-0078',
    contractType: 'CMC',
    customerId: 'CUST002',
    customerName: 'Metro Kitchen Solutions',
    startDate: '2024-12-01',
    endDate: '2025-11-30',
    duration: 12,
    pricingTier: 'Enterprise',
    contractValue: 890000,
    responseTimeSLA: 2,
    resolutionTimeSLA: 12,
    renewalCount: 1,
    totalBilled: 890000,
    totalPaid: 820000,
    outstandingAmount: 70000,
    equipmentCount: 95,
    accountManager: 'Priya Sharma',
    billingFrequency: 'monthly',
    autoRenewal: false,
    healthScore: 76,
    serviceVisits: 18,
    lastServiceDate: '2025-10-18',
    customerSatisfaction: 3.8,
    technicianAssigned: 'Amit Singh',
    location: 'Delhi, NCR',
    priority: 'critical',
    utilizationRate: 82,
    complianceScore: 88,
    remainingDays: 37,
    renewalStatus: 'discussion',
    renewalProbability: 45,
    renewalValueProposed: 0,
    lastContactDate: '2025-10-15',
    nextFollowUpDate: '2025-10-24',
    renewalNotes: 'Customer concerned about recent service delays. Outstanding payment affecting relationship.',
    competitorThreat: 'high',
    riskLevel: 'critical'
  },
  {
    id: '3',
    contractNumber: 'AMC-2024-0089',
    contractType: 'Parts & Labor',
    customerId: 'CUST003',
    customerName: 'Designer Kitchen Hub',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    duration: 12,
    pricingTier: 'Standard',
    contractValue: 420000,
    responseTimeSLA: 8,
    resolutionTimeSLA: 48,
    renewalCount: 2,
    totalBilled: 315000,
    totalPaid: 315000,
    outstandingAmount: 0,
    equipmentCount: 42,
    accountManager: 'Neha Gupta',
    billingFrequency: 'quarterly',
    autoRenewal: true,
    healthScore: 89,
    serviceVisits: 7,
    lastServiceDate: '2025-10-10',
    customerSatisfaction: 4.5,
    technicianAssigned: 'Ravi Kumar',
    location: 'Bangalore, Karnataka',
    priority: 'medium',
    utilizationRate: 75,
    complianceScore: 92,
    remainingDays: 69,
    renewalStatus: 'agreement',
    renewalProbability: 95,
    renewalValueProposed: 450000,
    lastContactDate: '2025-10-18',
    nextFollowUpDate: '2025-11-01',
    renewalNotes: 'Auto-renewal clause active. Customer agreed to 7% increase. Documentation in progress.',
    competitorThreat: 'none',
    riskLevel: 'low'
  },
  {
    id: '4',
    contractNumber: 'AMC-2024-0102',
    contractType: 'Extended Warranty',
    customerId: 'CUST004',
    customerName: 'Elite Modular Systems',
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 750000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 0,
    totalBilled: 500000,
    totalPaid: 500000,
    outstandingAmount: 0,
    equipmentCount: 75,
    accountManager: 'Vikram Rao',
    billingFrequency: 'half_yearly',
    autoRenewal: false,
    healthScore: 82,
    serviceVisits: 9,
    lastServiceDate: '2025-10-12',
    customerSatisfaction: 4.3,
    technicianAssigned: 'Deepak Sharma',
    location: 'Chennai, Tamil Nadu',
    priority: 'high',
    utilizationRate: 79,
    complianceScore: 90,
    remainingDays: 100,
    renewalStatus: 'not_initiated',
    renewalProbability: 70,
    renewalValueProposed: 0,
    lastContactDate: '2025-09-15',
    nextFollowUpDate: '2025-10-25',
    renewalNotes: 'Contract renewal discussion pending. Customer evaluation ongoing.',
    competitorThreat: 'medium',
    riskLevel: 'medium'
  },
  {
    id: '5',
    contractNumber: 'CMC-2024-0067',
    contractType: 'Pay Per Visit',
    customerId: 'CUST005',
    customerName: 'Premium Kitchen Works',
    startDate: '2024-11-15',
    endDate: '2025-11-14',
    duration: 12,
    pricingTier: 'Basic',
    contractValue: 280000,
    responseTimeSLA: 12,
    resolutionTimeSLA: 72,
    renewalCount: 1,
    totalBilled: 280000,
    totalPaid: 245000,
    outstandingAmount: 35000,
    equipmentCount: 28,
    accountManager: 'Anita Joshi',
    billingFrequency: 'quarterly',
    autoRenewal: false,
    healthScore: 71,
    serviceVisits: 6,
    lastServiceDate: '2025-09-20',
    customerSatisfaction: 3.9,
    technicianAssigned: 'Manoj Kumar',
    location: 'Pune, Maharashtra',
    priority: 'medium',
    utilizationRate: 58,
    complianceScore: 85,
    remainingDays: 22,
    renewalStatus: 'negotiation',
    renewalProbability: 55,
    renewalValueProposed: 300000,
    lastContactDate: '2025-10-19',
    nextFollowUpDate: '2025-10-26',
    renewalNotes: 'Price negotiation ongoing. Customer comparing with competitor quotes.',
    competitorThreat: 'medium',
    riskLevel: 'high'
  }
];

export default function ExpiringServiceContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ExpiringServiceContract[]>(mockExpiringContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('remainingDays');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ExpiringServiceContract | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Filter and search contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.accountManager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || contract.contractType === selectedType;
    const matchesRisk = selectedRisk === 'all' || contract.riskLevel === selectedRisk;
    const matchesStatus = selectedStatus === 'all' || contract.renewalStatus === selectedStatus;
    
    return matchesSearch && matchesType && matchesRisk && matchesStatus;
  });

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof ExpiringServiceContract];
    let bValue: any = b[sortBy as keyof ExpiringServiceContract];
    
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

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case 'not_initiated': return 'bg-gray-100 text-gray-800';
      case 'discussion': return 'bg-blue-100 text-blue-800';
      case 'proposal_sent': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'agreement': return 'bg-green-100 text-green-800';
      case 'renewal_confirmed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 font-bold';
    if (days <= 30) return 'text-orange-600 font-semibold';
    if (days <= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleRenewalAction = (contract: ExpiringServiceContract) => {
    setSelectedContract(contract);
    setShowRenewalModal(true);
  };

  const calculateStats = () => {
    const criticalExpiry = contracts.filter(c => c.remainingDays <= 30).length;
    const totalValue = contracts.reduce((sum, contract) => sum + contract.contractValue, 0);
    const totalRenewalValue = contracts.reduce((sum, contract) => sum + contract.renewalValueProposed, 0);
    const avgProbability = contracts.reduce((sum, contract) => sum + contract.renewalProbability, 0) / contracts.length;
    const highRiskContracts = contracts.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high').length;
    const confirmedRenewals = contracts.filter(c => c.renewalStatus === 'renewal_confirmed' || c.renewalStatus === 'agreement').length;

    return {
      criticalExpiry,
      totalValue,
      totalRenewalValue,
      avgProbability,
      highRiskContracts,
      confirmedRenewals
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expiring Service Contracts</h1>
          <p className="text-gray-600">Monitor and manage contract renewals</p>
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
            onClick={() => router.push('/after-sales-service/service-contracts/renewals')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4" />
            Renewal Center
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalExpiry}</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Renewal Value</p>
              <p className="text-2xl font-bold text-green-600">₹{(stats.totalRenewalValue / 100000).toFixed(1)}L</p>
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
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{stats.highRiskContracts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmedRenewals}</p>
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
              placeholder="Search contracts..."
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
            <option value="remainingDays">Sort by Expiry</option>
            <option value="renewalProbability">Sort by Probability</option>
            <option value="contractValue">Sort by Value</option>
            <option value="riskLevel">Sort by Risk</option>
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Contract Types</option>
              <option value="AMC">AMC</option>
              <option value="CMC">CMC</option>
              <option value="Pay Per Visit">Pay Per Visit</option>
              <option value="Parts & Labor">Parts & Labor</option>
              <option value="Extended Warranty">Extended Warranty</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Renewal Status</option>
              <option value="not_initiated">Not Initiated</option>
              <option value="discussion">Discussion</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="agreement">Agreement</option>
              <option value="renewal_confirmed">Confirmed</option>
            </select>
          </div>
        )}
      </div>

      {/* Contracts Table */}
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
                  Expiry & Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renewal Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial Impact
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
              {sortedContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContractTypeColor(contract.contractType)}`}>
                        {contract.contractType}
                      </div>
                      <div className="text-xs text-gray-500">{contract.pricingTier} Tier</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{contract.customerName}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {contract.location}
                      </div>
                      <div className="text-xs text-gray-500">AM: {contract.accountManager}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${getExpiryUrgencyColor(contract.remainingDays)}`}>
                        {contract.remainingDays} days left
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires: {new Date(contract.endDate).toLocaleDateString()}
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(contract.riskLevel)}`}>
                        {contract.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRenewalStatusColor(contract.renewalStatus)}`}>
                        {contract.renewalStatus.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className={`text-sm font-medium ${getProbabilityColor(contract.renewalProbability)}`}>
                        {contract.renewalProbability}% probability
                      </div>
                      <div className="text-xs text-gray-500">
                        Next: {new Date(contract.nextFollowUpDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Current: ₹{(contract.contractValue / 100000).toFixed(1)}L
                      </div>
                      {contract.renewalValueProposed > 0 && (
                        <div className="text-sm font-medium text-green-600">
                          Proposed: ₹{(contract.renewalValueProposed / 100000).toFixed(1)}L
                        </div>
                      )}
                      {contract.outstandingAmount > 0 && (
                        <div className="text-xs text-red-600">
                          Outstanding: ₹{(contract.outstandingAmount / 1000).toFixed(0)}K
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Health: {contract.healthScore}%
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {contract.customerSatisfaction.toFixed(1)} Rating
                      </div>
                      <div className="text-xs text-gray-500">
                        Visits: {contract.serviceVisits}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRenewalAction(contract)}
                        className="text-green-600 hover:text-green-900"
                        title="Renewal Action"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/after-sales-service/service-contracts/view/${contract.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Handle contact action
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Contact Customer"
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

      {/* Renewal Action Modal */}
      {showRenewalModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Renewal Management</h2>
              <button
                onClick={() => setShowRenewalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contract Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract:</span>
                    <span className="font-medium">{selectedContract.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedContract.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium">₹{(selectedContract.contractValue / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires In:</span>
                    <span className={`font-medium ${getExpiryUrgencyColor(selectedContract.remainingDays)}`}>
                      {selectedContract.remainingDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score:</span>
                    <span className="font-medium">{selectedContract.healthScore}%</span>
                  </div>
                </div>
              </div>

              {/* Renewal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Renewal Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRenewalStatusColor(selectedContract.renewalStatus)}`}>
                      {selectedContract.renewalStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Probability:</span>
                    <span className={`font-medium ${getProbabilityColor(selectedContract.renewalProbability)}`}>
                      {selectedContract.renewalProbability}%
                    </span>
                  </div>
                  {selectedContract.renewalValueProposed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proposed Value:</span>
                      <span className="font-medium text-green-600">
                        ₹{(selectedContract.renewalValueProposed / 100000).toFixed(1)}L
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(selectedContract.riskLevel)}`}>
                      {selectedContract.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Follow-up:</span>
                    <span className="font-medium">{new Date(selectedContract.nextFollowUpDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Renewal Notes */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Renewal Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedContract.renewalNotes}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRenewalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/service-contracts/renewals?contract=${selectedContract.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Manage Renewal
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/service-contracts/view/${selectedContract.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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