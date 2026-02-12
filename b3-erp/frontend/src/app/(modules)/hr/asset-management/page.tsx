'use client';

import React, { useState, useEffect } from 'react';
import {
  Package, Monitor, Car, Wrench, Warehouse, FileText,
  Plus, Search, Filter, ChevronRight, AlertCircle,
  CheckCircle, Clock, XCircle, ArrowRight, ArrowLeftRight,
  Clipboard, BarChart3, Settings, Users, Building2
} from 'lucide-react';
import {
  AssetManagementService,
  HRAssetStatus,
  HRAssetCondition,
  AssetCategoryType,
  RequestStatus,
  MaintenanceStatus,
  type HRAsset,
  type AssetCategory,
  type AssetAllocation,
  type AssetRequest,
  type MaintenanceRequest,
  type AMCContract,
  type StockAudit,
  type AssetDashboardStats,
} from '@/services/asset-management.service';

// ============================================================================
// Types
// ============================================================================

type MainTab = 'allocation' | 'maintenance' | 'inventory' | 'reports';
type AllocationSubTab = 'it_assets' | 'office_assets' | 'vehicles' | 'requests' | 'transfer' | 'return';
type MaintenanceSubTab = 'service_requests' | 'preventive' | 'amc' | 'history';
type InventorySubTab = 'stock' | 'requests' | 'allocation' | 'audit';
type ReportsSubTab = 'register' | 'allocation_report' | 'employee_assets' | 'department_assets' | 'maintenance_costs';

// ============================================================================
// Dashboard Component
// ============================================================================

