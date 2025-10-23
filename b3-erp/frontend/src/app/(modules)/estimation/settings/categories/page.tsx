'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Save,
  X,
  Folder,
  FolderOpen,
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface EstimationCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategory: string;
  level: number;
  description: string;
  defaultMarkup: number;
  minimumOrderValue: number;
  standardLeadTime: number;
  costAllocationMethod: 'direct' | 'proportional' | 'weighted';
  allowSubcategories: boolean;
  requiresApproval: boolean;
  approvalThreshold: number;
  estimateCount: number;
  totalValue: number;
  avgEstimateValue: number;
  lastUsed: string;
  createdBy: string;
  createdDate: string;
  status: 'active' | 'inactive';
}

export default function EstimationCategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories: EstimationCategory[] = [
    {
      id: '1',
      categoryCode: 'KIT-SINK',
      categoryName: 'Kitchen Sinks',
      parentCategory: '-',
      level: 1,
      description: 'All types of kitchen sinks including SS, granite, and composite',
      defaultMarkup: 48.5,
      minimumOrderValue: 5000,
      standardLeadTime: 7,
      costAllocationMethod: 'direct',
      allowSubcategories: true,
      requiresApproval: true,
      approvalThreshold: 50000,
      estimateCount: 142,
      totalValue: 8950000,
      avgEstimateValue: 63028,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      categoryCode: 'KIT-SINK-SS',
      categoryName: 'Stainless Steel Sinks',
      parentCategory: 'Kitchen Sinks',
      level: 2,
      description: 'SS304 and SS316 grade kitchen sinks',
      defaultMarkup: 46.0,
      minimumOrderValue: 3500,
      standardLeadTime: 5,
      costAllocationMethod: 'direct',
      allowSubcategories: false,
      requiresApproval: true,
      approvalThreshold: 35000,
      estimateCount: 95,
      totalValue: 5425000,
      avgEstimateValue: 57105,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '3',
      categoryCode: 'KIT-SINK-GRA',
      categoryName: 'Granite Sinks',
      parentCategory: 'Kitchen Sinks',
      level: 2,
      description: 'Granite composite kitchen sinks',
      defaultMarkup: 52.0,
      minimumOrderValue: 8000,
      standardLeadTime: 10,
      costAllocationMethod: 'direct',
      allowSubcategories: false,
      requiresApproval: true,
      approvalThreshold: 60000,
      estimateCount: 47,
      totalValue: 3525000,
      avgEstimateValue: 75000,
      lastUsed: '2025-10-18',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '4',
      categoryCode: 'KIT-FAUC',
      categoryName: 'Kitchen Faucets',
      parentCategory: '-',
      level: 1,
      description: 'Kitchen faucets and tap systems',
      defaultMarkup: 50.6,
      minimumOrderValue: 2000,
      standardLeadTime: 5,
      costAllocationMethod: 'direct',
      allowSubcategories: true,
      requiresApproval: true,
      approvalThreshold: 25000,
      estimateCount: 156,
      totalValue: 4680000,
      avgEstimateValue: 30000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '5',
      categoryCode: 'KIT-COOK',
      categoryName: 'Cookware',
      parentCategory: '-',
      level: 1,
      description: 'Professional and premium cookware sets',
      defaultMarkup: 44.2,
      minimumOrderValue: 3000,
      standardLeadTime: 3,
      costAllocationMethod: 'proportional',
      allowSubcategories: true,
      requiresApproval: false,
      approvalThreshold: 0,
      estimateCount: 89,
      totalValue: 3560000,
      avgEstimateValue: 40000,
      lastUsed: '2025-10-17',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '6',
      categoryCode: 'KIT-APPL',
      categoryName: 'Kitchen Appliances',
      parentCategory: '-',
      level: 1,
      description: 'Built-in and standalone kitchen appliances',
      defaultMarkup: 38.5,
      minimumOrderValue: 15000,
      standardLeadTime: 14,
      costAllocationMethod: 'direct',
      allowSubcategories: true,
      requiresApproval: true,
      approvalThreshold: 100000,
      estimateCount: 124,
      totalValue: 18600000,
      avgEstimateValue: 150000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '7',
      categoryCode: 'KIT-APPL-CHI',
      categoryName: 'Kitchen Chimneys',
      parentCategory: 'Kitchen Appliances',
      level: 2,
      description: 'Auto-clean and filterless kitchen chimneys',
      defaultMarkup: 36.0,
      minimumOrderValue: 12000,
      standardLeadTime: 10,
      costAllocationMethod: 'direct',
      allowSubcategories: false,
      requiresApproval: true,
      approvalThreshold: 75000,
      estimateCount: 78,
      totalValue: 11700000,
      avgEstimateValue: 150000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-02-10',
      status: 'active'
    },
    {
      id: '8',
      categoryCode: 'KIT-CAB',
      categoryName: 'Kitchen Cabinets',
      parentCategory: '-',
      level: 1,
      description: 'Modular kitchen cabinets and storage systems',
      defaultMarkup: 55.8,
      minimumOrderValue: 25000,
      standardLeadTime: 21,
      costAllocationMethod: 'weighted',
      allowSubcategories: true,
      requiresApproval: true,
      approvalThreshold: 150000,
      estimateCount: 167,
      totalValue: 33400000,
      avgEstimateValue: 200000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '9',
      categoryCode: 'KIT-COUNT',
      categoryName: 'Countertops',
      parentCategory: '-',
      level: 1,
      description: 'Granite, quartz, and solid surface countertops',
      defaultMarkup: 48.0,
      minimumOrderValue: 20000,
      standardLeadTime: 14,
      costAllocationMethod: 'direct',
      allowSubcategories: true,
      requiresApproval: true,
      approvalThreshold: 100000,
      estimateCount: 134,
      totalValue: 20100000,
      avgEstimateValue: 150000,
      lastUsed: '2025-10-18',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '10',
      categoryCode: 'KIT-ACC',
      categoryName: 'Kitchen Accessories',
      parentCategory: '-',
      level: 1,
      description: 'Kitchen accessories, organizers, and fittings',
      defaultMarkup: 52.5,
      minimumOrderValue: 1000,
      standardLeadTime: 3,
      costAllocationMethod: 'proportional',
      allowSubcategories: true,
      requiresApproval: false,
      approvalThreshold: 0,
      estimateCount: 198,
      totalValue: 5940000,
      avgEstimateValue: 30000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '11',
      categoryCode: 'KIT-FINISH',
      categoryName: 'Finishing Materials',
      parentCategory: '-',
      level: 1,
      description: 'Paint, polish, plating, and finishing materials',
      defaultMarkup: 42.0,
      minimumOrderValue: 2000,
      standardLeadTime: 5,
      costAllocationMethod: 'proportional',
      allowSubcategories: true,
      requiresApproval: false,
      approvalThreshold: 0,
      estimateCount: 145,
      totalValue: 4350000,
      avgEstimateValue: 30000,
      lastUsed: '2025-10-19',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '12',
      categoryCode: 'KIT-INSTALL',
      categoryName: 'Installation Services',
      parentCategory: '-',
      level: 1,
      description: 'Kitchen installation and fitting services',
      defaultMarkup: 35.0,
      minimumOrderValue: 5000,
      standardLeadTime: 7,
      costAllocationMethod: 'direct',
      allowSubcategories: false,
      requiresApproval: true,
      approvalThreshold: 50000,
      estimateCount: 112,
      totalValue: 5600000,
      avgEstimateValue: 50000,
      lastUsed: '2025-10-18',
      createdBy: 'Admin',
      createdDate: '2024-01-20',
      status: 'active'
    }
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || category.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
    // Save logic would go here
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const getCostAllocationBadge = (method: string) => {
    const colors = {
      direct: 'bg-blue-100 text-blue-800',
      proportional: 'bg-purple-100 text-purple-800',
      weighted: 'bg-orange-100 text-orange-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLevelIcon = (level: number) => {
    return level === 1 ? <Folder className="h-4 w-4" /> : <FolderOpen className="h-4 w-4" />;
  };

  // Summary stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const totalEstimates = categories.reduce((sum, c) => sum + c.estimateCount, 0);
  const totalValue = categories.reduce((sum, c) => sum + c.totalValue, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Estimation Categories</h1>
            <p className="text-sm text-gray-600">Configure product categories and estimation rules</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Total Categories</span>
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalCategories}</div>
          <div className="text-xs text-blue-700 mt-1">{activeCategories} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Total Estimates</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{totalEstimates.toLocaleString()}</div>
          <div className="text-xs text-green-700 mt-1">All categories</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Total Value</span>
            <IndianRupee className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">₹{(totalValue / 10000000).toFixed(1)}Cr</div>
          <div className="text-xs text-purple-700 mt-1">Cumulative</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-900">Avg Estimate</span>
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">₹{(totalValue / totalEstimates / 1000).toFixed(0)}K</div>
          <div className="text-xs text-orange-700 mt-1">Per estimate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Markup
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
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
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={category.level === 1 ? 'text-gray-700' : 'text-gray-500 ml-6'}>
                        {getLevelIcon(category.level)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                        <div className="text-xs text-gray-500">{category.categoryCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{category.parentCategory}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{category.defaultMarkup.toFixed(1)}%</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">₹{category.minimumOrderValue.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{category.standardLeadTime} days</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCostAllocationBadge(category.costAllocationMethod)}`}>
                      {category.costAllocationMethod}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {category.requiresApproval ? (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-orange-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Required
                        </div>
                        <div className="text-xs text-gray-500">&gt;₹{(category.approvalThreshold / 1000).toFixed(0)}K</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <XCircle className="h-3 w-3" />
                        Not required
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.estimateCount}</div>
                      <div className="text-xs text-gray-500">₹{(category.totalValue / 100000).toFixed(1)}L</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {editingId === category.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm"
                        >
                          <Save className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          <X className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700">Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(category.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCategories.length} of {totalCategories} categories
      </div>
    </div>
  );
}
