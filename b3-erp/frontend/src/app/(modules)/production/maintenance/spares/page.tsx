'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Edit,
  ShoppingCart,
  Eye
} from 'lucide-react';

interface SparePart {
  id: string;
  partNumber: string;
  partName: string;
  category: 'electrical' | 'mechanical' | 'hydraulic' | 'pneumatic' | 'electronics' | 'consumables';
  equipmentCompatibility: string[];
  quantityInStock: number;
  minimumStock: number;
  reorderPoint: number;
  unit: string;
  unitCost: number;
  location: string;
  supplier: string;
  leadTime: number; // days
  lastPurchaseDate: string;
  usageRate: number; // per month
  status: 'adequate' | 'low' | 'critical' | 'out-of-stock';
}

export default function SparePartsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  const spareParts: SparePart[] = [
    {
      id: '1',
      partNumber: 'SP-EL-2401',
      partName: 'Motor Bearing - 6205 2RS',
      category: 'mechanical',
      equipmentCompatibility: ['POLISH-01', 'WELD-ST-01', 'CNC-CUT-01'],
      quantityInStock: 5,
      minimumStock: 10,
      reorderPoint: 8,
      unit: 'pcs',
      unitCost: 850,
      location: 'Warehouse A - Shelf 12',
      supplier: 'SKF Bearings India',
      leadTime: 7,
      lastPurchaseDate: '2025-09-15',
      usageRate: 3,
      status: 'critical'
    },
    {
      id: '2',
      partNumber: 'SP-HY-1202',
      partName: 'Hydraulic Seal Kit - Press',
      category: 'hydraulic',
      equipmentCompatibility: ['PRESS-HYDRO-01'],
      quantityInStock: 2,
      minimumStock: 3,
      reorderPoint: 2,
      unit: 'set',
      unitCost: 4500,
      location: 'Warehouse A - Shelf 8',
      supplier: 'Parker Hannifin',
      leadTime: 14,
      lastPurchaseDate: '2025-10-01',
      usageRate: 0.5,
      status: 'low'
    },
    {
      id: '3',
      partNumber: 'SP-EL-3305',
      partName: 'Variable Frequency Drive - 5HP',
      category: 'electronics',
      equipmentCompatibility: ['PAINT-BOOTH-01', 'ASSY-LINE-01'],
      quantityInStock: 1,
      minimumStock: 2,
      reorderPoint: 1,
      unit: 'pcs',
      unitCost: 18500,
      location: 'Electronics Store - Cabinet 3',
      supplier: 'ABB India',
      leadTime: 21,
      lastPurchaseDate: '2025-08-20',
      usageRate: 0.2,
      status: 'low'
    },
    {
      id: '4',
      partNumber: 'SP-ME-4501',
      partName: 'CNC Cutting Blade Set',
      category: 'mechanical',
      equipmentCompatibility: ['CNC-CUT-01', 'LASER-CUT-02'],
      quantityInStock: 0,
      minimumStock: 5,
      reorderPoint: 3,
      unit: 'set',
      unitCost: 6200,
      location: 'Warehouse A - Shelf 15',
      supplier: 'Sandvik Coromant',
      leadTime: 10,
      lastPurchaseDate: '2025-09-28',
      usageRate: 2,
      status: 'out-of-stock'
    },
    {
      id: '5',
      partNumber: 'SP-CO-5602',
      partName: 'Air Filter Cartridge - Booth',
      category: 'consumables',
      equipmentCompatibility: ['PAINT-BOOTH-01'],
      quantityInStock: 15,
      minimumStock: 8,
      reorderPoint: 10,
      unit: 'pcs',
      unitCost: 1200,
      location: 'Warehouse B - Section 2',
      supplier: 'Donaldson Filters',
      leadTime: 5,
      lastPurchaseDate: '2025-10-10',
      usageRate: 4,
      status: 'adequate'
    },
    {
      id: '6',
      partNumber: 'SP-EL-6703',
      partName: 'Contactor - 25A 3-Phase',
      category: 'electrical',
      equipmentCompatibility: ['WELD-ST-01', 'POLISH-01', 'PRESS-HYDRO-01'],
      quantityInStock: 8,
      minimumStock: 6,
      reorderPoint: 4,
      unit: 'pcs',
      unitCost: 950,
      location: 'Electrical Store - Bin 5',
      supplier: 'Schneider Electric',
      leadTime: 7,
      lastPurchaseDate: '2025-09-25',
      usageRate: 1.5,
      status: 'adequate'
    },
    {
      id: '7',
      partNumber: 'SP-PN-7801',
      partName: 'Pneumatic Cylinder - 100mm',
      category: 'pneumatic',
      equipmentCompatibility: ['ASSY-LINE-01'],
      quantityInStock: 3,
      minimumStock: 4,
      reorderPoint: 3,
      unit: 'pcs',
      unitCost: 3200,
      location: 'Warehouse A - Shelf 6',
      supplier: 'Festo India',
      leadTime: 12,
      lastPurchaseDate: '2025-09-12',
      usageRate: 0.8,
      status: 'low'
    },
    {
      id: '8',
      partNumber: 'SP-CO-8904',
      partName: 'Hydraulic Oil - 68 Grade',
      category: 'consumables',
      equipmentCompatibility: ['PRESS-HYDRO-01'],
      quantityInStock: 120,
      minimumStock: 60,
      reorderPoint: 80,
      unit: 'liters',
      unitCost: 45,
      location: 'Fluid Storage - Tank 3',
      supplier: 'Shell Lubricants',
      leadTime: 3,
      lastPurchaseDate: '2025-10-18',
      usageRate: 25,
      status: 'adequate'
    },
    {
      id: '9',
      partNumber: 'SP-ME-9105',
      partName: 'Conveyor Chain Link',
      category: 'mechanical',
      equipmentCompatibility: ['ASSY-LINE-01'],
      quantityInStock: 4,
      minimumStock: 8,
      reorderPoint: 6,
      unit: 'meters',
      unitCost: 850,
      location: 'Warehouse A - Shelf 10',
      supplier: 'Renold India',
      leadTime: 14,
      lastPurchaseDate: '2025-09-20',
      usageRate: 2,
      status: 'critical'
    },
    {
      id: '10',
      partNumber: 'SP-EL-1006',
      partName: 'Temperature Sensor - Thermocouple',
      category: 'electronics',
      equipmentCompatibility: ['PAINT-BOOTH-01', 'WELD-ST-01'],
      quantityInStock: 6,
      minimumStock: 4,
      reorderPoint: 3,
      unit: 'pcs',
      unitCost: 750,
      location: 'Electronics Store - Cabinet 2',
      supplier: 'Omega Engineering',
      leadTime: 10,
      lastPurchaseDate: '2025-10-05',
      usageRate: 1,
      status: 'adequate'
    }
  ];

  const filteredParts = spareParts.filter(part => {
    const matchesSearch =
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.equipmentCompatibility.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || part.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || part.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalParts = spareParts.length;
  const criticalStock = spareParts.filter(p => p.status === 'critical' || p.status === 'out-of-stock').length;
  const lowStock = spareParts.filter(p => p.status === 'low').length;
  const totalValue = spareParts.reduce((sum, p) => sum + (p.quantityInStock * p.unitCost), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequate': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical': return '⚡';
      case 'mechanical': return '⚙️';
      case 'hydraulic': return '💧';
      case 'pneumatic': return '💨';
      case 'electronics': return '🔌';
      case 'consumables': return '📦';
      default: return '🔧';
    }
  };

  const handleViewPart = (part: SparePart) => {
    setSelectedPart(part);
  };

  const handleEditPart = (part: SparePart) => {
    alert(`Edit spare part ${part.partNumber} - Feature coming soon!`);
  };

  const handleOrderPart = (part: SparePart) => {
    const reorderQty = part.minimumStock - part.quantityInStock + 5;
    if (confirm(`Create purchase order for ${reorderQty} ${part.unit} of ${part.partName}?\n\nEstimated Cost: ₹${(reorderQty * part.unitCost).toLocaleString()}\nSupplier: ${part.supplier}\nLead Time: ${part.leadTime} days`)) {
      alert(`Purchase order created for ${part.partNumber}!`);
    }
  };

  const handleExport = () => {
    alert('Exporting spare parts inventory to Excel...');
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-2">
      {/* Header */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Spare Parts Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage maintenance spare parts and consumables</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Part
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{totalParts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical/Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{criticalStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts, equipment, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="mechanical">Mechanical</option>
              <option value="hydraulic">Hydraulic</option>
              <option value="pneumatic">Pneumatic</option>
              <option value="electronics">Electronics</option>
              <option value="consumables">Consumables</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="adequate">Adequate</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Min/Reorder</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{part.partNumber}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-gray-900">{part.partName}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getCategoryIcon(part.category)} {part.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      part.quantityInStock === 0 ? 'text-red-600' :
                      part.quantityInStock < part.reorderPoint ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      {part.quantityInStock} {part.unit}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {part.minimumStock} / {part.reorderPoint}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-900">₹{part.unitCost.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{(part.quantityInStock * part.unitCost).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-gray-600">{part.location}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm text-gray-900">{part.supplier}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{part.leadTime} days</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(part.status)}`}>
                      {part.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPart(part)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditPart(part)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Part"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {(part.status === 'low' || part.status === 'critical' || part.status === 'out-of-stock') && (
                        <button
                          onClick={() => handleOrderPart(part)}
                          className="text-green-600 hover:text-green-900"
                          title="Create Purchase Order"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Part Modal */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg p-3 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-gray-900">Spare Part Details - {selectedPart.partNumber}</h2>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Part Number</label>
                  <p className="text-gray-900 font-semibold">{selectedPart.partNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Part Name</label>
                  <p className="text-gray-900">{selectedPart.partName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-gray-900 capitalize">{getCategoryIcon(selectedPart.category)} {selectedPart.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPart.status)}`}>
                    {selectedPart.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity in Stock</label>
                  <p className="text-gray-900 font-semibold">{selectedPart.quantityInStock} {selectedPart.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Minimum Stock</label>
                  <p className="text-gray-900">{selectedPart.minimumStock} {selectedPart.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Reorder Point</label>
                  <p className="text-gray-900">{selectedPart.reorderPoint} {selectedPart.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Unit Cost</label>
                  <p className="text-gray-900 font-semibold">₹{selectedPart.unitCost.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Value</label>
                  <p className="text-gray-900 font-semibold">₹{(selectedPart.quantityInStock * selectedPart.unitCost).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedPart.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Supplier</label>
                  <p className="text-gray-900">{selectedPart.supplier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lead Time</label>
                  <p className="text-gray-900">{selectedPart.leadTime} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Purchase Date</label>
                  <p className="text-gray-900">{selectedPart.lastPurchaseDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Usage Rate</label>
                  <p className="text-gray-900">{selectedPart.usageRate} {selectedPart.unit}/month</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Compatible Equipment</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedPart.equipmentCompatibility.map((eq, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPart(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              {(selectedPart.status === 'low' || selectedPart.status === 'critical' || selectedPart.status === 'out-of-stock') && (
                <button
                  onClick={() => {
                    handleOrderPart(selectedPart);
                    setSelectedPart(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Purchase Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg p-3 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Add New Spare Part</h2>
            <p className="text-gray-600 mb-2">Form fields will be added here...</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('New spare part added to inventory!');
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
