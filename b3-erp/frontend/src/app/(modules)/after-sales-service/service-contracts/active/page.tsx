'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Edit, FileText, Phone, AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, Users, Calendar, Shield, Bell, Download, Filter, MoreVertical, Wrench, MapPin, Star } from 'lucide-react';

interface ActiveServiceContract {
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
  nextServiceDue: string;
  customerSatisfaction: number;
  technicianAssigned: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  utilizationRate: number;
  complianceScore: number;
  remainingDays: number;
}

const mockActiveContracts: ActiveServiceContract[] = [
  {
    id: '1',
    contractNumber: 'AMC-2025-0001',
    contractType: 'AMC',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 450000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 2,
    totalBilled: 225000,
    totalPaid: 225000,
    outstandingAmount: 0,
    equipmentCount: 45,
    accountManager: 'Rajesh Kumar',
    billingFrequency: 'quarterly',
    autoRenewal: true,
    healthScore: 92,
    serviceVisits: 8,
    lastServiceDate: '2025-10-15',
    nextServiceDue: '2025-11-15',
    customerSatisfaction: 4.8,
    technicianAssigned: 'Suresh Patel',
    location: 'Mumbai, Maharashtra',
    priority: 'high',
    utilizationRate: 85,
    complianceScore: 96,
    remainingDays: 69
  },
  {
    id: '2',
    contractNumber: 'CMC-2025-0012',
    contractType: 'CMC',
    customerId: 'CUST002',
    customerName: 'Elite Kitchen Solutions',
    startDate: '2025-03-01',
    endDate: '2026-02-29',
    duration: 12,
    pricingTier: 'Enterprise',
    contractValue: 750000,
    responseTimeSLA: 2,
    resolutionTimeSLA: 12,
    renewalCount: 0,
    totalBilled: 187500,
    totalPaid: 187500,
    outstandingAmount: 0,
    equipmentCount: 78,
    accountManager: 'Priya Sharma',
    billingFrequency: 'monthly',
    autoRenewal: false,
    healthScore: 88,
    serviceVisits: 12,
    lastServiceDate: '2025-10-18',
    nextServiceDue: '2025-11-01',
    customerSatisfaction: 4.6,
    technicianAssigned: 'Amit Singh',
    location: 'Delhi, NCR',
    priority: 'critical',
    utilizationRate: 78,
    complianceScore: 94,
    remainingDays: 127
  },
  {
    id: '3',
    contractNumber: 'AMC-2025-0025',
    contractType: 'Parts & Labor',
    customerId: 'CUST003',
    customerName: 'Modern Home Interiors',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    duration: 12,
    pricingTier: 'Standard',
    contractValue: 320000,
    responseTimeSLA: 8,
    resolutionTimeSLA: 48,
    renewalCount: 1,
    totalBilled: 106667,
    totalPaid: 106667,
    outstandingAmount: 0,
    equipmentCount: 32,
    accountManager: 'Neha Gupta',
    billingFrequency: 'quarterly',
    autoRenewal: true,
    healthScore: 91,
    serviceVisits: 5,
    lastServiceDate: '2025-10-10',
    nextServiceDue: '2025-12-10',
    customerSatisfaction: 4.7,
    technicianAssigned: 'Ravi Kumar',
    location: 'Bangalore, Karnataka',
    priority: 'medium',
    utilizationRate: 72,
    complianceScore: 89,
    remainingDays: 219
  },
  {
    id: '4',
    contractNumber: 'AMC-2025-0033',
    contractType: 'Extended Warranty',
    customerId: 'CUST004',
    customerName: 'Luxury Kitchen Designs',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    duration: 12,
    pricingTier: 'Premium',
    contractValue: 560000,
    responseTimeSLA: 4,
    resolutionTimeSLA: 24,
    renewalCount: 3,
    totalBilled: 373333,
    totalPaid: 360000,
    outstandingAmount: 13333,
    equipmentCount: 56,
    accountManager: 'Vikram Rao',
    billingFrequency: 'half_yearly',
    autoRenewal: true,
    healthScore: 85,
    serviceVisits: 9,
    lastServiceDate: '2025-10-12',
    nextServiceDue: '2025-11-12',
    customerSatisfaction: 4.5,
    technicianAssigned: 'Deepak Sharma',
    location: 'Chennai, Tamil Nadu',
    priority: 'high',
    utilizationRate: 91,
    complianceScore: 92,
    remainingDays: 158
  },
  {
    id: '5',
    contractNumber: 'CMC-2025-0019',
    contractType: 'Pay Per Visit',
    customerId: 'CUST005',
    customerName: 'Smart Kitchen Technologies',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    duration: 12,
    pricingTier: 'Basic',
    contractValue: 180000,
    responseTimeSLA: 12,
    resolutionTimeSLA: 72,
    renewalCount: 0,
    totalBilled: 60000,
    totalPaid: 60000,
    outstandingAmount: 0,
    equipmentCount: 18,
    accountManager: 'Anita Joshi',
    billingFrequency: 'quarterly',
    autoRenewal: false,
    healthScore: 76,
    serviceVisits: 3,
    lastServiceDate: '2025-09-20',
    nextServiceDue: '2025-12-20',
    customerSatisfaction: 4.2,
    technicianAssigned: 'Manoj Kumar',
    location: 'Pune, Maharashtra',
    priority: 'low',
    utilizationRate: 45,
    complianceScore: 87,
    remainingDays: 250
  }
];