function AssetDashboard({ stats }: { stats: AssetDashboardStats | null }) {
  if (!stats) return <div className="text-center py-8 text-gray-500">Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Assets', value: stats.totalAssets, icon: Package, color: 'blue' },
    { label: 'Available', value: stats.assetsByStatus.available || 0, icon: CheckCircle, color: 'green' },
    { label: 'Allocated', value: stats.assetsByStatus.allocated || 0, icon: Users, color: 'purple' },
    { label: 'In Maintenance', value: stats.assetsByStatus.maintenance || 0, icon: Wrench, color: 'orange' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'yellow' },
    { label: 'Pending Maintenance', value: stats.pendingMaintenance, icon: AlertCircle, color: 'red' },
    { label: 'Expiring Warranties', value: stats.expiringWarranties, icon: AlertCircle, color: 'amber' },
    { label: 'Expiring AMCs', value: stats.expiringAMCs, icon: FileText, color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {stats.recentAllocations.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Allocations</h3>
          <div className="space-y-3">
            {stats.recentAllocations.slice(0, 5).map((allocation) => (
              <div key={allocation.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white font-medium">{allocation.employeeName}</p>
                  <p className="text-sm text-gray-400">{allocation.allocationNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">{allocation.allocatedDate}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    allocation.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {allocation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Asset List Component
// ============================================================================

function AssetList({ categoryType, assets }: { categoryType: AssetCategoryType; assets: HRAsset[] }) {
  const getStatusColor = (status: HRAssetStatus) => {
    switch (status) {
      case HRAssetStatus.AVAILABLE: return 'bg-green-900 text-green-300';
      case HRAssetStatus.ALLOCATED: return 'bg-blue-900 text-blue-300';
      case HRAssetStatus.MAINTENANCE: return 'bg-orange-900 text-orange-300';
      case HRAssetStatus.RETIRED: return 'bg-gray-700 text-gray-300';
      case HRAssetStatus.DISPOSED: return 'bg-red-900 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getConditionColor = (condition: HRAssetCondition) => {
    switch (condition) {
      case HRAssetCondition.NEW: return 'text-green-400';
      case HRAssetCondition.GOOD: return 'text-blue-400';
      case HRAssetCondition.FAIR: return 'text-yellow-400';
      case HRAssetCondition.POOR: return 'text-orange-400';
      case HRAssetCondition.DAMAGED: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white capitalize">
          {categoryType.replace('_', ' ')}
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Asset Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Brand/Model</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Condition</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No assets found in this category
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <span className="text-blue-400 font-mono text-sm">{asset.assetCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{asset.assetName}</p>
                      {asset.assetTag && <p className="text-xs text-gray-500">{asset.assetTag}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {asset.brand} {asset.model}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {asset.currentEmployeeName || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Asset Requests Component
// ============================================================================

function AssetRequests({ requests }: { requests: AssetRequest[] }) {
  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'bg-yellow-900 text-yellow-300';
      case RequestStatus.APPROVED: return 'bg-green-900 text-green-300';
      case RequestStatus.REJECTED: return 'bg-red-900 text-red-300';
      case RequestStatus.FULFILLED: return 'bg-blue-900 text-blue-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Asset Requests</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Request #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">
                  <span className="text-blue-400 font-mono text-sm">{request.requestNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white">{request.employeeName}</p>
                    <p className="text-xs text-gray-500">{request.department}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300 capitalize">{request.requestType}</td>
                <td className="px-4 py-3 text-gray-300 capitalize">{request.assetCategory.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm capitalize ${
                    request.priority === 'high' ? 'text-red-400' :
                    request.priority === 'urgent' ? 'text-red-500' :
                    request.priority === 'normal' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {request.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {request.status === RequestStatus.PENDING && (
                      <>
                        <button className="text-green-400 hover:text-green-300 text-sm">Approve</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Reject</button>
                      </>
                    )}
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Maintenance Section Component
// ============================================================================

function MaintenanceSection({ requests }: { requests: MaintenanceRequest[] }) {
  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.OPEN: return 'bg-yellow-900 text-yellow-300';
      case MaintenanceStatus.IN_PROGRESS: return 'bg-blue-900 text-blue-300';
      case MaintenanceStatus.COMPLETED: return 'bg-green-900 text-green-300';
      case MaintenanceStatus.ON_HOLD: return 'bg-orange-900 text-orange-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Service Requests</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Request #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Issue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reported By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">
                  <span className="text-blue-400 font-mono text-sm">{request.requestNumber}</span>
                </td>
                <td className="px-4 py-3 text-gray-300 capitalize">{request.requestType.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm capitalize ${
                    request.priority === 'critical' ? 'text-red-500' :
                    request.priority === 'high' ? 'text-red-400' :
                    request.priority === 'normal' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {request.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-white text-sm truncate max-w-xs">{request.issueDescription}</p>
                </td>
                <td className="px-4 py-3 text-gray-300">{request.reportedByName}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// AMC Contracts Component
// ============================================================================

function AMCContractsSection({ contracts }: { contracts: AMCContract[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AMC Contracts</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-4 w-4" />
          Add Contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white font-medium">{contract.contractName}</h4>
                <p className="text-sm text-gray-400">{contract.contractNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                contract.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
              }`}>
                {contract.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Vendor:</span>
                <span className="text-gray-300">{contract.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-gray-300 capitalize">{contract.contractType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Value:</span>
                <span className="text-gray-300">₹{contract.contractValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Validity:</span>
                <span className="text-gray-300">{contract.startDate} - {contract.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Stock Audit Component
// ============================================================================

function StockAuditSection({ audits }: { audits: StockAudit[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Stock Audits</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-4 w-4" />
          New Audit
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Audit #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">
                  <span className="text-blue-400 font-mono text-sm">{audit.auditNumber}</span>
                </td>
                <td className="px-4 py-3 text-white">{audit.auditName}</td>
                <td className="px-4 py-3 text-gray-300 capitalize">{audit.auditType}</td>
                <td className="px-4 py-3 text-gray-300">{audit.auditDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(audit.itemsAudited / audit.totalItems) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {audit.itemsAudited}/{audit.totalItems}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    audit.status === 'completed' ? 'bg-green-900 text-green-300' :
                    audit.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {audit.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function AssetManagementPage() {
  const [mainTab, setMainTab] = useState<MainTab>('allocation');
  const [allocationSubTab, setAllocationSubTab] = useState<AllocationSubTab>('it_assets');
  const [maintenanceSubTab, setMaintenanceSubTab] = useState<MaintenanceSubTab>('service_requests');
  const [inventorySubTab, setInventorySubTab] = useState<InventorySubTab>('stock');
  const [reportsSubTab, setReportsSubTab] = useState<ReportsSubTab>('register');

  const [dashboardStats, setDashboardStats] = useState<AssetDashboardStats | null>(null);
  const [assets, setAssets] = useState<HRAsset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [amcContracts, setAMCContracts] = useState<AMCContract[]>([]);
  const [stockAudits, setStockAudits] = useState<StockAudit[]>([]);

  useEffect(() => {
    loadDashboard();
    loadAssets();
    loadAssetRequests();
    loadMaintenanceRequests();
    loadAMCContracts();
    loadStockAudits();
  }, []);

  const loadDashboard = async () => {
    try {
      const stats = await AssetManagementService.getDashboard();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadAssets = async (categoryType?: AssetCategoryType) => {
    try {
      const result = await AssetManagementService.getAssets({ categoryType });
      setAssets(result.data);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const loadAssetRequests = async () => {
    try {
      const result = await AssetManagementService.getAssetRequests();
      setAssetRequests(result.data);
    } catch (error) {
      console.error('Error loading asset requests:', error);
    }
  };

  const loadMaintenanceRequests = async () => {
    try {
      const result = await AssetManagementService.getMaintenanceRequests();
      setMaintenanceRequests(result.data);
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
    }
  };

  const loadAMCContracts = async () => {
    try {
      const contracts = await AssetManagementService.getAMCContracts();
      setAMCContracts(contracts);
    } catch (error) {
      console.error('Error loading AMC contracts:', error);
    }
  };

  const loadStockAudits = async () => {
    try {
      const result = await AssetManagementService.getStockAudits();
      setStockAudits(result.data);
    } catch (error) {
      console.error('Error loading stock audits:', error);
    }
  };

  const mainTabs = [
    { id: 'allocation' as MainTab, label: 'Asset Allocation', icon: Users },
    { id: 'maintenance' as MainTab, label: 'Maintenance & Repairs', icon: Wrench },
    { id: 'inventory' as MainTab, label: 'Asset Inventory', icon: Warehouse },
    { id: 'reports' as MainTab, label: 'Asset Reports', icon: BarChart3 },
  ];

  const allocationSubTabs = [
    { id: 'it_assets' as AllocationSubTab, label: 'IT Assets', icon: Monitor },
    { id: 'office_assets' as AllocationSubTab, label: 'Office Assets', icon: Building2 },
    { id: 'vehicles' as AllocationSubTab, label: 'Vehicles', icon: Car },
    { id: 'requests' as AllocationSubTab, label: 'Requests', icon: Clipboard },
    { id: 'transfer' as AllocationSubTab, label: 'Transfer', icon: ArrowLeftRight },
    { id: 'return' as AllocationSubTab, label: 'Return', icon: ArrowRight },
  ];

  const maintenanceSubTabs = [
    { id: 'service_requests' as MaintenanceSubTab, label: 'Service Requests', icon: Clipboard },
    { id: 'preventive' as MaintenanceSubTab, label: 'Preventive Maintenance', icon: Settings },
    { id: 'amc' as MaintenanceSubTab, label: 'AMC Management', icon: FileText },
    { id: 'history' as MaintenanceSubTab, label: 'Repair History', icon: Clock },
  ];

  const inventorySubTabs = [
    { id: 'stock' as InventorySubTab, label: 'Stock Management', icon: Package },
    { id: 'requests' as InventorySubTab, label: 'Stock Requests', icon: Clipboard },
    { id: 'allocation' as InventorySubTab, label: 'Stock Allocation', icon: Users },
    { id: 'audit' as InventorySubTab, label: 'Stock Audit', icon: Search },
  ];

  const reportsSubTabs = [
    { id: 'register' as ReportsSubTab, label: 'Asset Register', icon: FileText },
    { id: 'allocation_report' as ReportsSubTab, label: 'Allocation Report', icon: Users },
    { id: 'employee_assets' as ReportsSubTab, label: 'Employee Assets', icon: Users },
    { id: 'department_assets' as ReportsSubTab, label: 'Department Assets', icon: Building2 },
    { id: 'maintenance_costs' as ReportsSubTab, label: 'Maintenance Costs', icon: BarChart3 },
  ];

  const renderAllocationContent = () => {
    switch (allocationSubTab) {
      case 'it_assets':
        return <AssetList categoryType={AssetCategoryType.IT_ASSETS} assets={assets.filter(a => ['1', '2', '3'].includes(a.categoryId))} />;
      case 'office_assets':
        return <AssetList categoryType={AssetCategoryType.OFFICE_ASSETS} assets={assets.filter(a => ['4', '5'].includes(a.categoryId))} />;
      case 'vehicles':
        return <AssetList categoryType={AssetCategoryType.VEHICLES} assets={assets.filter(a => ['6', '7'].includes(a.categoryId))} />;
      case 'requests':
        return <AssetRequests requests={assetRequests} />;
      case 'transfer':
        return <div className="text-gray-400 text-center py-8">Asset Transfer section coming soon</div>;
      case 'return':
        return <div className="text-gray-400 text-center py-8">Asset Return section coming soon</div>;
      default:
        return null;
    }
  };

  const renderMaintenanceContent = () => {
    switch (maintenanceSubTab) {
      case 'service_requests':
        return <MaintenanceSection requests={maintenanceRequests} />;
      case 'preventive':
        return <div className="text-gray-400 text-center py-8">Preventive Maintenance section coming soon</div>;
      case 'amc':
        return <AMCContractsSection contracts={amcContracts} />;
      case 'history':
        return <div className="text-gray-400 text-center py-8">Repair History section coming soon</div>;
      default:
        return null;
    }
  };

  const renderInventoryContent = () => {
    switch (inventorySubTab) {
      case 'stock':
        return <div className="text-gray-400 text-center py-8">Stock Management section coming soon</div>;
      case 'requests':
        return <div className="text-gray-400 text-center py-8">Stock Requests section coming soon</div>;
      case 'allocation':
        return <div className="text-gray-400 text-center py-8">Stock Allocation section coming soon</div>;
      case 'audit':
        return <StockAuditSection audits={stockAudits} />;
      default:
        return null;
    }
  };

  const renderReportsContent = () => {
    return <div className="text-gray-400 text-center py-8">Reports section: {reportsSubTab.replace('_', ' ')} coming soon</div>;
  };

  const getCurrentSubTabs = () => {
    switch (mainTab) {
      case 'allocation': return allocationSubTabs;
      case 'maintenance': return maintenanceSubTabs;
      case 'inventory': return inventorySubTabs;
      case 'reports': return reportsSubTabs;
      default: return [];
    }
  };

  const getCurrentSubTab = () => {
    switch (mainTab) {
      case 'allocation': return allocationSubTab;
      case 'maintenance': return maintenanceSubTab;
      case 'inventory': return inventorySubTab;
      case 'reports': return reportsSubTab;
      default: return '';
    }
  };

  const setCurrentSubTab = (tab: string) => {
    switch (mainTab) {
      case 'allocation': setAllocationSubTab(tab as AllocationSubTab); break;
      case 'maintenance': setMaintenanceSubTab(tab as MaintenanceSubTab); break;
      case 'inventory': setInventorySubTab(tab as InventorySubTab); break;
      case 'reports': setReportsSubTab(tab as ReportsSubTab); break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Asset Management</h1>
            <p className="text-gray-400">Manage company assets, allocations, and maintenance</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
              <Search className="h-4 w-4" />
              Search
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Asset
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <AssetDashboard stats={dashboardStats} />

        {/* Main Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex gap-1">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  mainTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex flex-wrap gap-2">
          {getCurrentSubTabs().map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                getCurrentSubTab() === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {mainTab === 'allocation' && renderAllocationContent()}
          {mainTab === 'maintenance' && renderMaintenanceContent()}
          {mainTab === 'inventory' && renderInventoryContent()}
          {mainTab === 'reports' && renderReportsContent()}
        </div>
      </div>
    </div>
  );
}
