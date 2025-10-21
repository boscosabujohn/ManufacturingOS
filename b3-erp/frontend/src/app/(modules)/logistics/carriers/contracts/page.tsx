'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, FileText, Calendar, DollarSign, CheckCircle, AlertTriangle, XCircle, Clock, Package, Filter, Eye, Edit } from 'lucide-react';

interface CarrierContract {
  id: string;
  contractNo: string;
  carrier: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: 'active' | 'expiring-soon' | 'expired' | 'draft' | 'pending-renewal';
  totalValue: number;
  monthlyCommitment: number;
  volumeCommitment: number;
  actualVolume: number;
  discountTier: string;
  paymentTerms: string;
  slaTarget: number;
  slaActual: number;
  penaltyClause: string;
  autoRenewal: boolean;
  noticePerio: number;
  contactPerson: string;
  contactEmail: string;
  lastReviewed: string;
  daysToExpiry: number;
}

export default function CarrierContractsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');

  const contracts: CarrierContract[] = [
    {
      id: '1',
      contractNo: 'CONT-BDE-2025-001',
      carrier: 'Blue Dart Express',
      serviceType: 'Express & Standard',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      duration: 12,
      status: 'active',
      totalValue: 35000000,
      monthlyCommitment: 2500000,
      volumeCommitment: 15000,
      actualVolume: 12450,
      discountTier: 'Volume 15K+ (15% discount)',
      paymentTerms: 'Net 30 days',
      slaTarget: 96.0,
      slaActual: 96.2,
      penaltyClause: '0.5% per day for SLA breach',
      autoRenewal: true,
      noticePerio: 60,
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'rajesh.k@bluedart.com',
      lastReviewed: '2025-10-15',
      daysToExpiry: 71
    },
    {
      id: '2',
      contractNo: 'CONT-DHL-2025-002',
      carrier: 'DHL Express',
      serviceType: 'Express & Freight',
      startDate: '2025-02-01',
      endDate: '2026-01-31',
      duration: 12,
      status: 'active',
      totalValue: 42000000,
      monthlyCommitment: 3500000,
      volumeCommitment: 12000,
      actualVolume: 9850,
      discountTier: 'Volume 10K+ (12% discount)',
      paymentTerms: 'Net 45 days',
      slaTarget: 97.0,
      slaActual: 96.4,
      penaltyClause: '1% per day for SLA breach',
      autoRenewal: false,
      noticePerio: 90,
      contactPerson: 'Priya Sharma',
      contactEmail: 'priya.s@dhl.com',
      lastReviewed: '2025-10-10',
      daysToExpiry: 102
    },
    {
      id: '3',
      contractNo: 'CONT-FDX-2024-003',
      carrier: 'FedEx',
      serviceType: 'Express & Standard',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      duration: 12,
      status: 'expiring-soon',
      totalValue: 28000000,
      monthlyCommitment: 2000000,
      volumeCommitment: 10000,
      actualVolume: 8750,
      discountTier: 'Volume 8K+ (10% discount)',
      paymentTerms: 'Net 30 days',
      slaTarget: 95.0,
      slaActual: 96.2,
      penaltyClause: '0.75% per day for SLA breach',
      autoRenewal: false,
      noticePerio: 60,
      contactPerson: 'Amit Patel',
      contactEmail: 'amit.p@fedex.com',
      lastReviewed: '2025-09-20',
      daysToExpiry: 31
    },
    {
      id: '4',
      contractNo: 'CONT-DTDC-2025-004',
      carrier: 'DTDC Courier',
      serviceType: 'Standard & Economy',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      duration: 12,
      status: 'active',
      totalValue: 18000000,
      monthlyCommitment: 1500000,
      volumeCommitment: 20000,
      actualVolume: 15680,
      discountTier: 'Volume 15K+ (8% discount)',
      paymentTerms: 'Net 30 days',
      slaTarget: 94.0,
      slaActual: 94.7,
      penaltyClause: '0.5% per day for SLA breach',
      autoRenewal: true,
      noticePerio: 45,
      contactPerson: 'Suresh Menon',
      contactEmail: 'suresh.m@dtdc.com',
      lastReviewed: '2025-10-18',
      daysToExpiry: 130
    },
    {
      id: '5',
      contractNo: 'CONT-INP-2025-005',
      carrier: 'Indian Post',
      serviceType: 'Economy',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      duration: 12,
      status: 'active',
      totalValue: 7200000,
      monthlyCommitment: 600000,
      volumeCommitment: 25000,
      actualVolume: 21450,
      discountTier: 'Volume 20K+ (5% discount)',
      paymentTerms: 'Net 15 days',
      slaTarget: 92.0,
      slaActual: 93.8,
      penaltyClause: 'No penalty clause',
      autoRenewal: true,
      noticePerio: 30,
      contactPerson: 'Deepak Singh',
      contactEmail: 'deepak.s@indiapost.gov.in',
      lastReviewed: '2025-10-05',
      daysToExpiry: 71
    },
    {
      id: '6',
      contractNo: 'CONT-BDE-2024-006',
      carrier: 'Blue Dart Express',
      serviceType: 'Freight',
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      duration: 12,
      status: 'expiring-soon',
      totalValue: 15000000,
      monthlyCommitment: 1250000,
      volumeCommitment: 5000,
      actualVolume: 4850,
      discountTier: 'Volume 5K+ (10% discount)',
      paymentTerms: 'Net 45 days',
      slaTarget: 96.0,
      slaActual: 96.9,
      penaltyClause: '0.5% per day for SLA breach',
      autoRenewal: false,
      noticePerio: 60,
      contactPerson: 'Vikas Reddy',
      contactEmail: 'vikas.r@bluedart.com',
      lastReviewed: '2025-09-15',
      daysToExpiry: 50
    },
    {
      id: '7',
      contractNo: 'CONT-NEW-2025-007',
      carrier: 'XpressBees',
      serviceType: 'Standard',
      startDate: '2025-11-01',
      endDate: '2026-10-31',
      duration: 12,
      status: 'draft',
      totalValue: 12000000,
      monthlyCommitment: 1000000,
      volumeCommitment: 8000,
      actualVolume: 0,
      discountTier: 'Volume 8K+ (12% discount)',
      paymentTerms: 'Net 30 days',
      slaTarget: 95.0,
      slaActual: 0,
      penaltyClause: '0.75% per day for SLA breach',
      autoRenewal: false,
      noticePerio: 60,
      contactPerson: 'Rahul Verma',
      contactEmail: 'rahul.v@xpressbees.com',
      lastReviewed: '2025-10-20',
      daysToExpiry: -11
    },
    {
      id: '8',
      contractNo: 'CONT-FDX-2023-008',
      carrier: 'FedEx',
      serviceType: 'Freight',
      startDate: '2023-09-01',
      endDate: '2024-08-31',
      duration: 12,
      status: 'expired',
      totalValue: 18000000,
      monthlyCommitment: 1500000,
      volumeCommitment: 6000,
      actualVolume: 5645,
      discountTier: 'Volume 5K+ (8% discount)',
      paymentTerms: 'Net 45 days',
      slaTarget: 96.0,
      slaActual: 95.8,
      penaltyClause: '0.5% per day for SLA breach',
      autoRenewal: false,
      noticePerio: 60,
      contactPerson: 'Sanjay Kumar',
      contactEmail: 'sanjay.k@fedex.com',
      lastReviewed: '2024-08-15',
      daysToExpiry: -82
    }
  ];

  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => c.status === 'expiring-soon').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    draft: contracts.filter(c => c.status === 'draft').length,
    totalValue: contracts.filter(c => c.status === 'active' || c.status === 'expiring-soon').reduce((sum, c) => sum + c.totalValue, 0),
    autoRenewal: contracts.filter(c => c.autoRenewal && (c.status === 'active' || c.status === 'expiring-soon')).length,
    avgSLAPerformance: (contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.slaActual, 0) / contracts.filter(c => c.status === 'active').length).toFixed(1)
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch =
      contract.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesCarrier = carrierFilter === 'all' || contract.carrier === carrierFilter;

    return matchesSearch && matchesStatus && matchesCarrier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'pending-renewal': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring-soon': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'pending-renewal': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSLAPerformanceColor = (actual: number, target: number) => {
    if (actual >= target) return 'text-green-600';
    if (actual >= target - 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrier Contracts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage carrier contracts and agreements</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.total}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Contracts</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.active}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Active</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.expiringSoon}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Expiring Soon</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.expired}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Expired</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.draft}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Draft</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-7 h-7 opacity-80" />
            <span className="text-lg font-bold">¹{(contractStats.totalValue / 10000000).toFixed(1)}Cr</span>
          </div>
          <p className="text-xs font-medium opacity-90">Total Value</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.autoRenewal}</span>
          </div>
          <p className="text-xs font-medium opacity-90">Auto-Renewal</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-7 h-7 opacity-80" />
            <span className="text-2xl font-bold">{contractStats.avgSLAPerformance}%</span>
          </div>
          <p className="text-xs font-medium opacity-90">Avg SLA</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by contract no, carrier, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="pending-renewal">Pending Renewal</option>
            </select>

            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Carriers</option>
              <option value="Blue Dart Express">Blue Dart Express</option>
              <option value="DHL Express">DHL Express</option>
              <option value="FedEx">FedEx</option>
              <option value="DTDC Courier">DTDC Courier</option>
              <option value="Indian Post">Indian Post</option>
              <option value="XpressBees">XpressBees</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredContracts.length} of {contractStats.total} contracts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{contract.contractNo}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                    {getStatusIcon(contract.status)}
                    {contract.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600">{contract.carrier}</p>
                <p className="text-xs text-gray-500 mt-0.5">{contract.serviceType}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Contract Value</p>
                <p className="text-2xl font-bold text-indigo-600">¹{(contract.totalValue / 1000000).toFixed(1)}M</p>
                {contract.daysToExpiry > 0 && contract.daysToExpiry <= 60 && (
                  <p className="text-xs text-orange-600 font-medium mt-1">Expires in {contract.daysToExpiry} days</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">Contract Period</p>
                </div>
                <p className="text-sm font-semibold text-blue-900">{contract.startDate}</p>
                <p className="text-xs text-blue-700">to {contract.endDate}</p>
                <p className="text-xs text-blue-600 mt-0.5">{contract.duration} months</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Package className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">Volume</p>
                </div>
                <p className="text-sm font-semibold text-green-900">{contract.actualVolume.toLocaleString()}</p>
                <p className="text-xs text-green-700">of {contract.volumeCommitment.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-0.5">{((contract.actualVolume / contract.volumeCommitment) * 100).toFixed(1)}% achieved</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-purple-600" />
                  <p className="text-xs text-purple-600 font-medium">Monthly Commitment</p>
                </div>
                <p className="text-sm font-semibold text-purple-900">¹{(contract.monthlyCommitment / 1000).toFixed(0)}K</p>
                <p className="text-xs text-purple-700 mt-1">{contract.paymentTerms}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 text-orange-600" />
                  <p className="text-xs text-orange-600 font-medium">SLA Performance</p>
                </div>
                <p className={`text-sm font-semibold ${getSLAPerformanceColor(contract.slaActual, contract.slaTarget)}`}>
                  {contract.slaActual > 0 ? `${contract.slaActual}%` : 'N/A'}
                </p>
                <p className="text-xs text-orange-700">Target: {contract.slaTarget}%</p>
                {contract.slaActual >= contract.slaTarget && contract.slaActual > 0 && (
                  <p className="text-xs text-green-600 mt-0.5"> Meeting SLA</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3 text-gray-600" />
                  <p className="text-xs text-gray-600 font-medium">Discount Tier</p>
                </div>
                <p className="text-xs font-medium text-gray-900">{contract.discountTier}</p>
                <div className="mt-2">
                  {contract.autoRenewal ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                      Auto-Renewal: Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">
                      Auto-Renewal: No
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Contact Person</p>
                  <p className="text-sm font-medium text-gray-900">{contract.contactPerson}</p>
                  <p className="text-xs text-blue-600 mt-0.5">{contract.contactEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Penalty Clause</p>
                  <p className="text-sm font-medium text-gray-900">{contract.penaltyClause}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Notice Period: {contract.noticePerio} days</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Last reviewed: {contract.lastReviewed}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No contracts found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Contract Management Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="font-medium">Active:</span>
            <span>Contract is currently valid and in effect</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Expiring Soon:</span>
            <span>Contract expires within 60 days, requires attention</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Volume Commitment:</span>
            <span>Minimum shipment volume agreed in contract period</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">SLA Target:</span>
            <span>Service level agreement performance threshold</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Auto-Renewal:</span>
            <span>Contract automatically renews unless notice is given</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">Notice Period:</span>
            <span>Days required to terminate or modify contract</span>
          </div>
        </div>
      </div>
    </div>
  );
}