export default function ActiveServiceContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ActiveServiceContract[]>(mockActiveContracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('remainingDays');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ActiveServiceContract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);

  // Filter and search contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.technicianAssigned.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || contract.contractType === selectedType;
    const matchesTier = selectedTier === 'all' || contract.pricingTier === selectedTier;
    const matchesPriority = selectedPriority === 'all' || contract.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesTier && matchesPriority;
  });

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof ActiveServiceContract];
    let bValue: any = b[sortBy as keyof ActiveServiceContract];
    
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleContractClick = (contract: ActiveServiceContract) => {
    setSelectedContract(contract);
    setShowContractModal(true);
  };

  const calculateStats = () => {
    const totalValue = contracts.reduce((sum, contract) => sum + contract.contractValue, 0);
    const totalBilled = contracts.reduce((sum, contract) => sum + contract.totalBilled, 0);
    const totalOutstanding = contracts.reduce((sum, contract) => sum + contract.outstandingAmount, 0);
    const avgHealthScore = contracts.reduce((sum, contract) => sum + contract.healthScore, 0) / contracts.length;
    const criticalContracts = contracts.filter(c => c.priority === 'critical').length;
    const expiringIn30Days = contracts.filter(c => c.remainingDays <= 30).length;

    return {
      totalValue,
      totalBilled,
      totalOutstanding,
      avgHealthScore,
      criticalContracts,
      expiringIn30Days
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Service Contracts</h1>
          <p className="text-gray-600">Manage and monitor active service contracts</p>
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
            New Contract
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contract Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">₹{(stats.totalOutstanding / 1000).toFixed(0)}K</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(stats.avgHealthScore)}`}>
                {stats.avgHealthScore.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalContracts}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiringIn30Days}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
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
            <option value="contractValue">Sort by Value</option>
            <option value="healthScore">Sort by Health Score</option>
            <option value="customerSatisfaction">Sort by Satisfaction</option>
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
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="all">All Pricing Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
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
                  Customer & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value & Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedContracts.map((contract) => (
                <tr 
                  key={contract.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleContractClick(contract)}
                >
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
                      <div className="text-sm font-medium text-gray-900">₹{(contract.contractValue / 100000).toFixed(1)}L</div>
                      <div className="text-xs text-gray-500">Billed: ₹{(contract.totalBilled / 100000).toFixed(1)}L</div>
                      {contract.outstandingAmount > 0 && (
                        <div className="text-xs text-red-600">Outstanding: ₹{(contract.outstandingAmount / 1000).toFixed(0)}K</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${getHealthScoreColor(contract.healthScore)}`}>
                          {contract.healthScore}% Health
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {contract.customerSatisfaction.toFixed(1)} Rating
                      </div>
                      <div className="text-xs text-gray-500">{contract.utilizationRate}% Utilization</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{contract.serviceVisits} Visits</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Wrench className="w-3 h-3 mr-1" />
                        {contract.technicianAssigned}
                      </div>
                      <div className="text-xs text-gray-500">Next: {new Date(contract.nextServiceDue).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(contract.priority)}`}>
                        {contract.priority.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.remainingDays} days left
                      </div>
                      {contract.autoRenewal && (
                        <div className="text-xs text-green-600">Auto-renewal</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/after-sales-service/service-contracts/view/${contract.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/after-sales-service/service-contracts/edit/${contract.id}`);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle contact action
                        }}
                        className="text-green-600 hover:text-green-900"
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

      {/* Contract Details Modal */}
      {showContractModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Contract Details</h2>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contract Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract Number:</span>
                    <span className="font-medium">{selectedContract.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getContractTypeColor(selectedContract.contractType)}`}>
                      {selectedContract.contractType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedContract.duration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">₹{(selectedContract.contractValue / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pricing Tier:</span>
                    <span className="font-medium">{selectedContract.pricingTier}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedContract.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedContract.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Manager:</span>
                    <span className="font-medium">{selectedContract.accountManager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipment Count:</span>
                    <span className="font-medium">{selectedContract.equipmentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Satisfaction:</span>
                    <span className="font-medium flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {selectedContract.customerSatisfaction.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score:</span>
                    <span className={`font-medium ${getHealthScoreColor(selectedContract.healthScore)}`}>
                      {selectedContract.healthScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilization Rate:</span>
                    <span className="font-medium">{selectedContract.utilizationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compliance Score:</span>
                    <span className="font-medium">{selectedContract.complianceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Visits:</span>
                    <span className="font-medium">{selectedContract.serviceVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response SLA:</span>
                    <span className="font-medium">{selectedContract.responseTimeSLA} hours</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Billed:</span>
                    <span className="font-medium">₹{(selectedContract.totalBilled / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium">₹{(selectedContract.totalPaid / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outstanding:</span>
                    <span className={`font-medium ${selectedContract.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{(selectedContract.outstandingAmount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Frequency:</span>
                    <span className="font-medium capitalize">{selectedContract.billingFrequency.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto Renewal:</span>
                    <span className={`font-medium ${selectedContract.autoRenewal ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedContract.autoRenewal ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/service-contracts/view/${selectedContract.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}