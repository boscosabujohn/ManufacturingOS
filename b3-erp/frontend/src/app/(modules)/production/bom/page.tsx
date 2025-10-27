'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Package,
  Layers,
  TrendingUp,
  Calendar,
  Edit2,
  Copy,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileWarning
} from 'lucide-react';

interface BOM {
  id: string;
  bomCode: string;
  productCode: string;
  productName: string;
  category: string;
  version: string;
  revision: number;
  levels: number;
  totalComponents: number;
  totalCost: number;
  laborCost: number;
  overheadCost: number;
  totalMfgCost: number;
  status: 'active' | 'draft' | 'pending-approval' | 'obsolete';
  createdBy: string;
  createdDate: string;
  lastModified: string;
  approvedBy: string;
  approvedDate: string;
  effectiveFrom: string;
  effectiveTo: string;
}

export default function BOMPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'pending-approval' | 'obsolete'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const boms: BOM[] = [
    {
      id: '1',
      bomCode: 'BOM-KIT-001',
      productCode: 'KIT-SINK-001',
      productName: 'Premium SS304 Kitchen Sink - Double Bowl',
      category: 'Kitchen Sinks',
      version: 'v2.1',
      revision: 3,
      levels: 3,
      totalComponents: 24,
      totalCost: 8450,
      laborCost: 1850,
      overheadCost: 950,
      totalMfgCost: 11250,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-03-15',
      lastModified: '2025-09-20',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-22',
      effectiveFrom: '2025-09-25',
      effectiveTo: '2026-09-25'
    },
    {
      id: '2',
      bomCode: 'BOM-KIT-002',
      productCode: 'KIT-FAUC-001',
      productName: 'Chrome Finish Kitchen Faucet - Single Lever',
      category: 'Kitchen Faucets',
      version: 'v1.5',
      revision: 2,
      levels: 2,
      totalComponents: 18,
      totalCost: 3250,
      laborCost: 850,
      overheadCost: 420,
      totalMfgCost: 4520,
      status: 'active',
      createdBy: 'Priya Sharma',
      createdDate: '2024-05-10',
      lastModified: '2025-08-15',
      approvedBy: 'Production Manager',
      approvedDate: '2025-08-18',
      effectiveFrom: '2025-08-20',
      effectiveTo: '2026-08-20'
    },
    {
      id: '3',
      bomCode: 'BOM-KIT-003',
      productCode: 'KIT-SINK-002',
      productName: 'Granite Composite Sink - Single Bowl',
      category: 'Kitchen Sinks',
      version: 'v1.0',
      revision: 1,
      levels: 2,
      totalComponents: 15,
      totalCost: 12500,
      laborCost: 2200,
      overheadCost: 1100,
      totalMfgCost: 15800,
      status: 'pending-approval',
      createdBy: 'Amit Patel',
      createdDate: '2025-10-01',
      lastModified: '2025-10-15',
      approvedBy: '',
      approvedDate: '',
      effectiveFrom: '',
      effectiveTo: ''
    },
    {
      id: '4',
      bomCode: 'BOM-KIT-004',
      productCode: 'KIT-APPL-001',
      productName: 'Auto-Clean Kitchen Chimney - 90cm',
      category: 'Kitchen Appliances',
      version: 'v3.0',
      revision: 5,
      levels: 4,
      totalComponents: 42,
      totalCost: 28500,
      laborCost: 5500,
      overheadCost: 2850,
      totalMfgCost: 36850,
      status: 'active',
      createdBy: 'Suresh Reddy',
      createdDate: '2024-01-20',
      lastModified: '2025-07-10',
      approvedBy: 'Production Manager',
      approvedDate: '2025-07-15',
      effectiveFrom: '2025-07-20',
      effectiveTo: '2026-07-20'
    },
    {
      id: '5',
      bomCode: 'BOM-KIT-005',
      productCode: 'KIT-CAB-001',
      productName: 'Modular Base Cabinet - 3 Drawer',
      category: 'Kitchen Cabinets',
      version: 'v2.0',
      revision: 4,
      levels: 3,
      totalComponents: 38,
      totalCost: 15800,
      laborCost: 3800,
      overheadCost: 1900,
      totalMfgCost: 21500,
      status: 'active',
      createdBy: 'Vikram Singh',
      createdDate: '2024-04-12',
      lastModified: '2025-09-05',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-10',
      effectiveFrom: '2025-09-15',
      effectiveTo: '2026-09-15'
    },
    {
      id: '6',
      bomCode: 'BOM-KIT-006',
      productCode: 'KIT-COUNT-001',
      productName: 'Granite Countertop - Premium Black Galaxy',
      category: 'Countertops',
      version: 'v1.2',
      revision: 2,
      levels: 2,
      totalComponents: 12,
      totalCost: 18500,
      laborCost: 4200,
      overheadCost: 2100,
      totalMfgCost: 24800,
      status: 'active',
      createdBy: 'Neha Gupta',
      createdDate: '2024-06-18',
      lastModified: '2025-08-22',
      approvedBy: 'Production Manager',
      approvedDate: '2025-08-25',
      effectiveFrom: '2025-09-01',
      effectiveTo: '2026-09-01'
    },
    {
      id: '7',
      bomCode: 'BOM-KIT-007',
      productCode: 'KIT-COOK-001',
      productName: 'Professional Cookware Set - 7 Piece',
      category: 'Cookware',
      version: 'v1.8',
      revision: 3,
      levels: 2,
      totalComponents: 28,
      totalCost: 6800,
      laborCost: 1400,
      overheadCost: 680,
      totalMfgCost: 8880,
      status: 'active',
      createdBy: 'Arun Kumar',
      createdDate: '2024-07-22',
      lastModified: '2025-09-12',
      approvedBy: 'Production Manager',
      approvedDate: '2025-09-15',
      effectiveFrom: '2025-09-18',
      effectiveTo: '2026-09-18'
    },
    {
      id: '8',
      bomCode: 'BOM-KIT-008',
      productCode: 'KIT-FAUC-002',
      productName: 'Pull-Down Kitchen Faucet - Brushed Nickel',
      category: 'Kitchen Faucets',
      version: 'v1.0',
      revision: 0,
      levels: 2,
      totalComponents: 22,
      totalCost: 4500,
      laborCost: 980,
      overheadCost: 490,
      totalMfgCost: 5970,
      status: 'draft',
      createdBy: 'Meera Iyer',
      createdDate: '2025-10-10',
      lastModified: '2025-10-18',
      approvedBy: '',
      approvedDate: '',
      effectiveFrom: '',
      effectiveTo: ''
    },
    {
      id: '9',
      bomCode: 'BOM-KIT-009',
      productCode: 'KIT-SINK-003',
      productName: 'Undermount SS Sink - Single Bowl Large',
      category: 'Kitchen Sinks',
      version: 'v2.5',
      revision: 6,
      levels: 3,
      totalComponents: 26,
      totalCost: 9200,
      laborCost: 2100,
      overheadCost: 1050,
      totalMfgCost: 12350,
      status: 'active',
      createdBy: 'Rajesh Kumar',
      createdDate: '2024-02-08',
      lastModified: '2025-10-05',
      approvedBy: 'Production Manager',
      approvedDate: '2025-10-08',
      effectiveFrom: '2025-10-12',
      effectiveTo: '2026-10-12'
    },
    {
      id: '10',
      bomCode: 'BOM-KIT-010',
      productCode: 'KIT-APPL-002',
      productName: 'Built-in Microwave Oven - 30L',
      category: 'Kitchen Appliances',
      version: 'v1.3',
      revision: 2,
      levels: 3,
      totalComponents: 35,
      totalCost: 18900,
      laborCost: 3800,
      overheadCost: 1900,
      totalMfgCost: 24600,
      status: 'active',
      createdBy: 'Kavita Desai',
      createdDate: '2024-08-14',
      lastModified: '2025-09-28',
      approvedBy: 'Production Manager',
      approvedDate: '2025-10-01',
      effectiveFrom: '2025-10-05',
      effectiveTo: '2026-10-05'
    },
    {
      id: '11',
      bomCode: 'BOM-KIT-011',
      productCode: 'KIT-CAB-002',
      productName: 'Wall Cabinet - Glass Door Double',
      category: 'Kitchen Cabinets',
      version: 'v1.0',
      revision: 0,
      levels: 2,
      totalComponents: 20,
      totalCost: 8900,
      laborCost: 2200,
      overheadCost: 1100,
      totalMfgCost: 12200,
      status: 'obsolete',
      createdBy: 'Arjun Menon',
      createdDate: '2023-11-05',
      lastModified: '2024-12-15',
      approvedBy: 'Production Manager',
      approvedDate: '2023-11-10',
      effectiveFrom: '2023-11-15',
      effectiveTo: '2024-12-31'
    },
    {
      id: '12',
      bomCode: 'BOM-KIT-012',
      productCode: 'KIT-ACC-001',
      productName: 'Modular Kitchen Organizer Set - Premium',
      category: 'Kitchen Accessories',
      version: 'v1.1',
      revision: 1,
      levels: 2,
      totalComponents: 16,
      totalCost: 3800,
      laborCost: 750,
      overheadCost: 380,
      totalMfgCost: 4930,
      status: 'active',
      createdBy: 'Pooja Nair',
      createdDate: '2024-09-20',
      lastModified: '2025-10-10',
      approvedBy: 'Production Manager',
      approvedDate: '2025-10-12',
      effectiveFrom: '2025-10-15',
      effectiveTo: '2026-10-15'
    }
  ];

  const categories = ['all', ...Array.from(new Set(boms.map(b => b.category)))];

  const filteredBOMs = boms.filter(bom => {
    const matchesSearch =
      bom.bomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || bom.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || bom.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      'pending-approval': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      obsolete: { color: 'bg-red-100 text-red-800', icon: FileWarning }
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  // Summary stats
  const totalBOMs = boms.length;
  const activeBOMs = boms.filter(b => b.status === 'active').length;
  const avgComponents = Math.round(boms.reduce((sum, b) => sum + b.totalComponents, 0) / totalBOMs);
  const totalMfgValue = boms.filter(b => b.status === 'active').reduce((sum, b) => sum + b.totalMfgCost, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Bill of Materials (BOM)</h1>
            <p className="text-sm text-gray-600">Manage product BOMs and component structures</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/production/bom/multi-level')}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Layers className="h-4 w-4" />
            Multi-Level View
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New BOM
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total BOMs</span>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalBOMs}</div>
          <div className="text-xs text-blue-700 mt-1">{activeBOMs} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Avg Components</span>
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{avgComponents}</div>
          <div className="text-xs text-green-700 mt-1">Per BOM</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Mfg Cost</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">₹{(totalMfgValue / 100000).toFixed(1)}L</div>
          <div className="text-xs text-purple-700 mt-1">Active BOMs</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Pending</span>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {boms.filter(b => b.status === 'pending-approval' || b.status === 'draft').length}
          </div>
          <div className="text-xs text-orange-700 mt-1">Approval needed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search BOMs..."
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
            <option value="pending-approval">Pending Approval</option>
            <option value="obsolete">Obsolete</option>
          </select>
        </div>
      </div>

      {/* BOMs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BOM Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Structure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labor Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Mfg Cost
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
              {filteredBOMs.map((bom) => {
                const statusInfo = getStatusBadge(bom.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={bom.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bom.bomCode}</div>
                        <div className="text-xs text-gray-500">{bom.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bom.productName}</div>
                        <div className="text-xs text-gray-500">{bom.productCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bom.version}</div>
                        <div className="text-xs text-gray-500">Rev {bom.revision}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bom.levels} levels</div>
                        <div className="text-xs text-gray-500">{bom.totalComponents} components</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{bom.totalCost.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{bom.laborCost.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-blue-900">₹{bom.totalMfgCost.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {bom.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/production/bom/${bom.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                         
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                         
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                         
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
        Showing {filteredBOMs.length} of {totalBOMs} BOMs
      </div>
    </div>
  );
}
