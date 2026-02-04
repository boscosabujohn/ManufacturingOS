'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Eye,
  Copy,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import {
  ViewVersionDetailsModal,
  EditVersionModal,
  CreateVersionModal,
  BOMVersion as ModalBOMVersion
} from '@/components/production/bom/BOMVersionModals';

interface BOMVersion {
  id: string;
  bomCode: string;
  productCode: string;
  productName: string;
  version: string;
  revision: number;
  status: 'current' | 'previous' | 'draft' | 'obsolete';
  totalComponents: number;
  totalCost: number;
  laborCost: number;
  totalMfgCost: number;
  costChange: number;
  costChangePercent: number;
  changeReason: string;
  changedBy: string;
  changeDate: string;
  approvedBy: string;
  approvedDate: string;
  effectiveFrom: string;
  effectiveTo: string;
  notes: string;
}

export default function BOMVersionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'current' | 'previous' | 'draft' | 'obsolete'>('all');

  const versions: BOMVersion[] = [
    {
      id: '1',
      bomCode: 'BOM-KIT-001',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      version: 'v2.1',
      revision: 3,
      status: 'current',
      totalComponents: 24,
      totalCost: 8450,
      laborCost: 1850,
      totalMfgCost: 11250,
      costChange: -580,
      costChangePercent: -4.9,
      changeReason: 'Supplier negotiation - reduced SS sheet cost',
      changedBy: 'Rajesh Kumar',
      changeDate: '2025-09-20',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-22',
      effectiveFrom: '2025-09-25',
      effectiveTo: '2026-09-25',
      notes: 'Cost optimization without quality compromise'
    },
    {
      id: '2',
      bomCode: 'BOM-KIT-001',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      version: 'v2.0',
      revision: 2,
      status: 'previous',
      totalComponents: 24,
      totalCost: 9030,
      laborCost: 1850,
      totalMfgCost: 11830,
      costChange: 320,
      costChangePercent: 2.8,
      changeReason: 'Added premium gasket material for better seal',
      changedBy: 'Priya Sharma',
      changeDate: '2025-06-10',
      approvedBy: 'Production Manager',
      approvedDate: '2025-06-12',
      effectiveFrom: '2025-06-15',
      effectiveTo: '2025-09-24',
      notes: 'Quality improvement based on customer feedback'
    },
    {
      id: '3',
      bomCode: 'BOM-KIT-001',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      version: 'v1.5',
      revision: 1,
      status: 'previous',
      totalComponents: 22,
      totalCost: 8710,
      laborCost: 1700,
      totalMfgCost: 11510,
      costChange: 0,
      costChangePercent: 0,
      changeReason: 'Initial production version',
      changedBy: 'Amit Patel',
      changeDate: '2024-12-01',
      approvedBy: 'Production Manager',
      approvedDate: '2024-12-03',
      effectiveFrom: '2024-12-05',
      effectiveTo: '2025-06-14',
      notes: 'First mass production BOM'
    },
    {
      id: '4',
      bomCode: 'BOM-KIT-004',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      version: 'v3.0',
      revision: 5,
      status: 'current',
      totalComponents: 42,
      totalCost: 28500,
      laborCost: 5500,
      totalMfgCost: 36850,
      costChange: 1850,
      costChangePercent: 5.3,
      changeReason: 'Upgraded motor to higher efficiency model',
      changedBy: 'Suresh Reddy',
      changeDate: '2025-07-10',
      approvedBy: 'Production Manager',
      approvedDate: '2025-07-15',
      effectiveFrom: '2025-07-20',
      effectiveTo: '2026-07-20',
      notes: 'Performance upgrade - better suction power'
    },
    {
      id: '5',
      bomCode: 'BOM-KIT-004',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      version: 'v2.8',
      revision: 4,
      status: 'previous',
      totalComponents: 40,
      totalCost: 27100,
      laborCost: 5150,
      totalMfgCost: 35000,
      costChange: -950,
      costChangePercent: -2.6,
      changeReason: 'Optimized filter assembly process',
      changedBy: 'Vikram Singh',
      changeDate: '2025-04-15',
      approvedBy: 'Production Manager',
      approvedDate: '2025-04-18',
      effectiveFrom: '2025-04-22',
      effectiveTo: '2025-07-19',
      notes: 'Labor cost reduction through process improvement'
    },
    {
      id: '6',
      bomCode: 'BOM-KIT-005',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      version: 'v2.0',
      revision: 4,
      status: 'current',
      totalComponents: 38,
      totalCost: 15800,
      laborCost: 3800,
      totalMfgCost: 21500,
      costChange: 780,
      costChangePercent: 3.8,
      changeReason: 'Switched to soft-close drawer mechanism',
      changedBy: 'Neha Gupta',
      changeDate: '2025-09-05',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-10',
      effectiveFrom: '2025-09-15',
      effectiveTo: '2026-09-15',
      notes: 'Premium feature addition for market differentiation'
    },
    {
      id: '7',
      bomCode: 'BOM-KIT-005',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      version: 'v1.8',
      revision: 3,
      status: 'previous',
      totalComponents: 36,
      totalCost: 15250,
      laborCost: 3570,
      totalMfgCost: 20720,
      costChange: 420,
      costChangePercent: 2.1,
      changeReason: 'Added moisture-resistant plywood',
      changedBy: 'Arun Kumar',
      changeDate: '2025-05-20',
      approvedBy: 'Production Manager',
      approvedDate: '2025-05-23',
      effectiveFrom: '2025-05-28',
      effectiveTo: '2025-09-14',
      notes: 'Durability improvement for humid environments'
    },
    {
      id: '8',
      bomCode: 'BOM-KIT-002',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      version: 'v1.5',
      revision: 2,
      status: 'current',
      totalComponents: 18,
      totalCost: 3250,
      laborCost: 850,
      totalMfgCost: 4520,
      costChange: 180,
      costChangePercent: 4.1,
      changeReason: 'Upgraded ceramic cartridge to premium brand',
      changedBy: 'Priya Sharma',
      changeDate: '2025-08-15',
      approvedBy: 'Production Manager',
      approvedDate: '2025-08-18',
      effectiveFrom: '2025-08-20',
      effectiveTo: '2026-08-20',
      notes: 'Extended warranty support - better quality components'
    },
    {
      id: '9',
      bomCode: 'BOM-KIT-002',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      version: 'v1.2',
      revision: 1,
      status: 'previous',
      totalComponents: 17,
      totalCost: 3070,
      laborCost: 820,
      totalMfgCost: 4340,
      costChange: -120,
      costChangePercent: -2.7,
      changeReason: 'Simplified hose assembly design',
      changedBy: 'Meera Iyer',
      changeDate: '2025-03-12',
      approvedBy: 'Production Manager',
      approvedDate: '2025-03-15',
      effectiveFrom: '2025-03-18',
      effectiveTo: '2025-08-19',
      notes: 'Ease of assembly improvement'
    },
    {
      id: '10',
      bomCode: 'BOM-KIT-003',
      productCode: 'KIT-SINK-002',
      productName: 'Granite Composite Sink - Single Bowl',
      version: 'v1.0',
      revision: 1,
      status: 'draft',
      totalComponents: 15,
      totalCost: 12500,
      laborCost: 2200,
      totalMfgCost: 15800,
      costChange: 0,
      costChangePercent: 0,
      changeReason: 'New product launch - first version',
      changedBy: 'Amit Patel',
      changeDate: '2025-10-01',
      approvedBy: '',
      approvedDate: '',
      effectiveFrom: '',
      effectiveTo: '',
      notes: 'Awaiting final approval for production release'
    },
    {
      id: '11',
      bomCode: 'BOM-KIT-007',
      productCode: 'KIT-COOK-001',
      productName: 'Professional Cookware Set - 7 Piece',
      version: 'v1.8',
      revision: 3,
      status: 'current',
      totalComponents: 28,
      totalCost: 6800,
      laborCost: 1400,
      totalMfgCost: 8880,
      costChange: -320,
      costChangePercent: -3.5,
      changeReason: 'Bulk purchase discount on aluminum sheets',
      changedBy: 'Arun Kumar',
      changeDate: '2025-09-12',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-15',
      effectiveFrom: '2025-09-18',
      effectiveTo: '2026-09-18',
      notes: 'Annual supplier contract renewal benefits'
    },
    {
      id: '12',
      bomCode: 'BOM-KIT-011',
      productCode: 'KIT-CAB-002',
      productName: 'Wall Cabinet - Glass Door Double',
      version: 'v1.0',
      revision: 0,
      status: 'obsolete',
      totalComponents: 20,
      totalCost: 8900,
      laborCost: 2200,
      totalMfgCost: 12200,
      costChange: 0,
      costChangePercent: 0,
      changeReason: 'Product discontinued - replaced by new model',
      changedBy: 'Arjun Menon',
      changeDate: '2023-11-05',
      approvedBy: 'Production Manager',
      approvedDate: '2023-11-10',
      effectiveFrom: '2023-11-15',
      effectiveTo: '2024-12-31',
      notes: 'End of life - inventory clearance completed'
    }
  ];

  const products = ['all', ...Array.from(new Set(versions.map(v => v.productCode)))];

  const filteredVersions = versions.filter(version => {
    const matchesSearch =
      version.bomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.version.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProduct = filterProduct === 'all' || version.productCode === filterProduct;
    const matchesStatus = filterStatus === 'all' || version.status === filterStatus;

    return matchesSearch && matchesProduct && matchesStatus;
  });

  // Modal state hooks
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<BOMVersion | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      current: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      previous: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: FileText },
      obsolete: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getCostChangeIndicator = (change: number, changePercent: number) => {
    if (change === 0) {
      return <span className="text-gray-500 text-sm">No change</span>;
    }
    const isIncrease = change > 0;
    return (
      <div className={`flex items-center gap-1 ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
        {isIncrease ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {isIncrease ? '+' : ''}₹{Math.abs(change).toLocaleString()} ({isIncrease ? '+' : ''}{changePercent.toFixed(1)}%)
        </span>
      </div>
    );
  };

  // Summary stats
  const currentVersions = versions.filter(v => v.status === 'current').length;
  const totalVersions = versions.length;
  const avgRevisionsPerProduct = versions.reduce((sum, v) => sum + v.revision, 0) / totalVersions;

  // Convert BOMVersion to ModalBOMVersion format
  const convertToModalVersion = (version: BOMVersion): ModalBOMVersion => ({
    id: version.id,
    versionNumber: version.version,
    revisionNumber: version.revision.toString(),
    status: version.status as 'current' | 'previous' | 'obsolete',
    effectiveFrom: version.effectiveFrom,
    effectiveUntil: version.effectiveTo,
    changeReason: version.changeReason,
    changedBy: version.changedBy,
    changedDate: version.changeDate,
    approvedBy: version.approvedBy,
    approvalDate: version.approvedDate,
    totalCost: version.totalMfgCost,
    previousCost: version.totalMfgCost + version.costChange,
    componentCount: version.totalComponents,
    notes: version.notes,
    productId: version.productCode,
    productName: version.productName
  });

  // Handler functions
  const handleView = (version: BOMVersion) => {
    setSelectedVersion(version);
    setIsViewOpen(true);
  };

  const handleEdit = (version: BOMVersion) => {
    setSelectedVersion(version);
    setIsEditOpen(true);
  };

  const handleCreateVersion = (version: BOMVersion) => {
    setSelectedVersion(version);
    setIsCreateOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
  };

  const handleEditSubmit = (data: Partial<ModalBOMVersion>) => {
    // TODO: Implement API call to update version
    console.log('Edit version data:', data);
    setIsEditOpen(false);
  };

  const handleCreateVersionSubmit = (data: Partial<ModalBOMVersion>) => {
    // TODO: Implement API call to create new version
    console.log('Create version data:', data);
    setIsCreateOpen(false);
  };

  return (
    <div className="w-full px-3 py-2">
      {/* Inline Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BOM Version History</h1>
            <p className="text-sm text-gray-600">Track BOM changes and version evolution</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/production/bom/comparison')}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <GitBranch className="h-4 w-4" />
            Compare Versions
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Versions</span>
            <GitBranch className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalVersions}</div>
          <div className="text-xs text-blue-700 mt-1">All products</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Current Versions</span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{currentVersions}</div>
          <div className="text-xs text-green-700 mt-1">Active in production</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Avg Revisions</span>
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{avgRevisionsPerProduct.toFixed(1)}</div>
          <div className="text-xs text-purple-700 mt-1">Per product</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Draft Versions</span>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {versions.filter(v => v.status === 'draft').length}
          </div>
          <div className="text-xs text-orange-700 mt-1">Pending approval</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search versions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {products.map(prod => (
              <option key={prod} value={prod}>{prod === 'all' ? 'All Products' : prod}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="current">Current</option>
            <option value="previous">Previous</option>
            <option value="draft">Draft</option>
            <option value="obsolete">Obsolete</option>
          </select>
        </div>
      </div>

      {/* Versions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Components
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mfg Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Change
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Period
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
              {filteredVersions.map((version) => {
                const statusInfo = getStatusBadge(version.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{version.productName}</div>
                        <div className="text-xs text-gray-500">{version.productCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{version.version}</div>
                        <div className="text-xs text-gray-500">Rev {version.revision}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{version.totalComponents}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{version.totalMfgCost.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      {getCostChangeIndicator(version.costChange, version.costChangePercent)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">{version.changeReason}</div>
                    </td>
                    <td className="px-4 py-4">
                      {version.effectiveFrom ? (
                        <div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {version.effectiveFrom}
                          </div>
                          <div className="text-xs text-gray-500">to {version.effectiveTo}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {version.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleView(version)}
                          title="View version details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {version.status === 'current' && (
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => handleEdit(version)}
                            title="Edit version"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          onClick={() => handleCreateVersion(version)}
                          title="Create new version"
                        >
                          <Copy className="h-4 w-4" />
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
        Showing {filteredVersions.length} of {totalVersions} versions
      </div>

      {/* Modals */}
      <ViewVersionDetailsModal
        isOpen={isViewOpen}
        onClose={handleViewClose}
        version={selectedVersion ? convertToModalVersion(selectedVersion) : null}
        onEdit={(version) => {
          const originalVersion = versions.find(v => v.id === version.id);
          if (originalVersion) handleEdit(originalVersion);
        }}
      />

      <EditVersionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSubmit}
        version={selectedVersion ? convertToModalVersion(selectedVersion) : null}
      />

      <CreateVersionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateVersionSubmit}
        sourceVersion={selectedVersion ? convertToModalVersion(selectedVersion) : null}
      />
    </div>
  );
}
